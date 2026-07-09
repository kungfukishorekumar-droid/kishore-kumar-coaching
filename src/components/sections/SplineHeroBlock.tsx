"use client";

import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { WarriorEmblem } from "@/components/ui/warrior-emblem";
import { whatsappLink } from "@/lib/site";

/**
 * Premium "Warrior Mind" 3D-style showcase block.
 * Uses the lightweight CSS/Framer <WarriorEmblem /> (on-brand + fast, no WebGL).
 *
 * To use a real 3D Spline scene instead: `npm i @splinetool/react-spline`,
 * render <Spline scene="https://prod.spline.design/XXXX/scene.splinecode" /> here,
 * and re-add `'unsafe-eval'` + `*.spline.design` to the CSP in next.config.mjs.
 */
export function SplineHeroBlock() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container">
        <Card className="relative w-full overflow-hidden border-white/10 bg-ink-50 shadow-glow-lg">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="rgba(224,169,60,0.45)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Copy */}
            <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10">
              <span className="eyebrow">
                <span className="h-px w-6 bg-gold-400" />
                Sports Psychology × Martial Arts
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Train Your Mind{" "}
                <span className="text-gradient-gold">Like a Warrior</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-foreground/70 sm:text-base">
                Build focus, discipline, confidence, emotional control and
                pressure handling — a premium athlete-mindset system from
                Kishore Kumar, Spartacus Martial Arts Chennai.
              </p>
              <div className="mt-7">
                <Button asChild size="lg">
                  <a
                    href={whatsappLink("Hi Kishore, I'd like to book a free athlete mindset call.")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Book Free Call
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Warrior Mind emblem — never covers the brand/content */}
            <div className="relative min-h-[300px] md:min-h-[440px]">
              <WarriorEmblem className="absolute inset-0 h-full w-full" />
              {/* blend into the dark card on small screens */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ink-50 to-transparent md:hidden" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
