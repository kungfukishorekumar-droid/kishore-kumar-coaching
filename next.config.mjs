/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Static-export build for Hostinger shared hosting.
 *
 * `output: "export"` writes a fully static site to `out/`, which is what you
 * upload to public_html. There is no Node server, so:
 *   • images must be unoptimized (no on-demand /_next/image endpoint)
 *   • security headers move to public/.htaccess — headers() here is ignored by
 *     the exporter, so it is intentionally gone
 *   • there are no API routes or ISR; the lead form posts straight to Supabase
 *     from the browser instead.
 *
 * trailingSlash makes every route a real folder (/blog/slug/index.html), which
 * Apache/LiteSpeed serve without any rewrite rules.
 */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
