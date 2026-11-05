/** Nullable expansion fields preserve legacy integer columns for rollback.
 * Never use `||`: zero is a valid exact mark and must not fall back. */
export function withExactAnswer<T extends { earned: number; earnedExact?: number | null }>(answer: T): T {
  return { ...answer, earned: answer.earnedExact ?? answer.earned };
}

export function withExactSession<T extends { totalEarned: number; totalEarnedExact?: number | null; answers?: Array<{ earned: number; earnedExact?: number | null }> }>(session: T): T {
  return {
    ...session, totalEarned: session.totalEarnedExact ?? session.totalEarned,
    ...(session.answers ? { answers: session.answers.map(withExactAnswer) } : {}),
  };
}

export function hasPendingWrittenScores(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return false;
  const ids = (metadata as Record<string, unknown>).pendingWrittenQuestionIds;
  return Array.isArray(ids) && ids.some(id => typeof id === "string");
}
