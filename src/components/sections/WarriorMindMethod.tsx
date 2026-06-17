"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { METHOD } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

const kanji: Record<string, string> = {
  Focus: "集中",
  Fire: "気",
  Flow: "流",
  Forge: "鍛",
  Fight: "闘",
};

export function WarriorMindMethod() {
  return (
    <section id="method" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "right-[6%] top-[10%]", size: 220, tint: "gold", duration: 16 },
          { className: "left-[5%] bottom-[8%]", size: 180, tint: "electric", duration: 18, delay: 1 },
        ]}
      />
      <div className="container relative">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            The Framework
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            The <span className="text-gradient-gold">Warrior Mind</span> Method™
          </h2>
          <p className="mt-4 text-foreground/65">
            Five disciplines that turn a talented athlete into an unshakable
            competitor. Focus · Fire · Flow · Forge · Fight.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {METHOD.map((step, i) => (
            <Reveal key={step.tag} className="h-full">
              <TiltCard className="h-full">
                <motion.div className="group relative h-full overflow-hidden rounded-3xl glass p-7 shine-border">
                  <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gold-400/0 blur-2xl transition-all duration-500 group-hover:bg-gold-400/25" />
                  <span className="pointer-events-none absolute right-4 top-2 font-display text-7xl text-white/[0.04] transition-colors group-hover:text-gold-400/10">
                    {kanji[step.tag]}
                  </span>

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="grid size-14 place-items-center rounded-2xl bg-gold-gradient text-ink shadow-glow">
                        <Icon name={step.icon} className="size-7" />
                      </div>
                      <span className="font-display text-2xl font-bold text-white/15">
                        {`0${i + 1}`}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                      {step.tag}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}

          {/* CTA tile */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl glass-gold p-7">
              <div>
                <h3 className="font-display text-2xl font-bold uppercase">
                  Built for your sport
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  The same method, tailored to combat athletes, team players,
                  individual performers and young students.
                </p>
              </div>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={() => scrollToId("programs")}
              >
                See the Programs
              </Button>
            </div>
          </Reveal>
        </RevealGroup>
      </div>
    </section>
  );
}
