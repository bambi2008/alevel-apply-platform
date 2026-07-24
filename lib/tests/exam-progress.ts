export interface ObjectiveExamProgress {
  version: 1;
  paperId: string;
  moduleIndex: number;
  questionIndex: number;
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  timeLeft: number;
  startedAt: number;
  savedAt: number;
}

export type ExamAttemptRunner = "objective" | "written" | "mixed";

export interface ExamAttemptSnapshot<TPayload = unknown> {
  version: 2;
  attemptId: string;
  runner: ExamAttemptRunner;
  testId: string;
  scopeId: string;
  startedAt: number;
  deadlineAt: number;
  savedAt: number;
  payload: TPayload;
}

export function createAttemptId(testId: string, scopeId: string, startedAt = Date.now()) {
  return `${testId}:${scopeId}:${startedAt}`;
}

export function examAttemptKey(runner: ExamAttemptRunner, scopeId: string) {
  return `qiaoshen:exam-attempt:${runner}:${scopeId}:v2`;
}

export function remainingAttemptSeconds(deadlineAt: number, now = Date.now()) {
  return Math.max(0, Math.ceil((deadlineAt - now) / 1000));
}

export function parseExamAttempt<TPayload>(
  raw: string | null,
  expected: { runner: ExamAttemptRunner; testId: string; scopeId: string },
  validatePayload: (payload: unknown) => payload is TPayload,
  now = Date.now(),
): ExamAttemptSnapshot<TPayload> | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ExamAttemptSnapshot>;
    if (
      value.version !== 2
      || value.runner !== expected.runner
      || value.testId !== expected.testId
      || value.scopeId !== expected.scopeId
      || typeof value.attemptId !== "string"
      || typeof value.startedAt !== "number"
      || typeof value.deadlineAt !== "number"
      || typeof value.savedAt !== "number"
    ) return null;
    if (now - value.savedAt > 7 * 24 * 60 * 60 * 1000) return null;
    if (remainingAttemptSeconds(value.deadlineAt, now) <= 0) return null;
    if (!validatePayload(value.payload)) return null;
    return value as ExamAttemptSnapshot<TPayload>;
  } catch {
    return null;
  }
}

export function examProgressKey(paperId: string) {
  return `qiaoshen:objective-paper:${paperId}:v1`;
}

export function parseExamProgress(
  raw: string | null,
  paperId: string,
  moduleQuestionCounts: number[],
  now = Date.now(),
): ObjectiveExamProgress | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ObjectiveExamProgress>;
    if (value.version !== 1 || value.paperId !== paperId) return null;
    if (!Number.isInteger(value.moduleIndex) || !Number.isInteger(value.questionIndex)) return null;
    const moduleIndex = value.moduleIndex as number;
    const questionIndex = value.questionIndex as number;
    if (moduleIndex < 0 || moduleIndex >= moduleQuestionCounts.length) return null;
    if (questionIndex < 0 || questionIndex >= moduleQuestionCounts[moduleIndex]) return null;
    if (typeof value.timeLeft !== "number" || value.timeLeft <= 0) return null;
    if (typeof value.startedAt !== "number" || typeof value.savedAt !== "number") return null;
    const elapsedMs = Math.max(0, now - value.savedAt);
    if (elapsedMs > 7 * 24 * 60 * 60 * 1000) return null;
    const adjustedTimeLeft = value.timeLeft - Math.floor(elapsedMs / 1000);
    if (adjustedTimeLeft <= 0) return null;
    if (!value.answers || !value.flagged) return null;
    return { ...(value as ObjectiveExamProgress), timeLeft: adjustedTimeLeft };
  } catch {
    return null;
  }
}

export function summarizeModule(
  questionIds: string[],
  answers: Record<string, string>,
  flagged: Record<string, boolean>,
) {
  const answered = questionIds.filter((id) => Boolean(answers[id])).length;
  const marked = questionIds.filter((id) => Boolean(flagged[id])).length;
  return { answered, unanswered: questionIds.length - answered, marked };
}
