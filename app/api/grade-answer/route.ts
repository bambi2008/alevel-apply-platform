import { NextRequest, NextResponse } from "next/server";
import { aiResponseLanguage, aiSystemForRequest } from "@/lib/ai-response-language";
import OpenAI from "openai";
import { createHash } from "node:crypto";
import { requireAiAccess } from "@/lib/security/ai-route";
import { MAX_ANSWER_IMAGES_PER_PART } from "@/lib/security/answer-images";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import { auth } from "@/auth";
import { z } from "zod";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { canonicalGradeRequest, recordCanonicalGrade, StudyAccessError } from "@/lib/tests/study-attempts";
import { deepSeekParameters } from "@/lib/ai/deepseek-config";
import { withFeedbackQuota } from "@/lib/ai/feedback-response";
import { feedbackFingerprint } from "@/lib/ai/feedback-quota";
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
    ...deepSeekParameters(),
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
    ...deepSeekParameters(),
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

const gradingSubmissionSchema = z.object({ attemptId: z.string().min(1).max(100), questionId: z.string().min(1).max(120), reviewMode: z.enum(["standard", "adjudicate"]).optional() }).strict();

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  const originError = sameOriginWrite(req);
  if (originError) return originError;
  const body = await boundedJson(req, 2048);
  if (!body.ok) return body.response;
  const parsed = gradingSubmissionSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Invalid grading request" }, { status: 400, headers: privateNoStore });
  const locale = aiResponseLanguage(req);
  let request: GradeRequest;
  try { request = await canonicalGradeRequest({ ...parsed.data, userId, locale }); }
  catch (error) {
    if (error instanceof StudyAccessError) return NextResponse.json({ error: error.code }, { status: error.status, headers: privateNoStore });
    throw error;
  }
  if (!validRequest(request)) return NextResponse.json({ error: "grading_data_unavailable" }, { status: 503, headers: privateNoStore });
  if (isBlankSubmission(request)) {
    const response = buildEmptyGradeResponse(request, locale);
    await recordCanonicalGrade({ userId, attemptId: parsed.data.attemptId, questionId: request.questionId, response });
    return NextResponse.json(response, { headers: privateNoStore });
  }
  const access = await requireAiAccess(req, "grading", 30);
  if (!access.ok) return access.response;
  if (process.env.AI_ENABLED !== "true" || !process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503, headers: privateNoStore });
  }

  let images: Map<string, StoredAnswerImage>;
  try {
    images = await loadOwnedAnswerImages(request, access.userId);
  } catch (error) {
    if (error instanceof Error && error.message === "ANSWER_IMAGE_NOT_FOUND") {
      return NextResponse.json({ error: "Answer image is missing or inaccessible" }, { status: 400, headers: privateNoStore });
    }
    return NextResponse.json({ error: "Answer image could not be read" }, { status: 503, headers: privateNoStore });
  }
  const hashes = new Map([...images].map(([id, image]) => [id, createHash("sha256").update(image.bytes).digest("hex")]));
  const { parts, ...canonical } = request;
  delete canonical.reviewMode;
  const cacheKey = feedbackFingerprint("written-grade", [
    locale, deepSeekParameters().model, canonical,
    parts.map(part => ({ ...part, answerImageIds: part.answerImageIds?.map(id => hashes.get(id)) })),
  ]);
  const kind = images.size ? "photo" : "general";
  const result = await withFeedbackQuota({ userId, kind, locale, cacheKey }, () => gradeWithDeepSeek(req, request, images, userId, locale));
  if (!result.ok) return result;
  const response = await result.clone().json() as GradeResponse;
  const recorded = await recordCanonicalGrade({ userId, attemptId: parsed.data.attemptId, questionId: request.questionId, response });
  return recorded ? result : NextResponse.json({ error: "not_found" }, { status: 404, headers: privateNoStore });
}

