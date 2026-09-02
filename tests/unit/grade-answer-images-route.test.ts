import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  requireAiAccess: vi.fn(),
  findMany: vi.fn(),
  evaluationCreate: vi.fn(),
  evaluationUpdate: vi.fn(),
  storageGet: vi.fn(),
  createCompletion: vi.fn(),
}));

vi.mock("@/lib/security/ai-route", () => ({ requireAiAccess: mocks.requireAiAccess }));
vi.mock("@/lib/db", () => ({
  db: {
    answerImage: { findMany: mocks.findMany },
    aiEvaluation: { create: mocks.evaluationCreate, update: mocks.evaluationUpdate },
  },
}));
vi.mock("@/lib/storage", () => ({ getStorage: () => ({ get: mocks.storageGet }) }));
vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mocks.createCompletion } },
  })),
}));

import { POST } from "@/app/api/grade-answer/route";

function request(imageId = "image-1") {
  return new NextRequest("http://localhost/api/grade-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: "question-1",
      testId: "caie9709",
      questionContext: "Solve the equation.",
      parts: [{
        label: "(a)",
        question: "Find x.",
        marks: 2,
        solutionOutline: "Rearrange to obtain x = 2.",
        studentWork: "",
        answerImageIds: [imageId],
      }],
      fullSolution: "x = 2",
    }),
  });
}

describe("grade answer image flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEEPSEEK_API_KEY = "test-key";
    mocks.requireAiAccess.mockResolvedValue({ ok: true, userId: "user-1" });
    mocks.findMany.mockResolvedValue([{
      id: "image-1",
      fileKey: "answers/image-1.jpg",
      mime: "image/jpeg",
    }]);
    mocks.storageGet.mockResolvedValue(Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
    mocks.evaluationCreate.mockResolvedValue({
      id: "evaluation-1",
      createdAt: new Date("2026-09-03T00:00:00.000Z"),
    });
    mocks.evaluationUpdate.mockResolvedValue({ id: "evaluation-1" });
    mocks.createCompletion.mockImplementation(async (options: { model: string }) => {
      if (options.model === "deepseek-v4-flash-vision-exp") {
        return {
          choices: [{ message: { content: JSON.stringify({
            parts: [{ label: "(a)", transcript: "2x = 4, so x = 2", confidence: "high", unclear: [] }],
          }) } }],
          usage: { prompt_tokens: 30, completion_tokens: 12, total_tokens: 42 },
        };
      }
      return {
        choices: [{ message: { content: JSON.stringify({
          perPart: [{
            label: "(a)",
            earned: 2,
            feedback: "步骤完整。",
            keyStepsFound: ["x = 2"],
            keyStepsMissing: [],
            evidence: [{ criterion: "求得 x", status: "met", quote: "x = 2", marksAwarded: 2 }],
          }],
          overallFeedback: "答案正确。",
        }) } }],
        usage: { prompt_tokens: 80, completion_tokens: 40, total_tokens: 120 },
      };
    });
  });

  it("transcribes an owned private image before dual-pass grading", async () => {
    const response = await POST(request());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: { in: ["image-1"] }, ownerId: "user-1" },
    }));
    expect(mocks.storageGet).toHaveBeenCalledWith("answers/image-1.jpg");
    expect(mocks.createCompletion).toHaveBeenCalledTimes(3);
    expect(mocks.createCompletion.mock.calls[0]?.[0]).toMatchObject({
      model: "deepseek-v4-flash-vision-exp",
    });
    expect(JSON.stringify(mocks.createCompletion.mock.calls[0]?.[0])).toContain("data:image/jpeg;base64,");
    expect(body).toMatchObject({
      totalEarned: 2,
      imageReview: {
        parts: [{ label: "(a)", transcript: "2x = 4, so x = 2", confidence: "high", imageCount: 1 }],
      },
    });
  });

  it("rejects an image ID that is missing or belongs to another user", async () => {
    mocks.findMany.mockResolvedValue([]);
    const response = await POST(request("other-image"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Answer image is missing or inaccessible" });
    expect(mocks.createCompletion).not.toHaveBeenCalled();
    expect(mocks.evaluationCreate).not.toHaveBeenCalled();
  });
});
