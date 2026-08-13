import { buildSessionDiagnosis, expectedAnswerTimeSec, type DiagnosisObservation } from "@/lib/tests/diagnosis";
import type { Question } from "@/lib/tests/questions/types";
import type { GradeAssessment, GradeEvidence } from "@/lib/tests/grading";

export interface ReportAnswer {
  questionId: string;
  type: string;
  selected: string | null;
  work: Record<string, string> | null;
  earned: number;
  max: number;
  feedback: Array<{
    label?: string;
    earned?: number;
    max?: number;
    feedback?: string;
    keyStepsFound?: string[];
    keyStepsMissing?: string[];
    evidence?: GradeEvidence[];
    assessment?: GradeAssessment;
  }> | null;
  timeSpentSec: number | null;
  answerChanges: number;
  visits: number;
  flagged: boolean;
  firstSelected: string | null;
}

export interface ReportSession {
  id: string;
  testId: string;
  mode: string;
  paperId: string | null;
  presetId: string | null;
  totalEarned: number;
  totalMax: number;
  timeUsedSec: number | null;
  completedAt: Date;
  answers: ReportAnswer[];
}

export interface ReportHistoryPoint {
  id: string;
  mode: string;
  paperId: string | null;
  totalEarned: number;
  totalMax: number;
  completedAt: Date;
}

export interface ReportModuleDefinition {
  id: string;
  title: string;
  questionIds: string[];
  durationSec: number;
}

