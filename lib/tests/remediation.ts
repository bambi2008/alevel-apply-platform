import type { AdaptiveAnswerObservation, AdaptiveQuestionDefinition } from "@/lib/tests/adaptive";

const DAY_MS = 24 * 60 * 60 * 1000;

export type RemediationStatus = "scheduled" | "due" | "recovered" | "verified" | "relapsed";

export interface RemediationCase {
  questionId: string;
  topicId: string;
  status: RemediationStatus;
  attempts: number;
  failures: number;
  lastScore: number;
  bestScore: number;
  consecutivePasses: number;
  firstFailedAt: string;
  lastAttemptAt: string;
  nextReviewAt: string;
  daysOverdue: number;
}

export interface RemediationTopic {
  topicId: string;
  total: number;
  active: number;
  recovered: number;
  verified: number;
  relapsed: number;
}

export interface RemediationProfile {
  totalCases: number;
  activeCount: number;
  dueCount: number;
  recoveredCount: number;
  verifiedCount: number;
  relapsedCount: number;
  recoveryRate: number;
  cases: RemediationCase[];
  topics: RemediationTopic[];
}

function scoreOf(answer: Pick<AdaptiveAnswerObservation, "earned" | "max">) {
  return answer.max > 0 ? Math.max(0, Math.min(1, answer.earned / answer.max)) : 0;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function casePriority(item: RemediationCase) {
  if (item.status === "relapsed") return 500 + item.failures * 10;
  if (item.status === "due") return 400 + item.daysOverdue * 10;
  if (item.status === "recovered") return 300 + item.daysOverdue * 10;
  if (item.status === "scheduled") return 200 - new Date(item.nextReviewAt).getTime() / DAY_MS;
  return 0;
}

export function buildRemediationProfile(args: {
  answers: AdaptiveAnswerObservation[];
  now?: Date;
}): RemediationProfile {
  const now = args.now ?? new Date();
  const grouped = new Map<string, AdaptiveAnswerObservation[]>();
  for (const answer of args.answers) {
    const current = grouped.get(answer.questionId) ?? [];
    current.push(answer);
    grouped.set(answer.questionId, current);
  }

  const cases: RemediationCase[] = [];
  for (const [questionId, observations] of grouped) {
    const sorted = observations.slice().sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
    const scores = sorted.map(scoreOf);
    const firstFailureIndex = scores.findIndex((score) => score < 0.8);
    if (firstFailureIndex < 0) continue;

    const latest = sorted.at(-1)!;
    const latestScore = scores.at(-1)!;
    const priorRecovered = scores.slice(firstFailureIndex, -1).some((score) => score >= 0.8);
    let consecutivePasses = 0;
    const passDates = new Set<string>();
    for (let index = sorted.length - 1; index >= 0 && scores[index] >= 0.8; index--) {
      consecutivePasses += 1;
      passDates.add(dateKey(sorted[index].completedAt));
    }

    let status: RemediationStatus;
    let intervalDays: number;
    if (latestScore >= 0.8) {
      const streakStart = sorted[sorted.length - consecutivePasses].completedAt;
      const stableAcrossTime = passDates.size >= 2 && latest.completedAt.getTime() - streakStart.getTime() >= 3 * DAY_MS;
      status = stableAcrossTime ? "verified" : "recovered";
      intervalDays = stableAcrossTime ? 10 : 3;
    } else if (priorRecovered) {
      status = "relapsed";
      intervalDays = 1;
    } else {
      intervalDays = latestScore < 0.5 ? 1 : 3;
      const dueAt = latest.completedAt.getTime() + intervalDays * DAY_MS;
      status = dueAt <= now.getTime() ? "due" : "scheduled";
    }

    const nextReviewAt = new Date(latest.completedAt.getTime() + intervalDays * DAY_MS);
    const daysOverdue = Math.max(0, Math.floor((now.getTime() - nextReviewAt.getTime()) / DAY_MS));
    cases.push({
      questionId,
      topicId: latest.topicId,
      status,
      attempts: sorted.length,
      failures: scores.filter((score) => score < 0.8).length,
      lastScore: Math.round(latestScore * 100),
      bestScore: Math.round(Math.max(...scores) * 100),
      consecutivePasses,
      firstFailedAt: sorted[firstFailureIndex].completedAt.toISOString(),
      lastAttemptAt: latest.completedAt.toISOString(),
      nextReviewAt: nextReviewAt.toISOString(),
      daysOverdue,
    });
  }
  cases.sort((a, b) => casePriority(b) - casePriority(a) || a.questionId.localeCompare(b.questionId));

  const topicMap = new Map<string, RemediationTopic>();
  for (const item of cases) {
    const topic = topicMap.get(item.topicId) ?? {
      topicId: item.topicId,
      total: 0,
      active: 0,
      recovered: 0,
      verified: 0,
      relapsed: 0,
    };
    topic.total += 1;
    if (item.status !== "verified") topic.active += 1;
    if (item.status === "recovered") topic.recovered += 1;
    if (item.status === "verified") topic.verified += 1;
    if (item.status === "relapsed") topic.relapsed += 1;
    topicMap.set(item.topicId, topic);
  }
  const recoveredCount = cases.filter((item) => item.status === "recovered").length;
  const verifiedCount = cases.filter((item) => item.status === "verified").length;
  const dueCount = cases.filter((item) => (
    item.status === "due"
    || item.status === "relapsed"
    || (item.status === "recovered" && new Date(item.nextReviewAt) <= now)
  )).length;

  return {
    totalCases: cases.length,
    activeCount: cases.length - verifiedCount,
    dueCount,
    recoveredCount,
    verifiedCount,
    relapsedCount: cases.filter((item) => item.status === "relapsed").length,
    recoveryRate: cases.length ? Math.round(((recoveredCount + verifiedCount) / cases.length) * 100) : 100,
    cases,
    topics: [...topicMap.values()].sort((a, b) => b.relapsed - a.relapsed || b.active - a.active || b.total - a.total),
  };
}

export function selectRemediationQuestions(args: {
  profile: RemediationProfile;
  questions: AdaptiveQuestionDefinition[];
  count: number;
  now?: Date;
}) {
  const now = args.now ?? new Date();
  const count = Math.max(1, Math.min(30, args.count));
  const questionById = new Map(args.questions.map((question) => [question.id, question]));
  const actionable = args.profile.cases.filter((item) => (
    item.status === "relapsed"
    || item.status === "due"
    || (item.status === "recovered" && new Date(item.nextReviewAt) <= now)
  ));
  const selected: string[] = [];
  for (const item of actionable) {
    if (questionById.has(item.questionId)) selected.push(item.questionId);
    if (selected.length >= count) return selected;
  }

  const topicPriority = new Map<string, number>();
  actionable.forEach((item, index) => topicPriority.set(item.topicId, Math.max(topicPriority.get(item.topicId) ?? 0, 1000 - index)));
  args.profile.topics.forEach((topic, index) => {
    if (topic.active > 0) topicPriority.set(topic.topicId, Math.max(topicPriority.get(topic.topicId) ?? 0, 500 - index));
  });
  const activeQuestionIds = new Set(args.profile.cases.filter((item) => item.status !== "verified").map((item) => item.questionId));
  const ranked = args.questions
    .filter((question) => !selected.includes(question.id))
    .map((question) => ({
      id: question.id,
      score: (topicPriority.get(question.topicId) ?? 0)
        + (activeQuestionIds.has(question.id) ? 250 : 0)
        + question.difficulty * 3,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  for (const item of ranked) {
    selected.push(item.id);
    if (selected.length >= count) break;
  }
  return selected;
}
