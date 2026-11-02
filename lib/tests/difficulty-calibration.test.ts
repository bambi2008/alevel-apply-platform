import { describe, expect, it } from "vitest";
import sourceTargets from "@/docs/review-inputs/2026-10-25/difficulty-fixes.json";
import codeTargets from "@/docs/review-inputs/2026-10-25/code-level-targets.json";
import { CALIBRATION_SUFFIX, DIFFICULTY_TARGETS, calibratePaper, calibrateQuestion, calibrationSourceId } from "./difficulty-calibration";
import { getMockPaper, getMockPapersForTest, getPreCalibrationMockPapersForTest } from "./mock-papers";
import { getReleasedPracticeQuestions, getPreCalibrationPracticeQuestions } from "./practice-banks";
import { syllabusFingerprint } from "./syllabus-policy";
import type { MCQQuestion } from "./questions/types";
import manifest from "@/data/question-bank/calibration-manifest-20261026.json";

describe("reviewed within-exam difficulty calibration", () => {
  it("accounts for all 1837 literal targets and all full position tables", () => {
    expect(Object.keys(sourceTargets)).toHaveLength(1837);
    for (const [id, value] of Object.entries(sourceTargets)) expect(DIFFICULTY_TARGETS[id]).toBe(value);
    for (const entries of Object.values(codeTargets.d_full_tables)) for (const [id, row] of Object.entries(entries)) expect(DIFFICULTY_TARGETS[id]).toBe(row.target);
    expect(Object.values(DIFFICULTY_TARGETS).every(v => [1,2,3].includes(v))).toBe(true);
  });
  it("retains uncertain cases and SJT fourth slots rather than filling quotas", () => {
    const q = { id: "ucat-m2-sjt-1-4", testId: "ucat", difficulty: 3 } as MCQQuestion;
    expect(calibrateQuestion(q)).toBe(q);
    expect(calibrateQuestion({ ...q, id: "tara-mk3-ct-12", difficulty: 2 }).difficulty).toBe(2);
    expect(calibrateQuestion({ ...q, id: "mat-b-009", difficulty: 3 }).difficulty).toBe(3);
    expect(calibrationSourceId("step-011-rev20261025-rev20261026-cal20261026")).toBe("step-011");
  });
  it("changes only reviewed difficulty and version IDs, never prompts, order, marks or keys", () => {
    for (const testId of Object.keys(manifest.exams)) {
      const old = getPreCalibrationPracticeQuestions(testId), next = getReleasedPracticeQuestions(testId);
      expect(next).toHaveLength(old.length);
      for (const [i, q] of old.entries()) {
        const snapshot = JSON.stringify(q), revised = next[i];
        expect(revised).toEqual({ ...q, id: revised.id, difficulty: revised.difficulty });
        expect(calibrateQuestion(q)).toEqual(revised);
        expect(JSON.stringify(q)).toBe(snapshot);
      }
      const previous = getPreCalibrationMockPapersForTest(testId), current = getMockPapersForTest(testId);
      expect(current).toHaveLength(previous.length);
      for (const paper of previous) {
        const snapshot = JSON.stringify(paper), revised = calibratePaper(paper);
        expect(getMockPaper(paper.id)).toBe(paper);
        expect(current.map(p => p.id)).toContain(revised.id);
        expect(revised.modules.map(s => s.questions.map(q => ({ ...q, id: calibrationSourceId(q.id), difficulty: 0 })))).toEqual(paper.modules.map(s => s.questions.map(q => ({ ...q, id: calibrationSourceId(q.id), difficulty: 0 }))));
        expect(JSON.stringify(paper)).toBe(snapshot);
        expect(calibratePaper(revised).id).not.toContain(CALIBRATION_SUFFIX + CALIBRATION_SUFFIX);
      }
    }
  });
  it("uses two one-hour BPhO Round 1 sections, preserving old 80-minute papers", () => {
    for (const p of getMockPapersForTest("bpho")) expect(p.modules.map(s => s.durationSec)).toEqual([3600,3600]);
    expect(getMockPaper("bpho-written-1")!.modules.map(s => s.durationSec)).toEqual([4800,4800]);
  });
  it("retains frozen manifest hashes for the new release", () => {
    for (const [id, exam] of Object.entries(manifest.exams)) {
      // Weekly additions append after this frozen calibrated release; they do
      // not rewrite its source/labels or require recapturing historical hashes.
      expect(syllabusFingerprint({ questions: getReleasedPracticeQuestions(id).slice(0, exam.releasedCount) } as never)).toBe(exam.releasedFingerprint);
      expect(Object.fromEntries(getMockPapersForTest(id).map(p => [p.id, syllabusFingerprint(p as never)]))).toEqual(exam.papers);
    }
  });
});
