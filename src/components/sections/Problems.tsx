"use client";

import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Icon } from "@/components/ui/icon";
import { PROBLEMS } from "@/lib/site";

export function Problems() {
  return (
    <section id="problems" className="relative py-24">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            The real opponent
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Talent isn't the problem.
            <br />
            <span className="text-gradient-gold">The mind is untrained.</span>
          </h2>
          <p className="mt-4 text-foreground/65">
            Sound familiar? These are the silent performance killers we train
            away — for athletes, students and young competitors.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {PROBLEMS.map((p) => (
            <Reveal key={p.title} className="h-full">
              <TiltCard className="h-full">
                <div className="group relative flex h-full gap-4 overflow-hidden rounded-2xl glass p-5 transition-colors hover:border-gold-400/25">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-gold-400/0 blur-2xl transition-all duration-500 group-hover:bg-gold-400/15" />
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-300/90 ring-1 ring-red-500/20">
                    <Icon name={p.icon} className="size-5" />
                  </div>
                  <div className="relative">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
