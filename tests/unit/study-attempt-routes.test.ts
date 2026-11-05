import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({ auth: vi.fn(), limit: vi.fn(), start: vi.fn(), read: vi.fn(), submit: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/security/rate-limit", () => ({ consumePersistentRateLimit: m.limit, rateLimitKey: (scope: string, userId: string) => `${scope}:${userId}` }));
vi.mock("@/lib/tests/study-attempts", async importOriginal => ({ ...await importOriginal<object>(), startStudyAttempt: m.start, readStudyAttempt: m.read, submitStudyAttempt: m.submit }));
import { POST as start } from "../../app/api/study-attempts/route";
import { GET as read } from "../../app/api/study-attempts/[attemptId]/route";
import { POST as submit } from "../../app/api/study-attempts/[attemptId]/answers/route";
import { StudyAccessError } from "../../lib/tests/study-attempts";

const context = { params: Promise.resolve({ attemptId: "owned-attempt" }) };
const selection = { mode: "practice", testId: "tmua", questionIds: ["released-q"], locale: "en" };
function request(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://example.test/api/study-attempts", { method: "POST", headers: { "content-type": "application/json", origin: "https://example.test", ...headers }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.resetAllMocks(); vi.stubEnv("APP_ORIGIN", "https://example.test");
  m.auth.mockResolvedValue({ user: { id: "authenticated-owner" } });
  m.limit.mockResolvedValue({ allowed: true });
  m.start.mockResolvedValue({ id: "owned-attempt", questions: [] });
  m.read.mockResolvedValue({ id: "owned-attempt", reviewed: [] });
  m.submit.mockResolvedValue({ id: "owned-attempt", reviewed: [] });
});
afterEach(() => vi.unstubAllEnvs());

describe("authenticated study delivery HTTP boundaries", () => {
  it("rejects all anonymous delivery and submission routes without reading data", async () => {
    m.auth.mockResolvedValue(null);
    for (const response of [await start(request(selection)), await read(request(null), context), await submit(request({ complete: true, answers: [] }), context)]) {
      expect(response.status).toBe(401);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
    expect(m.start).not.toHaveBeenCalled(); expect(m.read).not.toHaveBeenCalled(); expect(m.submit).not.toHaveBeenCalled();
  });
  it.each([{ origin: "https://other.test" }, { origin: "" }, { "sec-fetch-site": "cross-site" }])("rejects cross-origin or missing-origin writes", async headers => {
    expect((await start(request(selection, Object.fromEntries(Object.entries(headers).filter((entry): entry is [string, string] => typeof entry[1] === "string"))))).status).toBe(403);
    expect(m.start).not.toHaveBeenCalled();
  });
  it("does not accept caller-supplied ownership, grades or reference answers", async () => {
    expect((await start(request({ ...selection, userId: "someone-else" }))).status).toBe(400);
    expect((await submit(request({ complete: true, answers: [{ questionId: "q", earned: 99, solution: "invented" }] }), context)).status).toBe(400);
    expect(m.start).not.toHaveBeenCalled(); expect(m.submit).not.toHaveBeenCalled();
  });
  it("bounds streamed bytes independently of any declared Content-Length", async () => {
    expect((await start(request("x".repeat(9000)))).status).toBe(413);
    expect(m.start).not.toHaveBeenCalled();
  });
  it("uses the authenticated principal and prevents shared caching", async () => {
    const response = await start(request(selection));
    expect(response.status).toBe(201);
    expect(m.start).toHaveBeenCalledWith("authenticated-owner", selection);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await read(request(null), context);
    expect(m.read).toHaveBeenCalledWith("authenticated-owner", "owned-attempt");
  });
  it("propagates expiry as a membership prompt, not a successful empty paper", async () => {
    m.start.mockRejectedValue(new StudyAccessError("membership_required", 402));
    const response = await start(request(selection));
    expect(response.status).toBe(402);
    expect(await response.json()).toEqual({ error: "membership_required" });
  });
  it("limits repeated starts before creating an attempt", async () => {
    m.limit.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });
    const response = await start(request(selection));
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("30");
    expect(m.start).not.toHaveBeenCalled();
  });
});
