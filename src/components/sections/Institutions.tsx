"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Building2 } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { INSTITUTIONS, whatsappLink } from "@/lib/site";

const audiences = ["Schools", "Colleges", "Sports Academies", "Martial Arts Centers", "Gyms", "Coaches"];

export function Institutions() {
  return (
    <section id="institutions" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "left-[5%] top-[10%]", size: 240, tint: "electric", duration: 14 },
          { className: "right-[6%] bottom-[12%]", size: 200, tint: "gold", duration: 12, delay: 1 },
        ]}
      />
      <div className="container relative">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="eyebrow text-electric-300">
            <Building2 className="size-4" />
            For institutions
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Bring the method to
            <br />
            <span className="text-gradient-electric">your whole team</span>
          </h2>
          <p className="mt-4 text-foreground/65">
            Athlete mindset workshops for schools, colleges, academies, gyms and
            coaching teams — engaging, practical and built around real
            performance.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {audiences.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/75"
              >
                {a}
              </span>
            ))}
          </div>
        </Reveal>

        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {INSTITUTIONS.offers.map((o) => (
            <Reveal key={o.title} className="h-full">
              <TiltCard className="h-full" max={6}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex h-full flex-col rounded-3xl glass p-6"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-electric-gradient text-white shadow-glow-blue">
                    <Icon name={o.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    {o.desc}
                  </p>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Benefits + CTA banner */}
        <Reveal delay={0.1}>
          <div className="relative mt-8 overflow-hidden rounded-3xl glass-electric p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-electric-500/20 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  Why institutions invite Kishore
                </h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {INSTITUTIONS.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-5 shrink-0 text-electric-300" />
                      <span className="text-foreground/80">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild variant="electric" size="lg" className="w-full lg:w-auto">
                <a
                  href={whatsappLink(
                    "Hi Kishore, we'd like to invite you for an athlete mindset workshop at our institution."
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Invite Kishore for Workshop
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
