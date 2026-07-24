import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
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

async function runExaminer(client: OpenAI, system: string, prompt: string) {
  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 2600,
    temperature: 0.15,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as RawGradePass;
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
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 503 });
  }

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  const system = request.responseKind === "essay" ? ESSAY_SYSTEM : STRUCTURED_SYSTEM;
  const attempts = await Promise.allSettled([
    runExaminer(client, system, gradingPrompt(request, "Act as independent examiner A. Apply the scheme directly.")),
    runExaminer(client, system, gradingPrompt(request, "Act as independent examiner B. Be especially alert to unsupported jumps and valid alternative methods.")),
  ]);
  const passes: GradePass[] = attempts.flatMap((attempt) =>
    attempt.status === "fulfilled" ? [normalizeGradePass(request, attempt.value)] : []
  );
  if (passes.length === 0) {
    console.error("Both grading passes failed", attempts);
    return NextResponse.json({ error: "Grading failed. Please use the mark scheme for self-assessment." }, { status: 503 });
  }

  let adjudicated: GradePass | undefined;
  if (passes.length > 1 && (request.reviewMode === "adjudicate" || needsAdjudication(request, passes))) {
    try {
      const priorReports = JSON.stringify(passes.map((pass) => ({
        total: pass.perPart.reduce((sum, part) => sum + part.earned, 0),
        perPart: pass.perPart,
        dimensions: pass.dimensions,
      })));
      const raw = await runExaminer(
        client,
        ADJUDICATOR_SYSTEM,
        `${gradingPrompt(request, "Act as the senior adjudicator.")}\n\nPrior independent reports:\n${priorReports}`,
      );
      adjudicated = normalizeGradePass(request, raw);
    } catch (error) {
      console.error("Grading adjudication failed", error);
    }
  }

  const response: GradeResponse = buildGradeResponse(request, passes, adjudicated);
  return NextResponse.json(response);
}
