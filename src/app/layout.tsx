import type { Metadata, Viewport } from "next";
import { Archivo, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Type system — three roles, each doing one job.
 *
 *  display (Archivo)     headlines. A grotesque that stays dense and
 *                        authoritative at 800/900 uppercase, where Oswald's
 *                        condensed forms started to feel like a sports poster.
 *  body    (Manrope)     running text. Slightly geometric, a little warmer
 *                        than the usual Inter default, and very legible small.
 *  mono    (JetBrains)   figures only — stat counters, countdown, prices.
 *                        Tabular by design, so digits never jitter as they tick.
 *
 * All three are variable fonts loaded through next/font, so they're
 * self-hosted (no CDN request, no CSP exception) and swap without FOIT.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://kishorekumar.coach";

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
        // Dynamic OG image served from /opengraph-image (next/og)
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
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

  // ⚠️ Add your real Google Search Console verification token below
  // verification: { google: "your-token-here" },

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
      className={`dark ${archivo.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
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
