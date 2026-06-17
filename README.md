# Kishore Kumar — Athlete Mindset Coaching

A premium, high-converting landing page for **Kishore Kumar** — Sports Psychology,
Martial Arts & Athlete Mindset Coach (Chennai).
**Train Your Mind Like a Warrior. Perform Like a Champion.**

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — dark luxury theme: gold + electric-blue + navy, glassmorphism,
  glow, shine borders
- **shadcn/ui-style** primitives + **21st.dev-style** patterns (tilt cards, bento,
  floating dock, marquee, accordion, glow buttons)
- **Framer Motion** — scroll reveals, staggered cards, 3D tilt, parallax glow orbs
- **lucide-react** icons, **next/font** (Oswald display + Inter)

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

> ⚠️ Don't run `npm run build` while `npm run dev` is live — it corrupts the shared
> `.next` cache. Stop dev first (or `rm -rf .next` and restart).

## Sections (in order)

1. **Hero** — headline, 4 CTAs (Book call · GPT · WhatsApp · Programs), floating
   credential badges, glow ring, scroll indicator
2. **Social proof** — credential marquee
3. **Stats** — animated counters
4. **Problems** — 10 pain-point tilt cards
5. **Solution** — sports psychology × martial arts, 3D icon blocks, quote
6. **Warrior Mind Method™** — Focus · Fire · Flow · Forge · Fight
7. **Programs** — 6 offers (1-day → 21-day, personal, institutions)
8. **Authority** — "Why train with Kishore" + credential grid
9. **Martial Arts × Mind** — how the two disciplines combine
10. **Testimonials** — categorised social-proof cards
11. **Institutions** — B2B workshops for schools/academies/gyms
12. **Custom GPT** — Athlete Mindset GPT with live chat preview
13. **Lead form** — Free Focus & Confidence Checklist → CRM
14. **FAQ** — 10 questions
15. **Final CTA** — 4 conversion buttons
16. **Footer** + **Floating CTA** (WhatsApp/GPT + sticky mobile bar) + **Back-to-top**

## File structure

```
src/
  app/
    layout.tsx        # SEO metadata + fonts
    page.tsx          # composes all sections
    globals.css       # design tokens, glass, shine-border
    api/lead/route.ts # CRM backend (server-side)
  components/
    sections/         # one file per section above
    shared/           # Navbar, Footer, FloatingCTA, BackToTop
    ui/               # button, accordion, reveal, counter, icon, tilt-card, floating-shapes
  lib/
    site.ts           # ← ALL content + links (the "constants" file)
    utils.ts          # cn() + smooth scroll
```

## Where to edit things

| Want to change…        | Edit…                                                       |
| ---------------------- | ----------------------------------------------------------- |
| Any copy / programs / FAQ / testimonials | `src/lib/site.ts`                         |
| Links (WhatsApp/IG/GPT) | `SITE` in `src/lib/site.ts`                                |
| Colors / fonts / glow  | `tailwind.config.js` + `src/app/globals.css`                |
| SEO title/description  | `src/app/layout.tsx`                                        |

## Your photos

Real photos are installed in `public/images/` (`portrait.jpg`, `hero-wide.jpg`,
`strong-mind.jpg`, `gesture.jpg`). To swap one, drop a new file with the same name,
or change the `IMAGES` map in `src/lib/site.ts`. The hero deliberately keeps text
off Kishore's face.

## Replace the testimonials

The `TESTIMONIALS` array in `src/lib/site.ts` is marked **PLACEHOLDER**. Replace it
with manually approved **real** Google Business Profile and Justdial reviews before
launch. Keep the same shape (`quote`, `name`, `category`, `rating`, `source`).

## Connect the CRM (WarriorCRM)

The lead form posts to a **server-side** route so the CRM stays private:

```
LeadForm → POST /api/lead → src/app/api/lead/route.ts → WarriorCRM
```

Copy `.env.example` → `.env.local` and set your intake endpoint:

```bash
CRM_WEBHOOK_URL=https://warriorcrm.netlify.app/api/leads   # your real endpoint
CRM_API_KEY=                                               # optional auth token
```

Until that's set, submissions still succeed and log server-side. WhatsApp is the
fallback after submit. Payload sent: `{ name, phone, age, sport, who, challenge,
magnet, source, submittedAt }` — remap in the route if your CRM expects other names.

## Deploy

- **Vercel** (easiest for Next.js): import the repo → deploy. Add `CRM_WEBHOOK_URL`
  in Project → Settings → Environment Variables.
- **Netlify**: it auto-detects Next.js (`@netlify/plugin-nextjs`) so the `/api/lead`
  route works as a function. Add the same env vars in Site settings.

## Recreating / improving in Lovable.com

This is built on Lovable's underlying stack (Vite-equivalent Next + React + Tailwind
+ shadcn), so it ports cleanly:
1. In Lovable, start a project and paste sections from `src/components/sections/*`.
2. `src/lib/site.ts` maps to Lovable's content/constants approach — edit copy there.
3. Tailwind tokens in `tailwind.config.js` + `globals.css` transfer directly.
4. Keep the same section order for the proven conversion flow.
