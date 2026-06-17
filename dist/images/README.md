# 📸 Photo guide — where each image goes

The site ships with on-brand **SVG placeholders** so it looks complete out of the
box. Replace them with the 4 studio photos to make it real.

## Steps
1. Save each photo into this folder (`/public/images`) using the filename below.
2. Open `src/lib/site.ts` and change each extension from `.svg` → `.jpg`
   (or `.png`, matching your files).
3. Done — every section updates automatically.

## Which photo → which file

| Reference (from the brief)                                   | Save as            | Used in                          |
| ------------------------------------------------------------ | ------------------ | -------------------------------- |
| **#1** — Vertical portrait, arms crossed, kung-fu shadow     | `portrait.jpg`     | About section                    |
| **#2** — Wide, 心技体 + Mindset/Focus/Discipline icons        | `hero-wide.jpg`    | Hero (main image)                |
| **#3** — "STRONG MIND. STRONGER YOU." seated banner          | `strong-mind.jpg`  | Lead-form visual panel           |
| **#4** — Wide, open-hand gesture, gold HUD accents           | `gesture.jpg`      | Method backdrop + Final CTA      |

> Tip: keep portrait images roughly **4:5** and wide images **16:9** for the
> cleanest crop. Large photos are fine — they're lazy-loaded.

## Recommended optimization
Export at ~1600px on the long edge and run them through
[squoosh.app](https://squoosh.app) (MozJPEG ~75%) to keep the page fast.
