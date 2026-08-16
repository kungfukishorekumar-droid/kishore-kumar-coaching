/**
 * GET /api/health/  — readiness probe.
 *
 * Answers one question the audit could not: is this deployment actually
 * configured to capture leads? The lead path fails silently by design (the form
 * always offers a WhatsApp fallback), so without a probe a misconfigured deploy
 * looks identical to a working one from the outside.
 *
 * ── What it deliberately does NOT do ─────────────────────────────────────────
 * It reports booleans and key KINDS, never values, never partial values, never
 * lengths. A health endpoint is unauthenticated and indexable, so anything it
 * prints is public. It also does not call Supabase: a probe that writes is a
 * probe that can be used to write, and one that reads would need a credential
 * with read access, which this server deliberately does not want.
 *
 * `degraded` means lead capture works but is not yet hardened — running on the
 * publishable key, so the anon INSERT policy cannot be revoked yet.
 */

import { configReport } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const config = configReport();

  const ready = config.supabaseKey !== "missing";
  const hardened = config.supabaseKey === "service_role" && config.turnstileEnforced;

  return Response.json(
    {
      ok: ready,
      status: !ready ? "unconfigured" : hardened ? "ok" : "degraded",
      leadCapture: {
        supabaseUrlSet: config.supabaseUrlSet,
        credential: config.supabaseKey,
        turnstileWidget: config.turnstileWidget,
        turnstileEnforced: config.turnstileEnforced,
      },
      // Names the next hardening step, so the probe is actionable rather than
      // merely descriptive.
      nextStep: !ready
        ? "Set SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)."
        : config.supabaseKey !== "service_role"
          ? "Set SUPABASE_SERVICE_ROLE_KEY, then revoke the anon INSERT policy on public_leads."
          : !config.turnstileEnforced
            ? "Set TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY to enforce the bot check."
            : null,
      time: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        // Not useful to anyone but an operator, and not something to index.
        "X-Robots-Tag": "noindex",
      },
    }
  );
}

function methodNotAllowed(): Response {
  return new Response(null, {
    status: 405,
    headers: { Allow: "GET", "Cache-Control": "no-store" },
  });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
