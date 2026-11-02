import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import candidates from "@/data/question-bank/candidates-20261028.json";
import updates from "@/data/question-bank/practice-updates.json";
import calibration from "@/data/question-bank/calibration-manifest-20261026.json";
import { getReleasedPracticeQuestions } from "./practice-banks";
import { getMockPapersForTest } from "./mock-papers";
import { practiceContentFingerprint, getPracticeReleaseHistory } from "./practice-updates";
import { syllabusFingerprint } from "./syllabus-policy";
import { buildQuestionBankAudit } from "./audit";

describe("independently reviewed October 28 practice-only release", () => {
  it("binds the approved final actual draft snapshot to exact released question copies", () => {
    expect(createHash("sha256").update(readFileSync("data/question-bank/candidates-20261028.json")).digest("hex"))
      .toBe("0e7e3c727c490eb57cee1912b87a7a5a2783e53d12144f59ddbbaa807dd49aff");
    for (const testId of ["bpho", "tmua"]) {
      const release = updates.releases.find(r => r.id === `${testId}-practice-challenge-20261028`)!;
      expect(release.status).toBe("published");
      expect(release.questions).toEqual(candidates.questions.filter(q => q.testId === testId));
      expect(release.subjectReview).not.toBe(release.teachingReview);
      const references = readFileSync("docs/PRACTICE_CHALLENGE_REVIEW_2026-10-28.md", "utf8");
      expect(references).toContain("one separately running assistant");
      for (const question of release.questions) {
        expect(release.questionFingerprints?.[question.id as keyof typeof release.questionFingerprints]).toBe(practiceContentFingerprint(question));
        expect(getReleasedPracticeQuestions(testId)).toContainEqual(question);
      }
    }
  });
  it("retains all frozen fixed mocks, changes no original practice prefix and fills only real gaps", () => {
    for (const [id, frozen] of Object.entries(calibration.exams)) {
      const bank = getReleasedPracticeQuestions(id);
      const additions = candidates.questions.filter(q => q.testId === id);
      expect(bank).toHaveLength(frozen.releasedCount + additions.length);
      expect(syllabusFingerprint({ questions: bank.slice(0, frozen.releasedCount) } as never)).toBe(frozen.releasedFingerprint);
      const papers = getMockPapersForTest(id);
      expect(Object.fromEntries(papers.map(p => [p.id, syllabusFingerprint(p as never)]))).toEqual(frozen.papers);
      expect(papers.flatMap(p => p.modules.flatMap(m => m.questions)).some(q => additions.some(a => a.id === q.id))).toBe(false);
    }
    expect(buildQuestionBankAudit().issues.filter(i => i.severity === "warning" || i.severity === "critical")).toEqual([]);
    for (const [id, count] of [["bpho", 5], ["tmua", 2]] as const) expect(getPracticeReleaseHistory(id)[0]).toMatchObject({ kind: "addition", addedQuestions: count });
  });
});