async function gradeWithDeepSeek(req: NextRequest, request: GradeRequest, images: Map<string, StoredAnswerImage>, userId: string, locale: "en" | "zh-CN") {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
    maxRetries: 0,
  });
  const requestJson = JSON.stringify(request);
  const hasImages = images.size > 0;
  const evaluation = await db.aiEvaluation.create({
    data: {
      userId,
      route: "/api/grade-answer",
      purpose: request.responseKind === "essay" ? "essay-grading" : "written-grading",
      provider: "deepseek",
      model: deepSeekParameters().model,
      requestHash: createHash("sha256").update(requestJson).digest("hex"),
      inputChars: requestJson.length,
      providerCalls: hasImages ? 1 : 2,
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
    } catch {
      console.error("HANDWRITING_TRANSCRIPTION_FAILED");
      await db.aiEvaluation.update({
        where: { id: evaluation.id },
        data: {
          status: "FAILED",
          latencyMs: Date.now() - evaluation.createdAt.getTime(),
          errorCode: "HANDWRITING_TRANSCRIPTION_FAILED",
        },
      });
      return NextResponse.json({ error: "Handwriting recognition failed. Please retry or add a clearer photo." }, { status: 503, headers: privateNoStore });
    }
  }
  const system = aiSystemForRequest(gradingRequest.responseKind === "essay" ? ESSAY_SYSTEM : STRUCTURED_SYSTEM, req);
  const attempts = await Promise.allSettled([
    runExaminer(client, system, gradingPrompt(gradingRequest, "Act as independent examiner A. Apply the scheme directly.")),
    runExaminer(client, system, gradingPrompt(gradingRequest, "Act as independent examiner B. Be especially alert to unsupported jumps and valid alternative methods.")),
  ]);
  const successfulRuns = attempts.flatMap((attempt) => attempt.status === "fulfilled" ? [attempt.value] : []);
  const passes: GradePass[] = successfulRuns.map((run) =>
    normalizeGradePass(gradingRequest, run.raw, locale)
  );
  if (passes.length === 0) {
    console.error("ALL_GRADING_PASSES_FAILED");
    const timedOut = attempts.some((attempt) => attempt.status === "rejected" && (
      attempt.reason?.name === "TimeoutError" || attempt.reason?.name === "AbortError"
    ));
    await db.aiEvaluation.update({
      where: { id: evaluation.id },
      data: {
        status: timedOut ? "TIMED_OUT" : "FAILED",
        providerCalls: 2 + Number(hasImages),
        latencyMs: Date.now() - evaluation.createdAt.getTime(),
        errorCode: timedOut ? "GRADING_TIMEOUT" : "ALL_PASSES_FAILED",
      },
    });
    return NextResponse.json({ error: "Grading failed. Please use the mark scheme for self-assessment." }, { status: 503, headers: privateNoStore });
  }

  let adjudicated: GradePass | undefined;
  let adjudicatorRun: ExaminerRun | undefined;
  let adjudicatorCalled = false;
  if (passes.length > 1 && (gradingRequest.reviewMode === "adjudicate" || needsAdjudication(gradingRequest, passes))) {
    try {
      const priorReports = JSON.stringify(passes.map((pass) => ({
        total: pass.perPart.reduce((sum, part) => sum + part.earned, 0),
        perPart: pass.perPart,
        dimensions: pass.dimensions,
      })));
      adjudicatorCalled = true;
      adjudicatorRun = await runExaminer(
        client,
        aiSystemForRequest(ADJUDICATOR_SYSTEM, req),
        `${gradingPrompt(gradingRequest, "Act as the senior adjudicator.")}\n\nPrior independent reports:\n${priorReports}`,
      );
      adjudicated = normalizeGradePass(gradingRequest, adjudicatorRun.raw, locale);
    } catch {
      console.error("GRADING_ADJUDICATION_FAILED");
    }
  }

  const response: GradeResponse = buildGradeResponse(gradingRequest, passes, adjudicated, locale);
  if (imageReview) {
    response.imageReview = imageReview;
    if (imageReview.parts.some((part) => part.confidence === "low" || part.unclear.length > 0)) {
      response.assessment.confidence = "low";
      response.assessment.reviewStatus = "review-recommended";
      response.assessment.rationale = locale === "en"
        ? `Some handwriting was unclear. ${response.assessment.rationale}`
        : `手写识别存在模糊内容。${response.assessment.rationale}`;
    }
  }
  const runs = adjudicatorRun ? [...successfulRuns, adjudicatorRun] : successfulRuns;
  const promptTokens = visionUsage.promptTokens + runs.reduce((sum, run) => sum + run.promptTokens, 0);
  const completionTokens = visionUsage.completionTokens + runs.reduce((sum, run) => sum + run.completionTokens, 0);
  await db.aiEvaluation.update({
    where: { id: evaluation.id },
    data: {
      status: "SUCCEEDED",
      providerCalls: 2 + Number(hasImages) + Number(adjudicatorCalled),
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
  return NextResponse.json(response, { headers: privateNoStore });
}
