import p400 from "@/assets/portrait/portrait-400.webp";
import p560 from "@/assets/portrait/portrait-560.webp";
import p720 from "@/assets/portrait/portrait-720.webp";
import p900 from "@/assets/portrait/portrait-900.webp";
import p1122 from "@/assets/portrait/portrait-1122.webp";

/**
 * The hero portrait — the page's LCP element — as a responsive set.
 *
 * Two problems this solves, both flagged by Lighthouse on the live site:
 *
 *  1. Size. Every visitor downloaded the full 1122×1402 file (48KB) to show it
 *     at ~362×453 on a phone. A 1.75×-density phone now takes the 720w
 *     variant (21KB); a 3× phone the 1122w; desktop around 560–900.
 *
 *  2. Caching. Files under public/ are served by Hostinger's web server
 *     directly and never reach Next.js, so they went out with NO
 *     Cache-Control at all — every repeat visit re-downloaded the portrait.
 *     Importing the files instead makes the build emit them under
 *     /_next/static/media/ with a content hash, which Next serves with
 *     `public, max-age=31536000, immutable`.
 *
 * Generated from public/images/portrait.webp with sharp (webp q78). The
 * public copy stays: structured data and social previews link to it by URL.
 */
export const PORTRAIT = {
  src: p720.src,
  width: 800,
  height: 1000,
  srcSet: [p400, p560, p720, p900, p1122].map((i) => `${i.src} ${i.width}w`).join(", "),
  /**
   * Must match the rendered width of the portrait column (Hero.tsx):
   * max-w-sm / sm:max-w-md below lg, ~560px column on desktop. Phones are the
   * viewport minus the 16px container gutters.
   */
  sizes: "(min-width: 1024px) 560px, (min-width: 640px) 448px, calc(100vw - 32px)",
  /** Tiny avatar uses (chat bubbles) — no reason to fetch more than 400w. */
  small: p400.src,
} as const;
