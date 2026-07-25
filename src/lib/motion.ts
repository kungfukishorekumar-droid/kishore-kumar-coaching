import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens — the single source of truth for animation across the site.
 *
 * Why this file exists: without shared tokens every component invents its own
 * duration and curve, and the page ends up feeling like several sites stitched
 * together. Everything below is tuned to one rhythm.
 *
 * Rules encoded here:
 *  • Micro-interactions land in 150–300ms; entrances stay under 700ms.
 *  • Exits run ~65% of their entrance so dismissing feels instant.
 *  • Enter with ease-out, leave with ease-in.
 *  • Only transform + opacity are animated (never width/height/top/left),
 *    so nothing triggers layout and every frame stays on the compositor.
 */

/* ── Easing ───────────────────────────────────────────────────────────── */

export const ease = {
  /** Default for entrances — decisive start, soft landing. */
  out: [0.22, 0.61, 0.36, 1] as const,
  /** For exits — eases away without hanging around. */
  in: [0.55, 0.06, 0.68, 0.19] as const,
  /** Both ends, for moves that start and stop on screen. */
  inOut: [0.65, 0.05, 0.36, 1] as const,
  /** Slight overshoot — use for badges, emblems, things that "arrive". */
  overshoot: [0.34, 1.56, 0.64, 1] as const,
} as const;

/* ── Duration (seconds) ───────────────────────────────────────────────── */

export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.55,
  reveal: 0.7,
} as const;

/* ── Springs — for anything the pointer drives directly ───────────────── */

export const spring = {
  /** Snappy press/hover response. */
  press: { type: "spring", stiffness: 420, damping: 28, mass: 0.7 },
  /** Softer, for floating and parallax. */
  float: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
} satisfies Record<string, Transition>;

/* ── Shared variants ──────────────────────────────────────────────────── */

/** Standard scroll-in: rise, sharpen, fade up. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.reveal, ease: ease.out },
  },
};

/** Same feel, no vertical travel — for items already in place. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

/** Arrives with a touch of scale — badges, emblems, medals. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.overshoot },
  },
};

/**
 * Stagger container. 45ms reads as a deliberate cascade; past ~80ms the last
 * item feels late and users start scrolling before it lands.
 */
export const staggerContainer = (stagger = 0.045, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/* ── Viewport defaults ────────────────────────────────────────────────── */

/**
 * Fire slightly before the element is fully on screen, and only once —
 * re-animating on every scroll-by is the fastest way to make a page feel cheap.
 */
export const viewportOnce = { once: true, margin: "-12% 0px -8% 0px" } as const;

/* ── Reduced motion ───────────────────────────────────────────────────── */

/**
 * Swap any variant set for this when the user asks for reduced motion:
 * content still arrives, it just arrives without travel or blur.
 */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.fast, ease: ease.out } },
};
