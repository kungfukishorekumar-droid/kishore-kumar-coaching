/**
 * In-process sliding-window rate limiting and duplicate suppression.
 *
 * ── Read this before relying on it ───────────────────────────────────────────
 * State lives in the memory of ONE Node process. That is a genuine limit, not an
 * oversight:
 *
 *   • Scale it to several instances and each gets its own allowance, so the
 *     effective limit multiplies by the instance count.
 *   • A restart or redeploy clears the state.
 *
 * It is the right tool here anyway. Hostinger runs this app as a single Node
 * process, the endpoint it protects is one form, and the alternative — a Redis
 * or Upstash dependency — would add an external service and a new failure mode
 * to a marketing site. If this ever runs multi-instance, replace the store
 * behind these two functions rather than the call sites.
 *
 * Both maps are bounded: without a cap, remembering every IP forever is itself a
 * denial-of-service vector, since an attacker rotating source addresses could
 * grow the map until the process runs out of memory.
 */

const MAX_TRACKED_KEYS = 10_000;

/** hit timestamps (ms) per key, oldest first */
const hits = new Map<string, number[]>();
/** first-seen timestamp (ms) per lead fingerprint */
const seen = new Map<string, number>();

/**
 * Drop expired entries, then — if still over budget — the oldest ones.
 *
 * Deleting the oldest is deliberate: entries are inserted in time order, so the
 * oldest are the least likely to be mid-window, and evicting them fails toward
 * allowing a request rather than wrongly blocking a real visitor.
 */
function prune<T>(map: Map<string, T>, isExpired: (value: T) => boolean): void {
  for (const [key, value] of map) {
    if (isExpired(value)) map.delete(key);
  }
  if (map.size <= MAX_TRACKED_KEYS) return;

  const overflow = map.size - MAX_TRACKED_KEYS;
  let removed = 0;
  for (const key of map.keys()) {
    map.delete(key);
    if (++removed >= overflow) break;
  }
}

export type RateVerdict = {
  allowed: boolean;
  /** Requests left in the current window, after counting this one. */
  remaining: number;
  /** Seconds until the window frees up. Sent as `Retry-After` on a 429. */
  retryAfterSeconds: number;
};

export function checkRate(key: string, max: number, windowMs: number): RateVerdict {
  const now = Date.now();
  prune(hits, (times) => times.length === 0 || now - times[times.length - 1] > windowMs);

  const window = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (window.length >= max) {
    const oldest = window[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  window.push(now);
  hits.set(key, window);

  return {
    allowed: true,
    remaining: Math.max(0, max - window.length),
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort duplicate suppression.
 *
 * Nothing downstream is idempotent: `public_leads` has no unique constraint, so
 * a double-tapped submit button or a client retry writes the same person twice
 * and the CRM shows two leads. Returning `true` here means "this exact lead was
 * already accepted moments ago" — the caller should answer success without
 * writing again, because from the visitor's point of view it did succeed.
 *
 * Best-effort by design: it will not catch a duplicate across a restart or a
 * second instance. The durable fix is a unique index on the CRM side; this just
 * stops the common accidental double-submit.
 */
export function isDuplicate(fingerprint: string, windowMs: number): boolean {
  const now = Date.now();
  prune(seen, (first) => now - first > windowMs);

  const first = seen.get(fingerprint);
  if (first !== undefined && now - first < windowMs) return true;

  seen.set(fingerprint, now);
  return false;
}

/** Test/maintenance hook — clears all counters. */
export function resetLimiter(): void {
  hits.clear();
  seen.clear();
}
