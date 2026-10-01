import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Share cards — the image a page shows when it is posted to WhatsApp,
 * LinkedIn, X or Facebook, and the large image Google Discover and AI answer
 * engines can pull for it.
 *
 * Every page used to share the same "Strong Mind" banner — a WebP (which some
 * previewers will not render) declared as 1200×630 when it is 1672×941, and
 * on five posts a vertical portrait declared as landscape. Now each page gets
 * its own card: its title, its section, Kishore's name and face, rendered at
 * exactly 1200×630 as PNG.
 *
 * Rendered at BUILD time — every route using this is static — so the server
 * never draws an image on request. Fonts come from src/assets/fonts (WOFF:
 * the renderer cannot read WOFF2); the portrait is the original JPEG.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const GOLD = "#E0A93C";
const GOLD_PALE = "#F0CF85";
const INK = "#08080a";

let assets: Promise<{
  bebas: Buffer;
  interMedium: Buffer;
  interBold: Buffer;
  portrait: string;
}> | null = null;

/** Read once per build worker, not once per card. */
function loadAssets() {
  if (!assets) {
    const root = process.cwd();
    const font = (f: string) => readFile(path.join(root, "src/assets/fonts", f));
    assets = Promise.all([
      font("BebasNeue-Regular.woff"),
      font("Inter-Medium.woff"),
      font("Inter-Bold.woff"),
      readFile(path.join(root, "public/images/portrait.jpg")),
    ]).then(([bebas, interMedium, interBold, jpg]) => ({
      bebas,
      interMedium,
      interBold,
      portrait: `data:image/jpeg;base64,${jpg.toString("base64")}`,
    }));
  }
  return assets;
}

/** Long titles step down in size so they never run off the card. */
function titleSize(title: string) {
  const n = title.length;
  if (n <= 34) return 104;
  if (n <= 52) return 88;
  if (n <= 72) return 74;
  return 62;
}

export async function shareCard({
  eyebrow,
  title,
  footer = "kishorekumarcoach.com",
}: {
  /** Small gold line above the title — the section or category. */
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  const a = await loadAssets();
  const size = titleSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: INK,
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(224,169,60,0.22), transparent 55%), radial-gradient(circle at 92% 90%, rgba(59,130,246,0.16), transparent 50%)",
          fontFamily: "Inter",
          color: "#F4F1EA",
        }}
      >
        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "60px 0 54px 68px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 3, backgroundColor: GOLD }} />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: GOLD_PALE,
                }}
              >
                {eyebrow}
              </div>
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: "Bebas Neue",
                fontSize: size,
                lineHeight: 0.98,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: "#FFFFFF",
                // A hard bronze edge under the type, echoing the site's
                // extruded headings.
                textShadow: "0 4px 0 #6b4a12",
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#FFFFFF" }}>
              Kishore Kumar
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 500, color: "rgba(244,241,234,0.72)" }}>
              Sports Psychologist · Martial Arts Coach · Chennai
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundImage: "linear-gradient(135deg, #E6CF9C, #CF9C3A 48%, #8E5F18)",
                  fontFamily: "Bebas Neue",
                  fontSize: 22,
                  color: INK,
                }}
              >
                KK
              </div>
              <div style={{ display: "flex", fontSize: 20, fontWeight: 500, color: GOLD_PALE }}>{footer}</div>
            </div>
          </div>
        </div>

        {/* Portrait, fading into the card on its left edge */}
        <div style={{ display: "flex", position: "relative", width: 440, height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.portrait}
            alt=""
            width={440}
            height={630}
            style={{ width: 440, height: 630, objectFit: "cover", objectPosition: "50% 12%" }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 180,
              height: 630,
              backgroundImage: `linear-gradient(90deg, ${INK}, rgba(8,8,10,0))`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 440,
              height: 160,
              backgroundImage: `linear-gradient(0deg, ${INK}, rgba(8,8,10,0))`,
            }}
          />
        </div>

        {/* Gold rule along the bottom edge */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 6,
            backgroundImage: `linear-gradient(90deg, ${GOLD}, rgba(224,169,60,0.15))`,
          }}
        />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bebas Neue", data: a.bebas, weight: 400, style: "normal" },
        { name: "Inter", data: a.interMedium, weight: 500, style: "normal" },
        { name: "Inter", data: a.interBold, weight: 700, style: "normal" },
      ],
    }
  );
}
