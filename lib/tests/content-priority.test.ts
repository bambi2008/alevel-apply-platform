import { describe, expect, it } from "vitest";
import { buildContentPriorities, contentPrioritiesCsv, PRIORITY_WEIGHTS, type PriorityAttempt, type PriorityFeedback, type PriorityTopic } from "./content-priority";

const now = new Date("2026-10-26T04:00:00Z"), recent = new Date("2026-10-25T04:00:00Z");
const topic = (testId: string, topicId: string, count = 10): PriorityTopic => ({ testId, topicId, title: topicId, titleEn: topicId, questionCount: count });
function cohort(testId: string, topicId: string, count: number, wrong = false): PriorityAttempt[] {
  return Array.from({ length: count }, (_, index) => ({ studentKey: `private-student-${index}@example.test`, testId, topicId, questionKey: `${topicId}-q`, createdAt: recent, wrong }));
}
describe("within-exam supplement priorities", () => {
  it("uses the owner-approved weights", () => expect(Object.values(PRIORITY_WEIGHTS).reduce<number>((a, b) => a + b, 0)).toBe(1));
  it("computes the exact weighted maximum/minimum only inside each exam", () => {
    const topics = [topic("a", "a1", 1), topic("a", "a2", 100), topic("b", "b1", 1000)];
    const attempts = [...cohort("a", "a1", 10, true), ...cohort("a", "a2", 5), ...cohort("b", "b1", 500)];
    const feedback: PriorityFeedback[] = [{ studentKey: "private", testId: "a", topicId: "a1", questionKey: "q", kind: "MORE_LIKE_THIS", createdAt: recent }];
    const rows = buildContentPriorities(topics, attempts, feedback, now).rows;
    expect(rows.find(r => r.topicId === "a1")?.score).toBe(100);
    expect(rows.find(r => r.topicId === "a2")?.score).toBe(0);
    expect(rows.find(r => r.topicId === "b1")?.score).toBe(50);
    expect(buildContentPriorities(topics.slice(0, 2), attempts, feedback, now).rows).toEqual(rows.filter(r => r.testId === "a"));
  });
  it("suppresses every personal-data statistic below five distinct students", () => {
    const attempts = cohort("a", "a1", 4);
    attempts.push(...Array.from({ length: 10 }, () => attempts[0]));
    const result = buildContentPriorities([topic("a", "a1")], attempts, [], now);
    expect(result.rows[0]).toMatchObject({ status: "insufficient_sample", students: null, gradedAnswers: null, wrongAnswers: null, errorRate: null, feedbackCount: null, score: null });
    expect(JSON.stringify(result)).not.toMatch(/private-student|example\.test|studentKey|questionKey/);
  });
  it("counts a student once per topic and the first answer once per question", () => {
    const attempts = cohort("a", "a1", 5, true);
    attempts.push(...attempts.map(row => ({ ...row, createdAt: new Date("2026-10-25T05:00:00Z"), wrong: false })));
    const row = buildContentPriorities([topic("a", "a1")], attempts.reverse(), [], now).rows[0];
    expect(row).toMatchObject({ students: 5, gradedAnswers: 5, wrongAnswers: 5, errorRate: 1, score: 50 });
  });
  it("uses exact inclusive-start/exclusive-end 28-day bounds", () => {
    const start = new Date(now.getTime() - 28 * 86_400_000);
    const attempts = cohort("a", "a1", 5).map(row => ({ ...row, createdAt: start }));
    attempts.push({ ...attempts[0], studentKey: "at-end", createdAt: now }, { ...attempts[0], studentKey: "too-old", createdAt: new Date(+start - 1) });
    expect(buildContentPriorities([topic("a", "a1")], attempts, [], now).rows[0].students).toBe(5);
  });
  it("deduplicates feedback by student/question/type, not only by question", () => {
    const row: PriorityFeedback = { studentKey: "one", testId: "a", topicId: "a1", questionKey: "q", kind: "ERROR", createdAt: recent };
    const feedback: PriorityFeedback[] = [row, row, { ...row, kind: "TOO_HARD" }, { ...row, kind: "MORE_LIKE_THIS" }, { ...row, studentKey: "two" }, { ...row, createdAt: new Date(+now - 29 * 86_400_000) }];
    expect(buildContentPriorities([topic("a", "a1")], cohort("a", "a1", 5), feedback, now).rows[0]).toMatchObject({ feedbackCount: 4, errorFeedback: 2, hardFeedback: 1, moreFeedback: 1 });
  });
  it("does not fabricate a zero error rate for ungraded written answers", () => {
    const attempts = cohort("a", "a1", 5).map(row => ({ ...row, wrong: null }));
    expect(buildContentPriorities([topic("a", "a1")], attempts, [], now).rows[0]).toMatchObject({ status: "ungraded", students: 5, errorRate: null, score: null });
  });
  it("represents an empty catalogue without invented observations", () => expect(buildContentPriorities([], [], [], now).rows).toEqual([]));
  it("exports only aggregate, small-sample-masked, formula-safe columns", () => {
    const result = buildContentPriorities([topic("a", '=HYPERLINK("evil")'), topic("a", "small")], cohort("a", '=HYPERLINK("evil")', 5), [], now);
    const csv = contentPrioritiesCsv(result);
    expect(csv).toContain("样本不足");
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).not.toMatch(/private-student|example\.test|studentKey|userId|questionKey/);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv.trim().split("\r\n")).toHaveLength(3);
  });
});
