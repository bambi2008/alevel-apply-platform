import type { LongQuestion, MCQQuestion } from "./questions/types";

export type DeliveredMCQ = Omit<MCQQuestion, "answer" | "matrixAnswer" | "solution" | "optionExplanations" | "hint">;
export type DeliveredLong = Omit<LongQuestion, "fullSolution" | "parts"> & {
  parts: Array<Omit<LongQuestion["parts"][number], "solutionOutline" | "hint">>;
};
export type DeliveredQuestion = DeliveredMCQ | DeliveredLong;

export interface SubmittedAnswer {
  questionId: string;
  selected?: string;
  work?: Record<string, string>;
  answerImageIds?: Record<string, string[]>;
  selectedPromptId?: string;
  telemetry?: import("./telemetry").QuestionTelemetrySnapshot;
}

export interface DeliveredAttempt {
  id: string;
  testId: string;
  mode: string;
  startedAt: string;
  completedAt: string | null;
  reportId?: string | null;
  questions: DeliveredQuestion[];
  paper: null | {
    id: string; title: string; titleEn: string; description: string;
    instructions?: string[]; bestQuestionCount?: number; formatType?: string;
    modules: Array<{ id: string; title: string; titleEn: string; durationSec: number; questionIds: string[] }>;
  };
}

export interface ReviewedAnswer {
  question: import("./questions/types").Question;
  submission: SubmittedAnswer & { score: { earned: number; max: number; correct: boolean } | null; grading?: import("./grading").GradeResponse };
}

export interface AttemptReceipt {
  id: string;
  completedAt: string | null;
  reportId?: string | null;
  reviewed: ReviewedAnswer[];
}

export type PracticeCatalogItem = {
  id: string; topicId: string; difficulty: number; type: "mcq" | "long"; module: string;
};
