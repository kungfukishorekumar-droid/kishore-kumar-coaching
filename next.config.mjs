/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kishorekumar.coach";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 * - 'unsafe-inline' on script-src is required by Next.js hydration + Framer Motion.
 * - 'unsafe-eval' is required by React dev mode + Turbopack HMR, so it is added
 *   ONLY in development. Production omits it (React never uses eval in prod).
 * - upgrade-insecure-requests only in production (breaks localhost HTTP).
 * - HSTS only in production (HSTS on localhost can lock out the browser).
 */
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "img-src 'self' data: blob:",
  "font-src 'self' fonts.gstatic.com data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only force HTTPS upgrades in production — on localhost this breaks resources
  ...(isProd ? ["upgrade-insecure-requests"] : []),
];

const csp = cspDirectives.join("; ");

const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Fix Turbopack workspace-root when there are multiple lockfiles in parent dirs
  turbopack: {
    root: __dirname,
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), serial=()",
      },
      { key: "Content-Security-Policy", value: csp },
    ];

    // HSTS only in production — caching it on localhost can lock the browser
    // into HTTPS-only mode for localhost, which breaks future dev sessions
    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // CORS: API routes only accept our own origin
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: SITE_URL },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
