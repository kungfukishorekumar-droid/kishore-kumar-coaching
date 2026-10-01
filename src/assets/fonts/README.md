# Fonts for generated images

Used only at build time by the Open Graph / icon image routes
(`src/lib/og.tsx`). The site itself loads its fonts through `next/font`.

WOFF rather than WOFF2 because the image renderer (Satori, via `next/og`)
cannot read WOFF2.

- **Bebas Neue** — Dharma Type. SIL Open Font License 1.1.
- **Inter** — Rasmus Andersson. SIL Open Font License 1.1.

Both licences permit bundling and redistribution: https://openfontlicense.org
