/**
 * POST /api/lead/  — the site's only write endpoint.
 *
 * ⚠️ Call it WITH the trailing slash. `next.config.mjs` sets
 * `trailingSlash: true`, which applies to route handlers too: POST /api/lead
 * answers 308 to /api/lead/. Browsers do preserve the method across a 308, so
 * the slashless form works, but it costs an extra round trip on every
 * submission. `src/lib/lead-client.ts` posts to the slashed form.
 *
 * ── Why this route exists ────────────────────────────────────────────────────
 * Lead capture used to run browser → Supabase directly, with a publishable key
 * shipped in the client bundle. Anyone who opened DevTools could write to the
 * CRM queue, and the site could not verify a Turnstile token because it had no
 * server to verify it on. That design was inherited from a period when the site
 * was a static export; it now runs as a real Next.js app on Hostinger's Node
 * runtime, so a server-side path is available and this is it.
 *
 * The browser now holds no Supabase credential at all.
 *
 * ── Order of checks, and why ─────────────────────────────────────────────────
 * Cheapest and most abusable first, so an attacker cannot make us do expensive
 * work: method → content-type → origin → rate limit → body size → parse →
 * honeypot → validate → Turnstile (a network call) → insert.
 */

import { allowedOrigins, limits } from "@/lib/server/env";
import {
  clientIp,
  fail,
  json,
  originAllowed,
  publicOrigin,
  readJsonBody,
} from "@/lib/server/http";
import { describeLead, log, newRequestId } from "@/lib/server/log";
import { checkRate, isDuplicate } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { insertLead } from "@/lib/server/leads";
import { leadFingerprint, validateLead } from "@/lib/server/validate";

/**
 * Node runtime, never prerendered.
 *
 * `force-dynamic` matters: without it Next would try to evaluate this at build
 * time. `nodejs` matters because the rate limiter keeps state in process memory,
 * which only means anything on a long-lived runtime.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Which site a lead came from. Server-set — never read from the request. */
const LEAD_SOURCE = "kishorekumarcoach.com";

/** 429 with a Retry-After the client can actually act on. */
function tooManyRequests(
  requestId: string,
  ip: string,
  retryAfterSeconds: number,
  tier: "burst" | "submit"
): Response {
  log("warn", "lead.rate_limited", { requestId, ip, tier });
  return json(
    {
      ok: false,
      error: "rate-limited",
      message:
        "That's a lot of submissions. Please try again shortly, or message on WhatsApp.",
    },
    {
      status: 429,
      requestId,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

export async function POST(req: Request): Promise<Response> {
  const requestId = newRequestId();
  const started = Date.now();
  const ip = clientIp(req);

  // Reject anything that isn't a JSON POST. A form-encoded POST from another
  // origin is the shape a classic CSRF takes, and requiring application/json
  // means the browser must preflight a cross-origin attempt.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return fail(requestId, 415, "unsupported-media-type", "Send JSON.", { ip });
  }

  if (!originAllowed(req, allowedOrigins())) {
    return fail(requestId, 403, "bad-origin", "This form can't be submitted from here.", {
      ip,
      origin: req.headers.get("origin") ?? "none",
    });
  }

  // Tier 1 — every request. Generous, so a visitor correcting a typo is never
  // locked out; tight enough that nobody hammers the endpoint.
  const burst = checkRate(`burst:${ip}`, limits.burstMax(), limits.rateWindowMs());
  if (!burst.allowed) {
    return tooManyRequests(requestId, ip, burst.retryAfterSeconds, "burst");
  }

  const body = await readJsonBody(req, limits.maxBodyBytes());
  if (!body.ok) {
    const status = body.code === "too-large" ? 413 : 400;
    return fail(requestId, status, body.code, "That submission couldn't be read.", { ip });
  }

  /**
   * Honeypot. `company` is a hidden field no human ever sees or fills; a bot
   * that fills every input trips it. Answer 200 rather than an error — telling a
   * bot precisely which check caught it is how it learns to avoid the check.
   * Nothing is written.
   */
  if (typeof body.value.company === "string" && body.value.company.trim() !== "") {
    log("warn", "lead.honeypot", { requestId, ip });
    return json({ ok: true, forwarded: true }, { requestId });
  }

  // The visitor's own origin plus every configured one, so a `landingPage`
  // recorded from the www host (or from a local dev session) is still kept.
  const siteOrigins = Array.from(
    new Set([publicOrigin(req), ...allowedOrigins()].filter(Boolean))
  );

  const validation = validateLead(body.value, { source: LEAD_SOURCE, siteOrigins });
  if (!validation.ok) {
    return fail(
      requestId,
      422,
      "invalid",
      "Please check your name and contact details.",
      { ip, fields: validation.errors.join(","), ...describeLead(body.value) }
    );
  }

  const lead = validation.lead;

  // Bot check last among the validations — it is the only one that costs a
  // network round trip, so everything cheap gets to reject first.
  const turnstile = await verifyTurnstile(body.value.turnstileToken, ip);
  if (!turnstile.ok) {
    if (turnstile.reason === "unavailable") {
      // Cloudflare is down. Failing the visitor for someone else's outage loses
      // a real lead; the rate limiter and honeypot still apply. Logged loudly
      // because a sustained run of these is worth noticing.
      log("error", "lead.turnstile_unavailable_allowing", { requestId, ip });
    } else {
      return fail(requestId, 403, "bot-check-failed", "Please complete the bot check and try again.", {
        ip,
        reason: turnstile.reason,
      });
    }
  }

  /**
   * Duplicate suppression. Nothing downstream is idempotent — `public_leads` has
   * no unique constraint — so a double-tapped button or a client retry would
   * otherwise create two identical leads. Report success: from the visitor's
   * side it did succeed, and the first copy is already queued.
   */
  if (isDuplicate(leadFingerprint(lead), limits.dedupeWindowMs())) {
    log("info", "lead.duplicate_suppressed", { requestId, ip });
    return json({ ok: true, forwarded: true, duplicate: true }, { requestId });
  }

  // Tier 2 — only genuine, non-duplicate leads reach here, so this budget caps
  // how many rows one address can actually create rather than how many times it
  // may fumble the form.
  const submit = checkRate(`submit:${ip}`, limits.submitMax(), limits.rateWindowMs());
  if (!submit.allowed) {
    return tooManyRequests(requestId, ip, submit.retryAfterSeconds, "submit");
  }

  const stored = await insertLead(lead, requestId);

  if (!stored.ok) {
    // 502, not 500: this server worked; the upstream store did not. The client
    // shows its WhatsApp fallback on any non-2xx, so the lead still has a route
    // to Kishore.
    return fail(
      requestId,
      502,
      "storage-unavailable",
      "We couldn't save that just now — please send it on WhatsApp.",
      { ip, reason: stored.reason, ms: Date.now() - started }
    );
  }

  log("info", "lead.accepted", {
    requestId,
    ip,
    campaign: lead.campaign,
    leadType: lead.leadType,
    turnstileEnforced: turnstile.ok ? turnstile.enforced : false,
    ms: Date.now() - started,
  });

  return json({ ok: true, forwarded: true }, { requestId });
}

/**
 * Explicit 405s for everything else.
 *
 * Without these Next answers its own 405 without an `Allow` header, and a GET
 * to this path is a common probe worth logging.
 */
function methodNotAllowed(): Response {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
