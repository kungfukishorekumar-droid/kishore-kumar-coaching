"use client";

import { motion } from "framer-motion";
import {
  Medal,
  Brain,
  Scale,
  Crosshair,
  Dumbbell,
  Flame,
  Heart,
  Gauge,
  ArrowRight,
  MessageCircle,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { IMAGES, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

const badges = [
  { icon: Medal, label: "National Wushu Medalist" },
  { icon: Brain, label: "Sports Psychologist" },
  { icon: Scale, label: "Wushu Coach & Judge" },
];

const benefits = [
  { icon: Crosshair, label: "Focus" },
  { icon: Dumbbell, label: "Discipline" },
  { icon: Flame, label: "Confidence" },
  { icon: Heart, label: "Emotional Control" },
  { icon: Gauge, label: "Pressure Handling" },
];

export function PageThreeMindset() {
  return (
    <section id="mindset" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "right-[6%] top-[14%]", size: 220, tint: "gold", duration: 15 },
          { className: "left-[3%] bottom-[10%]", size: 180, tint: "electric", duration: 17, delay: 1 },
        ]}
      />

      <div className="container relative">
        <Reveal>
          {/* ONE unified stage — image + content share a single backdrop */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.07] shadow-card">
            {/* unified lighting */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800/70 via-ink to-ink" />
            <div className="absolute inset-0 bg-radial-glow opacity-50" />
            <GlowRing className="left-[6%] top-1/2 hidden size-[540px] -translate-y-1/2 lg:block" />

            <div className="relative grid lg:grid-cols-12">
              {/* FIGURE — bleeds into the backdrop, no hard card edge */}
              <div className="relative lg:col-span-5">
                <img
                  src={IMAGES.gesture}
                  alt="Kishore Kumar — Sports Psychology & Martial Arts Coach"
                  className="h-80 w-full object-cover object-[36%_18%] sm:h-[26rem] lg:h-full lg:min-h-[660px]"
                  width={1672}
                  height={941}
                  loading="lazy"
                  decoding="async"
                />
                {/* merge fades: right edge (desktop) + bottom (mobile) melt into the panel */}
                <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-ink/15 to-ink lg:block" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent lg:hidden" />

                {/* floating chip straddling the seam — connects the two zones */}
                <motion.div
                  animate={{ y: [0, -9, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-[-1.75rem] top-16 z-10 hidden items-center gap-2 rounded-2xl glass-gold px-4 py-2.5 shadow-glow lg:flex"
                >
                  <span className="font-display text-lg font-bold text-gradient-gold">
                    心技体
                  </span>
                  <span className="text-xs leading-tight text-foreground/70">
                    Mind · Body
                    <br />
                    Spirit
                  </span>
                </motion.div>
              </div>

              {/* CONTENT — wraps the surrounding space, breathable */}
              <div className="relative space-y-6 p-7 sm:p-10 lg:col-span-7 lg:p-12">
                <div>
                  <span className="eyebrow">
                    <span className="h-px w-6 bg-gold-400" />
                    Sports Psychology × Martial Arts
                  </span>
                  <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-5xl">
                    Where Martial Arts Meets
                    <br />
                    <span className="text-gradient-gold drop-shadow-[0_1px_12px_rgba(207,156,58,0.14)]">
                      Winning Mindset
                    </span>
                  </h2>
                  <p className="mt-4 max-w-lg text-pretty text-foreground/70">
                    Sports Psychology + Martial Arts coaching to help athletes
                    build focus, discipline, confidence, emotional control, and
                    competition mindset.
                  </p>
                </div>

                {/* Authority badges */}
                <div className="flex flex-wrap gap-2.5">
                  {badges.map((b) => (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-2 rounded-full glass-gold px-3.5 py-2 text-xs font-semibold text-foreground/90"
                    >
                      <b.icon className="size-4 text-gold-300" />
                      {b.label}
                    </span>
                  ))}
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    Why Athletes Choose Kishore Kumar
                  </h3>
                  <RevealGroup
                    className="grid grid-cols-3 gap-2.5 sm:grid-cols-5"
                    stagger={0.05}
                  >
                    {benefits.map((bn) => (
                      <Reveal key={bn.label}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex h-full flex-col items-center gap-2 rounded-2xl glass px-2 py-4 text-center"
                        >
                          <span className="grid size-9 place-items-center rounded-xl bg-gold-gradient text-ink shadow-glow">
                            <bn.icon className="size-5" />
                          </span>
                          <span className="text-[11px] font-semibold leading-tight text-foreground/85">
                            {bn.label}
                          </span>
                        </motion.div>
                      </Reveal>
                    ))}
                  </RevealGroup>
                </div>

                {/* Workshop line */}
                <button
                  onClick={() => scrollToId("institutions")}
                  className="group flex w-full items-center gap-3 rounded-2xl glass px-4 py-3 text-left transition-colors hover:border-gold-400/25"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-electric-500/12 text-electric-300 ring-1 ring-electric-400/20">
                    <GraduationCap className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-foreground/85">
                    Workshops for Athletes, Parents, Schools &amp; Academies
                  </span>
                  <ArrowRight className="ml-auto size-4 text-gold-300 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <a
                      href={whatsappLink("Hi Kishore, I'd like to book a free call.")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <CalendarCheck className="size-4" />
                      Book Free Call
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a
                      href={whatsappLink("Hi Kishore, I have a quick question.")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom line — spans full width to tie the composition together */}
            <div className="relative border-t border-white/[0.07] bg-white/[0.02] px-6 py-4 text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gradient-gold sm:text-base">
                Stronger Mind. Sharper Focus. Better Performance. Greater You.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
