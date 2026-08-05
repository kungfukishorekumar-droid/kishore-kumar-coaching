import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, MessageCircle, Sparkle } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { SectionDivider } from "@/components/ui/section-divider";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { jsonLdString } from "@/lib/utils";
import { POSTS, SORTED_POSTS, getPost } from "@/content/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// Next 15+ delivers route params as a Promise — see the same pattern in
// /programs/[slug], where reading them synchronously 404'd every page.
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SEO.siteUrl}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: SEO.founder, url: SEO.siteUrl }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_IN",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [SEO.founder],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SEO.siteUrl}/blog/${post.slug}`;
  const related = SORTED_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  /**
   * Schema graph. Three pieces doing three different jobs:
   *   BlogPosting     — the article itself, authored by the Person entity that
   *                     the home page already defines, so the blog reinforces
   *                     one identity rather than creating a second one.
   *   FAQPage         — AEO. These pairs are what answer engines quote.
   *   BreadcrumbList  — hierarchy for search result display.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}/#article`,
        headline: post.title,
        description: post.description,
        image: `${SEO.siteUrl}${post.image}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: { "@id": `${SEO.siteUrl}/#kishore` },
        publisher: { "@id": `${SEO.siteUrl}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: "en-IN",
        keywords: post.keywords.join(", "),
        articleSection: post.category,
        wordCount: post.sections.reduce(
          (n, s) => n + s.body.join(" ").split(/\s+/).length,
          0
        ),
        // AEO: names the passage worth reading aloud / lifting.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".quick-answer", "h1"],
        },
        about: {
          "@type": "Thing",
          name: post.category,
        },
        locationCreated: {
          "@type": "Place",
          name: "Chennai, Tamil Nadu, India",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SEO.siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      // VideoObject only when the post actually carries a video — emitting one
      // with placeholder values would be structured-data spam, and Google
      // penalises markup that doesn't match visible content.
      ...(post.video
        ? [
            {
              "@type": "VideoObject",
              "@id": `${url}/#video`,
              name: post.video.title,
              description: post.description,
              thumbnailUrl: `https://i.ytimg.com/vi/${post.video.id}/maxresdefault.jpg`,
              uploadDate: post.publishedAt,
              contentUrl: `https://www.youtube.com/watch?v=${post.video.id}`,
              embedUrl: `https://www.youtube-nocookie.com/embed/${post.video.id}`,
              publisher: { "@id": `${SEO.siteUrl}/#organization` },
              author: { "@id": `${SEO.siteUrl}/#kishore` },
            },
          ]
        : []),
    ],
  };

  const published = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <AmbientBackground />
      <Navbar />

      <main id="main">
        <article>
          {/* Header */}
          <header className="relative pb-10 pt-28 md:pt-32">
            <div className="container relative max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-xs text-foreground/50"
              >
                <Link href="/" className="transition-colors hover:text-gold-200">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/blog" className="transition-colors hover:text-gold-200">
                  Blog
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground/80">{post.category}</span>
              </nav>

              <h1 className="mt-5 text-balance font-display text-fluid-2xl font-bold uppercase leading-[1.05]">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/55">
                <span>
                  By{" "}
                  <span className="font-semibold text-gold-200">
                    {SEO.founder}
                  </span>{" "}
                  — {SEO.role}
                </span>
                <time dateTime={post.publishedAt}>{published}</time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {post.readingMinutes} min read
                </span>
              </div>
            </div>
          </header>

          {/* Hero image */}
          <div className="container max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt}
                className="aspect-[16/9] w-full object-cover"
                width={1672}
                height={941}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            </div>
          </div>

          {/* Quick answer — the passage built to be lifted by answer engines */}
          <div className="container mt-10 max-w-3xl">
            <div className="quick-answer rounded-2xl glass-gold p-6">
              <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-gold-200">
                <Sparkle className="size-4" aria-hidden="true" />
                Short answer
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-foreground/85">
                {post.quickAnswer}
              </p>
            </div>
          </div>

          {/* Optional video */}
          {post.video && (
            <div className="container mt-10 max-w-3xl">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${post.video.id}`}
                  title={post.video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="container mt-10 max-w-3xl">
            {post.sections.map((s) => (
              <section key={s.heading} className="mb-9">
                <h2 className="font-display text-xl uppercase tracking-tight text-gold-100 sm:text-2xl">
                  {s.heading}
                </h2>
                {s.body.map((para, i) => (
                  <p
                    key={i}
                    className="mt-4 text-pretty leading-[1.75] text-foreground/75"
                  >
                    {para}
                  </p>
                ))}
                {s.link && (
                  <a
                    href={s.link.href}
                    {...(s.link.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="link-underline mt-4 inline-flex items-center gap-1.5 font-semibold text-gold-200"
                  >
                    {s.link.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                )}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-foreground/75">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-400"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <SectionDivider className="container max-w-3xl" />

          {/* FAQs — mirrors the FAQPage schema above */}
          <section className="container mt-10 max-w-3xl">
            <h2 className="font-display text-xl uppercase tracking-tight sm:text-2xl">
              Frequently asked
            </h2>
            <div className="mt-5 space-y-3">
              {post.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl glass p-5 [&[open]]:border-gold-400/25"
                >
                  <summary className="cursor-pointer list-none font-semibold text-foreground/90 marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 leading-relaxed text-foreground/70">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="container mt-14 max-w-3xl">
            <div className="rounded-3xl glass-gold p-8 text-center">
              <h2 className="font-display text-2xl uppercase">
                Work with {SEO.founder}
              </h2>
              <p className="mx-auto mt-3 max-w-[52ch] text-pretty text-foreground/70">
                Athlete mindset coaching, martial arts and sports psychology in{" "}
                {SEO.address.locality} — and online across India.
              </p>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <a
                    href={whatsappLink(
                      `Hi Kishore, I read your article "${post.title}" and I'd like to know more.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    Talk on WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/programs">
                    See programs
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Related — internal linking, which is what makes a blog rank as a set */}
          <section className="container mb-20 mt-14 max-w-6xl">
            <h2 className="font-display text-xl uppercase tracking-tight">
              Keep reading
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="glow-card group flex h-full flex-col rounded-2xl glass p-5 transition-colors hover:border-gold-400/25"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                    {r.category}
                  </span>
                  <h3 className="mt-2 text-balance font-display text-base uppercase leading-tight">
                    {r.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold-200">
                    Read
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
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
          </section>
        </article>
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
