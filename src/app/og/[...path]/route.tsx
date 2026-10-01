import { notFound } from "next/navigation";
import { shareCard } from "@/lib/og";
import { CARDS } from "@/lib/og-cards";

/**
 * /og/<key>.jpg — every share card, rendered once at build time.
 * See src/lib/og-cards.ts for why these are .jpg URLs.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [...CARDS().keys()].map((key) => {
    const parts = key.split("/");
    parts[parts.length - 1] += ".jpg";
    return { path: parts };
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/").replace(/\.jpg$/, "");
  const card = CARDS().get(key);
  if (!card) notFound();

  const png = Buffer.from(await (await shareCard({ eyebrow: card.eyebrow, title: card.title })).arrayBuffer());

  // JPEG via sharp when it is available — mozjpeg at q82 is indistinguishable
  // from the PNG at preview sizes and ~5× smaller (48–80KB vs ~400KB).
  //
  // sharp is loaded optionally, NOT as a hard dependency: it is a native
  // module that Next only lists as optional, and a build that could not load
  // it would fail outright. If it is missing the card is served as PNG with an
  // honest Content-Type — scrapers go by the header, not the .jpg extension.
  let body: Uint8Array<ArrayBuffer> = new Uint8Array(png);
  let type = "image/png";
  try {
    const { default: sharp } = await import("sharp");
    body = new Uint8Array(
      await sharp(png).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer()
    );
    type = "image/jpeg";
  } catch {
    // keep the PNG
  }

  return new Response(body, {
    headers: {
      "Content-Type": type,
      // A card only changes when its page's title does: keep it a day, then
      // revalidate in the background.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
