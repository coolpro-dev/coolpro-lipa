const HTML_TAG = /<[^>]*>/g;

export function stripHtml(value: string): string {
  return value.replace(HTML_TAG, "").trim();
}

/** Normalize Philippine mobile to +63XXXXXXXXXX when possible. */
export function normalizeMobile(raw: string): string {
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
  return raw.trim();
}

export function sanitizeText(value: string, maxLen: number): string {
  return stripHtml(value).slice(0, maxLen);
}