export interface ExamPerformanceReport {
  sessionId: string;
  testId: string;
  score: {
    earned: number;
    max: number;
    percent: number;
    completedQuestions: number;
    totalQuestions: number;
    completionPercent: number;
  };
  performanceBand: {
    low: number;
    high: number;
    confidence: "low" | "medium" | "high";
    comparableAttempts: number;
    label: string;
    methodology: string;
  };
  time: {
    usedSec: number | null;
    plannedSec: number;
    telemetryCoverage: number;
    unanswered: number;
    status: "unknown" | "comfortable" | "balanced" | "pressured";
    message: string;
  };
  modules: Array<{ id: string; title: string; earned: number; max: number; percent: number; answered: number; total: number }>;
  topics: Array<{
    topicId: string;
    title: string;
    titleEn: string;
    earned: number;
    max: number;
    percent: number;
    questions: number;
    averageDifficulty: number;
    priority: number;
  }>;
  difficulties: Array<{ difficulty: 1 | 2 | 3; earned: number; max: number; percent: number; questions: number }>;
  diagnosis: ReturnType<typeof buildSessionDiagnosis>;
  behavior: {
    changedAnswers: number;
    flaggedQuestions: number;
    revisitedQuestions: number;
    rushedQuestions: number;
    fragileCorrect: number;
  };
  trend: {
    points: Array<{ id: string; date: string; percent: number; current: boolean }>;
    delta: number | null;
    direction: "new" | "up" | "steady" | "down";
    comparability: string;
  };
  prescriptions: Array<{
    id: string;
    title: string;
    detail: string;
    href: string;
    kind: "lesson" | "practice" | "timed";
  }>;
  dataQuality: {
    matchedQuestions: number;
    totalQuestions: number;
    missingQuestionIds: string[];
    note: string;
  };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function percent(earned: number, max: number) {
  return max > 0 ? Math.round(clamp((earned / max) * 100)) : 0;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
}

export function buildExamPerformanceReport(args: {
  session: ReportSession;
  history: ReportHistoryPoint[];
  questions: Question[];
  topicMeta: (topicId: string) => { title: string; titleEn: string } | undefined;
  modules?: ReportModuleDefinition[];
}): ExamPerformanceReport {
  const questionById = new Map(args.questions.map((question) => [question.id, question]));
  const matched = args.session.answers.flatMap((answer) => {
    const question = questionById.get(answer.questionId);
    return question ? [{ answer, question }] : [];
  });
  const missingQuestionIds = args.session.answers
    .filter((answer) => !questionById.has(answer.questionId))
    .map((answer) => answer.questionId);
  const answerEarned = args.session.answers.reduce((sum, answer) => sum + answer.earned, 0);
  const answerMax = args.session.answers.reduce((sum, answer) => sum + answer.max, 0);
  const usesSpecialScoring = answerEarned !== args.session.totalEarned || answerMax !== args.session.totalMax;
  const scorePercent = percent(args.session.totalEarned, args.session.totalMax);
  const completedQuestions = args.session.answers.filter((answer) => (
    answer.type === "long"
      ? Object.values(answer.work ?? {}).some((value) => value.trim())
      : Boolean(answer.selected)
  )).length;

  const observations: DiagnosisObservation[] = matched.map(({ answer, question }) => ({
    question,
    selected: answer.selected,
    earned: answer.earned,
    max: answer.max,
    work: answer.work,
    feedback: answer.feedback,
    timeSpentSec: answer.timeSpentSec,
    answerChanges: answer.answerChanges,
    visits: answer.visits,
    flagged: answer.flagged,
    firstSelected: answer.firstSelected,
  }));
  const diagnosis = buildSessionDiagnosis(observations);

  const topicRows = new Map<string, { earned: number; max: number; questions: number; difficulty: number }>();
  for (const { answer, question } of matched) {
    const current = topicRows.get(question.topicId) ?? { earned: 0, max: 0, questions: 0, difficulty: 0 };
    current.earned += answer.earned;
    current.max += answer.max;
    current.questions += 1;
    current.difficulty += question.difficulty;
    topicRows.set(question.topicId, current);
  }
  const topics = [...topicRows.entries()].map(([topicId, row]) => {
    const rowPercent = percent(row.earned, row.max);
    const averageDifficulty = row.questions ? row.difficulty / row.questions : 0;
    const meta = args.topicMeta(topicId);
    return {
      topicId,
      title: meta?.title ?? topicId,
      titleEn: meta?.titleEn ?? topicId,
      ...row,
      percent: rowPercent,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10,
      priority: Math.round(clamp((100 - rowPercent) * 0.8 + averageDifficulty * 6.5)),
    };
  }).sort((a, b) => b.priority - a.priority || a.percent - b.percent);

  const difficulties = ([1, 2, 3] as const).map((difficulty) => {
    const rows = matched.filter(({ question }) => question.difficulty === difficulty);
    const earned = rows.reduce((sum, row) => sum + row.answer.earned, 0);
    const max = rows.reduce((sum, row) => sum + row.answer.max, 0);
    return { difficulty, earned, max, percent: percent(earned, max), questions: rows.length };
  });

  const modules = (args.modules ?? []).map((module) => {
    const ids = new Set(module.questionIds);
    const rows = args.session.answers.filter((answer) => ids.has(answer.questionId));
    const earned = rows.reduce((sum, answer) => sum + answer.earned, 0);
    const max = rows.reduce((sum, answer) => sum + answer.max, 0);
    const answered = rows.filter((answer) => answer.selected || Object.values(answer.work ?? {}).some(Boolean)).length;
    return { id: module.id, title: module.title, earned, max, percent: percent(earned, max), answered, total: module.questionIds.length };
  }).filter((module) => module.max > 0 || module.total > 0);

  const plannedSec = args.modules?.reduce((sum, module) => sum + module.durationSec, 0)
    ?? matched.reduce((sum, row) => sum + expectedAnswerTimeSec(row.question), 0);
  const telemetryAnswers = args.session.answers.filter((answer) => typeof answer.timeSpentSec === "number").length;
  const telemetryCoverage = args.session.answers.length ? Math.round((telemetryAnswers / args.session.answers.length) * 100) : 0;
  const unanswered = Math.max(0, args.session.answers.length - completedQuestions);
  const timeRatio = args.session.timeUsedSec && plannedSec ? args.session.timeUsedSec / plannedSec : null;
  const timeStatus = timeRatio === null
    ? "unknown"
    : timeRatio >= 0.94 && unanswered > 0
      ? "pressured"
      : timeRatio < 0.62
        ? "comfortable"
        : "balanced";
  const timeMessage = timeStatus === "unknown"
    ? "缺少完整计时数据，本报告不判断时间压力。"
    : timeStatus === "pressured"
      ? `使用了计划时间的 ${Math.round((timeRatio ?? 0) * 100)}%，仍有 ${unanswered} 题未完成，时间压力是主要失分来源之一。`
      : timeStatus === "comfortable"
        ? `只使用计划时间的 ${Math.round((timeRatio ?? 0) * 100)}%，建议检查是否存在过快作答和遗漏核对。`
        : `使用了计划时间的 ${Math.round((timeRatio ?? 0) * 100)}%，整体节奏处于合理范围。`;

  const historyWithCurrent: ReportHistoryPoint[] = args.history.some((item) => item.id === args.session.id)
    ? args.history
    : [...args.history, args.session];
  const samePaper = args.session.paperId
    ? historyWithCurrent.filter((item) => item.paperId === args.session.paperId)
    : [];
  const comparable = (samePaper.length >= 2 ? samePaper : historyWithCurrent.filter((item) => item.mode === args.session.mode))
    .filter((item) => item.totalMax > 0)
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime())
    .slice(-10);
  const withCurrent = comparable;
  const trendPoints = withCurrent.map((item) => ({
    id: item.id,
    date: item.completedAt.toISOString(),
    percent: percent(item.totalEarned, item.totalMax),
    current: item.id === args.session.id,
  }));
  const currentIndex = trendPoints.findIndex((point) => point.current);
  const previousPoint = currentIndex > 0 ? trendPoints[currentIndex - 1] : null;
  const delta = previousPoint ? scorePercent - previousPoint.percent : null;
  const direction = delta === null ? "new" : delta >= 4 ? "up" : delta <= -4 ? "down" : "steady";

