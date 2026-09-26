"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TiltCard — a card that turns toward the pointer in real perspective.
 *
 * ── The bug this replaces ───────────────────────────────────────────────────
 * The previous version put `perspective` on the same element it rotated. The
 * `perspective` property only affects an element's CHILDREN, so its own
 * rotation was rendered orthographically: no foreshortening, the near edge no
 * bigger than the far one. Every "3D tilt" on the site was a flat skew. The
 * fix is structural — an outer element owns the perspective, an inner one
 * rotates inside it.
 *
 * ── What it adds ────────────────────────────────────────────────────────────
 *  • a glare that tracks the pointer across the face, so the tilt reads as a
 *    lit surface rather than a transform
 *  • a lift toward the viewer on hover (translateZ, so it scales in perspective
 *    instead of just moving up)
 *  • `preserve-3d`, so <Depth> children can float off the face at their own Z
 *
 * Pointer tracking only runs where there is a hovering pointer. On a phone a
 * card that tilts under your thumb while you scroll is a bug, not an effect —
 * touch devices get the static card. Reduced motion gets the static card too.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  glare = true,
  lift = 18,
  perspective = 1000,
  /** Must match the card's own corner radius, or the glare shows square corners. */
  radiusClassName = "rounded-3xl",
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the card's edge. */
  max?: number;
  glare?: boolean;
  /** Hover lift toward the viewer, in px of Z. 0 disables. */
  lift?: number;
  perspective?: number;
  radiusClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Decided after mount: `matchMedia` does not exist during SSR, and guessing
  // there would render a different tree on the server than on the client.
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    setInteractive(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const active = interactive && !reduce;

  // -0.5…0.5 across the card, (0,0) at the centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const springy = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), springy);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), springy);
  const z = useSpring(useTransform(hover, [0, 1], [0, lift]), springy);

  const glareX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useSpring(hover, { stiffness: 180, damping: 24 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,240,210,0.22), rgba(255,255,255,0.06) 32%, transparent 62%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!active || e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r || !r.width || !r.height) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    hover.set(1);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
    hover.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative", className)}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={active ? { rotateX, rotateY, z } : undefined}
      >
        {children}
        {glare && active && (
          <motion.div
            aria-hidden
            className={cn("pointer-events-none absolute inset-0 z-10", radiusClassName)}
            // 1px of Z keeps the glare above the face instead of z-fighting it.
            style={{ background: glareBg, opacity: glareOpacity, z: 1 }}
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * A layer that floats off the face of its TiltCard.
 *
 * Only works when every element between it and the TiltCard keeps
 * `transform-style: preserve-3d` and has no overflow clipping, filter, opacity
 * below 1 or backdrop-filter — any of those flattens the 3D back onto a plane.
 * That is why cards built for depth keep their glass background as a separate,
 * sibling layer rather than wrapping the content in it.
 */
export function Depth({
  z,
  className,
  children,
  style,
}: {
  /** Distance off the face in px. Positive comes toward the viewer. */
  z: number;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ transform: `translateZ(${z}px)`, ...style }}
    >
      {children}
    </div>
  );
}
