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

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );
  const data = await res.json();
  return data.success === true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  let payload: Record<string, unknown>;
  let turnstileToken: string;
  try {
    const json = await req.json();
    payload = json.payload;
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

  // Minimal shape guard — payload must at least name a lead with a contact.
  const name = String(payload?.name ?? "").trim();
  const phone = String(payload?.phone ?? "").trim();
  const email = String(payload?.email ?? "").trim();
  if (!name || (!phone && !email)) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 422, headers: cors });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase.from("public_leads").insert({ payload });
  if (error) {
    console.error("insert failed", error.message);
    return Response.json({ ok: false, error: "insert-failed" }, { status: 500, headers: cors });
  }

  return Response.json({ ok: true }, { headers: cors });
});
