"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Premium 3D motion authority badge.
 * Effects: scale-in reveal, gentle floating, soft glow pulse, hover shine sweep.
 * Use `position` (absolute classes) to float it around the hero image on desktop,
 * or drop it into a flex row (float={false}) for the mobile swipe row.
 */
export function AuthorityBadge({
  title,
  icon: Icon,
  position,
  delay = 0,
  tint = "gold",
  float = true,
  className,
}: {
  title: string;
  icon: LucideIcon;
  position?: string;
  delay?: number;
  tint?: "gold" | "electric";
  float?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 220, damping: 18 }}
      className={cn("group relative", position, className)}
    >
      <motion.div
        animate={float ? { y: [0, -8, 0] } : undefined}
        transition={
          float
            ? { duration: 5.5 + delay * 2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative"
      >
        {/* soft glow pulse behind the badge */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-1.5 -z-10 rounded-[1.4rem] blur-lg animate-pulse-glow",
            tint === "gold" ? "bg-gold-400/15" : "bg-electric-500/15"
          )}
        />

        <div
          className={cn(
            "relative flex items-center gap-2 overflow-hidden rounded-2xl px-3.5 py-2.5 shadow-card",
            tint === "gold" ? "glass-gold" : "glass-electric"
          )}
        >
          {/* light sweep on hover (desktop) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform [transition-duration:900ms] ease-out group-hover:translate-x-full"
          />
          <Icon
            className={cn(
              "relative size-4 shrink-0",
              tint === "gold" ? "text-gold-300" : "text-electric-300"
            )}
          />
          <span className="relative whitespace-nowrap text-xs font-semibold text-foreground/90">
            {title}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
