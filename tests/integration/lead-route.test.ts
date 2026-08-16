import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST, GET } from "@/app/api/lead/route";
import { resetLimiter } from "@/lib/server/rate-limit";

/**
 * Integration tests: the real route handler, exercised end to end.
 *
 * Only the outbound network is faked. Validation, rate limiting, honeypot,
 * de-duplication, Turnstile and response shaping all run for real, so these
 * cover the wiring between them — the part unit tests cannot reach.
 *
 * Nothing here touches the production Supabase project: `fetch` is stubbed, so a
 * test can never write to the live CRM queue.
 */

/** Captures what would have been sent upstream. */
let upstream: Array<{ url: string; body: unknown; headers: Record<string, string> }> = [];
/** Lets a test force an upstream failure. */
let upstreamStatus = 201;

const ORIGIN = "https://kishorekumarcoach.com";

function leadRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://kishorekumarcoach.com/api/lead/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: ORIGIN,
      host: "kishorekumarcoach.com",
      "x-forwarded-proto": "https",
      // A distinct IP per test keeps the rate limiter out of the way unless a
      // test is deliberately exercising it.
      "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250) + 1}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const validLead = { name: "Arjun Kumar", phone: "9884599939" };

beforeEach(() => {
  resetLimiter();
  upstream = [];
  upstreamStatus = 201;

  vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");

  // Silence structured logs so test output stays readable.
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.includes("challenges.cloudflare.com")) {
      // Turnstile: succeed only for the token literally named "good-token".
      const form = init?.body as FormData;
      const success = form?.get?.("response") === "good-token";
      return new Response(JSON.stringify({ success }), { status: 200 });
    }

    upstream.push({
      url,
      body: JSON.parse(String(init?.body ?? "{}")),
      headers: (init?.headers ?? {}) as Record<string, string>,
    });
    return new Response("", { status: upstreamStatus });
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead/ — happy path", () => {
  it("accepts a valid lead and writes it upstream once", async () => {
    const res = await POST(leadRequest({ ...validLead, magnet: "checklist" }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true, forwarded: true });
    expect(upstream).toHaveLength(1);
    expect(upstream[0].url).toContain("/rest/v1/public_leads");
  });

  it("returns a request id the visitor can quote in support", async () => {
    const res = await POST(leadRequest(validLead));
    expect(res.headers.get("x-request-id")).toMatch(/.{8,}/);
  });

  it("never lets a lead response be cached", async () => {
    const res = await POST(leadRequest(validLead));
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("sends only allowlisted, server-owned fields upstream", async () => {
    await POST(
      leadRequest({
        ...validLead,
        source: "attacker.example",
        stage: "Won",
        secretField: "should not appear",
      })
    );

    const payload = (upstream[0].body as { payload: Record<string, unknown> }).payload;
    expect(payload.source).toBe("kishorekumarcoach.com");
    expect(payload.stage).toBe("New Lead");
    expect(payload).not.toHaveProperty("secretField");
  });
});

describe("POST /api/lead/ — rejections", () => {
  it("rejects a non-JSON content type with 415", async () => {
    const res = await POST(leadRequest(validLead, { "content-type": "text/plain" }));
    expect(res.status).toBe(415);
    expect(upstream).toHaveLength(0);
  });

  it("rejects a foreign origin with 403", async () => {
    const res = await POST(leadRequest(validLead, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
    expect(upstream).toHaveLength(0);
  });

  it("rejects an invalid lead with 422 and writes nothing", async () => {
    const res = await POST(leadRequest({ name: "A" }));
    expect(res.status).toBe(422);
    expect(upstream).toHaveLength(0);
  });

  it("never leaks internals in an error body", async () => {
    const res = await POST(leadRequest({ name: "A" }));
    const text = JSON.stringify(await res.json());
    expect(text).not.toMatch(/supabase|postgres|public_leads|at .*\.ts:|stack/i);
  });

  it("answers 405 with an Allow header for GET", async () => {
    const res = GET();
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });
});

describe("POST /api/lead/ — honeypot", () => {
  it("silently discards a submission that fills the hidden field", async () => {
    const res = await POST(leadRequest({ ...validLead, company: "Spam Corp" }));

    // 200, deliberately: telling a bot which check caught it teaches it to
    // avoid the check.
    expect(res.status).toBe(200);
    expect(upstream).toHaveLength(0);
  });
});

describe("POST /api/lead/ — duplicate suppression", () => {
  it("writes an identical resubmission only once", async () => {
    const ip = { "x-forwarded-for": "10.9.9.9" };
    const body = { ...validLead, magnet: "checklist" };

    const first = await POST(leadRequest(body, ip));
    const second = await POST(leadRequest(body, ip));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    await expect(second.json()).resolves.toMatchObject({ duplicate: true });
    expect(upstream).toHaveLength(1);
  });

  it("treats a different campaign as a genuine second lead", async () => {
    const ip = { "x-forwarded-for": "10.9.9.8" };
    await POST(leadRequest({ ...validLead, magnet: "checklist" }, ip));
    await POST(leadRequest({ ...validLead, magnet: "workshop" }, ip));
    expect(upstream).toHaveLength(2);
  });
});

describe("POST /api/lead/ — rate limiting", () => {
  it("caps accepted leads per IP and sets Retry-After", async () => {
    const ip = { "x-forwarded-for": "10.5.5.5" };

    for (let i = 0; i < 5; i++) {
      const ok = await POST(leadRequest({ name: `Person ${i}`, phone: `900000000${i}` }, ip));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(leadRequest({ name: "Person 6", phone: "9000000006" }, ip));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(upstream).toHaveLength(5);
  });

  it("does NOT count failed validations against the submit budget", async () => {
    // Regression guard: a single-tier limiter locked a visitor out for ten
    // minutes after five typos, punishing exactly the person the form is for.
    const ip = { "x-forwarded-for": "10.6.6.6" };

    for (let i = 0; i < 10; i++) {
      const bad = await POST(leadRequest({ name: "Arjun Kumar", phone: "12" }, ip));
      expect(bad.status).toBe(422);
    }

    const good = await POST(leadRequest(validLead, ip));
    expect(good.status).toBe(200);
  });
});

describe("POST /api/lead/ — Turnstile", () => {
  it("is not enforced while no secret is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const res = await POST(leadRequest(validLead));
    expect(res.status).toBe(200);
  });

  it("rejects a missing token once a secret is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const res = await POST(leadRequest(validLead));
    expect(res.status).toBe(403);
    expect(upstream).toHaveLength(0);
  });

  it("rejects a token Cloudflare does not verify", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const res = await POST(leadRequest({ ...validLead, turnstileToken: "forged" }));
    expect(res.status).toBe(403);
    expect(upstream).toHaveLength(0);
  });

  it("accepts a verified token", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const res = await POST(leadRequest({ ...validLead, turnstileToken: "good-token" }));
    expect(res.status).toBe(200);
    expect(upstream).toHaveLength(1);
  });

  it("still accepts the lead when Cloudflare itself is unreachable", async () => {
    // Failing a real visitor for someone else's outage loses a real lead; the
    // rate limiter and honeypot still apply.
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes("challenges.cloudflare.com")) {
        throw new Error("network down");
      }
      upstream.push({ url: String(input), body: JSON.parse(String(init?.body ?? "{}")), headers: {} });
      return new Response("", { status: 201 });
    });

    const res = await POST(leadRequest({ ...validLead, turnstileToken: "anything" }));
    expect(res.status).toBe(200);
    expect(upstream).toHaveLength(1);
  });
});

describe("POST /api/lead/ — upstream failure", () => {
  it("answers 502 when the CRM store rejects the write", async () => {
    upstreamStatus = 500;
    const res = await POST(leadRequest(validLead));

    // 502, not 500: this server worked, the upstream did not. The client shows
    // its WhatsApp fallback on any non-2xx, so the lead still reaches Kishore.
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: "storage-unavailable" });
  });

  it("answers 502 when the CRM store is unreachable", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new Error("connection refused");
    });
    const res = await POST(leadRequest(validLead));
    expect(res.status).toBe(502);
  });
});
