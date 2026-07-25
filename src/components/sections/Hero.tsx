"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Bot,
  ChevronDown,
  Medal,
  Brain,
  Flame,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { AuthorityBadge } from "@/components/ui/authority-badge";
import { IMAGES, HERO, SITE, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

/**
 * Floating credential badges around the portrait.
 *
 * Positions are responsive on purpose. The badges only hang outside the image
 * from `2xl` up; below that they tuck to the image edge.
 *
 * Why 2xl and not xl: the container maxes out at 1280px, so it only gains side
 * margin once the viewport exceeds that. At exactly xl (1280px — which matches
 * while the visible area is ~1270px, since media queries count the scrollbar)
 * the container spans the full width with nothing to spare, and a -7% offset
 * pushed the right-hand badges past the viewport, where the section's
 * overflow-hidden clipped them mid-word. 2xl (1536px) leaves ~128px each side.
 */
const authorityBadges = [
  { title: "National Wushu Medalist", icon: Medal, pos: "absolute left-0 top-[9%] 2xl:left-[-6%]", tint: "gold" },
  { title: "Sports Psychologist", icon: Brain, pos: "absolute right-0 top-[18%] 2xl:right-[-6%]", tint: "electric" },
  { title: "Martial Artist", icon: Flame, pos: "absolute left-0 top-[47%] 2xl:left-[-8%]", tint: "gold" },
  { title: "Wushu Coach & Judge", icon: ShieldCheck, pos: "absolute right-0 bottom-[25%] 2xl:right-[-7%]", tint: "electric" },
  { title: "Athlete Mindset Coach", icon: Target, pos: "absolute left-0 bottom-[13%] 2xl:left-[-5%]", tint: "gold" },
] as const;

const trustLine = [
  "National Wushu Medalist",
  "Sports Psychologist",
  "Martial Artist",
  "Wushu Coach & Judge",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 spotlight opacity-70" />
      <FloatingShapes
        shapes={[
          { className: "left-[6%] top-[18%]", size: 220, tint: "gold", duration: 9 },
          { className: "right-[10%] top-[10%]", size: 180, tint: "electric", duration: 11, delay: 1 },
          { className: "left-[40%] bottom-[6%]", size: 160, tint: "gold", duration: 12, delay: 0.5 },
        ]}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div className="container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* IMAGE — seen first (top on mobile, right on desktop) */}
        <div
          className="anim-scale relative order-1 mx-auto w-full max-w-sm sm:max-w-md lg:order-2 lg:max-w-none"
          style={{ "--d": "60ms" } as React.CSSProperties}
        >
          <GlowRing className="left-1/2 top-1/2 size-[118%] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 -z-10 size-48 rounded-full bg-electric-500/15 blur-3xl" />

          <div className="shine-border relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-50 shadow-glow-lg">
            <img
              src={IMAGES.portrait}
              alt="Kishore Kumar — Sports Psychology & Martial Arts Coach, Chennai"
              className="aspect-[4/5] w-full object-cover object-top lg:aspect-[5/6]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          </div>

          {/* Floating authority badges — desktop only, around the image */}
          {authorityBadges.map((b, i) => (
            <AuthorityBadge
              key={b.title}
              title={b.title}
              icon={b.icon}
              tint={b.tint}
              position={b.pos}
              delay={0.45 + i * 0.12}
              className="hidden lg:block"
            />
          ))}
        </div>

        {/* CONTENT — after the image (below on mobile, left on desktop) */}
        <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          {/* Authority badges — mobile swipe row (desktop uses floating badges) */}
          <div className="scroll-row mb-6 flex min-w-0 gap-2.5 overflow-x-auto pb-2 lg:hidden">
            {authorityBadges.map((b, i) => (
              <AuthorityBadge
                key={b.title}
                title={b.title}
                icon={b.icon}
                tint={b.tint}
                delay={i * 0.08}
                float={false}
                className="shrink-0"
              />
            ))}
          </div>

          <h1
            className="anim-rise text-balance font-display text-fluid-3xl font-extrabold uppercase tracking-[-0.03em]"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            {/* SEO H1 keyword line (single H1 on the page) */}
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-gold-300 sm:text-sm">
              Sports Psychology &amp; Martial Arts Coach in Chennai
            </span>
            {HERO.headlineTop}
            <br />
            <span className="text-gradient-gold drop-shadow-[0_1px_12px_rgba(207,156,58,0.14)]">
              {HERO.headlineBottom}
            </span>
          </h1>

          <p
            className="anim-rise mx-auto mt-6 max-w-[58ch] text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg lg:mx-0"
            style={{ "--d": "200ms" } as React.CSSProperties}
          >
            {HERO.sub}
          </p>

          {/* CTAs */}
          <div
            className="anim-rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start"
            style={{ "--d": "280ms" } as React.CSSProperties}
          >
            <Button asChild size="lg">
              <a
                href={whatsappLink("Hi Kishore, I'd like to book a free athlete mindset call.")}
                target="_blank"
                rel="noreferrer"
              >
                Book Free Athlete Mindset Call
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="electric">
              <a href={SITE.customGpt} target="_blank" rel="noreferrer">
                <Bot className="size-4" />
                Try Athlete Mindset GPT
              </a>
            </Button>
          </div>

          <div
            className="anim-rise mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start"
            style={{ "--d": "340ms" } as React.CSSProperties}
          >
            <Button asChild size="md" variant="outline">
              <a
                href={whatsappLink("Hi Kishore, I have a quick question.")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </Button>
            <Button size="md" variant="ghost" onClick={() => scrollToId("programs")}>
              Explore Programs →
            </Button>
          </div>

          {/* Trust line */}
          <div
            className="anim-rise mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground/55 sm:text-xs lg:justify-start"
            style={{ "--d": "400ms" } as React.CSSProperties}
          >
            {trustLine.map((t, i) => (
              <span key={t} className="flex items-center gap-2.5">
                {i > 0 && <span className="text-gold-400/40">|</span>}
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToId("problems")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-foreground/40 transition-colors hover:text-gold-200 lg:flex"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.button>
    </section>
  );
}
