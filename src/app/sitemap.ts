import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";
import { PROGRAMS } from "@/lib/site";
import { SORTED_POSTS } from "@/content/blog";

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
    {
      url: `${SEO.siteUrl}/blog`,
      lastModified: new Date(SORTED_POSTS[0]?.publishedAt ?? HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Articles. lastModified comes from the post's own dates, so the sitemap
    // stays honest without anyone remembering to touch this file.
    ...SORTED_POSTS.map((p) => ({
      url: `${SEO.siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
