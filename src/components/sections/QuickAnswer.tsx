"use client";

import { Trophy, Users, GraduationCap, Swords } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/reveal";

const cards = [
  {
    icon: Trophy,
    who: "For athletes",
    text: "Focus, confidence and pressure handling for training and competition.",
  },
  {
    icon: Users,
    who: "For parents",
    text: "Discipline, routine and emotional control for children and young athletes.",
  },
  {
    icon: GraduationCap,
    who: "For schools & academies",
    text: "Mindset workshops and performance training for students and teams.",
  },
  {
    icon: Swords,
    who: "For martial arts learners",
    text: "Body discipline and mental strength built side by side.",
  },
];

export function QuickAnswer() {
  return (
    <section id="overview" className="relative py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            Quick answer
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            What does Kishore Kumar help athletes with?
          </h2>
          {/* Direct answer — written for answer engines & AI search (AEO) */}
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-foreground/75">
            Kishore Kumar helps athletes, students and martial-arts learners in{" "}
            <span className="text-gold-200">Chennai</span> build focus,
            discipline, confidence, emotional control, pressure handling and a
            winning mindset — using Sports Psychology + Martial Arts coaching.
          </p>
        </Reveal>

        <RevealGroup
          className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2"
          stagger={0.06}
        >
          {cards.map((c) => (
            <Reveal key={c.who}>
              <div className="flex h-full items-start gap-4 rounded-2xl glass p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink shadow-glow">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {c.who}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                    {c.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
