import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
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
    <html lang="en-IN" className={`dark ${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
