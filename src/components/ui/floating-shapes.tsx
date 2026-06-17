"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Shape = {
  className: string;
  size: number;
  /** gradient tint */
  tint: "gold" | "electric";
  duration: number;
  delay?: number;
};

/**
 * Decorative floating 3D spheres / glow orbs for section backdrops.
 * Pure CSS gradients + Framer Motion — no 3D library, GPU-light.
 */
export function FloatingShapes({
  shapes,
  className,
}: {
  shapes: Shape[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full blur-2xl", s.className)}
          style={{
            width: s.size,
            height: s.size,
            background:
              s.tint === "gold"
                ? "radial-gradient(circle at 30% 30%, rgba(224,206,156,0.17), rgba(207,156,58,0.06) 45%, transparent 70%)"
                : "radial-gradient(circle at 30% 30%, rgba(140,175,235,0.15), rgba(59,130,246,0.06) 45%, transparent 70%)",
          }}
          animate={{ y: [0, -22, 0], x: [0, 10, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** A rotating glow ring (focus-ring motif used around the hero image). */
export function GlowRing({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full border border-gold-400/20",
        className
      )}
      style={{
        background:
          "conic-gradient(from 0deg, transparent, rgba(207,156,58,0.13), transparent 40%, rgba(59,130,246,0.10), transparent 70%)",
        maskImage: "radial-gradient(transparent 60%, black 62%)",
        WebkitMaskImage: "radial-gradient(transparent 60%, black 62%)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
    />
  );
}
