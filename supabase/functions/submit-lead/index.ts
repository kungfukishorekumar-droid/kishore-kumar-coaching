// Supabase Edge Function — submit-lead
//
// The server half of Turnstile. The static sites can't verify a bot token
// themselves, so they POST { payload, turnstileToken } here; this function
// verifies the token with Cloudflare, and only then inserts the lead using the
// service-role key. Because the insert happens here, the public_leads table can
// drop its open anon-insert policy entirely — the anon key can no longer write.
//
// Deploy:
//   supabase functions deploy submit-lead --no-verify-jwt
//
// Secrets it needs (set once):
//   supabase secrets set TURNSTILE_SECRET_KEY=xxxxxxxx
//   (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically)
//
// --no-verify-jwt is deliberate: the anon "JWT" a public site sends is not a
// real user session, so Supabase's own JWT gate would reject it. Turnstile is
// the gate instead.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Both sites call this cross-origin, so CORS must be explicit. Lock this to the
// two real origins once they're both live; "*" is fine while testing.
const ALLOWED_ORIGINS = [
  "https://kishorekumarcoach.com",
  "https://www.kishorekumarcoach.com",
  "https://spartacusmartialarts.com",
  "https://www.spartacusmartialarts.com",
];

/**
 * The `source` values a lead is allowed to claim. Kept in step with the two
 * sites in ALLOWED_ORIGINS — see the check further down for why this is not
 * taken on trust from the request body.
 */
const ALLOWED_SOURCES = ["kishorekumarcoach.com", "spartacusmartialarts.com"];

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

/**
 * The row written to `public_leads` is an allowlist, not whatever arrived.
 *
 * The function used to `insert({ payload })` with the client's object exactly as
 * sent. Turnstile proves a human pressed a button; it says nothing about what
 * that request body contains. So one solved challenge could write unlimited
 * keys of unlimited length into the CRM queue — enough to bloat the table, and
 * enough to smuggle attacker-chosen fields into whatever CRM view renders a
 * lead. Fixing the shape here means the queue holds only lead-shaped rows.
 */
const ALLOWED_FIELDS = [
  "name",
  "phone",
  "whatsapp",
  "email",
  "athleteAge",
  "sport",
  "leadType",
  "mainProblem",
  "goal",
  "source",
  "campaign",
  "landingPage",
  "dateAdded",
  "stage",
  "status",
] as const;

/** Generous for real answers, far below anything worth storing as an attack. */
const MAX_FIELD_LENGTH = 500;
/** A lead is a few hundred bytes; 16 KB is already absurd for one. */
const MAX_BODY_BYTES = 16 * 1024;

function sanitizeLead(input: Record<string, unknown>): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const field of ALLOWED_FIELDS) {
    const value = input[field];
    if (value === undefined || value === null) continue;
    // Coerce rather than reject: a number age or a boolean is harmless once
    // stringified, and rejecting the whole lead over it would lose a customer.
    const text = String(value).trim().slice(0, MAX_FIELD_LENGTH);
    if (text) clean[field] = text;
  }
  return clean;
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  // Fail closed on anything unexpected. Without this, a Cloudflare hiccup that
  // answered with an HTML error page made res.json() throw, the exception
  // escaped Deno.serve, and the caller got a 500 — an outage at Cloudflare
  // turned into an outage of the lead form. A timeout matters for the same
  // reason: an unanswered verify request would otherwise hang the function.
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data?.success === true;
  } catch (err) {
    console.error("turnstile verify failed", err instanceof Error ? err.message : err);
    return false;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  // Reject oversized bodies before parsing them — parsing is where an unbounded
  // body actually costs memory, so the check has to come first. Content-Length
  // is advisory, hence the second check on the text itself.
  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "too-large" }, { status: 413, headers: cors });
  }

  let payload: Record<string, unknown>;
  let turnstileToken: string;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "too-large" }, { status: 413, headers: cors });
    }
    const json = JSON.parse(raw);
    // A JSON body can legally be a string, an array or null; indexing those for
    // `payload.name` would throw and 500 instead of answering 400.
    if (typeof json !== "object" || json === null || Array.isArray(json)) {
      return Response.json({ ok: false, error: "bad-json" }, { status: 400, headers: cors });
    }
    const candidate = json.payload;
    if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) {
      return Response.json({ ok: false, error: "bad-payload" }, { status: 400, headers: cors });
    }
    payload = candidate as Record<string, unknown>;
    turnstileToken = json.turnstileToken;
  } catch {
    return Response.json({ ok: false, error: "bad-json" }, { status: 400, headers: cors });
  }

  if (!turnstileToken || typeof turnstileToken !== "string") {
    return Response.json({ ok: false, error: "missing-token" }, { status: 400, headers: cors });
  }

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for");
  const human = await verifyTurnstile(turnstileToken, ip);
  if (!human) {
    return Response.json({ ok: false, error: "turnstile-failed" }, { status: 403, headers: cors });
  }

  // Drop everything that isn't a known lead field, and cap what's left.
  const lead = sanitizeLead(payload);

  // Minimal shape guard — a lead must at least have a name and one contact.
  if (!lead.name || (!lead.phone && !lead.email)) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 422, headers: cors });
  }

  // `source` decides which site a lead is attributed to and how the CRM routes
  // and reports on it, so a client must not be free to claim an arbitrary one.
  // Anything unrecognised is labelled rather than trusted, which keeps per-site
  // reporting honest without throwing a real lead away.
  if (!ALLOWED_SOURCES.includes(lead.source)) {
    lead.source = "unverified";
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase.from("public_leads").insert({ payload: lead });
  if (error) {
    console.error("insert failed", error.message);
    return Response.json({ ok: false, error: "insert-failed" }, { status: 500, headers: cors });
  }

  return Response.json({ ok: true }, { headers: cors });
});
