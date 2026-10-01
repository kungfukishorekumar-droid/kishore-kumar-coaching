import { SEO } from "@/lib/seo";
import { PHOTOS, absolute } from "@/lib/media";

/**
 * Entity references for structured data on pages OTHER than the homepage.
 *
 * The homepage defines Kishore (Person, #kishore) and the business
 * (#organization) in full. Other pages used to point at them by @id alone —
 * but Google does not resolve an @id against another page, so on every
 * article the author had no name and the publisher no name or logo. Google's
 * Article guidelines require author.name, and Course rich results require
 * provider.name. These carry the same @id (so engines that do merge entities
 * still see one identity) plus the properties each page needs on its own.
 */

export const authorRef = () => ({
  "@type": "Person",
  "@id": `${SEO.siteUrl}/#kishore`,
  name: SEO.founder,
  url: `${SEO.siteUrl}/about/`,
  jobTitle: SEO.role,
  image: absolute(PHOTOS.portrait.full.src),
  sameAs: SEO.sameAs,
});

export const publisherRef = () => ({
  "@type": "Organization",
  "@id": `${SEO.siteUrl}/#organization`,
  name: SEO.brand,
  url: `${SEO.siteUrl}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SEO.siteUrl}/icons/icon-512.png`,
    width: 512,
    height: 512,
  },
});
