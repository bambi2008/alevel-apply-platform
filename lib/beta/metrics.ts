export type ScorePoint = {
  type: string;
  testId: string | null;
  score: number | null;
  maxScore: number | null;
  occurredAt: Date;
};

function scorePercent(event: ScorePoint) {
  return event.score != null && event.maxScore && event.maxScore > 0
    ? Math.round((event.score / event.maxScore) * 1000) / 10
    : null;
}

export function calculateLearningGain(events: ScorePoint[]) {
  const byTest = new Map<string, ScorePoint[]>();
  for (const event of events) {
    if (!event.testId || scorePercent(event) == null) continue;
    const list = byTest.get(event.testId) ?? [];
    list.push(event);
    byTest.set(event.testId, list);
  }
  const candidates = [...byTest.entries()].flatMap(([testId, rows]) => {
    const sorted = [...rows].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    const pre = sorted.find((row) => row.type === "DIAGNOSTIC_COMPLETED") ?? sorted[0];
    const post = [...sorted].reverse().find((row) => row.occurredAt > pre.occurredAt);
    if (!post) return [];
    const preScore = scorePercent(pre)!;
    const postScore = scorePercent(post)!;
    return [{ testId, preScore, postScore, delta: Math.round((postScore - preScore) * 10) / 10 }];
  });
  return candidates.sort((a, b) => b.postScore - a.postScore)[0] ?? null;
}

export function returnedAfterDays(
  registeredAt: Date,
  events: Array<{ type: string; occurredAt: Date }>,
  days: number,
) {
  const threshold = registeredAt.getTime() + days * 24 * 60 * 60_000;
  return events.some((event) => event.type === "ACTIVE_DAY" && event.occurredAt.getTime() >= threshold);
}
