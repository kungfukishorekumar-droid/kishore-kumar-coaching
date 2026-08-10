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
 *  • Supabase host is needed by the lead form; Cloudflare by Turnstile;
 *    youtube-nocookie by the blog video embeds.
 */
const SUPABASE_HOST = "https://oqwbmtdrjxfbnitlzehe.supabase.co";
const TURNSTILE_HOST = "https://challenges.cloudflare.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} ${TURNSTILE_HOST}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_HOST} ${TURNSTILE_HOST}`,
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
