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
        // /_next/ contains only build assets, so it stays crawlable.
        allow: "/",
        // The API is not content. /api/lead/ only answers POST and /api/health/
        // is an operator probe — neither belongs in an index, and crawling them
        // just burns crawl budget on 405s.
        disallow: "/api/",
      },
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
    host: SEO.siteUrl,
  };
}
