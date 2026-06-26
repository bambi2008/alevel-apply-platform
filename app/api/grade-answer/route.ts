// Claude API 数学大题分步评分端点
// 输入：题目、学生解答、参考答案要点
// 输出：各小问得分 + 反馈 + 标准答案

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GradeRequest {
  questionId: string;
  testId: string;
  questionContext?: string;
  parts: {
    label: string;
    question: string;
    marks: number;
    solutionOutline: string;
    studentWork: string;
  }[];
  fullSolution: string;
}

export interface GradeResponse {
  questionId: string;
  totalEarned: number;
  totalMax: number;
  perPart: {
    label: string;
    earned: number;
    max: number;
    feedback: string;
    keyStepsFound: string[];
    keyStepsMissing: string[];
  }[];
  overallFeedback: string;
  modelSolution: string;
}

const GRADE_SYSTEM_PROMPT = `You are an expert mathematics examiner for UK university admissions tests (MAT, STEP, ENGAA).
Your task is to grade a student's handwritten/typed solution against the marking scheme.

Rules:
1. Award marks for correct METHOD even if the final answer is wrong (method marks).
2. Award marks for correct intermediate results (accuracy marks).
3. Be fair but rigorous — do not award marks for unsupported claims or circular reasoning.
4. Respond ONLY with valid JSON in the exact format specified.
5. Write feedback in Chinese (中文). Be specific about what was correct and what was missing.
6. If a student's approach is valid but different from the outline, award appropriate marks.`;

const GRADE_PROMPT = (req: GradeRequest) => `
Grade the following student solution. Question ID: ${req.questionId}

${req.questionContext ? `Context: ${req.questionContext}\n` : ""}

Parts to grade:
${req.parts
  .map(
    (p) => `
Part ${p.label} [${p.marks} marks]:
Question: ${p.question}
Key steps required: ${p.solutionOutline}
Student's work:
"""
${p.studentWork || "(no answer provided)"}
"""
`
  )
  .join("\n---\n")}

Full model solution (for reference):
${req.fullSolution}

Respond with ONLY this JSON structure (no other text):
{
  "perPart": [
    {
      "label": "(i)",
      "earned": 3,
      "max": 4,
      "feedback": "中文反馈：步骤正确但最后一步有误...",
      "keyStepsFound": ["因式定理验证", "多项式除法"],
      "keyStepsMissing": ["完整因式分解"]
    }
  ],
  "overallFeedback": "总体评价（中文）..."
}
`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: GradeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.parts || body.parts.length === 0) {
    return NextResponse.json({ error: "No parts to grade" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: GRADE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: GRADE_PROMPT(body) }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON from Claude's response
    const raw = content.text.trim();
    // Strip markdown code blocks if present
    const jsonText = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(jsonText) as {
      perPart: {
        label: string;
        earned: number;
        max: number;
        feedback: string;
        keyStepsFound: string[];
        keyStepsMissing: string[];
      }[];
      overallFeedback: string;
    };

    const totalEarned = parsed.perPart.reduce((s, p) => s + p.earned, 0);
    const totalMax = body.parts.reduce((s, p) => s + p.marks, 0);

    const response: GradeResponse = {
      questionId: body.questionId,
      totalEarned,
      totalMax,
      perPart: parsed.perPart,
      overallFeedback: parsed.overallFeedback,
      modelSolution: body.fullSolution,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Grade API error:", err);
    return NextResponse.json(
      { error: "Grading failed. Please try again." },
      { status: 500 }
    );
  }
}
