import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Topic hub links. On a phone they are one swipeable row that bleeds to the
 * screen edges (they used to wrap into three ragged lines); from sm up they
 * wrap, centred or left-aligned. Every chip is a 44px tap target, with the
 * post count as a small badge.
 */
export function TopicChips({
  topics,
  current,
  align = "center",
}: {
  topics: { slug: string; name: string; count: number }[];
  current?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "scroll-row -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0",
        align === "center" && "sm:justify-center"
      )}
    >
      {topics.map((t) => {
        const on = t.slug === current;
        return (
          <Link
            key={t.slug}
            href={`/blog/topic/${t.slug}/`}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-all duration-300 motion-safe:hover:-translate-y-0.5",
              on
                ? "border-gold-400/60 bg-gold-400/15 text-gold-100"
                : "border-gold-400/25 bg-white/5 text-foreground/75 hover:border-gold-400/60 hover:text-gold-100"
            )}
          >
            {t.name}
            <span className="grid min-w-6 place-items-center rounded-full bg-white/[0.08] px-1.5 py-0.5 text-xs tabular-nums text-foreground/60">
              {t.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
