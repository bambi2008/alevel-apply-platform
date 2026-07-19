export interface CountableResult {
  grading?: {
    totalEarned: number;
    totalMax: number;
  };
}

export function getCountedResults<T extends CountableResult>(
  results: T[],
  bestQuestionCount?: number
): T[] {
  const graded = results.filter((result) => result.grading);
  if (!bestQuestionCount) return graded;
  return [...graded]
    .sort((a, b) => (b.grading?.totalEarned ?? 0) - (a.grading?.totalEarned ?? 0))
    .slice(0, bestQuestionCount);
}
