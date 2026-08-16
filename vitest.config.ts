import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Test config for the server-side code under src/lib/server and src/app/api.
 *
 * Node environment, not jsdom: everything under test runs on the server. The
 * React components are not covered here — they have no test harness yet, and
 * pretending otherwise with a jsdom setup that nothing uses would be worse than
 * stating the gap.
 */
export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path alias in tsconfig.json so tests import modules the
    // same way the application does.
    alias: { "@": resolve(root, "src") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Each file gets a fresh module registry. The rate limiter keeps state in
    // module scope, so without isolation one file's counters would leak into
    // the next and produce order-dependent failures.
    isolate: true,
    restoreMocks: true,
    coverage: {
      include: ["src/lib/server/**", "src/app/api/**"],
      reporter: ["text", "json-summary"],
    },
  },
});
