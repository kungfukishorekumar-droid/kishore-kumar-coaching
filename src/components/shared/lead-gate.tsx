/**
 * The lead gate — one form in front of every WhatsApp entry point on the site.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * Every CTA used to be a plain `wa.me` link. A visitor who tapped one landed in
 * WhatsApp having left no trace: no name, no sport, no reason for the message,
 * and nothing in the CRM unless they happened to also fill the checklist form
 * further down the page. Whoever never replied in WhatsApp was simply gone.
 *
 * Now every one of those CTAs opens this modal first. The visitor's details are
 * posted to /api/lead/ (which writes the CRM), and WhatsApp opens straight
 * afterwards carrying what they typed — so the conversation still starts in
 * WhatsApp, but the lead exists whether or not it does.
 *
 * ── Failing open, on purpose ─────────────────────────────────────────────────
 * The CRM call never blocks the hand-off. If /api/lead/ is down, rate-limits, or
 * times out, WhatsApp still opens and the message still carries every field the
 * visitor filled in — the details reach Kishore by chat instead of by CRM. A
 * lead lost to an outage is worse than a lead that arrives in the wrong place.
 *
 * ── Three exports ────────────────────────────────────────────────────────────
 *   LeadGateProvider  once, in the root layout — holds the single modal
 *   LeadCta           a Button-styled trigger (most CTAs)
 *   LeadLink          an unstyled trigger, for icon buttons and inline links
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle, ShieldCheck, X } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Turnstile, turnstileEnabled } from "@/components/ui/turnstile";
import { LEAD_FORM, SITE, whatsappLink } from "@/lib/site";
import { submitLead } from "@/lib/lead-client";
import { cn } from "@/lib/utils";

/** What a CTA tells the gate about itself. */
export type LeadIntent = {
  /** Opening line of the WhatsApp message — what this visitor asked for. */
  intent?: string;
  /** CRM `campaign`: which button on which section produced the lead. */
  campaign?: string;
  /** Modal heading. Defaults to the booking wording. */
  title?: string;
};

const DEFAULT_INTENT = "I'd like to book a free athlete mindset call.";

type GateContext = { open: (intent?: LeadIntent) => void };

const LeadGateContext = createContext<GateContext | null>(null);

export function useLeadGate(): GateContext {
  const ctx = useContext(LeadGateContext);
  if (!ctx) {
    // Loud on purpose. The silent alternative — falling back to a plain wa.me
    // link — would look fine in the browser while quietly dropping the lead,
    // which is the exact failure this component exists to remove.
    throw new Error("useLeadGate must be used inside <LeadGateProvider> (see app/layout.tsx)");
  }
  return ctx;
}

