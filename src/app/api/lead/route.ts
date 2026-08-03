import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LENGTHS: Record<string, number> = {
  name: 100,
  phone: 20,
  email: 254,
  age: 10,
  sport: 100,
  who: 40,
  challenge: 80,
  goal: 500,
  magnet: 60,
  source: 50,
};

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  sport?: string;
  who?: string;
  challenge?: string;
  goal?: string;
  magnet?: string;
  source?: string;
};

/**
 * CSRF guard: a browser same-origin POST always has `Origin` host === `Host`.
 * This works in dev (localhost), production, preview URLs and www/apex without
 * any env config, while still rejecting cross-site POSTs.
 */
function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // no Origin header (non-browser client)
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Ensure the CRM webhook is an HTTPS URL to prevent SSRF via misconfiguration. */
function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // Rate limit: 5 submissions per IP per minute
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = rateLimit(`lead:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Reject cross-site POSTs (same-origin only).
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // Type + length validation. Every known field must be a string (or absent).
  // Rejecting non-strings stops NoSQL-operator payloads (e.g. { "$gt": "" })
  // from ever being forwarded to the Mongo-backed CRM, and prevents a crash
  // when a non-string value hits .trim() below.
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const val = (data as Record<string, unknown>)[field];
    if (val === undefined || val === null) continue;
    if (typeof val !== "string") {
      return NextResponse.json({ ok: false, error: `${field}-invalid` }, { status: 422 });
    }
    if (val.length > max) {
      return NextResponse.json({ ok: false, error: `${field}-too-long` }, { status: 422 });
    }
  }

  // Require name + at least one contact method.
  if (!data.name?.trim() || !(data.phone?.trim() || data.email?.trim())) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  // Forward every field the forms collect (who / challenge / age / magnet included).
  const lead = {
    name: data.name.trim(),
    phone: data.phone?.trim() ?? "",
    email: data.email?.trim() ?? "",
    age: data.age?.trim() ?? "",
    sport: data.sport?.trim() ?? "",
    who: data.who?.trim() ?? "",
    challenge: data.challenge?.trim() ?? "",
    goal: data.goal?.trim() ?? "",
    magnet: data.magnet?.trim() ?? "",
    source: data.source?.trim().slice(0, 50) || "landing-page",
    submittedAt: new Date().toISOString(),
  };

  // ── WarriorCRM (Supabase) ────────────────────────────────────────────────
  // Preferred path: post straight into the CRM's `public_leads` queue, which
  // the CRM drains on open. Shapes the payload to the CRM's field names so it
  // lands as a complete lead rather than raw form data.
  const sbUrl = process.env.WARRIORCRM_SUPABASE_URL;
  const sbKey = process.env.WARRIORCRM_SUPABASE_KEY;

  if (sbUrl && sbKey) {
    if (!isHttpsUrl(sbUrl)) {
      console.error("[lead] WARRIORCRM_SUPABASE_URL must be https — aborting forward");
      return NextResponse.json({ ok: true, forwarded: false });
    }
    // "Athlete / Student" | "Parent" | "Coach / Institution" → CRM role enum
    const roleMap: Record<string, string> = {
      "athlete / student": "Athlete",
      parent: "Parent",
      "coach / institution": "Coach",
    };
    const crmLead = {
      name: lead.name,
      phone: lead.phone,
      whatsapp: lead.phone,
      email: lead.email,
      athleteAge: lead.age,
      sport: lead.sport,
      leadType: roleMap[lead.who.toLowerCase()] || "Athlete",
      mainProblem: lead.challenge,
      goal: lead.goal,
      source: "Coach Website",
      campaign: lead.magnet,
      landingPage: req.headers.get("referer") || "",
      dateAdded: lead.submittedAt.slice(0, 10),
      stage: "New Lead",
      status: "Active",
    };
    try {
      const res = await fetch(`${sbUrl}/rest/v1/public_leads`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ payload: crmLead }),
      });
      if (!res.ok) {
        console.error("[lead] WarriorCRM responded", res.status);
        return NextResponse.json({ ok: true, forwarded: false });
      }
      return NextResponse.json({ ok: true, forwarded: true });
    } catch (err) {
      console.error("[lead] WarriorCRM forwarding error:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json({ ok: true, forwarded: false });
    }
  }

  // ── Generic webhook fallback (unchanged) ─────────────────────────────────
  const webhook = process.env.CRM_WEBHOOK_URL;

  if (!webhook) {
    console.warn("[lead] no CRM destination configured; lead not forwarded (fields: name, phone/email)");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  // Guard against SSRF: only allow HTTPS destinations.
  if (!isHttpsUrl(webhook)) {
    console.error("[lead] CRM_WEBHOOK_URL must be an https:// URL — aborting forward");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_API_KEY
          ? { Authorization: `Bearer ${process.env.CRM_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(lead),
    });

    if (!res.ok) {
      console.error("[lead] CRM responded", res.status);
      return NextResponse.json({ ok: true, forwarded: false });
    }

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("[lead] forwarding error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ ok: true, forwarded: false });
  }
}
