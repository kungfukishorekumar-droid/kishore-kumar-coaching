"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  Brain,
  Heart,
  Gauge,
  Repeat,
  CalendarCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { FloatingShapes } from "@/components/ui/floating-shapes";

const features = [
  { icon: Dumbbell, label: "Body discipline" },
  { icon: Brain, label: "Mind control" },
  { icon: Heart, label: "Emotional strength" },
  { icon: Gauge, label: "Pressure response" },
  { icon: Repeat, label: "Confidence through repetition" },
  { icon: CalendarCheck, label: "Better routines" },
  { icon: RotateCcw, label: "Comeback mindset" },
];

export function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden py-24">
      <FloatingShapes
        shapes={[
          { className: "left-[4%] top-[18%]", size: 220, tint: "gold", duration: 14 },
          { className: "right-[5%] bottom-[10%]", size: 200, tint: "electric", duration: 16, delay: 1 },
        ]}
      />
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            The solution
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Train the Mind
            <span className="text-gradient-gold"> Like the Body</span>
          </h2>
          <p className="mt-4 text-pretty text-foreground/70">
            Martial arts builds discipline, control and consistency. Sports
            psychology builds focus, confidence, emotional control and pressure
            handling. Together, they help athletes perform with more clarity,
            calmness and confidence.
          </p>
        </Reveal>

        <RevealGroup
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.05}
        >
          {features.map((f, i) => (
            <Reveal key={f.label}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-full flex-col items-center gap-2.5 rounded-2xl glass p-4 text-center"
              >
                <span
                  className={`grid size-10 place-items-center rounded-xl ${
                    i % 2
                      ? "bg-electric-500/12 text-electric-300 ring-1 ring-electric-400/20"
                      : "bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20"
                  }`}
                >
                  <f.icon className="size-5" />
                </span>
                <span className="text-xs font-semibold leading-tight text-foreground/85">
                  {f.label}
                </span>
              </motion.div>
            </Reveal>
          ))}

          {/* closing chip to balance the 8th cell */}
          <Reveal>
            <div className="flex h-full items-center justify-center gap-2 rounded-2xl glass-gold p-4 text-center">
              <Sparkles className="size-4 text-gold-300" />
              <span className="text-xs font-bold uppercase tracking-wide text-gold-100">
                Mind + Body
              </span>
            </div>
          </Reveal>
        </RevealGroup>
      </div>
    </section>
  );
}
