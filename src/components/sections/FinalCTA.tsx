"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Bot, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowRing } from "@/components/ui/floating-shapes";
import { Sparkles } from "@/components/ui/sparkles";
import { SITE, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-400/20 p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800/70 via-ink to-ink" />
          <GlowRing className="left-1/2 top-1/2 size-[520px] max-w-[120%] -translate-x-1/2 -translate-y-1/2" />
          <div className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl" />
          {/* Glitter inside the closing panel — the page's last beat */}
          <Sparkles density={0.00028} maxParticles={110} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="font-display text-3xl text-gradient-gold sm:text-4xl">
              心技体
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
              Your body trains for performance.
              <br />
              <span className="text-gradient-gold drop-shadow-[0_1px_14px_rgba(207,156,58,0.16)]">
                Now train your mind for victory.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-foreground/70">
              Build focus, discipline and confidence with a coach who has
              competed, studied and coached the mental game. Take the first step
              today.
            </p>

            <div className="mt-9 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {/* The one action the whole page builds toward — the only button
                  on the site that gets the pulsing halo. */}
              <Button asChild size="lg" className="btn-halo">
                <a
                  href={whatsappLink("Hi Kishore, I'd like to book a free call.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book Free Call
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Message on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="electric">
                <a href={SITE.customGpt} target="_blank" rel="noreferrer">
                  <Bot className="size-4" />
                  Start with Custom GPT
                </a>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => scrollToId("institutions")}>
                <Building2 className="size-4" />
                Invite for Workshop
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
