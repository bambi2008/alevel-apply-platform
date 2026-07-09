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
import { ESAT_MK10_MAG, ESAT_MK10_SCI } from "./esat-mock-10";
import { TMUA_MK1_P1, TMUA_MK1_P2 } from "./tmua-mock-1";
import { MAT_MK1_MCQ } from "./mat-mock-1";
import { MAT_MK2_MCQ } from "./mat-mock-2";
import { MAT_MK3_MCQ } from "./mat-mock-3";
import { MAT_MK4_MCQ } from "./mat-mock-4";
import { PAT_MK1_MCQ } from "./pat-mock-1";
import { PAT_MK2_MCQ } from "./pat-mock-2";
import { PAT_MK3_MCQ } from "./pat-mock-3";
import { PAT_MK4_MCQ } from "./pat-mock-4";
import { PAT_MK5_MCQ } from "./pat-mock-5";
import { LNAT_MK1_MCQ } from "./lnat-mock-1";
import { LNAT_MK2_MCQ } from "./lnat-mock-2";
import { LNAT_MK3_MCQ } from "./lnat-mock-3";
import { LNAT_MK4_MCQ } from "./lnat-mock-4";
import { LNAT_MK5_MCQ } from "./lnat-mock-5";
import { STEP_MK1_MCQ } from "./step-mock-1";
import { STEP_MK2_MCQ } from "./step-mock-2";
import { STEP_MK3_MCQ } from "./step-mock-3";
import { STEP_MK4_MCQ } from "./step-mock-4";
import { STEP_MK5_MCQ } from "./step-mock-5";
import { TSA_MK1_MCQ } from "./tsa-mock-1";
import { TSA_MK2_MCQ } from "./tsa-mock-2";
import { TMUA_MK2_P1, TMUA_MK2_P2 } from "./tmua-mock-2";
import { TMUA_MK3_P1, TMUA_MK3_P2 } from "./tmua-mock-3";
import { TMUA_MK4_P1, TMUA_MK4_P2 } from "./tmua-mock-4";
import { TMUA_MK5_P1, TMUA_MK5_P2 } from "./tmua-mock-5";
import { TMUA_MK6_P1, TMUA_MK6_P2 } from "./tmua-mock-6";
import { TMUA_MK7_P1, TMUA_MK7_P2 } from "./tmua-mock-7";
import { TMUA_MK8_P1, TMUA_MK8_P2 } from "./tmua-mock-8";
import { TMUA_MK9_P1, TMUA_MK9_P2 } from "./tmua-mock-9";
import { TMUA_MK10_P1, TMUA_MK10_P2 } from "./tmua-mock-10";

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

export const ESAT_MOCK_10: MockPaper = {
  id: "esat-mock-10",
  testId: "esat",
  title: "ESAT 模拟卷十（物理考纲补全卷 · 磁学 + 热/物质/波/放射性）",
  titleEn: "ESAT Mock Paper 10 (Physics spec completion)",
  description:
    "对照官方 ESAT 物理考纲（P1–P7）审计题库后补齐薄弱考点的专项卷：模块一为磁学与电磁（官方 P2，此前完全缺失），模块二覆盖热物理、物质、波与放射性。各 27 题、每模块 40 分钟、五选一、无负分。题目全新原创，仅以官方考纲做结构校准，未照搬任何指南或真题。",
  modules: [
    { id: "magnetism", title: "磁学与电磁", titleEn: "Magnetism & Electromagnetism", durationSec: 40 * 60, questions: ESAT_MK10_MAG },
    { id: "science", title: "热 / 物质 / 波 / 放射性", titleEn: "Thermal / Matter / Waves / Radioactivity", durationSec: 40 * 60, questions: ESAT_MK10_SCI },
  ],
};

