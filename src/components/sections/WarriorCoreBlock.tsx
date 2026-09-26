import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { WarriorCoreCanvas } from "@/components/three/warrior-core-canvas";
import { LeadCta } from "@/components/shared/lead-gate";

/**
 * The "Warrior Mind" showcase block — the site's 3D centrepiece.
 *
 * Renamed from SplineHeroBlock: the plan recorded here was to buy a Spline
 * scene, which would have meant a hosted .splinecode asset, that vendor in the
 * CSP and `'unsafe-eval'` back in script-src. None of that was worth it for one
 * decorative object, so the scene is built from three.js primitives instead —
 * no external host, no eval, and the brand palette as constants rather than
 * baked into someone else's export. The abandoned @splinetool install has been
 * removed with it.
 *
 * Placed here, roughly two thirds down the page, for a reason: this is the one
 * section where WebGL is affordable. It is far below the fold, so three.js is
 * fetched long after the hero's LCP has settled — and only for a visitor who
 * scrolls this far.
 */
export function WarriorCoreBlock() {
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
                <LeadCta
                  size="lg"
                  intent="I'd like to book a free athlete mindset call."
                  campaign="warrior-block-book-call"
                >
                  Book Free Call
                  <ArrowRight className="size-4" />
                </LeadCta>
              </div>
            </div>

            {/* The 3D core — never covers the brand/content. A minimum height
                rather than an aspect ratio: the canvas is absolutely
                positioned, so without it the grid cell would collapse to zero
                and the ResizeObserver would have nothing to measure. */}
            <div className="relative min-h-[320px] md:min-h-[460px]">
              <WarriorCoreCanvas className="absolute inset-0 size-full" />
              {/* blend into the dark card on small screens */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ink-50 to-transparent md:hidden" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
