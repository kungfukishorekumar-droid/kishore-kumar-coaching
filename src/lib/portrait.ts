import { PHOTOS } from "@/lib/media";

/**
 * The hero portrait — the page's LCP element — as a responsive set.
 * Now a view over the photo registry (src/lib/media.ts), which owns the files,
 * the descriptive file names and the alt text.
 */
export const PORTRAIT = {
  src: PHOTOS.portrait.src,
  width: 800,
  height: 1000,
  srcSet: PHOTOS.portrait.srcSet,
  /**
   * Must match the rendered width of the portrait column (Hero.tsx):
   * max-w-sm / sm:max-w-md below lg, ~560px column on desktop. Phones are the
   * viewport minus the 16px container gutters.
   */
  sizes: "(min-width: 1024px) 560px, (min-width: 640px) 448px, calc(100vw - 32px)",
  alt: PHOTOS.portrait.alt,
  /** Tiny avatar uses (chat bubbles) — the 400w file. */
  small: PHOTOS.portrait.srcSet.split(", ")[0].split(" ")[0],
} as const;
