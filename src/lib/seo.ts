/**
 * SEO / AEO / GEO + Local (Chennai) configuration.
 * Central place for NAP (Name, Address, Phone), service entities and schema data.
 * ⚠️ Replace the ADDRESS / OPENING HOURS / SAMEAS placeholders with real values
 * (Google Business Profile, Justdial, BookMyPlayer URLs) before launch.
 */

export const SEO = {
  siteUrl: "https://kishorekumar.coach", // ← set to your real domain
  brand: "Spartacus Martial Arts Chennai",
  founder: "Kishore Kumar",
  role: "Sports Psychology & Martial Arts Coach",
  locale: "en_IN",

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
  ],

  // NAP — Name / Address / Phone (keep consistent everywhere)
  phone: "+91 98845 99939",
  phoneE164: "+919884599939",
  email: "coach@kishorekumar.com",
  address: {
    locality: "Chennai",
    region: "Tamil Nadu",
    country: "IN",
    postalCode: "600000", // ← replace with real PIN code
    street: "Chennai", // ← replace with real street address
  },
  // ⚠️ placeholder hours — replace with real opening hours
  openingHours: "Mo-Sa 06:00-21:00",

  areasServed: ["Chennai", "Otteri", "Perambur", "Ayanavaram", "Korukkupet"],

  services: [
    "Sports Psychology Coaching",
    "Martial Arts Classes",
    "Wushu Coaching",
    "Athlete Mindset Coaching",
    "School & Academy Workshops",
  ],

  // Add Google Business Profile / Justdial / BookMyPlayer URLs here when available.
  sameAs: ["https://www.instagram.com/kishorekumar.coach/"],
};
