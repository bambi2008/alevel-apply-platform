// 完整模拟卷注册表。每套卷 = 若干个独立计时的模块。
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { ESAT_MK1_MATH, ESAT_MK1_PHYS } from "./esat-mock-1";

export interface MockModule {
  id: string;
  title: string;
  titleEn: string;
  durationSec: number; // 该模块独立计时时长
  questions: MCQQuestion[];
}

export interface MockPaper {
  id: string;
  testId: string;
  title: string;
  titleEn: string;
  description: string;
  modules: MockModule[];
}

export const ESAT_MOCK_1: MockPaper = {
  id: "esat-mock-1",
  testId: "esat",
  title: "ESAT 模拟卷一",
  titleEn: "ESAT Mock Paper 1",
  description:
    "对标真实 ESAT 结构的完整模拟卷：每个模块 27 题、40 分钟独立计时、五选一、无负分。题目为全新原创，未在练习题库中出现，可营造真实考试氛围。",
  modules: [
    {
      id: "math",
      title: "数学（模块一）",
      titleEn: "Mathematics (Module 1)",
      durationSec: 40 * 60,
      questions: ESAT_MK1_MATH,
    },
    {
      id: "physics",
      title: "物理（模块二）",
      titleEn: "Physics (Module 2)",
      durationSec: 40 * 60,
      questions: ESAT_MK1_PHYS,
    },
  ],
};

const ALL_MOCK_PAPERS: MockPaper[] = [ESAT_MOCK_1];

export function getMockPapersForTest(testId: string): MockPaper[] {
  return ALL_MOCK_PAPERS.filter((p) => p.testId === testId);
}

export function getMockPaper(paperId: string): MockPaper | undefined {
  return ALL_MOCK_PAPERS.find((p) => p.id === paperId);
}

/** 给 lookup 用：扁平化所有模拟卷题目，便于历史回看/学情分析按 id 反查 */
export function getAllMockQuestions(): MCQQuestion[] {
  return ALL_MOCK_PAPERS.flatMap((p) => p.modules.flatMap((m) => m.questions));
}
