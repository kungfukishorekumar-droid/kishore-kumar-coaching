"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, Download, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { IMAGES, SITE, LEAD_FORM, whatsappLink } from "@/lib/site";
import { submitLead } from "@/lib/lead-client";
import { Turnstile, turnstileEnabled } from "@/components/ui/turnstile";
import { cn } from "@/lib/utils";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [who, setWho] = useState(LEAD_FORM.whoOptions[0]);
  const [challenge, setChallenge] = useState(LEAD_FORM.challengeOptions[0]);
  const [token, setToken] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Post to WarriorCRM's Supabase queue (Edge Function when Turnstile is on).
    // Failures are swallowed on purpose — the WhatsApp fallback in the success
    // panel is the real safety net, so a CRM hiccup must never block the user.
    try {
      await submitLead(
        { ...data, who, challenge, magnet: "focus-confidence-checklist" },
        token
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("lead submit failed", err);
    }

    setStatus("done");
    setToken("");
    form.reset();
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
                      You're in! 🥋
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-foreground/70">
                      Your details are saved. Tap below on WhatsApp and I'll send
                      your free checklist straight to you.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button asChild>
                        <a
                          href={whatsappLink(
                            "Hi Kishore, I just requested the free Athlete Focus & Confidence Checklist."
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          Get it on WhatsApp
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
                          Sending…
                        </>
                      ) : (
                        <>
                          Get Free Checklist
                          <Download className="size-4" />
                        </>
                      )}
                    </Button>

                    <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-foreground/45">
                      <ShieldCheck className="size-3.5" />
                      No spam, ever. Prefer to message?{" "}
                      <a
                        href={SITE.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold-200 hover:underline"
                      >
                        WhatsApp me
                      </a>
                      .
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
