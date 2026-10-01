import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Instagram, MessageCircle, Youtube, ExternalLink, Bot } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { LeadCta } from "@/components/shared/lead-gate";
import { Reveal } from "@/components/ui/reveal";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { CREDENTIALS, METHOD, SITE } from "@/lib/site";
import { SEO } from "@/lib/seo";
import { PHOTOS, imageObject } from "@/lib/media";
import { shareImages } from "@/lib/og-cards";
import { jsonLdString } from "@/lib/utils";

/**
 * /about/ — the entity home for Kishore Kumar.
 *
 * Search engines and AI answer engines build a picture of a person from the
 * page that is ABOUT them. The homepage is about the coaching offer; this page
 * is about the man, and the Person entity's `url` and `mainEntityOfPage` point
 * here. It answers "who is Kishore Kumar?" in one liftable paragraph at the
 * top, then in question-and-answer form.
 *
 * Every claim on this page is one the site already makes elsewhere. Nothing
 * here is new or unverified — no counts, no dates, no qualifications that are
 * not already stated. Answer engines quote entity pages as fact, so this page
 * must not get ahead of what is true.
 */

const URL = `${SEO.siteUrl}/about/`;
const DESCRIPTION =
  "Kishore Kumar is a Chennai-based sports psychologist, National Wushu Medalist and martial arts coach, the founder of Spartacus Martial Arts Chennai and the creator of the Warrior Mind Method™ for athletes.";

/** The long-form story. This page is the profile; that post is the narrative. */
const STORY = "/blog/who-is-kishore-kumar-sports-psychologist-chennai/";

export const metadata: Metadata = {
  title: "About Kishore Kumar — Sports Psychologist & Martial Arts Coach, Chennai",
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    images: shareImages("about").og,
    type: "profile",
    locale: "en_IN",
    title: "About Kishore Kumar — Sports Psychologist & Martial Arts Coach",
    description: DESCRIPTION,
    url: URL,
    firstName: "Kishore",
    lastName: "Kumar",
  },
  twitter: {
    card: "summary_large_image",
    images: shareImages("about").twitter,
  },
};

/**
 * Credentials shown on this page: the site-wide list plus the two the academy
 * site (spartacusmartialarts.com) also states — Kung Fu black belt and
 * state-level Wushu judge — so both of Kishore's sites describe him the same
 * way. Search and answer engines weigh facts that agree across sources.
 */
const ABOUT_CREDENTIALS = [
  ...CREDENTIALS.slice(0, 1), // National Wushu Medalist
  { icon: "Award", label: "Kung Fu Black Belt" },
  ...CREDENTIALS.slice(1).map((c) =>
    c.label === "Wushu Judge" ? { ...c, label: "State-level Wushu Judge" } : c
  ),
];

const FAQ = [
  {
    q: "Who is Kishore Kumar?",
    a: "Kishore Kumar is a sports psychologist, National Wushu Medalist, Kung Fu black belt, state-level Wushu judge and martial arts coach based in Chennai, India. He combines sports psychology with martial arts training to help athletes, students and martial artists build focus, discipline, confidence, emotional control and pressure handling.",
  },
  {
    q: "What is the Warrior Mind Method?",
    a: "The Warrior Mind Method™ is Kishore Kumar's framework for athlete mental training. It has five pillars: Focus (attention and distraction control), Fire (motivation and confidence), Flow (calm execution under pressure), Forge (discipline and habits) and Fight (pressure handling and the comeback mindset).",
  },
  {
    q: "Where does Kishore Kumar coach?",
    a: `He coaches in Chennai, Tamil Nadu — including ${SEO.areasServed.filter((a) => a !== "Chennai").join(", ")} — through Spartacus Martial Arts, and runs sports psychology workshops for schools and academies.`,
  },
  {
    q: "Who does Kishore Kumar work with?",
    a: "Athletes and students across sports, martial artists, parents of young athletes, coaches, and schools and academies that want mental skills training for their students.",
  },
  {
    q: "How do I book a session with Kishore Kumar?",
    a: "Use the booking form on this site — it collects a few details and then opens WhatsApp so you can talk to him directly.",
  },
];

