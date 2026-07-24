import type { AdaptiveProfile } from "@/lib/tests/adaptive";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReadinessAttempt {
  id: string;
  mode: string;
  paperId: string | null;
  scorePercent: number;
  completionPercent: number;
  timeRatio: number | null;
  completedAt: Date;
}

export type ReadinessStatus = "collecting" | "not-ready" | "nearly-ready" | "ready";
export type ReadinessRiskCode =
  | "mock-evidence"
  | "coverage"
  | "weak-topic"
  | "consistency"
  | "completion"
  | "pacing"
  | "stale";

export interface ReadinessRisk {
  code: ReadinessRiskCode;
  severity: "critical" | "warning";
  title: string;
  detail: string;
}

export interface SprintTask {
  id: string;
  title: string;
  detail: string;
  href: string;
  estimatedMinutes: number;
  kind: "mock" | "practice" | "review";
}

export interface ExamReadiness {
  score: number;
  status: ReadinessStatus;
  confidence: "low" | "medium" | "high";
  headline: string;
  evidence: {
    fullMocks: number;
    recentMocks: number;
    distinctPapers: number;
    uniqueQuestions: number;
    lastAttemptAt: string | null;
  };
  dimensions: {
    mastery: number;
    coverage: number;
    mockPerformance: number;
    consistency: number;
    completion: number;
    pacing: number;
    recency: number;
  };
  risks: ReadinessRisk[];
  sprint: SprintTask[];
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[], fallback = 0) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => (value - mean) ** 2)));
}

function weightedRecentAverage(attempts: ReadinessAttempt[]) {
  if (!attempts.length) return 0;
  const weights = attempts.map((_, index) => attempts.length - index);
  return Math.round(attempts.reduce((sum, attempt, index) => sum + attempt.scorePercent * weights[index], 0)
    / weights.reduce((sum, weight) => sum + weight, 0));
}

function riskTask(testId: string, risk: ReadinessRisk, weakTopicId?: string): SprintTask {
  if (risk.code === "mock-evidence" || risk.code === "stale") {
    return {
      id: risk.code,
      title: risk.code === "stale" ? "完成一套状态复测卷" : "补足全真整卷证据",
      detail: risk.code === "stale" ? "用最新整卷重新确认当前状态，旧成绩不替代近期考场表现。" : "完整计时、一次提交，优先选择尚未做过的固定套卷。",
      href: `/tests/${testId}?tab=practice`,
      estimatedMinutes: 120,
      kind: "mock",
    };
  }
  if (risk.code === "coverage" || risk.code === "weak-topic") {
    return {
      id: risk.code,
      title: risk.code === "coverage" ? "补齐未覆盖模块" : "修复首要薄弱模块",
      detail: "先复习关键方法，再完成一组匹配当前难度的变式题。",
      href: weakTopicId
        ? `/tests/${testId}/practice?topic=${weakTopicId}&adaptive=1&count=10`
        : `/tests/${testId}/practice?adaptive=1&count=15`,
      estimatedMinutes: 30,
      kind: "practice",
    };
  }
  if (risk.code === "completion" || risk.code === "pacing") {
    return {
      id: risk.code,
      title: risk.code === "completion" ? "完成限时收尾训练" : "校准整卷时间分配",
      detail: "按真实平均题时作答，预留最后检查时间并记录未完成题。",
      href: `/tests/${testId}/practice?adaptive=1&count=15&timed=1`,
      estimatedMinutes: 35,
      kind: "practice",
    };
  }
  return {
    id: risk.code,
    title: "完成错题复测",
    detail: "重做近期失分题，确认正确率回升不是单次波动。",
    href: `/tests/${testId}/review`,
    estimatedMinutes: 25,
    kind: "review",
  };
}

