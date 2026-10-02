"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * "In this article". Two layouts:
 *  • rail — a sticky list beside the article on wide screens, with the
 *    section being read marked by a gold bar that slides between entries;
 *  • inline — a collapsed <details> above the body on phones and tablets.
 * Both are plain anchor links, so they work before hydration; the observer
 * only adds the "you are here" marker.
 */
export function Toc({ items, variant }: { items: TocItem[]; variant: "rail" | "inline" }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (variant !== "rail") return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, variant]);

  if (variant === "inline") {
    return (
      <details className="faq-item group rounded-2xl glass">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 font-semibold text-foreground/90 marker:hidden">
          <ListTree className="size-4 text-gold-300" aria-hidden="true" />
          In this article
          <span className="text-foreground/40">· {items.length} sections</span>
        </summary>
        <ol className="space-y-0.5 px-3 pb-3">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm text-foreground/70 transition-colors hover:bg-white/5 hover:text-gold-100"
              >
                <span className="font-display text-xs tabular-nums text-gold-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    );
  }

  return (
    <nav aria-label="In this article" className="text-sm">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-300">In this article</p>
      <ol className="mt-4 border-l border-white/10">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-px top-0 h-full w-0.5 origin-top bg-gold-400 transition-transform duration-300",
                  on ? "scale-y-100" : "scale-y-0"
                )}
              />
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "block py-1.5 pl-4 leading-snug transition-colors hover:text-gold-100",
                  on ? "text-gold-100" : "text-foreground/50"
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
