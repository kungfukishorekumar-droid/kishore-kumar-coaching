import portrait400 from "@/assets/photos/kishore-kumar-sports-psychologist-chennai-400.webp";
import portrait560 from "@/assets/photos/kishore-kumar-sports-psychologist-chennai-560.webp";
import portrait720 from "@/assets/photos/kishore-kumar-sports-psychologist-chennai-720.webp";
import portrait900 from "@/assets/photos/kishore-kumar-sports-psychologist-chennai-900.webp";
import portrait1122 from "@/assets/photos/kishore-kumar-sports-psychologist-chennai-1122.webp";
import gesture640 from "@/assets/photos/kishore-kumar-martial-arts-mindset-coach-640.webp";
import gesture960 from "@/assets/photos/kishore-kumar-martial-arts-mindset-coach-960.webp";
import gesture1280 from "@/assets/photos/kishore-kumar-martial-arts-mindset-coach-1280.webp";
import gesture1672 from "@/assets/photos/kishore-kumar-martial-arts-mindset-coach-1672.webp";
import heroWide640 from "@/assets/photos/kishore-kumar-mind-technique-body-640.webp";
import heroWide960 from "@/assets/photos/kishore-kumar-mind-technique-body-960.webp";
import heroWide1280 from "@/assets/photos/kishore-kumar-mind-technique-body-1280.webp";
import heroWide1672 from "@/assets/photos/kishore-kumar-mind-technique-body-1672.webp";
import strongMind640 from "@/assets/photos/strong-mind-stronger-you-kishore-kumar-640.webp";
import strongMind960 from "@/assets/photos/strong-mind-stronger-you-kishore-kumar-960.webp";
import strongMind1280 from "@/assets/photos/strong-mind-stronger-you-kishore-kumar-1280.webp";
import strongMind1672 from "@/assets/photos/strong-mind-stronger-you-kishore-kumar-1672.webp";
import type { StaticImageData } from "next/image";
import { SEO } from "@/lib/seo";

/**
 * Every photograph on the site, in one place.
 *
 * ── Why a registry ──────────────────────────────────────────────────────────
 * The site has four photographs, all studio portraits of Kishore Kumar. Blog
 * posts used to carry their own alt text, written for the ARTICLE rather than
 * the IMAGE: the arms-crossed portrait was described as "Children's martial
 * arts class in Chennai", the "Strong Mind. Stronger You." banner as "School
 * athletes in a mental skills workshop". That misleads screen-reader users,
 * and Google compares alt text against what an image shows — a mismatch reads
 * as keyword stuffing, not relevance. Alt text now belongs to the photo and
 * is written once, describing what is actually in it.
 *
 * ── Files ───────────────────────────────────────────────────────────────────
 * Imported rather than served from public/: the build emits them under
 * /_next/static/media/ with a content hash and `immutable` caching (Hostinger
 * serves public/ with no Cache-Control at all), and the descriptive file names
 * survive into the URL, which image search reads. Generated with sharp from the
 * original JPEGs in public/images/ (webp q78). The public/ copies stay so
 * existing links to them keep working.
 *
 * ── Credit ──────────────────────────────────────────────────────────────────
 * Deliberately no `creator` / `copyrightNotice` in the structured data: the
 * photographer is not recorded here, and asserting ownership of someone else's
 * photograph would be false. Add them once known — Google Images then shows
 * the credit.
 */

export type Photo = {
  id: string;
  /** Mid-size variant, for anything that ignores srcset. */
  src: string;
  srcSet: string;
  /** Largest variant — what structured data, the image sitemap and Google Images use. */
  full: { src: string; width: number; height: number };
  /** Intrinsic aspect, for width/height attributes (prevents layout shift). */
  width: number;
  height: number;
  /** Describes what is IN the photo. Never the article it illustrates. */
  alt: string;
  /** Longer description for structured data and image search. */
  caption: string;
};

function photo(
  id: string,
  variants: StaticImageData[],
  defaultWidth: number,
  alt: string,
  caption: string
): Photo {
  const full = variants[variants.length - 1];
  const fallback = variants.find((v) => v.width === defaultWidth) ?? full;
  return {
    id,
    src: fallback.src,
    srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(", "),
    full: { src: full.src, width: full.width, height: full.height },
    width: full.width,
    height: full.height,
    alt,
    caption,
  };
}

export const PHOTOS = {
  portrait: photo(
    "portrait",
    [portrait400, portrait560, portrait720, portrait900, portrait1122],
    720,
    "Kishore Kumar, sports psychologist and martial arts coach in Chennai, standing in a black suit with his arms crossed",
    "Kishore Kumar — sports psychologist, National Wushu Medalist and martial arts coach in Chennai."
  ),
  gesture: photo(
    "gesture",
    [gesture640, gesture960, gesture1280, gesture1672],
    1280,
    "Kishore Kumar in a black suit gesturing with an open palm, a martial artist's kicking silhouette behind him",
    "Kishore Kumar, athlete mindset and martial arts coach, Spartacus Martial Arts Chennai."
  ),
  heroWide: photo(
    "heroWide",
    [heroWide640, heroWide960, heroWide1280, heroWide1672],
    1280,
    "Kishore Kumar in a black suit beside the kanji 心技体 — mind, technique, body — with a martial artist kicking in silhouette",
    "Kishore Kumar with 心技体 (shin-gi-tai: mind, technique, body) — the principle behind the Warrior Mind Method."
  ),
  strongMind: photo(
    "strongMind",
    [strongMind640, strongMind960, strongMind1280, strongMind1672],
    1280,
    "Kishore Kumar seated beside the words “Strong Mind. Stronger You.” — Sports Psychology & Martial Arts Coach",
    "“Strong Mind. Stronger You.” — Kishore Kumar, sports psychology and martial arts coach, Chennai."
  ),
} as const satisfies Record<string, Photo>;

export type PhotoId = keyof typeof PHOTOS;

/** Content written before the registry refers to photos by their public/ path. */
const LEGACY: Record<string, PhotoId> = {
  "/images/portrait.webp": "portrait",
  "/images/gesture.webp": "gesture",
  "/images/hero-wide.webp": "heroWide",
  "/images/strong-mind.webp": "strongMind",
};

export function photoFor(pathOrId: string): Photo {
  const id = (LEGACY[pathOrId] ?? pathOrId) as PhotoId;
  const p = PHOTOS[id];
  if (!p) throw new Error(`Unknown photo: ${pathOrId}`);
  return p;
}

export const absolute = (path: string) => (path.startsWith("http") ? path : `${SEO.siteUrl}${path}`);

/**
 * schema.org ImageObject for a photo. Every photo is of Kishore Kumar, so each
 * one points `about` at his Person entity — that is what ties the image to the
 * entity in image search and knowledge panels.
 */
export function imageObject(p: Photo, id?: string) {
  return {
    "@type": "ImageObject",
    ...(id ? { "@id": id } : {}),
    url: absolute(p.full.src),
    contentUrl: absolute(p.full.src),
    width: p.full.width,
    height: p.full.height,
    caption: p.caption,
    description: p.alt,
    inLanguage: "en-IN",
    about: { "@id": `${SEO.siteUrl}/#kishore` },
  };
}
