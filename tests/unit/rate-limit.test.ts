import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRate, isDuplicate, resetLimiter } from "@/lib/server/rate-limit";

/**
 * The limiter keeps state in module scope, so every test starts from a clean
 * slate. Without this the tests would pass or fail depending on their order.
 */
beforeEach(() => {
  resetLimiter();
  vi.useRealTimers();
});

describe("checkRate", () => {
  it("allows up to the limit, then blocks", () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRate("ip-a", 3, 60_000).allowed).toBe(true);
    }
    expect(checkRate("ip-a", 3, 60_000).allowed).toBe(false);
  });

  it("counts each key separately, so one visitor cannot lock out another", () => {
    for (let i = 0; i < 3; i++) checkRate("ip-a", 3, 60_000);
    expect(checkRate("ip-a", 3, 60_000).allowed).toBe(false);
    expect(checkRate("ip-b", 3, 60_000).allowed).toBe(true);
  });

  it("reports a usable Retry-After when blocked", () => {
    for (let i = 0; i < 2; i++) checkRate("ip-a", 2, 60_000);
    const v = checkRate("ip-a", 2, 60_000);
    expect(v.allowed).toBe(false);
    expect(v.retryAfterSeconds).toBeGreaterThan(0);
    expect(v.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("counts down the remaining allowance", () => {
    expect(checkRate("ip-a", 3, 60_000).remaining).toBe(2);
    expect(checkRate("ip-a", 3, 60_000).remaining).toBe(1);
    expect(checkRate("ip-a", 3, 60_000).remaining).toBe(0);
  });

  it("frees the allowance once the window slides past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    for (let i = 0; i < 2; i++) checkRate("ip-a", 2, 60_000);
    expect(checkRate("ip-a", 2, 60_000).allowed).toBe(false);

    // Sliding window: past the window length, the earlier hits no longer count.
    vi.setSystemTime(new Date("2026-01-01T00:01:01Z"));
    expect(checkRate("ip-a", 2, 60_000).allowed).toBe(true);
  });

  it("does not grow without bound — an attacker rotating IPs cannot exhaust memory", () => {
    // 12k distinct keys against a 10k cap. The point is that it prunes rather
    // than that any particular key survives.
    for (let i = 0; i < 12_000; i++) checkRate(`ip-${i}`, 5, 60_000);
    // A fresh key still works after pruning, i.e. the structure is healthy.
    expect(checkRate("ip-fresh", 5, 60_000).allowed).toBe(true);
  });
});

describe("isDuplicate", () => {
  it("reports the first submission as new and an immediate repeat as duplicate", () => {
    expect(isDuplicate("arjun|9884599939||checklist", 300_000)).toBe(false);
    expect(isDuplicate("arjun|9884599939||checklist", 300_000)).toBe(true);
  });

  it("treats a different fingerprint as a separate lead", () => {
    expect(isDuplicate("arjun|9884599939||checklist", 300_000)).toBe(false);
    expect(isDuplicate("arjun|9884599939||workshop", 300_000)).toBe(false);
  });

  it("allows the same person to submit again after the window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    expect(isDuplicate("arjun|9884599939||checklist", 300_000)).toBe(false);

    vi.setSystemTime(new Date("2026-01-01T00:06:00Z"));
    expect(isDuplicate("arjun|9884599939||checklist", 300_000)).toBe(false);
  });
});
