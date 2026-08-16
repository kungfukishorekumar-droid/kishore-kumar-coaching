# Kishore Kumar — Athlete Mindset Coaching

A premium, high-converting landing page for **Kishore Kumar** — Sports Psychology,
Martial Arts & Athlete Mindset Coach (Chennai).
**Train Your Mind Like a Warrior. Perform Like a Champion.**

## Stack

- **Next.js 16** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** — dark luxury theme: gold + electric-blue + navy, glassmorphism,
  glow, shine borders
- **shadcn/ui-style** primitives + **21st.dev-style** patterns (tilt cards, bento,
  floating dock, marquee, accordion, glow buttons)
- **Framer Motion** — scroll reveals, staggered cards, 3D tilt, parallax glow orbs
- **lucide-react** icons, **next/font** (Bebas Neue display + Inter, self-hosted)

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run typecheck # tsc --noEmit (what CI gates on)
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
    layout.tsx          # SEO metadata + fonts
    page.tsx            # composes all sections
    globals.css         # design tokens, glass, shine-border
    api/
      lead/route.ts     # POST — the site's only write endpoint
      health/route.ts   # GET  — config readiness probe
  components/
    sections/           # one file per section above
    shared/             # Navbar, Footer, FloatingCTA, BackToTop
    ui/                 # button, accordion, reveal, counter, icon, tilt-card, floating-shapes
  lib/
    site.ts             # ← ALL content + links (the "constants" file)
    utils.ts            # cn() + smooth scroll
    lead-client.ts      # browser → /api/lead/
    server/             # server-only; never imported by a client component
      env.ts            # runtime env access (no NEXT_PUBLIC_ = never in the bundle)
      http.ts           # body cap, origin check, client IP, JSON responses
      validate.ts       # the trust boundary — allowlist + server-owned fields
      rate-limit.ts     # two-tier sliding window + duplicate suppression
      turnstile.ts      # server-side bot-token verification
      leads.ts          # the Supabase write
      log.ts            # structured logs with PII redaction
supabase/
  functions/submit-lead # Edge Function — still used by the Spartacus site
```

Anything under `src/lib/server/` reads secrets and must only ever be imported by
a route handler. Importing one from a `"use client"` component would pull it
into the browser bundle.

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

Lead capture runs **server-side**. The form posts to this app's own API, and the
server writes to the CRM's Supabase intake queue:

```
LeadForm / WorkshopSection
  → POST /api/lead/            (src/app/api/lead/route.ts)
     → validate + rate-limit + Turnstile + de-duplicate
     → Supabase public_leads   (src/lib/server/leads.ts)
        → WarriorCRM drains it
```

**The browser holds no Supabase credential.** It used to: the form POSTed
straight into Supabase with a publishable key shipped in the bundle, which meant
anyone reading the bundle could write to the queue, and a Turnstile token could
not be verified because there was no server to verify it on. That design came
from a period when the site was a static export. It is not one any more.

### Configure it

Everything has a safe fallback, so the site works unconfigured. Copy
`.env.example` → `.env.local` (or set these in hPanel for production):

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Note the **missing `NEXT_PUBLIC_` prefix** — that prefix is what would inline a
value into the browser bundle, so leaving it off is what keeps the key on the
server. Never add it to these two.

With a service-role key set, this server is the only writer to `public_leads`,
so you can **revoke the anon INSERT policy** and close the queue to the public.
Until then the server falls back to the publishable key and the policy must stay
open.

### Check a deployment

```bash
curl https://kishorekumarcoach.com/api/health/
```

Reports whether lead capture is configured and what the next hardening step is,
without disclosing any secret. `"status": "degraded"` means leads are being
captured but the queue is not locked down yet.

### Bot protection

Set **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (renders the widget) and
`TURNSTILE_SECRET_KEY` (lets the server verify the token). A widget without
server verification stops nothing. While the secret is unset, the rate limiter
and the honeypot field are the only bot defences.

### API reference

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/lead/` | `POST` | Accepts a lead. `200 {ok:true}` on success; `422` invalid; `429` rate-limited; `403` bot check or bad origin; `502` upstream unavailable. |
| `/api/health/` | `GET` | Configuration readiness. `200` ready, `503` unconfigured. |

