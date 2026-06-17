"use client";

import { Reveal } from "@/components/ui/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/site";

export function FAQ() {
  return (
    <section id="faq" className="relative py-24">
      <div className="container max-w-3xl">
        <Reveal className="mb-12 text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gold-400" />
            Answers
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
