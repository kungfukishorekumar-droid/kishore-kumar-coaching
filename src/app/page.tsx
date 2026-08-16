// Fully prerendered at build time. The comment that used to sit here described
// 24-hour ISR, but no `revalidate` was ever exported, so nothing on this page
// refreshes between deploys — worth knowing before adding anything time-
// sensitive here (see the workshop date handling in WorkshopSection).

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { SectionDivider } from "@/components/ui/section-divider";
import { JsonLd } from "@/components/seo/JsonLd";
import { IMAGES } from "@/lib/site";

import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { QuickAnswer } from "@/components/sections/QuickAnswer";
import { Problems } from "@/components/sections/Problems";
import { Solution } from "@/components/sections/Solution";
import { PageThreeMindset } from "@/components/sections/PageThreeMindset";
import { WarriorMindMethod } from "@/components/sections/WarriorMindMethod";
import { PageSixAuthority } from "@/components/sections/PageSixAuthority";
import { SplineHeroBlock } from "@/components/sections/SplineHeroBlock";
import { Programs } from "@/components/sections/Programs";
import { WorkshopSection } from "@/components/sections/WorkshopSection";
import { LocalSEOSection } from "@/components/sections/LocalSEOSection";
import { Reviews } from "@/components/sections/Reviews";
import { Institutions } from "@/components/sections/Institutions";
import { LeadForm } from "@/components/sections/LeadForm";
import { CustomGPT } from "@/components/sections/CustomGPT";
import { LatestArticles } from "@/components/sections/LatestArticles";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      {/* Start the LCP portrait downloading before the Hero component parses.
          Next hoists this to <head>. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <link rel="preload" as="image" href={IMAGES.portrait} fetchPriority="high" />
      <JsonLd />
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      {/*
        Dividers mark the chapter breaks in the scroll-told story — between the
        problem, the method, the offer, the proof and the ask. They're placed at
        the narrative seams rather than between every section, so they stay a
        signal instead of decoration.
      */}
      <main id="main">
        {/* 1 */} <Hero />
        <Stats />
        {/* 2 */} <QuickAnswer />
        {/* 3 */} <Problems />
        <SectionDivider className="container max-w-3xl" />
        {/* 4 */} <Solution />
        {/* 5 */} <PageThreeMindset />
        <SectionDivider className="container max-w-3xl" tint="electric" />
        {/* 6 */} <WarriorMindMethod />
        {/* 7 */} <PageSixAuthority />
        {/* 3D showcase block */}
        <SplineHeroBlock />
        <SectionDivider className="container max-w-3xl" />
        {/* 8 */} <Programs />
        {/* Workshop */} <WorkshopSection />
        {/* 9 */} <LocalSEOSection />
        <SectionDivider className="container max-w-3xl" tint="electric" />
        {/* 10 */} <Reviews />
        {/* 11 */} <Institutions />
        {/* 12 */} <LeadForm />
        {/* 13 */} <CustomGPT />
        {/* Blog teaser — in-content links from the strongest page on the domain */}
        <LatestArticles />
        {/* 14 */} <FAQ />
        <SectionDivider className="container max-w-3xl" />
        {/* 15 */} <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
