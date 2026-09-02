import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createHash } from "node:crypto";
import { requireAiAccess } from "@/lib/security/ai-route";
import { MAX_ANSWER_IMAGES_PER_PART } from "@/lib/security/answer-images";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import {
  buildEmptyGradeResponse,
  buildGradeResponse,
  isBlankSubmission,
  needsAdjudication,
  normalizeGradePass,
  type GradePass,
  type GradeRequest,
  type GradeResponse,
  type RawGradePass,
} from "@/lib/tests/grading";

export type { GradeRequest, GradeResponse } from "@/lib/tests/grading";

export const runtime = "nodejs";

const STRUCTURED_SYSTEM = `You are an expert examiner for UK admissions tests and academic olympiads.
Grade candidate solutions against the supplied mark scheme. A response may combine typed notes with a faithful transcription of handwritten pages. Award method and intermediate-result marks, accept valid alternative methods, and never award unsupported claims. For every awarded mark, identify the criterion and quote a short exact phrase from the candidate response when possible. Write feedback in Chinese. Return valid JSON only.`;

const ESSAY_SYSTEM = `You are an expert formative assessor for LNAT Section B and TARA Writing.
Apply each supplied rubric dimension independently. Judge reasoning and expression rather than agreement with the viewpoint. Identify concise evidence from the candidate's own writing. Write feedback in Chinese and return valid JSON only.`;

const ADJUDICATOR_SYSTEM = `You are a senior examination adjudicator. Two independent examiners disagreed materially.
Re-grade from the original candidate response and mark scheme. Use the prior reports only to locate the disagreement; do not average them mechanically. Award only evidenced marks, accept valid alternative methods, and return valid JSON only.`;

function gradingPrompt(request: GradeRequest, role: string) {
  const parts = request.parts.map((part) => `
Part ${part.label} [${part.marks} marks]
Question: ${part.question}
Marking criteria: ${part.solutionOutline}
Candidate response:
"""
${part.studentWork || "(no answer)"}
"""`).join("\n---\n");
  const rubric = (request.rubricDimensions ?? [])
    .map((item) => `- ${item.id} | ${item.label} | ${item.maxMarks}: ${item.description}`)
    .join("\n");
  return `${role}
Question ID: ${request.questionId}
${request.questionContext ? `Context: ${request.questionContext}` : ""}

${parts}
${rubric ? `\nRubric dimensions:\n${rubric}` : ""}

Reference solution:
${request.fullSolution}

Return exactly:
{
  "perPart": [{
    "label": "(i)",
    "earned": 3,
    "feedback": "具体中文反馈",
    "keyStepsFound": ["已完成的评分点"],
    "keyStepsMissing": ["缺失的评分点"],
    "evidence": [{
      "criterion": "评分点",
      "status": "met",
      "quote": "候选答案中的简短原文",
      "marksAwarded": 1
    }]
  }],
  "dimensions": [{ "id": "rubric-id", "earned": 2, "feedback": "具体中文反馈" }],
  "overallFeedback": "先总结判断，再给一条最值得执行的改进建议"
}
Evidence status must be one of met, partial, missing. Omit dimensions when no rubric is supplied.`;
}

function validRequest(value: unknown): value is GradeRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<GradeRequest>;
  return (
    typeof request.questionId === "string"
    && typeof request.testId === "string"
    && typeof request.fullSolution === "string"
    && Array.isArray(request.parts)
    && request.parts.length > 0
    && request.parts.every((part) =>
      part
      && typeof part.label === "string"
      && typeof part.question === "string"
      && Number.isInteger(part.marks)
      && part.marks > 0
      && typeof part.solutionOutline === "string"
      && typeof part.studentWork === "string"
      && (part.answerImageIds === undefined || (
        Array.isArray(part.answerImageIds)
        && part.answerImageIds.length <= MAX_ANSWER_IMAGES_PER_PART
        && part.answerImageIds.every((id) => typeof id === "string" && id.length > 0 && id.length <= 64)
      ))
    )
    && request.parts.reduce((sum, part) => sum + (part.answerImageIds?.length ?? 0), 0) <= 8
  );
}

