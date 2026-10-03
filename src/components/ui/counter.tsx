"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * A number that counts up when it scrolls into view.
 *
 * The final figure is what renders on the server and before the count
 * starts. It used to start at 0, so the page's HTML — what search engines
 * and answer engines read — said "0+ Athletes & Students Coached". The count
 * from zero now only runs in the browser, once the number is on screen, and
 * not at all for reduced motion.
 */
export function Counter({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  // null = show the final value (server render, reduced motion, finished)
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(progress < 1 ? Math.round(eased * to) : null);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {(value ?? to).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
