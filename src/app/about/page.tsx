import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MessageCircle,
  Youtube,
  ExternalLink,
  Bot,
  Medal,
  Flame,
  Scale,
} from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { LeadCta } from "@/components/shared/lead-gate";
import { Reveal, RevealGroup } from "@/components/ui/reveal";
import { FloatingShapes, GlowRing } from "@/components/ui/floating-shapes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { AuthorityBadge } from "@/components/ui/authority-badge";
import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { Counter } from "@/components/ui/counter";
import { KineticBand } from "@/components/ui/kinetic-band";
import { RailMeta, RailScope } from "@/components/ui/rail";
import { CREDENTIALS, METHOD, METHOD_KANJI, SITE, STATS } from "@/lib/site";
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
        <section className="relative overflow-hidden pb-16 pt-24 md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="pointer-events-none absolute inset-0 spotlight opacity-60" />
          <FloatingShapes
            shapes={[
              { className: "left-[5%] top-[16%]", size: 200, tint: "gold", duration: 12 },
              { className: "right-[8%] top-[10%]", size: 170, tint: "electric", duration: 14, delay: 1 },
            ]}
          />
          <div className="container relative">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

            <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="order-2 lg:order-1">
                <span className="eyebrow anim-rise" style={{ "--d": "40ms" } as React.CSSProperties}>
                  <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
                  About
                </span>
                <h1
                  className="anim-rise anim-solid mt-4 font-display text-5xl font-bold uppercase leading-[0.98] tracking-tight sm:text-7xl"
                  style={{ "--d": "80ms" } as React.CSSProperties}
                >
                  Kishore <span className="text-gradient-gold-sheen">Kumar</span>
                </h1>
                <p
                  className="anim-rise mt-4 text-sm font-semibold uppercase tracking-wide text-gold-300"
                  style={{ "--d": "140ms" } as React.CSSProperties}
                >
                  Sports Psychologist · National Wushu Medalist · Martial Arts Coach
                </p>
                {/* The liftable answer — what an answer engine should quote. */}
                <p
                  id="who"
                  className="anim-rise anim-solid mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/80"
                  style={{ "--d": "180ms" } as React.CSSProperties}
                >
                  {DESCRIPTION} He works with athletes, students, martial artists and parents in Chennai,
                  combining sports psychology with martial arts training to build focus, discipline,
                  confidence and composure under pressure.
                </p>
                <Link
                  href={STORY}
                  className="anim-rise mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold-200 underline-offset-4 hover:underline"
                  style={{ "--d": "220ms" } as React.CSSProperties}
                >
                  Read his full story
                  <ArrowRight className="size-4" />
                </Link>
                <div
                  className="anim-rise mt-6 flex flex-col gap-3 sm:flex-row"
                  style={{ "--d": "260ms" } as React.CSSProperties}
                >
                  <LeadCta size="lg" intent="I'd like to book a free call." campaign="about-book-call">
                    <MessageCircle className="size-4" />
                    Book a free call
                  </LeadCta>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/blog/warrior-mind-method-five-pillars/">
                      The Warrior Mind Method
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Portrait — first on phones, with credential tags floating
                  off its edges on wide screens */}
              <div
                className="anim-scale anim-solid relative order-1 mx-auto w-full max-w-xs sm:max-w-sm lg:order-2 lg:max-w-md"
                style={{ "--d": "60ms" } as React.CSSProperties}
              >
                <GlowRing className="left-1/2 top-1/2 size-[116%] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute left-1/2 top-1/2 -z-10 size-[105%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
                <div className="shine-border relative overflow-hidden rounded-[2rem] border border-white/10 shadow-glow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portrait.src}
                    srcSet={portrait.srcSet}
                    sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 320px"
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    className="aspect-[4/5] w-full object-cover object-top"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
                </div>
                {[
                  { title: "National Wushu Medalist", icon: Medal, pos: "absolute -left-4 top-[12%] xl:-left-12", tint: "gold" },
                  { title: "Kung Fu Black Belt", icon: Flame, pos: "absolute -right-4 top-[40%] xl:-right-10", tint: "electric" },
                  { title: "State-level Wushu Judge", icon: Scale, pos: "absolute -left-4 bottom-[14%] xl:-left-10", tint: "gold" },
                ].map((b, i) => (
                  <AuthorityBadge
                    key={b.title}
                    title={b.title}
                    icon={b.icon}
                    tint={b.tint as "gold" | "electric"}
                    position={b.pos}
                    delay={0.5 + i * 0.12}
                    className="hidden lg:block"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience in numbers — the same figures as the homepage strip */}
        <Section spacing="sm" width="wide" className="pb-0 sm:pb-0">
          <RevealGroup as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-4" stagger={0.06}>
            {STATS.map((st) => (
              <Reveal key={st.label} as="li" variant="pop" className="h-full">
                <div className="glass flex h-full flex-col items-center rounded-2xl px-4 py-6 text-center">
                  <span className="font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
                    <Counter to={st.value} suffix={st.suffix} />
                  </span>
                  <span className="mt-1.5 text-xs text-foreground/60 sm:text-sm">{st.label}</span>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Section>

        {/* Credentials */}
        <Section spacing="sm" width="wide">
          <SectionHeading align="left" eyebrow="On record" title="Credentials" className="mb-8 sm:mb-10" />
          <RevealGroup as="ul" className="grid grid-cols-2 gap-3 lg:grid-cols-4" stagger={0.05}>
            {CREDENTIALS.map((c) => (
              <Reveal key={c.label} as="li" variant="pop" className="h-full">
                <div className="hover-lift glow-card flex h-full items-center gap-3 rounded-2xl glass p-4 sm:p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink shadow-key-gold sm:size-11">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-foreground/90">{c.label}</span>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Section>

        {/* Method */}
        <Section spacing="sm" width="wide">
          <SectionHeading
            align="left"
            eyebrow="The framework"
            title={
              <>
                The <span className="text-gradient-gold">Warrior Mind Method™</span>
              </>
            }
            lead="The framework behind his coaching: five pillars, each a separate mental skill that can be trained."
            className="mb-8 sm:mb-10"
          />
          <RailScope>
            <RevealGroup as="ul" className="rail grid gap-3 md:grid-cols-5" stagger={0.06}>
              {METHOD.map((m, i) => (
                <Reveal key={m.tag} as="li" className="h-full">
                  <TiltCard className="h-full" max={8} radiusClassName="rounded-2xl">
                    <div className="glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-5">
                      <span
                        aria-hidden="true"
                        className="ink-in pointer-events-none absolute -right-1 -top-2 origin-top-right font-display text-6xl text-white/[0.05] transition-colors group-hover:text-gold-400/15"
                      >
                        {METHOD_KANJI[m.tag]}
                      </span>
                      <span className="font-display text-sm tabular-nums text-gold-300">{`0${i + 1}`}</span>
                      <h3 className="mt-3 font-display text-2xl font-bold uppercase text-gold-200">{m.tag}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{m.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </RevealGroup>
            <RailMeta label="Swipe the pillars" />
          </RailScope>
        </Section>

        <KineticBand
          top={["Focus", "Fire", "Flow", "Forge", "Fight"]}
          bottom={["Mind · Skill · Body", "心技体", "Chennai"]}
        />

        {/* Elsewhere */}
        <Section spacing="sm" width="wide">
          <SectionHeading align="left" eyebrow="Elsewhere" title="Find Kishore Kumar online" className="mb-8 sm:mb-10" />
          <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.05}>
            {[
              { href: SEO.youtube.url, label: "YouTube", sub: "Sports psychology shorts", Icon: Youtube },
              { href: SITE.socials.instagram, label: "Instagram", sub: "@kishorekumar.coach", Icon: Instagram },
              { href: SEO.academy.url, label: SEO.academy.name, sub: "Classes in Chennai", Icon: ExternalLink },
              { href: SITE.customGpt, label: "Athlete Mindset GPT", sub: "AI coach on his method", Icon: Bot },
            ].map(({ href, label, sub, Icon: LinkIcon }) => (
              <Reveal key={href} as="li" variant="rise">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer me"
                  className="glow-card group flex min-h-16 items-center gap-4 rounded-2xl glass px-5 py-3 transition-colors hover:border-gold-400/30"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-gold-300 ring-1 ring-white/10 transition-colors group-hover:bg-gold-400/15">
                    <LinkIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground/90 group-hover:text-gold-100">{label}</span>
                    <span className="block text-xs text-foreground/50">{sub}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 shrink-0 text-foreground/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-200" />
                </a>
              </Reveal>
            ))}
          </RevealGroup>
        </Section>

        {/* FAQ — visible, and the same pairs as the FAQPage structured data */}
        <Section id="faq" spacing="sm" width="narrow">
          <SectionHeading align="left" eyebrow="Answers" title="Questions about Kishore Kumar" className="mb-8 sm:mb-10" />
          <RevealGroup className="space-y-3" stagger={0.05}>
            {FAQ.map((f) => (
              <Reveal key={f.q} variant="rise">
                <details className="faq-item rounded-2xl glass">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center px-5 py-3 font-semibold text-foreground marker:hidden">
                    <h3 className="text-base">{f.q}</h3>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-foreground/70">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </RevealGroup>
        </Section>
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
