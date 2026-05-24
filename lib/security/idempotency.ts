const processedKeys = new Map<string, { timestamp: number; result: unknown }>();
const KEY_TTL = 5 * 60 * 1000; // 5 minutes

function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of processedKeys) {
    if (now - entry.timestamp > KEY_TTL) {
      processedKeys.delete(key);
    }
  }
}

export async function checkIdempotencyKey(
  key: string | undefined
): Promise<{ isDuplicate: boolean; cachedResult?: unknown }> {
  if (!key) return { isDuplicate: false };

  if (processedKeys.size > 5000) cleanupExpired();

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const redisKey = `idempotency:${key}`;
      const res = await fetch(`${url}/get/${encodeURIComponent(redisKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { result: string | null };
        if (data.result) {
          return { isDuplicate: true, cachedResult: JSON.parse(data.result) };
        }
      }
    } catch {
      // Fall through to memory check
    }
  }

  const entry = processedKeys.get(key);
  if (entry && Date.now() - entry.timestamp < KEY_TTL) {
    return { isDuplicate: true, cachedResult: entry.result };
  }

  return { isDuplicate: false };
}

export async function storeIdempotencyResult(
  key: string | undefined,
  result: unknown
): Promise<void> {
  if (!key) return;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const redisKey = `idempotency:${key}`;
      const ttlSec = Math.ceil(KEY_TTL / 1000);
      await fetch(
        `${url}/setex/${encodeURIComponent(redisKey)}/${ttlSec}/${encodeURIComponent(JSON.stringify(result))}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      // Fall through to memory storage
    }
  }

  processedKeys.set(key, { timestamp: Date.now(), result });
}
