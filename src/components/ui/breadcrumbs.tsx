import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb trail. The links used to be bare 12px text — a 16px-tall tap
 * target on a phone. Each link now carries a 44px tall hit area, pulled back
 * with negative margin so the trail sits exactly where it did.
 */
export function Breadcrumbs({
  items,
  align = "left",
  className,
}: {
  /** The last item is the current page and is not linked. */
  items: { label: string; href?: string }[];
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "-my-3 flex flex-wrap items-center gap-x-1.5 text-xs text-foreground/50",
        align === "center" && "justify-center",
        className
      )}
    >
      {items.map((item, i) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="-mx-1.5 inline-flex min-h-11 items-center px-1.5 transition-colors hover:text-gold-200"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-foreground/80">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
