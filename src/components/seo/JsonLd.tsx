import { SEO } from "@/lib/seo";
import { FAQS, WORKSHOP } from "@/lib/site";
import { jsonLdString } from "@/lib/utils";

/**
 * Structured-data (JSON-LD) @graph for the home page.
 *
 * Schema types emitted:
 *  • WebSite             — site-level entity + sitelinks search box
 *  • WebPage             — page entity with SpeakableSpecification (AEO)
 *  • Organization        — brand entity
 *  • LocalBusiness       — Spartacus Martial Arts (SportsActivityLocation)
 *  • Person              — Kishore Kumar with credentials
 *  • Service × 5         — individual coaching services
 *  • DefinedTerm         — Warrior Mind Method™ (entity for AEO)
 *  • HowTo               — "How sports psychology helps athletes" (AEO)
 *  • Event               — next Warrior Mind Workshop
 *  • FAQPage             — all 15 FAQs (AEO)
 *  • BreadcrumbList      — home breadcrumb
 *
 * NOTE: No Review / AggregateRating — add ONLY when real, approved data exists.
 */
export function JsonLd() {
  // ── Organisation / LocalBusiness ─────────────────────────────────────────
  const org = {
    "@type": ["Organization", "LocalBusiness", "SportsActivityLocation"],
    "@id": `${SEO.siteUrl}/#organization`,
    name: SEO.brand,
    alternateName: [
      "Kishore Kumar Sports Psychology & Martial Arts",
      "Spartacus Martial Arts",
      "Warrior Mind Method",
    ],
    url: SEO.siteUrl,
    image: `${SEO.siteUrl}/images/portrait.webp`,
    logo: `${SEO.siteUrl}/favicon.svg`,
    telephone: SEO.phoneE164,
    email: SEO.email,
    founder: { "@id": `${SEO.siteUrl}/#kishore` },
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO.address.street,
      addressLocality: SEO.address.locality,
      addressRegion: SEO.address.region,
      postalCode: SEO.address.postalCode,
      addressCountry: SEO.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO.geo.latitude,
      longitude: SEO.geo.longitude,
    },
    areaServed: SEO.areasServed.map((a) => ({ "@type": "City", name: a })),
    openingHours: SEO.openingHours,
    priceRange: SEO.priceRange,
    currenciesAccepted: SEO.currenciesAccepted,
    paymentAccepted: SEO.paymentAccepted,
    sameAs: SEO.sameAs,
    knowsAbout: [
      "Sports Psychology",
      "Martial Arts",
      "Wushu",
      "Kung Fu",
      "Athlete Mindset Coaching",
      "Discipline",
      "Focus",
      "Confidence",
      "Emotional Control",
      "Pressure Handling",
      "Mental Performance Training",
    ],
    description:
      "Spartacus Martial Arts Chennai is a martial arts academy and sports psychology coaching centre founded by National Wushu Medalist Kishore Kumar. The academy offers martial arts classes, Wushu coaching, athlete mindset training, and sports psychology workshops for athletes, students, parents, schools, colleges, academies, and gyms across Chennai.",
  };

  // ── Person — Kishore Kumar ────────────────────────────────────────────────
  const person = {
    "@type": "Person",
    "@id": `${SEO.siteUrl}/#kishore`,
    name: SEO.founder,
    givenName: "Kishore",
    familyName: "Kumar",
    jobTitle: SEO.role,
    worksFor: { "@id": `${SEO.siteUrl}/#organization` },
    image: `${SEO.siteUrl}/images/portrait.webp`,
    url: SEO.siteUrl,
    sameAs: SEO.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: SEO.address.locality,
      addressRegion: SEO.address.region,
      addressCountry: SEO.address.country,
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Sports Psychology & Martial Arts Coach",
      occupationLocation: { "@type": "City", name: "Chennai" },
      skills: SEO.credentials.join(", "),
    },
    knowsAbout: [
      "Sports Psychology",
      "Wushu",
      "Kung Fu",
      "Martial Arts",
      "Athlete Mindset Coaching",
      "Confidence Training",
      "Pressure Handling",
      "Focus Training",
      "Emotional Control",
      "Competition Mindset",
    ],
    description:
      "Kishore Kumar is a National Wushu Medalist, Sports Psychologist, Wushu Coach & Judge, and Athlete Mindset Coach based in Chennai, India. He is the creator of the Warrior Mind Method™ — a five-part system combining Sports Psychology and martial-arts discipline to help athletes build focus, confidence, emotional control, and a winning competition mindset.",
  };

  // ── Services ──────────────────────────────────────────────────────────────
  const services = SEO.services.map((s, i) => ({
    "@type": "Service",
    "@id": `${SEO.siteUrl}/#service-${i + 1}`,
    name: s,
    serviceType: s,
    provider: { "@id": `${SEO.siteUrl}/#organization` },
    areaServed: SEO.areasServed.map((a) => ({ "@type": "City", name: a })),
    audience: {
      "@type": "Audience",
      audienceType:
        "Athletes, students, parents, schools, colleges, academies, gyms",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceType: "Online and In-Person",
      availableLanguage: { "@type": "Language", name: "English" },
    },
  }));

  // ── DefinedTerm — Warrior Mind Method™ (AEO entity) ──────────────────────
  const warriorMindMethod = {
    "@type": "DefinedTerm",
    "@id": `${SEO.siteUrl}/#warrior-mind-method`,
    name: "Warrior Mind Method™",
    termCode: "WMM",
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Kishore Kumar Coaching Framework",
      url: `${SEO.siteUrl}/#method`,
    },
    description:
      "The Warrior Mind Method™ is a five-part sports psychology and martial-arts coaching framework created by Kishore Kumar. The five pillars are: Focus (attention, clarity and distraction control), Fire (motivation, confidence and inner drive), Flow (calm execution and present-moment awareness), Forge (discipline, routine and consistent habits), and Fight (pressure handling, comeback mindset and competition confidence).",
    url: `${SEO.siteUrl}/#method`,
    creator: { "@id": `${SEO.siteUrl}/#kishore` },
  };

  // ── HowTo — AEO for "How sports psychology helps athletes" ───────────────
  const howTo = {
    "@type": "HowTo",
    "@id": `${SEO.siteUrl}/#how-sports-psychology-helps`,
    name: "How Sports Psychology Helps Athletes Perform Better",
    description:
      "Sports psychology gives athletes practical mental tools to manage nerves, sharpen focus, recover from mistakes and compete with consistent confidence. Kishore Kumar uses the Warrior Mind Method™ to apply these tools through martial-arts discipline.",
    totalTime: "PT8W",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "999" },
    supply: [
      { "@type": "HowToSupply", name: "Commitment to daily mental training" },
      { "@type": "HowToSupply", name: "Warrior Mind Method™ workbook" },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Build Focus",
        text: "Train attention control and distraction management so you stay locked in during training and competition — even when pressure builds.",
        url: `${SEO.siteUrl}/#method`,
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Develop Confidence (Fire)",
        text: "Replace self-doubt with consistent inner drive. Use pre-performance rituals and positive self-talk rooted in martial-arts discipline.",
        url: `${SEO.siteUrl}/#method`,
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Enter Flow State",
        text: "Learn to perform with calm, present-moment awareness instead of overthinking — the mental state where athletes perform at their peak.",
        url: `${SEO.siteUrl}/#method`,
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Forge Discipline & Routine",
        text: "Build non-negotiable daily habits and training routines that create consistency — the foundation of long-term performance improvement.",
        url: `${SEO.siteUrl}/#method`,
        position: 4,
      },
      {
        "@type": "HowToStep",
        name: "Develop a Fighter's Mindset (Fight)",
        text: "Train pressure handling, bounce-back ability, and the courageous competition mindset that allows athletes to perform their best when it matters most.",
        url: `${SEO.siteUrl}/#method`,
        position: 5,
      },
    ],
  };

  /**
   * ── Event — next Warrior Mind Workshop ──────────────────────────────────
   *
   * Emitted ONLY while the date is still ahead. This block used to be
   * unconditional, so once WORKSHOP.date slipped into the past the home page was
   * publishing an Event marked `EventScheduled` with `availability: InStock` and
   * a `validFrom` of today — telling Google a workshop that had already happened
   * was open for booking right now. Search Console reports past events as
   * errors, and markup that contradicts the visible page is exactly what earns a
   * structured-data manual action.
   *
   * The visible section degrades to its "next date being announced" state at the
   * same moment (see WorkshopSection), so page and markup stay in agreement.
   */
  const workshopUpcoming = new Date(WORKSHOP.date).getTime() > Date.now();

  const workshopEvent = {
    "@type": "Event",
    "@id": `${SEO.siteUrl}/#workshop-event`,
    name: WORKSHOP.title,
    description: `${WORKSHOP.subtitle} — a ${WORKSHOP.durationMinutes}-minute live sports-psychology intensive using the Warrior Mind Method™. ${WORKSHOP.includes.join(". ")}.`,
    startDate: WORKSHOP.date,
    duration: `PT${WORKSHOP.durationMinutes}M`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: [
      {
        "@type": "VirtualLocation",
        url: SEO.siteUrl,
      },
      {
        "@type": "Place",
        name: SEO.brand,
        address: {
          "@type": "PostalAddress",
          addressLocality: SEO.address.locality,
          addressRegion: SEO.address.region,
          addressCountry: SEO.address.country,
        },
      },
    ],
    organizer: { "@id": `${SEO.siteUrl}/#organization` },
    performer: { "@id": `${SEO.siteUrl}/#kishore` },
    offers: {
      "@type": "Offer",
      price: WORKSHOP.price.replace("₹", ""),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
      url: `${SEO.siteUrl}/#workshop`,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Athletes, students, parents, coaches, schools and academies",
    },
    inLanguage: "en-IN",
    image: `${SEO.siteUrl}/images/strong-mind.webp`,
    url: `${SEO.siteUrl}/#workshop`,
  };

  // ── FAQPage ───────────────────────────────────────────────────────────────
  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SEO.siteUrl}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // ── WebSite ───────────────────────────────────────────────────────────────
  const website = {
    "@type": "WebSite",
    "@id": `${SEO.siteUrl}/#website`,
    url: SEO.siteUrl,
    name: SEO.title,
    inLanguage: "en-IN",
    publisher: { "@id": `${SEO.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO.siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ── WebPage with SpeakableSpecification (voice search / AI AEO) ──────────
  const webpage = {
    "@type": "WebPage",
    "@id": `${SEO.siteUrl}/#webpage`,
    url: SEO.siteUrl,
    name: SEO.title,
    description: SEO.description,
    isPartOf: { "@id": `${SEO.siteUrl}/#website` },
    about: { "@id": `${SEO.siteUrl}/#organization` },
    inLanguage: "en-IN",
    // SpeakableSpecification — signals which CSS selectors hold the key answer content
    // for voice search (Google Assistant) and AI answer engines (Perplexity, ChatGPT)
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#overview", "#method", "#faq"],
    },
    mainEntity: { "@id": `${SEO.siteUrl}/#organization` },
    breadcrumb: { "@id": `${SEO.siteUrl}/#breadcrumb` },
  };

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${SEO.siteUrl}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      website,
      webpage,
      org,
      person,
      ...services,
      warriorMindMethod,
      howTo,
      ...(workshopUpcoming ? [workshopEvent] : []),
      faqPage,
      breadcrumb,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLdString(graph) }}
    />
  );
}
