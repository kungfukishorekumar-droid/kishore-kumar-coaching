import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";
import { PROGRAMS } from "@/lib/site";

// Approximate "last meaningful content update" dates — update when content changes
const HOME_UPDATED = new Date("2026-06-19");
const PROGRAMS_UPDATED = new Date("2026-06-19");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SEO.siteUrl,
      lastModified: HOME_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SEO.siteUrl}/programs`,
      lastModified: PROGRAMS_UPDATED,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Individual program pages (SSG)
    ...PROGRAMS.map((p) => ({
      url: `${SEO.siteUrl}/programs/${p.slug}`,
      lastModified: PROGRAMS_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
