export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";
import { PROGRAMS } from "@/lib/site";
import { SORTED_POSTS } from "@/content/blog";
import { topics } from "@/content/topics";
import { PHOTOS, absolute } from "@/lib/media";
import { cardUrl } from "@/lib/og-cards";

// Approximate "last meaningful content update" dates — update when content changes
const HOME_UPDATED = new Date("2026-10-01");
const PROGRAMS_UPDATED = new Date("2026-10-01");

/**
 * next.config sets `trailingSlash: true`, so every real URL ends in a slash and
 * the slash-less form 301s to it. A sitemap listing the slash-less form makes
 * Google crawl a redirect and file the entry under "Page with redirect" instead
 * of indexing it, so the URLs here must match what the server actually serves.
 */
const url = (path = "") => `${SEO.siteUrl}/${path ? `${path}/` : ""}`;

/**
 * Image sitemap entries. Google discovers images it would otherwise miss —
 * srcset candidates and CSS backgrounds are invisible to it — and ties each
 * image to the page it belongs to. Every page lists its share card; pages that
 * show a photograph list the full-size file.
 */
const card = (key: string) => absolute(cardUrl(key));

/**
 * Next writes video <title> and <description> into the XML verbatim — it does
 * not escape them (verified on Next 16.3.6). Four YouTube titles contain a bare
 * "&" ("Kung Fu, Karate & Silambam"), which made the WHOLE sitemap invalid XML,
 * so Google would have rejected every URL in it, not just the video entries.
 * Escaped here; src/app/sitemap.test.ts parses the output to keep it valid.
 */
export const xmlText = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const photo = (p: { full: { src: string } }) => absolute(p.full.src);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: url(),
      lastModified: HOME_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        photo(PHOTOS.portrait),
        photo(PHOTOS.heroWide),
        photo(PHOTOS.gesture),
        photo(PHOTOS.strongMind),
        card("home"),
      ],
    },
    {
      url: url("about"),
      lastModified: HOME_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [photo(PHOTOS.portrait), photo(PHOTOS.heroWide), card("about")],
    },
    {
      url: url("programs"),
      lastModified: PROGRAMS_UPDATED,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [card("programs")],
    },
    // Individual program pages (SSG)
    ...PROGRAMS.map((p) => ({
      url: url(`programs/${p.slug}`),
      lastModified: PROGRAMS_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [card(`programs/${p.slug}`)],
    })),
    {
      url: url("blog"),
      lastModified: new Date(SORTED_POSTS[0]?.publishedAt ?? HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 0.8,
      images: [card("blog")],
    },
    // Articles. lastModified comes from the post's own dates, so the sitemap
    // stays honest without anyone remembering to touch this file.
    ...SORTED_POSTS.map((p) => ({
      url: url(`blog/${p.slug}`),
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
      images: [...(p.photo ? [photo(p.photo)] : []), card(`blog/${p.slug}`)],
      // Video entries for the posts built around a YouTube Short, so the
      // article — not only the YouTube page — can appear in video results.
      ...(p.video
        ? {
            videos: [
              {
                title: xmlText(p.video.title),
                description: xmlText(p.description),
                thumbnail_loc: `https://i.ytimg.com/vi/${p.video.id}/hqdefault.jpg`,
                player_loc: `https://www.youtube-nocookie.com/embed/${p.video.id}`,
                publication_date: p.publishedAt,
                family_friendly: "yes" as const,
              },
            ],
          }
        : {}),
    })),
    // Topic hubs, derived from the same categories the pages are built from.
    ...[...topics().keys()].map((topic) => ({
      url: url(`blog/topic/${topic}`),
      lastModified: new Date(SORTED_POSTS[0]?.publishedAt ?? HOME_UPDATED),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: [card(`blog/topic/${topic}`)],
    })),
  ];
}
