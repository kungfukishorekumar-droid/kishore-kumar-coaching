
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Play } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { SEO } from "@/lib/seo";
import { jsonLdString } from "@/lib/utils";
import { SORTED_POSTS } from "@/content/blog";

/**
 * Topic hubs — /blog/topic/sports-psychology and friends.
 *
 * 29 posts in a single flat list tells a search engine nothing about how they
 * relate. Grouping them into topic hubs creates the cluster structure that
 * demonstrates depth in a subject rather than scattered coverage, and gives
 * every article a second internal link from a topically relevant page.
 */

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function topics() {
  const map = new Map<string, { name: string; count: number }>();
  for (const p of SORTED_POSTS) {
    const slug = toSlug(p.category);
    map.set(slug, { name: p.category, count: (map.get(slug)?.count ?? 0) + 1 });
  }
  return map;
}

export function generateStaticParams() {
  return [...topics().keys()].map((topic) => ({ topic }));
}

type Params = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { topic } = await params;
  const t = topics().get(topic);
  if (!t) return {};

  const url = `${SEO.siteUrl}/blog/topic/${topic}`;
  return {
    title: `${t.name} Articles — Kishore Kumar, Chennai`,
    description: `${t.count} articles on ${t.name.toLowerCase()} by Kishore Kumar — National Wushu Medalist and sports psychologist in ${SEO.address.locality}.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      title: `${t.name} — Kishore Kumar`,
      description: `Articles on ${t.name.toLowerCase()} from Chennai sports psychologist Kishore Kumar.`,
      url,
    },
  };
}

export default async function TopicPage({ params }: Params) {
  const { topic } = await params;
  const t = topics().get(topic);
  if (!t) notFound();

  const posts = SORTED_POSTS.filter((p) => toSlug(p.category) === topic);
  const others = [...topics().entries()].filter(([slug]) => slug !== topic);
  const url = `${SEO.siteUrl}/blog/topic/${topic}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}/#collection`,
        name: `${t.name} — Articles by ${SEO.founder}`,
        url,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SEO.siteUrl}/blog/#blog` },
        about: { "@type": "Thing", name: t.name },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: posts.length,
          itemListElement: posts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: `${SEO.siteUrl}/blog/${p.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SEO.siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: t.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <AmbientBackground />
      <Navbar />

      <main id="main">
        <section className="relative pb-10 pt-28 md:pt-32">
          <div className="container relative max-w-4xl text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center gap-1.5 text-xs text-foreground/50">
              <Link href="/" className="transition-colors hover:text-gold-200">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="transition-colors hover:text-gold-200">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground/80">{t.name}</span>
            </nav>
            <h1 className="mt-5 text-balance font-display text-fluid-2xl font-bold uppercase leading-[1.05]">
              {t.name}
            </h1>
            <p className="mx-auto mt-3 text-foreground/65">
              {posts.length} article{posts.length === 1 ? "" : "s"} by {SEO.founder}
            </p>
          </div>
        </section>

        <section className="relative pb-16">
          <div className="container max-w-6xl">
            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
              {posts.map((p) => (
                <Reveal key={p.slug} className="h-full">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="glow-card group flex h-full flex-col rounded-2xl glass p-5 transition-colors hover:border-gold-400/25"
                  >
                    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                      {p.video && <Play className="size-3" aria-hidden="true" />}
                      {p.video ? "Video" : "Article"}
                    </span>
                    <h2 className="mt-2 text-balance font-display text-base uppercase leading-tight">
                      {p.title}
                    </h2>
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

            {/* Sibling hubs — keeps the cluster interlinked */}
            <div className="mt-12">
              <h2 className="font-display text-sm uppercase tracking-wider text-foreground/60">
                Other topics
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {others.map(([slug, o]) => (
                  <Link
                    key={slug}
                    href={`/blog/topic/${slug}`}
                    className="rounded-full border border-gold-400/25 bg-white/5 px-4 py-2 text-sm text-foreground/75 transition-colors hover:border-gold-400/60 hover:text-gold-100"
                  >
                    {o.name}
                    <span className="ml-1.5 text-foreground/40">{o.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                All articles
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