export const MAT_MOCK_1: MockPaper = {
  id: "mat-mock-1",
  testId: "mat",
  title: "MAT 模拟卷一（选择部分 25 题 · 对标真实 MAT 结构）",
  titleEn: "MAT Mock Paper 1 (25 multiple-choice)",
  description:
    "对标真实 Oxford MAT：25 道五选一（A–E）、每题 2–3 分、无负分。真实 MAT 另含 2 道长题（Q26/27，共 30 分），因模考模块仅支持选择题，长题请到 MAT 练习库单独训练。题目全新原创，仅以官方结构与考纲做校准，未照搬任何真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: MAT_MK1_MCQ },
  ],
};

export const PAT_MOCK_4: MockPaper = {
  id: "pat-mock-4",
  testId: "pat",
  title: "PAT 模拟卷4（选择部分 25 题）",
  titleEn: "PAT Mock Paper 4 (25 multiple-choice)",
  description:
    "对标牛津 PAT 结构：25 道五选一，覆盖力学/电磁/波动/热力学/现代物理/数学工具。题目由生成器出题、精确算术计算答案，经独立复核；仅以官方考纲校准，未照搬真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 60 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 60 * 60, questions: PAT_MK4_MCQ },
  ],
};

export const PAT_MOCK_5: MockPaper = {
  id: "pat-mock-5",
  testId: "pat",
  title: "PAT 模拟卷5（选择部分 25 题）",
  titleEn: "PAT Mock Paper 5 (25 multiple-choice)",
  description:
    "对标牛津 PAT 结构：25 道五选一，覆盖力学/电磁/波动/热力学/现代物理/数学工具。题目由生成器出题、精确算术计算答案，经独立复核；仅以官方考纲校准，未照搬真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 60 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 60 * 60, questions: PAT_MK5_MCQ },
  ],
};

export const PAT_MOCK_1: MockPaper = {
  id: "pat-mock-1",
  testId: "pat",
  title: "PAT 模拟卷1（选择部分 25 题）",
  titleEn: "PAT Mock Paper 1 (25 multiple-choice)",
  description:
    "对标牛津 PAT 结构：25 道五选一，覆盖力学/电磁/波动/热力学/现代物理/数学工具。题目由生成器出题、精确算术计算答案，经独立复核；仅以官方考纲校准，未照搬真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 60 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 60 * 60, questions: PAT_MK1_MCQ },
  ],
};

export const PAT_MOCK_2: MockPaper = {
  id: "pat-mock-2",
  testId: "pat",
  title: "PAT 模拟卷2（选择部分 25 题）",
  titleEn: "PAT Mock Paper 2 (25 multiple-choice)",
  description:
    "对标牛津 PAT 结构：25 道五选一，覆盖力学/电磁/波动/热力学/现代物理/数学工具。题目由生成器出题、精确算术计算答案，经独立复核；仅以官方考纲校准，未照搬真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 60 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 60 * 60, questions: PAT_MK2_MCQ },
  ],
};

export const PAT_MOCK_3: MockPaper = {
  id: "pat-mock-3",
  testId: "pat",
  title: "PAT 模拟卷3（选择部分 25 题）",
  titleEn: "PAT Mock Paper 3 (25 multiple-choice)",
  description:
    "对标牛津 PAT 结构：25 道五选一，覆盖力学/电磁/波动/热力学/现代物理/数学工具。题目由生成器出题、精确算术计算答案，经独立复核；仅以官方考纲校准，未照搬真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 60 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 60 * 60, questions: PAT_MK3_MCQ },
  ],
};

export const LNAT_MOCK_2: MockPaper = {
  id: "lnat-mock-2",
  testId: "lnat",
  title: "LNAT 模拟卷2（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 2 (Section A)",
  description:
    "对标 LNAT 第一节：原创论述文 + 阅读/推理选择题（因果谬误、动机性推理、激励逻辑等）。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 40 * 60, questions: LNAT_MK2_MCQ },
  ],
};

export const LNAT_MOCK_3: MockPaper = {
  id: "lnat-mock-3",
  testId: "lnat",
  title: "LNAT 模拟卷3（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 3 (Section A)",
  description:
    "对标 LNAT 第一节：原创论述文 + 阅读/推理选择题（幸存者偏差、诉诸出身谬误、内生性需求等）。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 40 * 60, questions: LNAT_MK3_MCQ },
  ],
};

