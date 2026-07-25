// ISR: re-render this page on the server at most once per 24 hours.
// Content stays fresh without a full rebuild — ideal for a coaching site
// where copy changes weekly but doesn't need millisecond freshness.
export const revalidate = 86400;

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FloatingCTA } from "@/components/shared/FloatingCTA";
import { BackToTop } from "@/components/shared/BackToTop";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { JsonLd } from "@/components/seo/JsonLd";

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
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-ink text-foreground">
      <JsonLd />
      <AmbientBackground />
      <Navbar />
      <main id="main">
        {/* 1 */} <Hero />
        <Stats />
        {/* 2 */} <QuickAnswer />
        {/* 3 */} <Problems />
        {/* 4 */} <Solution />
        {/* 5 */} <PageThreeMindset />
        {/* 6 */} <WarriorMindMethod />
        {/* 7 */} <PageSixAuthority />
        {/* 3D showcase block (Spline + Spotlight) */}
        <SplineHeroBlock />
        {/* 8 */} <Programs />
        {/* Workshop */} <WorkshopSection />
        {/* 9 */} <LocalSEOSection />
        {/* 10 */} <Reviews />
        {/* 11 */} <Institutions />
        {/* 12 */} <LeadForm />
        {/* 13 */} <CustomGPT />
        {/* 14 */} <FAQ />
        {/* 15 */} <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
