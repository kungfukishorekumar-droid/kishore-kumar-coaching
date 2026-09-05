/**
 * Direct delivery to the WarriorCRM ingest webhook.
 *
 * ── Why this exists alongside `leads.ts` ─────────────────────────────────────
 * `leads.ts` writes into the Supabase `public_leads` queue, which the CRM (a
 * separate repository) drains on its own schedule. That path is durable but
 * indirect: a lead sits in a table until the drain runs, and if the drain is
 * broken nothing tells you.
 *
 * This module posts the same lead straight at the CRM's site-scoped ingest
 * endpoint, so a submission shows up in the CRM immediately. The two run in
 * parallel and neither is allowed to fail the other — see the route. The queue
 * stays the backstop: if the webhook is down, misconfigured, or expects a
 * different body shape, the lead is still in Supabase and still reaches the CRM
 * the way it always has.
 *
 * ── Authentication ───────────────────────────────────────────────────────────
 * A single shared secret in `x-api-key`, issued per site by the CRM. It is read
 * from CRM_API_KEY at request time and, like every other credential here,
 * deliberately has no NEXT_PUBLIC_ prefix — it must never be inlined into the
 * browser bundle. Without CRM_WEBHOOK_URL and CRM_API_KEY this module does
 * nothing at all rather than sending a request the CRM would only reject.
 *
 * ── Body shape ───────────────────────────────────────────────────────────────
 * The validated `CrmLead` is sent flat, plus the site slug the key belongs to.
 * Those are the same field names the CRM already reads out of
 * `public_leads.payload`, so a lead looks identical whichever path carried it.
 * If the endpoint turns out to want a different envelope, the only thing that
 * changes is `body` below — and until it is fixed the queue keeps working, with
 * `crm.rejected` in the logs saying exactly why.
 */

import { warriorCrmConfig } from "./env";
import { log } from "./log";
import type { CrmLead } from "./validate";

/**
 * Shorter than the 8s allowed for the Supabase write. This call runs alongside
 * that write, not instead of it, so it must never be the reason a visitor sits
 * watching a spinner — the queue has already taken responsibility for the lead.
 */
const TIMEOUT_MS = 6000;

export type CrmDeliveryOutcome =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "rejected" | "unavailable" };

export async function deliverToWarriorCrm(
  lead: CrmLead,
  requestId: string
): Promise<CrmDeliveryOutcome> {
  const config = warriorCrmConfig();
  if (!config) {
    // Not an error. A deployment without the URL and key runs queue-only, which
    // is the behaviour that shipped before this module existed.
    return { ok: false, reason: "not-configured" };
  }

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...lead,
        // Which site in the CRM this lead belongs to. The slug is also in the
        // URL path; sending it in the body too means a copied-but-not-updated
        // URL cannot silently file leads under the wrong site.
        site: config.siteSlug,
        // Lets a lead in the CRM be traced back to a line in this server's log
        // without either side storing anything about the person.
        requestId,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      log("info", "crm.delivered", { requestId, site: config.siteSlug });
      return { ok: true };
    }

    // Bounded slice only, and only to the server log. An ingest error can name
    // internal fields and validation rules of the CRM; that is diagnostic
    // detail for an operator, never something to put in a client response.
    const detail = (await res.text().catch(() => "")).slice(0, 300);

    log("error", "crm.rejected", {
      requestId,
      status: res.status,
      site: config.siteSlug,
      detail,
      // 401/403 here means the key is wrong, revoked, or issued for a different
      // site than the one in the URL — the one failure a redeploy cannot fix.
      hint:
        res.status === 401 || res.status === 403
          ? "check CRM_API_KEY matches the site in CRM_WEBHOOK_URL"
          : undefined,
    });

    return { ok: false, reason: "rejected" };
  } catch (err) {
    log("error", "crm.unavailable", {
      requestId,
      site: config.siteSlug,
      message: err instanceof Error ? err.message : "unknown",
    });
    return { ok: false, reason: "unavailable" };
  }
}
