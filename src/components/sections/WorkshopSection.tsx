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
import { Turnstile, turnstileEnabled } from "@/components/ui/turnstile";
import { cn } from "@/lib/utils";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

/**
 * How long a workshop stays "happening now" before the page stops advertising
 * it. Past that, the date is treated as stale rather than live — see
 * `phase` below.
 */
const LIVE_WINDOW_MS = 4 * 60 * 60 * 1000;

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

/**
 * Three states, not two.
 *
 * The old code had only "counting down" and "expired", and rendered expired as
 * "Workshop is Live! Join via the link Kishore sent you." That claim is true for
 * a few hours and false forever after — and because this page is prerendered at
 * build time with no revalidate, a date that slips into the past keeps that
 * banner up permanently next to a "Reserve Your Seat" button. The date in
 * lib/site.ts had in fact already gone stale, so the live site was telling every
 * visitor a workshop was in progress and their seat link was already sent.
 *
 * "stale" is the honest third state: the section stops promising a session and
 * asks for interest in the next one instead.
 */
type Phase = "countdown" | "live" | "stale";

function getPhase(dateStr: string): Phase {
  const start = new Date(dateStr).getTime();
  if (!Number.isFinite(start)) return "stale";
  const now = Date.now();
  if (now < start) return "countdown";
  return now - start < LIVE_WINDOW_MS ? "live" : "stale";
}

/**
 * Date/time labels are pinned to IST because the copy next to them says "IST".
 *
 * They were formatted in the runtime's own zone, so the prerender (UTC on CI and
 * on the Hostinger Node runtime) emitted "04:30 am IST" for a 10:00 IST session
 * while the visitor's browser re-rendered it as "10:00 am" — a wrong time in the
 * HTML that search engines and no-JS visitors see, and a React hydration
 * mismatch on every load.
 */
/**
 * Shout during the build when the configured date has already passed.
 *
 * The section degrades honestly on its own (see `Phase`), but a stale date still
 * means the site is running without a workshop to sell — that is a business
 * problem, not a rendering one, and nothing surfaced it. Printing it at build
 * time puts it in the CI log of every deploy until WORKSHOP.date is updated.
 */
if (typeof window === "undefined" && getPhase(WORKSHOP.date) === "stale") {
  // eslint-disable-next-line no-console
  console.warn(
    `\n⚠️  WORKSHOP.date (${WORKSHOP.date}) is in the past.\n` +
      `   The workshop section is rendering its "next date being announced" state.\n` +
      `   Set a new date in src/lib/site.ts to advertise a session again.\n`
  );
}

const IST = "Asia/Kolkata";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FMT = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

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

