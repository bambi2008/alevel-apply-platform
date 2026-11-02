import { describe, expect, it } from "vitest";
import { buildExamPerformanceReport, type ReportSession } from "./report";
import type { MCQQuestion, LongQuestion } from "./questions/types";

const questions: MCQQuestion[] = Array.from({ length: 20 }, (_, index) => ({
  id: `q-${index + 1}`,
  type: "mcq",
  testId: "tmua",
  topicId: index < 10 ? "algebra" : "logic",
  difficulty: ((index % 3) + 1) as 1 | 2 | 3,
  marks: 1,
  question: `Question ${index + 1}`,
  options: [{ key: "A", text: "A" }, { key: "B", text: "B" }],
  answer: "A",
  solution: "A is correct.",
}));

function session(): ReportSession {
  return {
    id: "current",
    testId: "tmua",
    mode: "paper",
    paperId: "mock-1",
    presetId: null,
    totalEarned: 12,
    totalMax: 20,
    timeUsedSec: 2200,
    completedAt: new Date("2026-07-24T10:00:00Z"),
    answers: questions.map((question, index) => ({
      questionId: question.id,
      type: "mcq",
      selected: index < 12 ? "A" : index < 18 ? "B" : null,
      work: null,
      earned: index < 12 ? 1 : 0,
      max: 1,
      feedback: null,
      timeSpentSec: 100 + index,
      answerChanges: index === 12 ? 2 : 0,
      visits: index === 12 ? 3 : 1,
      flagged: index === 12,
      firstSelected: index === 12 ? "A" : index < 12 ? "A" : "B",
    })),
  };
}

describe("exam performance report", () => {
  it("diagnoses fixed-paper speed against the real module duration", () => {
    const current = session();
    current.answers = current.answers.map(answer => ({ ...answer, selected: "A", earned: 1, flagged: false, answerChanges: 0, timeSpentSec: 240 }));
    current.totalEarned = 20;
    const report = buildExamPerformanceReport({ session: current, history: [], questions, topicMeta: () => undefined,
      modules: [{ id: "p1", title: "Paper 1", questionIds: questions.map(q => q.id), durationSec: 4500 }] });
    expect(report.behavior.fragileCorrect).toBe(0);
    expect(report.diagnosis.secureCount).toBe(20);
  });
  it.each([12, 8])("does not penalize unselected questions in a %s-choose-six paper", count => {
    const written: LongQuestion[] = Array.from({ length: count }, (_, index) => ({ id: `long-${index}`, testId: "step", topicId: "step-pure1", type: "long", difficulty: 3, totalMarks: 20,
      parts: [{ label: "a", marks: 20, question: "Q", solutionOutline: "A" }], fullSolution: "A" }));
    const current = session();
    current.testId = "step"; current.totalEarned = 120; current.totalMax = 120; current.timeUsedSec = 10800;
    current.answers = written.map((q, i) => ({ ...current.answers[0], questionId: q.id, type: "long", selected: null,
      work: { a: i < 6 ? "Complete work" : "", __answerImageIds: "{}" }, earned: i < 6 ? 20 : 0, max: 20, timeSpentSec: i < 6 ? 1800 : null, flagged: false, answerChanges: 0 }));
    const args = { session: current, history: [], questions: written, topicMeta: () => undefined, bestQuestionCount: 6,
      modules: [{ id: "written", title: "Written", questionIds: written.map(q => q.id), durationSec: 10800 }] };
    const report = buildExamPerformanceReport(args);
    expect(report.time).toMatchObject({ plannedSec: 10800, unanswered: 0, status: "balanced" });
    expect(report.score.completionPercent).toBe(100);
    expect(report.diagnosis.answers).toHaveLength(6);
    expect(report.diagnosis.priorityCount).toBe(0);
    expect(report.topics[0].percent).toBe(100);
    expect(report.dataQuality.note).toContain("未选答题不作为错题");
    // Only three attempted records must not silently reduce the six-answer target.
    const partial = buildExamPerformanceReport({ ...args, session: { ...current, answers: current.answers.slice(0, 3) } });
    expect(partial.time.unanswered).toBe(3);
    expect(partial.score.completionPercent).toBe(50);
  });
  it("builds score, topic, difficulty, time and diagnosis evidence", () => {
    const report = buildExamPerformanceReport({
      session: session(),
      history: [],
      questions,
      topicMeta: (topicId) => ({ title: topicId === "algebra" ? "代数" : "逻辑", titleEn: topicId }),
      modules: [
        { id: "p1", title: "Paper 1", questionIds: questions.slice(0, 10).map((q) => q.id), durationSec: 1500 },
        { id: "p2", title: "Paper 2", questionIds: questions.slice(10).map((q) => q.id), durationSec: 1500 },
      ],
    });
    expect(report.score).toMatchObject({ percent: 60, completedQuestions: 18, completionPercent: 90 });
    expect(report.modules).toHaveLength(2);
    expect(report.topics[0].topicId).toBe("logic");
    expect(report.difficulties.reduce((sum, row) => sum + row.questions, 0)).toBe(20);
    expect(report.diagnosis.priorityCount).toBeGreaterThan(0);
    expect(report.performanceBand.low).toBeLessThan(60);
    expect(report.performanceBand.high).toBeGreaterThan(60);
  });

  it("uses same-paper history first and reports trend without claiming an official prediction", () => {
    const current = session();
    const report = buildExamPerformanceReport({
      session: current,
      history: [
        { id: "old", mode: "paper", paperId: "mock-1", totalEarned: 10, totalMax: 20, completedAt: new Date("2026-07-01") },
        { id: "other", mode: "paper", paperId: "mock-2", totalEarned: 20, totalMax: 20, completedAt: new Date("2026-07-10") },
      ],
      questions,
      topicMeta: () => undefined,
    });
    expect(report.trend.delta).toBe(10);
    expect(report.trend.direction).toBe("up");
    expect(report.trend.points.map((point) => point.id)).not.toContain("other");
    expect(report.performanceBand.methodology).toContain("不是官方");
  });

  it("keeps negative-marking topic rates bounded and explains special scoring", () => {
    const current = session();
    current.totalEarned = 25;
    current.totalMax = 50;
    current.answers[0].earned = -1;
    const report = buildExamPerformanceReport({
      session: current,
      history: [],
      questions,
      topicMeta: () => undefined,
    });
    expect(report.topics.every((topic) => topic.percent >= 0)).toBe(true);
    expect(report.dataQuality.note).toContain("负分");
  });
});
