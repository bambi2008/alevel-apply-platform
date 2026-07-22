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
