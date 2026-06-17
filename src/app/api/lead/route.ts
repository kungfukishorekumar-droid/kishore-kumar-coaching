import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Always handled at request time (never statically cached).
export const dynamic = "force-dynamic";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  sport?: string;
  goal?: string;
};

/**
 * Receives a lead from the landing-page form and forwards it to the CRM
 * backend (WarriorCRM) server-side. The CRM endpoint + key live in env vars,
 * so the CRM is never exposed to the browser.
 *
 * Set in `.env.local` (see .env.example):
 *   CRM_WEBHOOK_URL=https://warriorcrm.netlify.app/api/leads   ← your intake endpoint
 *   CRM_API_KEY=...                                            ← optional auth token
 */
export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // Minimal validation — name + at least one contact method.
  if (!data.name || !(data.phone || data.email)) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  const lead = {
    name: data.name,
    phone: data.phone ?? "",
    email: data.email ?? "",
    sport: data.sport ?? "",
    goal: data.goal ?? "",
    source: "landing-page",
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.CRM_WEBHOOK_URL;

  if (!webhook) {
    // Not wired yet — log so nothing is lost, but don't block the visitor.
    console.warn("[lead] CRM_WEBHOOK_URL not set; lead not forwarded:", lead);
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
      console.error("[lead] CRM responded", res.status, await res.text().catch(() => ""));
      // Don't fail the visitor's submission over a CRM hiccup.
      return NextResponse.json({ ok: true, forwarded: false });
    }

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("[lead] forwarding error:", err);
    return NextResponse.json({ ok: true, forwarded: false });
  }
}
