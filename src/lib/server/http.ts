/**
 * Request/response helpers shared by the API routes.
 *
 * The theme here is treating every part of an incoming request as untrusted —
 * including the parts that look like infrastructure (headers, Content-Length,
 * Origin), because all of them are attacker-controlled.
 */

import { log, type LogFields } from "./log";

/** JSON response with no-store caching and the request id echoed back. */
export function json(
  body: unknown,
  init: { status?: number; requestId: string; headers?: Record<string, string> }
): Response {
  return Response.json(body, {
    status: init.status ?? 200,
    headers: {
      // A lead response is per-request and must never be held by a CDN or a
      // shared proxy — caching one visitor's confirmation for the next is both
      // wrong and a privacy leak.
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "x-request-id": init.requestId,
      ...init.headers,
    },
  });
}

/** A client-visible error: safe message out, full detail to the log only. */
export function fail(
  requestId: string,
  status: number,
  code: string,
  publicMessage: string,
  logFields: LogFields = {}
): Response {
  log(status >= 500 ? "error" : "warn", "request.rejected", {
    requestId,
    status,
    code,
    ...logFields,
  });

  // The body names a stable machine code and a message safe to show a visitor.
  // It never carries stack traces, database errors or upstream responses —
  // those tell an attacker how the system is built and can leak table names.
  return json({ ok: false, error: code, message: publicMessage }, { status, requestId });
}

/**
 * Best-available client IP.
 *
 * `x-forwarded-for` is a client-settable header. Behind a proxy that appends to
 * it, the LAST entry is the one the proxy observed and the earlier ones can be
 * forged; with no proxy the whole header is forgeable. Hostinger fronts the Node
 * process, so we take the rightmost entry, which an attacker cannot control.
 * Rate limiting is the only consumer, so the failure mode of getting this wrong
 * is a shared bucket, not a security bypass.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Cross-site request check.
 *
 * The form is same-origin, so a submission whose Origin is another site is
 * either a cross-site forgery attempt or a misconfiguration. There is no session
 * cookie here for a classic CSRF to abuse, but the check still keeps other
 * people's pages from posting into this queue in a visitor's name.
 *
 * A MISSING Origin is allowed. Browsers omit it on some same-origin form posts,
 * and rejecting those would break real submissions to stop an attack that
 * requires a browser to send the header in the first place.
 */
export function originAllowed(req: Request, allowed: string[]): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  if (allowed.includes(origin)) return true;

  // Same-origin as the request actually arrived — covers preview deployments
  // and localhost without needing them configured.
  try {
    const self = new URL(req.url).origin;
    if (origin === self) return true;
  } catch {
    /* unparseable request URL — fall through to reject */
  }

  return false;
}

/**
 * The origin a visitor actually typed into their browser.
 *
 * `new URL(req.url).origin` is NOT it. Next normalises the request URL to its
 * internal listener, so it reports `http://localhost:3999` even when the Host
 * header says otherwise — and behind Hostinger's proxy it would report localhost
 * while the real site is https://kishorekumarcoach.com. Anything comparing a
 * visitor-supplied URL against `req.url` therefore never matches in production.
 *
 * Forwarded headers are attacker-controlled, so this value is only ever used for
 * comparisons where a wrong answer is harmless (dropping an optional
 * `landingPage`), never for authorization.
 */
export function publicOrigin(req: Request): string {
  const proto = (req.headers.get("x-forwarded-proto") ?? "").split(",")[0].trim();
  const host =
    (req.headers.get("x-forwarded-host") ?? "").split(",")[0].trim() ||
    (req.headers.get("host") ?? "").trim();

  if (host) {
    // Assume https unless a proxy explicitly said otherwise — production is
    // HTTPS-only (HSTS is preloaded), so http is the local-dev case.
    const scheme = proto || (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
    try {
      return new URL(`${scheme}://${host}`).origin;
    } catch {
      /* malformed Host header — fall through */
    }
  }

  try {
    return new URL(req.url).origin;
  } catch {
    return "";
  }
}

export type BodyResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; code: "too-large" | "bad-json" | "bad-shape" };

/**
 * Read and parse a JSON body with a hard size cap.
 *
 * The cap is checked twice on purpose. Content-Length is a claim by the client,
 * so it is a cheap early reject but not a guarantee; the second check measures
 * what actually arrived. Parsing is where an unbounded body turns into unbounded
 * memory, so both checks come before JSON.parse.
 */
export async function readJsonBody(req: Request, maxBytes: number): Promise<BodyResult> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, code: "too-large" };
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, code: "bad-json" };
  }

  // Byte length, not string length — a body of multi-byte characters is bigger
  // than its character count suggests.
  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    return { ok: false, code: "too-large" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, code: "bad-json" };
  }

  // A JSON body may legally be a string, a number, null or an array. Indexing
  // any of those for a field would throw and turn a bad request into a 500.
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, code: "bad-shape" };
  }

  return { ok: true, value: parsed as Record<string, unknown> };
}