export default function AboutPage() {
  const portrait = PHOTOS.portrait;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Google's profile-page format: the page is about one Person.
        "@type": "ProfilePage",
        "@id": `${URL}#profilepage`,
        url: URL,
        name: "About Kishore Kumar",
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SEO.siteUrl}/#website` },
        primaryImageOfPage: { "@id": `${URL}#portrait` },
        breadcrumb: { "@id": `${URL}#breadcrumb` },
        dateModified: "2026-10-02",
        mainEntity: {
          "@type": "Person",
          "@id": `${SEO.siteUrl}/#kishore`,
          name: SEO.founder,
          givenName: "Kishore",
          familyName: "Kumar",
          description: DESCRIPTION,
          jobTitle: SEO.role,
          url: URL,
          image: { "@id": `${URL}#portrait` },
          sameAs: SEO.sameAs,
          knowsAbout: [
            "Sports psychology",
            "Athlete mental training",
            "Wushu",
            "Kung Fu",
            "Martial arts",
            "Competition anxiety",
            "Focus training",
            "Warrior Mind Method",
          ],
          hasOccupation: [
            { "@type": "Occupation", name: "Sports Psychologist", occupationLocation: { "@type": "City", name: "Chennai" } },
            { "@type": "Occupation", name: "Martial Arts Coach", occupationLocation: { "@type": "City", name: "Chennai" } },
            { "@type": "Occupation", name: "State-level Wushu Judge" },
          ],
          award: ["National Wushu Medalist"],
          // Same credential set, in the same form, as the academy site's Person.
          hasCredential: [
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Award", name: "Wushu National Medalist" },
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Rank", name: "Kung Fu Black Belt" },
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Certification", name: "Wushu Coach" },
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Certification", name: "State-level Wushu Judge" },
          ],
          worksFor: {
            "@type": "Organization",
            "@id": `${SEO.siteUrl}/#organization`,
            name: SEO.brand,
            url: `${SEO.siteUrl}/`,
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: SEO.address.locality,
            addressRegion: SEO.address.region,
            addressCountry: SEO.address.country,
          },
          knowsLanguage: ["en"],
        },
      },
      { ...imageObject(portrait, `${URL}#portrait`), representativeOfPage: true },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SEO.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "About Kishore Kumar", item: URL },
        ],
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Navbar />

      <main id="main">
        {/* Header */}
        <section className="relative overflow-hidden pb-14 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <FloatingShapes
            shapes={[
              { className: "left-[5%] top-[16%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[10%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />
          <div className="container relative">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-foreground/50">
              <Link href="/" className="transition-colors hover:text-gold-200">Home</Link>
              <span>/</span>
              <span className="text-foreground/80">About</span>
            </nav>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="eyebrow">
                  <span className="h-px w-6 bg-gold-400" />
                  About
                </span>
                <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
                  Kishore Kumar
                </h1>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold-300">
                  Sports Psychologist · National Wushu Medalist · Martial Arts Coach
                </p>
                {/* The liftable answer — what an answer engine should quote. */}
                <p id="who" className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/80">
                  {DESCRIPTION} He works with athletes, students, martial artists and parents in Chennai,
                  combining sports psychology with martial arts training to build focus, discipline,
                  confidence and composure under pressure.
                </p>
                <Link
                  href={STORY}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 underline-offset-4 hover:underline"
                >
                  Read his full story
                  <ArrowRight className="size-4" />
                </Link>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <LeadCta size="lg" intent="I'd like to book a free call." campaign="about-book-call">
                    <MessageCircle className="size-4" />
                    Book a free call
                  </LeadCta>
                  <Link
                    href="/blog/warrior-mind-method-five-pillars/"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-8 font-semibold text-gold-100 transition-colors hover:border-gold-400/70"
                  >
                    The Warrior Mind Method
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 shadow-glow-lg lg:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portrait.src}
                  srcSet={portrait.srcSet}
                  sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, calc(100vw - 32px)"
                  alt={portrait.alt}
                  width={portrait.width}
                  height={portrait.height}
                  className="aspect-[4/5] w-full object-cover object-top"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="relative py-12">
          <div className="container max-w-5xl">
            <Reveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Credentials
              </h2>
            </Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ABOUT_CREDENTIALS.map((c) => (
                <li key={c.label} className="flex items-center gap-3 rounded-2xl glass px-4 py-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground/85">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Method */}
        <section className="relative py-12">
          <div className="container max-w-5xl">
            <Reveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                The <span className="text-gradient-gold">Warrior Mind Method™</span>
              </h2>
              <p className="mt-3 max-w-2xl text-foreground/70">
                The framework behind his coaching: five pillars, each a separate mental skill that
                can be trained.
              </p>
            </Reveal>
            <dl className="mt-6 grid gap-3 md:grid-cols-5">
              {METHOD.map((m) => (
                <div key={m.tag} className="rounded-2xl glass p-4">
                  <dt className="font-display text-xl font-bold uppercase text-gold-200">{m.tag}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-foreground/70">{m.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Elsewhere */}
        <section className="relative py-12">
          <div className="container max-w-5xl">
            <Reveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Find Kishore Kumar online
              </h2>
            </Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { href: SEO.youtube.url, label: "YouTube — sports psychology shorts", Icon: Youtube },
                { href: SITE.socials.instagram, label: "Instagram — @kishorekumar.coach", Icon: Instagram },
                { href: SEO.academy.url, label: `${SEO.academy.name}`, Icon: ExternalLink },
                { href: SITE.customGpt, label: "Athlete Mindset GPT", Icon: Bot },
              ].map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer me"
                    className="flex items-center gap-3 rounded-2xl glass px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:border-gold-400/30 hover:text-gold-100"
                  >
                    <Icon className="size-4 text-gold-300" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ — visible, and the same pairs as the FAQPage structured data */}
        <section id="faq" className="relative py-12">
          <div className="container max-w-3xl">
            <Reveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Questions about Kishore Kumar
              </h2>
            </Reveal>
            <div className="mt-6 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-2xl glass p-5 open:border-gold-400/25">
                  <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
                    <h3 className="inline text-base">{f.q}</h3>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.a}</p>
                </details>
              ))}
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
