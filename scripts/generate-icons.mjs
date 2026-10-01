// Generates the PNG app icons in public/icons/ — the KK monogram in the brand
// font (Bebas Neue) on ink, with the gold gradient.
//
//   node scripts/generate-icons.mjs
//
// Run again only if the monogram changes; the output is committed. PNG because
// iOS ignores SVG apple-touch-icons and Android's install prompt wants 192 and
// 512 px raster icons. `maskable` variants keep the letters inside the safe
// zone, so Android's circle/squircle masks never crop them.
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const bebas = await readFile("src/assets/fonts/BebasNeue-Regular.woff");

function monogram(size, { maskable = false, rounded = true } = {}) {
  // Maskable icons must keep content within the central 80%.
  const fontSize = Math.round(size * (maskable ? 0.42 : 0.56));
  return new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          backgroundImage: "radial-gradient(circle at 30% 25%, rgba(224,169,60,0.28), transparent 60%)",
          borderRadius: rounded && !maskable ? Math.round(size * 0.22) : 0,
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Bebas Neue",
            fontSize,
            lineHeight: 1,
            paddingTop: Math.round(fontSize * 0.08),
            backgroundImage: "linear-gradient(135deg, #F6E4B8 0%, #E0A93C 50%, #A8741D 100%)",
            backgroundClip: "text",
            color: "transparent",
          },
        },
        "KK"
      )
    ),
    { width: size, height: size, fonts: [{ name: "Bebas Neue", data: bebas, weight: 400, style: "normal" }] }
  );
}

const out = [
  ["apple-touch-icon.png", 180, { rounded: false }], // iOS rounds the corners itself
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["icon-maskable-512.png", 512, { maskable: true }],
  ["favicon-48.png", 48, {}], // Google shows search-result favicons at multiples of 48px
];
for (const [name, size, opts] of out) {
  const buf = Buffer.from(await monogram(size, opts).arrayBuffer());
  await writeFile(`public/icons/${name}`, buf);
  console.log(name, size, buf.length, "bytes");
}
