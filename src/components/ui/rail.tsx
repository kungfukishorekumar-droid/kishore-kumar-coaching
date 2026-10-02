import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Turns a card grid into a swipeable rail on phones (see .rail in
 * globals.css). Wrap the grid in <RailScope>, give the grid the `rail` class,
 * and put <RailMeta /> after it — the progress bar under the rail is driven
 * by the rail's own scroll, so all three stay server components.
 */
export function RailScope({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rail-scope", className)}>{children}</div>;
}

export function RailMeta({ label = "Swipe" }: { label?: string }) {
  return (
    <div className="rail-meta" aria-hidden="true">
      <span className="rail-bar" />
      <span>
        {label} <span className="rail-nudge">→</span>
      </span>
    </div>
  );
}
