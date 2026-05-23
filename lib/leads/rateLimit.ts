const memoryStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

/** In-memory fallback when Upstash is not configured (single serverless instance). */
function memoryRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return memoryRateLimit(ip);
  }

  const key = `lead:${ip}`;
  const incrRes = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!incrRes.ok) return memoryRateLimit(ip);

  const count = (await incrRes.json()) as { result: number };
  if (count.result === 1) {
    await fetch(`${url}/expire/${encodeURIComponent(key)}/3600`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return count.result <= MAX_REQUESTS;
}
