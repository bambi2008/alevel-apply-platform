import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), canonical: vi.fn(), access: vi.fn(), record: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/security/ai-route", () => ({ requireAiAccess: m.access }));
vi.mock("@/lib/tests/study-attempts", () => ({ canonicalGradeRequest: m.canonical, recordCanonicalGrade: m.record, StudyAccessError: class extends Error {} }));
import { POST } from "../../app/api/grade-answer/route";
const blank = { questionId: "blank", testId: "bmo", parts: [{ label: "a", question: "Prove it.", marks: 4, solutionOutline: "State the invariant.", studentWork: " " }], fullSolution: "Use the invariant." };
function request(body: unknown = { attemptId: "owned-attempt", questionId: "blank" }) {
  return new NextRequest("http://localhost/api/grade-answer", { method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost" }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("AI_ENABLED", "false");
  m.auth.mockResolvedValue({ user: { id: "owner" } });
  m.access.mockResolvedValue({ ok: true, userId: "owner" });
  m.canonical.mockResolvedValue(blank);
});
afterEach(() => vi.unstubAllEnvs());

describe("canonical grading API", () => {
  it("grades a committed blank deterministically after ownership checks, without AI", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ totalEarned: 0, totalMax: 4, assessment: { method: "deterministic-empty", confidence: "high" } });
    expect(m.canonical).toHaveBeenCalledWith(expect.objectContaining({ userId: "owner", attemptId: "owned-attempt", questionId: "blank" }));
    expect(m.access).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("rejects anonymous blank requests before canonical data is read", async () => {
    m.auth.mockResolvedValue(null);
    expect((await POST(request())).status).toBe(401);
    expect(m.canonical).not.toHaveBeenCalled();
  });
  it("rejects malformed requests and caller-supplied mark schemes or answers", async () => {
    expect((await POST(request({ questionId: "bad", parts: [] }))).status).toBe(400);
    expect((await POST(request({ attemptId: "a", questionId: "blank", fullSolution: "invented", parts: blank.parts }))).status).toBe(400);
    expect(m.canonical).not.toHaveBeenCalled();
  });
  it("returns English deterministic feedback without a model call", async () => {
    const req = request(); req.headers.set("x-qiaoshen-locale", "en");
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(JSON.stringify(await response.json())).not.toMatch(/[\u3400-\u9fff]/u);
  });
  it("honours the disabled-AI switch even when a key exists", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "synthetic-test-key");
    m.canonical.mockResolvedValue({ ...blank, parts: [{ ...blank.parts[0], studentWork: "My working" }] });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "ai_unavailable" });
  });
});
