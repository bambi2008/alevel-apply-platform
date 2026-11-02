import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import baseline from "@/data/question-bank/practice-baseline.json";
import contentManifest from "@/data/question-bank/content-manifest-20261026.json";
import calibrationManifest from "@/data/question-bank/calibration-manifest-20261026.json";
import updates from "@/data/question-bank/practice-updates.json";
import { getReleasedPracticeQuestions, getPreCalibrationPracticeQuestions, REVIEWED_PRACTICE_SOURCES } from "./practice-banks";
import { getMockPapersForTest, getPreCalibrationMockPapersForTest, getMockPaper, getAllMockQuestions } from "./mock-papers";
import { releasedPracticeBank } from "./syllabus-release";
import { reviewedQuestion } from "./review-corrections";
import { getQuestionById } from "./lookup";
import { syllabusFingerprint } from "./syllabus-policy";
import { getPracticeReleaseHistory, practiceContentFingerprint, validatePracticeUpdates } from "./practice-updates";
import { GET } from "../../app/api/question-bank/updates/route";
import { NextRequest } from "next/server";

describe("data-only weekly practice updates", () => {
  it("retains immutable original sources/papers and the explicitly reviewed correction baseline", () => {
    for (const [id, expected] of Object.entries(baseline.exams)) {
      expect(REVIEWED_PRACTICE_SOURCES[id]).toHaveLength(expected.rawCount);
      expect(syllabusFingerprint({ questions: REVIEWED_PRACTICE_SOURCES[id] } as never)).toBe(expected.rawFingerprint);
      // Original approved data and historical papers never drift, even when a
      // separately reviewed corrective release creates new IDs.
      expect(syllabusFingerprint({ questions: releasedPracticeBank(id, REVIEWED_PRACTICE_SOURCES[id]).map(reviewedQuestion) } as never)).toBe(expected.releasedFingerprint);
      for (const [paperId, fingerprint] of Object.entries(expected.papers)) expect(syllabusFingerprint(getMockPaper(paperId)! as never)).toBe(fingerprint);
      const current = contentManifest.exams[id as keyof typeof contentManifest.exams];
      const bank = getPreCalibrationPracticeQuestions(id);
      const additions = updates.releases.filter(release => release.testId === id && release.status === "published").reduce((sum, release) => sum + release.questions.length, 0);
      expect(bank).toHaveLength(current.releasedCount + additions);
      expect(syllabusFingerprint({ questions: bank.slice(0, current.releasedCount) } as never)).toBe(current.releasedFingerprint);
      expect(Object.fromEntries(getPreCalibrationMockPapersForTest(id).map(paper => [paper.id, syllabusFingerprint(paper as never)]))).toEqual(current.papers);
      const calibrated = calibrationManifest.exams[id as keyof typeof calibrationManifest.exams];
      expect(syllabusFingerprint({ questions: getReleasedPracticeQuestions(id).slice(0, calibrated.releasedCount) } as never)).toBe(calibrated.releasedFingerprint);
      expect(Object.fromEntries(getMockPapersForTest(id).map(paper => [paper.id, syllabusFingerprint(paper as never)]))).toEqual(calibrated.papers);
    }
  });
  it("routes all data-only questions through historical lookup without changing the fixed registry", () => {
    for (const id of Object.keys(baseline.exams)) for (const q of getReleasedPracticeQuestions(id)) expect(getQuestionById(q.id)).toEqual(q);
    expect(readFileSync("lib/tests/mock-papers/index.ts", "utf8")).not.toMatch(/practice-updates|practice-base|practiceAdditions/);
  });
  const original = getReleasedPracticeQuestions("tmua")[0];
  const q = { ...original, id: "tmua-weekly-fixture-001" };
  const release = { ...updates.releases.find(r => r.testId === "tmua")!, id: "test-addition", kind: "addition", subjectReview: "subject-fixture", teachingReview: "teaching-fixture", questions: [q], questionFingerprints: { [q.id]: practiceContentFingerprint(q) } };
  const baseIds = new Set(Object.values(REVIEWED_PRACTICE_SOURCES).flatMap(bank => bank.map(item => item.id)));
  it("accepts reviewed data-only additions without a code edit", () => expect(validatePracticeUpdates({ schemaVersion: 1, releases: [release] }, baseIds)[0].questions).toHaveLength(1));
  it("rejects overwriting an old ID and malformed/out-of-scope data", () => {
    for (const bad of [{ ...q, id: original.id }, { ...q, testId: "esat" }, { ...q, topicId: "esat-math" }, { ...q, difficulty: 99 }]) {
      expect(() => validatePracticeUpdates({ schemaVersion: 1, releases: [{ ...release, questions: [bad] }] }, baseIds)).toThrow();
    }
  });
  it("requires independent reviews and a matching published content fingerprint", () => {
    expect(() => validatePracticeUpdates({ schemaVersion: 1, releases: [{ ...release, teachingReview: release.subjectReview }] }, baseIds)).toThrow();
    expect(() => validatePracticeUpdates({ schemaVersion: 1, releases: [{ ...release, questionFingerprints: {} }] }, baseIds)).toThrow();
  });
  it("has no new IDs colliding with any mock-only question", () => {
    const reserved = new Set(getAllMockQuestions().map(item => item.id));
    for (const release of updates.releases) for (const question of release.questions as Array<{ id: string }>) expect(reserved.has(question.id)).toBe(false);
  });
  it("publishes truthful baseline notes without inventing additions or exposing review metadata", () => {
    const history = getPracticeReleaseHistory("tmua");
    expect(history.length).toBeGreaterThan(0);
    expect(history.find(update => update.kind === "baseline")).toMatchObject({ addedQuestions: 0 });
    expect(history[0]).toMatchObject({ kind: "addition", addedQuestions: 2 });
    expect(history.find(update => update.kind === "correction")).toMatchObject({ addedQuestions: 0 });
    expect(history[0]).not.toHaveProperty("questions");
    expect(history[0]).not.toHaveProperty("subjectReview");
    expect(() => validatePracticeUpdates({ schemaVersion: 1, releases: [{ ...release, kind: "correction" }] }, baseIds)).toThrow("Only an addition can add questions");
  });
  it("returns at most three update summaries for a valid exam", async () => {
    const response = GET(new NextRequest("http://localhost:3100/api/question-bank/updates?testId=tmua"));
    expect(response.status).toBe(200);
    expect((await response.json()).updates.length).toBeLessThanOrEqual(3);
    expect(GET(new NextRequest("http://localhost:3100/api/question-bank/updates?testId=unknown")).status).toBe(400);
  });
});