type ExaminerRun = {
  raw: RawGradePass;
  outputChars: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

type StoredAnswerImage = {
  id: string;
  mime: string;
  bytes: Buffer;
};

type ImageReview = NonNullable<GradeResponse["imageReview"]>;

function parseJsonObject<T>(raw: string): T {
  const json = raw.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as T;
}

async function loadOwnedAnswerImages(request: GradeRequest, userId: string) {
  const ids = [...new Set(request.parts.flatMap((part) => part.answerImageIds ?? []))];
  if (ids.length === 0) return new Map<string, StoredAnswerImage>();
  const rows = await db.answerImage.findMany({
    where: { id: { in: ids }, ownerId: userId },
    select: { id: true, fileKey: true, mime: true },
  });
  if (rows.length !== ids.length) throw new Error("ANSWER_IMAGE_NOT_FOUND");
  const storage = getStorage();
  const loaded = await Promise.all(rows.map(async (row) => ({
    id: row.id,
    mime: row.mime,
    bytes: await storage.get(row.fileKey),
  })));
  return new Map(loaded.map((image) => [image.id, image]));
}

async function transcribeAnswerImages(
  client: OpenAI,
  request: GradeRequest,
  images: Map<string, StoredAnswerImage>,
): Promise<{ review: ImageReview; promptTokens: number; completionTokens: number; totalTokens: number }> {
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [{
    type: "text",
    text: `Transcribe the candidate's handwritten work exactly, part by part. Preserve equations, exponents, roots, vectors, matrices, integral bounds, crossed-out work, diagrams and units. Do not solve, repair, or complete the answer. The question text is context only. Return JSON exactly as {"parts":[{"label":"(a)","transcript":"...","confidence":"high|medium|low","unclear":["..."]}]}. Include only parts that have images.\n\nQuestion context: ${request.questionContext ?? ""}`,
  }];
  for (const part of request.parts) {
    if (!part.answerImageIds?.length) continue;
    content.push({
      type: "text",
      text: `Images for part ${part.label}. Question: ${part.question}`,
    });
    for (const id of part.answerImageIds) {
      const image = images.get(id);
      if (!image) throw new Error("ANSWER_IMAGE_NOT_FOUND");
      content.push({
        type: "image_url",
        image_url: { url: `data:${image.mime};base64,${image.bytes.toString("base64")}` },
      });
    }
  }

  const completion = await client.chat.completions.create({
    model: "deepseek-v4-flash-vision-exp",
    max_tokens: 2200,
    temperature: 0,
    messages: [{ role: "user", content }],
  }, { signal: AbortSignal.timeout(gradingTimeoutMs()) });
  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = parseJsonObject<{ parts?: Array<Record<string, unknown>> }>(raw);
  const byLabel = new Map((parsed.parts ?? []).map((part) => [String(part.label ?? ""), part]));
  const parts = request.parts.flatMap((part) => {
    const imageCount = part.answerImageIds?.length ?? 0;
    if (!imageCount) return [];
    const rawPart = byLabel.get(part.label);
    const rawConfidence = rawPart?.confidence;
    const confidence: "high" | "medium" | "low" = rawConfidence === "high" || rawConfidence === "medium" || rawConfidence === "low"
      ? rawConfidence
      : "low";
    const transcript = typeof rawPart?.transcript === "string" ? rawPart.transcript.trim() : "";
    const unclear = Array.isArray(rawPart?.unclear)
      ? rawPart.unclear.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 8)
      : [];
    return [{
      label: part.label,
      transcript,
      confidence: transcript ? confidence : "low" as const,
      unclear: transcript ? unclear : ["未能可靠读取这部分手写内容"],
      imageCount,
    }];
  });
  return {
    review: { parts },
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
    totalTokens: completion.usage?.total_tokens ?? 0,
  };
}

