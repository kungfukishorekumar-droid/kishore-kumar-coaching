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

const authorityBadges = [
  { title: "National Wushu Medalist", icon: Medal, pos: "absolute left-[-6%] top-[9%]", tint: "gold" },
  { title: "Sports Psychologist", icon: Brain, pos: "absolute right-[-6%] top-[18%]", tint: "electric" },
  { title: "Martial Artist", icon: Flame, pos: "absolute left-[-8%] top-[47%]", tint: "gold" },
  { title: "Wushu Coach & Judge", icon: ShieldCheck, pos: "absolute right-[-7%] bottom-[25%]", tint: "electric" },
  { title: "Athlete Mindset Coach", icon: Target, pos: "absolute left-[-5%] bottom-[13%]", tint: "gold" },
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
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="relative order-1 mx-auto w-full max-w-sm sm:max-w-md lg:order-2 lg:max-w-none"
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
        </motion.div>

        {/* CONTENT — after the image (below on mobile, left on desktop) */}
        <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          {/* Authority badges — mobile swipe row (desktop uses floating badges) */}
          <div className="mb-6 flex min-w-0 gap-2.5 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-display text-[2.6rem] font-bold uppercase leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[4.1rem]"
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base text-foreground/70 sm:text-lg lg:mx-0"
          >
            {HERO.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start"
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
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground/55 sm:text-xs lg:justify-start"
          >
            {trustLine.map((t, i) => (
              <span key={t} className="flex items-center gap-2.5">
                {i > 0 && <span className="text-gold-400/40">|</span>}
                {t}
              </span>
            ))}
          </motion.div>
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
