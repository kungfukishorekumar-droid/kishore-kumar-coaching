"use client";

import { useEffect } from "react";

/**
 * Pointer tracking for every `.glow-card` on the site, from one listener.
 *
 * The glow (see .glow-card in globals.css) reads the pointer position from
 * --mx / --my. Only the Programs cards ever wrote them, through inline
 * handlers — which also made that section a client component. The blog index,
 * topic pages, related posts and the homepage's latest articles all carry the
 * class but never had a tracker, so their glow sat off-card and never showed.
 *
 * One delegated `pointermove` on the document serves all of them, including
 * cards rendered later by client navigation. Mouse only: on touch there is no
 * hover, and tracking a scrolling thumb would just flicker the glow.
 */
export function GlowTracker() {
  useEffect(() => {
    let active: HTMLElement | null = null;

    function reset(el: HTMLElement) {
      el.style.setProperty("--mx", "-100%");
      el.style.setProperty("--my", "-100%");
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".glow-card") ?? null;
      if (active && active !== card) reset(active);
      active = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      // Written straight to CSS vars, so nothing re-renders on move.
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }

    function onLeaveWindow() {
      if (active) reset(active);
      active = null;
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  return null;
}
