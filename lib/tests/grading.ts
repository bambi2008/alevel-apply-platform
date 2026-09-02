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
    answerImageIds?: string[];
  }[];
  fullSolution: string;
  responseKind?: "structured" | "essay";
  reviewMode?: "standard" | "adjudicate";
  rubricDimensions?: {
    id: string;
    label: string;
    maxMarks: number;
    description: string;
  }[];
}

export interface GradeEvidence {
  criterion: string;
  status: "met" | "partial" | "missing";
  quote?: string;
  marksAwarded: number;
}

export interface GradePartResult {
  label: string;
  earned: number;
  max: number;
  feedback: string;
  keyStepsFound: string[];
  keyStepsMissing: string[];
  evidence: GradeEvidence[];
}

export interface GradeDimensionResult {
  id: string;
  label: string;
  earned: number;
  max: number;
  feedback: string;
}

export interface GradePass {
  perPart: GradePartResult[];
  overallFeedback: string;
  dimensions?: GradeDimensionResult[];
}

export interface GradeAssessment {
  method: "deterministic-empty" | "single-pass" | "dual-pass" | "dual-pass-adjudicated";
  confidence: "high" | "medium" | "low";
  reviewStatus: "accepted" | "review-recommended";
  scoreDelta: number;
  passScores: number[];
  agreementRate: number;
  rationale: string;
}

export interface GradeResponse {
  questionId: string;
  totalEarned: number;
  totalMax: number;
  perPart: GradePartResult[];
  overallFeedback: string;
  modelSolution: string;
  dimensions?: GradeDimensionResult[];
  assessment: GradeAssessment;
  imageReview?: {
    parts: Array<{
      label: string;
      transcript: string;
      confidence: "high" | "medium" | "low";
      unclear: string[];
      imageCount: number;
    }>;
  };
}

export interface RawGradePass {
  perPart?: Array<{
    label?: unknown;
    earned?: unknown;
    feedback?: unknown;
    keyStepsFound?: unknown;
    keyStepsMissing?: unknown;
    evidence?: unknown;
  }>;
  overallFeedback?: unknown;
  dimensions?: Array<{
    id?: unknown;
    earned?: unknown;
    feedback?: unknown;
  }>;
}

function clampScore(value: unknown, max: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(max, Math.round(numeric)));
}

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function normalizeEvidence(value: unknown, max: number): GradeEvidence[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const status = row.status;
    if (typeof row.criterion !== "string" || !["met", "partial", "missing"].includes(String(status))) return [];
    return [{
      criterion: row.criterion,
      status: status as GradeEvidence["status"],
      quote: typeof row.quote === "string" && row.quote.trim() ? row.quote.trim().slice(0, 240) : undefined,
      marksAwarded: clampScore(row.marksAwarded, max),
    }];
  });
}

export function normalizeGradePass(request: GradeRequest, raw: RawGradePass): GradePass {
  const rawParts = new Map((raw.perPart ?? []).map((part) => [String(part.label ?? ""), part]));
  const rawDimensions = new Map((raw.dimensions ?? []).map((dimension) => [String(dimension.id ?? ""), dimension]));
  const dimensions = (request.rubricDimensions ?? []).map((dimension) => {
    const graded = rawDimensions.get(dimension.id);
    return {
      id: dimension.id,
      label: dimension.label,
      earned: clampScore(graded?.earned, dimension.maxMarks),
      max: dimension.maxMarks,
      feedback: typeof graded?.feedback === "string" && graded.feedback.trim()
        ? graded.feedback
        : "该维度没有获得有效反馈。",
    };
  });
  let perPart = request.parts.map((part) => {
    const graded = rawParts.get(part.label);
    return {
      label: part.label,
      earned: clampScore(graded?.earned, part.marks),
      max: part.marks,
      feedback: typeof graded?.feedback === "string" && graded.feedback.trim()
        ? graded.feedback
        : "未识别到足够的评分依据，请对照评分要点复核。",
      keyStepsFound: strings(graded?.keyStepsFound),
      keyStepsMissing: strings(graded?.keyStepsMissing),
      evidence: normalizeEvidence(graded?.evidence, part.marks),
    };
  });
  if (request.responseKind === "essay" && dimensions.length > 0 && perPart.length > 0) {
    perPart = [{
      ...perPart[0],
      earned: dimensions.reduce((sum, dimension) => sum + dimension.earned, 0),
      max: dimensions.reduce((sum, dimension) => sum + dimension.max, 0),
    }];
  }
  return {
    perPart,
    overallFeedback: typeof raw.overallFeedback === "string" && raw.overallFeedback.trim()
      ? raw.overallFeedback
      : "评分完成，但未获得有效的整体反馈。",
    dimensions: dimensions.length > 0 ? dimensions : undefined,
  };
}