export const LNAT_MOCK_4: MockPaper = {
  id: "lnat-mock-4",
  testId: "lnat",
  title: "LNAT 模拟卷4（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 4 (Section A)",
  description:
    "对标 LNAT 第一节：原创论述文 + 阅读/推理选择题（基率忽视、偷换概念、假两难等）。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 40 * 60, questions: LNAT_MK4_MCQ },
  ],
};

export const LNAT_MOCK_5: MockPaper = {
  id: "lnat-mock-5",
  testId: "lnat",
  title: "LNAT 模拟卷5（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 5 (Section A)",
  description:
    "对标 LNAT 第一节：原创论述文 + 阅读/推理选择题（以偏概全、诉诸自然、你也一样谬误等）。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 40 * 60, questions: LNAT_MK5_MCQ },
  ],
};

export const STEP_MOCK_1: MockPaper = {
  id: "step-mock-1",
  testId: "step",
  title: "STEP 模拟卷1（STEP 难度选择题）",
  titleEn: "STEP Mock Paper 1",
  description:
    "25 道 STEP 难度可计算选择题（代数与多项式、进阶微积分、复数、线性代数、力学、概率统计），sympy 逐题验算。注：真 STEP 为长证明大题，本卷为 STEP 难度的选择题训练。",
  modules: [
    { id: "mcq", title: "STEP 选择题", titleEn: "STEP MCQ", durationSec: 90 * 60, questions: STEP_MK1_MCQ },
  ],
};

export const STEP_MOCK_2: MockPaper = {
  id: "step-mock-2",
  testId: "step",
  title: "STEP 模拟卷2（STEP 难度选择题）",
  titleEn: "STEP Mock Paper 2",
  description:
    "25 道 STEP 难度可计算选择题（代数与多项式、进阶微积分、复数、线性代数、力学、概率统计），sympy 逐题验算。注：真 STEP 为长证明大题，本卷为 STEP 难度的选择题训练。",
  modules: [
    { id: "mcq", title: "STEP 选择题", titleEn: "STEP MCQ", durationSec: 90 * 60, questions: STEP_MK2_MCQ },
  ],
};

export const STEP_MOCK_3: MockPaper = {
  id: "step-mock-3",
  testId: "step",
  title: "STEP 模拟卷3（STEP 难度选择题）",
  titleEn: "STEP Mock Paper 3",
  description:
    "25 道 STEP 难度可计算选择题（代数与多项式、进阶微积分、复数、线性代数、力学、概率统计），sympy 逐题验算。注：真 STEP 为长证明大题，本卷为 STEP 难度的选择题训练。",
  modules: [
    { id: "mcq", title: "STEP 选择题", titleEn: "STEP MCQ", durationSec: 90 * 60, questions: STEP_MK3_MCQ },
  ],
};

export const STEP_MOCK_4: MockPaper = {
  id: "step-mock-4",
  testId: "step",
  title: "STEP 模拟卷4（STEP 难度选择题）",
  titleEn: "STEP Mock Paper 4",
  description:
    "25 道 STEP 难度可计算选择题（代数与多项式、进阶微积分、复数、线性代数、力学、概率统计），sympy 逐题验算。注：真 STEP 为长证明大题，本卷为 STEP 难度的选择题训练。",
  modules: [
    { id: "mcq", title: "STEP 选择题", titleEn: "STEP MCQ", durationSec: 90 * 60, questions: STEP_MK4_MCQ },
  ],
};

