const SUSPICIOUS_USER_AGENTS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /httpie/i,
  /postman/i,
  /insomnia/i,
  /scrapy/i,
  /phantomjs/i,
  /headless/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
];

const KNOWN_BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /facebook.*externalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /telegrambot/i,
  /whatsapp/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baiduspider/i,
];

export type BotDetectionResult = {
  isBot: boolean;
  isSuspicious: boolean;
  reason?: string;
  score: number;
};

export function detectBot(request: Request): BotDetectionResult {
  let score = 0;
  const reasons: string[] = [];
  const userAgent = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";

  if (!userAgent || userAgent.length < 10) {
    score += 40;
    reasons.push("missing_or_short_ua");
  }

  for (const pattern of KNOWN_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return {
        isBot: true,
        isSuspicious: false,
        reason: "known_bot",
        score: 100,
      };
    }
  }

  for (const pattern of SUSPICIOUS_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      score += 50;
      reasons.push("suspicious_ua");
      break;
    }
  }

  if (!accept.includes("text/html") && !accept.includes("application/json")) {
    score += 15;
    reasons.push("unusual_accept");
  }

  if (!acceptLanguage) {
    score += 10;
    reasons.push("missing_accept_language");
  }

  if (!acceptEncoding) {
    score += 10;
    reasons.push("missing_accept_encoding");
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!origin && !referer) {
    score += 20;
    reasons.push("missing_origin_referer");
  }

  return {
    isBot: false,
    isSuspicious: score >= 50,
    reason: reasons.length > 0 ? reasons.join(",") : undefined,
    score,
  };
}

export function generateFingerprint(request: Request): string {
  const parts = [
    request.headers.get("user-agent") || "",
    request.headers.get("accept-language") || "",
    request.headers.get("accept-encoding") || "",
  ];

  const str = parts.join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
