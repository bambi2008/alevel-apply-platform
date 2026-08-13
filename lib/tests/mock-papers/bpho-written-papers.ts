import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import type { LongQuestion, MCQQuestion } from "@/lib/tests/questions/types";

function findShort(id: string): MCQQuestion {
  const question = BPHO_QUESTIONS.find(
    (item): item is MCQQuestion => item.id === id && item.type === "mcq"
  );
  if (!question) throw new Error(`Missing BPhO Section 1 question: ${id}`);
  return question;
}

function findLong(id: string): LongQuestion {
  const question = BPHO_QUESTIONS.find(
    (item): item is LongQuestion => item.id === id && item.type === "long"
  );
  if (!question) throw new Error(`Missing BPhO Section 2 question: ${id}`);
  return question;
}

function makeSection1(paper: number, ids: string[]): LongQuestion[] {
  return ids.map((id, index) => {
    const question = findShort(id);
    return {
      id: `bpho-written-${paper}-s1-${String(index + 1).padStart(2, "0")}`,
      type: "long",
      testId: "bpho",
      topicId: question.topicId,
      difficulty: question.difficulty,
      totalMarks: question.marks,
      context: question.question,
      parts: [{
        label: "解答",
        marks: question.marks,
        question: "写出必要的物理原理、计算过程与最终答案。",
        solutionOutline: question.solution,
        hint: question.hint,
      }],
      fullSolution: question.solution,
    };
  });
}

function makeSection2(paper: number, ids: string[]): LongQuestion[] {
  return ids.map((id, index) => ({
    ...findLong(id),
    id: `bpho-written-${paper}-s2-${String(index + 1).padStart(2, "0")}`,
  }));
}

export const BPHO_WRITTEN_1_S1 = makeSection1(1, [
  "bpho-s1-c-007", "bpho-s1-c-019", "bpho-s1-b-008", "bpho-s1-b-024",
  "bpho-s1-045", "bpho-s1-b-018", "bpho-s1-057", "bpho-s1-c-036",
  "bpho-s1-c-032", "bpho-s1-c-046", "bpho-s1-b-039", "bpho-s1-089",
  "bpho-s1-b-047",
]);

export const BPHO_WRITTEN_1_S2 = makeSection2(1, [
  "bpho4-rotating-habitat-001", "bpho5-michelson-001",
]);

export const BPHO_WRITTEN_2_S1 = makeSection1(2, [
  "bpho-s1-c-018", "bpho-s1-b-014", "bpho-s1-029", "bpho-s1-c-022",
  "bpho-s1-039", "bpho-s1-b-021", "bpho-s1-060", "bpho-s1-b-028",
  "bpho-s1-b-030", "bpho-s1-069", "bpho-s1-074", "bpho-s1-081",
  "bpho-s1-084",
]);

export const BPHO_WRITTEN_2_S2 = makeSection2(2, [
  "bpho5-cyclotron-001", "bpho5-carnot-machines-001",
]);

export const BPHO_WRITTEN_3_S1 = makeSection1(3, [
  "bpho-s1-013", "bpho-s1-017", "bpho-s1-001", "bpho-s1-b-017",
  "bpho-s1-b-020", "bpho-s1-c-025", "bpho-s1-058", "bpho-s1-c-040",
  "bpho-s1-b-031", "bpho-s1-073", "bpho-s1-075", "bpho-s1-b-048",
  "bpho-s1-085",
]);

export const BPHO_WRITTEN_3_S2 = makeSection2(3, [
  "bpho5-radioisotope-001", "bpho3-coupled-oscillators-001",
]);
