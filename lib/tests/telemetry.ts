export interface QuestionTelemetrySnapshot {
  timeSpentSec?: number;
  answerChanges: number;
  visits: number;
  flagged: boolean;
  firstSelected?: string;
}

interface MutableQuestionTelemetry extends QuestionTelemetrySnapshot {
  enteredAt?: number;
  selected?: string;
  elapsedMs: number;
}

export interface QuestionTelemetryTracker {
  visit(questionId: string): void;
  answer(questionId: string, selected: string): void;
  flag(questionId: string, flagged: boolean): void;
  snapshot(questionIds: string[]): Record<string, QuestionTelemetrySnapshot>;
}

export function createQuestionTelemetry(now: () => number = Date.now): QuestionTelemetryTracker {
  const rows = new Map<string, MutableQuestionTelemetry>();
  let activeQuestionId: string | undefined;
  const rowFor = (questionId: string) => {
    const existing = rows.get(questionId);
    if (existing) return existing;
    const created: MutableQuestionTelemetry = { answerChanges: 0, visits: 0, flagged: false, elapsedMs: 0 };
    rows.set(questionId, created);
    return created;
  };
  const leaveActive = () => {
    if (!activeQuestionId) return;
    const active = rowFor(activeQuestionId);
    if (active.enteredAt !== undefined) {
      active.elapsedMs += Math.max(0, now() - active.enteredAt);
      active.enteredAt = undefined;
    }
  };

  return {
    visit(questionId) {
      if (activeQuestionId === questionId) return;
      leaveActive();
      const row = rowFor(questionId);
      row.visits += 1;
      row.enteredAt = now();
      activeQuestionId = questionId;
    },
    answer(questionId, selected) {
      const row = rowFor(questionId);
      if (!row.firstSelected) row.firstSelected = selected;
      if (row.selected && row.selected !== selected) row.answerChanges += 1;
      row.selected = selected;
    },
    flag(questionId, flagged) {
      rowFor(questionId).flagged = flagged;
    },
    snapshot(questionIds) {
      leaveActive();
      activeQuestionId = undefined;
      return Object.fromEntries(questionIds.map((questionId) => {
        const row = rowFor(questionId);
        return [questionId, {
          timeSpentSec: row.elapsedMs > 0 ? Math.max(1, Math.round(row.elapsedMs / 1000)) : undefined,
          answerChanges: row.answerChanges,
          visits: Math.max(1, row.visits),
          flagged: row.flagged,
          firstSelected: row.firstSelected,
        }];
      }));
    },
  };
}
