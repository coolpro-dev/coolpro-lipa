const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.org",
  "guerrillamail.net",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "throwaway.email",
  "fakeinbox.com",
  "trashmail.com",
  "trashmail.net",
  "discard.email",
  "mailnesia.com",
  "getnada.com",
  "yopmail.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamail.info",
  "pokemail.net",
  "spam4.me",
  "maildrop.cc",
  "mailsac.com",
  "burnermail.io",
  "mytemp.email",
  "tempail.com",
  "10minmail.com",
  "mohmal.com",
  "email-fake.com",
  "emailondeck.com",
  "fakemailgenerator.com",
  "getairmail.com",
  "mintemail.com",
  "mt2015.com",
  "nada.email",
  "tempinbox.com",
  "tmpmail.org",
  "tmpmail.net",
  "spamgourmet.com",
  "mailcatch.com",
  "anonbox.net",
  "dispostable.com",
  "emkei.cz",
  "hide.biz.st",
  "jetable.org",
  "meltmail.com",
  "spamex.com",
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];
  return DISPOSABLE_DOMAINS.has(domain);
}

export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";

  let normalized = email.toLowerCase().trim();

  const parts = normalized.split("@");
  if (parts.length !== 2) return normalized;

  const [localPart, domain] = parts;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const cleanLocal = localPart.split("+")[0].replace(/\./g, "");
    normalized = `${cleanLocal}@gmail.com`;
  }

  return normalized;
}
