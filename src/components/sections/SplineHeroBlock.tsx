"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

/**
 * ← Replace this with your own martial-arts / sports-themed 3D scene exported
 * from https://spline.design (the default is a generic Spline demo robot).
 */
const SPLINE_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function SplineHeroBlock() {
  const ref = useRef<HTMLDivElement>(null);
  // Only mount the heavy 3D runtime once the block is near the viewport.
  const inView = useInView(ref, { once: true, margin: "300px" });

  return (
    <section className="relative py-16 sm:py-20">
      <div className="container">
        <Card
          ref={ref}
          className="relative w-full overflow-hidden border-white/10 bg-ink-50 shadow-glow-lg"
        >
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

              {/* 3D scene — kept to the side so it never covers the brand/content */}
              <div className="relative min-h-[260px] md:min-h-[440px]">
                {inView ? (
                  <SplineScene scene={SPLINE_SCENE} className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
                  </div>
                )}
                {/* blend the 3D into the dark card on small screens */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ink-50 to-transparent md:hidden" />
              </div>
            </div>
          </Card>
      </div>
    </section>
  );
}
