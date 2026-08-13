import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createHash } from "node:crypto";
import { requireAiAccess } from "@/lib/security/ai-route";
import { db } from "@/lib/db";
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
Grade typed solutions against the supplied mark scheme. Award method and intermediate-result marks, accept valid alternative methods, and never award unsupported claims. For every awarded mark, identify the criterion and quote a short exact phrase from the candidate response when possible. Write feedback in Chinese. Return valid JSON only.`;

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
    )
  );
}

type ExaminerRun = {
  raw: RawGradePass;
  outputChars: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

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
  const requestJson = JSON.stringify(request);
  const evaluation = await db.aiEvaluation.create({
    data: {
      userId: access.userId,
      route: "/api/grade-answer",
      purpose: request.responseKind === "essay" ? "essay-grading" : "written-grading",
      provider: "deepseek",
      model: "deepseek-chat",
      requestHash: createHash("sha256").update(requestJson).digest("hex"),
      inputChars: requestJson.length,
    },
    select: { id: true, createdAt: true },
  });
  const system = request.responseKind === "essay" ? ESSAY_SYSTEM : STRUCTURED_SYSTEM;
  const attempts = await Promise.allSettled([
    runExaminer(client, system, gradingPrompt(request, "Act as independent examiner A. Apply the scheme directly.")),
    runExaminer(client, system, gradingPrompt(request, "Act as independent examiner B. Be especially alert to unsupported jumps and valid alternative methods.")),
  ]);
  const successfulRuns = attempts.flatMap((attempt) => attempt.status === "fulfilled" ? [attempt.value] : []);
  const passes: GradePass[] = successfulRuns.map((run) =>
    normalizeGradePass(request, run.raw)
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
  if (passes.length > 1 && (request.reviewMode === "adjudicate" || needsAdjudication(request, passes))) {
    try {
      const priorReports = JSON.stringify(passes.map((pass) => ({
        total: pass.perPart.reduce((sum, part) => sum + part.earned, 0),
        perPart: pass.perPart,
        dimensions: pass.dimensions,
      })));
      adjudicatorRun = await runExaminer(
        client,
        ADJUDICATOR_SYSTEM,
        `${gradingPrompt(request, "Act as the senior adjudicator.")}\n\nPrior independent reports:\n${priorReports}`,
      );
      adjudicated = normalizeGradePass(request, adjudicatorRun.raw);
    } catch (error) {
      console.error("Grading adjudication failed", error);
    }
  }

  const response: GradeResponse = buildGradeResponse(request, passes, adjudicated);
  const runs = adjudicatorRun ? [...successfulRuns, adjudicatorRun] : successfulRuns;
  const promptTokens = runs.reduce((sum, run) => sum + run.promptTokens, 0);
  const completionTokens = runs.reduce((sum, run) => sum + run.completionTokens, 0);
  await db.aiEvaluation.update({
    where: { id: evaluation.id },
    data: {
      status: "SUCCEEDED",
      outputChars: runs.reduce((sum, run) => sum + run.outputChars, 0),
      promptTokens,
      completionTokens,
      totalTokens: runs.reduce((sum, run) => sum + run.totalTokens, 0),
      estimatedCostMicros: estimatedCostMicros(promptTokens, completionTokens),
      latencyMs: Date.now() - evaluation.createdAt.getTime(),
      confidence: response.assessment.confidence,
      agreementRate: response.assessment.agreementRate,
      scoreDelta: response.assessment.scoreDelta,
    },
  });
  return NextResponse.json(response);
}
