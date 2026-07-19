import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

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
  responseKind?: "structured" | "essay";
  rubricDimensions?: {
    id: string;
    label: string;
    maxMarks: number;
    description: string;
  }[];
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
  dimensions?: {
    id: string;
    label: string;
    earned: number;
    max: number;
    feedback: string;
  }[];
}

const STRUCTURED_GRADE_SYSTEM_PROMPT = `You are an expert examiner for UK admissions tests and academic olympiads (MAT, STEP, ESAT, BPhO, BMO).
Your task is to grade a student's handwritten/typed solution against the marking scheme.

Rules:
1. Award marks for correct METHOD even if the final answer is wrong (method marks).
2. Award marks for correct intermediate results (accuracy marks).
3. Be fair but rigorous — do not award marks for unsupported claims or circular reasoning.
4. Respond ONLY with valid JSON in the exact format specified. No markdown, no extra text.
5. Write feedback in Chinese (中文). Be specific about what was correct and what was missing.
6. If a student's approach is valid but different from the outline, award appropriate marks.`;

const ESSAY_GRADE_SYSTEM_PROMPT = `You are an expert formative writing assessor for UK admissions tests, especially LNAT Section B and TARA Writing Task.
Assess the candidate's typed essay against the supplied rubric.

Rules:
1. Judge the quality of reasoning and expression, never whether you personally agree with the viewpoint.
2. Credit a defensible alternative interpretation when it is clearly explained.
3. Do not require specialist facts. If examples are used, judge how they support the argument.
4. Apply each rubric dimension independently and do not exceed its maximum.
5. Write concise, specific feedback in Chinese, while referring accurately to the candidate's English writing.
6. Respond ONLY with valid JSON in the exact requested format. No markdown or extra text.`;

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

Respond with ONLY this JSON structure (no other text, no markdown code blocks):
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

const ESSAY_GRADE_PROMPT = (req: GradeRequest) => `
Assess the following admissions-test writing response. Question ID: ${req.questionId}

Task and selected prompt:
${req.questionContext ?? ""}
${req.parts.map((part) => `${part.question}\n\nCandidate response:\n\"\"\"\n${part.studentWork || "(no answer provided)"}\n\"\"\"`).join("\n")}

Rubric:
${(req.rubricDimensions ?? []).map((item) => `- ${item.id} | ${item.label} | ${item.maxMarks} marks: ${item.description}`).join("\n")}

Examiner guidance:
${req.fullSolution}

Respond with ONLY this JSON structure:
{
  "dimensions": [
    { "id": "thesis", "earned": 3, "feedback": "中文维度反馈" }
  ],
  "perPart": [
    {
      "label": "${req.parts[0]?.label ?? "Essay"}",
      "earned": 14,
      "max": ${req.parts[0]?.marks ?? 20},
      "feedback": "中文整体作答反馈",
      "keyStepsFound": ["最突出的两项优点"],
      "keyStepsMissing": ["最优先的两项改进"]
    }
  ],
  "overallFeedback": "先给总体判断，再给下一次写作最值得执行的一条建议。"
}
`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY not configured" },
      { status: 503 }
    );
  }
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

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
    const isEssay = body.responseKind === "essay";
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: isEssay ? ESSAY_GRADE_SYSTEM_PROMPT : STRUCTURED_GRADE_SYSTEM_PROMPT },
        { role: "user", content: isEssay ? ESSAY_GRADE_PROMPT(body) : GRADE_PROMPT(body) },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    // Strip markdown code blocks if model ignores the instruction
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
      dimensions?: { id: string; earned: number; feedback: string }[];
    };

    const parsedDimensions = new Map((parsed.dimensions ?? []).map((dimension) => [dimension.id, dimension]));
    const normalizedDimensions = (body.rubricDimensions ?? []).map((dimension) => {
      const graded = parsedDimensions.get(dimension.id);
      return {
        id: dimension.id,
        label: dimension.label,
        earned: Math.max(0, Math.min(dimension.maxMarks, Number(graded?.earned) || 0)),
        max: dimension.maxMarks,
        feedback: graded?.feedback || "该维度未获得有效反馈。",
      };
    });

    const partsByLabel = new Map(parsed.perPart.map((part) => [part.label, part]));
    let normalizedParts = body.parts.map((part) => {
      const graded = partsByLabel.get(part.label);
      const earned = Math.max(0, Math.min(part.marks, Number(graded?.earned) || 0));
      return {
        label: part.label,
        earned,
        max: part.marks,
        feedback: graded?.feedback || "未识别到有效作答，请对照评分要点检查。",
        keyStepsFound: graded && Array.isArray(graded.keyStepsFound) ? graded.keyStepsFound : [],
        keyStepsMissing: graded && Array.isArray(graded.keyStepsMissing) ? graded.keyStepsMissing : [],
      };
    });
    if (isEssay && normalizedDimensions.length > 0 && normalizedParts.length > 0) {
      const rubricEarned = normalizedDimensions.reduce((sum, dimension) => sum + dimension.earned, 0);
      const rubricMax = normalizedDimensions.reduce((sum, dimension) => sum + dimension.max, 0);
      normalizedParts = [{ ...normalizedParts[0], earned: rubricEarned, max: rubricMax }];
    }
    const totalEarned = normalizedParts.reduce((s, p) => s + p.earned, 0);
    const totalMax = normalizedParts.reduce((s, p) => s + p.max, 0);

    const response: GradeResponse = {
      questionId: body.questionId,
      totalEarned,
      totalMax,
      perPart: normalizedParts,
      overallFeedback: parsed.overallFeedback,
      modelSolution: body.fullSolution,
      dimensions: normalizedDimensions.length > 0 ? normalizedDimensions : undefined,
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
