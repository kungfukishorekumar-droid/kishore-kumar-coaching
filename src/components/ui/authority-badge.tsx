import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Credential badge — floats around the hero portrait on desktop, or sits in the
 * mobile swipe row when `float` is false.
 *
 * Deliberately CSS-only (no Framer, no "use client"). These sit above the fold
 * next to the LCP element, and a JS-driven entrance leaves them invisible until
 * React hydrates — or indefinitely, if the page was opened in a background tab
 * where requestAnimationFrame is paused. As plain CSS they render with the
 * first paint and cost nothing in the client bundle.
 *
 * Four layers of motion, all transform/opacity:
 *   entrance   scale-in, staggered by `delay`
 *   float      slow vertical drift, desynchronised per badge
 *   glow       pulsing halo behind the pill
 *   shine      light sweep across the face on hover
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
  /** Entrance stagger, in seconds. */
  delay?: number;
  tint?: "gold" | "electric";
  float?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("anim-scale group relative", position, className)}
      style={{ "--d": `${delay}s` } as React.CSSProperties}
    >
      <div
        className={cn("relative", float && "badge-float")}
        // Varying the period per badge stops them bobbing in unison, which
        // reads as mechanical rather than ambient.
        style={float ? ({ "--float-dur": `${5.5 + delay * 2}s` } as React.CSSProperties) : undefined}
      >
        {/* soft glow pulse behind the badge */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-1.5 -z-10 rounded-[1.4rem] blur-lg motion-safe:animate-pulse-glow",
            tint === "gold" ? "bg-gold-400/15" : "bg-electric-500/15"
          )}
        />

        <div
          className={cn(
            "relative flex items-center gap-2 overflow-hidden rounded-2xl px-3.5 py-2.5 shadow-card",
            tint === "gold" ? "glass-gold" : "glass-electric"
          )}
        >
          {/* light sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform [transition-duration:900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
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
      </div>
    </div>
  );
}
