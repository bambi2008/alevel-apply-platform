export type QuestionCoverage = {
  attempted: number;
  available: number;
  pct: number;
};

export function calculateQuestionCoverage(
  availableQuestionIds: Iterable<string>,
  attemptedQuestionIds: Iterable<string>,
): QuestionCoverage {
  const available = new Set(availableQuestionIds);
  const attempted = new Set(attemptedQuestionIds);
  let covered = 0;

  for (const questionId of attempted) {
    if (available.has(questionId)) covered += 1;
  }

  return {
    attempted: covered,
    available: available.size,
    pct: available.size === 0 ? 0 : Math.min(100, Math.round((covered / available.size) * 100)),
  };
}
