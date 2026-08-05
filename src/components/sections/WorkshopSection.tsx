"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowRing } from "@/components/ui/floating-shapes";
import { WORKSHOP, whatsappLink } from "@/lib/site";
import { submitLead } from "@/lib/lead-client";
import { cn } from "@/lib/utils";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

function getTimeLeft(dateStr: string): TimeLeft {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    expired: false,
  };
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-gold-400/25 bg-white/[0.04] sm:h-20 sm:w-20">
        <span className="font-display text-3xl font-bold tabular-nums text-gold-200 sm:text-4xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
        {label}
      </span>
    </div>
  );
}

function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Static build: submit straight to the CRM's Supabase queue, same path as
    // the main lead form. The WhatsApp fallback in the success panel is the
    // safety net, so a CRM hiccup still shows a confirmation rather than an
    // error the visitor can do nothing about.
    try {
      await submitLead({
        name,
        phone,
        email,
        who: "athlete / student",
        magnet: `Workshop: ${WORKSHOP.title}`,
        goal: `Workshop registration: ${WORKSHOP.title}`,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("workshop register failed", err);
    }
    setStatus("done");
  }

  const waConfirm = whatsappLink(
    `Hi Kishore, I just registered for the ${WORKSHOP.title}. Looking forward to it!`
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md rounded-3xl glass-gold p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-foreground/40 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {status === "done" ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle2 className="size-14 text-gold-300" />
                <h3 className="font-display text-2xl font-bold uppercase">
                  You&apos;re registered!
                </h3>
                <p className="max-w-xs text-sm text-foreground/70">
                  Kishore will reach out on WhatsApp to confirm your seat and share
                  the workshop link.
                </p>
                <Button asChild className="mt-2">
                  <a href={waConfirm} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Message Kishore
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold uppercase">
                  Reserve Your Seat
                </h3>
                <p className="mt-1 text-sm text-foreground/50">
                  {WORKSHOP.title} · {WORKSHOP.price}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />

                  {status === "error" && (
                    <p className="text-sm text-red-400">
                      Something went wrong. Please try WhatsApp instead.
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Reserve My Seat
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>

                  <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-foreground/45">
                    <ShieldCheck className="size-3.5" />
                    No spam. Kishore will confirm on WhatsApp.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WorkshopSection() {
  // null until mounted → server + first client render use a stable placeholder
  // (avoids a hydration mismatch on this statically-rendered ISR page).
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeLeft(getTimeLeft(WORKSHOP.date));
    const id = setInterval(() => setTimeLeft(getTimeLeft(WORKSHOP.date)), 1000);
    return () => clearInterval(id);
  }, []);

  const t = timeLeft ?? ZERO_TIME;

  const seatsPercent = Math.round((WORKSHOP.spotsLeft / WORKSHOP.totalSeats) * 100);

  const workshopDate = new Date(WORKSHOP.date);
  const dateLabel = workshopDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = workshopDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const waMsg = `Hi Kishore, I'd like to register for the ${WORKSHOP.title} on ${dateLabel}.`;

  return (
    <section id="workshop" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/50 via-ink to-ink" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(224,169,60,0.25), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(224,169,60,0.25), transparent)",
        }}
      />
      <GlowRing className="pointer-events-none absolute right-[-8%] top-1/2 size-[480px] -translate-y-1/2 opacity-25" />

      <RegisterModal open={showModal} onClose={() => setShowModal(false)} />

      <div className="container relative max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-200">
            <span className="size-1.5 animate-pulse rounded-full bg-gold-400" />
            Upcoming Workshop
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            {WORKSHOP.title}
          </h2>
          <p className="mt-1.5 text-lg text-foreground/55">{WORKSHOP.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/55">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-gold-400" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-gold-400" />
              {timeLabel} IST
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-gold-400" />
              {WORKSHOP.mode}
            </span>
          </div>
        </motion.div>

        {/* Main two-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* LEFT: countdown + seats + price + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            {/* Countdown */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              {t.expired ? (
                <div className="py-2 text-center">
                  <p className="font-display text-xl font-bold uppercase text-gold-300">
                    Workshop is Live!
                  </p>
                  <p className="mt-1 text-sm text-foreground/55">
                    Join via the link Kishore sent you.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                    Starting in
                  </p>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CountUnit value={t.days} label="Days" />
                    <span className="mt-4 font-light text-foreground/20">:</span>
                    <CountUnit value={t.hours} label="Hrs" />
                    <span className="mt-4 font-light text-foreground/20">:</span>
                    <CountUnit value={t.minutes} label="Min" />
                    <span className="mt-4 font-light text-foreground/20">:</span>
                    <CountUnit value={t.seconds} label="Sec" />
                  </div>
                </>
              )}
            </div>

            {/* Seats */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <Users className="size-4 text-gold-300" />
                  Seats available
                </span>
                <span className="font-bold text-gold-200">
                  {WORKSHOP.spotsLeft} of {WORKSHOP.totalSeats}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${seatsPercent}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={cn(
                    "h-full rounded-full",
                    seatsPercent <= 40 ? "bg-red-400" : "bg-gold-400"
                  )}
                />
              </div>
              {WORKSHOP.spotsLeft <= 10 && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  Only {WORKSHOP.spotsLeft} spots left — filling fast
                </p>
              )}
            </div>

            {/* Price + what's included */}
            <div className="rounded-2xl glass-gold p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-gold-200">
                  {WORKSHOP.price}
                </span>
                <span className="text-sm text-foreground/45">{WORKSHOP.priceNote}</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {WORKSHOP.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={() => setShowModal(true)}>
                Reserve Your Seat
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT: agenda */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl glass p-7"
          >
            <h3 className="font-display text-xl font-bold uppercase text-foreground/80">
              Workshop Agenda
            </h3>
            <p className="mt-1 text-sm text-foreground/45">
              {WORKSHOP.durationMinutes} minutes · live & interactive
            </p>

            <ol className="mt-6">
              {WORKSHOP.agenda.map((item, i) => (
                <li key={item.time} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < WORKSHOP.agenda.length - 1 && (
                    <div className="absolute left-3.5 top-7 h-full w-px bg-white/10" />
                  )}
                  <div className="relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold-400/35 bg-ink text-xs font-bold text-gold-300">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/35">
                      {item.time}
                    </span>
                    <p className="mt-0.5 text-sm font-medium leading-snug text-foreground/80">
                      {item.topic}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm text-foreground/50">
                Seats are filling fast. Lock yours in before they're gone.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-100"
              >
                Register now <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
