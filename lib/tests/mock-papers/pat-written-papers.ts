import { PAT_MK1_MCQ } from "./pat-mock-1";
import { PAT_MK2_MCQ } from "./pat-mock-2";
import { PAT_MK3_MCQ } from "./pat-mock-3";
import type { LongQuestion, MCQQuestion } from "@/lib/tests/questions/types";

function convertPaper(paper: number, source: MCQQuestion[], ids: string[]): LongQuestion[] {
  return ids.map((id, index) => {
    const question = source.find((item) => item.id === id);
    if (!question) throw new Error(`Missing PAT written-extension question: ${id}`);
    return {
      id: `pat-written-${paper}-${String(index + 1).padStart(2, "0")}`,
      type: "long",
      testId: "pat",
      topicId: question.topicId,
      difficulty: question.difficulty,
      totalMarks: question.marks,
      context: question.question,
      parts: [{
        label: "解答",
        marks: question.marks,
        question: "写出所用物理原理、关键公式、必要计算和最终结论。",
        solutionOutline: question.solution,
        hint: question.hint,
      }],
      fullSolution: question.solution,
    };
  });
}

export const PAT_WRITTEN_1 = convertPaper(1, PAT_MK1_MCQ, [
  "pat-mk1-01", "pat-mk1-02", "pat-mk1-03", "pat-mk1-05",
  "pat-mk1-06", "pat-mk1-08", "pat-mk1-09", "pat-mk1-12",
  "pat-mk1-13", "pat-mk1-14", "pat-mk1-15", "pat-mk1-18",
]);

export const PAT_WRITTEN_2 = convertPaper(2, PAT_MK2_MCQ, [
  "pat-mk2-01", "pat-mk2-02", "pat-mk2-03", "pat-mk2-05",
  "pat-mk2-07", "pat-mk2-09", "pat-mk2-10", "pat-mk2-11",
  "pat-mk2-12", "pat-mk2-15", "pat-mk2-16", "pat-mk2-19",
]);

export const PAT_WRITTEN_3 = convertPaper(3, PAT_MK3_MCQ, [
  "pat-mk3-01", "pat-mk3-02", "pat-mk3-05", "pat-mk3-06",
  "pat-mk3-08", "pat-mk3-10", "pat-mk3-11", "pat-mk3-12",
  "pat-mk3-14", "pat-mk3-17", "pat-mk3-20", "pat-mk3-24",
]);
