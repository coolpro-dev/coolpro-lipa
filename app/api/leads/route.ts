import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/leads/rateLimit";
import { normalizeMobile, sanitizeText } from "@/lib/leads/sanitize";
import { verifyTurnstile } from "@/lib/leads/turnstile";
import { leadSubmissionSchema } from "@/lib/leads/validation";
import { verifyCalculationIntegrity } from "@/lib/leads/verifyCalculation";
import { createServiceClient } from "@/lib/supabase/server";
import type { AirconLoadInputs } from "@/lib/hvac-engine/types";

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (!(await checkRateLimit(ip))) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const json = await request.json();
    const parsed = leadSubmissionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Captcha verification failed." }, { status: 403 });
    }

    const inputs = data.calculationInputs as AirconLoadInputs;
    if (
      !verifyCalculationIntegrity(inputs, {
        totalBtu: data.calculationResult.totalBtu,
        totalHp: data.calculationResult.totalHp,
      })
    ) {
      return NextResponse.json({ error: "Calculation mismatch. Please recalculate." }, { status: 400 });
    }

    const supabase = createServiceClient();
    if (!supabase) {
      if (process.env.NODE_ENV === "development") {
        console.info("[leads] Dev mode — no Supabase:", data.name, data.mobile);
        return NextResponse.json({ ok: true, id: "dev-mode" }, { status: 201 });
      }
      return NextResponse.json({ error: "Lead storage not configured." }, { status: 503 });
    }

    const row = {
      name: sanitizeText(data.name, 120),
      mobile: normalizeMobile(data.mobile),
      email: data.email ? sanitizeText(data.email, 200) : null,
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
      status: "new" as const,
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("[leads] insert error", error);
      return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: inserted.id }, { status: 201 });
  } catch (err) {
    console.error("[leads] unexpected", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
