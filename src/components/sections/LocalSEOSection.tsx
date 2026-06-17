"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Swords,
  Flame,
  Target,
  Brain,
  ShieldCheck,
  GraduationCap,
  Phone,
  Star,
  ExternalLink,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { SEO } from "@/lib/seo";
import { SITE, whatsappLink } from "@/lib/site";

const localServices = [
  { icon: Swords, title: "Martial Arts Classes in Chennai" },
  { icon: Flame, title: "Wushu Coaching in Chennai" },
  { icon: Target, title: "Athlete Mindset Coaching in Chennai" },
  { icon: Brain, title: "Sports Psychology Workshops in Chennai" },
  { icon: ShieldCheck, title: "Confidence & Discipline Training for Students" },
  { icon: GraduationCap, title: "School & Academy Workshops" },
];

// ⚠️ Replace "#" with your real Google Business Profile / Justdial / BookMyPlayer URLs.
const directories = [
  { label: "Google Business Profile", href: "#", color: "#4285F4" },
  { label: "Justdial", href: "#", color: "#1F7AE0" },
  { label: "BookMyPlayer", href: "#", color: "#16A34A" },
];

export function LocalSEOSection() {
  return (
    <section id="chennai" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "right-[5%] top-[14%]", size: 220, tint: "gold", duration: 15 },
          { className: "left-[4%] bottom-[10%]", size: 190, tint: "electric", duration: 17, delay: 1 },
        ]}
      />
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <MapPin className="size-4" />
            Based in Chennai
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Sports Psychology, Wushu &amp; Martial Arts Coaching in{" "}
            <span className="text-gradient-gold">Chennai</span>
          </h2>
          <p className="mt-4 text-pretty text-foreground/70">
            Kishore Kumar offers Sports Psychology + Martial Arts coaching for
            athletes, students, parents, schools, colleges, academies, gyms and
            martial-arts learners across Chennai — including{" "}
            {SEO.areasServed.slice(1).join(", ")} and nearby areas.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {localServices.map((s) => (
            <Reveal key={s.title} className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                className="flex h-full items-center gap-3 rounded-2xl glass p-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                  <s.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-foreground/85">
                  {s.title}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </RevealGroup>

        {/* NAP + directory CTAs */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-3xl glass-gold p-6 sm:p-7 lg:flex-row">
            <div className="text-center lg:text-left">
              <div className="font-display text-lg font-bold">
                {SEO.brand}
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-foreground/65 lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-gold-300" />
                  {SEO.address.locality}, {SEO.address.region}
                </span>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-200"
                >
                  <Phone className="size-4 text-gold-300" />
                  {SITE.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {directories.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-foreground/85 transition-colors hover:bg-white/5"
                  style={{ borderColor: `${d.color}55`, backgroundColor: `${d.color}14` }}
                >
                  <Star className="size-3.5" style={{ color: d.color }} />
                  {d.label}
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
