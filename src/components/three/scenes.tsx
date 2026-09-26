"use client";

import { ThreeScene } from "./scene-host";
import { heroGalaxy, risingEmbers } from "./particle-field";
import { Sparkles } from "@/components/ui/sparkles";

/**
 * Ready-made scenes for server components.
 *
 * A server component cannot hand a function to a client component — props
 * crossing that boundary must be serialisable — so <ThreeScene factory={…}>
 * can only be written inside client code. These wrappers are that client code;
 * Hero and FinalCTA (server components) render them like any other element.
 */

/** Hero backdrop: desktop only, after load + idle; 2D sparkles otherwise. */
export function HeroGalaxy({ className }: { className?: string }) {
  return (
    <ThreeScene
      className={className}
      factory={heroGalaxy}
      loadWhen="idle"
      finePointerOnly
      fallback={<Sparkles />}
    />
  );
}

/** Closing CTA: rising embers; sparkles where WebGL is unavailable. */
export function EmberField({ className }: { className?: string }) {
  return (
    <ThreeScene
      className={className}
      factory={risingEmbers}
      fallback={<Sparkles density={0.00028} maxParticles={110} />}
    />
  );
}
