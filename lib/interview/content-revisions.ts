import corrections from "@/data/interview-revisions-20261026.json";
import { contentLanguageKey } from "../content-language-key";
import type { InterviewQuestion } from "./questions";

const reviewed = corrections.corrections as Record<string, { baseFingerprint: string; fields: Partial<Pick<InterviewQuestion, "prompt" | "approach" | "followUps">> }>;
/** Retain the original bank for history; fix reviewed prompt/LaTeX defects in new versions. */
export function reviseInterviewQuestion(original: InterviewQuestion): InterviewQuestion {
  const correction = reviewed[original.id];
  if (!correction) return original;
  if (contentLanguageKey(JSON.stringify(original)) !== correction.baseFingerprint) throw new Error(`Interview source changed before review: ${original.id}`);
  return { ...original, ...correction.fields, id: `${original.id}-rev20261026` };
}
