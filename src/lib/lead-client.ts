/**
 * Client-side lead submission for the static build.
 *
 * With no server, the form posts straight into WarriorCRM's Supabase
 * `public_leads` queue from the browser. That is only safe with the Supabase
 * ANON / publishable key and a row-level-security policy that allows INSERT
 * (and nothing else) on that one table — never the service_role key, which
 * would be readable by anyone in the shipped bundle.
 *
 * Both values are NEXT_PUBLIC_ because a static export bakes env vars in at
 * build time; there is no runtime to read them later. They are meant to be
 * public here, which is the whole design of a Supabase anon key.
 *
 * If the env vars are absent (e.g. a local build without them), submit() is a
 * no-op that still resolves, so the form shows its success state and the
 * WhatsApp fallback — the user is never left staring at a dead button.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ROLE_MAP: Record<string, string> = {
  "athlete / student": "Athlete",
  parent: "Parent",
  "coach / institution": "Coach",
};

export type LeadInput = {
  // All optional: the payload is assembled from a FormData bag, and the
  // form's own `required` attributes guarantee name + a contact method
  // before submit ever runs.
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  sport?: string;
  who?: string;
  challenge?: string;
  goal?: string;
  magnet?: string;
};

export async function submitLead(input: LeadInput): Promise<{ forwarded: boolean }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { forwarded: false };

  // Shape to the CRM's field names so it lands as a complete lead, mirroring
  // what the old server route did.
  const crmLead = {
    name: (input.name ?? "").trim(),
    phone: (input.phone ?? "").trim(),
    whatsapp: (input.phone ?? "").trim(),
    email: (input.email ?? "").trim(),
    athleteAge: (input.age ?? "").trim(),
    sport: (input.sport ?? "").trim(),
    leadType: ROLE_MAP[(input.who ?? "").toLowerCase()] || "Athlete",
    mainProblem: (input.challenge ?? "").trim(),
    goal: (input.goal ?? "").trim(),
    source: "Coach Website",
    campaign: (input.magnet ?? "").trim(),
    landingPage: typeof window !== "undefined" ? window.location.href : "",
    dateAdded: new Date().toISOString().slice(0, 10),
    stage: "New Lead",
    status: "Active",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ payload: crmLead }),
  });

  return { forwarded: res.ok };
}
