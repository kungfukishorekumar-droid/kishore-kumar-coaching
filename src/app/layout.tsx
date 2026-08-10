import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { SEO } from "@/lib/seo";
import "./globals.css";

/**
 * Type system — Bebas Neue + Inter, matching the workshop page's stack.
 *
 *  display (Bebas Neue)  headlines. A tall condensed poster face — the whole
 *                        point of it is impact at large sizes.
 *                        Two constraints it imposes, both handled in
 *                        globals.css rather than across 25 files:
 *                          • no lowercase — every glyph renders as a capital,
 *                            so display text is inherently all-caps;
 *                          • one weight (400) — any bold utility would make
 *                            the browser fake it and smear the strokes, so
 *                            .font-display is pinned to 400 and hierarchy
 *                            comes from size instead.
 *  body    (Inter)       running text, and figures. Inter's tabular numerals
 *                        cover the counters and countdown, which is why no
 *                        separate mono face is loaded.
 *
 * Both come through next/font, so they're self-hosted — no CDN request and no
 * CSP exception needed — and swap without invisible text.
 */
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  // 800 was shipped but never rendered — headings use Bebas Neue, so no body
  // text is ever extra-bold. Dropping it removes a font file from the critical
  // path, which is the cheapest FCP/LCP win available.
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Single source of truth (env-driven) — see resolveSiteUrl() in lib/seo.ts.
// Previously hardcoded here, which meant a deploy on any other origin still
// emitted canonical/OG URLs pointing at kishorekumar.coach.
const SITE_URL = SEO.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Kishore Kumar | Sports Psychology & Martial Arts Coach in Chennai",
    template: "%s | Kishore Kumar — Chennai",
  },
  description:
    "Athlete mindset coaching, Wushu, martial arts discipline, sports psychology workshops and confidence training for athletes, students, parents, schools and academies in Chennai. Serving Otteri, Perambur, Ayanavaram, Korukkupet and nearby areas.",

  keywords: [
    // Primary intent keywords
    "sports psychology Chennai",
    "martial arts coach Chennai",
    "athlete mindset coach Chennai",
    "Wushu coach Chennai",
    "sports psychology coach India",
    // Long-tail / conversational
    "how to build focus for athletes",
    "confidence training for athletes Chennai",
    "focus training for students Chennai",
    "mental training for martial arts",
    "sports psychology workshop for schools",
    // Brand / entity
    "Kishore Kumar sports psychologist",
    "Kishore Kumar martial arts",
    "Spartacus Martial Arts Chennai",
    "Warrior Mind Method",
    // GEO variations
    "martial arts classes Otteri Chennai",
    "martial arts classes Perambur Chennai",
    "Wushu training Chennai",
    "athlete mindset coaching India",
    // Service keywords
    "martial arts classes Chennai",
    "school workshop sports psychology",
    "mindset coaching for competitive athletes",
    "pressure handling training athletes",
  ],

  authors: [{ name: "Kishore Kumar", url: SITE_URL }],
  creator: "Kishore Kumar",
  publisher: "Spartacus Martial Arts Chennai",

  alternates: {
    canonical: SITE_URL,
    languages: { "en-IN": SITE_URL },
    // Advertises the feed sitewide, so readers and crawlers auto-discover it.
    types: {
      "application/rss+xml": [
        { url: "/blog/rss.xml", title: "Kishore Kumar — Blog" },
      ],
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    title:
      "Kishore Kumar | Sports Psychology & Martial Arts Coach in Chennai",
    description:
      "Train Your Mind Like a Warrior. Perform Like a Champion. Sports psychology + martial arts coaching for athletes, students, parents, schools and academies in Chennai.",
    url: SITE_URL,
    siteName: "Kishore Kumar — Spartacus Martial Arts Chennai",
    images: [
      {
        // Static OG image (dynamic next/og route can't run on static hosting)
        url: "/images/strong-mind.webp",
        width: 1200,
        height: 630,
        alt: "Kishore Kumar — Train Your Mind Like a Warrior. Perform Like a Champion.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kishore Kumar | Sports Psychology & Martial Arts Coach",
    description:
      "Train Your Mind Like a Warrior. Perform Like a Champion. Athlete mindset + martial arts coaching in Chennai.",
    images: ["/images/strong-mind.webp"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Google Search Console verification. This is a second, independent method
  // from the DNS TXT record — either alone verifies the property, and having
  // both means a DNS change can't accidentally un-verify the site.
  verification: { google: "k7Z30AyqlrGJ_pfaErNYKwxp7BPgPKMynfF1Z6Dhz58" },

  category: "sports coaching",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="en-IN" signals Indian English locale to search engines + screen readers
    <html
      lang="en-IN"
      className={`dark ${bebasNeue.variable} ${inter.variable}`}
    >
      <body>
        {/* Keyboard users land here first — lets them jump the navbar entirely */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
