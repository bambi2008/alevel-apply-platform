import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), lookup: vi.fn(), find: vi.fn(), create: vi.fn(), limit: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: { questionFeedback: { findMany: m.find, createMany: m.create } } }));
vi.mock("@/lib/tests/lookup", () => ({ getQuestionById: m.lookup }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimitKey: (...parts: string[]) => parts.join(":"), consumePersistentRateLimit: m.limit }));
import { GET, POST } from "../../app/api/question-feedback/route";
const question = { id: "test-q", testId: "tmua", topicId: "tmua-algebra", type: "mcq", options: [{ key: "A", text: "1" }, { key: "B", text: "2" }], question: "Find x", answer: "A", marks: 1, difficulty: 1, solution: "x=1" };
const payload = { questionId: "test-q", testId: "tmua", kind: "ERROR" };
const request = (body: unknown = payload, origin = "http://localhost:3100") => new NextRequest("http://localhost:3100/api/question-feedback", { method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify(body) });
beforeEach(() => { vi.resetAllMocks(); m.auth.mockResolvedValue({ user: { id: "student-1" } }); m.lookup.mockReturnValue(question); m.find.mockResolvedValue([{ kind: "ERROR" }]); m.create.mockResolvedValue({ count: 1 }); m.limit.mockResolvedValue({ allowed: true, retryAfterSeconds: 60 }); });
describe("authenticated idempotent question feedback", () => {
  it("rejects both anonymous reads and writes before touching data", async () => {
    m.auth.mockResolvedValue(null);
    expect((await POST(request())).status).toBe(401);
    expect((await GET(new NextRequest("http://localhost:3100/api/question-feedback?testId=tmua&questionId=test-q"))).status).toBe(401);
    expect(m.create).not.toHaveBeenCalled(); expect(m.find).not.toHaveBeenCalled();
  });
  it("reads only the authenticated user's existing feedback", async () => {
    const response = await GET(new NextRequest("http://localhost:3100/api/question-feedback?testId=tmua&questionId=test-q&userId=other"));
    expect(await response.json()).toEqual({ kinds: ["ERROR"] });
    expect(m.find.mock.calls[0][0].where.userId).toBe("student-1");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("derives exam/topic/content identity and ignores a spoofed user or topic", async () => {
    expect((await POST(request({ ...payload, userId: "victim", topicId: "wrong" }))).status).toBe(200);
    expect(m.create.mock.calls[0][0]).toMatchObject({ skipDuplicates: true, data: [{ userId: "student-1", testId: "tmua", topicId: "tmua-algebra", kind: "ERROR" }] });
    expect(m.create.mock.calls[0][0].data[0].questionKey).toMatch(/^[a-f0-9]{64}$/);
  });
  it("treats a duplicate as success without updating its retention timestamp", async () => {
    m.create.mockResolvedValue({ count: 0 });
    expect(await (await POST(request())).json()).toEqual({ recorded: true, kind: "ERROR" });
    expect(m.create.mock.calls[0][0].data[0]).not.toHaveProperty("createdAt");
  });
  it.each([null, [], { ...payload, kind: "arbitrary" }, { ...payload, testId: "esat" }])("rejects invalid or cross-exam data %j", async body => {
    expect((await POST(request(body))).status).toBe(400); expect(m.create).not.toHaveBeenCalled();
  });
  it("rejects unknown questions", async () => { m.lookup.mockReturnValue(undefined); expect((await POST(request())).status).toBe(400); });
  it("rejects cross-site feedback and oversized bodies", async () => {
    expect((await POST(request(payload, "https://evil.example"))).status).toBe(403);
    expect((await POST(request({ ...payload, padding: "x".repeat(1025) }))).status).toBe(413);
    expect(m.create).not.toHaveBeenCalled();
  });
  it("rate-limits authenticated writes", async () => { m.limit.mockResolvedValue({ allowed: false, retryAfterSeconds: 60 }); expect((await POST(request())).status).toBe(429); expect(m.create).not.toHaveBeenCalled(); });
});
