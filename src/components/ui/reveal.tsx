import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered entrances — without shipping a component per element.
 *
 * These used to be framer-motion components, which made every section that
 * wanted an entrance a client component, so the homepage shipped (and
 * hydrated) the code for fifteen sections that are otherwise static HTML.
 * Now <Reveal> is a server component that only writes attributes; one small
 * observer (RevealObserver, mounted once in the root layout) adds `.is-in`
 * when an element scrolls into view, and CSS in globals.css does the motion.
 *
 * The motion itself is unchanged — the 3D "stand up" entrance and the rest —
 * see [data-reveal] in globals.css.
 *
 * Nothing is hidden unless JavaScript is running: the hidden start state is
 * scoped to `html.reveal-on`, which an inline script in the layout sets before
 * first paint and takes away again if the observer never arrives. With JS off
 * or broken, every section simply renders in place.
 */

type Variant = "up" | "swing" | "pop" | "fade" | "draw" | "rise";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children?: ReactNode;
  className?: string;
  /** Seconds, added on top of any group stagger. */
  delay?: number;
  /** Stand up in 3D (default), swing in, scale in from depth, plain fade, or draw a line out. */
  variant?: Variant;
  as?: "div" | "li" | "span" | "p" | "section";
}) {
  return (
    <Tag
      data-reveal={variant}
      className={cn(className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered group. Its direct <Reveal> children each enter as they scroll
 * into view, and children that arrive together cascade one after another
 * (see RevealObserver). The group only carries the stagger timing.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.045,
  delayChildren = 0,
  as: Tag = "div",
  "aria-hidden": ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "section";
  "aria-hidden"?: boolean;
}) {
  return (
    <Tag
      data-reveal-group=""
      aria-hidden={ariaHidden}
      className={cn(className)}
      style={
        {
          "--stagger": `${stagger}s`,
          "--reveal-base": `${delayChildren}s`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
