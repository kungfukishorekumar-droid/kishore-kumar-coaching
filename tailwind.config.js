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
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Fluid headline sizes — scale with the viewport instead of stepping at
      // breakpoints, so there's no awkward size jump on tablet widths.
      // Archivo sets noticeably wider than the Oswald it replaced, so these caps
      // are deliberately lower than they'd be for a condensed face — same
      // optical weight on the line, without the headline running long.
      fontSize: {
        "fluid-xl": ["clamp(1.5rem, 1.25rem + 1.3vw, 2.125rem)", { lineHeight: "1.15" }],
        "fluid-2xl": ["clamp(1.875rem, 1.45rem + 2.1vw, 2.75rem)", { lineHeight: "1.08" }],
        "fluid-3xl": ["clamp(2.125rem, 1.55rem + 2.9vw, 3.75rem)", { lineHeight: "1.02" }],
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
        // Ambient background: two aurora fields drifting on opposing paths.
        // Transform-only, so it never triggers layout.
        "aurora-a": {
          "0%, 100%": { transform: "translate3d(-6%, -3%, 0) scale(1)" },
          "50%": { transform: "translate3d(6%, 4%, 0) scale(1.12)" },
        },
        "aurora-b": {
          "0%, 100%": { transform: "translate3d(5%, 4%, 0) scale(1.08)" },
          "50%": { transform: "translate3d(-5%, -4%, 0) scale(1)" },
        },
        // Slow vertical drift for the hairline grid.
        "grid-drift": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(0, -60px, 0)" },
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
        "aurora-a": "aurora-a 22s ease-in-out infinite",
        "aurora-b": "aurora-b 28s ease-in-out infinite",
        "grid-drift": "grid-drift 14s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