⚠️ **Call these with the trailing slash.** `trailingSlash: true` applies to route
handlers, so `/api/lead` answers 308 to `/api/lead/` — it works, but costs an
extra round trip on every submission.

Every response carries `x-request-id`, which is also in the server logs — quote
it when chasing down a specific submission.

## Tests

```bash
npm test            # 103 tests, ~0.7s
npm run test:watch  # during development
npm run verify      # typecheck + tests + build (what CI runs)
```

```
tests/
├── unit/           # validate, rate-limit, log redaction, http helpers
└── integration/    # the real /api/lead/ handler, end to end
```

Node environment, no network and no database: `fetch` is stubbed, so a test run
can never write to the live CRM queue. The integration tests import the actual
route handler and exercise validation, rate limiting, the honeypot,
de-duplication, Turnstile and error shaping together.

Not covered: the React components. There is no component test harness, and a
jsdom setup nothing uses would hide that gap rather than close it.

## Deploy (Hostinger — kishorekumarcoach.com)

Hostinger runs this as a **real Next.js app** on its Node runtime and deploys it
from Git itself — its responses carry `x-nextjs-cache` / `x-nextjs-prerender`.
Pushing to `main` is the deploy.

`next.config.mjs` therefore does *not* use `output: "export"`. That matters:
the exporter ignores `headers()`, which is what previously left the live site
with no HSTS, no `X-Frame-Options` and only a stub CSP.

[.github/workflows/build-check.yml](.github/workflows/build-check.yml) does not
deploy. It installs, type-checks and builds every push and PR, so a broken build
is caught before Hostinger picks it up. Two optional secrets are baked in at
build time if present (GitHub → Settings → Secrets and variables → Actions):

| Secret | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | optional — Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional — Supabase project settings (anon/publishable only) |

Build it locally the way CI does with `npm run build`, and serve the result with
`npm start`. `npm run typecheck` runs the type checker on its own.

## Google Search Console

The site claims ownership three independent ways, so losing one never unverifies
the property:

| Method | Where it lives |
| --- | --- |
| Meta tag | [src/app/layout.tsx:153](src/app/layout.tsx#L153) — `verification.google` |
| HTML file | `public/google7db206634843f0fa.html` |
| **DNS TXT** | Hostinger hPanel → **Domains → DNS / Nameservers → DNS Zone** — *not in this repo* |

The DNS record must be added by hand in hPanel, because DNS is served by Hostinger,
not by the site:

```
Type:  TXT
Name:  @            (some panels want it blank — that means the root domain)
TTL:   14400        (or whatever the panel defaults to)
Value: google-site-verification=k7Z30AyqlrGJ_pfaErNYKwxp7BPgPKMynfF1Z6Dhz58
```

DNS is the only method that verifies a **Domain property**, which covers `http`
and `https`, `www` and non-`www`, and every subdomain in one entry. The other two
only verify the exact `https://kishorekumarcoach.com/` URL prefix.

After verifying, submit `sitemap.xml` in Search Console → **Sitemaps**. Indexing
takes days to weeks; it is not instant.

## Recreating / improving in Lovable.com

This is built on Lovable's underlying stack (Vite-equivalent Next + React + Tailwind
+ shadcn), so it ports cleanly:
1. In Lovable, start a project and paste sections from `src/components/sections/*`.
2. `src/lib/site.ts` maps to Lovable's content/constants approach — edit copy there.
3. Tailwind tokens in `tailwind.config.js` + `globals.css` transfer directly.
4. Keep the same section order for the proven conversion flow.
