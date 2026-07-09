/**
 * In-memory rate limiter for API routes.
 *
 * ⚠️ Resets on process restart and does NOT share state across multiple
 * serverless instances (e.g., Vercel multi-region). For production at scale,
 * swap the store for Upstash Redis using the same interface.
 *
 * Default: 5 requests per 60 seconds per IP.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/** Prune expired entries — called probabilistically to avoid O(n) every request. */
function maybePrune() {
  if (Math.random() > 0.02) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const { limit = 5, windowMs = 60_000 } = options;
  const now = Date.now();

  maybePrune();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    retryAfterMs: 0,
  };
}

/** Extract a best-effort client IP from the request headers. */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
