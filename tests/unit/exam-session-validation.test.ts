import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({ auth: vi.fn(), profile: vi.fn(), create: vi.fn(), task: vi.fn(), event: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: {
  studentProfile: { upsert: m.profile }, examSession: { create: m.create }, studyTask: { findFirst: m.task },
} }));
vi.mock("@/lib/beta/events", () => ({ activeDayEventKey: () => "synthetic-day", recordLearningEvent: m.event }));
import { POST } from "@/app/api/exam-sessions/route";

const answer = { questionId: "synthetic-q1", type: "long", earned: 2, max: 4, work: { "(a)": "$x=2$", note: "原始手写说明" } };
const payload = { testId: "caie9709", mode: "mock", totalEarned: 2, totalMax: 4, answers: [answer],
  clientMeta: { locale: "en", camera: true, nested: { value: 1 }, empty: null } };
const request = (body: unknown) => new NextRequest("http://localhost/api/exam-sessions", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.resetAllMocks();
  m.auth.mockResolvedValue({ user: { id: "synthetic-user" } });
  m.profile.mockResolvedValue({ id: "synthetic-profile" });
  m.create.mockResolvedValue({ id: "synthetic-session" });
  m.task.mockResolvedValue(null);
});

describe("Zod 4 answer-session compatibility", () => {
  it("keeps authentication ahead of validation and writes", async () => {
    m.auth.mockResolvedValue(null);
    const response = await POST(request(payload));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(m.profile).not.toHaveBeenCalled();
  });

  it("preserves string work, heterogeneous metadata and answer defaults", async () => {
    const response = await POST(request(payload));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: "synthetic-session" });
    expect(m.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      studentId: "synthetic-profile", clientMeta: payload.clientMeta,
      answers: { create: [expect.objectContaining({ work: answer.work, answerChanges: 0, visits: 1, flagged: false })] },
    }) }));
  });

  it.each([null, [], { "(a)": 42 }])("rejects invalid work records without database writes: %j", async work => {
    const response = await POST(request({ ...payload, answers: [{ ...answer, work }] }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid request", details: expect.any(Array) });
    expect(m.profile).not.toHaveBeenCalled();
    expect(m.create).not.toHaveBeenCalled();
  });

  it("preserves the 300-answer limit and rejects oversized invalid elements with bounded details", async () => {
    expect((await POST(request({ ...payload, answers: Array(300).fill(answer) }))).status).toBe(201);
    m.profile.mockClear();
    m.create.mockClear();
    const response = await POST(request({ ...payload, answers: Array(2000).fill(null) }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid request");
    expect(body.details).toHaveLength(1);
    expect(body.details[0]).toMatchObject({ code: "too_big", path: ["answers"] });
    expect(m.profile).not.toHaveBeenCalled();
    expect(m.create).not.toHaveBeenCalled();
  });
});
