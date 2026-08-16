/**
 * SEO / AEO / GEO + Local (Chennai) configuration.
 * Central place for NAP (Name, Address, Phone), GeoCoordinates, service entities,
 * and schema-data primitives consumed by JsonLd.tsx.
 *
 * ⚠️ Replace ADDRESS / GEO / OPENING HOURS / SAMEAS placeholders with real values
 * (Google Business Profile, Justdial, BookMyPlayer URLs) before launch.
 */

/**
 * The site's canonical origin — the single source of truth for canonical tags,
 * the sitemap, robots host, OG image URLs and every JSON-LD @id.
 *
 * Every page is prerendered, so this is read at BUILD time and baked in. The
 * fallback below is the real production domain, so a normal build is already
 * correct; set NEXT_PUBLIC_SITE_URL only when building for another origin
 * (preview, staging). Getting it wrong points canonical tags, the sitemap and
 * OG URLs at a different site, which can stop the deployed one being indexed.
 */
const FALLBACK_SITE_URL = "https://kishorekumarcoach.com";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  // Trailing slashes would produce "//sitemap.xml" style joins downstream.
  return raw.replace(/\/+$/, "");
}

export const SEO = {
  siteUrl: resolveSiteUrl(),
  brand: "Spartacus Martial Arts Chennai",
  founder: "Kishore Kumar",
  role: "Sports Psychology & Martial Arts Coach",
  locale: "en_IN",

  // ── Meta ──────────────────────────────────────────────────────────────────
  title: "Kishore Kumar | Sports Psychology & Martial Arts Coach in Chennai",
  description:
    "Athlete mindset coaching, martial arts discipline, Wushu training, sports psychology workshops, and confidence training for athletes, students, parents, schools, and academies in Chennai.",
  keywords: [
    "sports psychology Chennai",
    "martial arts coach Chennai",
    "athlete mindset coach Chennai",
    "Wushu coach Chennai",
    "confidence training for athletes",
    "focus training for students",
    "martial arts mindset",
    "sports psychology workshop Chennai",
    "Spartacus Martial Arts Chennai",
    "martial arts classes Chennai",
    "Kishore Kumar sports psychologist",
    "Warrior Mind Method Chennai",
    "pressure handling training athletes India",
  ],

  // ── NAP — Name / Address / Phone ──────────────────────────────────────────
  phone: "+91 98845 99939",
  phoneE164: "+919884599939",
  email: "coach@kishorekumar.com",
  address: {
    locality: "Chennai",
    region: "Tamil Nadu",
    country: "IN",
    postalCode: "600000",  // ⚠️ replace with real PIN code
    street: "Chennai",     // ⚠️ replace with real street address
  },

  // ⚠️ Replace with real GPS coordinates (Google Maps → right-click → "What's here?")
  geo: {
    latitude: "13.0827",   // placeholder — approximate Chennai centre
    longitude: "80.2707",  // placeholder — approximate Chennai centre
  },

  // ⚠️ placeholder hours — replace with real opening hours
  openingHours: "Mo-Sa 06:00-21:00",

  // ── Service area ──────────────────────────────────────────────────────────
  areasServed: ["Chennai", "Otteri", "Perambur", "Ayanavaram", "Korukkupet"],

  // ── Services (schema entities) ───────────────────────────────────────────
  services: [
    "Sports Psychology Coaching",
    "Martial Arts Classes",
    "Wushu Coaching",
    "Athlete Mindset Coaching",
    "School & Academy Workshops",
  ],

  // ── Business details ──────────────────────────────────────────────────────
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",

  // ── Credentials / awards (entity enrichment for AEO) ────────────────────
  credentials: [
    "National Wushu Medalist",
    "Sports Psychologist",
    "Wushu Coach",
    "Wushu Judge",
    "Certified Martial Artist",
    "Athlete Mindset Coach",
  ],

  /**
   * sameAs — the other web properties that are provably the same entity.
   *
   * This is how search engines merge separate sites into one identity instead
   * of treating them as unrelated. Both the YouTube channel and the Spartacus
   * academy site belong here, and ideally each should link back with the same
   * claim — a reciprocal link is far stronger evidence than a one-way one.
   */
  sameAs: [
    "https://www.instagram.com/kishorekumar.coach/",
    "https://www.youtube.com/@KishoreKumarSportsPsychologist",
    "https://spartacus-martial-arts.vercel.app/",
    // "https://www.google.com/maps?cid=YOUR_GOOGLE_BUSINESS_CID",
    // "https://www.justdial.com/your-listing",
  ],

  /** The sister academy site, cross-linked from the footer and blog. */
  academy: {
    name: "Spartacus Martial Arts Academy",
    url: "https://spartacus-martial-arts.vercel.app/",
    // NOTE: spartacusmartialarts.in is referenced inside the academy site's
    // markup but does not currently resolve. Switch `url` to it once it does —
    // a custom domain carries more authority than a *.vercel.app subdomain.
  },

  /** YouTube channel — used for sameAs and video article linking. */
  youtube: {
    handle: "@KishoreKumarSportsPsychologist",
    url: "https://www.youtube.com/@KishoreKumarSportsPsychologist",
  },
};
