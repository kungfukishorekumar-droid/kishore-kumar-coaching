"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Lazy framer-motion.
 *
 * The site used the full `motion` component everywhere, which bundles every
 * framer feature into the first-load JavaScript — ~62KB gzipped, the largest
 * block of code on the page Lighthouse flagged as unused at load. Components
 * now use the lightweight `m` component, and the animation features arrive
 * here as a separate chunk fetched after hydration.
 *
 * Until that chunk lands (a few hundred ms on a slow phone), `m` elements
 * render their server-rendered initial state and simply start animating once
 * the features arrive. Nothing depends on an animation having run, so a
 * visitor on a slow connection sees the finished page, only without the
 * entrance flourish for that first moment.
 *
 * `strict` in development makes framer throw if a full `motion` component
 * slips back in — which would silently re-bundle everything. Off in
 * production so a stray import could never take a page down.
 */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict={process.env.NODE_ENV !== "production"}>
      {children}
    </LazyMotion>
  );
}
