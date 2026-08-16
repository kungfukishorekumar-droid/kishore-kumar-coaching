/**
 * Lead validation and normalisation — the trust boundary.
 *
 * Written by hand rather than with a schema library. The project ships a
 * deliberately small dependency tree (0 vulnerabilities across 162 packages),
 * and one endpoint with fifteen fields does not justify adding zod to it. If a
 * second or third endpoint appears, that trade flips.
 *
 * ── Two rules this file exists to enforce ────────────────────────────────────
 *
 * 1. ALLOWLIST, never blocklist. Only the fields named below survive. The old
 *    browser-to-Supabase path forwarded whatever object the client sent, so any
 *    caller could write arbitrary keys of arbitrary length into the CRM queue.
 *    Anything not listed here is dropped silently.
 *
 * 2. SERVER-OWNED FIELDS ARE NOT INPUTS. `source`, `dateAdded`, `stage` and
 *    `status` are set here, not read from the request. `source` in particular
 *    decides which of the two sites a lead is attributed to and how the CRM
 *    routes it — a value the client can choose is a value an attacker can
 *    forge, which would quietly corrupt per-site reporting.
 */

/**
 * Control characters, written as escapes rather than literals.
 *
 * They have no legitimate place in a name or a goal, and they are what lets a
 * value break out of a log line or a CSV export of the CRM. Defence in depth —
 * the CRM should still escape on output.
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Neutralise control characters, collapse whitespace, trim, and cap length. */
function clean(value: unknown, maxLength: number): string {
  if (value === null || value === undefined) return "";
  // Coerce rather than reject: a numeric age or a boolean is harmless once
  // stringified, and refusing the whole lead over it would lose a customer.
  const text = typeof value === "string" ? value : String(value);
  return text
    // Replaced with a SPACE, not deleted. Deleting them welds the surrounding
    // words together: a name pasted across a line break became "JohnSmith", and
    // a multi-line answer in `goal` lost every word boundary. The collapse on
    // the next line tidies up the spaces this introduces.
    .replace(CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

const MAX = {
  name: 100,
  phone: 24,
  email: 254,
  age: 3,
  sport: 100,
  freeText: 500,
  campaign: 200,
  url: 500,
} as const;

/**
 * Deliberately permissive. Indian numbers arrive as +91 98845 99939,
 * 09884599939, or 9884599939, and a strict pattern rejecting a real customer is
 * a worse outcome than accepting a malformed one — a human reads this next.
 */
const PHONE_ALLOWED = /^[0-9+()\-.\s]+$/;
/** Enough to catch typos and obvious junk; full RFC 5322 is not worth it. */
const EMAIL = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/;

const LEAD_TYPES = ["Athlete", "Parent", "Coach"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

const ROLE_MAP: Record<string, LeadType> = {
  "athlete / student": "Athlete",
  athlete: "Athlete",
  student: "Athlete",
  parent: "Parent",
  "coach / institution": "Coach",
  coach: "Coach",
  institution: "Coach",
};

/** Shape written to `public_leads.payload`. Matches what the CRM already reads. */
export type CrmLead = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  athleteAge: string;
  sport: string;
  leadType: LeadType;
  mainProblem: string;
  goal: string;
  source: string;
  campaign: string;
  landingPage: string;
  dateAdded: string;
  stage: string;
  status: string;
};

export type ValidationResult =
  | { ok: true; lead: CrmLead }
  | { ok: false; errors: string[] };

/**
 * Validate a submission and build the CRM row.
 *
 * `source` and `landingPage` are derived from the request, not the body.
 */
export function validateLead(
  input: Record<string, unknown>,
  context: { source: string; siteOrigins: string[] }
): ValidationResult {
  const errors: string[] = [];

  const name = clean(input.name, MAX.name);
  const phone = clean(input.phone, MAX.phone);
  const email = clean(input.email, MAX.email).toLowerCase();

  if (name.length < 2) {
    errors.push("name");
  }

  // A lead with no way to reach the person is not a lead.
  if (!phone && !email) {
    errors.push("contact");
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!PHONE_ALLOWED.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.push("phone");
    }
  }

  if (email && !EMAIL.test(email)) {
    errors.push("email");
  }

  if (errors.length > 0) return { ok: false, errors };

  // Age is free text on the form; keep it only when it is a plausible number,
  // rather than rejecting the lead over a junk value in an optional field.
  const rawAge = clean(input.age ?? input.athleteAge, MAX.age);
  const ageNumber = Number.parseInt(rawAge, 10);
  const athleteAge =
    Number.isFinite(ageNumber) && ageNumber >= 3 && ageNumber <= 100
      ? String(ageNumber)
      : "";

  const who = clean(input.who ?? input.leadType, 60).toLowerCase();

  // Only same-origin landing pages are recorded. The value is a URL that ends up
  // rendered in the CRM, so accepting an arbitrary one would let a submitter
  // plant a link to a site of their choosing in front of whoever reads the lead.
  const landingPage = safeSameOriginUrl(input.landingPage, context.siteOrigins);

  return {
    ok: true,
    lead: {
      name,
      phone,
      // The form asks for one number and uses it for both.
      whatsapp: phone,
      email,
      athleteAge,
      sport: clean(input.sport, MAX.sport),
      leadType: ROLE_MAP[who] ?? "Athlete",
      mainProblem: clean(input.challenge ?? input.mainProblem, MAX.freeText),
      goal: clean(input.goal, MAX.freeText),
      campaign: clean(input.magnet ?? input.campaign, MAX.campaign),
      landingPage,

      // ── Server-owned below this line. Never read from the request. ──
      source: context.source,
      dateAdded: new Date().toISOString().slice(0, 10),
      stage: "New Lead",
      status: "Active",
    },
  };
}

function safeSameOriginUrl(value: unknown, siteOrigins: string[]): string {
  const raw = clean(value, MAX.url);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (!siteOrigins.includes(url.origin)) return "";
    // Drop the query string and fragment: they carry whatever the visitor's
    // referrer or ad platform appended, which is not information this queue
    // needs and is the part most likely to contain someone else's tracking id.
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

/**
 * Stable fingerprint for duplicate suppression.
 *
 * Identity is name + contact + campaign: the same person asking for the same
 * thing twice within minutes is a double-submit, while the same person asking
 * for a *different* magnet is a genuine second lead and must not be swallowed.
 */
export function leadFingerprint(lead: CrmLead): string {
  return [lead.name.toLowerCase(), lead.phone, lead.email, lead.campaign].join("|");
}
