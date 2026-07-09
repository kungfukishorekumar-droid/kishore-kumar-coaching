import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely serialise structured-data (JSON-LD) for use inside a <script> tag.
 * JSON.stringify alone is insufficient: a literal </script> inside a string
 * value would terminate the tag and open an XSS vector.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
}

/**
 * Smooth-scroll to a section id, accounting for the sticky navbar.
 * If the section isn't on the current page (e.g. a /programs/[slug] sub-page),
 * navigate to the home page anchor instead so nav + CTAs work everywhere.
 */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
