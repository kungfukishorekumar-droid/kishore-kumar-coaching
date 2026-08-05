"use client";

import { motion } from "framer-motion";
import {
  Medal,
  Brain,
  Scale,
  Target,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { CREDENTIALS, IMAGES, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

const trustCards = [
  { icon: Brain, title: "Sports Psychology + Martial Arts" },
  { icon: Target, title: "Athlete Mindset Coaching" },
  { icon: GraduationCap, title: "Workshops for Schools & Academies" },
  { icon: ShieldCheck, title: "Discipline, Focus & Confidence Training" },
];

const floatingBadges = [
  { icon: Medal, label: "National Wushu Medalist", pos: "right-[-1.5rem] top-12", tint: "gold" },
  { icon: Scale, label: "Wushu Coach & Judge", pos: "right-[-1.25rem] top-1/2", tint: "electric" },
  { icon: Brain, label: "Sports Psychologist", pos: "left-[-1.25rem] bottom-14", tint: "gold" },
] as const;

export function PageSixAuthority() {
  return (
    <section id="authority" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "left-[4%] top-[12%]", size: 220, tint: "gold", duration: 15 },
          { className: "right-[5%] bottom-[10%]", size: 200, tint: "electric", duration: 17, delay: 1 },
        ]}
      />

      <div className="container relative">
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Content (left on desktop, below image on mobile) */}
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-6 bg-gold-400" />
                Your Coach
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-5xl">
                Why Train With
                <br />
                <span className="text-gradient-gold drop-shadow-[0_1px_12px_rgba(207,156,58,0.14)]">
                  Kishore Kumar?
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-foreground/70">
                A unique blend of martial arts discipline, sports psychology,
                athlete mindset coaching, and real performance experience.
              </p>
            </Reveal>

            {/* 8 authority points */}
            <RevealGroup className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2" stagger={0.04}>
              {CREDENTIALS.map((c) => (
                <Reveal key={c.label}>
                  <div className="flex items-center gap-2.5 rounded-xl glass px-3 py-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                      <Icon name={c.icon} className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground/85">
                      {c.label}
                    </span>
                    <BadgeCheck className="ml-auto size-4 text-electric-400/60" />
                  </div>
                </Reveal>
              ))}
            </RevealGroup>

            {/* 4 trust cards */}
            <RevealGroup className="mt-4 grid grid-cols-2 gap-3" stagger={0.05}>
              {trustCards.map((t) => (
                <Reveal key={t.title}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex h-full items-start gap-3 rounded-2xl glass-gold p-4"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink shadow-glow">
                      <t.icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold leading-tight text-foreground/90">
                      {t.title}
                    </span>
                  </motion.div>
                </Reveal>
              ))}
            </RevealGroup>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
              <Button size="lg" variant="outline" onClick={() => scrollToId("institutions")}>
                Invite for Workshop
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Image (right on desktop, first on mobile) — fills the column, floating badges */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative h-full">
              <GlowRing className="left-1/2 top-1/2 size-[115%] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gold-400/8 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 -z-10 size-44 rounded-full bg-electric-500/12 blur-3xl" />

              <div className="shine-border relative h-full min-h-[26rem] overflow-hidden rounded-[2rem] border border-white/10 shadow-glow-lg lg:min-h-[34rem]">
                <img
                  src={IMAGES.heroWide}
                  alt="Kishore Kumar — National Wushu Medalist & Sports Psychologist, Chennai"
                  className="h-full w-full object-cover object-[32%_center]"
                  width={1672}
                  height={941}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>

              {/* floating badges — around the image, clear of the face */}
              {floatingBadges.map((b, i) => (
                <motion.div
                  key={b.label}
                  animate={{ y: [0, i % 2 ? 9 : -9, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute z-10 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-card md:flex ${b.pos} ${
                    b.tint === "gold" ? "glass-gold" : "glass-electric"
                  }`}
                >
                  <b.icon
                    className={`size-4 ${b.tint === "gold" ? "text-gold-300" : "text-electric-300"}`}
                  />
                  <span className="text-xs font-semibold text-foreground/90">
                    {b.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
