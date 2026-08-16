import { afterEach, describe, expect, it, vi } from "vitest";
import { describeLead, log, newRequestId } from "@/lib/server/log";

/**
 * These tests exist because of a privacy requirement, not a functional one.
 *
 * The lead form processes personal data for a business that trains minors.
 * Anything written to a log outlives the request and is readable by anyone with
 * server access, so "we redact PII" has to be enforced rather than intended.
 */

function captureLog(fn: () => void): string {
  const spy = vi.spyOn(console, "log").mockImplementation(() => {});
  fn();
  const out = spy.mock.calls.map((c) => String(c[0])).join("\n");
  spy.mockRestore();
  return out;
}

afterEach(() => vi.restoreAllMocks());

describe("log", () => {
  it("emits one parseable JSON object per line", () => {
    const out = captureLog(() => log("info", "test.event", { requestId: "abc", status: 200 }));
    const parsed = JSON.parse(out);
    expect(parsed.event).toBe("test.event");
    expect(parsed.level).toBe("info");
    expect(parsed.requestId).toBe("abc");
    expect(parsed.status).toBe(200);
    expect(typeof parsed.t).toBe("string");
  });

  it.each([
    "name", "phone", "email", "whatsapp", "goal", "sport",
    "mainProblem", "payload", "token", "turnstileToken", "apikey",
    "authorization", "secret", "key",
  ])("redacts %s even when a caller passes it", (field) => {
    const out = captureLog(() =>
      log("info", "test.event", { [field]: "Arjun 9884599939 arjun@example.com" })
    );
    expect(out).not.toContain("Arjun");
    expect(out).not.toContain("9884599939");
    expect(out).not.toContain("arjun@example.com");
    expect(JSON.parse(out)[field]).toBe("[redacted]");
  });

  it("redacts regardless of case, so PhOnE cannot slip through", () => {
    const out = captureLog(() => log("info", "e", { PhOnE: "9884599939" }));
    expect(out).not.toContain("9884599939");
  });

  it("keeps non-sensitive operational fields intact", () => {
    const out = captureLog(() =>
      log("info", "lead.accepted", { requestId: "r1", ms: 42, leadType: "Parent" })
    );
    const parsed = JSON.parse(out);
    expect(parsed.ms).toBe(42);
    expect(parsed.leadType).toBe("Parent");
  });
});

describe("describeLead", () => {
  it("reports shape without disclosing any value", () => {
    const d = describeLead({
      name: "Arjun Kumar",
      phone: "9884599939",
      email: "arjun@example.com",
    });

    expect(d.hasName).toBe(true);
    expect(d.hasPhone).toBe(true);
    expect(d.nameLen).toBe(11);

    const serialised = JSON.stringify(d);
    expect(serialised).not.toContain("Arjun");
    expect(serialised).not.toContain("9884599939");
    expect(serialised).not.toContain("arjun@example.com");
  });

  it("reports absent fields as absent", () => {
    const d = describeLead({ name: "Arjun" });
    expect(d.hasPhone).toBe(false);
    expect(d.hasEmail).toBe(false);
  });
});

describe("newRequestId", () => {
  it("returns distinct non-empty ids", () => {
    const ids = new Set(Array.from({ length: 200 }, newRequestId));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id.length).toBeGreaterThan(8);
  });
});
