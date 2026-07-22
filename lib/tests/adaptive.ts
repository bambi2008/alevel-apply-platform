import type { QuestionDifficulty } from "@/lib/tests/questions/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface AdaptiveTopicDefinition {
  id: string;
  title: string;
  titleEn: string;
}

export interface AdaptiveQuestionDefinition {
  id: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  type: "mcq" | "long";
}

export interface AdaptiveAnswerObservation {
  questionId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  earned: number;
  max: number;
  completedAt: Date;
  timeSpentSec?: number | null;
}

export type MasteryStatus = "unassessed" | "starting" | "needs-work" | "developing" | "secure" | "mastered";
export type MasteryTrend = "new" | "improving" | "stable" | "declining";

export interface AdaptiveTopicProfile extends AdaptiveTopicDefinition {
  mastery: number;
  confidence: number;
  attempts: number;
  uniqueQuestions: number;
  accuracy: number | null;
  status: MasteryStatus;
  trend: MasteryTrend;
  priority: number;
  lastPracticedAt: string | null;
}

export interface DueReview {
  questionId: string;
  topicId: string;
  dueAt: string;
  daysOverdue: number;
  lastScore: number;
}

export interface AdaptiveTask {
  id: string;
  kind: "diagnostic" | "review" | "focus" | "mock";
  title: string;
  detail: string;
  href: string;
  questionCount?: number;
  topicId?: string;
}

export interface AdaptiveProfile {
  stage: "diagnostic" | "foundation" | "building" | "exam-ready";
  readiness: number;
  coverage: number;
  totalAttempts: number;
  uniqueQuestions: number;
  dueReviewCount: number;
  topics: AdaptiveTopicProfile[];
  reviewSchedule: DueReview[];
  dueReviews: DueReview[];
  tasks: AdaptiveTask[];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function scoreOf(answer: Pick<AdaptiveAnswerObservation, "earned" | "max">) {
  return answer.max > 0 ? clamp(answer.earned / answer.max) : 0;
}

function latestByQuestion(answers: AdaptiveAnswerObservation[]) {
  const latest = new Map<string, AdaptiveAnswerObservation>();
  for (const answer of answers) {
    const current = latest.get(answer.questionId);
    if (!current || answer.completedAt > current.completedAt) latest.set(answer.questionId, answer);
  }
  return [...latest.values()];
}

function masteryStatus(mastery: number, uniqueQuestions: number): MasteryStatus {
  if (uniqueQuestions === 0) return "unassessed";
  if (uniqueQuestions < 4) return "starting";
  if (mastery < 55) return "needs-work";
  if (mastery < 72) return "developing";
  if (mastery < 86) return "secure";
  return "mastered";
}

function topicTrend(answers: AdaptiveAnswerObservation[]): MasteryTrend {
  if (answers.length < 4) return "new";
  const sorted = [...answers].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  const window = Math.min(5, Math.floor(sorted.length / 2));
  const recent = sorted.slice(0, window).reduce((sum, item) => sum + scoreOf(item), 0) / window;
  const previous = sorted.slice(window, window * 2).reduce((sum, item) => sum + scoreOf(item), 0) / window;
  if (recent - previous >= 0.12) return "improving";
  if (previous - recent >= 0.12) return "declining";
  return "stable";
}

function buildTopicProfile(topic: AdaptiveTopicDefinition, answers: AdaptiveAnswerObservation[], now: Date): AdaptiveTopicProfile {
  const unique = latestByQuestion(answers);
  let weightedScore = 1.65;
  let totalWeight = 3;

  for (const answer of unique) {
    const ageDays = Math.max(0, (now.getTime() - answer.completedAt.getTime()) / DAY_MS);
    const recencyWeight = Math.max(0.35, 2 ** (-ageDays / 45));
    const rawScore = scoreOf(answer);
    const adjustedScore = clamp(rawScore + (answer.difficulty - 2) * 0.08);
    const weight = recencyWeight * (answer.difficulty === 2 ? 1 : 0.9);
    weightedScore += adjustedScore * weight;
    totalWeight += weight;
  }

  const mastery = Math.round((weightedScore / totalWeight) * 100);
  const confidence = Math.round((1 - Math.exp(-unique.length / 8)) * 100);
  const rawAccuracy = answers.length
    ? answers.reduce((sum, answer) => sum + scoreOf(answer), 0) / answers.length
    : null;
  const lastPracticed = answers.reduce<Date | null>(
    (latest, answer) => !latest || answer.completedAt > latest ? answer.completedAt : latest,
    null
  );
  const inactivityDays = lastPracticed ? Math.max(0, (now.getTime() - lastPracticed.getTime()) / DAY_MS) : 30;
  const uncertainty = 1 - confidence / 100;
  const priority = Math.round(clamp((1 - mastery / 100) * 0.62 + uncertainty * 0.23 + Math.min(inactivityDays / 60, 1) * 0.15) * 100);

  return {
    ...topic,
    mastery,
    confidence,
    attempts: answers.length,
    uniqueQuestions: unique.length,
    accuracy: rawAccuracy === null ? null : Math.round(rawAccuracy * 100),
    status: masteryStatus(mastery, unique.length),
    trend: topicTrend(answers),
    priority,
    lastPracticedAt: lastPracticed?.toISOString() ?? null,
  };
}

function buildReviewSchedule(answers: AdaptiveAnswerObservation[], now: Date): DueReview[] {
  return latestByQuestion(answers)
    .map((answer) => {
      const lastScore = scoreOf(answer);
      const intervalDays = lastScore < 0.5 ? 1 : lastScore < 0.8 ? 3 : 10;
      const dueAt = new Date(answer.completedAt.getTime() + intervalDays * DAY_MS);
      return {
        questionId: answer.questionId,
        topicId: answer.topicId,
        dueAt: dueAt.toISOString(),
        daysOverdue: Math.max(0, Math.floor((now.getTime() - dueAt.getTime()) / DAY_MS)),
        lastScore: Math.round(lastScore * 100),
      };
    })
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime() || a.lastScore - b.lastScore);
}

