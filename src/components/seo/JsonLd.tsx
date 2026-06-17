import { SEO } from "@/lib/seo";
import { FAQS } from "@/lib/site";

/**
 * Structured data (JSON-LD) for SEO / AEO / GEO + Local Chennai.
 * Graph: WebSite, WebPage, Organization, Person, LocalBusiness
 * (SportsActivityLocation), Service[], FAQPage, BreadcrumbList.
 *
 * NOTE: No Review / AggregateRating schema is emitted — add it ONLY when you
 * have real, approved review data (see SEO.sameAs + Reviews section).
 */
export function JsonLd() {
  const org = {
    "@type": ["Organization", "LocalBusiness", "SportsActivityLocation"],
    "@id": `${SEO.siteUrl}/#organization`,
    name: SEO.brand,
    alternateName: "Kishore Kumar Sports Psychology & Martial Arts",
    url: SEO.siteUrl,
    image: `${SEO.siteUrl}/images/portrait.jpg`,
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
    areaServed: SEO.areasServed.map((a) => ({ "@type": "City", name: a })),
    openingHours: SEO.openingHours,
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
    ],
  };

  const person = {
    "@type": "Person",
    "@id": `${SEO.siteUrl}/#kishore`,
    name: SEO.founder,
    jobTitle: SEO.role,
    worksFor: { "@id": `${SEO.siteUrl}/#organization` },
    image: `${SEO.siteUrl}/images/portrait.jpg`,
    url: SEO.siteUrl,
    sameAs: SEO.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: SEO.address.locality,
      addressRegion: SEO.address.region,
      addressCountry: SEO.address.country,
    },
    description:
      "National Wushu Medalist, Sports Psychologist, Wushu Coach & Judge, and Athlete Mindset Coach based in Chennai.",
  };

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
  }));

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SEO.siteUrl}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SEO.siteUrl}/#website`,
    url: SEO.siteUrl,
    name: SEO.title,
    inLanguage: "en-IN",
    publisher: { "@id": `${SEO.siteUrl}/#organization` },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${SEO.siteUrl}/#webpage`,
    url: SEO.siteUrl,
    name: SEO.title,
    description: SEO.description,
    isPartOf: { "@id": `${SEO.siteUrl}/#website` },
    about: { "@id": `${SEO.siteUrl}/#organization` },
    inLanguage: "en-IN",
  };

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
      faqPage,
      breadcrumb,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
