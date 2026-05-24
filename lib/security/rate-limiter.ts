type RateLimitEntry = {
  count: number;
  resetAt: number;
  blocked: boolean;
  blockUntil: number;
};

const memoryStore = new Map<string, RateLimitEntry>();

const LIMITS = {
  perMinute: { window: 60 * 1000, max: 3 },
  perHour: { window: 60 * 60 * 1000, max: 10 },
  perDay: { window: 24 * 60 * 60 * 1000, max: 30 },
} as const;

const SOFT_BAN_DURATION = 15 * 60 * 1000; // 15 minutes
const FAILURE_THRESHOLD = 5; // failures before soft ban

function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt && now > entry.blockUntil) {
      memoryStore.delete(key);
    }
  }
}

function memoryRateLimit(
  ip: string,
  window: keyof typeof LIMITS
): { allowed: boolean; remaining: number; blocked: boolean } {
  const now = Date.now();
  const { window: windowMs, max } = LIMITS[window];
  const key = `${ip}:${window}`;

  let entry = memoryStore.get(key);

  if (entry?.blocked && now < entry.blockUntil) {
    return { allowed: false, remaining: 0, blocked: true };
  }

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs, blocked: false, blockUntil: 0 };
    memoryStore.set(key, entry);
    return { allowed: true, remaining: max - 1, blocked: false };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, blocked: false };
  }

  entry.count += 1;
  return { allowed: true, remaining: max - entry.count, blocked: false };
}

async function upstashRateLimit(
  ip: string,
  window: keyof typeof LIMITS
): Promise<{ allowed: boolean; remaining: number; blocked: boolean } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const { window: windowMs, max } = LIMITS[window];
  const ttlSec = Math.ceil(windowMs / 1000);
  const key = `lead:${window}:${ip}`;
  const blockKey = `lead:blocked:${ip}`;

  try {
    const blockRes = await fetch(`${url}/get/${encodeURIComponent(blockKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (blockRes.ok) {
      const blockData = (await blockRes.json()) as { result: string | null };
      if (blockData.result) {
        return { allowed: false, remaining: 0, blocked: true };
      }
    }

    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!incrRes.ok) return null;

    const count = (await incrRes.json()) as { result: number };
    if (count.result === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    const allowed = count.result <= max;
    return { allowed, remaining: Math.max(0, max - count.result), blocked: false };
  } catch {
    return null;
  }
}

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  reason?: string;
  blocked?: boolean;
}> {
  if (memoryStore.size > 10000) cleanupExpired();

  for (const window of ["perMinute", "perHour", "perDay"] as const) {
    const upstashResult = await upstashRateLimit(ip, window);
    const result = upstashResult ?? memoryRateLimit(ip, window);

    if (result.blocked) {
      return { allowed: false, reason: "temporarily_blocked", blocked: true };
    }
    if (!result.allowed) {
      return { allowed: false, reason: `rate_limit_${window}` };
    }
  }

  return { allowed: true };
}

export async function recordFailure(ip: string): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const failKey = `lead:fail:${ip}`;

  if (url && token) {
    try {
      const incrRes = await fetch(`${url}/incr/${encodeURIComponent(failKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (incrRes.ok) {
        const count = (await incrRes.json()) as { result: number };
        if (count.result === 1) {
          await fetch(`${url}/expire/${encodeURIComponent(failKey)}/3600`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        if (count.result >= FAILURE_THRESHOLD) {
          const blockKey = `lead:blocked:${ip}`;
          const blockTtl = Math.ceil(SOFT_BAN_DURATION / 1000);
          await fetch(
            `${url}/setex/${encodeURIComponent(blockKey)}/${blockTtl}/1`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch {
      // Fallback to memory
    }
  }

  const memKey = `${ip}:failures`;
  const entry = memoryStore.get(memKey);
  const now = Date.now();

  if (!entry || now > entry.resetAt) {
    memoryStore.set(memKey, {
      count: 1,
      resetAt: now + 60 * 60 * 1000,
      blocked: false,
      blockUntil: 0,
    });
  } else {
    entry.count += 1;
    if (entry.count >= FAILURE_THRESHOLD) {
      entry.blocked = true;
      entry.blockUntil = now + SOFT_BAN_DURATION;
    }
  }
}

export function getRateLimitHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}
