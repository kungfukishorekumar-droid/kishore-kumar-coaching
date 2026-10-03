
import { shareImages } from "@/lib/og-cards";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { KineticBand } from "@/components/ui/kinetic-band";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { ProgramCard } from "@/components/programs/program-card";
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
    images: shareImages("programs").og,
    type: "website",
    locale: "en_IN",
    title: "Programs | Kishore Kumar — Sports Psychology & Martial Arts, Chennai",
    description:
      "Sports psychology + martial arts programs for athletes, students, parents, schools and academies in Chennai.",
    url,
  },
  twitter: {
    card: "summary_large_image",
    images: shareImages("programs").twitter,
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

      <main id="main">
        <section className="relative overflow-hidden pb-12 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <FloatingShapes
            shapes={[
              { className: "left-[6%] top-[20%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[14%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />
          <div className="container relative max-w-4xl text-center">
            <Breadcrumbs align="center" items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
            <h1
              className="anim-rise anim-solid mt-5 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-6xl"
              style={{ "--d": "60ms" } as React.CSSProperties}
            >
              Athlete Mindset &amp; Martial Arts
              <br />
              <span className="text-gradient-gold-sheen">Programs in Chennai</span>
            </h1>
            <p
              className="anim-rise mx-auto mt-4 max-w-2xl text-pretty text-foreground/70"
              style={{ "--d": "140ms" } as React.CSSProperties}
            >
              From a single workshop to a full transformation — sports psychology +
              martial arts coaching for athletes, students, parents, schools and
              academies.
            </p>
          </div>
        </section>

        <section className="relative pb-20">
          <div className="container max-w-6xl">
            <RevealGroup className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3" stagger={0.06}>
              {PROGRAMS.map((p) => (
                <Reveal key={p.slug} className="h-full">
                  <ProgramCard program={p} />
                </Reveal>
              ))}
            </RevealGroup>

            <div className="mt-10">
              <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-gold-200">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <KineticBand
          top={["90 minutes", "3 days", "7 days", "21 days", "1-on-1"]}
          bottom={["Train the mind", "Like the body", "心技体"]}
        />
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
