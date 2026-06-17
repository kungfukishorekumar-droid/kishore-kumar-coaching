"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, ArrowUpRight, Send } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { GlowRing, FloatingShapes } from "@/components/ui/floating-shapes";
import { IMAGES, SITE } from "@/lib/site";

const topics = ["Focus", "Nerves", "Routine", "Confidence", "Beginner tips"];

const chat = [
  { from: "user", text: "I lose focus right before my bout. What do I do?" },
  { from: "bot", text: "Let's build a 60-second reset routine: breath, cue word, one target. Want me to walk through it?" },
  { from: "user", text: "Yes — and something for nerves too." },
];

export function CustomGPT() {
  return (
    <section id="gpt" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow-blue opacity-70" />
      <FloatingShapes
        shapes={[
          { className: "left-[5%] top-[14%]", size: 220, tint: "electric", duration: 15 },
          { className: "right-[6%] bottom-[12%]", size: 190, tint: "gold", duration: 17, delay: 1 },
        ]}
      />

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy (left on desktop, below the card on mobile) */}
          <div className="order-2 flex flex-col lg:order-1">
            <Reveal>
              <span className="eyebrow text-electric-300">
                <Sparkles className="size-4" />
                AI-powered support
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-5xl">
                Ask Kishore's{" "}
                <span className="text-gradient-electric">Athlete Mindset GPT</span>
              </h2>
              <p className="mt-4 max-w-lg text-foreground/70">
                Instant guidance for focus, discipline, confidence, pressure
                handling, martial-arts routine, and beginner training support —
                trained on Kishore's method, available any time between sessions.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-5 flex flex-wrap gap-2">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-electric-400/25 bg-electric-500/10 px-3 py-1.5 text-xs font-medium text-electric-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-7">
                <Button asChild variant="electric" size="lg">
                  <a href={SITE.customGpt} target="_blank" rel="noreferrer">
                    <Bot className="size-4" />
                    Open Athlete Mindset GPT
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Coach card: photo + chat (first on mobile) */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-md">
              <GlowRing className="left-1/2 top-1/2 size-[112%] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-electric-500/12 blur-3xl" />

              <div className="shine-border relative overflow-hidden rounded-[2rem] glass-electric">
                {/* Photo banner — Kishore as the coach behind the AI */}
                <div className="relative h-56 sm:h-60">
                  <img
                    src={IMAGES.portrait}
                    alt="Kishore Kumar — the coach behind the Athlete Mindset GPT"
                    className="size-full object-cover object-[center_18%]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[11px] font-semibold text-foreground/85">
                    <span className="size-1.5 animate-pulse-glow rounded-full bg-emerald-400" />
                    Online · powered by Kishore's method
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center overflow-hidden rounded-full ring-2 ring-electric-400/50">
                      <img
                        src={IMAGES.portrait}
                        alt=""
                        aria-hidden
                        className="size-full object-cover object-top"
                      />
                    </span>
                    <div>
                      <div className="font-display text-base font-bold leading-tight">
                        Athlete Mindset Coach
                      </div>
                      <div className="text-[11px] text-foreground/60">
                        AI trained on the Warrior Mind Method™
                      </div>
                    </div>
                    <span className="ml-auto grid size-9 place-items-center rounded-xl bg-electric-gradient text-white shadow-glow-blue">
                      <Bot className="size-5" />
                    </span>
                  </div>
                </div>

                {/* Chat */}
                <div className="space-y-3 p-5">
                  {chat.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.2 }}
                      className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.from === "bot" && (
                        <span className="size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-electric-400/40">
                          <img src={IMAGES.portrait} alt="" aria-hidden className="size-full object-cover object-top" />
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                          m.from === "user"
                            ? "bg-gold-gradient text-ink"
                            : "glass text-foreground/85"
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}

                  {/* input */}
                  <div className="mt-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
                    <span className="truncate text-sm text-foreground/40">
                      Ask about focus, nerves, routine…
                    </span>
                    <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-electric-gradient text-white">
                      <Send className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