  const sampleSize = Math.max(1, matched.length);
  const rate = scorePercent / 100;
  const statisticalMargin = 1.64 * Math.sqrt(Math.max(0.02, rate * (1 - rate)) / sampleSize) * 100;
  const historySpread = standardDeviation(trendPoints.map((point) => point.percent));
  const margin = clamp(Math.max(4, statisticalMargin, historySpread * 0.55), 4, 20);
  const confidence = sampleSize >= 30 && trendPoints.length >= 3
    ? "high"
    : sampleSize >= 15 || trendPoints.length >= 2
      ? "medium"
      : "low";

  const prescriptions: ExamPerformanceReport["prescriptions"] = [];
  for (const topic of topics.filter((topic) => topic.percent < 75).slice(0, 2)) {
    prescriptions.push({
      id: `topic-${topic.topicId}`,
      title: `强化 ${topic.title}`,
      detail: `${topic.questions} 题得分率 ${topic.percent}%，先补方法，再完成 10 道匹配难度的变式题。`,
      href: `/tests/${args.session.testId}/practice?topic=${topic.topicId}&adaptive=1&count=10`,
      kind: "practice",
    });
  }
  if (timeStatus === "pressured" || diagnosis.breakdown.some((item) => item.code === "rushed")) {
    prescriptions.push({
      id: "timed",
      title: "完成一组限时节奏训练",
      detail: "按考试平均题时完成 10 道题，记录未答题与最后五分钟的改答质量。",
      href: `/tests/${args.session.testId}/practice?adaptive=1&count=10&timed=1`,
      kind: "timed",
    });
  }
  if (prescriptions.length < 3 && topics[0]) {
    prescriptions.push({
      id: `lesson-${topics[0].topicId}`,
      title: `复习 ${topics[0].title} 方法`,
      detail: diagnosis.recommendations[0] ?? "复盘本次失分题的关键规则和完整推理链。",
      href: `/tests/${args.session.testId}/learn/${topics[0].topicId}`,
      kind: "lesson",
    });
  }

  return {
    sessionId: args.session.id,
    testId: args.session.testId,
    score: {
      earned: args.session.totalEarned,
      max: args.session.totalMax,
      percent: scorePercent,
      completedQuestions,
      totalQuestions: args.session.answers.length,
      completionPercent: args.session.answers.length ? Math.round((completedQuestions / args.session.answers.length) * 100) : 0,
    },
    performanceBand: {
      low: Math.round(clamp(scorePercent - margin)),
      high: Math.round(clamp(scorePercent + margin)),
      confidence,
      comparableAttempts: trendPoints.length,
      label: "平台训练表现区间",
      methodology: "根据本次题量、得分率和可比历史波动估算；不是官方换算分、排名、录取概率或成绩预测。",
    },
    time: {
      usedSec: args.session.timeUsedSec,
      plannedSec,
      telemetryCoverage,
      unanswered,
      status: timeStatus,
      message: timeMessage,
    },
    modules,
    topics,
    difficulties,
    diagnosis,
    behavior: {
      changedAnswers: args.session.answers.reduce((sum, answer) => sum + answer.answerChanges, 0),
      flaggedQuestions: args.session.answers.filter((answer) => answer.flagged).length,
      revisitedQuestions: args.session.answers.filter((answer) => answer.visits >= 3).length,
      rushedQuestions: diagnosis.answers.filter((item) => item.code === "rushed").length,
      fragileCorrect: diagnosis.answers.filter((item) => item.code === "fragile-correct").length,
    },
    trend: {
      points: trendPoints,
      delta,
      direction,
      comparability: samePaper.length >= 2
        ? "优先比较同一固定套卷的重复作答。"
        : "比较同一考试、同一练习模式的得分率；题量与题目可能不同。",
    },
    prescriptions: prescriptions.slice(0, 3),
    dataQuality: {
      matchedQuestions: matched.length,
      totalQuestions: args.session.answers.length,
      missingQuestionIds,
      note: telemetryCoverage >= 80
        ? `${usesSpecialScoring ? "本次含起始分、负分或选题计分规则；总分与逐题画像口径不同。" : ""}行为数据覆盖充分，可用于分析节奏、改答和回看。`
        : `${usesSpecialScoring ? "本次含特殊计分规则；" : ""}逐题计时覆盖 ${telemetryCoverage}%，时间类判断应谨慎阅读。`,
    },
  };
}