function RegisterModal({
  open,
  onClose,
  stale,
}: {
  open: boolean;
  onClose: () => void;
  /** No dated session on offer — the dialog collects interest instead. */
  stale: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  /** Honeypot value. Always "" for a human; anything else marks a bot. */
  const [company, setCompany] = useState("");
  // "error" was in this union but nothing ever set it, so its branch in the JSX
  // was unreachable. Failure is now carried by `forwarded` instead.
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  // Whether the registration actually reached the CRM — see the identical note
  // in LeadForm. A dropped registration must not read as "you're registered".
  const [forwarded, setForwarded] = useState(true);

  /**
   * RegisterModal stays mounted while `open` is false — only its contents
   * unmount — so its state survived a close. After one registration the panel
   * stayed on "done" permanently: reopening it showed someone else's
   * confirmation instead of a form, and a household or a coach registering two
   * athletes from the same browser simply could not. Reset on each open.
   */
  useEffect(() => {
    if (!open) return;
    setName("");
    setPhone("");
    setEmail("");
    setToken("");
    setCompany("");
    setStatus("idle");
    setForwarded(true);
  }, [open]);

  /**
   * Keyboard and screen-reader handling for the dialog. It had none: the overlay
   * was a plain div, so Escape did nothing, the page behind kept scrolling, and
   * assistive tech announced no dialog boundary at all — a keyboard user who
   * opened it could tab straight out into the page underneath with no way back.
   *
   * Escape + scroll lock + dialog semantics cover the common paths; the first
   * field also takes focus so the caret starts inside the dialog.
   */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Same CRM path as the main lead form (Edge Function when Turnstile is on).
    // The WhatsApp fallback in the success panel is the safety net, so a CRM
    // hiccup still shows a way forward rather than a dead-end error — but the
    // copy tells the visitor which of the two actually happened.
    let reached = false;
    try {
      const result = await submitLead(
        {
          name,
          phone,
          email,
          company,
          who: "athlete / student",
          magnet: `Workshop: ${WORKSHOP.title}`,
          // The two are different leads: one booked a dated seat, the other
          // asked to hear about the next date. The CRM should not treat an
          // interest signal as a confirmed registration.
          goal: stale
            ? `Workshop interest (awaiting next date): ${WORKSHOP.title}`
            : `Workshop registration: ${WORKSHOP.title}`,
        },
        token
      );
      reached = result.forwarded;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("workshop register failed", err);
    }
    setForwarded(reached);
    setToken("");
    setStatus("done");
  }

  // On the failure path the message carries the details the visitor typed, so
  // the registration still reaches Kishore without them retyping anything.
  const waConfirm = whatsappLink(
    forwarded
      ? `Hi Kishore, I just registered for the ${WORKSHOP.title}. Looking forward to it!`
      : [
          `Hi Kishore, I'd like to register for the ${WORKSHOP.title}.`,
          name && `Name: ${name}`,
          phone && `Phone: ${phone}`,
          email && `Email: ${email}`,
        ]
          .filter(Boolean)
          .join("\n")
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="workshop-register-title"
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
                <h3
                  id="workshop-register-title"
                  className="font-display text-2xl font-bold uppercase"
                >
                  {forwarded ? "You're registered!" : "One quick step"}
                </h3>
                <p className="max-w-xs text-sm text-foreground/70">
                  {forwarded
                    ? "Kishore will reach out on WhatsApp to confirm your seat and share the workshop link."
                    : "Your details didn't save just now. Tap below to send them on WhatsApp — that reaches Kishore directly and secures your seat."}
                </p>
                <Button asChild className="mt-2">
                  <a href={waConfirm} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    {forwarded ? "Message Kishore" : "Send on WhatsApp"}
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <h3
                  id="workshop-register-title"
                  className="font-display text-xl font-bold uppercase"
                >
                  {stale ? "Get the Next Date" : "Reserve Your Seat"}
                </h3>
                <p className="mt-1 text-sm text-foreground/50">
                  {stale
                    ? `${WORKSHOP.title} · next session`
                    : `${WORKSHOP.title} · ${WORKSHOP.price}`}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  {/* aria-label on each field: these inputs carry only a
                      placeholder, which vanishes on the first keystroke and is
                      not an accessible name, so a screen-reader user had three
                      unlabelled text boxes. autoComplete lets mobile fill them. */}
                  <input
                    required
                    autoFocus
                    aria-label="Your name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />
                  <input
                    required
                    type="tel"
                    aria-label="WhatsApp number"
                    autoComplete="tel"
                    placeholder="WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />
                  <input
                    type="email"
                    aria-label="Email (optional)"
                    autoComplete="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06]"
                  />

                  {/* Honeypot — see the identical field in LeadForm. Hidden from
                      people, filled by bots, discarded server-side. */}
                  <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                    <label htmlFor="workshop-company">Company (leave blank)</label>
                    <input
                      id="workshop-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  {/* Bot check — renders only when Turnstile is configured */}
                  <Turnstile onVerify={setToken} onExpire={() => setToken("")} />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === "sending" || (turnstileEnabled && !token)}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        {stale ? "Notify Me of the Next One" : "Reserve My Seat"}
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
  // The ticking digits stay null until mounted: they change every second, so
  // rendering them on the server could only ever produce a mismatch.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  /**
   * The phase, by contrast, IS resolved during render — including on the server.
   *
   * Deferring it to a post-mount effect meant the prerendered HTML always
   * advertised whatever `WORKSHOP.date` said, stale or not. That HTML is what a
   * crawler that doesn't run JS indexes, and it is what the page shows for the
   * moment before hydration, so a passed date was still being announced as an
   * upcoming session there. Phase changes at most twice per workshop, so
   * computing it in render costs nothing and makes the served markup honest.
   */
  const [phase, setPhase] = useState<Phase>(() => getPhase(WORKSHOP.date));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setTimeLeft(getTimeLeft(WORKSHOP.date));
      setPhase(getPhase(WORKSHOP.date));
    };
    sync();
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  }, []);

  const t = timeLeft ?? ZERO_TIME;
  const isStale = phase === "stale";

  const seatsPercent = Math.round((WORKSHOP.spotsLeft / WORKSHOP.totalSeats) * 100);

  const workshopDate = new Date(WORKSHOP.date);
  const dateLabel = DATE_FMT.format(workshopDate);
  const timeLabel = TIME_FMT.format(workshopDate);
  const waMsg = isStale
    ? `Hi Kishore, I'd like to know when the next ${WORKSHOP.title} is happening.`
    : `Hi Kishore, I'd like to register for the ${WORKSHOP.title} on ${dateLabel}.`;

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

      <RegisterModal
        open={showModal}
        onClose={() => setShowModal(false)}
        stale={isStale}
      />

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
            {/* A past date must not be presented as the session's date. */}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-gold-400" />
              {isStale ? "New date coming soon" : dateLabel}
            </span>
            {!isStale && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-gold-400" />
                {timeLabel} IST
              </span>
            )}
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
              {isStale ? (
                <div className="py-2 text-center">
                  <p className="font-display text-xl font-bold uppercase text-gold-300">
                    Next date being announced
                  </p>
                  <p className="mt-1 text-sm text-foreground/55">
                    Register your interest and you&apos;ll be first to get the
                    date and the early-bird seat.
                  </p>
                </div>
              ) : t.expired ? (
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

            {/* Seats — a live seat count for a session with no date is not a
                fact about anything, so the whole panel goes when stale. */}
            {!isStale && (
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
            )}

            {/* Price + what's included */}
            <div className="rounded-2xl glass-gold p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-gold-200">
                  {WORKSHOP.price}
                </span>
                <span className="text-sm text-foreground/45">
                  {isStale ? "Price held for the next session" : WORKSHOP.priceNote}
                </span>
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
                {isStale ? "Get the Next Date" : "Reserve Your Seat"}
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
                {isStale
                  ? "Dates are announced to the list first. Add your name and you'll hear before anyone else."
                  : "Seats are filling fast. Lock yours in before they're gone."}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-100"
              >
                {isStale ? "Tell me the next date" : "Register now"}{" "}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
