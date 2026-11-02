import type { QuestionFeedbackKind } from "./question-feedback";

export const PRIORITY_WINDOW_DAYS = 28;
export const PRIORITY_MIN_STUDENTS = 5;
export const PRIORITY_WEIGHTS = { students: 0.4, errorRate: 0.25, feedback: 0.2, scarcity: 0.15 } as const;
const DAY = 86_400_000;
export interface PriorityTopic { testId: string; topicId: string; title: string; titleEn: string; questionCount: number }
export interface PriorityAttempt { studentKey: string; testId: string; topicId: string; questionKey: string; createdAt: Date; wrong: boolean | null }
export interface PriorityFeedback { studentKey: string; testId: string; topicId: string; questionKey: string; createdAt: Date; kind: QuestionFeedbackKind }
export interface PriorityRow extends PriorityTopic {
  status: "ready" | "insufficient_sample" | "ungraded";
  students: number | null;
  gradedAnswers: number | null;
  wrongAnswers: number | null;
  errorRate: number | null;
  feedbackCount: number | null;
  errorFeedback: number | null;
  hardFeedback: number | null;
  moreFeedback: number | null;
  score: number | null;
}
export interface PrioritySnapshot { generatedAt: string; windowStart: string; windowEnd: string; rows: PriorityRow[] }

function relative(value: number, peers: number[], inverse = false): number {
  const min = Math.min(...peers), max = Math.max(...peers);
  const rank = max === min ? 0.5 : (value - min) / (max - min);
  return inverse ? 1 - rank : rank;
}

/** Rolling UTC [now - 28 days, now), not a calendar-month or all-time ranking.
 * Each student's first valid answer to a content question in-window counts once.
 * All personal keys disappear before the snapshot leaves this function. */
export function buildContentPriorities(topics: PriorityTopic[], attempts: PriorityAttempt[], feedback: PriorityFeedback[], now = new Date()): PrioritySnapshot {
  const end = now.getTime(), start = end - PRIORITY_WINDOW_DAYS * DAY;
  const within = (date: Date) => date.getTime() >= start && date.getTime() < end;
  const topicKey = (row: { testId: string; topicId: string }) => JSON.stringify([row.testId, row.topicId]);
  const valid = new Set(topics.map(topicKey));
  const buckets = new Map(topics.map(topic => [topicKey(topic), { students: new Set<string>(), graded: 0, wrong: 0, kinds: { ERROR: 0, TOO_HARD: 0, MORE_LIKE_THIS: 0 } }]));
  const seenAttempts = new Set<string>();
  for (const attempt of attempts.filter(a => within(a.createdAt)).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
    if (!valid.has(topicKey(attempt))) continue;
    const key = JSON.stringify([attempt.studentKey, attempt.testId, attempt.topicId, attempt.questionKey]);
    if (seenAttempts.has(key)) continue;
    seenAttempts.add(key);
    const bucket = buckets.get(topicKey(attempt))!;
    bucket.students.add(attempt.studentKey);
    if (attempt.wrong !== null) { bucket.graded++; bucket.wrong += Number(attempt.wrong); }
  }
  const seenFeedback = new Set<string>();
  for (const item of feedback) {
    if (!within(item.createdAt) || !valid.has(topicKey(item))) continue;
    const key = JSON.stringify([item.studentKey, item.testId, item.topicId, item.questionKey, item.kind]);
    if (seenFeedback.has(key)) continue;
    seenFeedback.add(key);
    buckets.get(topicKey(item))!.kinds[item.kind]++;
  }
  const rows: PriorityRow[] = topics.map(topic => {
    const b = buckets.get(topicKey(topic))!;
    if (b.students.size < PRIORITY_MIN_STUDENTS) return { ...topic, status: "insufficient_sample", students: null, gradedAnswers: null, wrongAnswers: null, errorRate: null, feedbackCount: null, errorFeedback: null, hardFeedback: null, moreFeedback: null, score: null };
    return { ...topic, status: b.graded ? "ready" : "ungraded", students: b.students.size, gradedAnswers: b.graded, wrongAnswers: b.wrong,
      errorRate: b.graded ? b.wrong / b.graded : null, feedbackCount: Object.values(b.kinds).reduce((sum, n) => sum + n, 0),
      errorFeedback: b.kinds.ERROR, hardFeedback: b.kinds.TOO_HARD, moreFeedback: b.kinds.MORE_LIKE_THIS, score: null };
  });
  for (const row of rows) {
    if (row.status !== "ready") continue;
    const peers = rows.filter(peer => peer.testId === row.testId && peer.status === "ready");
    row.score = Math.round(1000 * (
      PRIORITY_WEIGHTS.students * relative(row.students!, peers.map(p => p.students!)) +
      PRIORITY_WEIGHTS.errorRate * relative(row.errorRate!, peers.map(p => p.errorRate!)) +
      PRIORITY_WEIGHTS.feedback * relative(row.feedbackCount!, peers.map(p => p.feedbackCount!)) +
      PRIORITY_WEIGHTS.scarcity * relative(row.questionCount, peers.map(p => p.questionCount), true)
    )) / 10;
  }
  rows.sort((a, b) => a.testId.localeCompare(b.testId) || (b.score ?? -1) - (a.score ?? -1) || a.topicId.localeCompare(b.topicId));
  return { generatedAt: now.toISOString(), windowStart: new Date(start).toISOString(), windowEnd: now.toISOString(), rows };
}

/** Fixed, aggregate-only columns. Escape Excel formulas as well as CSV syntax. */
export function contentPrioritiesCsv(snapshot: PrioritySnapshot, english = false): string {
  const cell = (value: unknown) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const header = english ? ["Window start (UTC)", "Window end (UTC)", "Exam", "Topic", "Question count", "Students", "Graded answers", "Wrong answers", "Error rate", "Feedback", "Question error", "Too hard", "More like this", "Priority score", "Status"]
    : ["窗口开始(UTC)", "窗口结束(UTC)", "考试", "考点", "题量", "作答人数", "已评分作答", "错误作答", "错误率", "反馈数", "题目有误", "太难了", "想要更多这类题", "补题优先级分", "状态"];
  const status = (row: PriorityRow) => row.status === "insufficient_sample" ? english ? "Insufficient sample" : "样本不足" : row.status === "ungraded" ? english ? "Awaiting scores" : "评分不足" : english ? "Ready" : "可比较";
  return "\uFEFF" + [header, ...snapshot.rows.map(row => [snapshot.windowStart, snapshot.windowEnd, row.testId.toUpperCase(), english ? row.titleEn : row.title, row.questionCount,
    row.students, row.gradedAnswers, row.wrongAnswers, row.errorRate === null ? null : `${(row.errorRate * 100).toFixed(1)}%`, row.feedbackCount, row.errorFeedback, row.hardFeedback, row.moreFeedback, row.score, status(row)])]
    .map(row => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
