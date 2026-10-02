"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { LeadCta, LeadLink } from "@/components/shared/lead-gate";
import { NAV_LINKS } from "@/lib/site";
import { cn, scrollToId } from "@/lib/utils";

/** Spring for the sliding active-section pill. */
const PILL_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — the section crossing the middle of the screen is "here".
  // One observer, a thin band at mid-screen, and only the sections the nav
  // links to; on pages without them (blog, programs) nothing is observed and
  // no link lights up.
  useEffect(() => {
    const sections = NAV_LINKS.flatMap((l) => (l.id ? [document.getElementById(l.id)] : [])).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Escape closes the mobile menu, as any disclosure should.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const desktopLink =
    "relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-gold-100";

  return (
    <m.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4")}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 md:px-5",
            // bg-ink/75 under the glass gradient: blur alone lets bright
            // content (gold buttons, headlines) read through the bar as it
            // scrolls beneath. The tint keeps the bar legible on its own, and
            // is the whole defence in any browser without backdrop-filter.
            scrolled ? "glass bg-ink/75 shadow-card" : "border border-transparent bg-transparent"
          )}
        >
          {/* No aria-label: it replaced the visible "KISHORE KUMAR" with "Back to
              top", so speech-input users saying what they see could not
              target the button (WCAG 2.5.3). The purpose is appended as
              screen-reader-only text instead, after whatever is visible. */}
          <button onClick={() => scrollToId("top")} className="flex min-h-11 items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink shadow-glow">
              KK
            </span>
            {/* Hidden from lg to xl: with all eight links showing, the bar is
                too narrow for the name and the subtitle wrapped to three
                lines. It returns once there is room. */}
            <span className="hidden whitespace-nowrap text-left leading-tight sm:block lg:hidden xl:block">
              <span className="block font-display text-sm font-semibold tracking-wide text-foreground">
                KISHORE KUMAR
              </span>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-gold-300">
                Mindset · Martial Arts
              </span>
            </span>
            <span className="sr-only">— back to top</span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = !!link.id && link.id === active;
              const pill = isActive && (
                <m.span
                  layoutId="nav-pill"
                  transition={reduce ? { duration: 0 } : PILL_SPRING}
                  className="absolute inset-0 -z-10 rounded-full bg-gold-400/10 ring-1 ring-gold-400/30"
                />
              );
              const tone = isActive ? "text-gold-100" : "text-foreground/70";
              return link.href ? (
                <Link key={link.label} href={link.href} className={cn(desktopLink, tone)}>
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => go(link.id!)}
                  className={cn(desktopLink, tone)}
                  aria-current={isActive ? "location" : undefined}
                >
                  {pill}
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LeadLink
              intent="I'd like to know more about your coaching."
              campaign="navbar-whatsapp"
              ariaLabel="WhatsApp"
              className="hidden size-11 place-items-center rounded-full glass text-gold-200 transition-colors hover:text-gold-100 sm:grid"
            >
              <MessageCircle className="size-5" />
            </LeadLink>
            <LeadCta
              size="md"
              className="hidden h-11 px-5 sm:inline-flex"
              intent="I'd like to book a free athlete mindset call."
              campaign="navbar-book-call"
            >
              Book Free Call
            </LeadCta>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full glass text-foreground lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {/* The icon turns as it swaps, rather than blinking over */}
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={open ? "x" : "menu"}
                  initial={reduce ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduce ? undefined : { rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid place-items-center"
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.nav
              id="mobile-menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, when: "beforeChildren", staggerChildren: reduce ? 0 : 0.035 } }}
              exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.15 } }}
              style={{ transformOrigin: "top right" }}
              className="glass mt-2 rounded-3xl bg-ink/85 p-3 shadow-card lg:hidden"
            >
              {/* Numbered tiles, two to a row: every target is a full 56px
                  tall, the whole menu fits a phone screen without scrolling,
                  and the section you are in is marked. */}
              <ul className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map((link, i) => {
                  const isActive = !!link.id && link.id === active;
                  const tile = cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left transition-colors",
                    isActive
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-100"
                      : "border-white/[0.06] bg-white/[0.03] text-foreground/85 hover:bg-white/[0.06]"
                  );
                  const inner = (
                    <>
                      <span className="font-display text-xs tabular-nums text-gold-400/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-base font-semibold uppercase tracking-wide">
                        {link.label}
                      </span>
                    </>
                  );
                  return (
                    <m.li
                      key={link.label}
                      variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, show: { opacity: 1, y: 0 } }}
                      initial="hidden"
                      animate="show"
                      transition={{ duration: 0.25, delay: reduce ? 0 : 0.04 + i * 0.035 }}
                    >
                      {link.href ? (
                        <Link href={link.href} onClick={() => setOpen(false)} className={tile}>
                          {inner}
                        </Link>
                      ) : (
                        <button
                          onClick={() => go(link.id!)}
                          className={tile}
                          aria-current={isActive ? "location" : undefined}
                        >
                          {inner}
                        </button>
                      )}
                    </m.li>
                  );
                })}
              </ul>
              <div className="mt-2 grid grid-cols-[auto_1fr] gap-2">
                <LeadLink
                  intent="I'd like to know more about your coaching."
                  campaign="navbar-mobile-whatsapp"
                  ariaLabel="WhatsApp"
                  className="grid size-14 place-items-center rounded-2xl glass text-gold-200"
                >
                  <MessageCircle className="size-5" />
                </LeadLink>
                <LeadCta
                  size="lg"
                  className="w-full"
                  intent="I'd like to book a free athlete mindset call."
                  campaign="navbar-mobile-book-call"
                >
                  Book Free Call
                </LeadCta>
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </div>
    </m.header>
  );
}
