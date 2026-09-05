"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, Download, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { IMAGES, LEAD_FORM, whatsappLink } from "@/lib/site";
import { submitLead } from "@/lib/lead-client";
import { Turnstile, turnstileEnabled } from "@/components/ui/turnstile";
import { cn } from "@/lib/utils";

/**
 * Shown in the success panel before a submission has produced a real message —
 * i.e. if the panel is ever reached without form data. Kept as a constant so
 * the fallback link is never an empty WhatsApp draft.
 */
const FALLBACK_WA_MESSAGE =
  "Hi Kishore, I'd like the free Athlete Focus & Confidence Checklist.";

function buildWaMessage(data: Record<string, string>, who: string, challenge: string) {
  const parts = [FALLBACK_WA_MESSAGE];
  if (data.name) parts.push(`Name: ${data.name}`);
  if (data.phone) parts.push(`Phone/WhatsApp: ${data.phone}`);
  if (data.sport) parts.push(`Sport: ${data.sport}`);
  parts.push(`I am a: ${who}`);
  parts.push(`My main challenge: ${challenge}`);
  return parts.join("\n");
}

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [who, setWho] = useState(LEAD_FORM.whoOptions[0]);
  const [challenge, setChallenge] = useState(LEAD_FORM.challengeOptions[0]);
  const [token, setToken] = useState("");
  /**
   * Did the lead actually reach the CRM? Previously the result was discarded and
   * every submission rendered "Your details are saved" — so a CRM outage told
   * the visitor their details were captured when nothing had been written
   * anywhere, and the lead was lost in silence. The panel still never shows a
   * dead end; it just tells the truth about which path to trust.
   */
  const [forwarded, setForwarded] = useState(true);
  /**
   * Prefilled WhatsApp text. When the CRM hand-off fails this is the only route
   * the lead has left, so it carries what the visitor already typed rather than
   * asking them to type it a second time.
   */
  const [waMessage, setWaMessage] = useState(FALLBACK_WA_MESSAGE);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Build the WhatsApp message from the form data immediately so it
    // is ready to open the moment the CRM call resolves (or fails).
    const msg = buildWaMessage(data, who, challenge);
    const waUrl = whatsappLink(msg);

    // Post to WarriorCRM in the background. A failure never blocks the
    // visitor — WhatsApp is the guaranteed path; CRM is the bonus.
    let reached = false;
    try {
      const result = await submitLead(
        { ...data, who, challenge, magnet: "focus-confidence-checklist" },
        token
      );
      reached = result.forwarded;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("lead submit failed", err);
    }

    setForwarded(reached);
    setWaMessage(msg);
    setStatus("done");
    setToken("");
    form.reset();

    // Open WhatsApp immediately — the primary action after form fill.
    // window.open may be blocked by a pop-up blocker; the button in the
    // success panel is the fallback for that case.
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="lead" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
      <div className="container relative">
        <div className="overflow-hidden rounded-[2.5rem] border border-gold-400/15 glass shadow-glow-lg">
          <div className="grid lg:grid-cols-2">
            {/* Visual side */}
            <div className="relative hidden lg:block">
              <img
                src={IMAGES.strongMind}
                alt="Strong Mind. Stronger You. — Athlete focus & confidence"
                className="absolute inset-0 size-full object-cover object-left"
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink" />
            </div>

            {/* Form side */}
            <div className="p-7 sm:p-10">
              <Reveal>
                <span className="eyebrow">
                  <Download className="size-4" />
                  Free download
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  {LEAD_FORM.title}
                </h2>
                <p className="mt-2 text-sm text-foreground/60">{LEAD_FORM.sub}</p>
              </Reveal>

              <AnimatePresence mode="wait">
                {status === "done" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex flex-col items-center justify-center rounded-2xl glass-gold p-10 text-center"
                  >
                    <CheckCircle2 className="size-14 text-gold-300" />
                    <h3 className="mt-4 font-display text-2xl font-bold">
                      {forwarded ? "Opening WhatsApp… 🥋" : "Almost there 🥋"}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-foreground/70">
                      {forwarded
                        ? "Your details are saved. WhatsApp should have opened — if not, tap the button below and I'll send your free checklist straight to you."
                        : "WhatsApp should have opened. If it didn't, tap below — your details will come through directly and I'll send the checklist straight back."}
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button asChild>
                        <a
                          href={whatsappLink(waMessage)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          Open WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" onClick={() => setStatus("idle")}>
                        Submit another
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Name" name="name" placeholder="Full name" required />
                      <Field label="Phone / WhatsApp" name="phone" type="tel" placeholder="+91…" required />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Age" name="age" type="number" placeholder="e.g. 16" />
                      <Field label="Sport / Activity" name="sport" placeholder="e.g. Wushu, Cricket" />
                    </div>

                    {/* Parent or Athlete */}
                    <ChipGroup
                      label="I am a"
                      options={LEAD_FORM.whoOptions}
                      value={who}
                      onChange={setWho}
                    />
                    {/* Main challenge */}
                    <ChipGroup
                      label="Main challenge"
                      options={LEAD_FORM.challengeOptions}
                      value={challenge}
                      onChange={setChallenge}
                    />

                    {/* Honeypot. Hidden from people, irresistible to form-filling
                        bots — the server discards any submission that fills it.
                        Deliberately not `display:none`: some bots skip those, so
                        it is positioned off-screen instead, and taken out of the
                        tab order and the accessibility tree so no real visitor
                        can reach it by keyboard or screen reader. */}
                    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                      <label htmlFor="company">Company (leave blank)</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Bot check — renders only when Turnstile is configured */}
                    <Turnstile onVerify={setToken} onExpire={() => setToken("")} />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      // Block submit until the challenge is solved — but only
                      // when Turnstile is actually on, so the form isn't dead
                      // before it's configured.
                      disabled={status === "sending" || (turnstileEnabled && !token)}
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving & Opening WhatsApp…
                        </>
                      ) : (
                        <>
                          Get Checklist + Connect on WhatsApp
                          <MessageCircle className="size-4" />
                        </>
                      )}
                    </Button>

                    {/* The "or just WhatsApp me" escape hatch that used to sit
                        here was the one remaining way to reach WhatsApp without
                        leaving any details — the exact gap this form exists to
                        close. WhatsApp opens the moment this is submitted, so
                        nothing is lost by removing it. */}
                    <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-foreground/45">
                      <ShieldCheck className="size-3.5" />
                      No spam, ever. WhatsApp opens as soon as you submit.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60"
      >
        {label} {required && <span className="text-gold-300">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-gold-400/20"
      />
    </div>
  );
}

function ChipGroup({
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
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
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
