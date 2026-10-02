
import { shareImages } from "@/lib/og-cards";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { KineticBand } from "@/components/ui/kinetic-band";
import { PostCard } from "@/components/blog/post-card";
import { TopicChips } from "@/components/blog/topic-chips";
import { SEO } from "@/lib/seo";
import { authorRef, publisherRef } from "@/lib/schema";
import { jsonLdString } from "@/lib/utils";
import { SORTED_POSTS } from "@/content/blog";

const url = `${SEO.siteUrl}/blog/`;

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
    images: shareImages("blog").og,
    type: "website",
    locale: "en_IN",
    title: "Blog | Kishore Kumar — Sports Psychology & Martial Arts, Chennai",
    description:
      "Practical articles on focus, confidence, pressure handling and martial arts training from Chennai sports psychologist Kishore Kumar.",
    url,
  },
  twitter: {
    card: "summary_large_image",
    images: shareImages("blog").twitter,
  },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        name: "Kishore Kumar — Sports Psychology & Martial Arts Blog",
        description:
          "Articles on sports psychology, athlete mindset and martial arts training in Chennai.",
        url,
        inLanguage: "en-IN",
        publisher: publisherRef(),
        author: authorRef(),
        blogPost: SORTED_POSTS.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          // `url` already ends in a slash (trailingSlash: true), so no separator.
          url: `${url}${p.slug}/`,
          datePublished: p.publishedAt,
          author: authorRef(),
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
            <Breadcrumbs align="center" items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

            <h1
              className="anim-rise anim-solid mt-5 text-balance font-display text-fluid-3xl font-bold uppercase leading-[1.02]"
              style={{ "--d": "60ms" } as React.CSSProperties}
            >
              Sports Psychology &amp;{" "}
              <span className="text-gradient-gold-sheen">Martial Arts</span>
            </h1>
            <p
              className="anim-rise mx-auto mt-4 max-w-[62ch] text-pretty text-foreground/70"
              style={{ "--d": "140ms" } as React.CSSProperties}
            >
              Practical writing on focus, confidence, pressure handling and
              martial arts training — from Kishore Kumar, National Wushu
              Medalist and sports psychologist in Chennai.
            </p>

            {/* Topic hubs — the cluster entry points. One swipeable row on a
                phone (it wrapped to three ragged lines), centred and wrapping
                from sm up. */}
            <div
              className="anim-rise mt-7"
              style={{ "--d": "220ms" } as React.CSSProperties}
            >
              <TopicChips topics={TOPICS} />
            </div>
          </div>
        </section>

        <section className="relative pb-20">
          <div className="container max-w-6xl">
            {/* Lead post — the entity article, given the most weight */}
            {lead && (
              <Reveal>
                <Link
                  href={`/blog/${lead.slug}/`}
                  className="glow-card group mb-6 grid gap-6 overflow-hidden rounded-3xl glass-gold p-5 sm:p-7 md:mb-8 md:grid-cols-[1.1fr_1fr] md:p-9"
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
                      srcSet={lead.photo?.srcSet}
                      sizes="(min-width: 768px) 560px, 100vw"
                      alt={lead.imageAlt}
                      className="h-full min-h-52 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      width={lead.photo?.width ?? 1672}
                      height={lead.photo?.height ?? 941}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                </Link>
              </Reveal>
            )}

            <RevealGroup className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {rest.map((p) => (
                <Reveal key={p.slug} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </RevealGroup>
            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to home
              </Link>
            </div>
          </div>
        </section>
        <KineticBand
          top={["Focus", "Confidence", "Pressure", "Discipline"]}
          bottom={["Sports psychology", "Written down", "心技体"]}
        />
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
