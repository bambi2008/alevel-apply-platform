import { MAT_QUESTIONS } from "./questions/mat";
import { STEP_QUESTIONS } from "./questions/step";
import { ESAT_BOUNDARY_QUESTIONS } from "./questions/esat-boundary";
import { TMUA_QUESTIONS } from "./questions/tmua";
import { PAT_QUESTIONS } from "./questions/pat";
import { LNAT_QUESTIONS } from "./questions/lnat";
import { TARA_QUESTIONS } from "./questions/tara";
import { BPHO_QUESTIONS } from "./questions/bpho";
import { BMO_QUESTIONS } from "./questions/bmo";
import { UCAT_QUESTIONS } from "./questions/ucat";
import { IELTS_QUESTIONS } from "./questions/ielts";
import { CSAT_QUESTIONS } from "./questions/csat";
import { CAIE9709_QUESTIONS } from "./questions/caie9709";
import type { Question } from "./questions/types";
import { releasedPracticeBank } from "./syllabus-release";
import { syllabusFingerprint } from "./syllabus-policy";

// Source inventory for the boundary review, not a claim that raw content passed.
export const REVIEWED_PRACTICE_SOURCES:Record<string,Question[]> = {
  mat:MAT_QUESTIONS,step:STEP_QUESTIONS,esat:ESAT_BOUNDARY_QUESTIONS,
  tmua:TMUA_QUESTIONS,pat:PAT_QUESTIONS,lnat:LNAT_QUESTIONS,tara:TARA_QUESTIONS,
  bpho:BPHO_QUESTIONS,bmo:BMO_QUESTIONS,ucat:UCAT_QUESTIONS,ielts:IELTS_QUESTIONS,
  csat:CSAT_QUESTIONS,caie9709:CAIE9709_QUESTIONS,
};

// Stable references avoid repeated hydration/session restore effects in the client.
const RELEASED_PRACTICE_BANKS = new Map(Object.entries(REVIEWED_PRACTICE_SOURCES)
  .map(([testId,bank])=>[testId,releasedPracticeBank(testId,bank)]));
const EMPTY:Question[]=[];
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
