import { describe, expect, it, vi } from "vitest";
// Next's own serializer — the exact function that turns sitemap() into the
// XML the server sends, so this tests what Google actually receives.
import { resolveSitemap } from "next/dist/build/webpack/loaders/metadata/resolve-route-data";

/**
 * The sitemap is the one file whose failure is silent and total: if it stops
 * being well-formed XML, Google rejects every URL in it. That happened when
 * video entries were added — Next writes video <title>/<description>
 * unescaped, and four YouTube titles contain "&".
 */

// The photo registry imports .webp files through Next's image loader, which
// only exists inside a Next build. The sitemap only needs URLs from it.
vi.mock("@/lib/media", () => {
  const p = {
    src: "/_next/static/media/photo.webp",
    srcSet: "",
    full: { src: "/_next/static/media/photo-full.webp", width: 1672, height: 941 },
    width: 1672,
    height: 941,
    alt: "alt",
    caption: "caption",
  };
  return {
    PHOTOS: { portrait: p, gesture: p, heroWide: p, strongMind: p },
    photoFor: () => p,
    absolute: (s: string) => (s.startsWith("http") ? s : `https://kishorekumarcoach.com${s}`),
    imageObject: () => ({}),
  };
});

const { default: sitemap } = await import("@/app/sitemap");
const xml: string = resolveSitemap(sitemap());
const count = (s: string) => xml.split(s).length - 1;

describe("sitemap.xml", () => {
  it("is well-formed: every & starts an entity", () => {
    expect(xml.match(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/gi)).toBeNull();
    expect(xml).not.toMatch(/<(video:title|video:description)>[^<]*[<>][^<]*<\//);
  });

  it("has balanced url, image and video elements", () => {
    expect(count("<url>")).toBe(count("</url>"));
    expect(count("<image:image>")).toBe(count("</image:image>"));
    expect(count("<video:video>")).toBe(count("</video:video>"));
  });

  it("declares the image and video namespaces it uses", () => {
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
  });

  it("escapes video titles rather than dropping them", () => {
    expect(xml).toContain("Kung Fu, Karate &amp; Silambam");
  });

  it("lists at least one image for every URL", () => {
    const urls = xml.split("<url>").slice(1);
    for (const u of urls) expect(u).toContain("<image:loc>");
  });

  it("includes the about page, with trailing slashes throughout", () => {
    expect(xml).toContain("<loc>https://kishorekumarcoach.com/about/</loc>");
    const locs = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const loc of locs) expect(loc.endsWith("/")).toBe(true);
  });
});