export function gradePassScore(pass: GradePass) {
  return pass.perPart.reduce((sum, part) => sum + part.earned, 0);
}

export function gradeMax(request: GradeRequest) {
  return request.responseKind === "essay" && request.rubricDimensions?.length
    ? request.rubricDimensions.reduce((sum, dimension) => sum + dimension.maxMarks, 0)
    : request.parts.reduce((sum, part) => sum + part.marks, 0);
}

export function isBlankSubmission(request: GradeRequest) {
  return request.parts.every((part) => !part.studentWork.trim() && !(part.answerImageIds?.length));
}

function agreementRate(passes: GradePass[]) {
  if (passes.length < 2 || passes[0].perPart.length === 0) return passes.length === 1 ? 0 : 100;
  const exact = passes[0].perPart.filter((part, index) => part.earned === passes[1].perPart[index]?.earned).length;
  return Math.round((exact / passes[0].perPart.length) * 100);
}

export function buildEmptyGradeResponse(request: GradeRequest): GradeResponse {
  const raw: RawGradePass = {
    perPart: request.parts.map((part) => ({
      label: part.label,
      earned: 0,
      feedback: "本小问未作答。",
      keyStepsFound: [],
      keyStepsMissing: [part.solutionOutline],
      evidence: [{ criterion: "提交有效作答", status: "missing", marksAwarded: 0 }],
    })),
    overallFeedback: "本题未作答，因此按评分标准确定性记为 0 分。",
    dimensions: request.rubricDimensions?.map((dimension) => ({
      id: dimension.id,
      earned: 0,
      feedback: "未提交可供评价的作答。",
    })),
  };
  const pass = normalizeGradePass(request, raw);
  return {
    questionId: request.questionId,
    totalEarned: 0,
    totalMax: gradeMax(request),
    perPart: pass.perPart,
    overallFeedback: pass.overallFeedback,
    modelSolution: request.fullSolution,
    dimensions: pass.dimensions,
    assessment: {
      method: "deterministic-empty",
      confidence: "high",
      reviewStatus: "accepted",
      scoreDelta: 0,
      passScores: [0],
      agreementRate: 100,
      rationale: "空白答案由确定性规则处理，未调用 AI。",
    },
  };
}

export function needsAdjudication(request: GradeRequest, passes: GradePass[]) {
  if (passes.length < 2) return false;
  const scores = passes.map(gradePassScore);
  const threshold = Math.max(1, Math.ceil(gradeMax(request) * 0.08));
  return Math.max(...scores) - Math.min(...scores) > threshold
    || passes[0].perPart.some((part, index) => Math.abs(part.earned - (passes[1].perPart[index]?.earned ?? 0)) > 1);
}

export function buildGradeResponse(
  request: GradeRequest,
  passes: GradePass[],
  adjudicated?: GradePass,
): GradeResponse {
  if (passes.length === 0) throw new Error("At least one grading pass is required");
  const scores = passes.map(gradePassScore);
  const delta = scores.length > 1 ? Math.max(...scores) - Math.min(...scores) : 0;
  const disputed = needsAdjudication(request, passes);
  const target = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const selected = adjudicated ?? passes.reduce((best, pass) =>
    Math.abs(gradePassScore(pass) - target) < Math.abs(gradePassScore(best) - target) ? pass : best
  );
  const method: GradeAssessment["method"] = adjudicated
    ? "dual-pass-adjudicated"
    : passes.length === 1
      ? "single-pass"
      : "dual-pass";
  const confidence: GradeAssessment["confidence"] = passes.length === 1 || disputed
    ? "low"
    : delta === 0
      ? "high"
      : "medium";
  const totalEarned = gradePassScore(selected);
  return {
    questionId: request.questionId,
    totalEarned,
    totalMax: gradeMax(request),
    perPart: selected.perPart,
    overallFeedback: selected.overallFeedback,
    modelSolution: request.fullSolution,
    dimensions: selected.dimensions,
    assessment: {
      method,
      confidence,
      reviewStatus: confidence === "low" ? "review-recommended" : "accepted",
      scoreDelta: delta,
      passScores: scores,
      agreementRate: agreementRate(passes),
      rationale: passes.length === 1
        ? "仅一名 AI 阅卷员成功返回，建议人工或学生对照评分标准复核。"
        : disputed
          ? adjudicated
            ? "两名阅卷员分歧超过阈值，已执行第三轮裁决；仍保留低置信度提示。"
            : "两名阅卷员分歧超过阈值，裁决未完成，建议复核。"
          : delta === 0
            ? "两名独立阅卷员总分一致。"
            : "两名独立阅卷员分差在允许阈值内。",
    },
  };
}
