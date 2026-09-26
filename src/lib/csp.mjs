/**
 * Content-Security-Policy — the one definition, delivered two ways.
 *
 * 1. As a response header, from next.config.mjs.
 * 2. As <meta http-equiv="Content-Security-Policy"> in the root layout.
 *
 * Why both: on Hostinger the platform's "Force HTTPS" layer REPLACES our
 * Content-Security-Policy header with its own `upgrade-insecure-requests`, on
 * every response. Our other security headers get through untouched; this one
 * alone was stripped, so in production the site ran with effectively no CSP.
 * A policy in the document itself is out of the platform's reach. When a page
 * has both a header policy and a meta policy the browser enforces both, so the
 * platform's header and ours combine instead of one erasing the other — and if
 * the platform stops overriding, the two copies simply agree.
 *
 * Plain .mjs so next.config.mjs can import it; the layout imports it too
 * (allowJs is on).
 */

/**
 * CSP notes:
 *  • 'unsafe-inline' on script-src is required by Next's hydration bootstrap.
 *  • 'unsafe-eval' only in dev (React refresh / Turbopack need it); production
 *    omits it.
 *  • Cloudflare is needed by Turnstile; youtube-nocookie by the blog video
 *    embeds.
 *
 * `connect-src` allows exactly two hosts beyond 'self', both required by
 * warriorcrm.js (see the layout): the CRM origin it is served from, and the
 * Supabase project it writes visits and backup leads into.
 *
 * ── What that costs, stated plainly ──────────────────────────────────────────
 * This partially re-opens something the server-side lead path closed. Form
 * submissions still go to /api/lead/ and the browser still holds no credential
 * of OURS — but warriorcrm.js ships the CRM's own publishable Supabase key and
 * POSTs to the queue directly, so an attacker who injects a script into this
 * page can once again reach that queue. The key is insert-only under RLS (it
 * cannot read a single row back), so the exposure is junk rows in the inbox,
 * not disclosure of anyone's leads. Narrowed to these two hosts on purpose:
 * without them the tag loads and silently does nothing, which is the worse
 * outcome — analytics that look installed and record nothing.
 */
const TURNSTILE_HOST = "https://challenges.cloudflare.com";
/** Serves warriorcrm.js — visitor tracking + backup lead capture. */
const CRM_HOST = "https://crm.spartacusmartialarts.com";
/** The queue warriorcrm.js posts into. NOT this site's own Supabase project —
 *  it is the CRM's shared inbox, and the value is baked into that script. */
export const CRM_INBOX_HOST = "https://oqwbmtdrjxfbnitlzehe.supabase.co";

/**
 * Build the policy string.
 *
 * @param {{ isProd: boolean, forMeta?: boolean }} opts
 *   forMeta — the <meta http-equiv> copy in the root layout. Browsers ignore
 *   `frame-ancestors` there (and log a console warning for it), so it is left
 *   out; framing is still refused by the X-Frame-Options: DENY header, which
 *   does reach visitors.
 * @returns {string}
 */
export function buildCsp({ isProd, forMeta = false }) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} ${TURNSTILE_HOST} ${CRM_HOST}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.ytimg.com",
    "font-src 'self' data:",
    `connect-src 'self' ${TURNSTILE_HOST} ${CRM_HOST} ${CRM_INBOX_HOST}`,
    "worker-src 'self' blob:",
    `frame-src https://www.youtube-nocookie.com ${TURNSTILE_HOST}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(forMeta ? [] : ["frame-ancestors 'none'"]),
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
