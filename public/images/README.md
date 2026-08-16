# 📸 Photos

The real studio photos are installed and wired in. Mapping:

**The site serves the `.webp` files.** The `.jpg` files beside them are the
originals, kept as masters — nothing references them, so editing a `.jpg` alone
changes nothing on the site.

| File                | Photo                                              | Used in                       |
| ------------------- | -------------------------------------------------- | ----------------------------- |
| `portrait.webp`     | Arms-crossed portrait (kung-fu shadow)             | Hero (main, face-forward)     |
| `hero-wide.webp`    | 心技体 + Mindset/Focus/Discipline, zen circle       | About section                 |
| `strong-mind.webp`  | "STRONG MIND. STRONGER YOU." banner                | Lead-form panel, OG image     |
| `gesture.webp`      | Open-hand pose, gold HUD accents                   | Method + Final CTA backdrops  |

`portrait-480.webp` / `portrait-800.webp` / `portrait-1200.webp` are the
responsive sizes for the hero portrait, which is the page's LCP element.

## Replacing a photo
Export it to **WebP** and drop it in with the same name. Keeping the `.jpg`
master beside it is optional but useful for future re-exports. To change which
photo a section uses, edit the `IMAGES` map in
[`src/lib/site.ts`](../../src/lib/site.ts).

> WebP cut these from ~170–270 KB each to ~40–64 KB. All are lazy-loaded except
> the hero portrait, which is preloaded in `src/app/page.tsx`. For new photos,
> ~1600px on the long edge through [squoosh.app](https://squoosh.app) keeps the
> page fast.
