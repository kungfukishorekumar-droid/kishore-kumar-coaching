import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Kinetic type band — two strips of oversized words crossing like tape,
 * looping in opposite directions and drifting with the scroll (see .kinetic
 * in globals.css).
 *
 * Decorative: every word on it is said in full elsewhere on the page, so the
 * band is hidden from assistive tech rather than read out twice. The words
 * are drawn by CSS (`content: attr(data-w)`) rather than written as text:
 * the outlined strip is deliberately low-contrast ornament, and as real text
 * it failed Lighthouse's contrast audit despite aria-hidden.
 */
export function KineticBand({
  top,
  bottom,
  className,
}: {
  /** Words on the solid gold strip. */
  top: string[];
  /** Words on the outlined strip. */
  bottom: string[];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("kinetic select-none", className)}>
      <Strip words={top} className="kinetic-row--a" />
      <Strip words={bottom} className="kinetic-row--b" />
    </div>
  );
}

function Strip({ words, className }: { words: string[]; className: string }) {
  // Enough copies to outrun a wide screen, then the whole run twice so the
  // loop can move by exactly half and land where it started.
  const run = [...words, ...words, ...words];
  return (
    <div className={cn("kinetic-row", className)}>
      <div className="kinetic-track font-display text-[clamp(2.25rem,8vw,6.5rem)] font-extrabold uppercase leading-none tracking-tight">
        {[0, 1].map((copy) => (
          <span key={copy}>
            {run.map((w, i) => (
              <Fragment key={i}>
                <span className="kinetic-word" data-w={w} />
                <span className="kinetic-star" />
              </Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
