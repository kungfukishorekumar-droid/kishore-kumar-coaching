"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Reading-progress bar pinned to the top of the viewport.
 *
 * This page is a long scroll-told story — roughly 17,000px — and a progress
 * bar is the cheapest way to tell someone how much is left, which keeps them
 * scrolling instead of guessing.
 *
 * scaleX on a transform-only element, so it costs nothing per frame. The
 * spring stops it twitching on trackpads with momentum; under reduced motion
 * it tracks scroll directly with no smoothing.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-electric-400 shadow-[0_0_12px_rgba(224,169,60,0.55)]"
    />
  );
}
