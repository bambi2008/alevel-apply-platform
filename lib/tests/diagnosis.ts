import type { MCQOptionKey, MCQQuestion, Question } from "@/lib/tests/questions/types";

export type DiagnosisCode =
  | "secure"
  | "fragile-correct"
  | "unanswered"
  | "rushed"
  | "changed-away"
  | "uncertain"
  | "concept-gap"
  | "partial-process"
  | "missing-steps";

export interface AnswerFeedbackPart {
  label?: string;
  earned?: number;
  max?: number;
  keyStepsMissing?: string[];
}

export interface DiagnosisObservation {
  question: Question;
  selected?: string | null;
  earned: number;
  max: number;
  work?: Record<string, string> | null;
  feedback?: AnswerFeedbackPart[] | null;
  timeSpentSec?: number | null;
  answerChanges?: number;
  visits?: number;
  flagged?: boolean;
  firstSelected?: string | null;
}

export interface AnswerDiagnosis {
  questionId: string;
  topicId: string;
  code: DiagnosisCode;
  label: string;
  severity: "positive" | "attention" | "priority";
  evidence: string;
  nextStep: string;
  scoreRate: number;
}

export interface DiagnosisSummaryItem {
  code: DiagnosisCode;
  label: string;
  count: number;
  severity: AnswerDiagnosis["severity"];
}

export interface SessionDiagnosis {
  answers: AnswerDiagnosis[];
  issues: AnswerDiagnosis[];
  secureCount: number;
  attentionCount: number;
  priorityCount: number;
  primaryIssue: DiagnosisSummaryItem | null;
  breakdown: DiagnosisSummaryItem[];
  recommendations: string[];
}

