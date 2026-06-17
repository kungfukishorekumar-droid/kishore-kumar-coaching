"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Quote,
  CalendarCheck,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { Button } from "@/components/ui/button";
import {
  REVIEW_SOURCES,
  REVIEW_SUMMARY,
  ACADEMY,
  SITE,
  whatsappLink,
} from "@/lib/site";
import { cn, scrollToId } from "@/lib/utils";

const TABS = [
  "All Reviews",
  "Google",
  "Justdial",
  "BookMyPlayer",
  "Parents",
  "Students",
  "Athletes",
] as const;
type Tab = (typeof TABS)[number];

// Flatten reviews and tag each with its platform + accent for filtering.
const ALL_REVIEWS = REVIEW_SOURCES.flatMap((s) =>
  s.reviews.map((r) => ({ ...r, platform: s.platform, accent: s.accent }))
);

function matches(
  r: (typeof ALL_REVIEWS)[number],
  tab: Tab
): boolean {
  switch (tab) {
    case "All Reviews":
      return true;
    case "Google":
      return r.platform === "Google Reviews";
    case "Justdial":
      return r.platform === "Justdial";
    case "BookMyPlayer":
      return r.platform === "BookMyPlayer";
    case "Parents":
      return r.role === "Parent";
    case "Students":
      return r.role === "Student";
    case "Athletes":
      return r.role === "Athlete";
  }
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
        >
          <Star className="size-4 fill-gold-400 text-gold-400" />
        </motion.span>
      ))}
    </div>
  );
}

function PlatformBadge({
  platform,
  accent,
  className,
}: {
  platform: string;
  accent: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        className
      )}
      style={{
        borderColor: `${accent}55`,
        backgroundColor: `${accent}1A`,
        color: "#e9ecf2",
      }}
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: accent }} />
      {platform}
    </span>
  );
}

export function Reviews() {
  const [tab, setTab] = useState<Tab>("All Reviews");
  const filtered = useMemo(() => ALL_REVIEWS.filter((r) => matches(r, tab)), [tab]);

  return (
    <section id="reviews" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "left-[3%] top-[12%]", size: 240, tint: "gold", duration: 14 },
          { className: "right-[5%] bottom-[10%]", size: 200, tint: "electric", duration: 16, delay: 1 },
        ]}
      />
      <div className="container relative">
        {/* Header */}
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            Social Proof &amp; Reviews
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Trusted by Students, Parents &amp;
            <br />
            <span className="text-gradient-gold">Martial Arts Learners in Chennai</span>
          </h2>
          <p className="mt-4 text-foreground/65">
            Real feedback from {ACADEMY} Chennai across Google Reviews, Justdial,
            and BookMyPlayer.
          </p>
        </Reveal>

        {/* Trust-summary cards */}
        <RevealGroup className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
          {REVIEW_SUMMARY.map((s) => (
            <Reveal key={s.label}>
              <div className="glass flex h-full flex-col items-center justify-center rounded-2xl px-3 py-5 text-center">
                <div className="font-display text-xl font-bold text-gradient-gold sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] leading-tight text-foreground/55">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Platform source panels */}
        <RevealGroup className="mb-12 grid gap-5 md:grid-cols-3">
          {REVIEW_SOURCES.map((src) => (
            <Reveal key={src.platform} className="h-full">
              <div
                className="flex h-full flex-col rounded-3xl glass p-6 shine-border"
                style={{ borderColor: `${src.accent}33` }}
              >
                <div className="flex items-center justify-between">
                  <PlatformBadge platform={src.platform} accent={src.accent} />
                  <ShieldCheck className="size-4 text-electric-400/70" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Stars />
                  <span className="text-sm font-semibold text-foreground/85">
                    {src.rating || "Verified"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/50">
                  {src.totalReviews
                    ? `${src.totalReviews} reviews`
                    : "Real verified reviews from students & parents"}
                </p>
                <div className="mt-5">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={src.link} target="_blank" rel="noreferrer">
                      View on {src.platform.replace(" Reviews", "")}
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Filter tabs */}
        <Reveal className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                  tab === t
                    ? "border-gold-400 bg-gold-gradient text-ink"
                    : "border-white/12 bg-white/[0.03] text-foreground/70 hover:border-gold-400/40 hover:text-gold-100"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Review cards */}
        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => (
              <motion.div
                key={`${r.platform}-${r.name}-${r.text.slice(0, 12)}`}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <TiltCard className="h-full" max={5}>
                  <figure className="flex h-full flex-col rounded-3xl glass p-6 shine-border">
                    <div className="flex items-center justify-between">
                      <PlatformBadge platform={r.platform} accent={r.accent} />
                      <Quote className="size-6 text-gold-300/50" />
                    </div>
                    <div className="mt-3">
                      <Stars n={r.rating} />
                    </div>
                    <blockquote className="mt-3 grow text-sm leading-relaxed text-foreground/80">
                      &ldquo;{r.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                      <span className="grid size-9 place-items-center rounded-full bg-gold-gradient font-display text-sm font-bold text-ink">
                        {r.name.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {r.name}
                        </span>
                        <span className="block text-xs text-gold-300">
                          {r.role}
                          {r.date ? ` · ${r.date}` : ""}
                        </span>
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-electric-300/80">
                        <ShieldCheck className="size-3" />
                        Verified
                      </span>
                    </figcaption>
                  </figure>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <Reveal delay={0.1}>
          <div className="relative mt-14 overflow-hidden rounded-3xl glass-gold p-8 text-center sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold-400/12 blur-3xl" />
            <h3 className="relative font-display text-2xl font-bold uppercase sm:text-3xl">
              Ready to Start Your{" "}
              <span className="text-gradient-gold">Warrior Mind</span> Training?
            </h3>
            <div className="relative mt-7 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a href={whatsappLink("Hi Kishore, I saw the reviews and I'd like to start training.")} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Message on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink("Hi Kishore, I'd like to book a free call.")} target="_blank" rel="noreferrer">
                  <CalendarCheck className="size-4" />
                  Book Free Call
                </a>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => scrollToId("programs")}>
                View Programs
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="relative mt-4 text-xs text-foreground/40">
              {ACADEMY} · {SITE.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
