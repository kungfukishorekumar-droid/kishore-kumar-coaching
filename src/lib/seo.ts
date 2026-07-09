/**
 * SEO / AEO / GEO + Local (Chennai) configuration.
 * Central place for NAP (Name, Address, Phone), GeoCoordinates, service entities,
 * and schema-data primitives consumed by JsonLd.tsx.
 *
 * ⚠️ Replace ADDRESS / GEO / OPENING HOURS / SAMEAS placeholders with real values
 * (Google Business Profile, Justdial, BookMyPlayer URLs) before launch.
 */

export const SEO = {
  siteUrl: "https://kishorekumar.coach",
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

  // ── sameAs — add real profile URLs before launch ─────────────────────────
  sameAs: [
    "https://www.instagram.com/kishorekumar.coach/",
    // "https://www.google.com/maps?cid=YOUR_GOOGLE_BUSINESS_CID",
    // "https://www.justdial.com/your-listing",
  ],
};
