"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, whatsappLink } from "@/lib/site";
import { cn, scrollToId } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4")}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 md:px-5",
            scrolled ? "glass shadow-card" : "border border-transparent bg-transparent"
          )}
        >
          <button onClick={() => scrollToId("top")} className="flex items-center gap-3" aria-label="Back to top">
            <span className="grid size-9 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink shadow-glow">
              KK
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block font-display text-sm font-semibold tracking-wide text-foreground">
                KISHORE KUMAR
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-gold-300">
                Mindset · Martial Arts
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-white/5 hover:text-gold-100"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => go(link.id!)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-white/5 hover:text-gold-100"
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink("Hi Kishore, I'd like to know more about your coaching.")}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hidden size-10 place-items-center rounded-full glass text-gold-200 transition-colors hover:text-gold-100 sm:grid"
            >
              <MessageCircle className="size-5" />
            </a>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={whatsappLink("Hi Kishore, I'd like to book a free athlete mindset call.")} target="_blank" rel="noreferrer">
                Book Free Call
              </a>
            </Button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full glass text-foreground lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass mt-2 flex flex-col gap-1 rounded-3xl p-3 lg:hidden"
            >
              {NAV_LINKS.map((link) =>
                link.href ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-gold-100"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => go(link.id!)}
                    className="rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-gold-100"
                  >
                    {link.label}
                  </button>
                )
              )}
              <Button asChild className="mt-1 w-full">
                <a href={whatsappLink("Hi Kishore, I'd like to book a free athlete mindset call.")} target="_blank" rel="noreferrer">
                  Book Free Call
                </a>
              </Button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
