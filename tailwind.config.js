/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Brand palette — premium dark + martial gold + electric blue
        ink: {
          DEFAULT: "#08080a",
          50: "#131319",
          100: "#0e0e13",
          900: "#040406",
        },
        silver: {
          DEFAULT: "#C2C9D6",
          300: "#D8DDE6",
          500: "#9AA2B1",
        },
        navy: {
          DEFAULT: "#0b1226",
          700: "#101a36",
          800: "#0b1226",
          900: "#070c1a",
        },
        gold: {
          DEFAULT: "#E0A93C",
          50: "#FBF3DE",
          100: "#F6E4B8",
          200: "#F0CF85",
          300: "#E8BB5C",
          400: "#E0A93C",
          500: "#C8902A",
          600: "#A8741D",
          700: "#7E5614",
        },
        electric: {
          DEFAULT: "#3B82F6",
          300: "#7DAEFF",
          400: "#5B9DFF",
          500: "#3B82F6",
          600: "#2563EB",
        },
        ember: "#F4C430",
        bronze: "#8B5E2B",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 50px -18px rgba(207, 156, 58, 0.28)",
        "glow-lg": "0 0 100px -30px rgba(207, 156, 58, 0.30)",
        "glow-blue": "0 0 50px -18px rgba(59, 130, 246, 0.26)",
        "glow-blue-lg": "0 0 100px -30px rgba(59, 130, 246, 0.28)",
        card: "0 16px 50px -20px rgba(0, 0, 0, 0.85)",
        "gold-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E6CF9C 0%, #CF9C3A 48%, #8E5F18 100%)",
        "gold-text": "linear-gradient(180deg, #E3CE9C 0%, #C5963A 60%, #7E5614 100%)",
        "electric-gradient": "linear-gradient(135deg, #6FA0F0 0%, #3B82F6 52%, #2456C8 100%)",
        "silver-text": "linear-gradient(180deg, #EDEFF3 0%, #B9C0CC 55%, #8A93A3 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(207,156,58,0.10), transparent 62%)",
        "radial-glow-blue": "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.09), transparent 62%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        marquee: "marquee 28s linear infinite",
        spotlight: "spotlight 2s ease 0.75s 1 forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
