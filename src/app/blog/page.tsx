
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { SEO } from "@/lib/seo";
import { jsonLdString } from "@/lib/utils";
import { SORTED_POSTS } from "@/content/blog";

const url = `${SEO.siteUrl}/blog`;

/** Topic hubs, derived from post categories so they can never drift apart. */
const TOPICS = Object.values(
  SORTED_POSTS.reduce<Record<string, { slug: string; name: string; count: number }>>(
    (acc, p) => {
      const slug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      acc[slug] = { slug, name: p.category, count: (acc[slug]?.count ?? 0) + 1 };
      return acc;
    },
    {}
  )
).sort((a, b) => b.count - a.count);

export const metadata: Metadata = {
  title: "Blog — Sports Psychology & Martial Arts, Chennai",
  description:
    "Articles on sports psychology, athlete mindset, Wushu and martial arts training by Kishore Kumar — National Wushu Medalist and sports psychologist in Chennai.",
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Blog | Kishore Kumar — Sports Psychology & Martial Arts, Chennai",
    description:
      "Practical articles on focus, confidence, pressure handling and martial arts training from Chennai sports psychologist Kishore Kumar.",
    url,
    images: [{ url: "/images/strong-mind.webp", width: 1200, height: 630 }],
  },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}/#blog`,
        name: "Kishore Kumar — Sports Psychology & Martial Arts Blog",
        description:
          "Articles on sports psychology, athlete mindset and martial arts training in Chennai.",
        url,
        inLanguage: "en-IN",
        publisher: { "@id": `${SEO.siteUrl}/#organization` },
        author: { "@id": `${SEO.siteUrl}/#kishore` },
        blogPost: SORTED_POSTS.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${url}/${p.slug}`,
          datePublished: p.publishedAt,
          author: { "@id": `${SEO.siteUrl}/#kishore` },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: url },
        ],
      },
    ],
  };

  const [lead, ...rest] = SORTED_POSTS;

  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <AmbientBackground />
      <Navbar />

      <main id="main">
        <section className="relative pb-12 pt-28 md:pt-32">
          <div className="container relative max-w-4xl text-center">
            <nav
              aria-label="Breadcrumb"
              className="flex justify-center gap-1.5 text-xs text-foreground/50"
            >
              <Link href="/" className="transition-colors hover:text-gold-200">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground/80">Blog</span>
            </nav>

            <h1 className="mt-5 text-balance font-display text-fluid-3xl font-bold uppercase leading-[1.02]">
              Sports Psychology &amp;{" "}
              <span className="text-gradient-gold-sheen">Martial Arts</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[62ch] text-pretty text-foreground/70">
              Practical writing on focus, confidence, pressure handling and
              martial arts training — from Kishore Kumar, National Wushu
              Medalist and sports psychologist in Chennai.
            </p>

            {/* Topic hubs — the cluster entry points */}
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {TOPICS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog/topic/${t.slug}`}
                  className="rounded-full border border-gold-400/25 bg-white/5 px-4 py-2 text-sm text-foreground/75 transition-colors hover:border-gold-400/60 hover:text-gold-100"
                >
                  {t.name}
                  <span className="ml-1.5 text-foreground/40">{t.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative pb-20">
          <div className="container max-w-6xl">
            {/* Lead post — the entity article, given the most weight */}
            {lead && (
              <Reveal>
                <Link
                  href={`/blog/${lead.slug}`}
                  className="glow-card group mb-8 grid gap-6 overflow-hidden rounded-3xl glass-gold p-7 md:grid-cols-[1.1fr_1fr] md:p-9"
                >
                  <div className="flex flex-col justify-center">
                    <span className="inline-flex w-fit rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs uppercase tracking-wide text-gold-200">
                      {lead.category}
                    </span>
                    <h2 className="mt-4 text-balance font-display text-2xl uppercase leading-tight sm:text-3xl">
                      {lead.title}
                    </h2>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/70">
                      {lead.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                      Read article
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lead.image}
                      alt={lead.imageAlt}
                      className="h-full min-h-52 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      width={1672}
                      height={941}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                </Link>
              </Reveal>
            )}

            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Reveal key={p.slug} className="h-full">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="glow-card group flex h-full flex-col overflow-hidden rounded-3xl glass transition-colors hover:border-gold-400/25"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.imageAlt}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        width={1672}
                        height={941}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />
                    </div>

                    <div className="flex grow flex-col p-6">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                        {p.category}
                      </span>
                      <h2 className="mt-2 text-balance font-display text-lg uppercase leading-tight">
                        {p.title}
                      </h2>
                      <p className="mt-2 grow text-sm leading-relaxed text-foreground/65">
                        {p.excerpt}
                      </p>
                      <span className="mt-4 flex items-center gap-1.5 text-xs text-foreground/45">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {p.readingMinutes} min read
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </RevealGroup>

            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
