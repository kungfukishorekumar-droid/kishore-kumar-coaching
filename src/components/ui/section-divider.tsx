import { cn } from "@/lib/utils";
import { Reveal, RevealGroup } from "@/components/ui/reveal";

/**
 * Divider between sections — the page's punctuation.
 *
 * Two gold hairlines draw outward from a slowly rotating diamond as the
 * divider enters view, and a streak of light crosses it mid-screen
 * (.divider-slash). It gives the long scroll a beat between chapters instead
 * of one continuous wall of content.
 *
 * A server component: the draw-in is a <Reveal variant="draw"> (scaleX on the
 * compositor, never width), the slash is a CSS scroll timeline, and the
 * diamond's spin is a CSS animation. Under reduced motion the lines are simply
 * present.
 */
export function SectionDivider({
  className,
  tint = "gold",
}: {
  className?: string;
  tint?: "gold" | "electric";
}) {
  const line =
    tint === "gold"
      ? "from-transparent via-gold-400/50 to-transparent"
      : "from-transparent via-electric-500/50 to-transparent";
  const mark = tint === "gold" ? "border-gold-400/60" : "border-electric-500/60";
  const glow = tint === "gold" ? "bg-gold-400/60" : "bg-electric-500/60";

  return (
    <RevealGroup
      aria-hidden
      stagger={0.15}
      className={cn("relative flex items-center justify-center gap-4 py-2", className)}
    >
      <Reveal as="span" variant="draw" className={cn("h-px flex-1 origin-right bg-gradient-to-r", line)} />

      <Reveal as="span" variant="pop" className="relative grid size-3 place-items-center">
        <span className={cn("absolute inset-0 rounded-[2px] blur-[6px]", glow)} />
        <span className={cn("size-full rotate-45 border bg-ink/60 motion-safe:animate-spin-slow", mark)} />
      </Reveal>

      <Reveal as="span" variant="draw" className={cn("h-px flex-1 origin-left bg-gradient-to-r", line)} />

      {/* The slash — a streak of light that crosses the divider as it passes
          mid-screen. Scroll-driven in CSS (.divider-slash); absent entirely
          where scroll timelines or motion are not available. overflow-CLIP,
          not hidden: a hidden wrapper would become the slash's scroll
          container and freeze its timeline. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-clip">
        <span
          className={cn(
            "divider-slash absolute inset-y-0 left-0 w-full opacity-0 bg-gradient-to-r from-transparent to-transparent",
            tint === "gold" ? "via-gold-100" : "via-electric-300"
          )}
          style={{ boxShadow: tint === "gold" ? "0 0 12px 2px rgba(240,207,133,0.55)" : "0 0 12px 2px rgba(125,174,255,0.55)" }}
        />
      </span>
    </RevealGroup>
  );
}
