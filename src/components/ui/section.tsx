import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Section shell — the vertical rhythm of the whole page lives here.
 *
 * Every section used to hand-roll `<section className="relative py-24">` plus a
 * container div, which meant spacing drifted section to section. Routing them
 * through one component makes the rhythm a decision instead of an accident.
 */

const SPACING = {
  /** Tight — for bands that belong to the section above them. */
  sm: "py-14 sm:py-16",
  /** Default section rhythm. */
  md: "py-20 sm:py-24",
  /** For the page's set-piece moments. */
  lg: "py-24 sm:py-32",
} as const;

const WIDTH = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "",
} as const;

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  spacing?: keyof typeof SPACING;
  width?: keyof typeof WIDTH;
  /** Adds the soft gold wash behind the section. */
  glow?: boolean;
}

export function Section({
  children,
  id,
  className,
  containerClassName,
  spacing = "md",
  width = "default",
  glow = false,
}: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt keeps anchored sections clear of the fixed navbar
      className={cn("relative scroll-mt-24", SPACING[spacing], className)}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-radial-glow"
        />
      )}
      <div className={cn("container relative", WIDTH[width], containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Section heading — eyebrow, title, optional lead paragraph.
 *
 * The eyebrow's rule is decorative, so it's aria-hidden; the measure on the
 * lead paragraph is capped near 65 characters, which is where reading speed
 * peaks.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-12 sm:mb-14",
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", centered && "justify-center")}>
          <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-pretty text-foreground/65",
            centered && "mx-auto",
            "max-w-[62ch]"
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
