"use client";

import { Counter } from "@/components/ui/counter";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { STATS } from "@/lib/site";

export function Stats() {
  return (
    <section className="relative py-12">
      <div className="container">
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="glass flex flex-col items-center rounded-2xl px-4 py-6 text-center">
                <div className="font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-xs text-foreground/60 sm:text-sm">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
