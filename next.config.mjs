/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === "production";

/**
 * Server (Node) build — Hostinger runs this as a real Next.js app.
 *
 * It previously used `output: "export"`, on the assumption Hostinger could only
 * serve static files. The live site proves otherwise: responses carry
 * `x-nextjs-cache`, `x-nextjs-prerender` and `x-nextjs-stale-time`, and
 * /blog/index.html 404s (a static export would serve that file straight off
 * disk). So there is a Node runtime, and exporting was costing us:
 *
 *   • security headers — headers() below is ignored by the exporter, so they
 *     were moved to public/.htaccess, which Apache reads and Node does NOT.
 *     Net effect: the live site was serving no HSTS, no X-Frame-Options and
 *     only a stub CSP. Moving them back here is the actual fix.
 *   • next/image — `unoptimized: true` disabled resizing and AVIF/WebP
 *     negotiation entirely.
 *   • ISR and route handlers.
 *
 * trailingSlash stays true: every URL is already indexed and sitemapped with a
 * trailing slash, and changing it now would 301 the whole site.
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
const CRM_INBOX_HOST = "https://oqwbmtdrjxfbnitlzehe.supabase.co";

const csp = [
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
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), serial=()",
  },
  { key: "Content-Security-Policy", value: csp },
  // HSTS in production only — caching it against localhost would force the
  // browser to HTTPS there and break future dev sessions.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  // Trim the response a little and stop advertising the framework version.
  poweredByHeader: false,
  compress: true,

  images: {
    // Now that a server exists, let Next negotiate modern formats and sizes.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1920],
  },

  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Fingerprinted build assets are safe to cache forever.
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Images are stable but replaceable — long cache, revalidatable.
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