function withImageTranscription(request: GradeRequest, review: ImageReview): GradeRequest {
  const reviewByLabel = new Map(review.parts.map((part) => [part.label, part]));
  return {
    ...request,
    parts: request.parts.map((part) => {
      const imagePart = reviewByLabel.get(part.label);
      if (!imagePart) return part;
      const response = [
        part.studentWork.trim() ? `Typed supplement:\n${part.studentWork.trim()}` : "",
        `Handwriting transcription (${imagePart.confidence} confidence):\n${imagePart.transcript || "[unreadable]"}`,
        imagePart.unclear.length ? `Unclear regions: ${imagePart.unclear.join("; ")}` : "",
      ].filter(Boolean).join("\n\n");
      return { ...part, studentWork: response };
    }),
  };
}

function gradingTimeoutMs() {
  const configured = Number(process.env.AI_GRADING_TIMEOUT_MS ?? 25_000);
  return Math.min(60_000, Math.max(5_000, Number.isFinite(configured) ? configured : 25_000));
}

function estimatedCostMicros(promptTokens: number, completionTokens: number) {
  const inputRate = Number(process.env.DEEPSEEK_INPUT_USD_PER_M_TOKENS);
  const outputRate = Number(process.env.DEEPSEEK_OUTPUT_USD_PER_M_TOKENS);
  if (!Number.isFinite(inputRate) || !Number.isFinite(outputRate)) return null;
  return Math.round(promptTokens * inputRate + completionTokens * outputRate);
}

