/**
 * Cloudflare Turnstile verification.
 *
 * A Turnstile widget on its own is theatre — a bot skips the page and calls the
 * API directly. The token only means anything once a server exchanges it with
 * Cloudflare, which is what this does, and which is why the widget was doing
 * nothing useful while the site had no server to do it on.
 */

import { turnstileSecret } from "./env";
import { log } from "./log";

export type TurnstileOutcome =
  /** Verified human, or verification is not configured (see `enforced`). */
  | { ok: true; enforced: boolean }
  | { ok: false; reason: "missing-token" | "failed" | "unavailable" };

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 8000;

/**
 * Exchange a token with Cloudflare.
 *
 * ── Failure policy ──────────────────────────────────────────────────────────
 * When Turnstile IS configured, an unverifiable token is rejected — that is the
 * whole point of turning it on. But a Cloudflare outage is reported distinctly
 * (`unavailable`) so the caller can decide, rather than silently reading as
 * "this person is a bot".
 *
 * When no secret is set the function returns `ok` with `enforced: false`. The
 * endpoint stays open, exactly as it is today, and the rate limiter and
 * honeypot remain the only bot defences. Configure TURNSTILE_SECRET_KEY to
 * close that.
 */
export async function verifyTurnstile(
  token: unknown,
  remoteIp: string
): Promise<TurnstileOutcome> {
  const secret = turnstileSecret();
  if (!secret) return { ok: true, enforced: false };

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp && remoteIp !== "unknown") body.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // A non-200 or a non-JSON answer means Cloudflare could not tell us
    // anything — treat that as an outage, not as a failed challenge. Calling
    // res.json() without this check is how an HTML error page becomes an
    // unhandled exception and a 500.
    if (!res.ok) return { ok: false, reason: "unavailable" };

    const data: unknown = await res.json();
    const success =
      typeof data === "object" && data !== null && (data as { success?: unknown }).success === true;

    return success ? { ok: true, enforced: true } : { ok: false, reason: "failed" };
  } catch (err) {
    log("error", "turnstile.unavailable", {
      message: err instanceof Error ? err.message : "unknown",
    });
    return { ok: false, reason: "unavailable" };
  }
}
