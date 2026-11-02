import type { Question } from "./questions/types";

/** Formative pacing reference, not an official per-question time allowance. */
export function moduleAnswerTimeBudget(questions: Question[], durationSec: number, countedQuestionCount?: number): Map<string, number> {
  if (!questions.length || !Number.isFinite(durationSec) || durationSec <= 0) return new Map();
  if (new Set(questions.map(question => question.id)).size !== questions.length) throw Error("Duplicate question in time budget");
  const counted = countedQuestionCount === undefined ? questions.length : countedQuestionCount;
  if (!Number.isInteger(counted) || counted < 1 || counted > questions.length) throw Error("Invalid counted-question budget");
  // Optional-answer papers: the offered-question references are scaled to the
  // counted-answer workload (e.g. 12 equal STEP questions, six counted = 30m each).
  // This does not change the module timer or require every offered question.
  const budget = Math.round(durationSec * questions.length / counted);
  const weights = questions.map(question => question.type === "long" ? question.totalMarks : .75 + .25 * question.difficulty);
  if (weights.some(weight => !Number.isFinite(weight) || weight <= 0)) throw Error("Invalid question weight");
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const rows = questions.map((question, index) => {
    const exact = budget * weights[index] / total;
    return { id: question.id, index, seconds: Math.floor(exact), remainder: exact % 1 };
  });
  let remaining = budget - rows.reduce((sum, row) => sum + row.seconds, 0);
  for (const row of [...rows].sort((a, b) => b.remainder - a.remainder || a.index - b.index)) {
    if (remaining <= 0) break;
    row.seconds++; remaining--;
  }
  return new Map(rows.map(row => [row.id, row.seconds]));
}
