/**
 * Server-side environment access.
 *
 * Everything here is read at REQUEST time, never at module scope. Next inlines
 * `process.env.NEXT_PUBLIC_*` at build time, but server-only variables must not
 * be captured during the build — the app is built once and then run by
 * Hostinger's Node process, so a value read at build time would freeze whatever
 * the build environment happened to have (usually nothing).
 *
 * ── The security point of this file ──────────────────────────────────────────
 * The names below deliberately have NO `NEXT_PUBLIC_` prefix. That prefix is
 * what tells Next a variable may be inlined into the client bundle, so omitting
 * it is the mechanism that keeps the service-role key out of the browser. Never
 * rename one of these to NEXT_PUBLIC_*.
 */

/** Reads a variable, treating blank/whitespace as absent. */
function read(name: string): string | undefined {
  const raw = process.env[name];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readInt(name: string, fallback: number): number {
  const raw = read(name);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * The Supabase project the CRM queue lives in.
 *
 * Falls back to the public variable (and then to the committed project URL) so
 * a deployment that sets nothing still works — the URL is not a secret, only
 * the key is.
 */
export function supabaseUrl(): string {
  return (
    read("SUPABASE_URL") ??
    read("NEXT_PUBLIC_SUPABASE_URL") ??
    "https://oqwbmtdrjxfbnitlzehe.supabase.co"
  );
}

export type SupabaseCredential = {
  key: string;
  /**
   * Which key we ended up with. `service_role` is the goal: it lets the
   * `public_leads` table drop its open anon-insert policy entirely, because the
   * only writer left is this server. `publishable` is the degraded mode.
   */
  kind: "service_role" | "publishable";
};

/**
 * Prefer the service-role key; fall back to the publishable one.
 *
 * The fallback exists so that adding this backend cannot take lead capture down
 * on a deploy that hasn't had its environment configured yet. Even in the
 * degraded mode the key stays server-side, so the browser holds no Supabase
 * credential either way — that alone closes the "anyone can write to the queue"
 * exposure. Setting SUPABASE_SERVICE_ROLE_KEY is what lets you then revoke the
 * anon INSERT policy and close it at the database as well.
 */
export function supabaseCredential(): SupabaseCredential | null {
  const service = read("SUPABASE_SERVICE_ROLE_KEY");
  if (service) return { key: service, kind: "service_role" };

  const publishable =
    read("SUPABASE_ANON_KEY") ??
    read("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    "sb_publishable_Tqkzvziw-5C6I7Hib92B-g_AZQIJTRA";

  return { key: publishable, kind: "publishable" };
}

/**
 * The WarriorCRM ingest endpoint leads are delivered to directly.
 *
 * ── Names match the Warrior Mind backend on purpose ──────────────────────────
 * CRM_WEBHOOK_URL / CRM_API_KEY / CRM_SITE_SLUG are the same three names that
 * repository uses, so one CRM connection is configured identically wherever it
 * appears and a value can be copied between hPanel environments without
 * translation.
 *
 * ── Blank URL means OFF ──────────────────────────────────────────────────────
 * There is deliberately no committed fallback URL. Direct delivery needs both
 * the endpoint and the key, so clearing either one disables it — which is what
 * makes CRM_WEBHOOK_URL a usable kill switch when the CRM is down or being
 * migrated. Disabled is not broken: leads still go into the Supabase queue the
 * CRM drains, which is how this site worked before the webhook existed.
 */
const CRM_SITE_SLUG = "spartacus";

export type CrmWebhookConfig = {
  url: string;
  /** Sent as `x-api-key`. Server-only — never expose this to the browser. */
  apiKey: string;
  /** Which site in the CRM the key files leads under. */
  siteSlug: string;
};

/** Null when either CRM_WEBHOOK_URL or CRM_API_KEY is unset or blank. */
export function warriorCrmConfig(): CrmWebhookConfig | null {
  const url = read("CRM_WEBHOOK_URL");
  const apiKey = read("CRM_API_KEY");
  if (!url || !apiKey) return null;

  return { url, apiKey, siteSlug: read("CRM_SITE_SLUG") ?? CRM_SITE_SLUG };
}

/** Cloudflare Turnstile secret. Absent → the challenge is not enforced. */
export function turnstileSecret(): string | undefined {
  return read("TURNSTILE_SECRET_KEY");
}

/** Whether the front end is rendering a Turnstile widget at all. */
export function turnstileConfigured(): boolean {
  return Boolean(read("NEXT_PUBLIC_TURNSTILE_SITE_KEY"));
}

/**
 * Origins allowed to submit the form. Same-origin is the norm; the extra hosts
 * cover www/apex variants and the sibling Spartacus site, which posts into the
 * same queue.
 */
export function allowedOrigins(): string[] {
  // ALLOWED_ORIGINS is the name the Warrior Mind backend uses for the same
  // list. Reading both means a value copied between the two repos works as
  // written instead of silently doing nothing; the LEAD_-prefixed name wins,
  // because it is the one that sits with the other LEAD_* knobs here.
  const extra = read("LEAD_ALLOWED_ORIGINS") ?? read("ALLOWED_ORIGINS");
  const configured = extra
    ? extra.split(",").map((o) => o.trim()).filter(Boolean)
    : [];

  return [
    "https://kishorekumarcoach.com",
    "https://www.kishorekumarcoach.com",
    ...configured,
  ];
}

export const limits = {
  /**
   * Two tiers, because "requests" and "leads" need different budgets.
   *
   * A single tier counting every request had to be tight enough to stop queue
   * flooding, which meant a visitor who mistyped their phone number five times
   * was locked out for ten minutes — punishing exactly the person the form
   * exists for. So:
   *
   *   burst  — every request, valid or not. Stops hammering and protects CPU.
   *   submit — only requests that get as far as an accepted, non-duplicate
   *            lead. Stops queue flooding.
   *
   * A visitor can now fumble the form repeatedly and still get through, while
   * the number of rows one address can actually create stays small.
   */
  burstMax: () => readInt("LEAD_BURST_LIMIT_MAX", 30),
  submitMax: () => readInt("LEAD_RATE_LIMIT_MAX", 5),
  /** Sliding window length in milliseconds, shared by both tiers. */
  rateWindowMs: () => readInt("LEAD_RATE_LIMIT_WINDOW_MS", 10 * 60 * 1000),
  /** Hard cap on an accepted request body. A lead is a few hundred bytes. */
  maxBodyBytes: () => readInt("LEAD_MAX_BODY_BYTES", 16 * 1024),
  /** How long an identical resubmission is treated as a duplicate. */
  dedupeWindowMs: () => readInt("LEAD_DEDUPE_WINDOW_MS", 5 * 60 * 1000),
};

/** Non-secret readiness summary for the health endpoint. */
export function configReport() {
  const credential = supabaseCredential();
  const crm = warriorCrmConfig();
  return {
    supabaseUrlSet: Boolean(read("SUPABASE_URL") ?? read("NEXT_PUBLIC_SUPABASE_URL")),
    supabaseKey: credential ? credential.kind : "missing",
    turnstileEnforced: Boolean(turnstileSecret()),
    turnstileWidget: turnstileConfigured(),
    // Boolean and slug only. The slug is already public (it is in the ingest
    // URL); the key never appears here, not even as a length.
    crmWebhook: Boolean(crm),
    crmSite: crm ? crm.siteSlug : null,
  };
}
