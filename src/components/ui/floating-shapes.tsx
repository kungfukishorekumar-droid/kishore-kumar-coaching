import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Shape = {
  className: string;
  size: number;
  /** gradient tint */
  tint: "gold" | "electric";
  /** Seconds per float cycle. */
  duration: number;
  delay?: number;
};

/**
 * Decorative floating glow orbs for section backdrops.
 *
 * CSS keyframes, not framer-motion. As framer components these were the main
 * reason most homepage sections had to be client components, and each orb ran
 * a JavaScript animation loop for as long as the page was open. Now they are
 * server-rendered and the compositor animates them.
 *
 * The drift uses the individual `translate` property rather than `transform`,
 * so it composes with any positioning transform in the orb's own classes
 * instead of replacing it.
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
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {shapes.map((s, i) => (
        <div
          key={i}
          className={cn("float-orb absolute rounded-full blur-2xl", s.className)}
          style={
            {
              width: s.size,
              height: s.size,
              background:
                s.tint === "gold"
                  ? "radial-gradient(circle at 30% 30%, rgba(224,206,156,0.17), rgba(207,156,58,0.06) 45%, transparent 70%)"
                  : "radial-gradient(circle at 30% 30%, rgba(140,175,235,0.15), rgba(59,130,246,0.06) 45%, transparent 70%)",
              "--float-dur": `${s.duration}s`,
              "--float-delay": `${s.delay ?? 0}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * A rotating glow ring (focus-ring motif used around the hero image).
 *
 * Spins with the individual `rotate` property. The framer version animated
 * `transform`, and its inline transform silently replaced the
 * `-translate-x-1/2 -translate-y-1/2` centring every caller passes — so every
 * ring on the site sat half its own size off-centre. `rotate` composes with
 * those classes, so the rings now sit where their classes always said.
 */
export function GlowRing({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "glow-ring pointer-events-none absolute rounded-full border border-gold-400/20",
        className
      )}
      style={{
        background:
          "conic-gradient(from 0deg, transparent, rgba(207,156,58,0.13), transparent 40%, rgba(59,130,246,0.10), transparent 70%)",
        maskImage: "radial-gradient(transparent 60%, black 62%)",
        WebkitMaskImage: "radial-gradient(transparent 60%, black 62%)",
      }}
    />
  );
}