async function runExaminer(client: OpenAI, system: string, prompt: string): Promise<ExaminerRun> {
  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 2600,
    temperature: 0.15,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  }, { signal: AbortSignal.timeout(gradingTimeoutMs()) });
  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return {
    raw: JSON.parse(json) as RawGradePass,
    outputChars: raw.length,
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
    totalTokens: completion.usage?.total_tokens ?? 0,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!validRequest(body)) {
    return NextResponse.json({ error: "Invalid grading request" }, { status: 400 });
  }
  const request = body;
  if (isBlankSubmission(request)) {
    return NextResponse.json(buildEmptyGradeResponse(request));
  }
  const access = await requireAiAccess(req, "grading", 30);
  if (!access.ok) return access.response;
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 503 });
  }

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  let images: Map<string, StoredAnswerImage>;
  try {
    images = await loadOwnedAnswerImages(request, access.userId);
  } catch (error) {
    if (error instanceof Error && error.message === "ANSWER_IMAGE_NOT_FOUND") {
      return NextResponse.json({ error: "Answer image is missing or inaccessible" }, { status: 400 });
    }
    return NextResponse.json({ error: "Answer image could not be read" }, { status: 503 });
  }
  const requestJson = JSON.stringify(request);
  const hasImages = images.size > 0;
  const evaluation = await db.aiEvaluation.create({
    data: {
      userId: access.userId,
      route: "/api/grade-answer",
      purpose: request.responseKind === "essay" ? "essay-grading" : "written-grading",
      provider: "deepseek",
      model: hasImages ? "deepseek-v4-flash-vision-exp + deepseek-chat" : "deepseek-chat",
      requestHash: createHash("sha256").update(requestJson).digest("hex"),
      inputChars: requestJson.length,
    },
    select: { id: true, createdAt: true },
  });
  let gradingRequest = request;
  let imageReview: ImageReview | undefined;
  let visionUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  if (hasImages) {
    try {
      const vision = await transcribeAnswerImages(client, request, images);
      imageReview = vision.review;
      visionUsage = vision;
      gradingRequest = withImageTranscription(request, vision.review);
    } catch (error) {
      console.error("Handwriting transcription failed", error);
      await db.aiEvaluation.update({
        where: { id: evaluation.id },
        data: {
          status: "FAILED",
          latencyMs: Date.now() - evaluation.createdAt.getTime(),
          errorCode: "HANDWRITING_TRANSCRIPTION_FAILED",
        },
      });
      return NextResponse.json({ error: "Handwriting recognition failed. Please retry or add a clearer photo." }, { status: 503 });
    }
  }
  const system = gradingRequest.responseKind === "essay" ? ESSAY_SYSTEM : STRUCTURED_SYSTEM;
  const attempts = await Promise.allSettled([
    runExaminer(client, system, gradingPrompt(gradingRequest, "Act as independent examiner A. Apply the scheme directly.")),
    runExaminer(client, system, gradingPrompt(gradingRequest, "Act as independent examiner B. Be especially alert to unsupported jumps and valid alternative methods.")),
  ]);
  const successfulRuns = attempts.flatMap((attempt) => attempt.status === "fulfilled" ? [attempt.value] : []);
  const passes: GradePass[] = successfulRuns.map((run) =>
    normalizeGradePass(gradingRequest, run.raw)
  );
  if (passes.length === 0) {
    console.error("Both grading passes failed", attempts);
    const timedOut = attempts.some((attempt) => attempt.status === "rejected" && (
      attempt.reason?.name === "TimeoutError" || attempt.reason?.name === "AbortError"
    ));
    await db.aiEvaluation.update({
      where: { id: evaluation.id },
      data: {
        status: timedOut ? "TIMED_OUT" : "FAILED",
        latencyMs: Date.now() - evaluation.createdAt.getTime(),
        errorCode: timedOut ? "GRADING_TIMEOUT" : "ALL_PASSES_FAILED",
      },
    });
    return NextResponse.json({ error: "Grading failed. Please use the mark scheme for self-assessment." }, { status: 503 });
  }

  let adjudicated: GradePass | undefined;
  let adjudicatorRun: ExaminerRun | undefined;
  if (passes.length > 1 && (gradingRequest.reviewMode === "adjudicate" || needsAdjudication(gradingRequest, passes))) {
    try {
      const priorReports = JSON.stringify(passes.map((pass) => ({
        total: pass.perPart.reduce((sum, part) => sum + part.earned, 0),
        perPart: pass.perPart,
        dimensions: pass.dimensions,
      })));
      adjudicatorRun = await runExaminer(
        client,
        ADJUDICATOR_SYSTEM,
        `${gradingPrompt(gradingRequest, "Act as the senior adjudicator.")}\n\nPrior independent reports:\n${priorReports}`,
      );
      adjudicated = normalizeGradePass(gradingRequest, adjudicatorRun.raw);
    } catch (error) {
      console.error("Grading adjudication failed", error);
    }
  }

  const response: GradeResponse = buildGradeResponse(gradingRequest, passes, adjudicated);
  if (imageReview) {
    response.imageReview = imageReview;
    if (imageReview.parts.some((part) => part.confidence === "low" || part.unclear.length > 0)) {
      response.assessment.confidence = "low";
      response.assessment.reviewStatus = "review-recommended";
      response.assessment.rationale = `手写识别存在模糊内容；${response.assessment.rationale}`;
    }
  }
  const runs = adjudicatorRun ? [...successfulRuns, adjudicatorRun] : successfulRuns;
  const promptTokens = visionUsage.promptTokens + runs.reduce((sum, run) => sum + run.promptTokens, 0);
  const completionTokens = visionUsage.completionTokens + runs.reduce((sum, run) => sum + run.completionTokens, 0);
  await db.aiEvaluation.update({
    where: { id: evaluation.id },
    data: {
      status: "SUCCEEDED",
      outputChars: runs.reduce((sum, run) => sum + run.outputChars, 0),
      promptTokens,
      completionTokens,
      totalTokens: visionUsage.totalTokens + runs.reduce((sum, run) => sum + run.totalTokens, 0),
      estimatedCostMicros: estimatedCostMicros(promptTokens, completionTokens),
      latencyMs: Date.now() - evaluation.createdAt.getTime(),
      confidence: response.assessment.confidence,
      agreementRate: response.assessment.agreementRate,
      scoreDelta: response.assessment.scoreDelta,
    },
  });
  return NextResponse.json(response);
}
