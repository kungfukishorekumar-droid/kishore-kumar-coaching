import { SORTED_POSTS } from "@/content/blog";
import { topics } from "@/content/topics";
import { PROGRAMS } from "@/lib/site";

/**
 * Every share card on the site, by key. The key is also its URL:
 * "blog/build-focus-for-competition" → /og/blog/build-focus-for-competition.jpg
 *
 * ── Why .jpg URLs and not Next's opengraph-image convention ─────────────────
 * The convention serves cards at extension-less URLs (/blog/x/opengraph-image)
 * and this site sets `trailingSlash: true`, so every card answered with a 308
 * redirect to a slashed URL. Facebook, LinkedIn and X follow that; WhatsApp's
 * previewer does not reliably — and WhatsApp is where this site's links get
 * shared. Paths with a file extension are exempt from the trailing-slash
 * redirect (the same reason /sitemap.xml and /robots.txt work), so a .jpg URL
 * is served directly.
 *
 * ── Why JPEG ────────────────────────────────────────────────────────────────
 * The renderer outputs PNG, and a photographic 1200×630 PNG came out at
 * ~400KB. WhatsApp tends to drop the preview image above roughly 300KB, so the
 * route re-encodes to JPEG (~70–100KB) at build time.
 */

export type Card = { eyebrow: string; title: string; alt: string };

function build(): Map<string, Card> {
  const cards = new Map<string, Card>();
  cards.set("home", {
    eyebrow: "Sports Psychology × Martial Arts",
    title: "Train your mind like a warrior. Perform like a champion.",
    alt: "Kishore Kumar — Sports Psychology & Martial Arts Coach in Chennai",
  });
  cards.set("blog", {
    eyebrow: `Blog · ${SORTED_POSTS.length} articles`,
    title: "The mental game, written down",
    alt: "Blog by Kishore Kumar, sports psychology and martial arts coach",
  });
  cards.set("programs", {
    eyebrow: "Programmes",
    title: "Choose your path",
    alt: "Coaching programmes by Kishore Kumar, Chennai",
  });
  cards.set("about", {
    eyebrow: "About",
    title: "Who is Kishore Kumar?",
    alt: "About Kishore Kumar — sports psychologist, National Wushu Medalist and martial arts coach",
  });
  for (const p of SORTED_POSTS) {
    cards.set(`blog/${p.slug}`, {
      eyebrow: p.category,
      title: p.title,
      alt: `${p.title} — article by Kishore Kumar`,
    });
  }
  for (const p of PROGRAMS) {
    cards.set(`programs/${p.slug}`, {
      eyebrow: `Programme · ${p.badge}`,
      title: p.name,
      alt: `${p.name} — coaching programme by Kishore Kumar, Chennai`,
    });
  }
  for (const [slug, t] of topics()) {
    cards.set(`blog/topic/${slug}`, {
      eyebrow: `${t.count} articles`,
      title: t.name,
      alt: `${t.name} — articles by Kishore Kumar`,
    });
  }
  return cards;
}

let cache: Map<string, Card> | null = null;
export const CARDS = () => (cache ??= build());

export const cardUrl = (key: string) => `/og/${key}.jpg`;

/**
 * openGraph.images + twitter.images for a page. Explicit on every page because
 * a page that sets its own `openGraph` replaces the layout's entirely.
 */
export function shareImages(key: string) {
  const card = CARDS().get(key);
  if (!card) throw new Error(`No share card for "${key}" — add it to src/lib/og-cards.ts`);
  const image = { url: cardUrl(key), width: 1200, height: 630, type: "image/jpeg", alt: card.alt };
  return { og: [image], twitter: [image] };
}
