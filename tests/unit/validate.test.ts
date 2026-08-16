import { describe, expect, it } from "vitest";
import { leadFingerprint, validateLead } from "@/lib/server/validate";

/**
 * Unit tests for the trust boundary.
 *
 * These are the highest-value tests in the project: `validate.ts` is the single
 * place that decides what a stranger on the internet is allowed to write into
 * the CRM queue. A regression here is not a broken page, it is a corrupted lead
 * database.
 */

const ORIGINS = ["https://kishorekumarcoach.com"];
const ctx = { source: "kishorekumarcoach.com", siteOrigins: ORIGINS };

/** Minimal lead that should always pass, so each test varies exactly one thing. */
const valid = { name: "Arjun Kumar", phone: "+91 98845 99939" };

describe("validateLead — acceptance", () => {
  it("accepts a name with a phone", () => {
    const r = validateLead({ ...valid }, ctx);
    expect(r.ok).toBe(true);
  });

  it("accepts a name with only an email", () => {
    const r = validateLead({ name: "Priya S", email: "priya@example.com" }, ctx);
    expect(r.ok).toBe(true);
  });

  it("normalises whitespace and email casing", () => {
    const r = validateLead(
      { name: "  Arjun   Kumar  ", phone: "9884599939", email: " ARJUN@Example.COM " },
      ctx
    );
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.name).toBe("Arjun Kumar");
    expect(r.lead.email).toBe("arjun@example.com");
  });

  it("copies phone into whatsapp — the form only asks once", () => {
    const r = validateLead({ ...valid }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.whatsapp).toBe(r.lead.phone);
  });
});

describe("validateLead — rejection", () => {
  it.each([
    ["no name", { phone: "9884599939" }, "name"],
    ["one-character name", { name: "A", phone: "9884599939" }, "name"],
    ["no contact method", { name: "Arjun Kumar" }, "contact"],
    ["phone too short", { name: "Arjun Kumar", phone: "123" }, "phone"],
    ["phone with letters", { name: "Arjun Kumar", phone: "call-me-maybe" }, "phone"],
    ["malformed email", { name: "Arjun Kumar", email: "not-an-email" }, "email"],
  ])("rejects %s", (_label, input, expectedError) => {
    const r = validateLead(input, ctx);
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("expected invalid");
    expect(r.errors).toContain(expectedError);
  });
});

describe("validateLead — server-owned fields cannot be forged", () => {
  it("overrides a spoofed source", () => {
    const r = validateLead({ ...valid, source: "attacker-site.com" }, ctx);
    if (!r.ok) throw new Error("expected valid");
    // `source` decides CRM routing and per-site reporting. A client-chosen value
    // would let anyone attribute their leads to the other site.
    expect(r.lead.source).toBe("kishorekumarcoach.com");
  });

  it("overrides spoofed pipeline fields", () => {
    const r = validateLead({ ...valid, stage: "Won", status: "Paid" }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.stage).toBe("New Lead");
    expect(r.lead.status).toBe("Active");
  });

  it("sets dateAdded server-side, ignoring any supplied value", () => {
    const r = validateLead({ ...valid, dateAdded: "1999-01-01" }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.dateAdded).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe("validateLead — allowlist", () => {
  it("drops unknown fields entirely", () => {
    const r = validateLead(
      { ...valid, evil: "x", __proto__: "y", nested: { a: 1 }, huge: "z".repeat(5000) },
      ctx
    );
    if (!r.ok) throw new Error("expected valid");
    expect(Object.keys(r.lead).sort()).toEqual(
      [
        "athleteAge", "campaign", "dateAdded", "email", "goal", "landingPage",
        "leadType", "mainProblem", "name", "phone", "source", "sport",
        "stage", "status", "whatsapp",
      ].sort()
    );
  });

  it("caps field length", () => {
    const r = validateLead({ name: "A".repeat(500), phone: "9884599939" }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.name.length).toBe(100);
  });

  it("strips control characters that could break a log line or CSV export", () => {
    // A newline here would forge a second entry in a structured log; a NUL or
    // an ANSI escape can corrupt a CSV export of the CRM.
    const r = validateLead(
      { name: "Arjun \u001B[31m\u0000\nKumar", phone: "9884599939" },
      ctx
    );
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.name).toBe("Arjun [31m Kumar");
    // eslint-disable-next-line no-control-regex
    expect(r.lead.name).not.toMatch(/[\u0000-\u001F\u007F]/);
  });
});

describe("validateLead — role mapping", () => {
  it.each([
    ["parent", "Parent"],
    ["coach / institution", "Coach"],
    ["athlete / student", "Athlete"],
    ["PARENT", "Parent"],
    ["something unrecognised", "Athlete"],
    [undefined, "Athlete"],
  ])("maps %s to %s", (who, expected) => {
    const r = validateLead({ ...valid, who }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.leadType).toBe(expected);
  });
});

describe("validateLead — age", () => {
  it.each([
    ["16", "16"],
    ["7", "7"],
    ["999", ""],   // out of range
    ["abc", ""],   // not a number
    ["", ""],
  ])("normalises age %s to %s", (age, expected) => {
    const r = validateLead({ ...valid, age }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.athleteAge).toBe(expected);
  });

  it("does not reject the whole lead over a junk age", () => {
    expect(validateLead({ ...valid, age: "not a number" }, ctx).ok).toBe(true);
  });
});

describe("validateLead — landingPage", () => {
  it("keeps a same-origin URL and strips its query", () => {
    const r = validateLead(
      { ...valid, landingPage: "https://kishorekumarcoach.com/programs/?utm_source=ads" },
      ctx
    );
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.landingPage).toBe("https://kishorekumarcoach.com/programs/");
  });

  it("drops a foreign origin — it would render as a link in the CRM", () => {
    const r = validateLead({ ...valid, landingPage: "https://evil.example/phish" }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.landingPage).toBe("");
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "not a url at all",
  ])("drops unsafe value %s", (landingPage) => {
    const r = validateLead({ ...valid, landingPage }, ctx);
    if (!r.ok) throw new Error("expected valid");
    expect(r.lead.landingPage).toBe("");
  });
});

describe("leadFingerprint", () => {
  it("treats a repeat of the same request as identical", () => {
    const a = validateLead({ ...valid, magnet: "checklist" }, ctx);
    const b = validateLead({ ...valid, magnet: "checklist" }, ctx);
    if (!a.ok || !b.ok) throw new Error("expected valid");
    expect(leadFingerprint(a.lead)).toBe(leadFingerprint(b.lead));
  });

  it("treats a different campaign as a genuinely different lead", () => {
    const a = validateLead({ ...valid, magnet: "checklist" }, ctx);
    const b = validateLead({ ...valid, magnet: "workshop" }, ctx);
    if (!a.ok || !b.ok) throw new Error("expected valid");
    expect(leadFingerprint(a.lead)).not.toBe(leadFingerprint(b.lead));
  });
});
