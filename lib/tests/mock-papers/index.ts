// 完整模拟卷注册表。每套卷 = 若干个独立计时的模块。
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { ESAT_MK1_MATH, ESAT_MK1_PHYS } from "./esat-mock-1";
import { ESAT_MK2_MATH, ESAT_MK2_PHYS } from "./esat-mock-2";
import { ESAT_MK3_MATH, ESAT_MK3_CHEM } from "./esat-mock-3";
import { ESAT_MK4_MATH, ESAT_MK4_BIO } from "./esat-mock-4";
import { ESAT_MK5_MATH, ESAT_MK5_PHYS } from "./esat-mock-5";
import { ESAT_MK6_MATH, ESAT_MK6_PHYS } from "./esat-mock-6";
import { ESAT_MK7_MATH, ESAT_MK7_PHYS } from "./esat-mock-7";
import { ESAT_MK8_MATH, ESAT_MK8_CHEM } from "./esat-mock-8";
import { ESAT_MK9_MATH, ESAT_MK9_BIO } from "./esat-mock-9";

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

export const ESAT_MOCK_2: MockPaper = {
  id: "esat-mock-2",
  testId: "esat",
  title: "ESAT 模拟卷二",
  titleEn: "ESAT Mock Paper 2",
  description:
    "第二套完整模拟卷：每个模块 27 题、40 分钟独立计时、五选一、无负分。题目与模拟卷一及练习题库均不重复，可用于二次限时模拟、检验进步。",
  modules: [
    {
      id: "math",
      title: "数学（模块一）",
      titleEn: "Mathematics (Module 1)",
      durationSec: 40 * 60,
      questions: ESAT_MK2_MATH,
    },
    {
      id: "physics",
      title: "物理（模块二）",
      titleEn: "Physics (Module 2)",
      durationSec: 40 * 60,
      questions: ESAT_MK2_PHYS,
    },
  ],
};

export const ESAT_MOCK_3: MockPaper = {
  id: "esat-mock-3",
  testId: "esat",
  title: "ESAT 模拟卷三（化学方向）",
  titleEn: "ESAT Mock Paper 3 (Chemistry)",
  description:
    "面向化学方向考生的完整模拟卷：数学（模块一）+ 化学（模块二），每模块 27 题、40 分钟独立计时、五选一、无负分。题目全新原创，与练习题库及其他模拟卷均不重复。",
  modules: [
    {
      id: "math",
      title: "数学（模块一）",
      titleEn: "Mathematics (Module 1)",
      durationSec: 40 * 60,
      questions: ESAT_MK3_MATH,
    },
    {
      id: "chemistry",
      title: "化学（模块二）",
      titleEn: "Chemistry (Module 2)",
      durationSec: 40 * 60,
      questions: ESAT_MK3_CHEM,
    },
  ],
};

export const ESAT_MOCK_4: MockPaper = {
  id: "esat-mock-4",
  testId: "esat",
  title: "ESAT 模拟卷四（生物方向）",
  titleEn: "ESAT Mock Paper 4 (Biology)",
  description:
    "面向生物方向考生（自然科学生物 / 兽医）的完整模拟卷：数学（模块一）+ 生物（模块二），每模块 27 题、40 分钟独立计时、五选一、无负分。题目全新原创，与练习题库及其他模拟卷均不重复。",
  modules: [
    {
      id: "math",
      title: "数学（模块一）",
      titleEn: "Mathematics (Module 1)",
      durationSec: 40 * 60,
      questions: ESAT_MK4_MATH,
    },
    {
      id: "biology",
      title: "生物（模块二）",
      titleEn: "Biology (Module 2)",
      durationSec: 40 * 60,
      questions: ESAT_MK4_BIO,
    },
  ],
};

export const ESAT_MOCK_5: MockPaper = {
  id: "esat-mock-5",
  testId: "esat",
  title: "ESAT 模拟卷五（工程方向 · 对标 ENGAA）",
  titleEn: "ESAT Mock Paper 5 (Engineering)",
  description:
    "工程方向完整模拟卷，参照剑桥 ENGAA 真题的题型、考点与难度校准（题目全新原创，未照搬真题，也不与练习题库及其他模拟卷重复）。数学 + 物理各 27 题、每模块 40 分钟独立计时、五选一、无负分。",
  modules: [
    {
      id: "math",
      title: "数学（含进阶）",
      titleEn: "Mathematics (incl. advanced)",
      durationSec: 40 * 60,
      questions: ESAT_MK5_MATH,
    },
    {
      id: "physics",
      title: "物理（含进阶）",
      titleEn: "Physics (incl. advanced)",
      durationSec: 40 * 60,
      questions: ESAT_MK5_PHYS,
    },
  ],
};