function buildTasks(testId: string, stage: AdaptiveProfile["stage"], topics: AdaptiveTopicProfile[], dueReviewCount: number): AdaptiveTask[] {
  if (stage === "diagnostic") {
    return [{
      id: "diagnostic",
      kind: "diagnostic",
      title: "完成能力诊断",
      detail: "用一组跨知识点题目建立首份能力画像，约 20 分钟。",
      href: `/tests/${testId}/practice?adaptive=1&count=15`,
      questionCount: 15,
    }];
  }

  const tasks: AdaptiveTask[] = [];
  if (dueReviewCount > 0) {
    tasks.push({
      id: "review",
      kind: "review",
      title: `复习 ${Math.min(10, dueReviewCount)} 道到期题`,
      detail: "先重做曾经失分且已经到复习时间的题，巩固会比刷新题更优先。",
      href: `/tests/${testId}/practice?adaptive=1&review=1&count=${Math.min(10, dueReviewCount)}`,
      questionCount: Math.min(10, dueReviewCount),
    });
  }

  for (const topic of topics.filter((item) => item.status !== "mastered").slice(0, 2)) {
    tasks.push({
      id: `focus-${topic.id}`,
      kind: "focus",
      title: `强化：${topic.title}`,
      detail: `${topic.mastery}% 掌握度 · ${topic.confidence}% 数据置信度，安排匹配当前水平的练习。`,
      href: `/tests/${testId}/practice?topic=${topic.id}&adaptive=1&count=10`,
      questionCount: 10,
      topicId: topic.id,
    });
  }

  if (stage === "exam-ready") {
    tasks.push({
      id: "mock",
      kind: "mock",
      title: "完成一次整卷模考",
      detail: "知识覆盖与稳定性已达到整卷检验门槛，模考后再回到薄弱项。",
      href: `/tests/${testId}/mock`,
    });
  }
  return tasks.slice(0, 4);
}

