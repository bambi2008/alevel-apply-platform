import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({ auth: vi.fn(), session: vi.fn(), answer: vi.fn(), find: vi.fn(), create: vi.fn(), limit: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: {
  examSession: { findFirst: m.session }, examAnswer: { findFirst: m.answer },
  studySessionFeedback: { findMany: m.find, createMany: m.create },
} }));
vi.mock("@/lib/tests/lookup", () => ({ getQuestionById: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimitKey: (...parts: string[]) => parts.join(":"), consumePersistentRateLimit: m.limit }));
import { GET, POST } from "../../app/api/study-feedback/[sessionId]/route";
import { POST as legacyPost } from "../../app/api/question-feedback/route";

const payload = { questionId: "question-one", kind: "ERROR", reason: "ANSWER" };
const url = "http://localhost:3100/api/study-feedback/session-one";
const ctx = { params: Promise.resolve({ sessionId: "session-one" }) };
const request = (body: unknown = payload, origin = "http://localhost:3100") => new NextRequest(url, {
  method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify(body),
});
beforeEach(() => {
  vi.resetAllMocks();
  m.auth.mockResolvedValue({ user: { id: "student-one" } });
  m.session.mockResolvedValue({ id: "session-one" });
  m.answer.mockResolvedValue({ id: "answer-one" });
  m.find.mockResolvedValue([{ kind: "ERROR" }]);
  m.create.mockResolvedValue({ count: 1 });
  m.limit.mockResolvedValue({ allowed: true });
});

describe("feedback for owned completed study sessions", () => {
  it("rejects anonymous users before selecting their history", async () => {
    m.auth.mockResolvedValue(null);
    expect((await POST(request(), ctx)).status).toBe(401);
    expect((await GET(new NextRequest(url), ctx)).status).toBe(401);
    expect(m.session).not.toHaveBeenCalled();
  });
  it("never reads or writes feedback on another user's report", async () => {
    m.session.mockResolvedValue(null);
    expect((await POST(request(), ctx)).status).toBe(404);
    expect(m.session).toHaveBeenCalledWith(expect.objectContaining({ where: {
      id: "session-one", student: { userId: "student-one" }, completedAt: { lte: expect.any(Date) },
    } }));
    expect(m.create).not.toHaveBeenCalled();
  });
  it("rejects a selected question outside the session", async () => {
    m.answer.mockResolvedValue(null);
    expect((await POST(request(), ctx)).status).toBe(400);
    expect(m.answer).toHaveBeenCalledWith(expect.objectContaining({ where: { sessionId: "session-one", questionId: "question-one" } }));
    expect(m.create).not.toHaveBeenCalled();
  });
  it.each([null, { kind: "ERROR", reason: "FREEFORM" }, { kind: "TOO_HARD", text: "not allowed" }])("rejects unsupported feedback %j", async value => {
    expect((await POST(request(value), ctx)).status).toBe(400);
    expect(m.create).not.toHaveBeenCalled();
  });
  it("returns recorded for a repeated kind without resetting retention", async () => {
    m.create.mockResolvedValue({ count: 0 });
    const response = await POST(request(), ctx);
    expect(await response.json()).toEqual({ recorded: true, kind: "ERROR" });
    expect(m.create).toHaveBeenCalledWith({ skipDuplicates: true, data: [{ ...payload, sessionId: "session-one" }] });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("allows an overall report without a question number", async () => {
    const response = await POST(request({ kind: "MORE_LIKE_THIS" }), ctx);
    expect(response.status).toBe(200);
    expect(m.answer).not.toHaveBeenCalled();
  });
  it("rejects off-site or oversized requests and closes legacy writes", async () => {
    expect((await POST(request(payload, "https://other.test"), ctx)).status).toBe(403);
    expect((await POST(request({ ...payload, padding: "x".repeat(1025) }), ctx)).status).toBe(413);
    expect((await legacyPost()).status).toBe(410);
    expect(m.create).not.toHaveBeenCalled();
  });
});
