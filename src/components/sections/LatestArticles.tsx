import Link from "next/link";
import { ArrowRight, Clock, Play } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { SORTED_POSTS } from "@/content/blog";

/**
 * "Latest from the blog" on the home page.
 *
 * This exists for link equity, not decoration. The home page is the strongest
 * page on the domain, and until now the blog was reachable only from the navbar
 * and footer — both sitewide, both heavily discounted by search engines. An
 * in-content link from the home body passes far more authority to the articles,
 * and a home page that changes as posts are added is a freshness signal in its
 * own right.
 *
 * Server component: no interactivity, so it ships no JavaScript.
 */
export function LatestArticles() {
  const latest = SORTED_POSTS.slice(0, 6);

  return (
    <Section id="articles" spacing="md">
      <SectionHeading
        eyebrow="Writing"
        title={
          <>
            Sports psychology,{" "}
            <span className="text-gradient-gold">written down</span>
          </>
        }
        lead="Practical articles on focus, confidence, pressure handling and martial arts training — plus a written companion to every video."
      />

      <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {latest.map((p) => (
          <Reveal key={p.slug} className="h-full">
            <Link
              href={`/blog/${p.slug}/`}
              className="glow-card group flex h-full flex-col rounded-2xl glass p-5 transition-colors hover:border-gold-400/25"
            >
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                {p.video && <Play className="size-3" aria-hidden="true" />}
                {p.category}
              </span>
              <h3 className="mt-2 text-balance font-display text-base uppercase leading-tight">
                {p.title}
              </h3>
              <p className="mt-2 grow text-sm leading-relaxed text-foreground/65">
                {p.excerpt}
              </p>
              <span className="mt-4 flex items-center gap-1.5 text-xs text-foreground/45">
                <Clock className="size-3.5" aria-hidden="true" />
                {p.readingMinutes} min read
              </span>
            </Link>
          </Reveal>
        ))}
      </RevealGroup>

      <Reveal className="mt-9 text-center">
        <Link
          href="/blog/"
          className="link-underline inline-flex items-center gap-2 font-semibold text-gold-200"
        >
          Read all {SORTED_POSTS.length} articles
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}
