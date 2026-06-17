import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";
import { PROGRAMS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SEO.siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SEO.siteUrl}/programs`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...PROGRAMS.map((p) => ({
      url: `${SEO.siteUrl}/programs/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
