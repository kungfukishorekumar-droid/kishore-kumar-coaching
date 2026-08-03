/**
 * Ambient background — the atmosphere the whole page sits on.
 *
 * Four stacked layers, all fixed and pointer-events-none so they never
 * intercept a tap or scroll:
 *
 *   1. aurora (gold)      warm field drifting behind the upper page
 *   2. aurora (electric)  cool counterweight, opposing path and slower
 *   3. grid               hairline rules, drifting up — gives the dark
 *                         ground a sense of depth and slow movement
 *   4. grain              static film noise that stops the large flat
 *                         gradients from banding on wide displays
 *
 * Everything animates on transform only, so the compositor handles it and the
 * main thread stays free. Under prefers-reduced-motion the layers stay exactly
 * where they are — the atmosphere remains, the drift stops.
 *
 * This is a server component: no state, no effects, zero JS shipped.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — gold aurora, upper left */}
      <div
        className="absolute -left-[15%] -top-[20%] h-[65vh] w-[70vw] rounded-full opacity-60 blur-[110px] will-change-transform motion-safe:animate-aurora-a motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(207,156,58,0.20), rgba(207,156,58,0.05) 45%, transparent 70%)",
        }}
      />

      {/* 2 — electric aurora, lower right */}
      <div
        className="absolute -bottom-[25%] -right-[15%] h-[70vh] w-[65vw] rounded-full opacity-50 blur-[120px] will-change-transform motion-safe:animate-aurora-b motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.18), rgba(59,130,246,0.04) 48%, transparent 72%)",
        }}
      />

      {/* 3 — drifting hairline grid, masked so it fades out toward the edges */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-x-0 -top-[60px] h-[calc(100%+60px)] opacity-[0.35] will-change-transform motion-safe:animate-grid-drift motion-reduce:animate-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 75% 55% at 50% 40%, #000 35%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 55% at 50% 40%, #000 35%, transparent 78%)",
          }}
        />
      </div>

      {/* 4 — light rays raking down from the top-left, like a window in a
             dark training hall. Skewed repeating-linear-gradient, masked so
             they fade before they reach the content. Static: rays that sweep
             read as a loading shimmer, which is the wrong signal. */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh] opacity-[0.25]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0px, transparent 34px, rgba(230,190,110,0.055) 34px, rgba(230,190,110,0.055) 36px, transparent 36px, transparent 90px)",
          maskImage:
            "radial-gradient(ellipse 60% 100% at 22% 0%, #000 5%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 100% at 22% 0%, #000 5%, transparent 72%)",
        }}
      />

      {/* 5 — film grain (inline SVG turbulence, no network request) */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
