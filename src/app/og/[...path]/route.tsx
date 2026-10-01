import { notFound } from "next/navigation";
import sharp from "sharp";
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
  // mozjpeg at q82: indistinguishable from the PNG at preview sizes, ~5× smaller.
  const jpg = await sharp(png).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();

  return new Response(new Uint8Array(jpg), {
    headers: {
      "Content-Type": "image/jpeg",
      // A card only changes when its page's title does: keep it a day, then
      // revalidate in the background.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
