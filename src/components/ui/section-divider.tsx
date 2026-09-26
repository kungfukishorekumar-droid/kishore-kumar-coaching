"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease, duration, viewportOnce } from "@/lib/motion";

/**
 * Divider between sections — the page's punctuation.
 *
 * Two gold hairlines draw outward from a slowly rotating diamond as the
 * divider enters view. It gives the long scroll a beat between chapters
 * instead of one continuous wall of content, and signals "new section"
 * before the heading has to.
 *
 * The lines animate scaleX (compositor-only) rather than width, so nothing
 * reflows. Under reduced motion they're simply present, unrotated and undrawn.
 */
export function SectionDivider({
  className,
  tint = "gold",
}: {
  className?: string;
  tint?: "gold" | "electric";
}) {
  const reduce = useReducedMotion();

  const line =
    tint === "gold"
      ? "from-transparent via-gold-400/50 to-transparent"
      : "from-transparent via-electric-500/50 to-transparent";
  const mark = tint === "gold" ? "border-gold-400/60" : "border-electric-500/60";
  const glow = tint === "gold" ? "bg-gold-400/60" : "bg-electric-500/60";

  return (
    <div
      aria-hidden="true"
      className={cn("relative flex items-center justify-center gap-4 py-2", className)}
    >
      {/* The slash — a streak of light that crosses the divider as it passes
          mid-screen. Scroll-driven in CSS (.divider-slash); absent entirely
          where scroll timelines or motion are not available. overflow-CLIP,
          not hidden: a hidden wrapper would become the slash's scroll
          container and freeze its timeline. */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-clip">
        <span
          className={cn(
            "divider-slash absolute inset-y-0 left-0 w-full opacity-0 bg-gradient-to-r from-transparent to-transparent",
            tint === "gold" ? "via-gold-100" : "via-electric-300"
          )}
          style={{ boxShadow: tint === "gold" ? "0 0 12px 2px rgba(240,207,133,0.55)" : "0 0 12px 2px rgba(125,174,255,0.55)" }}
        />
      </span>
      <motion.span
        className={cn("h-px flex-1 origin-right bg-gradient-to-r", line)}
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: duration.slow, ease: ease.out }}
      />

      <motion.span
        className="relative grid size-3 place-items-center"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: duration.base, ease: ease.overshoot, delay: 0.15 }}
      >
        <span className={cn("absolute inset-0 rounded-[2px] blur-[6px]", glow)} />
        <span
          className={cn(
            "size-full rotate-45 border bg-ink/60",
            mark,
            !reduce && "motion-safe:animate-spin-slow"
          )}
        />
      </motion.span>

      <motion.span
        className={cn("h-px flex-1 origin-left bg-gradient-to-r", line)}
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: duration.slow, ease: ease.out }}
      />
    </div>
  );
}