export const STEP_MOCK_5: MockPaper = {
  id: "step-mock-5",
  testId: "step",
  title: "STEP 模拟卷5（STEP 难度选择题）",
  titleEn: "STEP Mock Paper 5",
  description:
    "25 道 STEP 难度可计算选择题（代数与多项式、进阶微积分、复数、线性代数、力学、概率统计），sympy 逐题验算。注：真 STEP 为长证明大题，本卷为 STEP 难度的选择题训练。",
  modules: [
    { id: "mcq", title: "STEP 选择题", titleEn: "STEP MCQ", durationSec: 90 * 60, questions: STEP_MK5_MCQ },
  ],
};

export const TSA_MOCK_1: MockPaper = {
  id: "tsa-mock-1",
  testId: "tsa",
  title: "TSA 模拟卷1（Section 1）",
  titleEn: "TSA Mock Paper 1 (Section 1)",
  description:
    "对标 TSA 第一节：批判性思维 + 问题解决混合选择题。真实考试为 50 题 60 分钟外加牛津 essay；本卷为精选练习。问题解决题 sympy 验算；批判性思维题答案由文段锁定。",
  modules: [
    { id: "mcq", title: "Section 1 混合选择题", titleEn: "Section 1 MCQ", durationSec: 30 * 60, questions: TSA_MK1_MCQ },
  ],
};

export const TSA_MOCK_2: MockPaper = {
  id: "tsa-mock-2",
  testId: "tsa",
  title: "TSA 模拟卷2（Section 1）",
  titleEn: "TSA Mock Paper 2 (Section 1)",
  description:
    "对标 TSA 第一节：批判性思维 + 问题解决混合选择题。真实考试为 50 题 60 分钟外加牛津 essay；本卷为精选练习。问题解决题 sympy 验算；批判性思维题答案由文段锁定。",
  modules: [
    { id: "mcq", title: "Section 1 混合选择题", titleEn: "Section 1 MCQ", durationSec: 30 * 60, questions: TSA_MK2_MCQ },
  ],
};

export const LNAT_MOCK_1: MockPaper = {
  id: "lnat-mock-1",
  testId: "lnat",
  title: "LNAT 模拟卷1（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 1 (Section A)",
  description:
    "对标 LNAT 第一节：原创论述文 + 阅读/推理选择题（主旨、推断、假设、削弱/加强、谬误识别）。真实考试为 42 题 95 分钟、外加第二节 essay；本卷为 Section A 精选练习。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 40 * 60, questions: LNAT_MK1_MCQ },
  ],
};

export const MAT_MOCK_2: MockPaper = {
  id: "mat-mock-2",
  testId: "mat",
  title: "MAT 模拟卷2（选择部分 25 题）",
  titleEn: "MAT Mock Paper 2 (25 multiple-choice)",
  description:
    "对标真实 Oxford MAT 结构：25 道五选一（A–E）、每题 2–3 分、无负分。题目由生成器出题、sympy 计算答案，经多轮独立复核；仅以官方结构与考纲做校准，未照搬任何真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: MAT_MK2_MCQ },
  ],
};

export const MAT_MOCK_3: MockPaper = {
  id: "mat-mock-3",
  testId: "mat",
  title: "MAT 模拟卷3（选择部分 25 题）",
  titleEn: "MAT Mock Paper 3 (25 multiple-choice)",
  description:
    "对标真实 Oxford MAT 结构：25 道五选一（A–E）、每题 2–3 分、无负分。题目由生成器出题、sympy 计算答案，经多轮独立复核；仅以官方结构与考纲做校准，未照搬任何真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: MAT_MK3_MCQ },
  ],
};

export const MAT_MOCK_4: MockPaper = {
  id: "mat-mock-4",
  testId: "mat",
  title: "MAT 模拟卷4（选择部分 25 题）",
  titleEn: "MAT Mock Paper 4 (25 multiple-choice)",
  description:
    "对标真实 Oxford MAT 结构：25 道五选一（A–E）、每题 2–3 分、无负分。题目由生成器出题、sympy 计算答案，经多轮独立复核；仅以官方结构与考纲做校准，未照搬任何真题。",
  modules: [
    { id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: MAT_MK4_MCQ },
  ],
};

