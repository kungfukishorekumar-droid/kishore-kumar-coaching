
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { PROGRAMS } from "@/lib/site";
import { SEO } from "@/lib/seo";
import { jsonLdString } from "@/lib/utils";

const url = `${SEO.siteUrl}/programs/`;

export const metadata: Metadata = {
  title: "Athlete Mindset & Martial Arts Programs in Chennai",
  description:
    "Explore Kishore Kumar's sports psychology + martial arts programs in Chennai — 1-day and 3-day workshops, a 7-day challenge, a 21-day transformation, personal coaching, and school & academy workshops.",
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Programs | Kishore Kumar — Sports Psychology & Martial Arts, Chennai",
    description:
      "Sports psychology + martial arts programs for athletes, students, parents, schools and academies in Chennai.",
    url,
    images: [{ url: "/images/strong-mind.webp", width: 1200, height: 630 }],
  },
};

export default function ProgramsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
          { "@type": "ListItem", position: 2, name: "Programs", item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: "Athlete Mindset & Martial Arts Programs in Chennai",
        itemListElement: PROGRAMS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SEO.siteUrl}/programs/${p.slug}/`,
        })),
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
        <section className="relative overflow-hidden pb-12 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <FloatingShapes
            shapes={[
              { className: "left-[6%] top-[20%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[14%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />
          <div className="container relative max-w-4xl text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center gap-1.5 text-xs text-foreground/50">
              <Link href="/" className="transition-colors hover:text-gold-200">Home</Link>
              <span>/</span>
              <span className="text-foreground/80">Programs</span>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-5xl">
              Athlete Mindset &amp; Martial Arts
              <br />
              <span className="text-gradient-gold">Programs in Chennai</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-foreground/70">
              From a single workshop to a full transformation — sports psychology +
              martial arts coaching for athletes, students, parents, schools and
              academies.
            </p>
          </div>
        </section>

        <section className="relative pb-20">
          <div className="container max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programs/${p.slug}/`}
                  className="group flex h-full flex-col rounded-3xl glass p-7 transition-colors hover:border-gold-400/25"
                >
                  <span className="inline-flex w-fit rounded-full border border-gold-400/30 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-gold-200">
                    {p.badge}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-bold">{p.name}</h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-foreground/45">
                    {p.forWho}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {p.description}
                  </p>
                  <ul className="mt-4 grow space-y-2">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                          <Check className="size-3" />
                        </span>
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200">
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
