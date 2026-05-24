const HTML_TAG = /<[^>]*>/g;
const SCRIPT_CONTENT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLERS = /\s*on\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URLS = /javascript\s*:/gi;
const DATA_URLS = /data\s*:/gi;
const EXPRESSION_EVAL = /expression\s*\(/gi;
const DANGEROUS_TAGS = /<\s*(iframe|object|embed|form|input|button|meta|link|base|applet)\b[^>]*>/gi;

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const NULL_BYTES = /\0/g;
const UNICODE_OVERRIDE = /[\u202A-\u202E\u2066-\u2069]/g;

export function sanitizeText(value: string, maxLen: number): string {
  if (typeof value !== "string") return "";

  let sanitized = value
    .replace(NULL_BYTES, "")
    .replace(CONTROL_CHARS, "")
    .replace(UNICODE_OVERRIDE, "")
    .replace(SCRIPT_CONTENT, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JAVASCRIPT_URLS, "")
    .replace(DATA_URLS, "")
    .replace(EXPRESSION_EVAL, "")
    .replace(DANGEROUS_TAGS, "")
    .replace(HTML_TAG, "")
    .trim();

  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return sanitized.slice(0, maxLen);
}

export function sanitizeForLog(value: string, maxLen: number = 200): string {
  if (typeof value !== "string") return "";
  return value
    .replace(NULL_BYTES, "")
    .replace(CONTROL_CHARS, " ")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function normalizeMobile(raw: string): string {
  if (typeof raw !== "string") return "";

  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("63") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith("09") && digits.length === 11) {
    return `+63${digits.slice(1)}`;
  }
  if (digits.startsWith("9") && digits.length === 10) {
    return `+63${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `+63${digits.slice(1)}`;
  }

  return raw.trim().slice(0, 20);
}

export function sanitizeJson(obj: unknown, maxDepth: number = 5): unknown {
  if (maxDepth <= 0) return null;

  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeText(obj, 10000);
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.slice(0, 100).map((item) => sanitizeJson(item, maxDepth - 1));
  }

  if (typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    const keys = Object.keys(obj).slice(0, 50);
    for (const key of keys) {
      const sanitizedKey = sanitizeText(key, 100);
      sanitized[sanitizedKey] = sanitizeJson(
        (obj as Record<string, unknown>)[key],
        maxDepth - 1
      );
    }
    return sanitized;
  }

  return null;
}
