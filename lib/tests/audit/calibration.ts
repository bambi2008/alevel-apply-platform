import { getPrimaryQuestionIndex } from "./index";

export interface AttemptAggregate {
  questionId: string;
  attempts: number;
  earned: number;
  max: number;
}

export type CalibrationStatus = "insufficient" | "in-range" | "easier-than-label" | "harder-than-label";

export interface QuestionCalibration {
  questionId: string;
  testId: string;
  topicId: string;
  labelledDifficulty: 1 | 2 | 3;
  attempts: number;
  scoreRate: number;
  expectedMin: number;
  expectedMax: number;
  status: CalibrationStatus;
}

const EXPECTED_RANGES: Record<1 | 2 | 3, [number, number]> = {
  1: [0.65, 0.95],
  2: [0.4, 0.75],
  3: [0.15, 0.55],
};

export function calibrateQuestionDifficulty(
  aggregates: AttemptAggregate[],
  minimumAttempts = 10
): QuestionCalibration[] {
  const questions = getPrimaryQuestionIndex();
  return aggregates.flatMap((aggregate) => {
    const question = questions.get(aggregate.questionId);
    if (!question || aggregate.max <= 0 || aggregate.attempts <= 0) return [];
    const [expectedMin, expectedMax] = EXPECTED_RANGES[question.difficulty];
    const scoreRate = aggregate.earned / aggregate.max;
    let status: CalibrationStatus = "in-range";
    if (aggregate.attempts < minimumAttempts) status = "insufficient";
    else if (scoreRate > expectedMax) status = "easier-than-label";
    else if (scoreRate < expectedMin) status = "harder-than-label";
    return [{
      questionId: question.id,
      testId: question.testId,
      topicId: question.topicId,
      labelledDifficulty: question.difficulty,
      attempts: aggregate.attempts,
      scoreRate,
      expectedMin,
      expectedMax,
      status,
    }];
  }).sort((a, b) => b.attempts - a.attempts || a.questionId.localeCompare(b.questionId));
}
