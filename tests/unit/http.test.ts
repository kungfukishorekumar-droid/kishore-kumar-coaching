import { describe, expect, it } from "vitest";
import { clientIp, originAllowed, publicOrigin, readJsonBody } from "@/lib/server/http";

const ALLOWED = ["https://kishorekumarcoach.com", "https://www.kishorekumarcoach.com"];

function req(url: string, headers: Record<string, string> = {}, init: RequestInit = {}) {
  return new Request(url, { headers, ...init });
}

describe("clientIp", () => {
  it("takes the RIGHTMOST x-forwarded-for entry", () => {
    // Earlier entries are client-supplied and forgeable; only the last was
    // observed by our own proxy.
    expect(
      clientIp(req("https://x.test/", { "x-forwarded-for": "1.1.1.1, 2.2.2.2, 3.3.3.3" }))
    ).toBe("3.3.3.3");
  });

  it("falls back to x-real-ip, then to a sentinel", () => {
    expect(clientIp(req("https://x.test/", { "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientIp(req("https://x.test/"))).toBe("unknown");
  });
});

describe("originAllowed", () => {
  it("accepts a configured origin", () => {
    expect(
      originAllowed(req("https://x.test/", { origin: "https://kishorekumarcoach.com" }), ALLOWED)
    ).toBe(true);
  });

  it("rejects a foreign origin", () => {
    expect(
      originAllowed(req("https://x.test/", { origin: "https://evil.example" }), ALLOWED)
    ).toBe(false);
  });

  it("allows a missing Origin header", () => {
    // Browsers omit Origin on some same-origin form posts. Rejecting those
    // would break real submissions to stop an attack that requires the header.
    expect(originAllowed(req("https://x.test/"), ALLOWED)).toBe(true);
  });

  it("accepts the request's own origin even when unconfigured", () => {
    expect(
      originAllowed(req("https://preview.test/api", { origin: "https://preview.test" }), ALLOWED)
    ).toBe(true);
  });
});

describe("publicOrigin", () => {
  it("prefers forwarded headers over the internal request URL", () => {
    // Regression guard: Next normalises req.url to its own listener, so relying
    // on it reported `localhost` in production behind Hostinger's proxy and
    // silently dropped every landingPage.
    const r = req("http://localhost:3000/api/lead/", {
      host: "internal:3000",
      "x-forwarded-host": "kishorekumarcoach.com",
      "x-forwarded-proto": "https",
    });
    expect(publicOrigin(r)).toBe("https://kishorekumarcoach.com");
  });

  it("falls back to the Host header, assuming https in production", () => {
    expect(publicOrigin(req("http://localhost:3000/x", { host: "kishorekumarcoach.com" })))
      .toBe("https://kishorekumarcoach.com");
  });

  it("assumes http for local hosts so dev still matches", () => {
    expect(publicOrigin(req("http://localhost:3000/x", { host: "localhost:3000" })))
      .toBe("http://localhost:3000");
  });
});

describe("readJsonBody", () => {
  const post = (body: string, headers: Record<string, string> = {}) =>
    new Request("https://x.test/", { method: "POST", body, headers });

  it("parses a JSON object", async () => {
    const r = await readJsonBody(post('{"name":"Arjun"}'), 1024);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe("Arjun");
  });

  it("rejects malformed JSON", async () => {
    const r = await readJsonBody(post("{oops"), 1024);
    expect(r).toEqual({ ok: false, code: "bad-json" });
  });

  it.each(['"a string"', "[1,2,3]", "null", "42"])(
    "rejects non-object body %s",
    async (body) => {
      // Indexing a string or array for `.name` would throw and turn a bad
      // request into a 500.
      const r = await readJsonBody(post(body), 1024);
      expect(r).toEqual({ ok: false, code: "bad-shape" });
    }
  );

  it("rejects a body over the cap", async () => {
    const big = JSON.stringify({ name: "x".repeat(2000) });
    const r = await readJsonBody(post(big), 1024);
    expect(r).toEqual({ ok: false, code: "too-large" });
  });

  it("rejects on a lying Content-Length before parsing", async () => {
    const r = await readJsonBody(post('{"a":1}', { "content-length": "999999" }), 1024);
    expect(r).toEqual({ ok: false, code: "too-large" });
  });

  it("measures BYTES, not characters — multi-byte input cannot slip past", async () => {
    // 400 emoji is 400 characters but 1600 bytes.
    const body = JSON.stringify({ name: "🥋".repeat(400) });
    const r = await readJsonBody(post(body), 1024);
    expect(r).toEqual({ ok: false, code: "too-large" });
  });
});
