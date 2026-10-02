import Link from "next/link";
import { Clock, Play } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import type { BlogPost } from "@/content/blog";

/**
 * Article card, shared by the blog index, the topic hubs and "Keep reading".
 *
 * Two shapes from one markup. From md up it is the tall card: 16:9 photo,
 * category, title, excerpt. On a phone it is a compact row — square thumbnail
 * beside the title — because forty-odd tall cards stacked into nearly thirty
 * screens of scrolling. The excerpt is hidden there (still in the HTML), and
 * the thumbnail asks for the smallest image variant.
 */
export function PostCard({
  post,
  headingLevel = "h2",
}: {
  post: BlogPost;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <TiltCard className="h-full" max={6} radiusClassName="rounded-2xl md:rounded-3xl">
      <Link
        href={`/blog/${post.slug}/`}
        className="glow-card group flex h-full flex-row overflow-hidden rounded-2xl glass transition-colors hover:border-gold-400/25 md:flex-col md:rounded-3xl"
      >
        <div className="relative w-28 shrink-0 overflow-hidden sm:w-36 md:aspect-[16/9] md:w-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            srcSet={post.photo?.srcSet}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 144px"
            alt={post.imageAlt}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            width={1672}
            height={941}
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-ink/90 to-transparent md:block" />
          {post.video && (
            <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-full bg-ink/70 text-gold-200 backdrop-blur md:left-3 md:top-3 md:size-8">
              <Play className="size-3.5" aria-label="Has video" />
            </span>
          )}
        </div>

        <div className="flex min-w-0 grow flex-col p-4 md:p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
            {post.category}
          </span>
          <Heading className="mt-1.5 text-balance font-display text-base uppercase leading-tight md:mt-2 md:text-lg">
            {post.title}
          </Heading>
          <p className="mt-2 hidden grow text-sm leading-relaxed text-foreground/65 md:block">
            {post.excerpt}
          </p>
          <span className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-foreground/45 md:pt-4">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readingMinutes} min read
            <span
              aria-hidden="true"
              className="ml-auto translate-x-[-4px] text-gold-200 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              Read →
            </span>
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