export function LeadGateProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<LeadIntent | null>(null);

  const open = useCallback((next?: LeadIntent) => setIntent(next ?? {}), []);
  const close = useCallback(() => setIntent(null), []);

  return (
    <LeadGateContext.Provider value={{ open }}>
      {children}
      <LeadGateModal intent={intent} onClose={close} />
    </LeadGateContext.Provider>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Triggers
   ──────────────────────────────────────────────────────────────────────────── */

type TriggerProps = LeadIntent & { children: ReactNode; className?: string };

/** Button-styled trigger. Drop-in replacement for `<Button asChild><a …>`. */
export function LeadCta({
  intent,
  campaign,
  title,
  children,
  ...button
}: TriggerProps & Omit<ButtonProps, "asChild" | "onClick" | "title">) {
  const gate = useLeadGate();
  return (
    <Button type="button" onClick={() => gate.open({ intent, campaign, title })} {...button}>
      {children}
    </Button>
  );
}

/**
 * Unstyled trigger, for the places a Button would be wrong: the navbar's icon
 * button, the footer's social row, inline text links. Renders a real <button>
 * so it stays keyboard-reachable.
 */
export function LeadLink({
  intent,
  campaign,
  title,
  children,
  className,
  ariaLabel,
}: TriggerProps & { ariaLabel?: string }) {
  const gate = useLeadGate();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => gate.open({ intent, campaign, title })}
      className={cn("cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   The modal
   ──────────────────────────────────────────────────────────────────────────── */

type Fields = {
  name: string;
  phone: string;
  email: string;
  age: string;
  sport: string;
  who: string;
  challenge: string;
  goal: string;
  /** Honeypot. Hidden from people; a filled value marks the sender a bot. */
  company: string;
};

const EMPTY: Fields = {
  name: "",
  phone: "",
  email: "",
  age: "",
  sport: "",
  who: LEAD_FORM.whoOptions[0],
  challenge: LEAD_FORM.challengeOptions[0],
  goal: "",
  company: "",
};

/**
 * The WhatsApp message.
 *
 * Carries every field the visitor filled, so the chat opens with the full
 * picture and Kishore never has to ask for it again — and so the details still
 * arrive even when the CRM write failed.
 */
function waMessage(f: Fields, intent: string): string {
  return [
    `Hi Kishore, ${intent}`,
    f.name && `Name: ${f.name}`,
    f.phone && `Phone/WhatsApp: ${f.phone}`,
    f.email && `Email: ${f.email}`,
    f.age && `Age: ${f.age}`,
    f.sport && `Sport/Activity: ${f.sport}`,
    f.who && `I am a: ${f.who}`,
    f.challenge && `Main challenge: ${f.challenge}`,
    f.goal && `Goal: ${f.goal}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function LeadGateModal({ intent, onClose }: { intent: LeadIntent | null; onClose: () => void }) {
  const open = intent !== null;
  const line = intent?.intent ?? DEFAULT_INTENT;

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  /**
   * Did the lead actually reach the CRM? The success panel tells the truth
   * about it rather than claiming "saved" for a submission that went nowhere.
   */
  const [forwarded, setForwarded] = useState(true);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setFields((f) => ({ ...f, [key]: value }));

  const firstFieldRef = useRef<HTMLInputElement>(null);
  /** The element that opened the modal, so focus can go back where it started. */
  const openerRef = useRef<Element | null>(null);

  // Reset for the next visitor whenever the modal is dismissed, so a second CTA
  // does not reopen on someone else's half-filled form.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      return;
    }
    setFields(EMPTY);
    setToken("");
    setStatus("idle");
    setForwarded(true);
  }, [open]);

  // Escape closes, and the page behind stops scrolling while the modal is up.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      // Return focus to the CTA that opened this, so a keyboard user is not
      // dropped back at the top of the document.
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Built before the network call, so the hand-off is ready the instant the
    // CRM answers — or fails.
    const url = whatsappLink(waMessage(fields, line));

    let reached = false;
    try {
      const result = await submitLead(
        {
          name: fields.name,
          phone: fields.phone,
          email: fields.email,
          age: fields.age,
          sport: fields.sport,
          who: fields.who,
          challenge: fields.challenge,
          goal: fields.goal,
          magnet: intent?.campaign ?? "whatsapp-cta",
          company: fields.company,
        },
        token
      );
      reached = result.forwarded;
    } catch {
      // Never blocks the visitor — WhatsApp below is the guaranteed path.
    }

    setForwarded(reached);
    setStatus("done");
    setToken("");

    // Pop-up blockers can eat this; the success panel's button is the fallback.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-gold-400/20";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lead-gate-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            key="lead-gate-modal"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative my-auto w-full max-w-lg rounded-3xl glass-gold p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-gate-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-foreground/40 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-4 text-center"
                >
                  <CheckCircle2 className="size-14 text-gold-300" />
                  <h3 id="lead-gate-title" className="font-display text-2xl font-bold uppercase">
                    Opening WhatsApp&hellip;
                  </h3>
                  <p className="max-w-sm text-sm text-foreground/70">
                    {forwarded
                      ? "Your details are saved. WhatsApp should have opened — if it didn't, tap below to reach Coach Kishore directly."
                      : "WhatsApp should have opened. If it didn't, tap below — your details go through in the message itself."}
                  </p>
                  <Button asChild className="mt-1">
                    {/* Ungated on purpose: the visitor has already been
                        collected, and this is their way out if the pop-up was
                        blocked. */}
                    <a
                      href={whatsappLink(waMessage(fields, line))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4" />
                      Open WhatsApp
                    </a>
                  </Button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-foreground/45 underline-offset-2 hover:text-foreground/70 hover:underline"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3
                    id="lead-gate-title"
                    className="pr-8 font-display text-2xl font-bold uppercase"
                  >
                    {intent?.title ?? "Book Your Free Mindset Call"}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/55">
                    Your details first &mdash; then WhatsApp opens with everything filled in.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        ref={firstFieldRef}
                        required
                        aria-label="Your name"
                        autoComplete="name"
                        placeholder="Your name *"
                        value={fields.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputCls}
                      />
                      <input
                        required
                        type="tel"
                        aria-label="Phone or WhatsApp number"
                        autoComplete="tel"
                        placeholder="Phone / WhatsApp *"
                        value={fields.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="email"
                        aria-label="Email"
                        autoComplete="email"
                        placeholder="Email (optional)"
                        value={fields.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputCls}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={3}
                        max={100}
                        aria-label="Athlete age"
                        placeholder="Age (optional)"
                        value={fields.age}
                        onChange={(e) => set("age", e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <input
                      aria-label="Sport or activity"
                      placeholder="Sport / activity — e.g. Wushu, Cricket"
                      value={fields.sport}
                      onChange={(e) => set("sport", e.target.value)}
                      className={inputCls}
                    />

                    <Chips
                      label="I am a"
                      options={LEAD_FORM.whoOptions}
                      value={fields.who}
                      onChange={(v) => set("who", v)}
                    />
                    <Chips
                      label="Main challenge"
                      options={LEAD_FORM.challengeOptions}
                      value={fields.challenge}
                      onChange={(v) => set("challenge", v)}
                    />

                    <textarea
                      rows={2}
                      aria-label="Your goal"
                      placeholder="What do you want to achieve? (optional)"
                      value={fields.goal}
                      onChange={(e) => set("goal", e.target.value)}
                      className={cn(inputCls, "resize-none")}
                    />

                    {/* Honeypot. Positioned off-screen rather than display:none —
                        some bots skip hidden inputs — and out of the tab order
                        and the accessibility tree, so no visitor can reach it. */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
                    >
                      <input
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={fields.company}
                        onChange={(e) => set("company", e.target.value)}
                      />
                    </div>

                    {/* Renders only when Turnstile is configured. Without it a
                        gate submission would be rejected the day the bot check
                        is switched on. */}
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
                          Saving &amp; Opening WhatsApp&hellip;
                        </>
                      ) : (
                        <>
                          Confirm &amp; Connect on WhatsApp
                          <MessageCircle className="size-4" />
                        </>
                      )}
                    </Button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-foreground/45">
                      <ShieldCheck className="size-3.5" />
                      No spam, ever. Only Kishore sees this.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              value === o
                ? "border-gold-400 bg-gold-gradient text-ink"
                : "border-white/15 bg-white/5 text-foreground/70 hover:border-gold-400/40"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Re-exported so a call site can offer the raw number without importing site.ts. */
export const WHATSAPP_DIRECT = SITE.whatsapp;
