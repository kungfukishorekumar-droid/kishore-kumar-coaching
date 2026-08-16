"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile — invisible/managed bot check for the lead forms.
 *
 * Turnstile only *protects* if its token is verified server-side; a widget
 * alone is theatre a bot skips by calling the API directly. So this renders the
 * widget and hands the token up, and the Supabase Edge Function
 * (supabase/functions/submit-lead) is what actually verifies it before writing
 * a row. See docs/connect-spartacus-to-crm.md.
 *
 * Graceful by design: with no NEXT_PUBLIC_TURNSTILE_SITE_KEY the component
 * renders nothing and reports itself "not configured", so the forms keep
 * working exactly as they do today until Turnstile is switched on.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const turnstileEnabled = Boolean(SITE_KEY);

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "flexible" | "compact";
        }
      ) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Load the Turnstile API once, shared across every widget on the page. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_SRC}"]`
  );
  if (existing) {
    // Both a load and an error must settle this promise. Listening only for
    // "load" left the second widget on the page waiting forever whenever the
    // script request failed (adblock, offline), so its .catch() never ran.
    return new Promise((res, rej) => {
      existing.addEventListener("load", () => res());
      existing.addEventListener("error", () =>
        rej(new Error("Turnstile failed to load"))
      );
    });
  }

  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
}

export function Turnstile({
  onVerify,
  onExpire,
  className,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  /**
   * Callbacks live in refs, and the effect below mounts the widget exactly once.
   *
   * Both call sites pass an inline arrow for onExpire (`() => setToken("")`), so
   * putting the callbacks in the dependency array made the effect re-run on
   * EVERY parent render: cleanup removed the widget, the effect rendered a fresh
   * unsolved one. Two consequences, both only visible once a site key is set —
   * which is why this survived: picking a chip in the form silently discarded a
   * solved challenge, and a managed widget that auto-solves would fire its
   * callback → setToken → render → remount → callback, i.e. an unbounded
   * remount loop hammering Cloudflare.
   *
   * Refs keep the latest callback without making it an effect input.
   */
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          size: "flexible",
          callback: (token) => onVerifyRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          // A failed challenge must not silently look "verified".
          "error-callback": () => onExpireRef.current?.(),
        });
      })
      .catch(() => {
        /* Network/adblock: leave the token empty. The submit path decides how
           to handle a missing token (see the forms). */
      });

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} className={className} />;
}
