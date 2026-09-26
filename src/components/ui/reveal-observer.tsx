"use client";

import { useEffect } from "react";

/**
 * The one piece of JavaScript behind every <Reveal> on the site.
 *
 * A single IntersectionObserver watches every [data-reveal] and adds `.is-in`
 * the first time each one enters the viewport (then stops watching it —
 * entrances play once). Each element is watched on its own, including the
 * items of a <RevealGroup>, which is how the framer version behaved: a card
 * at the bottom of a tall grid enters when IT is scrolled to. A
 * MutationObserver picks up elements that arrive later: client-side
 * navigation to another page, or content a client component renders after
 * mount.
 *
 * Marks <html> with `reveal-ready` so the inline failsafe in the layout knows
 * the observer arrived and does not un-hide everything.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        // Everything that arrives in one callback entered view together — a
        // row of cards scrolled up into the viewport. Those cascade in DOM
        // order (--i × the group's --stagger); anything arriving later starts
        // its own cascade from zero. So the stagger reads as a ripple across
        // what the visitor is looking at, and a card twenty items down a grid
        // never waits behind nineteen it was never shown with.
        const arriving = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        arriving.forEach((el, i) => {
          if (el.parentElement?.hasAttribute("data-reveal-group")) el.style.setProperty("--i", String(i));
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      // Matches the framer viewport it replaces: fire a little before the
      // element is fully on screen, not the instant its first pixel appears.
      { rootMargin: "-12% 0px -8% 0px" }
    );

    const seen = new WeakSet<Element>();
    function scan(scope: ParentNode) {
      scope.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.classList.contains("is-in")) return;
        io.observe(el);
      });
    }
    scan(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          if (el.matches("[data-reveal]")) scan(el.parentElement ?? document);
          else scan(el);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
