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
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
