/**
 * Client-side lead submission.
 *
 * ── What changed, and why it matters ─────────────────────────────────────────
 * This file used to POST straight into Supabase's REST API from the browser,
 * carrying a publishable key that was committed to the repo and shipped in the
 * bundle. That design came from a period when the site was a static export with
 * no server to put a secret behind. The site now runs as a real Next.js app, so
 * the form posts to our own `/api/lead/` and the server does the writing.
 *
 * The consequences are the point:
 *   • The browser holds NO Supabase credential. Reading the bundle no longer
 *     grants anyone the ability to write to the CRM queue.
 *   • Turnstile can finally be enforced — a token means nothing until a server
 *     exchanges it with Cloudflare.
 *   • Validation, rate limiting and duplicate suppression happen somewhere a
 *     caller cannot skip by calling the API directly.
 *
 * Because no Supabase host is contacted from the page any more, the CSP
 * `connect-src` in next.config.mjs no longer needs to allow one.
 */

/**
 * Trailing slash is required, not cosmetic. `trailingSlash: true` in
 * next.config.mjs applies to route handlers, so `/api/lead` answers 308 to
 * `/api/lead/`. The redirect works — 308 preserves the method and body — but it
 * doubles the round trips on every submission.
 */
const LEAD_ENDPOINT = "/api/lead/";

/**
 * A stalled request would otherwise pin the button on "Sending…" forever, since
 * fetch has no default timeout. Twelve seconds sits just past the server's own
 * 8s upstream timeout, so a server-side failure gets to return a real error
 * before the client gives up on it.
 */
const REQUEST_TIMEOUT_MS = 12_000;

function timeoutSignal(): AbortSignal | undefined {
  // AbortSignal.timeout is in every browser this site targets (see the
  // browserslist in package.json); guarded anyway so an old bot UA can't throw.
  return typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
    ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    : undefined;
}

export type LeadInput = {
  // All optional: the payload is assembled from a FormData bag, and the
  // form's own `required` attributes guarantee name + a contact method
  // before submit ever runs. The server validates regardless.
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  sport?: string;
  who?: string;
  challenge?: string;
  goal?: string;
  magnet?: string;
  /** Honeypot. Hidden from humans; a filled value marks the sender a bot. */
  company?: string;
};

export type LeadResult = {
  /** Did the lead reach the CRM queue? Drives the form's success copy. */
  forwarded: boolean;
  /** Server request id, echoed in `x-request-id` — quote it in support. */
  requestId?: string;
};

/**
 * Submit a lead.
 *
 * Never throws for an ordinary failure: a rejected or unreachable server
 * resolves with `forwarded: false` so the caller can show its WhatsApp
 * fallback. `source`, `stage`, `status` and the submission date are deliberately
 * NOT sent — the server owns them, precisely so a client cannot choose them.
 */
export async function submitLead(
  input: LeadInput,
  turnstileToken?: string
): Promise<LeadResult> {
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Same-origin only; no credentials are needed or wanted.
      credentials: "omit",
      body: JSON.stringify({
        name: input.name ?? "",
        phone: input.phone ?? "",
        email: input.email ?? "",
        age: input.age ?? "",
        sport: input.sport ?? "",
        who: input.who ?? "",
        challenge: input.challenge ?? "",
        goal: input.goal ?? "",
        magnet: input.magnet ?? "",
        company: input.company ?? "",
        landingPage: typeof window !== "undefined" ? window.location.href : "",
        turnstileToken: turnstileToken ?? "",
      }),
      signal: timeoutSignal(),
    });

    const requestId = res.headers.get("x-request-id") ?? undefined;
    return { forwarded: res.ok, requestId };
  } catch {
    // Offline, timed out, or blocked. The form's WhatsApp fallback covers it.
    return { forwarded: false };
  }
}
