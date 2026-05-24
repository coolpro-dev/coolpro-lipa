const MIN_SUBMIT_TIME_MS = 3000; // 3 seconds minimum to fill form

export type HoneypotResult = {
  valid: boolean;
  reason?: string;
};

export function validateHoneypot(
  honeypotValue: string | undefined | null,
  formLoadedAt: number | undefined | null
): HoneypotResult {
  if (honeypotValue && honeypotValue.trim() !== "") {
    return { valid: false, reason: "honeypot_filled" };
  }

  if (formLoadedAt) {
    const submitTime = Date.now();
    const elapsed = submitTime - formLoadedAt;

    if (elapsed < MIN_SUBMIT_TIME_MS) {
      return { valid: false, reason: "submission_too_fast" };
    }
  }

  return { valid: true };
}

export function generateFormToken(): { token: string; timestamp: number } {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const token = Buffer.from(`${timestamp}:${random}`).toString("base64");
  return { token, timestamp };
}

export function parseFormToken(token: string | undefined): number | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [timestampStr] = decoded.split(":");
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) return null;

    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes max form age
    if (now - timestamp > maxAge) return null;

    return timestamp;
  } catch {
    return null;
  }
}