export function buildAdaptiveProfile(args: {
  testId: string;
  topics: AdaptiveTopicDefinition[];
  answers: AdaptiveAnswerObservation[];
  now?: Date;
}): AdaptiveProfile {
  const now = args.now ?? new Date();
  const topicProfiles = args.topics
    .map((topic) => buildTopicProfile(topic, args.answers.filter((answer) => answer.topicId === topic.id), now))
    .sort((a, b) => b.priority - a.priority || a.mastery - b.mastery);
  const uniqueQuestions = new Set(args.answers.map((answer) => answer.questionId)).size;
  const assessedTopics = topicProfiles.filter((topic) => topic.uniqueQuestions >= 3).length;
  const coverage = args.topics.length ? Math.round((assessedTopics / args.topics.length) * 100) : 0;
  const weightedMastery = topicProfiles.length
    ? topicProfiles.reduce((sum, topic) => sum + topic.mastery * Math.max(0.25, topic.confidence / 100), 0)
      / topicProfiles.reduce((sum, topic) => sum + Math.max(0.25, topic.confidence / 100), 0)
    : 0;
  const readiness = Math.round(clamp((weightedMastery * 0.85 + coverage * 0.15) / 100) * 100);
  const reviewSchedule = buildReviewSchedule(args.answers, now);
  const dueReviews = reviewSchedule
    .filter((review) => new Date(review.dueAt) <= now)
    .sort((a, b) => b.daysOverdue - a.daysOverdue || a.lastScore - b.lastScore);
  const stage: AdaptiveProfile["stage"] = uniqueQuestions < Math.max(12, args.topics.length * 2)
    ? "diagnostic"
    : readiness < 55
      ? "foundation"
      : readiness < 75 || coverage < 75
        ? "building"
        : "exam-ready";

  return {
    stage,
    readiness,
    coverage,
    totalAttempts: args.answers.length,
    uniqueQuestions,
    dueReviewCount: dueReviews.length,
    topics: topicProfiles,
    reviewSchedule,
    dueReviews,
    tasks: buildTasks(args.testId, stage, topicProfiles, dueReviews.length),
  };
}

function stableNoise(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index++) hash = (hash * 31 + id.charCodeAt(index)) | 0;
  return (Math.abs(hash) % 1000) / 1000;
}

export function selectAdaptiveQuestions(args: {
  questions: AdaptiveQuestionDefinition[];
  answers: AdaptiveAnswerObservation[];
  profile: AdaptiveProfile;
  count: number;
  topicId?: string;
  reviewOnly?: boolean;
  now?: Date;
}): string[] {
  const now = args.now ?? new Date();
  const count = Math.max(1, Math.min(30, args.count));
  const latest = new Map(latestByQuestion(args.answers).map((answer) => [answer.questionId, answer]));
  const due = new Set(args.profile.dueReviews.map((review) => review.questionId));
  const topicProfile = new Map(args.profile.topics.map((topic) => [topic.id, topic]));
  let candidates = args.questions.filter((question) => !args.topicId || question.topicId === args.topicId);
  if (args.reviewOnly) candidates = candidates.filter((question) => due.has(question.id));

  const ranked = candidates.map((question) => {
    const topic = topicProfile.get(question.topicId);
    const prior = latest.get(question.id);
    const targetDifficulty: QuestionDifficulty = !topic || topic.mastery < 50 ? 1 : topic.mastery < 75 ? 2 : 3;
    const ageDays = prior ? (now.getTime() - prior.completedAt.getTime()) / DAY_MS : Infinity;
    let score = (topic?.priority ?? 75) * 1.3;
    if (due.has(question.id)) score += 120;
    if (!prior) score += args.profile.stage === "diagnostic" ? 80 : 38;
    if (question.difficulty === targetDifficulty) score += 34;
    else if (Math.abs(question.difficulty - targetDifficulty) === 1) score += 8;
    if (prior && scoreOf(prior) >= 0.8) score -= 28;
    if (ageDays < 2) score -= 80;
    score += stableNoise(question.id);
    return { question, score };
  }).sort((a, b) => b.score - a.score);

  const selected: string[] = [];
  const perTopic = new Map<string, number>();
  const topicCap = args.topicId ? count : Math.max(2, Math.ceil(count * 0.4));
  for (const item of ranked) {
    if ((perTopic.get(item.question.topicId) ?? 0) >= topicCap) continue;
    selected.push(item.question.id);
    perTopic.set(item.question.topicId, (perTopic.get(item.question.topicId) ?? 0) + 1);
    if (selected.length === count) break;
  }
  if (selected.length < count) {
    for (const item of ranked) {
      if (selected.includes(item.question.id)) continue;
      selected.push(item.question.id);
      if (selected.length === count) break;
    }
  }
  return selected;
}