export const ESAT_MOCK_6: MockPaper = {
  id: "esat-mock-6",
  testId: "esat",
  title: "ESAT 模拟卷六（后期趋势卷 · 对标 2019–2023）",
  titleEn: "ESAT Mock Paper 6 (Recent-trend)",
  description:
    "依据 ENGAA 2016–2023 真题演变设计：出题人自 2019 年将卷子由 54 题/80 分钟改为 40 题/60 分钟，以「少而精、多步推理」的更硬题目补偿，并加重进阶数学与电路/波/热。本卷据此校准，难度偏高、综合多步题为主。数学 + 物理各 27 题、每模块 40 分钟、五选一、无负分。题目全新原创，与真题及其他卷均不重复。",
  modules: [
    { id: "math", title: "数学（含进阶）", titleEn: "Mathematics (incl. advanced)", durationSec: 40 * 60, questions: ESAT_MK6_MATH },
    { id: "physics", title: "物理（含进阶）", titleEn: "Physics (incl. advanced)", durationSec: 40 * 60, questions: ESAT_MK6_PHYS },
  ],
};

export const ESAT_MOCK_7: MockPaper = {
  id: "esat-mock-7",
  testId: "esat",
  title: "ESAT 模拟卷七（高频核心卷 · 跨 2016–2023）",
  titleEn: "ESAT Mock Paper 7 (High-frequency core)",
  description:
    "提取 ENGAA 2016–2023 八年真题中跨年稳定、几乎每年必考的「高频核心」考点，组成的打基本功均衡卷（与偏难的卷六互补）。数学 + 物理各 27 题、每模块 40 分钟、五选一、无负分。难度以基础—中等为主。题目全新原创，与真题及其他卷均不重复。",
  modules: [
    { id: "math", title: "数学（高频核心）", titleEn: "Mathematics (core)", durationSec: 40 * 60, questions: ESAT_MK7_MATH },
    { id: "physics", title: "物理（高频核心）", titleEn: "Physics (core)", durationSec: 40 * 60, questions: ESAT_MK7_PHYS },
  ],
};

export const ESAT_MOCK_8: MockPaper = {
  id: "esat-mock-8",
  testId: "esat",
  title: "ESAT 模拟卷八（自然科学方向 · 数学 + 化学 · 对标 NSAA）",
  titleEn: "ESAT Mock Paper 8 (Natural Sciences · Chemistry)",
  description:
    "依据 NSAA 2016–2023 真题校准的自然科学方向卷，补足化学（与工程卷五/六/七的数理侧互补）。数学 + 化学各 27 题、每模块 40 分钟、五选一、无负分。题目全新原创，与真题及其他卷均不重复。",
  modules: [
    { id: "math", title: "数学", titleEn: "Mathematics", durationSec: 40 * 60, questions: ESAT_MK8_MATH },
    { id: "chemistry", title: "化学", titleEn: "Chemistry", durationSec: 40 * 60, questions: ESAT_MK8_CHEM },
  ],
};

export const ESAT_MOCK_9: MockPaper = {
  id: "esat-mock-9",
  testId: "esat",
  title: "ESAT 模拟卷九（自然科学方向 · 数学 + 生物 · 对标 NSAA）",
  titleEn: "ESAT Mock Paper 9 (Natural Sciences · Biology)",
  description:
    "依据 NSAA 2016–2023 真题校准的自然科学方向卷，补足生物（与化学卷八、工程卷共同构成完整科目覆盖）。数学 + 生物各 27 题、每模块 40 分钟、五选一、无负分。题目全新原创，与真题及其他卷均不重复。",
  modules: [
    { id: "math", title: "数学", titleEn: "Mathematics", durationSec: 40 * 60, questions: ESAT_MK9_MATH },
    { id: "biology", title: "生物", titleEn: "Biology", durationSec: 40 * 60, questions: ESAT_MK9_BIO },
  ],
};

const ALL_MOCK_PAPERS: MockPaper[] = [ESAT_MOCK_1, ESAT_MOCK_2, ESAT_MOCK_3, ESAT_MOCK_4, ESAT_MOCK_5, ESAT_MOCK_6, ESAT_MOCK_7, ESAT_MOCK_8, ESAT_MOCK_9];

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
