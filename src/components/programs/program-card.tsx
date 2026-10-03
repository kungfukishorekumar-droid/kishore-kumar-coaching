import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";
import type { Program } from "@/lib/site";

/**
 * Program card for /programs/ and "More programs" — the same look as the
 * homepage's program cards (tilt, glow, light-sweep border on the featured
 * one), minus the homepage's booking buttons: here the card is the link.
 *
 * `full` shows the description and first three features (the index);
 * `compact` shows only the focus line (the related row).
 */
export function ProgramCard({
  program: p,
  variant = "full",
  headingLevel = "h2",
}: {
  program: Program;
  variant?: "full" | "compact";
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const full = variant === "full";
  return (
    <TiltCard className="h-full" max={5} radiusClassName="rounded-3xl">
      <Link
        href={`/programs/${p.slug}/`}
        className={cn(
          "glow-card group relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors",
          full ? "p-6 sm:p-7" : "p-6",
          p.featured ? "glass-gold ring-1 ring-gold-400/40" : "glass hover:border-gold-400/25"
        )}
      >
        {p.featured && (
          <>
            <span aria-hidden="true" className="beam-ring" />
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold-400/20 blur-3xl" />
          </>
        )}
        <div className="relative flex items-start justify-between gap-3">
          <span className="inline-flex w-fit rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-gold-200">
            {p.badge}
          </span>
          {p.featured && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              <Sparkles className="size-3" aria-hidden="true" />
              Popular
            </span>
          )}
        </div>
        <Heading className={cn("relative mt-4 font-display font-bold", full ? "text-xl" : "text-lg")}>{p.name}</Heading>
        {full ? (
          <>
            <p className="relative mt-1 text-xs uppercase tracking-wide text-foreground/50">{p.forWho}</p>
            <p className="relative mt-3 text-sm leading-relaxed text-foreground/65">{p.description}</p>
            <ul className="relative mt-4 grow space-y-2">
              {p.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                    <Check className="size-3" />
                  </span>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="relative mt-2 grow text-sm text-foreground/60">{p.focus}</p>
        )}
        <span className="relative mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold-200">
          {full ? "See the program" : "Learn more"}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </TiltCard>
  );
}
