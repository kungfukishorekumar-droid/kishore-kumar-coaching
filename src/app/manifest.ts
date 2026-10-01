export const dynamic = "force-static";

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kishore Kumar — Sports Psychology & Martial Arts Coach",
    short_name: "Kishore Kumar",
    description:
      "Train Your Mind Like a Warrior. Perform Like a Champion. Athlete mindset coaching, martial arts & sports psychology in Chennai.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#08080a",
    orientation: "portrait-primary",
    categories: ["sports", "education", "health"],
    // Android's install prompt needs 192 and 512 px raster icons; the maskable
    // one keeps the monogram inside the safe zone for circle/squircle masks.
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
