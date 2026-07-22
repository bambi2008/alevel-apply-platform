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
  suggestedDifficulty: 1 | 2 | 3;
}

export interface AttemptObservation {
  questionId: string;
  sessionId: string;
  studentId: string;
  selected?: string | null;
  earned: number;
  max: number;
  timeSpentSec?: number | null;
  answerChanges?: number;
  visits?: number;
  flagged?: boolean;
  sessionScoreRate: number;
}

export type CalibrationConfidence = "low" | "medium" | "high";

export interface DetailedQuestionCalibration extends QuestionCalibration {
  uniqueStudents: number;
  confidence: CalibrationConfidence;
  scoreInterval: [number, number];
  discrimination: number | null;
  medianTimeSec: number | null;
  telemetryCoverage: number;
  changeRate: number;
  flagRate: number;
  optionCounts: Record<string, number>;
  ineffectiveDistractors: string[];
  qualityFlags: string[];
}

const EXPECTED_RANGES: Record<1 | 2 | 3, [number, number]> = {
  1: [0.65, 0.95],
  2: [0.4, 0.75],
  3: [0.15, 0.55],
};

function wilsonInterval(successes: number, trials: number): [number, number] {
  if (trials <= 0) return [0, 1];
  const z = 1.96;
  const p = successes / trials;
  const denominator = 1 + z * z / trials;
  const centre = (p + z * z / (2 * trials)) / denominator;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * trials)) / trials) / denominator;
  return [Math.max(0, centre - margin), Math.min(1, centre + margin)];
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function discriminationIndex(rows: AttemptObservation[]): number | null {
  if (rows.length < 20) return null;
  const sorted = [...rows].sort((a, b) => a.sessionScoreRate - b.sessionScoreRate);
  const groupSize = Math.max(5, Math.floor(sorted.length * 0.27));
  const average = (items: AttemptObservation[]) => items.reduce((sum, item) => sum + item.earned / item.max, 0) / items.length;
  return average(sorted.slice(-groupSize)) - average(sorted.slice(0, groupSize));
}

export function buildDetailedQuestionCalibrations(
  observations: AttemptObservation[],
  minimumAttempts = 30,
  minimumStudents = 20
): DetailedQuestionCalibration[] {
  const questions = getPrimaryQuestionIndex();
  const groups = new Map<string, AttemptObservation[]>();
  for (const observation of observations) {
    if (observation.max <= 0) continue;
    groups.set(observation.questionId, [...(groups.get(observation.questionId) ?? []), observation]);
  }

  return [...groups.entries()].flatMap(([questionId, rows]) => {
    const question = questions.get(questionId);
    if (!question) return [];
    const attempts = rows.length;
    const uniqueStudents = new Set(rows.map((row) => row.studentId)).size;
    const earned = rows.reduce((sum, row) => sum + row.earned, 0);
    const max = rows.reduce((sum, row) => sum + row.max, 0);
    const scoreRate = max ? earned / max : 0;
    const scoreInterval = wilsonInterval(earned, max);
    const [expectedMin, expectedMax] = EXPECTED_RANGES[question.difficulty];
    let status: CalibrationStatus = "in-range";
    if (attempts < minimumAttempts || uniqueStudents < minimumStudents) status = "insufficient";
    else if (scoreInterval[0] > expectedMax) status = "easier-than-label";
    else if (scoreInterval[1] < expectedMin) status = "harder-than-label";
    const suggestedDifficulty = status === "easier-than-label"
      ? Math.max(1, question.difficulty - 1) as 1 | 2 | 3
      : status === "harder-than-label"
        ? Math.min(3, question.difficulty + 1) as 1 | 2 | 3
        : question.difficulty;
    const timedRows = rows.filter((row) => typeof row.timeSpentSec === "number");
    const optionCounts = rows.reduce<Record<string, number>>((counts, row) => {
      if (row.selected) counts[row.selected] = (counts[row.selected] ?? 0) + 1;
      return counts;
    }, {});
    const answered = Object.values(optionCounts).reduce((sum, value) => sum + value, 0);
    const ineffectiveDistractors = question.type === "mcq" && attempts >= minimumAttempts
      ? question.options
        .filter((option) => option.key !== question.answer && (optionCounts[option.key] ?? 0) / Math.max(1, answered) < 0.05)
        .map((option) => option.key)
      : [];
    const discrimination = discriminationIndex(rows);
    const medianTimeSec = median(timedRows.map((row) => row.timeSpentSec as number));
    const telemetryCoverage = timedRows.length / attempts;
    const changeRate = rows.filter((row) => (row.answerChanges ?? 0) > 0).length / attempts;
    const flagRate = rows.filter((row) => row.flagged).length / attempts;
    const qualityFlags: string[] = [];
    if (discrimination !== null && discrimination < 0.1) qualityFlags.push("low-discrimination");
    if (medianTimeSec !== null && medianTimeSec < 5) qualityFlags.push("too-fast");
    if (ineffectiveDistractors.length) qualityFlags.push("weak-distractors");
    if (attempts >= minimumAttempts && telemetryCoverage < 0.5) qualityFlags.push("low-telemetry-coverage");
    const confidence: CalibrationConfidence = attempts >= 100 && uniqueStudents >= 60
      ? "high"
      : attempts >= 50 && uniqueStudents >= 30
        ? "medium"
        : "low";

    return [{
      questionId,
      testId: question.testId,
      topicId: question.topicId,
      labelledDifficulty: question.difficulty,
      attempts,
      uniqueStudents,
      scoreRate,
      scoreInterval,
      expectedMin,
      expectedMax,
      status,
      suggestedDifficulty,
      confidence,
      discrimination,
      medianTimeSec,
      telemetryCoverage,
      changeRate,
      flagRate,
      optionCounts,
      ineffectiveDistractors,
      qualityFlags,
    }];
  }).sort((a, b) => {
    const anomalyA = a.status === "in-range" || a.status === "insufficient" ? 1 : 0;
    const anomalyB = b.status === "in-range" || b.status === "insufficient" ? 1 : 0;
    return anomalyA - anomalyB || b.attempts - a.attempts || a.questionId.localeCompare(b.questionId);
  });
}

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
    const suggestedDifficulty = status === "easier-than-label"
      ? Math.max(1, question.difficulty - 1) as 1 | 2 | 3
      : status === "harder-than-label"
        ? Math.min(3, question.difficulty + 1) as 1 | 2 | 3
        : question.difficulty;
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
      suggestedDifficulty,
    }];
  }).sort((a, b) => b.attempts - a.attempts || a.questionId.localeCompare(b.questionId));
}
