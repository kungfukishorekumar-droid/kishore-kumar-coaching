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
    default: "Kishore Kumar | Sports Psychology & Martial Arts Coach in Chennai",
    template: "%s | Kishore Kumar",
  },
  description:
    "Athlete mindset coaching, martial arts discipline, sports psychology workshops, and confidence training for athletes, students, parents, schools, and academies in Chennai.",
  keywords: [
    "sports psychology Chennai",
    "martial arts coach Chennai",
    "athlete mindset coach",
    "Wushu coach",
    "confidence training for athletes",
    "focus training for students",
    "martial arts mindset",
    "sports psychology workshop",
  ],
  authors: [{ name: "Kishore Kumar" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Kishore Kumar | Sports Psychology & Martial Arts Coach in Chennai",
    description: "Train Your Mind Like a Warrior. Perform Like a Champion. Athlete mindset coaching, martial arts discipline & sports psychology workshops in Chennai.",
    url: SITE_URL,
    siteName: "Spartacus Martial Arts Chennai · Kishore Kumar",
    images: [{ url: "/images/strong-mind.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishore Kumar | Sports Psychology & Martial Arts Coach",
    description: "Train Your Mind Like a Warrior. Perform Like a Champion.",
    images: ["/images/strong-mind.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
