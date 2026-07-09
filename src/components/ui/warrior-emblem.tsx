"use client";

import { motion } from "framer-motion";
import { GlowRing } from "@/components/ui/floating-shapes";
import { cn } from "@/lib/utils";

// 5 orbiting nodes = the Warrior Mind Method™ (Focus · Fire · Flow · Forge · Fight)
const NODES = [
  { tint: "gold" },
  { tint: "electric" },
  { tint: "gold" },
  { tint: "electric" },
  { tint: "gold" },
] as const;

/**
 * Cinematic "warrior mind" 3D-style motion graphic — rotating focus rings,
 * orbiting energy nodes and a glowing 心 (mind) emblem. Pure CSS + Framer
 * Motion (no WebGL), so it's fast and renders everywhere.
 */
export function WarriorEmblem({ className }: { className?: string }) {
  return (
    <div className={cn("relative grid place-items-center overflow-hidden", className)}>
      {/* ambient glow */}
      <div className="pointer-events-none absolute size-[62%] rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute size-[42%] rounded-full bg-electric-500/10 blur-2xl" />

      {/* rotating conic glow ring */}
      <GlowRing className="size-[86%]" />

      {/* dashed gold ring — slow clockwise */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute size-[80%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(207,156,58,0.32)" strokeWidth="1" strokeDasharray="5 11" />
      </motion.svg>

      {/* electric arc ring — counter-clockwise */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute size-[64%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(59,130,246,0.32)" strokeWidth="1.5" strokeDasharray="50 170" strokeLinecap="round" />
      </motion.svg>

      {/* orbiting energy nodes */}
      <motion.div
        className="absolute size-[74%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        {NODES.map((n, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ transform: `rotate(${(i / NODES.length) * 360}deg)` }}
          >
            <span
              className={cn(
                "absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
                n.tint === "gold"
                  ? "bg-gold-300 shadow-[0_0_12px_2px_rgba(207,156,58,0.5)]"
                  : "bg-electric-400 shadow-[0_0_12px_2px_rgba(59,130,246,0.5)]"
              )}
            />
          </div>
        ))}
      </motion.div>

      {/* energy streaks */}
      <div className="pointer-events-none absolute inset-0">
        {[35, 65].map((top, i) => (
          <motion.div
            key={top}
            className="absolute h-px w-full"
            style={{
              top: `${top}%`,
              background:
                "linear-gradient(90deg, transparent, rgba(207,156,58,0.4), rgba(59,130,246,0.3), transparent)",
            }}
            animate={{ opacity: [0.15, 0.55, 0.15], x: ["-8%", "8%", "-8%"] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* central mind emblem */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-gold-400/15 blur-xl animate-pulse-glow" />
        <div className="grid size-28 place-items-center rounded-full glass-gold shadow-glow ring-1 ring-gold-400/30 sm:size-32">
          <span className="font-display text-5xl font-bold text-gradient-gold drop-shadow-[0_1px_10px_rgba(207,156,58,0.25)] sm:text-6xl">
            心
          </span>
        </div>
        <span className="mt-3 rounded-full glass px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200">
          Warrior Mind
        </span>
      </motion.div>
    </div>
  );
}
