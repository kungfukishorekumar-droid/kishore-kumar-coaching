"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Sparkles — drifting, twinkling motes of light.
 *
 * Canvas rather than DOM nodes: a few hundred animated elements would mean a
 * few hundred style recalculations per frame, while a canvas is one composited
 * layer no matter the particle count.
 *
 * Three things keep it cheap, because ambient decoration must never be the
 * reason a phone drops frames:
 *   • an IntersectionObserver stops the loop the moment it scrolls out of view
 *   • the loop also stops when the tab is hidden (rAF is throttled there anyway)
 *   • particle count scales with area, hard-capped, and halves on coarse
 *     pointers (phones — smaller screen, weaker GPU)
 *
 * Under prefers-reduced-motion it paints one static frame: the texture stays,
 * the movement doesn't.
 */

type Particle = {
  x: number;
  y: number;
  r: number;
  /** Phase offset so they don't all twinkle in unison. */
  phase: number;
  /** Twinkle speed. */
  speed: number;
  /** Upward drift, px per frame. */
  drift: number;
  gold: boolean;
};

export function Sparkles({
  className,
  density = 0.00012,
  maxParticles = 90,
}: {
  className?: string;
  /** Particles per px² of canvas area. */
  density?: number;
  maxParticles?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let t = 0;
    let dpr = 1;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      // Cap DPR at 2 — beyond that the extra pixels cost real time and buy
      // nothing visible on soft glows.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(
        Math.floor(rect.width * rect.height * density * (coarse ? 0.5 : 1)),
        maxParticles
      );

      particles = Array.from({ length: target }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.5 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.006,
        drift: Math.random() * 0.12 + 0.03,
        gold: Math.random() > 0.32,
      }));
      return true;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const p of particles) {
        // Twinkle between roughly 0.15 and 1 opacity.
        const tw = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        const alpha = 0.15 + tw * 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(230, 190, 110, ${alpha})`
          : `rgba(226, 232, 245, ${alpha * 0.75})`;
        ctx.shadowBlur = p.r * 4;
        ctx.shadowColor = p.gold
          ? "rgba(224, 169, 60, 0.85)"
          : "rgba(190, 210, 245, 0.7)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const step = () => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      t += 1;
      for (const p of particles) {
        p.y -= p.drift;
        // Recycle past the top so the field never empties.
        if (p.y < -4) {
          p.y = rect.height + 4;
          p.x = Math.random() * rect.width;
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (!build()) return;
    draw(); // paint once so something is there even before/without motion

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : undefined);
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (build()) draw();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [density, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
