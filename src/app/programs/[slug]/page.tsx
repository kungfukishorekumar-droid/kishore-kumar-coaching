import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles, Target } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { PROGRAMS, getProgram, whatsappLink, SITE } from "@/lib/site";
import { SEO } from "@/lib/seo";
import { jsonLdString } from "@/lib/utils";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProgram(params.slug);
  if (!p) return {};
  const url = `${SEO.siteUrl}/programs/${p.slug}`;
  return {
    title: `${p.name} in Chennai`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      title: `${p.name} | Kishore Kumar — Chennai`,
      description: p.description,
      url,
      images: [{ url: "/images/strong-mind.jpg", width: 1200, height: 630 }],
    },
  };
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  const program = getProgram(params.slug);
  if (!program) notFound();

  const related = PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 3);

  const primaryHref =
    program.cta.type === "wa" ? whatsappLink(program.cta.message) : "/#lead";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: program.name,
        description: program.description,
        serviceType: "Athlete mindset & martial arts coaching",
        provider: { "@id": `${SEO.siteUrl}/#organization` },
        areaServed: SEO.areasServed.map((a) => ({ "@type": "City", name: a })),
        url: `${SEO.siteUrl}/programs/${program.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Programs", item: `${SEO.siteUrl}/programs` },
          { "@type": "ListItem", position: 3, name: program.name, item: `${SEO.siteUrl}/programs/${program.slug}` },
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

      <main>
        <section className="relative overflow-hidden pb-16 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <FloatingShapes
            shapes={[
              { className: "left-[6%] top-[18%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[12%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />

          <div className="container relative max-w-4xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-foreground/50">
              <Link href="/" className="transition-colors hover:text-gold-200">Home</Link>
              <span>/</span>
              <Link href="/programs" className="transition-colors hover:text-gold-200">Programs</Link>
              <span>/</span>
              <span className="text-foreground/80">{program.name}</span>
            </nav>

            <span className="mt-6 inline-flex rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-gold-200">
              {program.badge}
            </span>

            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-5xl">
              {program.name}
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gold-300">
              For {program.forWho}
            </p>

            <p className="mt-5 max-w-2xl text-pretty text-foreground/75">
              {program.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={primaryHref} target={program.cta.type === "wa" ? "_blank" : undefined} rel="noreferrer">
                  {program.cta.label}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink(`Hi Kishore, I'd like to know more about the ${program.name}.`)} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="relative py-12">
          <div className="container max-w-4xl">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl glass p-7">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
                  <Sparkles className="size-5 text-gold-300" />
                  What's included
                </h2>
                <ul className="mt-5 space-y-3">
                  {program.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                        <Check className="size-3" />
                      </span>
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl glass-gold p-7">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
                  <Target className="size-5 text-gold-300" />
                  Focus
                </h2>
                <p className="mt-4 text-foreground/80">{program.focus}</p>
                <p className="mt-4 text-sm text-foreground/55">
                  Part of Kishore Kumar's Warrior Mind Method™ — Sports Psychology +
                  Martial Arts coaching in {SITE.location}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="relative py-12">
          <div className="container max-w-4xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-gold-400/20 p-8 text-center sm:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800/70 via-ink to-ink" />
              <GlowRing className="left-1/2 top-1/2 size-[460px] max-w-[120%] -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">
                  Ready to start{" "}
                  <span className="text-gradient-gold">{program.name}?</span>
                </h2>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <a href={whatsappLink(`Hi Kishore, I'd like to start the ${program.name}.`)} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4" />
                      Book on WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/#lead">Get the free checklist</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related programs */}
        <section className="relative py-12">
          <div className="container max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">More programs</h2>
              <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 hover:underline">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programs/${p.slug}`}
                  className="group flex h-full flex-col rounded-3xl glass p-6 transition-colors hover:border-gold-400/25"
                >
                  <span className="inline-flex w-fit rounded-full border border-gold-400/30 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-200">
                    {p.badge}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold">{p.name}</h3>
                  <p className="mt-2 grow text-sm text-foreground/60">{p.focus}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200">
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
