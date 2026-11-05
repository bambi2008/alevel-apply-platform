import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), canonical: vi.fn(), record: vi.fn(), requireAiAccess: vi.fn(), findMany: vi.fn(), evaluationCreate: vi.fn(), evaluationUpdate: vi.fn(), storageGet: vi.fn(), createCompletion: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/tests/study-attempts", () => ({ canonicalGradeRequest: mocks.canonical, recordCanonicalGrade: mocks.record, StudyAccessError: class extends Error {} }));
vi.mock("@/lib/security/ai-route", () => ({ requireAiAccess: mocks.requireAiAccess }));
vi.mock("@/lib/ai/feedback-response", () => ({ withFeedbackQuota: (_input: unknown, run: () => Promise<Response>) => run() }));
vi.mock("@/lib/db", () => ({ db: { answerImage: { findMany: mocks.findMany }, aiEvaluation: { create: mocks.evaluationCreate, update: mocks.evaluationUpdate } } }));
vi.mock("@/lib/storage", () => ({ getStorage: () => ({ get: mocks.storageGet }) }));
vi.mock("openai", () => ({ default: vi.fn().mockImplementation(function () { return { chat: { completions: { create: mocks.createCompletion } } }; }) }));
import { POST } from "../../app/api/grade-answer/route";

function request(imageId = "image-1") {
  mocks.canonical.mockResolvedValue({ questionId: "question-1", testId: "caie9709", questionContext: "Solve the equation.", parts: [{ label: "a", question: "Find x.", marks: 2, solutionOutline: "Rearrange to obtain x = 2.", studentWork: "", answerImageIds: [imageId] }], fullSolution: "x = 2" });
  return new NextRequest("http://localhost/api/grade-answer", { method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost" }, body: JSON.stringify({ attemptId: "owned-attempt", questionId: "question-1" }) });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("AI_ENABLED", "true"); vi.stubEnv("DEEPSEEK_MODEL", "deepseek-flash"); vi.stubEnv("DEEPSEEK_API_KEY", "synthetic-test-key");
  mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
  mocks.requireAiAccess.mockResolvedValue({ ok: true, userId: "user-1" });
  mocks.record.mockResolvedValue(true);
  mocks.findMany.mockResolvedValue([{ id: "image-1", fileKey: "answers/image-1.jpg", mime: "image/jpeg" }]);
  mocks.storageGet.mockResolvedValue(Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
  mocks.evaluationCreate.mockResolvedValue({ id: "evaluation-1", createdAt: new Date() });
  mocks.evaluationUpdate.mockResolvedValue({ id: "evaluation-1" });
  mocks.createCompletion.mockImplementation(async (options: { messages: Array<{ role: string; content: unknown }> }) => ({
    choices: [{ message: { content: JSON.stringify(Array.isArray(options.messages[0].content)
      ? { parts: [{ label: "a", transcript: "2x = 4, so x = 2", confidence: "high", unclear: [] }] }
      : { perPart: [{ label: "a", earned: 2, feedback: "步骤完整。", keyStepsFound: ["x = 2"], keyStepsMissing: [], evidence: [{ criterion: "求得 x", status: "met", quote: "x = 2", marksAwarded: 2 }] }], overallFeedback: "答案正确。" }) } }],
    usage: { prompt_tokens: 80, completion_tokens: 40, total_tokens: 120 },
  }));
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("canonical owned-photo grading", () => {
  it("transcribes the committed private photo before dual-pass grading with explicit non-thinking Flash", async () => {
    const response = await POST(request());
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(mocks.canonical).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-1", attemptId: "owned-attempt" }));
    expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { in: ["image-1"] }, ownerId: "user-1" } }));
    expect(mocks.storageGet).toHaveBeenCalledWith("answers/image-1.jpg");
    expect(mocks.createCompletion).toHaveBeenCalledTimes(3);
    for (const call of mocks.createCompletion.mock.calls) expect(call[0]).toMatchObject({ model: "deepseek-flash", thinking: { type: "disabled" } });
    expect(JSON.stringify(mocks.createCompletion.mock.calls[0][0])).toContain("data:image/jpeg;base64,");
    expect(body).toMatchObject({ totalEarned: 2, imageReview: { parts: [{ label: "a", transcript: "2x = 4, so x = 2", confidence: "high", imageCount: 1 }] } });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.record).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-1", attemptId: "owned-attempt", questionId: "question-1", response: expect.objectContaining({ totalEarned: 2 }) }));
  });
  it("rejects a committed image that is missing or no longer accessible", async () => {
    mocks.findMany.mockResolvedValue([]);
    const response = await POST(request("other-image"));
    expect(response.status).toBe(400);
    expect(mocks.createCompletion).not.toHaveBeenCalled();
    expect(mocks.evaluationCreate).not.toHaveBeenCalled();
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it("requests English feedback while preserving the original transcription", async () => {
    const req = request(); req.headers.set("x-qiaoshen-locale", "en");
    const response = await POST(req);
    expect(response.status).toBe(200);
    const grading = mocks.createCompletion.mock.calls.map(call => call[0]).filter(call => call.messages.length > 1);
    expect(grading).toHaveLength(2);
    for (const call of grading) {
      expect(call.messages[0].content).toContain("OUTPUT LANGUAGE: Use English");
      expect(call.messages[1].content).toContain("2x = 4, so x = 2");
    }
    expect((await response.json()).imageReview.parts[0].transcript).toBe("2x = 4, so x = 2");
  });
  it("does not log raw provider exceptions or submitted content on recognition failure", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.createCompletion.mockRejectedValue(Error("private-work-and-provider-key-must-not-be-logged"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(JSON.stringify(log.mock.calls)).not.toContain("private-work-and-provider-key");
    expect(mocks.evaluationUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "FAILED", errorCode: "HANDWRITING_TRANSCRIPTION_FAILED" }) }));
  });
});