export const TMUA_MOCK_2: MockPaper = {
  id: "tmua-mock-2",
  testId: "tmua",
  title: "TMUA 模拟卷二（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 2 (Applications + Reasoning)",
  description:
    "第二套完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与模拟卷一、练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK2_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK2_P2 },
  ],
};

export const TMUA_MOCK_3: MockPaper = {
  id: "tmua-mock-3",
  testId: "tmua",
  title: "TMUA 模拟卷三（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 3 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK3_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK3_P2 },
  ],
};

export const TMUA_MOCK_4: MockPaper = {
  id: "tmua-mock-4",
  testId: "tmua",
  title: "TMUA 模拟卷四（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 4 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK4_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK4_P2 },
  ],
};

export const TMUA_MOCK_5: MockPaper = {
  id: "tmua-mock-5",
  testId: "tmua",
  title: "TMUA 模拟卷五（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 5 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK5_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK5_P2 },
  ],
};

export const TMUA_MOCK_6: MockPaper = {
  id: "tmua-mock-6",
  testId: "tmua",
  title: "TMUA 模拟卷六（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 6 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK6_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK6_P2 },
  ],
};

export const TMUA_MOCK_7: MockPaper = {
  id: "tmua-mock-7",
  testId: "tmua",
  title: "TMUA 模拟卷七（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 7 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK7_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK7_P2 },
  ],
};

export const TMUA_MOCK_8: MockPaper = {
  id: "tmua-mock-8",
  testId: "tmua",
  title: "TMUA 模拟卷八（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 8 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK8_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK8_P2 },
  ],
};

export const TMUA_MOCK_9: MockPaper = {
  id: "tmua-mock-9",
  testId: "tmua",
  title: "TMUA 模拟卷九（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 9 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK9_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK9_P2 },
  ],
};

export const TMUA_MOCK_10: MockPaper = {
  id: "tmua-mock-10",
  testId: "tmua",
  title: "TMUA 模拟卷十（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 10 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、五选一、无负分、无计算器。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK10_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK10_P2 },
  ],
};

export const TMUA_MOCK_1: MockPaper = {
  id: "tmua-mock-1",
  testId: "tmua",
  title: "TMUA 模拟卷一（数学应用 + 数学推理 · 对标真实两卷结构）",
  titleEn: "TMUA Mock Paper 1 (Applications + Reasoning)",
  description:
    "对标真实 TMUA：两卷各 20 题、各 75 分钟、五选一（A–E）、无负分、无计算器。Paper 1 考数学应用，Paper 2 考数学推理与逻辑（命题/逆否/必要充分/反例/证明）。题目全新原创，仅以官方考纲与结构做校准，未照搬任何真题。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_MK1_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_MK1_P2 },
  ],
};

const ALL_MOCK_PAPERS: MockPaper[] = [ESAT_MOCK_1, ESAT_MOCK_2, ESAT_MOCK_3, ESAT_MOCK_4, ESAT_MOCK_5, ESAT_MOCK_6, ESAT_MOCK_7, ESAT_MOCK_8, ESAT_MOCK_9, ESAT_MOCK_10, TMUA_MOCK_1, TMUA_MOCK_2, TMUA_MOCK_3, TMUA_MOCK_4, TMUA_MOCK_5, TMUA_MOCK_6, TMUA_MOCK_7, TMUA_MOCK_8, TMUA_MOCK_9, TMUA_MOCK_10, MAT_MOCK_1, MAT_MOCK_2, MAT_MOCK_3, MAT_MOCK_4, PAT_MOCK_1, PAT_MOCK_2, PAT_MOCK_3, PAT_MOCK_4, PAT_MOCK_5, LNAT_MOCK_1, LNAT_MOCK_2, LNAT_MOCK_3, LNAT_MOCK_4, LNAT_MOCK_5, STEP_MOCK_1, STEP_MOCK_2, STEP_MOCK_3, STEP_MOCK_4, STEP_MOCK_5, TSA_MOCK_1, TSA_MOCK_2];

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
