"use client";

import type { InterviewQuestion } from "@/lib/interview/questions";
import { HK_INTERVIEW_FLOWS } from "@/lib/interview/hk-interview-flows";
import { TimedAssessmentSimulator } from "./cambridge-assessment-simulator";

export function HkInterviewSimulator({
  subjectId,
  subjectName,
  questions,
}: {
  subjectId: string;
  subjectName: string;
  questions: InterviewQuestion[];
}) {
  const flow = HK_INTERVIEW_FLOWS.find((item) => item.subjectId === subjectId);
  if (!flow) return null;
  return <TimedAssessmentSimulator flow={flow} subjectName={subjectName} questions={questions} showThinkingChecklist={subjectId === "hk-stem"} />;
}
