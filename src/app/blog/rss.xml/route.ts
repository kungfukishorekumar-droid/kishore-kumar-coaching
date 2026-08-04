import { SEO } from "@/lib/seo";
import { SORTED_POSTS } from "@/content/blog";

export const revalidate = 86400;

/**
 * RSS 2.0 feed for the blog.
 *
 * Worth having for two reasons beyond human subscribers: feed readers and
 * aggregators discover new posts without waiting for a crawl, and the feed is
 * a second machine-readable surface describing the same content, which helps
 * answer engines associate the articles with the author entity.
 *
 * XML-escaping is mandatory here, not defensive: several post titles contain
 * ampersands and curly quotes, and a single unescaped `&` makes the whole feed
 * unparseable — feed errors fail silently in most readers.
 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const site = SEO.siteUrl;
  const now = new Date().toUTCString();

  const items = SORTED_POSTS.map((p) => {
    const url = `${site}/blog/${p.slug}`;
    return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.description)}</description>
      <content:encoded><![CDATA[<p>${p.quickAnswer}</p>]]></content:encoded>
      <dc:creator>${escapeXml(SEO.founder)}</dc:creator>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${SEO.founder} — Sports Psychology &amp; Martial Arts`)}</title>
    <link>${site}/blog</link>
    <description>${escapeXml(
      "Practical articles on athlete mindset, focus, confidence and martial arts training from Chennai."
    )}</description>
    <language>en-IN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${site}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate",
    },
  });
}
