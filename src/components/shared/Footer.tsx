"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Bot, Mail, MapPin, Phone, Youtube, ExternalLink } from "lucide-react";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/site";
import { SEO } from "@/lib/seo";
import { scrollToId } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-900/60 pb-10 pt-16">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink">
                KK
              </span>
              <div>
                <div className="font-display text-base font-semibold tracking-wide">
                  KISHORE KUMAR
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold-300">
                  Athlete Mindset Coach
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-foreground/55">
              Sports psychology meets martial-arts discipline. Helping athletes,
              students and institutions build focus, confidence and a winning
              mindset — in Chennai and online.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Instagram, href: SITE.socials.instagram, label: "Instagram" },
                { icon: Youtube, href: SEO.youtube.url, label: "YouTube channel" },
                { icon: MessageCircle, href: whatsappLink(), label: "WhatsApp" },
                { icon: Bot, href: SITE.customGpt, label: "AI Mindset Coach" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full glass text-foreground/70 transition-colors hover:text-gold-200"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/55 transition-colors hover:text-gold-200"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToId(l.id!)}
                      className="text-sm text-foreground/55 transition-colors hover:text-gold-200"
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
              {/* Sister property. Linked here and declared in sameAs so search
                  engines merge the two sites into one entity rather than
                  treating them as unrelated competitors. */}
              <li>
                <a
                  href={SEO.academy.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/55 transition-colors hover:text-gold-200"
                >
                  {SEO.academy.name}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-foreground/55">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-gold-200">
                  <Phone className="size-4 text-gold-300" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 transition-colors hover:text-gold-200">
                  <Mail className="size-4 text-gold-300" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.customGpt} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-gold-200">
                  <Bot className="size-4 text-electric-400" />
                  Athlete Mindset GPT
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-gold-300" />
                {SITE.location}
              </li>
            </ul>
            <button
              onClick={() => scrollToId("lead")}
              className="mt-5 inline-flex rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-bold text-ink shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Get Free Checklist
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-foreground/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Train the mind. <span className="text-gold-300">Perform like a champion.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