export function buildExamReadiness(args: {
  testId: string;
  adaptive: AdaptiveProfile;
  attempts: ReadinessAttempt[];
  now?: Date;
}): ExamReadiness {
  const now = args.now ?? new Date();
  const fullMocks = args.attempts
    .filter((attempt) => attempt.mode === "paper" || attempt.mode === "mock")
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
  const recentMocks = fullMocks.slice(-5);
  const mockScores = recentMocks.map((attempt) => attempt.scorePercent);
  const mockPerformance = weightedRecentAverage(recentMocks);
  const consistency = recentMocks.length < 2 ? 0 : Math.round(clamp(100 - standardDeviation(mockScores) * 2.5));
  const completion = Math.round(average(recentMocks.map((attempt) => attempt.completionPercent)));
  const timed = recentMocks.filter((attempt) => attempt.timeRatio !== null);
  const pacing = timed.length
    ? Math.round(average(timed.map((attempt) => {
      const ratio = attempt.timeRatio ?? 1;
      if (ratio >= 0.72 && ratio <= 1.02) return 100;
      return clamp(100 - Math.abs(ratio - 0.87) * 170);
    })))
    : 50;
  const latest = args.attempts.reduce<ReadinessAttempt | null>(
    (current, attempt) => !current || attempt.completedAt > current.completedAt ? attempt : current,
    null
  );
  const ageDays = latest ? Math.max(0, (now.getTime() - latest.completedAt.getTime()) / DAY_MS) : Infinity;
  const recency = latest ? Math.round(clamp(100 - Math.max(0, ageDays - 3) * 4)) : 0;
  const mastery = args.adaptive.topics.length
    ? Math.round(average(args.adaptive.topics.map((topic) => topic.mastery)))
    : 0;

  let score = Math.round(
    mastery * 0.2
    + args.adaptive.coverage * 0.15
    + mockPerformance * 0.32
    + consistency * 0.12
    + completion * 0.09
    + pacing * 0.07
    + recency * 0.05
  );

  const risks: ReadinessRisk[] = [];
  if (fullMocks.length < 2) risks.push({
    code: "mock-evidence",
    severity: "critical",
    title: "整卷证据不足",
    detail: `目前只有 ${fullMocks.length} 次整卷记录；至少需要 2 次计时整卷才能判断考场稳定性。`,
  });
  if (args.adaptive.coverage < 70) risks.push({
    code: "coverage",
    severity: args.adaptive.coverage < 45 ? "critical" : "warning",
    title: "考纲覆盖不足",
    detail: `已有数据覆盖 ${args.adaptive.coverage}% 的知识模块，未覆盖部分仍可能隐藏失分风险。`,
  });
  const weakTopic = args.adaptive.topics.find((topic) => topic.confidence >= 35 && topic.mastery < 60);
  if (weakTopic) risks.push({
    code: "weak-topic",
    severity: weakTopic.mastery < 45 ? "critical" : "warning",
    title: `${weakTopic.title} 尚未稳定`,
    detail: `掌握度 ${weakTopic.mastery}%，数据置信度 ${weakTopic.confidence}%。`,
  });
  if (recentMocks.length >= 3 && consistency < 70) risks.push({
    code: "consistency",
    severity: consistency < 50 ? "critical" : "warning",
    title: "整卷成绩波动较大",
    detail: `最近 ${recentMocks.length} 次整卷稳定性为 ${consistency}%，需要用复测确认真实水平。`,
  });
  if (recentMocks.length && completion < 90) risks.push({
    code: "completion",
    severity: completion < 75 ? "critical" : "warning",
    title: "整卷完成度不足",
    detail: `近期整卷平均完成度 ${completion}%，仍有可避免的空题失分。`,
  });
  if (timed.length >= 2 && pacing < 65) risks.push({
    code: "pacing",
    severity: pacing < 45 ? "critical" : "warning",
    title: "时间分配不稳定",
    detail: "固定套卷计时偏离有效区间，需校准前段速度和末段检查时间。",
  });
  if (latest && ageDays > 14) risks.push({
    code: "stale",
    severity: ageDays > 30 ? "critical" : "warning",
    title: "最近证据已过期",
    detail: `距上次有效训练已 ${Math.floor(ageDays)} 天，需要一次近期复测。`,
  });

  if (fullMocks.length < 2) score = Math.min(score, 64);
  if (risks.some((risk) => risk.severity === "critical")) score = Math.min(score, 69);
  const status: ReadinessStatus = fullMocks.length < 2
    ? "collecting"
    : score >= 80 && !risks.some((risk) => risk.severity === "critical")
      ? "ready"
      : score >= 65
        ? "nearly-ready"
        : "not-ready";
  const confidence = fullMocks.length >= 4 && args.adaptive.uniqueQuestions >= 60
    ? "high"
    : fullMocks.length >= 2 && args.adaptive.uniqueQuestions >= 25
      ? "medium"
      : "low";
  const headline = status === "ready"
    ? "已具备稳定的考场证据"
    : status === "nearly-ready"
      ? "接近就绪，先清除剩余风险"
      : status === "not-ready"
        ? "当前仍有影响整卷表现的缺口"
        : "继续积累整卷证据";
  const sprint = risks
    .slice()
    .sort((a, b) => Number(b.severity === "critical") - Number(a.severity === "critical"))
    .map((risk) => riskTask(args.testId, risk, weakTopic?.id))
    .filter((task, index, tasks) => tasks.findIndex((candidate) => candidate.id === task.id) === index)
    .slice(0, 3);
  if (!sprint.length) sprint.push({
    id: "maintain",
    title: "完成一套保温整卷",
    detail: "保持真实计时与一次提交，考后只复盘高价值失分。",
    href: `/tests/${args.testId}?tab=practice`,
    estimatedMinutes: 120,
    kind: "mock",
  });

  return {
    score,
    status,
    confidence,
    headline,
    evidence: {
      fullMocks: fullMocks.length,
      recentMocks: recentMocks.length,
      distinctPapers: new Set(fullMocks.map((attempt) => attempt.paperId).filter(Boolean)).size,
      uniqueQuestions: args.adaptive.uniqueQuestions,
      lastAttemptAt: latest?.completedAt.toISOString() ?? null,
    },
    dimensions: {
      mastery,
      coverage: args.adaptive.coverage,
      mockPerformance,
      consistency,
      completion,
      pacing,
      recency,
    },
    risks,
    sprint,
  };
}
