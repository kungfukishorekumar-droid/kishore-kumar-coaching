"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Button } from "@/components/ui/button";
import { PROGRAMS, whatsappLink, type Program } from "@/lib/site";
import { cn, scrollToId } from "@/lib/utils";

function ProgramCTA({ program }: { program: Program }) {
  const variant = program.featured ? "primary" : "outline";
  if (program.cta.type === "wa") {
    return (
      <Button asChild variant={variant} size="lg" className="relative w-full">
        <a href={whatsappLink(program.cta.message)} target="_blank" rel="noreferrer">
          {program.cta.label}
          <ArrowRight className="size-4" />
        </a>
      </Button>
    );
  }
  const target = program.cta.target;
  return (
    <Button
      variant={variant}
      size="lg"
      className="relative w-full"
      onClick={() => scrollToId(target)}
    >
      {program.cta.label}
      <ArrowRight className="size-4" />
    </Button>
  );
}

export function Programs() {
  return (
    <section id="programs" className="relative py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline-gold" />
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            Work with me
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Choose your <span className="text-gradient-gold">path</span>
          </h2>
          <p className="mt-4 text-foreground/65">
            From a single workshop to a full transformation — for individuals,
            teams and institutions.
          </p>
        </Reveal>

        <RevealGroup className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Reveal key={p.name} className="h-full">
              <TiltCard className="h-full" max={5}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "glow-card relative flex h-full flex-col overflow-hidden rounded-3xl p-7",
                    p.featured
                      ? "glass-gold shadow-glow ring-1 ring-gold-400/40 shine-border"
                      : "glass"
                  )}
                  // Pointer position for the glow — see .glow-card in globals.css.
                  // Written straight to CSS vars so React never re-renders on move.
                  onPointerMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    el.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                  onPointerLeave={(e) => {
                    e.currentTarget.style.setProperty("--mx", "-100%");
                    e.currentTarget.style.setProperty("--my", "-100%");
                  }}
                >
                  {p.featured && (
                    <>
                      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold-400/20 blur-3xl" />
                      <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                        <Sparkles className="size-3" />
                        Popular
                      </span>
                    </>
                  )}

                  <div className="relative">
                    <span className="inline-flex rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-gold-200">
                      {p.badge}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-wide text-foreground/45">
                      {p.forWho}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gold-100/90">
                      <span className="text-foreground/55">Focus: </span>
                      {p.focus}
                    </p>
                  </div>

                  <ul className="relative mt-5 grow space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                          <Check className="size-3" />
                        </span>
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-7 space-y-3">
                    <ProgramCTA program={p} />
                    <Link
                      href={`/programs/${p.slug}`}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground/55 transition-colors hover:text-gold-200"
                    >
                      View program details
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
