/**
 * Writes a validated lead into the WarriorCRM intake queue.
 *
 * Uses plain `fetch` against Supabase's PostgREST endpoint rather than
 * `@supabase/supabase-js`. One insert into one table does not justify a client
 * library and its transitive tree in a bundle this deliberately small, and the
 * REST call is more legible than the abstraction over it.
 *
 * The CRM (a separate repository) drains this table. Its `payload` column is a
 * JSON blob, so the database enforces nothing about the shape — which is why
 * `validate.ts` has to.
 */

import { supabaseCredential, supabaseUrl } from "./env";
import { log } from "./log";
import type { CrmLead } from "./validate";

const TIMEOUT_MS = 8000;

export type InsertOutcome =
  | { ok: true; credential: "service_role" | "publishable" }
  | { ok: false; reason: "not-configured" | "rejected" | "unavailable" };

export async function insertLead(lead: CrmLead, requestId: string): Promise<InsertOutcome> {
  const credential = supabaseCredential();
  if (!credential) {
    log("error", "lead.not_configured", { requestId });
    return { ok: false, reason: "not-configured" };
  }

  const url = `${supabaseUrl()}/rest/v1/public_leads`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        apikey: credential.key,
        Authorization: `Bearer ${credential.key}`,
        "Content-Type": "application/json",
        // Ask PostgREST not to send the row back. Nothing here needs it, and
        // not returning it keeps lead data out of a response body that could
        // otherwise be logged by an intermediary.
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ payload: lead }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      log("info", "lead.stored", { requestId, credential: credential.kind });
      return { ok: true, credential: credential.kind };
    }

    // Read a bounded slice of the error for the log. Supabase errors name
    // tables, columns and policies, so this is diagnostic detail that belongs
    // in the server log and must never reach the client.
    const detail = (await res.text().catch(() => "")).slice(0, 300);

    log("error", "lead.rejected_by_supabase", {
      requestId,
      status: res.status,
      credential: credential.kind,
      detail,
    });

    // 401/403 with the publishable key almost always means the anon INSERT
    // policy has been revoked — the correct end state, but only once
    // SUPABASE_SERVICE_ROLE_KEY is set. Call it out explicitly: this is the
    // most likely way a correct hardening step breaks lead capture.
    if ((res.status === 401 || res.status === 403) && credential.kind === "publishable") {
      log("error", "lead.needs_service_role_key", {
        requestId,
        hint: "anon INSERT appears revoked; set SUPABASE_SERVICE_ROLE_KEY",
      });
    }

    return { ok: false, reason: "rejected" };
  } catch (err) {
    log("error", "lead.upstream_unavailable", {
      requestId,
      message: err instanceof Error ? err.message : "unknown",
    });
    return { ok: false, reason: "unavailable" };
  }
}
