"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, CalendarCheck } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.7;
      const lead = document.getElementById("lead");
      const inLead = lead
        ? lead.getBoundingClientRect().top < window.innerHeight &&
          lead.getBoundingClientRect().bottom > 0
        : false;
      setShow(past && !inLead);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop: floating side buttons */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-6 right-5 z-40 hidden flex-col gap-3 lg:flex"
          >
            <a
              href={whatsappLink("Hi Kishore, I'd like to know more about your coaching.")}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
              className="group grid size-14 place-items-center rounded-full bg-gold-gradient text-ink shadow-glow-lg transition-transform hover:-translate-y-1"
            >
              <MessageCircle className="size-6" />
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-400/40" />
            </a>
            <a
              href={SITE.customGpt}
              target="_blank"
              rel="noreferrer"
              aria-label="Athlete Mindset GPT"
              title="Athlete Mindset GPT"
              className="grid size-14 place-items-center rounded-full bg-electric-gradient text-white shadow-glow-blue transition-transform hover:-translate-y-1"
            >
              <Bot className="size-6" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: sticky bottom CTA bar */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 lg:hidden"
          >
            <div className="flex w-full max-w-md items-center gap-1.5 rounded-full glass p-1.5 shadow-glow-lg backdrop-blur-xl">
              <button
                onClick={() => scrollToId("lead")}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-4 py-3 text-sm font-bold text-ink"
              >
                <CalendarCheck className="size-4" />
                Book Free Call
              </button>
              <a
                href={whatsappLink("Hi Kishore, I'd like to know more.")}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-11 place-items-center rounded-full bg-gold-400/15 text-gold-200"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href={SITE.customGpt}
                target="_blank"
                rel="noreferrer"
                aria-label="Athlete Mindset GPT"
                className="grid size-11 place-items-center rounded-full bg-electric-500/15 text-electric-300"
              >
                <Bot className="size-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
