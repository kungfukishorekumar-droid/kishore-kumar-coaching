export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Every page is crawlable, and so are the CSS/JS bundles under
        // /_next/static/. Google renders a page before judging it, so blocking
        // those makes it see an unstyled, un-hydrated shell — Search Console
        // reports it as "Page indexed without content" or mobile-usability
        // failures. Google's own guidance is to allow CSS and JS.
        //
        // There is nothing else to hide: this is a static export, so /api/
        // doesn't exist and /_next/ contains only build assets.
        allow: "/",
      },
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
    host: SEO.siteUrl,
  };
}
