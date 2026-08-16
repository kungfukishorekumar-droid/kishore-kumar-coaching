/**
 * Structured request logging.
 *
 * One JSON object per line, so Hostinger's log view and anything downstream can
 * parse it. Every line carries a request id, which is also returned to the
 * client in `x-request-id` — that is what makes a support conversation
 * ("I submitted at 3pm and got an error") actually traceable.
 *
 * ── What must never appear here ──────────────────────────────────────────────
 * Names, phone numbers, email addresses, free-text answers, Supabase keys and
 * Turnstile tokens are all forbidden. A lead form processes personal data for a
 * business that trains minors, so the logs are a disclosure surface in their own
 * right: anything written here outlives the request and is readable by anyone
 * with server access. `describeLead` below exists so a lead can be logged as a
 * shape — which fields were present, how long they were — without logging the
 * person.
 */

type Level = "info" | "warn" | "error";

export type LogFields = Record<string, string | number | boolean | null | undefined>;

/**
 * Field names that must never be logged, at any nesting level. Enforced rather
 * than trusted, because the easy mistake is spreading a whole payload into a
 * log call while debugging and never taking it out again.
 */
const FORBIDDEN = new Set([
  "name",
  "phone",
  "whatsapp",
  "email",
  "mainproblem",
  "goal",
  "sport",
  "payload",
  "key",
  "apikey",
  "authorization",
  "token",
  "turnstiletoken",
  "secret",
]);

function scrub(fields: LogFields): LogFields {
  const safe: LogFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (FORBIDDEN.has(k.toLowerCase())) {
      safe[k] = "[redacted]";
      continue;
    }
    safe[k] = v;
  }
  return safe;
}

export function newRequestId(): string {
  // randomUUID is available on the Node runtime this route pins itself to.
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
}

export function log(level: Level, event: string, fields: LogFields = {}): void {
  const line = JSON.stringify({
    t: new Date().toISOString(),
    level,
    event,
    ...scrub(fields),
  });

  // eslint-disable-next-line no-console
  if (level === "error") console.error(line);
  // eslint-disable-next-line no-console
  else if (level === "warn") console.warn(line);
  // eslint-disable-next-line no-console
  else console.log(line);
}

/**
 * Describe a lead without disclosing it — presence and length only.
 *
 * This is what makes "why did that submission fail validation?" answerable
 * without a log full of phone numbers.
 */
export function describeLead(input: Record<string, unknown>): LogFields {
  const len = (k: string) => {
    const v = input[k];
    return typeof v === "string" ? v.length : 0;
  };
  return {
    hasName: len("name") > 0,
    hasPhone: len("phone") > 0,
    hasEmail: len("email") > 0,
    nameLen: len("name"),
    phoneLen: len("phone"),
    emailLen: len("email"),
    fieldCount: Object.keys(input).length,
  };
}
