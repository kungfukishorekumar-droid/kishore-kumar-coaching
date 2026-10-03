import { shareImages } from "@/lib/og-cards";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle, Sparkles, Target } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { LeadCta } from "@/components/shared/lead-gate";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { RailMeta, RailScope } from "@/components/ui/rail";
import { ProgramCard } from "@/components/programs/program-card";
import { PROGRAMS, getProgram, SITE } from "@/lib/site";
import { SEO } from "@/lib/seo";
import { authorRef, publisherRef } from "@/lib/schema";
import { jsonLdString } from "@/lib/utils";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

/**
 * Next 15 made route `params` a Promise, so it must be awaited. Reading
 * `params.slug` synchronously (correct under Next 14, which this file was
 * written for) yielded undefined, so every program page fell through to
 * notFound() — all six 404'd while still being listed in the sitemap.
 */
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgram(slug);
  if (!p) return {};
  const url = `${SEO.siteUrl}/programs/${p.slug}/`;
  return {
    title: `${p.name} in Chennai`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      images: shareImages(`programs/${p.slug}`).og,
      type: "website",
      locale: "en_IN",
      title: `${p.name} | Kishore Kumar — Chennai`,
      description: p.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      images: shareImages(`programs/${p.slug}`).twitter,
    },
  };
}

