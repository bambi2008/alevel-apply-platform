import practiceBase from "@/data/question-bank/practice-base.json";
import type { Question } from "./questions/types";
import { releasedPracticeBank } from "./syllabus-release";
import { reviewedQuestion, verifyReviewCorrections } from "./review-corrections";
import { syllabusFingerprint } from "./syllabus-policy";
import { practiceAdditions } from "./practice-updates";
import { reviseCurrentQuestion, verifyContentCorrections } from "./content-revisions";
import { calibrateQuestion } from "./difficulty-calibration";

// Data baseline retains raw archived/released distinctions and approval checks.
// Fixed mock papers keep their independent immutable registry and legacy sources.
export const REVIEWED_PRACTICE_SOURCES = practiceBase as unknown as Record<string, Question[]>;
const ADDITIONS = practiceAdditions(new Set(Object.values(REVIEWED_PRACTICE_SOURCES).flatMap(bank => bank.flatMap(q => [q.id, reviewedQuestion(q).id, reviseCurrentQuestion(reviewedQuestion(q)).id]))));

// Stable references avoid repeated hydration/session restore effects in the client.
verifyReviewCorrections();
verifyContentCorrections();
const PRE_CALIBRATION_PRACTICE_BANKS = new Map(Object.entries(REVIEWED_PRACTICE_SOURCES)
  .map(([testId,bank])=>[testId,[...releasedPracticeBank(testId,bank).map(reviewedQuestion).map(reviseCurrentQuestion), ...ADDITIONS.filter(q => q.testId === testId)]]));
const RELEASED_PRACTICE_BANKS = new Map([...PRE_CALIBRATION_PRACTICE_BANKS].map(([id, bank]) => [id, bank.map(q => calibrateQuestion(q))]));
const EMPTY:Question[]=[];
/** Audit-only original release: historical versions remain immutable. */
export function getPreCalibrationPracticeQuestions(testId:string):Question[] { return PRE_CALIBRATION_PRACTICE_BANKS.get(testId) ?? EMPTY; }
export function getReleasedPracticeQuestions(testId:string):Question[] {
  return RELEASED_PRACTICE_BANKS.get(testId) ?? EMPTY;
}
export function isReleasedPublishedQuestion(testId:string,question:Question):boolean {
  const canonical=getReleasedPracticeQuestions(testId).find(q=>q.id===question.id);
  return !!canonical && syllabusFingerprint(canonical)===syllabusFingerprint(question);
}
export function mergeReleasedPracticeQuestions(testId:string,published:Question[]):Question[] {
  // Database approval alone cannot change the syllabus-reviewed static release.
  // Historical lookup is deliberately separate and retains archived content.
  const bank=new Map(getReleasedPracticeQuestions(testId).map(q=>[q.id,q]));
  for(const q of published) if(isReleasedPublishedQuestion(testId,q)) bank.set(q.id,q);
  return [...bank.values()];
}
