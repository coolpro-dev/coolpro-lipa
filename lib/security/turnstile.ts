type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = {
  success: boolean;
  error?: string;
};

export async function verifyTurnstile(
  token: string | undefined,
  ip: string
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === "production";
  const bypassInDev = process.env.TURNSTILE_BYPASS_DEV === "true";

  if (!secret) {
    if (isProduction) {
      return { success: false, error: "captcha_not_configured" };
    }
    if (bypassInDev) {
      return { success: true };
    }
    return { success: false, error: "captcha_not_configured" };
  }

  if (!token || token.trim() === "") {
    return { success: false, error: "captcha_missing" };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: ip,
    });

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      return { success: false, error: "captcha_service_error" };
    }

    const data = (await res.json()) as TurnstileResponse;

    if (data.success !== true) {
      const errorCode = data["error-codes"]?.[0] || "captcha_failed";
      return { success: false, error: errorCode };
    }

    return { success: true };
  } catch {
    return { success: false, error: "captcha_verification_error" };
  }
}
