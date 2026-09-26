"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Quality, SceneFactory, SceneHandle } from "./types";

/**
 * ThreeScene — the single place WebGL is allowed to start.
 *
 * Every 3D surface on the site mounts through here so the expensive decisions
 * are made once, correctly:
 *
 *  • three.js is `import()`ed inside the effect, never at module scope. It is
 *    ~170KB gzipped — larger than the rest of this page's JavaScript put
 *    together — so it must not be in the initial bundle, and it must not be
 *    fetched for a visitor who never scrolls to it.
 *  • Nothing loads until the wrapper enters the viewport. Combined with the
 *    above, a bounce costs zero bytes of three.js.
 *  • The loop stops when the canvas scrolls out of view and when the tab is
 *    hidden. A 3D scene animating behind another tab is pure battery drain.
 *  • `fallback` is what the server renders, what a visitor without WebGL keeps,
 *    and what anyone asking for reduced motion keeps. The 3D is an upgrade
 *    layered on top of a page that is already complete without it — so this
 *    can never be the reason the section is blank.
 *  • dispose() runs on unmount: scene resources, then the renderer, then a
 *    forced context loss. Browsers cap live WebGL contexts (~16); leaking them
 *    across client-side navigations kills 3D for the rest of the session.
 */
export function ThreeScene({
  factory,
  fallback,
  className,
  /** How far outside the viewport to start loading. Early enough to be ready. */
  rootMargin = "200px",
}: {
  factory: SceneFactory;
  /** Rendered until — and instead of — the 3D scene. Must stand on its own. */
  fallback: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /**
   * Does the 3D scene currently own the surface? Drives the cross-fade, and
   * keeps `fallback` mounted underneath rather than swapping it out, so a
   * context loss mid-session degrades instead of leaving a hole.
   */
  const [live, setLive] = useState(false);

  /**
   * The factory is held in a ref so the effect does not re-run — and tear the
   * whole scene down and rebuild it — when a parent re-renders with a new
   * function identity. Same reason the Turnstile widget holds its callbacks
   * this way.
   */
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // ── Eligibility ─────────────────────────────────────────────────────────
    // Decided before anything is downloaded, so an ineligible visitor never
    // pays for three.js at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    if (nav.connection?.saveData) return;

    // A throwaway context is the only honest capability test: the flag can be
    // present while the driver is blocklisted, in which case this returns null.
    const probe = document.createElement("canvas");
    const supported = !!(
      probe.getContext("webgl2") || probe.getContext("webgl")
    );
    if (!supported) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = nav.hardwareConcurrency ?? 8;
    const quality: Quality = coarse || cores <= 4 ? "low" : "high";

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    /** Loaded lazily; `start` is only called once the wrapper is in view. */
    async function start() {
      const THREE = await import("three");
      if (cancelled) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        alpha: true, // the page's own gradients show through
        antialias: quality === "high",
        powerPreference: quality === "high" ? "high-performance" : "low-power",
      });
      renderer.setClearAlpha(0);
      // Capped at 2 on desktop and 1.5 on phones. Retina phones report 3, and
      // rendering 9× the pixels for a decorative scene is how a mid-range
      // Android drops to single-digit frame rates.
      const maxDpr = quality === "high" ? 2 : 1.5;

      let handle: SceneHandle;
      try {
        handle = factoryRef.current({ THREE, scene, camera, quality });
      } catch {
        // A scene that cannot build is not worth taking the section down for.
        renderer.dispose();
        return;
      }

      // ── Sizing ────────────────────────────────────────────────────────────
      // ResizeObserver rather than reading layout now: at effect time the
      // wrapper can still be 0×0 (a parent animating in, or a hidden tab), and
      // bailing on a zero measurement is what left the sparkles canvas blank.
      function applySize(width: number, height: number) {
        if (width < 1 || height < 1) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        handle.resize?.(width, height);
      }

      const ro = new ResizeObserver(([entry]) => {
        const box = entry.contentRect;
        applySize(box.width, box.height);
      });
      ro.observe(wrap!);

      // ── Pointer parallax ──────────────────────────────────────────────────
      // Smoothed here rather than in each scene, and skipped entirely on touch
      // devices, where there is no hover to follow.
      let targetX = 0;
      let targetY = 0;
      let pointerX = 0;
      let pointerY = 0;

      function onPointerMove(e: PointerEvent) {
        const box = wrap!.getBoundingClientRect();
        if (!box.width || !box.height) return;
        targetX = ((e.clientX - box.left) / box.width) * 2 - 1;
        targetY = ((e.clientY - box.top) / box.height) * 2 - 1;
      }
      function onPointerLeave() {
        targetX = 0;
        targetY = 0;
      }
      if (!coarse) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        wrap!.addEventListener("pointerleave", onPointerLeave);
      }

      // ── Loop ──────────────────────────────────────────────────────────────
      let raf = 0;
      let running = false;
      let last = 0;
      let elapsed = 0;

      function tick(now: number) {
        raf = requestAnimationFrame(tick);
        // Clamped: a tab restored after minutes would otherwise hand the scene
        // one enormous delta and teleport everything.
        const dt = Math.min((now - last) / 1000, 1 / 20);
        last = now;
        elapsed += dt;

        pointerX += (targetX - pointerX) * Math.min(dt * 4, 1);
        pointerY += (targetY - pointerY) * Math.min(dt * 4, 1);
        handle.pointer?.(pointerX, pointerY);

        handle.frame(elapsed, dt);
        renderer.render(scene, camera);
      }

      function play() {
        if (running) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
      function pause() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(raf);
      }

      // Runs only while on screen. Separate from the loader observer below,
      // which fires once and is done.
      const vis = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : pause()),
        { threshold: 0 }
      );
      vis.observe(wrap!);

      function onVisibility() {
        if (document.visibilityState === "hidden") pause();
        else if (wrap!.getBoundingClientRect().bottom > 0) play();
      }
      document.addEventListener("visibilitychange", onVisibility);

      // A lost context (driver reset, GPU pressure, too many contexts) would
      // otherwise leave a frozen last frame. Stop the loop and hand the
      // surface back to the fallback underneath.
      function onContextLost(e: Event) {
        e.preventDefault();
        pause();
        setLive(false);
      }
      canvas!.addEventListener("webglcontextlost", onContextLost);

      setLive(true);

      cleanup = () => {
        pause();
        vis.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas!.removeEventListener("webglcontextlost", onContextLost);
        if (!coarse) {
          window.removeEventListener("pointermove", onPointerMove);
          wrap!.removeEventListener("pointerleave", onPointerLeave);
        }
        handle.dispose();
        renderer.dispose();
        // Releases the context immediately instead of waiting for the canvas to
        // be garbage collected, which is what keeps the browser's context
        // budget from filling up over a session.
        renderer.forceContextLoss();
      };
    }

    // Load on approach. `once`-style: disconnected as soon as it fires.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loader.disconnect();
        void start();
      },
      { rootMargin }
    );
    loader.observe(wrap);

    return () => {
      cancelled = true;
      loader.disconnect();
      cleanup?.();
    };
  }, [rootMargin]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {/* The fallback stays mounted beneath the canvas rather than unmounting.
          It costs one composited layer and means a context loss fades back to
          something finished instead of to nothing. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          live ? "opacity-0" : "opacity-100"
        )}
      >
        {fallback}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-1000",
          live ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