export default async function ProgramPage({ params }: Params) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const related = PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 3);

  // A `wa` CTA is no longer a link — it opens the lead gate — so this is only
  // the destination for the scroll-type CTA that remains.
  const primaryHref = "/#lead";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: program.name,
        description: program.description,
        serviceType: "Athlete mindset & martial arts coaching",
        provider: publisherRef(),
        areaServed: SEO.areasServed.map((a) => ({ "@type": "City", name: a })),
        url: `${SEO.siteUrl}/programs/${program.slug}/`,
      },
      // Course sits alongside Service deliberately: Service describes the
      // coaching offer, Course is what education-intent searches and AI answer
      // engines look for ("courses for athlete confidence in Chennai").
      // hasCourseInstance is required for Course rich results to validate.
      {
        "@type": "Course",
        "@id": `${SEO.siteUrl}/programs/${program.slug}/#course`,
        name: program.name,
        description: program.description,
        url: `${SEO.siteUrl}/programs/${program.slug}/`,
        provider: publisherRef(),
        educationalLevel: "Beginner to advanced",
        teaches: program.focus,
        inLanguage: "en-IN",
        about: { "@type": "Thing", name: "Sports psychology and martial arts" },
        audience: { "@type": "EducationalAudience", educationalRole: program.forWho },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Blended",
          courseWorkload: program.badge,
          location: {
            "@type": "Place",
            name: SEO.brand,
            address: {
              "@type": "PostalAddress",
              addressLocality: SEO.address.locality,
              addressRegion: SEO.address.region,
              addressCountry: SEO.address.country,
            },
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Programs", item: `${SEO.siteUrl}/programs/` },
          { "@type": "ListItem", position: 3, name: program.name, item: `${SEO.siteUrl}/programs/${program.slug}/` },
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
      <Navbar />

      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <FloatingShapes
            shapes={[
              { className: "left-[6%] top-[18%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[12%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />

          <div className="container relative max-w-6xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Programs", href: "/programs/" },
                { label: program.name },
              ]}
            />

            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
            <span
              className="anim-rise inline-flex rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-gold-200"
              style={{ "--d": "20ms" } as React.CSSProperties}
            >
              {program.badge}
            </span>

            <h1
              className="anim-rise anim-solid mt-4 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl"
              style={{ "--d": "60ms" } as React.CSSProperties}
            >
              {program.name}
            </h1>
            <p
              className="anim-rise mt-3 text-sm font-semibold uppercase tracking-wide text-gold-300"
              style={{ "--d": "120ms" } as React.CSSProperties}
            >
              For {program.forWho}
            </p>

            <p
              className="anim-rise anim-solid mt-5 max-w-2xl text-pretty text-foreground/75"
              style={{ "--d": "160ms" } as React.CSSProperties}
            >
              {program.description}
            </p>

            <div
              className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ "--d": "220ms" } as React.CSSProperties}
            >
              {program.cta.type === "wa" ? (
                <LeadCta
                  size="lg"
                  intent={program.cta.message.replace(/^Hi Kishore,\s*/i, "")}
                  campaign={`program-page-${program.slug}`}
                  title={program.name}
                >
                  {program.cta.label}
                  <ArrowRight className="size-4" />
                </LeadCta>
              ) : (
                <Button asChild size="lg">
                  <a href={primaryHref}>
                    {program.cta.label}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
              <LeadCta
                size="lg"
                variant="outline"
                intent={`I'd like to know more about the ${program.name}.`}
                campaign={`program-page-ask-${program.slug}`}
                title={program.name}
              >
                <MessageCircle className="size-4" />
                Ask on WhatsApp
              </LeadCta>
            </div>
            </div>

            {/* At a glance — fills the empty right half on wide screens.
                Every line is a fact the page already states. */}
            <div
              className="anim-scale relative mx-auto w-full max-w-md"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              <GlowRing className="left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2" />
              <div className="shine-border relative overflow-hidden rounded-[2rem] glass-gold p-7 shadow-glow-lg sm:p-8">
                {program.featured && <span aria-hidden="true" className="beam-ring" />}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[9rem] leading-none text-white/[0.04]"
                >
                  心
                </span>
                <p className="eyebrow">
                  <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
                  At a glance
                </p>
                <p className="mt-4 font-display text-4xl font-bold uppercase leading-none text-gradient-gold sm:text-5xl">
                  {program.badge}
                </p>
                <dl className="relative mt-6 divide-y divide-white/10 text-sm">
                  <div className="flex gap-4 py-3">
                    <dt className="w-16 shrink-0 text-foreground/45">For</dt>
                    <dd className="text-foreground/85">{program.forWho}</dd>
                  </div>
                  <div className="flex gap-4 py-3">
                    <dt className="w-16 shrink-0 text-foreground/45">Focus</dt>
                    <dd className="text-foreground/85">{program.focus}</dd>
                  </div>
                  <div className="flex gap-4 py-3">
                    <dt className="w-16 shrink-0 text-foreground/45">Coach</dt>
                    <dd className="text-foreground/85">
                      <Link href="/about/" className="text-gold-200 underline-offset-4 hover:underline">
                        {SEO.founder}
                      </Link>{" "}
                      — National Wushu Medalist &amp; sports psychologist
                    </dd>
                  </div>
                  <div className="flex gap-4 py-3">
                    <dt className="w-16 shrink-0 text-foreground/45">Method</dt>
                    <dd className="text-foreground/85">Warrior Mind Method™</dd>
                  </div>
                </dl>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="relative py-12">
          <div className="container max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2">
              <Reveal className="rounded-3xl glass p-7">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
                  <Sparkles className="size-5 text-gold-300" />
                  What's included
                </h2>
                {/* Numbered steps, each entering in turn */}
                <RevealGroup as="ul" className="mt-5 space-y-3" stagger={0.08}>
                  {program.features.map((f, i) => (
                    <Reveal key={f} as="li" variant="rise" className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-gradient font-display text-sm font-bold text-ink shadow-key-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-foreground/85">{f}</span>
                    </Reveal>
                  ))}
                </RevealGroup>
              </Reveal>

              <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl glass-gold p-7">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
                  <Target className="size-5 text-gold-300" />
                  Focus
                </h2>
                <p className="mt-4 text-foreground/80">{program.focus}</p>
                <p className="mt-4 text-sm text-foreground/55">
                  Part of Kishore Kumar's Warrior Mind Method™ — Sports Psychology +
                  Martial Arts coaching in {SITE.location}.
                </p>
                <Link
                  href="/blog/warrior-mind-method-five-pillars/"
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold-200 underline-offset-4 hover:underline"
                >
                  How the method works
                  <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="relative py-12">
          <div className="container max-w-6xl">
            <Reveal variant="pop" className="relative overflow-hidden rounded-[2rem] border border-gold-400/20 p-8 text-center sm:p-12">
              <span aria-hidden="true" className="beam-ring" />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800/70 via-ink to-ink" />
              <GlowRing className="left-1/2 top-1/2 size-[460px] max-w-[120%] -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">
                  Ready to start{" "}
                  <span className="text-gradient-gold">{program.name}?</span>
                </h2>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <LeadCta
                    size="lg"
                    intent={`I'd like to start the ${program.name}.`}
                    campaign={`program-page-book-${program.slug}`}
                    title={`Start ${program.name}`}
                  >
                    <MessageCircle className="size-4" />
                    Book on WhatsApp
                  </LeadCta>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/#lead">Get the free checklist</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Related programs */}
        <section className="relative py-12">
          <div className="container max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">More programs</h2>
              <Link href="/programs/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold-200 hover:underline">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <RailScope>
              <RevealGroup className="rail grid gap-5 md:grid-cols-3" stagger={0.06}>
                {related.map((p) => (
                  <Reveal key={p.slug} className="h-full">
                    <ProgramCard program={p} variant="compact" headingLevel="h3" />
                  </Reveal>
                ))}
              </RevealGroup>
              <RailMeta label="Swipe programs" />
            </RailScope>

            <div className="mt-10">
              <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200">
                <ArrowLeft className="size-4" />
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
