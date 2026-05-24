import { NextResponse } from "next/server";
import { detectBot, generateFingerprint } from "@/lib/security/bot-detection";
import { isDisposableEmail, normalizeEmail } from "@/lib/security/email-validation";
import { validateHoneypot, parseFormToken } from "@/lib/security/honeypot";
import { checkIdempotencyKey, storeIdempotencyResult } from "@/lib/security/idempotency";
import { logger } from "@/lib/security/logger";
import { checkRateLimit, recordFailure } from "@/lib/security/rate-limiter";
import { sanitizeText, normalizeMobile, sanitizeForLog } from "@/lib/security/sanitize";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { parseAndValidate, validateRequestSize } from "@/lib/security/validation";
import { verifyCalculationIntegrity } from "@/lib/leads/verifyCalculation";
import { createServiceClient } from "@/lib/supabase/server";
import type { AirconLoadInputs } from "@/lib/hvac-engine/types";

const GENERIC_ERROR = "Request failed. Please try again.";

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function errorResponse(
  message: string,
  status: number,
  ip: string,
  reason: string,
  startTime: number
): NextResponse {
  logger.request({
    ip,
    endpoint: "/api/leads",
    method: "POST",
    statusCode: status,
    duration: Date.now() - startTime,
    reason,
  });

  const publicMessage = process.env.NODE_ENV === "production" ? GENERIC_ERROR : message;

  return NextResponse.json({ error: publicMessage }, { status });
}

export async function POST(request: Request) {
  const startTime = Date.now();
  const ip = clientIp(request);
  const fingerprint = generateFingerprint(request);

  try {
    const contentLength = request.headers.get("content-length");
    if (!validateRequestSize(contentLength)) {
      return errorResponse("Payload too large", 413, ip, "payload_too_large", startTime);
    }

    const botResult = detectBot(request);
    if (botResult.isBot) {
      logger.security("bot_blocked", { ip, fingerprint, reason: botResult.reason });
      return errorResponse("Request blocked", 403, ip, "bot_detected", startTime);
    }

    if (botResult.isSuspicious) {
      logger.security("suspicious_request", {
        ip,
        fingerprint,
        score: botResult.score,
        reason: botResult.reason,
      });
    }

    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      logger.security("rate_limited", { ip, reason: rateLimitResult.reason });
      return errorResponse(
        "Too many requests. Try again later.",
        429,
        ip,
        rateLimitResult.reason || "rate_limited",
        startTime
      );
    }

    let json: unknown;
    try {
      const text = await request.text();
      if (text.length > 50 * 1024) {
        return errorResponse("Payload too large", 413, ip, "payload_too_large", startTime);
      }
      json = JSON.parse(text);
    } catch {
      await recordFailure(ip);
      return errorResponse("Invalid JSON", 400, ip, "invalid_json", startTime);
    }

    const parsed = parseAndValidate(json);
    if (!parsed.success) {
      await recordFailure(ip);
      return errorResponse(parsed.error, 400, ip, "validation_failed", startTime);
    }

    const data = parsed.data;

    const idempotencyCheck = await checkIdempotencyKey(data._ik);
    if (idempotencyCheck.isDuplicate) {
      logger.info("duplicate_request", { ip, idempotencyKey: data._ik });
      return NextResponse.json(idempotencyCheck.cachedResult, { status: 201 });
    }

    const honeypotResult = validateHoneypot(data._hp, parseFormToken(data._ft));
    if (!honeypotResult.valid) {
      logger.security("honeypot_triggered", { ip, reason: honeypotResult.reason });
      await recordFailure(ip);
      return errorResponse("Request blocked", 403, ip, honeypotResult.reason || "honeypot", startTime);
    }

    const turnstileResult = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileResult.success) {
      logger.security("turnstile_failed", { ip, error: turnstileResult.error });
      await recordFailure(ip);
      return errorResponse(
        "Captcha verification failed.",
        403,
        ip,
        turnstileResult.error || "turnstile_failed",
        startTime
      );
    }

    if (data.email) {
      const normalizedEmail = normalizeEmail(data.email);
      if (isDisposableEmail(normalizedEmail)) {
        logger.security("disposable_email", { ip, domain: normalizedEmail.split("@")[1] });
        await recordFailure(ip);
        return errorResponse(
          "Please use a valid email address.",
          400,
          ip,
          "disposable_email",
          startTime
        );
      }
    }

    const inputs = data.calculationInputs as AirconLoadInputs;
    if (
      !verifyCalculationIntegrity(inputs, {
        totalBtu: data.calculationResult.totalBtu,
        totalHp: data.calculationResult.totalHp,
      })
    ) {
      logger.security("calculation_mismatch", {
        ip,
        claimedBtu: data.calculationResult.totalBtu,
        claimedHp: data.calculationResult.totalHp,
      });
      await recordFailure(ip);
      return errorResponse(
        "Calculation mismatch. Please recalculate.",
        400,
        ip,
        "calculation_mismatch",
        startTime
      );
    }

    const supabase = createServiceClient();
    if (!supabase) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("dev_mode_lead", {
          name: sanitizeForLog(data.name),
          mobile: sanitizeForLog(data.mobile),
        });
        const result = { ok: true, id: "dev-mode" };
        await storeIdempotencyResult(data._ik, result);
        return NextResponse.json(result, { status: 201 });
      }
      return errorResponse("Service unavailable", 503, ip, "no_supabase", startTime);
    }

    const row = {
      name: sanitizeText(data.name, 120),
      mobile: normalizeMobile(data.mobile),
      email: data.email ? normalizeEmail(sanitizeText(data.email, 200)) : null,
      address: sanitizeText(data.address, 500),
      preferred_schedule: data.preferredSchedule
        ? sanitizeText(data.preferredSchedule, 200)
        : null,
      notes: data.notes ? sanitizeText(data.notes, 2000) : null,
      existing_ac_unit: data.existingAcUnit
        ? sanitizeText(data.existingAcUnit, 200)
        : null,
      room_length_m: data.roomLengthM,
      room_width_m: data.roomWidthM,
      ceiling_height_m: data.ceilingHeightM,
      room_type: data.roomType,
      insulation: data.insulation,
      sun_exposure: data.sunExposure,
      window_count: data.windowCount,
      floor_level: data.floorLevel ?? null,
      window_orientation: data.windowOrientation ?? null,
      calculation_inputs: data.calculationInputs,
      calculation_result: data.calculationResult,
      source_page: data.sourcePage,
      device_type: data.deviceType ?? null,
      user_agent: data.userAgent ? sanitizeText(data.userAgent, 500) : null,
      client_ip: ip,
      fingerprint,
      status: "new" as const,
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      logger.error("supabase_insert_error", {
        code: error.code,
        message: sanitizeForLog(error.message),
      });
      return errorResponse("Failed to save inquiry", 500, ip, "db_error", startTime);
    }

    const result = { ok: true, id: inserted.id };
    await storeIdempotencyResult(data._ik, result);

    logger.request({
      ip,
      endpoint: "/api/leads",
      method: "POST",
      statusCode: 201,
      duration: Date.now() - startTime,
      fingerprint,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    logger.error("unexpected_error", {
      ip,
      error: sanitizeForLog(errorMessage),
    });
    return errorResponse("Server error", 500, ip, "unexpected_error", startTime);
  }
}
