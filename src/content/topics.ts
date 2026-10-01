import { SORTED_POSTS } from "@/content/blog";

/**
 * Topic hubs, derived from post categories. One definition, used by the topic
 * pages, their share cards and the sitemap, so the three can never disagree
 * about which hubs exist or what they are called.
 */
export const topicSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function topics() {
  const map = new Map<string, { name: string; count: number }>();
  for (const p of SORTED_POSTS) {
    const slug = topicSlug(p.category);
    map.set(slug, { name: p.category, count: (map.get(slug)?.count ?? 0) + 1 });
  }
  return map;
}