const COPY: Record<DiagnosisCode, Pick<AnswerDiagnosis, "label" | "severity" | "nextStep">> = {
  secure: {
    label: "稳定掌握",
    severity: "positive",
    nextStep: "保持正常复习节奏，下一次可尝试更高难度。",
  },
  "fragile-correct": {
    label: "答对但不稳",
    severity: "attention",
    nextStep: "不看答案重述关键步骤，再做一道同知识点变式题。",
  },
  unanswered: {
    label: "未完成",
    severity: "priority",
    nextStep: "先补齐基础方法，再限时完成一道同类题。",
  },
  rushed: {
    label: "作答过快",
    severity: "attention",
    nextStep: "下次提交前执行一次题干条件、计算和选项核对。",
  },
  "changed-away": {
    label: "改对为错",
    severity: "attention",
    nextStep: "记录改答案的依据；没有发现明确错误时，不因直觉推翻已验证答案。",
  },
  uncertain: {
    label: "推理不稳定",
    severity: "attention",
    nextStep: "把解题过程拆成已知、目标、关键规则三步，再做同类题。",
  },
  "concept-gap": {
    label: "知识或方法缺口",
    severity: "priority",
    nextStep: "先复习对应知识讲解，再完成两道由易到难的同类题。",
  },
  "partial-process": {
    label: "过程不完整",
    severity: "attention",
    nextStep: "对照评分点补全缺失推导，并独立重写一次完整答案。",
  },
  "missing-steps": {
    label: "关键步骤缺失",
    severity: "priority",
    nextStep: "逐项补写缺失评分点，再用同一结构完成一道变式题。",
  },
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function scoreRate(observation: Pick<DiagnosisObservation, "earned" | "max">) {
  return observation.max > 0 ? clamp(observation.earned / observation.max) : 0;
}

export function expectedAnswerTimeSec(question: Question): number {
  if (question.type === "long") return question.totalMarks * 90;
  const baseByTest: Record<string, number> = {
    ucat: 45,
    lnat: 110,
    tara: 75,
    tmua: 90,
  };
  const base = baseByTest[question.testId] ?? 70;
  return Math.round(base * (0.75 + question.difficulty * 0.25));
}

function diagnosis(
  observation: DiagnosisObservation,
  code: DiagnosisCode,
  evidence: string,
): AnswerDiagnosis {
  return {
    questionId: observation.question.id,
    topicId: observation.question.topicId,
    code,
    evidence,
    scoreRate: scoreRate(observation),
    ...COPY[code],
  };
}

function hasWrittenWork(work?: Record<string, string> | null) {
  return Object.values(work ?? {}).some((value) => value.trim().length > 0);
}

function missingSteps(feedback?: AnswerFeedbackPart[] | null) {
  return (feedback ?? []).flatMap((part) => part.keyStepsMissing ?? []).filter(Boolean);
}

export function diagnoseAnswer(observation: DiagnosisObservation): AnswerDiagnosis {
  const rate = scoreRate(observation);
  const expected = expectedAnswerTimeSec(observation.question);

  if (observation.question.type === "long") {
    if (!hasWrittenWork(observation.work)) {
      return diagnosis(observation, "unanswered", "没有检测到可评分的书面作答。");
    }
    if (rate >= 0.999) {
      return diagnosis(observation, "secure", "书面答案覆盖全部评分点。");
    }
    const missing = missingSteps(observation.feedback);
    if (missing.length > 0) {
      return diagnosis(
        observation,
        "missing-steps",
        `评分反馈指出缺少：${missing.slice(0, 2).join("；")}${missing.length > 2 ? "等步骤" : ""}。`,
      );
    }
    if (rate >= 0.45) {
      return diagnosis(observation, "partial-process", `已获得 ${Math.round(rate * 100)}% 的过程分，但论证尚未闭合。`);
    }
    return diagnosis(observation, "concept-gap", `书面得分率为 ${Math.round(rate * 100)}%，当前方法未覆盖主要评分点。`);
  }

  if (!observation.selected) {
    return diagnosis(observation, "unanswered", "本题未提交完整答案。");
  }
  if (rate >= 0.999) {
    if (
      observation.flagged
      || (observation.answerChanges ?? 0) >= 2
      || (observation.timeSpentSec ?? 0) > expected * 2.2
    ) {
      return diagnosis(observation, "fragile-correct", "答案正确，但标记、改答或明显超时显示掌握仍不稳定。");
    }
    return diagnosis(observation, "secure", "答案正确，且未出现明显犹豫信号。");
  }
  if (
    observation.firstSelected === observation.question.answer
    && observation.selected !== observation.question.answer
  ) {
    return diagnosis(observation, "changed-away", "首次选择正确，最终答案在修改后变错。");
  }
  if (rate > 0) {
    return diagnosis(observation, "partial-process", `本题获得 ${observation.earned}/${observation.max} 分，部分判断正确。`);
  }
  if (
    typeof observation.timeSpentSec === "number"
    && observation.timeSpentSec <= Math.max(8, expected * 0.35)
  ) {
    return diagnosis(observation, "rushed", `用时 ${observation.timeSpentSec} 秒，明显短于该题建议核对时间。`);
  }
  if (
    observation.flagged
    || (observation.answerChanges ?? 0) >= 2
    || (observation.visits ?? 1) >= 3
  ) {
    return diagnosis(observation, "uncertain", "多次改答、回看或主动标记表明推理链尚不稳定。");
  }
  return diagnosis(observation, "concept-gap", "在正常作答时间内稳定选择了错误答案，建议回到对应方法核查。");
}

export function buildSessionDiagnosis(observations: DiagnosisObservation[]): SessionDiagnosis {
  const answers = observations.map(diagnoseAnswer);
  const issues = answers.filter((item) => item.code !== "secure");
  const grouped = new Map<DiagnosisCode, DiagnosisSummaryItem>();
  for (const item of answers) {
    const current = grouped.get(item.code);
    grouped.set(item.code, {
      code: item.code,
      label: item.label,
      severity: item.severity,
      count: (current?.count ?? 0) + 1,
    });
  }
  const rank = { priority: 2, attention: 1, positive: 0 };
  const breakdown = [...grouped.values()].sort(
    (a, b) => rank[b.severity] - rank[a.severity] || b.count - a.count,
  );
  const primaryIssue = breakdown.find((item) => item.severity !== "positive") ?? null;
  const recommendations = [...new Set(
    issues
      .sort((a, b) => rank[b.severity] - rank[a.severity])
      .map((item) => item.nextStep),
  )].slice(0, 3);

  return {
    answers,
    issues,
    secureCount: answers.filter((item) => item.severity === "positive").length,
    attentionCount: answers.filter((item) => item.severity === "attention").length,
    priorityCount: answers.filter((item) => item.severity === "priority").length,
    primaryIssue,
    breakdown,
    recommendations,
  };
}

export function optionReview(
  question: MCQQuestion,
  key: MCQOptionKey,
): { title: string; detail: string; correct: boolean } {
  if (key === question.answer) {
    return {
      title: "正确选项",
      detail: question.optionExplanations?.[key] ?? "该选项与标准解法的推导结果一致。",
      correct: true,
    };
  }
  return {
    title: "干扰项",
    detail: question.optionExplanations?.[key]
      ?? `该选项与标准解法得到的 ${question.answer} 不一致。请定位首次出现差异的推导步骤，而不是只记选项字母。`,
    correct: false,
  };
}

export function remediationHref(question: Question) {
  return `/tests/${question.testId}/practice?topic=${question.topicId}&adaptive=1&remediation=1&count=10`;
}

export function lessonHref(question: Question) {
  return `/tests/${question.testId}/learn/${question.topicId}`;
}
