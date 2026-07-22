// 完整模拟卷注册表。每套卷 = 若干个独立计时的模块。
import type { Question } from "@/lib/tests/questions/types";
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
import { ESAT_GAP_BIOLOGY_MODULE, ESAT_GAP_CHEMISTRY_MODULE, ESAT_GAP_PHYSICS_MODULE } from "./esat-gap-module-papers";
import { balanceEsatAnswers } from "./esat-calibration";
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
import { buildFullLnatPaper } from "./lnat-full-papers";
import { TARA_MK1_CT } from "./tara-mock-1";
import { TARA_MK2_CT } from "./tara-mock-2";
import { TARA_MK3_CT } from "./tara-mock-3";
import { calibrateTaraCriticalModule, TARA_FIXED_CT_PAPERS } from "./tara-fixed-critical-papers";
import { TARA_FIXED_PS_PAPERS } from "./tara-fixed-problem-papers";
import { BPHO_MK1_S1, BPHO_MK1_S2 } from "./bpho-mock-1";
import { BPHO_MK2_S1, BPHO_MK2_S2 } from "./bpho-mock-2";
import { BPHO_MK3_S1, BPHO_MK3_S2 } from "./bpho-mock-3";
import { BPHO_MK4_S1, BPHO_MK4_S2 } from "./bpho-mock-4";
import { BPHO_MK5_S1, BPHO_MK5_S2 } from "./bpho-mock-5";
import { BPHO_MK6_S1, BPHO_MK6_S2 } from "./bpho-mock-6";
import { BPHO_MK7_S1, BPHO_MK7_S2 } from "./bpho-mock-7";
import { BPHO_MK8_S1, BPHO_MK8_S2 } from "./bpho-mock-8";
import { BPHO_R2M1_T1, BPHO_R2M1_T2, BPHO_R2M1_T3, BPHO_R2M1_T4 } from "./bpho-r2-mock-1";
import { BPHO_R2M2_T1, BPHO_R2M2_T2, BPHO_R2M2_T3, BPHO_R2M2_T4 } from "./bpho-r2-mock-2";
import { BPHO_R2M3_T1, BPHO_R2M3_T2, BPHO_R2M3_T3, BPHO_R2M3_T4 } from "./bpho-r2-mock-3";
import { BPHO_R2M4_T1, BPHO_R2M4_T2, BPHO_R2M4_T3, BPHO_R2M4_T4 } from "./bpho-r2-mock-4";
import { STEP_MK1_MCQ } from "./step-mock-1";
import { STEP_MK2_MCQ } from "./step-mock-2";
import { STEP_MK3_MCQ } from "./step-mock-3";
import { STEP_MK4_MCQ } from "./step-mock-4";
import { STEP_MK5_MCQ } from "./step-mock-5";
import { TMUA_MK2_P1, TMUA_MK2_P2 } from "./tmua-mock-2";
import { TMUA_MK3_P1, TMUA_MK3_P2 } from "./tmua-mock-3";
import { TMUA_MK4_P1, TMUA_MK4_P2 } from "./tmua-mock-4";
import { TMUA_MK5_P1, TMUA_MK5_P2 } from "./tmua-mock-5";
import { TMUA_MK6_P1, TMUA_MK6_P2 } from "./tmua-mock-6";
import { TMUA_MK7_P1, TMUA_MK7_P2 } from "./tmua-mock-7";
import { TMUA_MK8_P1, TMUA_MK8_P2 } from "./tmua-mock-8";
import { TMUA_MK9_P1, TMUA_MK9_P2 } from "./tmua-mock-9";
import { TMUA_MK10_P1, TMUA_MK10_P2 } from "./tmua-mock-10";
import { TMUA_CALIBRATION_1_P1, TMUA_CALIBRATION_1_P2 } from "./tmua-calibration-1";
import {
  TMUA_MK6_P1_CALIBRATED, TMUA_MK6_P2_CALIBRATED,
  TMUA_MK9_P1_CALIBRATED, TMUA_MK9_P2_CALIBRATED,
  TMUA_MK10_P1_CALIBRATED, TMUA_MK10_P2_CALIBRATED,
} from "./tmua-calibrated-replacements";
import {
  TMUA_MK2_P1_CALIBRATED, TMUA_MK2_P2_CALIBRATED,
  TMUA_MK3_P1_CALIBRATED, TMUA_MK3_P2_CALIBRATED,
  TMUA_MK5_P1_CALIBRATED, TMUA_MK5_P2_CALIBRATED,
  TMUA_MK7_P1_CALIBRATED, TMUA_MK7_P2_CALIBRATED,
  TMUA_MK8_P1_CALIBRATED, TMUA_MK8_P2_CALIBRATED,
} from "./tmua-calibrated-replacements-2";
import {
  TMUA_MK1_P1_FINAL, TMUA_MK1_P2_FINAL,
  TMUA_MK4_P1_FINAL, TMUA_MK4_P2_FINAL,
} from "./tmua-final-calibration";
import { BMO_MK1_MCQ } from "./bmo-mock-1";
import { BMO_MK2_MCQ } from "./bmo-mock-2";
import { BMO_MK3_MCQ } from "./bmo-mock-3";
import { BMO_MK4_MCQ } from "./bmo-mock-4";
import { BMO_MK5_MCQ } from "./bmo-mock-5";
import { BMO_MK6_MCQ } from "./bmo-mock-6";
import { BMO_MK7_MCQ } from "./bmo-mock-7";
import { BMO_MK8_MCQ } from "./bmo-mock-8";
import { BMO_R2M1_T1, BMO_R2M1_T2, BMO_R2M1_T3, BMO_R2M1_T4 } from "./bmo-r2-mock-1";
import { BMO_R2M2_T1, BMO_R2M2_T2, BMO_R2M2_T3, BMO_R2M2_T4 } from "./bmo-r2-mock-2";
import { BMO_R2M3_T1, BMO_R2M3_T2, BMO_R2M3_T3, BMO_R2M3_T4 } from "./bmo-r2-mock-3";
import { BMO_R2M4_T1, BMO_R2M4_T2, BMO_R2M4_T3, BMO_R2M4_T4 } from "./bmo-r2-mock-4";
import { BMO_R2M5_T1, BMO_R2M5_T2, BMO_R2M5_T3, BMO_R2M5_T4 } from "./bmo-r2-mock-5";
import { BMO_R2M6_T1, BMO_R2M6_T2, BMO_R2M6_T3, BMO_R2M6_T4 } from "./bmo-r2-mock-6";
import { BMO_R2M7_T1, BMO_R2M7_T2, BMO_R2M7_T3, BMO_R2M7_T4 } from "./bmo-r2-mock-7";
import { BMO_R2M8_T1, BMO_R2M8_T2, BMO_R2M8_T3, BMO_R2M8_T4 } from "./bmo-r2-mock-8";
import { BMO1_WRITTEN_1, BMO1_WRITTEN_2, BMO1_WRITTEN_3 } from "./bmo1-written-papers";
import {
  BPHO_WRITTEN_1_S1, BPHO_WRITTEN_1_S2,
  BPHO_WRITTEN_2_S1, BPHO_WRITTEN_2_S2,
  BPHO_WRITTEN_3_S1, BPHO_WRITTEN_3_S2,
} from "./bpho-written-papers";
import {
  MAT_WRITTEN_1, MAT_WRITTEN_2, MAT_WRITTEN_3, MAT_WRITTEN_4, MAT_WRITTEN_5,
} from "./mat-written-papers";
import { PAT_WRITTEN_1, PAT_WRITTEN_2, PAT_WRITTEN_3 } from "./pat-written-papers";
import { STEP_WRITTEN_1, STEP_WRITTEN_2, STEP_WRITTEN_3, STEP_WRITTEN_4 } from "./step-written-papers";
import { LNAT_WRITTEN_QUESTIONS, TARA_WRITTEN_QUESTIONS } from "./writing-papers";

export interface MockModule {
  id: string;
  title: string;
  titleEn: string;
  durationSec: number; // 该模块独立计时时长
  questions: Question[];
}

export interface MockPaper {
  id: string;
  testId: string;
  title: string;
  titleEn: string;
  description: string;
  modules: MockModule[];
  instructions?: string[];
  bestQuestionCount?: number;
  formatType?: "current" | "legacy" | "extension";
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
      questions: balanceEsatAnswers(ESAT_MK1_MATH),
    },
    {
      id: "physics",
      title: "物理（模块二）",
      titleEn: "Physics (Module 2)",
      durationSec: 40 * 60,
      questions: balanceEsatAnswers(ESAT_MK1_PHYS),
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
      questions: balanceEsatAnswers(ESAT_MK2_MATH),
    },
    {
      id: "physics",
      title: "物理（模块二）",
      titleEn: "Physics (Module 2)",
      durationSec: 40 * 60,
      questions: balanceEsatAnswers(ESAT_MK2_PHYS),
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
      questions: balanceEsatAnswers(ESAT_MK3_MATH),
    },
    {
      id: "chemistry",
      title: "化学（模块二）",
      titleEn: "Chemistry (Module 2)",
      durationSec: 40 * 60,
      questions: balanceEsatAnswers(ESAT_MK3_CHEM),
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
      questions: balanceEsatAnswers(ESAT_MK4_MATH),
    },
    {
      id: "biology",
      title: "生物（模块二）",
      titleEn: "Biology (Module 2)",
      durationSec: 40 * 60,
      questions: balanceEsatAnswers(ESAT_MK4_BIO),
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
      questions: balanceEsatAnswers(ESAT_MK5_MATH),
    },
    {
      id: "physics",
      title: "物理（含进阶）",
      titleEn: "Physics (incl. advanced)",
      durationSec: 40 * 60,
      questions: balanceEsatAnswers(ESAT_MK5_PHYS),
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
    { id: "math", title: "数学（含进阶）", titleEn: "Mathematics (incl. advanced)", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK6_MATH) },
    { id: "physics", title: "物理（含进阶）", titleEn: "Physics (incl. advanced)", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK6_PHYS) },
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
    { id: "math", title: "数学（高频核心）", titleEn: "Mathematics (core)", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK7_MATH) },
    { id: "physics", title: "物理（高频核心）", titleEn: "Physics (core)", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK7_PHYS) },
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
    { id: "math", title: "数学", titleEn: "Mathematics", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK8_MATH) },
    { id: "chemistry", title: "化学", titleEn: "Chemistry", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK8_CHEM) },
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
    { id: "math", title: "数学", titleEn: "Mathematics", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK9_MATH) },
    { id: "biology", title: "生物", titleEn: "Biology", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK9_BIO) },
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
    { id: "magnetism", title: "磁学与电磁", titleEn: "Magnetism & Electromagnetism", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK10_MAG) },
    { id: "science", title: "热 / 物质 / 波 / 放射性", titleEn: "Thermal / Matter / Waves / Radioactivity", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_MK10_SCI) },
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
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 95 * 60, questions: buildFullLnatPaper(LNAT_MK2_MCQ, 2) },
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
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 95 * 60, questions: buildFullLnatPaper(LNAT_MK3_MCQ, 3) },
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
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 95 * 60, questions: buildFullLnatPaper(LNAT_MK4_MCQ, 4) },
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
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 95 * 60, questions: buildFullLnatPaper(LNAT_MK5_MCQ, 5) },
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

export const BPHO_MOCK_1: MockPaper = {
  id: "bpho-mock-1",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷1",
  titleEn: "BPhO Round 1 Mock 1",
  description:
    "模块1对标 Section 1 短题（多主题独立小问）；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 4 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK1_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK1_S2 },
  ],
};

export const BPHO_MOCK_2: MockPaper = {
  id: "bpho-mock-2",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷2",
  titleEn: "BPhO Round 1 Mock 2",
  description:
    "模块1对标 Section 1 短题（多主题独立小问）；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 4 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK2_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK2_S2 },
  ],
};

export const BPHO_MOCK_3: MockPaper = {
  id: "bpho-mock-3",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷3",
  titleEn: "BPhO Round 1 Mock 3",
  description:
    "模块1对标 Section 1 短题（多主题独立小问）；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK3_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK3_S2 },
  ],
};

export const BPHO_MOCK_4: MockPaper = {
  id: "bpho-mock-4",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷4",
  titleEn: "BPhO Round 1 Mock 4",
  description:
    "模块1对标 Section 1 短题（多主题独立小问）；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK4_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK4_S2 },
  ],
};

export const BPHO_MOCK_5: MockPaper = {
  id: "bpho-mock-5",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷5",
  titleEn: "BPhO Round 1 Mock 5",
  description:
    "模块1对标 Section 1 短题；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK5_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK5_S2 },
  ],
};

export const BPHO_MOCK_6: MockPaper = {
  id: "bpho-mock-6",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷6",
  titleEn: "BPhO Round 1 Mock 6",
  description:
    "模块1对标 Section 1 短题；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK6_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK6_S2 },
  ],
};

export const BPHO_MOCK_7: MockPaper = {
  id: "bpho-mock-7",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷7",
  titleEn: "BPhO Round 1 Mock 7",
  description:
    "模块1对标 Section 1 短题；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK7_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK7_S2 },
  ],
};

export const BPHO_MOCK_8: MockPaper = {
  id: "bpho-mock-8",
  testId: "bpho",
  title: "BPhO Round 1 模拟卷8",
  titleEn: "BPhO Round 1 Mock 8",
  description:
    "模块1对标 Section 1 短题；模块2以高难选择题近似 Section 2 强度。真实 Section 2 为长推导题——请到练习区完成 9 道原创长题并对照解答自评。全部短题经 sympy 双重验算。",
  modules: [
    { id: "s1", title: "Section 1 短题", titleEn: "Section 1", durationSec: 80 * 60, questions: BPHO_MK8_S1 },
    { id: "s2", title: "Section 2 强度题（选择题化）", titleEn: "Section 2 (MCQ form)", durationSec: 80 * 60, questions: BPHO_MK8_S2 },
  ],
};

export const BPHO_R2_MOCK_1: MockPaper = {
  id: "bpho-r2-mock-1",
  testId: "bpho",
  title: "BPhO Round 2 模拟卷1（主题阶梯）",
  titleEn: "BPhO Round 2 Mock 1",
  description:
    "对标真实 Round 2：3 小时、4 道引导式主题长题、全部必做（每题约 45 分钟）。本卷把每道长题化为一个「链式选择题阶梯」——沿真题的推导路径逐级上难度（含估算与极限思想），支持自动判分。真实 R2 需完整手写推导：请配合官方历年真题练习书写。",
  modules: [
    { id: "t1", title: "第1题 · 太空电梯", titleEn: "Q1 · Space Elevator", durationSec: 45 * 60, questions: BPHO_R2M1_T1 },
    { id: "t2", title: "第2题 · 白炽灯丝的物理", titleEn: "Q2 · Physics of a Filament", durationSec: 45 * 60, questions: BPHO_R2M1_T2 },
    { id: "t3", title: "第3题 · 从平行板到闪电", titleEn: "Q3 · Capacitors to Lightning", durationSec: 45 * 60, questions: BPHO_R2M1_T3 },
    { id: "t4", title: "第4题 · 原子核的尺度", titleEn: "Q4 · Nuclear Scales", durationSec: 45 * 60, questions: BPHO_R2M1_T4 },
  ],
};

export const BPHO_R2_MOCK_2: MockPaper = {
  id: "bpho-r2-mock-2",
  testId: "bpho",
  title: "BPhO Round 2 模拟卷2（主题阶梯）",
  titleEn: "BPhO Round 2 Mock 2",
  description:
    "对标真实 Round 2：3 小时、4 道引导式主题长题、全部必做（每题约 45 分钟）。本卷把每道长题化为一个「链式选择题阶梯」——沿真题的推导路径逐级上难度（含估算与极限思想），支持自动判分。真实 R2 需完整手写推导：请配合官方历年真题练习书写。",
  modules: [
    { id: "t1", title: "第1题 · 单摆的极限", titleEn: "Q1 · Pendulum at Large Angle", durationSec: 45 * 60, questions: BPHO_R2M2_T1 },
    { id: "t2", title: "第2题 · 大气有多厚", titleEn: "Q2 · Scale Height of the Atmosphere", durationSec: 45 * 60, questions: BPHO_R2M2_T2 },
    { id: "t3", title: "第3题 · 驾驭电子束", titleEn: "Q3 · Steering an Electron Beam", durationSec: 45 * 60, questions: BPHO_R2M2_T3 },
    { id: "t4", title: "第4题 · 光压与太阳帆", titleEn: "Q4 · Radiation Pressure & Solar Sails", durationSec: 45 * 60, questions: BPHO_R2M2_T4 },
  ],
};

export const BPHO_R2_MOCK_3: MockPaper = {
  id: "bpho-r2-mock-3",
  testId: "bpho",
  title: "BPhO Round 2 模拟卷3（主题阶梯）",
  titleEn: "BPhO Round 2 Mock 3",
  description:
    "对标真实 Round 2：3 小时、4 道引导式主题长题、全部必做（每题约 45 分钟）。本卷把每道长题化为「链式选择题阶梯」，沿推导路径逐级上难度（含估算与极限思想）。真实 R2 需完整手写推导：请配合练习区的 R2 风格阶梯长题与官方历年真题练习书写。",
  modules: [
    { id: "t1", title: "第1题 · 引力弹弓", titleEn: "Q1 · Gravity Assist", durationSec: 45 * 60, questions: BPHO_R2M3_T1 },
    { id: "t2", title: "第2题 · 一杯咖啡的冷却", titleEn: "Q2 · Cooling of a Coffee Cup", durationSec: 45 * 60, questions: BPHO_R2M3_T2 },
    { id: "t3", title: "第3题 · 为什么要高压输电", titleEn: "Q3 · Why High-Voltage Transmission", durationSec: 45 * 60, questions: BPHO_R2M3_T3 },
    { id: "t4", title: "第4题 · 太阳还能烧多久", titleEn: "Q4 · How Long Will the Sun Burn", durationSec: 45 * 60, questions: BPHO_R2M3_T4 },
  ],
};

export const BPHO_R2_MOCK_4: MockPaper = {
  id: "bpho-r2-mock-4",
  testId: "bpho",
  title: "BPhO Round 2 模拟卷4（主题阶梯）",
  titleEn: "BPhO Round 2 Mock 4",
  description:
    "对标真实 Round 2：3 小时、4 道引导式主题长题、全部必做（每题约 45 分钟）。本卷把每道长题化为「链式选择题阶梯」，沿推导路径逐级上难度（含估算与极限思想）。真实 R2 需完整手写推导：请配合练习区的 R2 风格阶梯长题与官方历年真题练习书写。",
  modules: [
    { id: "t1", title: "第1题 · 蹦极的物理", titleEn: "Q1 · Physics of Bungee Jumping", durationSec: 45 * 60, questions: BPHO_R2M4_T1 },
    { id: "t2", title: "第2题 · 人体这台热机", titleEn: "Q2 · The Human Heat Engine", durationSec: 45 * 60, questions: BPHO_R2M4_T2 },
    { id: "t3", title: "第3题 · 口袋里的能量：手机电池", titleEn: "Q3 · Energy in Your Pocket", durationSec: 45 * 60, questions: BPHO_R2M4_T3 },
    { id: "t4", title: "第4题 · GPS 与相对论", titleEn: "Q4 · GPS and Relativity", durationSec: 45 * 60, questions: BPHO_R2M4_T4 },
  ],
};

export const TARA_MOCK_1: MockPaper = {
  id: "tara-mock-1",
  testId: "tara",
  title: "TARA 模拟卷1",
  titleEn: "TARA Mock Paper 1",
  description:
    "按官方能力模型校准：批判性思维覆盖七类论证题，问题解决按相关选择 / 寻找程序 / 识别相似编排。两个客观模块各 22 题、40 分钟；写作任务使用独立固定写作卷。",
  modules: [
    { id: "ct", title: "批判性思维", titleEn: "Critical Thinking", durationSec: 40 * 60, questions: calibrateTaraCriticalModule(TARA_MK1_CT, "tara-mk1-ct") },
    { id: "ps", title: "问题解决", titleEn: "Problem Solving", durationSec: 40 * 60, questions: TARA_FIXED_PS_PAPERS[0] },
  ],
};

export const TARA_MOCK_2: MockPaper = {
  id: "tara-mock-2",
  testId: "tara",
  title: "TARA 模拟卷2",
  titleEn: "TARA Mock Paper 2",
  description:
    "按官方能力模型校准：批判性思维覆盖七类论证题，问题解决按相关选择 / 寻找程序 / 识别相似编排。两个客观模块各 22 题、40 分钟；写作任务使用独立固定写作卷。",
  modules: [
    { id: "ct", title: "批判性思维", titleEn: "Critical Thinking", durationSec: 40 * 60, questions: calibrateTaraCriticalModule(TARA_MK2_CT, "tara-mk2-ct") },
    { id: "ps", title: "问题解决", titleEn: "Problem Solving", durationSec: 40 * 60, questions: TARA_FIXED_PS_PAPERS[1] },
  ],
};

export const TARA_MOCK_3: MockPaper = {
  id: "tara-mock-3",
  testId: "tara",
  title: "TARA 模拟卷3",
  titleEn: "TARA Mock Paper 3",
  description:
    "按官方能力模型校准：批判性思维覆盖七类论证题，问题解决按相关选择 / 寻找程序 / 识别相似编排。两个客观模块各 22 题、40 分钟；写作任务使用独立固定写作卷。",
  modules: [
    { id: "ct", title: "批判性思维", titleEn: "Critical Thinking", durationSec: 40 * 60, questions: calibrateTaraCriticalModule(TARA_MK3_CT, "tara-mk3-ct") },
    { id: "ps", title: "问题解决", titleEn: "Problem Solving", durationSec: 40 * 60, questions: TARA_FIXED_PS_PAPERS[2] },
  ],
};

function taraFixedMock(paperNumber: number): MockPaper {
  return {
    id: `tara-mock-${paperNumber}`,
    testId: "tara",
    title: `TARA 模拟卷${paperNumber}`,
    titleEn: `TARA Mock Paper ${paperNumber}`,
    description: "按官方能力模型校准：批判性思维覆盖七类论证题，问题解决按相关选择 / 寻找程序 / 识别相似编排。两个客观模块各 22 题、40 分钟；写作任务使用独立固定写作卷。",
    modules: [
      { id: "ct", title: "批判性思维", titleEn: "Critical Thinking", durationSec: 40 * 60, questions: TARA_FIXED_CT_PAPERS[paperNumber - 4] },
      { id: "ps", title: "问题解决", titleEn: "Problem Solving", durationSec: 40 * 60, questions: TARA_FIXED_PS_PAPERS[paperNumber - 1] },
    ],
  };
}

export const TARA_MOCK_4 = taraFixedMock(4);
export const TARA_MOCK_5 = taraFixedMock(5);
export const TARA_MOCK_6 = taraFixedMock(6);

export const LNAT_MOCK_1: MockPaper = {
  id: "lnat-mock-1",
  testId: "lnat",
  title: "LNAT 模拟卷1（Section A 阅读推理）",
  titleEn: "LNAT Mock Paper 1 (Section A)",
  description:
    "对标 LNAT Section A 的完整模拟卷：12 篇原创议论文、42 道阅读与推理选择题、95 分钟独立计时，覆盖主旨、推断、假设、削弱/加强与谬误识别。题目原创，仅以官方结构校准。",
  modules: [
    { id: "mcq", title: "Section A 阅读推理", titleEn: "Section A Reading", durationSec: 95 * 60, questions: LNAT_MK1_MCQ },
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
    "第二套完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与模拟卷一、练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK2_P1.slice(0, 12), ...TMUA_MK2_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK2_P2.slice(0, 12), ...TMUA_MK2_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_3: MockPaper = {
  id: "tmua-mock-3",
  testId: "tmua",
  title: "TMUA 模拟卷三（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 3 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK3_P1.slice(0, 12), ...TMUA_MK3_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK3_P2.slice(0, 12), ...TMUA_MK3_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_4: MockPaper = {
  id: "tmua-mock-4",
  testId: "tmua",
  title: "TMUA 模拟卷四（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 4 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK4_P1.slice(0, 10), ...TMUA_MK4_P1_FINAL] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK4_P2.slice(0, 10), ...TMUA_MK4_P2_FINAL] },
  ],
};

export const TMUA_MOCK_5: MockPaper = {
  id: "tmua-mock-5",
  testId: "tmua",
  title: "TMUA 模拟卷五（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 5 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK5_P1.slice(0, 12), ...TMUA_MK5_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK5_P2.slice(0, 12), ...TMUA_MK5_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_6: MockPaper = {
  id: "tmua-mock-6",
  testId: "tmua",
  title: "TMUA 模拟卷六（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 6 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK6_P1.slice(0, 12), ...TMUA_MK6_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK6_P2.slice(0, 12), ...TMUA_MK6_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_7: MockPaper = {
  id: "tmua-mock-7",
  testId: "tmua",
  title: "TMUA 模拟卷七（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 7 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK7_P1.slice(0, 12), ...TMUA_MK7_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK7_P2.slice(0, 12), ...TMUA_MK7_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_8: MockPaper = {
  id: "tmua-mock-8",
  testId: "tmua",
  title: "TMUA 模拟卷八（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 8 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK8_P1.slice(0, 12), ...TMUA_MK8_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK8_P2.slice(0, 12), ...TMUA_MK8_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_9: MockPaper = {
  id: "tmua-mock-9",
  testId: "tmua",
  title: "TMUA 模拟卷九（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 9 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK9_P1.slice(0, 12), ...TMUA_MK9_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK9_P2.slice(0, 12), ...TMUA_MK9_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_10: MockPaper = {
  id: "tmua-mock-10",
  testId: "tmua",
  title: "TMUA 模拟卷十（数学应用 + 数学推理）",
  titleEn: "TMUA Mock Paper 10 (Applications + Reasoning)",
  description:
    "完整 TMUA 计时模考：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。与其它卷及练习题均不重复。题目全新原创，仅以真题题型与结构做校准。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK10_P1.slice(0, 12), ...TMUA_MK10_P1_CALIBRATED] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK10_P2.slice(0, 10), ...TMUA_MK10_P2_CALIBRATED] },
  ],
};

export const TMUA_MOCK_1: MockPaper = {
  id: "tmua-mock-1",
  testId: "tmua",
  title: "TMUA 模拟卷一（数学应用 + 数学推理 · 对标真实两卷结构）",
  titleEn: "TMUA Mock Paper 1 (Applications + Reasoning)",
  description:
    "对标真实 TMUA：两卷各 20 题、各 75 分钟、无负分、无计算器；选项按题型使用 A–E 至 A–H。Paper 1 考数学应用，Paper 2 考数学推理与逻辑（命题/逆否/必要充分/反例/证明）。题目全新原创，仅以官方考纲与结构做校准，未照搬任何真题。",
  modules: [
    { id: "paper1", title: "Paper 1：数学应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: [...TMUA_MK1_P1.slice(0, 10), ...TMUA_MK1_P1_FINAL] },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: [...TMUA_MK1_P2.slice(0, 10), ...TMUA_MK1_P2_FINAL] },
  ],
};

const BMO_SMC_MOCK_DESC =
  "从 205 道 SMC 练习题库分段抽取、按难度升序装配的完整计时模拟卷：25 题、五选一（A–E）、无负分。每套约含 3 道基础 + 14 道中档 + 8 道较难，题号由易到难，8 套之间零重复。原为 000–999 数字作答的题目已转为选择题并在题干注明；全部题目均经程序验算。真实 SMC 通常 90 分钟，本卷按此计时。";

export const BMO_MOCK_1: MockPaper = {
  id: "bmo-mock-1", testId: "bmo", title: "SMC 模拟卷一（25 题 · 难度递增）", titleEn: "SMC Mock Paper 1",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK1_MCQ }],
};
export const BMO_MOCK_2: MockPaper = {
  id: "bmo-mock-2", testId: "bmo", title: "SMC 模拟卷二（25 题 · 难度递增）", titleEn: "SMC Mock Paper 2",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK2_MCQ }],
};
export const BMO_MOCK_3: MockPaper = {
  id: "bmo-mock-3", testId: "bmo", title: "SMC 模拟卷三（25 题 · 难度递增）", titleEn: "SMC Mock Paper 3",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK3_MCQ }],
};
export const BMO_MOCK_4: MockPaper = {
  id: "bmo-mock-4", testId: "bmo", title: "SMC 模拟卷四（25 题 · 难度递增）", titleEn: "SMC Mock Paper 4",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK4_MCQ }],
};
export const BMO_MOCK_5: MockPaper = {
  id: "bmo-mock-5", testId: "bmo", title: "SMC 模拟卷五（25 题 · 难度递增）", titleEn: "SMC Mock Paper 5",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK5_MCQ }],
};
export const BMO_MOCK_6: MockPaper = {
  id: "bmo-mock-6", testId: "bmo", title: "SMC 模拟卷六（25 题 · 难度递增）", titleEn: "SMC Mock Paper 6",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK6_MCQ }],
};
export const BMO_MOCK_7: MockPaper = {
  id: "bmo-mock-7", testId: "bmo", title: "SMC 模拟卷七（25 题 · 难度递增）", titleEn: "SMC Mock Paper 7",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK7_MCQ }],
};
export const BMO_MOCK_8: MockPaper = {
  id: "bmo-mock-8", testId: "bmo", title: "SMC 模拟卷八（25 题 · 难度递增）", titleEn: "SMC Mock Paper 8",
  description: BMO_SMC_MOCK_DESC,
  modules: [{ id: "mcq", title: "选择题（25 题 / 90 分钟）", titleEn: "Multiple Choice (Q1–25)", durationSec: 90 * 60, questions: BMO_MK8_MCQ }],
};

export const TMUA_CALIBRATION_1: MockPaper = {
  id: "tmua-calibration-1",
  testId: "tmua",
  title: "TMUA 原创校准卷一（真题结构基准）",
  titleEn: "TMUA Calibration Paper 1 (Official-structure benchmark)",
  description:
    "依据 2016-2023 真题结构与 2025 官方考纲重新校准的原创完整套卷。Paper 1 与 Paper 2 各 20 题、各 75 分钟、无计算器、无负分；选项按题目需要使用 A-E 至 A-H。题目只借鉴官方题型结构、推理密度与干扰项逻辑，不复制真题题面、数值或解答。",
  formatType: "current",
  instructions: [
    "每个 Paper 独立计时 75 分钟。",
    "不使用计算器或公式册。",
    "每题只有一个正确答案；答错不倒扣。",
  ],
  modules: [
    { id: "paper1", title: "Paper 1：数学知识应用", titleEn: "Paper 1: Applications of Mathematical Knowledge", durationSec: 75 * 60, questions: TMUA_CALIBRATION_1_P1 },
    { id: "paper2", title: "Paper 2：数学推理", titleEn: "Paper 2: Mathematical Reasoning", durationSec: 75 * 60, questions: TMUA_CALIBRATION_1_P2 },
  ],
};

export const ESAT_GAP_PHYSICS_PAPER: MockPaper = {
  id: "esat-gap-physics-module",
  testId: "esat",
  title: "ESAT 物理考纲补齐模块卷",
  titleEn: "ESAT Physics Specification Completion Module",
  description: "现行 ESAT 物理模块训练：27 道五选一，40 分钟，无计算器。集中覆盖波、放射性、热与物质、磁学与电磁。",
  modules: [{ id: "physics", title: "物理补齐模块", titleEn: "Physics completion module", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_GAP_PHYSICS_MODULE) }],
  formatType: "current",
};

export const ESAT_GAP_CHEMISTRY_PAPER: MockPaper = {
  id: "esat-gap-chemistry-module",
  testId: "esat",
  title: "ESAT 化学考纲补齐模块卷",
  titleEn: "ESAT Chemistry Specification Completion Module",
  description: "现行 ESAT 化学模块训练：27 道五选一，40 分钟，无计算器。集中覆盖定量化学、化学计量与电解。",
  modules: [{ id: "chemistry", title: "化学补齐模块", titleEn: "Chemistry completion module", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_GAP_CHEMISTRY_MODULE) }],
  formatType: "current",
};

export const ESAT_GAP_BIOLOGY_PAPER: MockPaper = {
  id: "esat-gap-biology-module",
  testId: "esat",
  title: "ESAT 生物考纲补齐模块卷",
  titleEn: "ESAT Biology Specification Completion Module",
  description: "现行 ESAT 生物模块训练：27 道五选一，40 分钟，无计算器。重点覆盖基因技术、生态系统、能量流动与碳循环。",
  modules: [{ id: "biology", title: "生物补齐模块", titleEn: "Biology completion module", durationSec: 40 * 60, questions: balanceEsatAnswers(ESAT_GAP_BIOLOGY_MODULE) }],
  formatType: "current",
};

const BMO1_WRITTEN_DESC =
  "按现行 BMO1 结构编排的固定书面模拟卷：3.5 小时、6 道完整证明题、每题 10 分。题目为桥申原创并经题库审计，不是 UKMT 官方历年真题；固定题序便于复盘、复测和比较进步。交卷后按证明步骤评分，AI 不可用时提供评分要点自评且不计零分。";

export const BMO1_WRITTEN_PAPER_1: MockPaper = {
  id: "bmo1-written-1", testId: "bmo", title: "BMO1 固定书面卷一（结构校准）", titleEn: "BMO1 Written Mock 1",
  description: BMO1_WRITTEN_DESC,
  modules: [{ id: "written", title: "完整证明卷（6 题 / 210 分钟）", titleEn: "Written Paper (6 problems)", durationSec: 210 * 60, questions: BMO1_WRITTEN_1 }],
};

export const BMO1_WRITTEN_PAPER_2: MockPaper = {
  id: "bmo1-written-2", testId: "bmo", title: "BMO1 固定书面卷二（结构校准）", titleEn: "BMO1 Written Mock 2",
  description: BMO1_WRITTEN_DESC,
  modules: [{ id: "written", title: "完整证明卷（6 题 / 210 分钟）", titleEn: "Written Paper (6 problems)", durationSec: 210 * 60, questions: BMO1_WRITTEN_2 }],
};

export const BMO1_WRITTEN_PAPER_3: MockPaper = {
  id: "bmo1-written-3", testId: "bmo", title: "BMO1 固定书面卷三（结构校准）", titleEn: "BMO1 Written Mock 3",
  description: BMO1_WRITTEN_DESC,
  modules: [{ id: "written", title: "完整证明卷（6 题 / 210 分钟）", titleEn: "Written Paper (6 problems)", durationSec: 210 * 60, questions: BMO1_WRITTEN_3 }],
};

const BPHO_WRITTEN_DESC =
  "固定原创书面套卷，按 Section 1 短答与 Section 2 长题组织。学生直接输入推导过程，交卷后按物理原理、关键步骤和最终结论分步评分；本卷不是历年真题。";

export const BPHO_WRITTEN_PAPER_1: MockPaper = {
  id: "bpho-written-1", testId: "bpho", title: "BPhO 固定书面套卷一", titleEn: "BPhO Fixed Written Paper 1",
  description: BPHO_WRITTEN_DESC,
  modules: [
    { id: "section-1", title: "Section 1 · 书面短答（13 题 / 50 分）", titleEn: "Section 1 · Short Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_1_S1 },
    { id: "section-2", title: "Section 2 · 书面长题（2 题 / 50 分）", titleEn: "Section 2 · Long Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_1_S2 },
  ],
};

export const BPHO_WRITTEN_PAPER_2: MockPaper = {
  id: "bpho-written-2", testId: "bpho", title: "BPhO 固定书面套卷二", titleEn: "BPhO Fixed Written Paper 2",
  description: BPHO_WRITTEN_DESC,
  modules: [
    { id: "section-1", title: "Section 1 · 书面短答（13 题 / 50 分）", titleEn: "Section 1 · Short Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_2_S1 },
    { id: "section-2", title: "Section 2 · 书面长题（2 题 / 50 分）", titleEn: "Section 2 · Long Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_2_S2 },
  ],
};

export const BPHO_WRITTEN_PAPER_3: MockPaper = {
  id: "bpho-written-3", testId: "bpho", title: "BPhO 固定书面套卷三", titleEn: "BPhO Fixed Written Paper 3",
  description: BPHO_WRITTEN_DESC,
  modules: [
    { id: "section-1", title: "Section 1 · 书面短答（13 题 / 50 分）", titleEn: "Section 1 · Short Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_3_S1 },
    { id: "section-2", title: "Section 2 · 书面长题（2 题 / 50 分）", titleEn: "Section 2 · Long Written Problems", durationSec: 80 * 60, questions: BPHO_WRITTEN_3_S2 },
  ],
};

const BMO_R2_MOCK_DESC =
  "对标真实 BMO2：3.5 小时、4 道主题证明长题、每题 10 分、IMO 选拔级难度。本卷把每个主题化为一个「链式选择题阶梯」——沿推导路径逐级上难度，支持自动判分。真实 R2 需完整手写证明：请配合练习区的 8 道 BMO2 风格长题与官方历年真题练习书写。题目 100% 原创，仅以 2006–2026 年 BMO2 真题做主题与难度校准。";

export const BMO_R2_MOCK_1: MockPaper = {
  id: "bmo-r2-mock-1", testId: "bmo", title: "BMO Round 2 模拟卷一（主题阶梯）", titleEn: "BMO Round 2 Mock 1",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M1_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M1_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M1_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M1_T4 },
  ],
};
export const BMO_R2_MOCK_2: MockPaper = {
  id: "bmo-r2-mock-2", testId: "bmo", title: "BMO Round 2 模拟卷二（主题阶梯）", titleEn: "BMO Round 2 Mock 2",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M2_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M2_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M2_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M2_T4 },
  ],
};

export const BMO_R2_MOCK_3: MockPaper = {
  id: "bmo-r2-mock-3", testId: "bmo", title: "BMO Round 2 模拟卷三（主题阶梯）", titleEn: "BMO Round 2 Mock 3",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M3_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M3_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M3_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M3_T4 },
  ],
};
export const BMO_R2_MOCK_4: MockPaper = {
  id: "bmo-r2-mock-4", testId: "bmo", title: "BMO Round 2 模拟卷四（主题阶梯）", titleEn: "BMO Round 2 Mock 4",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M4_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M4_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M4_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M4_T4 },
  ],
};

export const BMO_R2_MOCK_5: MockPaper = {
  id: "bmo-r2-mock-5", testId: "bmo", title: "BMO Round 2 模拟卷五（主题阶梯）", titleEn: "BMO Round 2 Mock 5",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M5_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M5_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M5_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M5_T4 },
  ],
};
export const BMO_R2_MOCK_6: MockPaper = {
  id: "bmo-r2-mock-6", testId: "bmo", title: "BMO Round 2 模拟卷六（主题阶梯）", titleEn: "BMO Round 2 Mock 6",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M6_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M6_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M6_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M6_T4 },
  ],
};

export const BMO_R2_MOCK_7: MockPaper = {
  id: "bmo-r2-mock-7", testId: "bmo", title: "BMO Round 2 模拟卷七（主题阶梯）", titleEn: "BMO Round 2 Mock 7",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M7_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M7_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M7_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M7_T4 },
  ],
};
export const BMO_R2_MOCK_8: MockPaper = {
  id: "bmo-r2-mock-8", testId: "bmo", title: "BMO Round 2 模拟卷八（主题阶梯）", titleEn: "BMO Round 2 Mock 8",
  description: BMO_R2_MOCK_DESC,
  modules: [
    { id: "t1", title: "第1题 · 数论阶梯（阶 / 同余 / 计数）", titleEn: "Q1 · Number Theory", durationSec: 45 * 60, questions: BMO_R2M8_T1 },
    { id: "t2", title: "第2题 · 代数与数列阶梯", titleEn: "Q2 · Algebra & Sequences", durationSec: 45 * 60, questions: BMO_R2M8_T2 },
    { id: "t3", title: "第3题 · 几何阶梯（向量 / 圆 / 三角形心）", titleEn: "Q3 · Geometry", durationSec: 45 * 60, questions: BMO_R2M8_T3 },
    { id: "t4", title: "第4题 · 组合阶梯（鸽巢 / 极值 / 拉姆齐）", titleEn: "Q4 · Combinatorics", durationSec: 45 * 60, questions: BMO_R2M8_T4 },
  ],
};

const MAT_WRITTEN_DESC =
  "按 Oxford MAT 2025 最后一年格式中的键入长题部分编排：每套 2 道多小问长题、共 30 分。MAT 已于 2026 年停用并由 TMUA 取代；本卷用于保留深度数学推理训练，不是当前申请考试。题目为桥申原创固定题组。";

export const MAT_WRITTEN_PAPERS: MockPaper[] = [
  MAT_WRITTEN_1, MAT_WRITTEN_2, MAT_WRITTEN_3, MAT_WRITTEN_4, MAT_WRITTEN_5,
].map((questions, index) => ({
  id: `mat-written-${index + 1}`,
  testId: "mat",
  title: `MAT 2025 历史格式键入长题 ${index + 1}`,
  titleEn: `MAT 2025 Typed-Response Set ${index + 1}`,
  description: MAT_WRITTEN_DESC,
  modules: [{ id: "typed-response", title: "键入长题（2 题 / 30 分）", titleEn: "Typed-response questions", durationSec: 45 * 60, questions }],
  instructions: [
    "这是 2025 历史格式的长题专项，不是 2026 年现行入学考试。",
    "每个小问都应写出关键推理；只填最终答案不能获得完整分数。",
    "建议使用标准键盘可输入的数学表达，复杂排版不是评分重点。",
  ],
  formatType: "legacy",
}));

const PAT_WRITTEN_DESC =
  "非官方 PAT 书面能力拓展卷：把历史 PAT 风格选择题改为必须写出物理原理、公式和计算过程的短答题。PAT 已于 2026 年由 ESAT 取代，且最后阶段为全选择题；本卷用于牛津物理面试与深度问题解决训练，不应当作现行考试模拟。";

export const PAT_WRITTEN_PAPERS: MockPaper[] = [PAT_WRITTEN_1, PAT_WRITTEN_2, PAT_WRITTEN_3].map((questions, index) => ({
  id: `pat-written-extension-${index + 1}`,
  testId: "pat",
  title: `PAT 历史能力书面拓展卷 ${index + 1}`,
  titleEn: `PAT Legacy Written Extension ${index + 1}`,
  description: PAT_WRITTEN_DESC,
  modules: [{ id: "written-extension", title: "物理书面短答（12 题）", titleEn: "Written problem-solving extension", durationSec: 120 * 60, questions }],
  instructions: [
    "本卷是非官方能力拓展，不对应 2026 年 ESAT 的选择题结构。",
    "每题写明所用定律、符号含义、代入过程和带单位的结论。",
    "遇到估算题应说明近似假设，并检查量纲与数量级。",
  ],
  formatType: "extension",
}));

const stepPaper = (number: number, level: 2 | 3, questions: Question[]): MockPaper => ({
  id: `step${level}-written-${number}`,
  testId: "step",
  title: `STEP ${level} 固定书面套卷 ${number}`,
  titleEn: `STEP ${level} Fixed Written Paper ${number}`,
  description: `按现行 STEP ${level} 结构编排：3 小时、12 道书面长题（8 道纯数、2 道力学、2 道统计与概率），最终成绩只取最高 6 题，每题 20 分。题目为桥申原创固定题组，不是 OCR 官方历年真题。`,
  modules: [{ id: "written", title: "完整书面卷（12 题 / 最高六题计分）", titleEn: "Full written paper", durationSec: 180 * 60, questions }],
  instructions: [
    "先浏览全部 12 题，再选择最有把握的题目作答；不要求完成全部题目。",
    "最终只计得分最高的 6 题，每题 20 分，计分上限 120 分。",
    "必须保留完整推导、证明与必要文字说明。",
  ],
  bestQuestionCount: 6,
  formatType: "current",
});

export const STEP_WRITTEN_PAPERS: MockPaper[] = [
  stepPaper(1, 2, STEP_WRITTEN_1),
  stepPaper(2, 2, STEP_WRITTEN_2),
  stepPaper(1, 3, STEP_WRITTEN_3),
  stepPaper(2, 3, STEP_WRITTEN_4),
];

export const LNAT_WRITTEN_PAPERS: MockPaper[] = LNAT_WRITTEN_QUESTIONS.map((question, index) => ({
  id: `lnat-written-${index + 1}`,
  testId: "lnat",
  title: `LNAT Section B 固定写作卷 ${index + 1}`,
  titleEn: `LNAT Section B Fixed Essay Paper ${index + 1}`,
  description: "按现行 LNAT Section B 编排：40 分钟，从 3 个题目中选择 1 题作答。官方建议不超过 750 词，理想篇幅约 500–600 词。Section B 不计入 LNAT 的 42 分选择题成绩，由申请院校直接查看；平台 20 分量表仅用于形成性训练反馈。",
  modules: [{ id: "essay", title: "Section B · 三选一议论文", titleEn: "Section B · Choose one essay", durationSec: 40 * 60, questions: [question] }],
  instructions: [
    "只选择一个题目作答；先用约 5 分钟确定立场和论证顺序。",
    "建议写 500–600 词，最多 750 词，必须形成清楚结论。",
    "平台分数是训练量表，不是 LNAT 官方成绩或院校最终评价。",
  ],
  formatType: "current",
}));

export const TARA_WRITTEN_PAPERS: MockPaper[] = TARA_WRITTEN_QUESTIONS.map((question, index) => ({
  id: `tara-written-${index + 1}`,
  testId: "tara",
  title: `TARA Writing Task 固定写作卷 ${index + 1}`,
  titleEn: `TARA Writing Task Fixed Paper ${index + 1}`,
  description: "按 2026 TARA Writing Task 编排：40 分钟，从 3 个命题中选择 1 个，解释命题、提出有理由的反论证，并讨论认同程度；上限 750 词。官方写作任务不评分，原文发送申请院校；平台 20 分量表仅用于形成性训练反馈。",
  modules: [{ id: "writing", title: "Writing Task · 三选一", titleEn: "Writing Task · Choose one", durationSec: 40 * 60, questions: [question] }],
  instructions: [
    "只选择一个命题，并完整回应解释、反驳、权衡立场三个要求。",
    "最多 750 词；优先选择和组织最重要的观点，不追求材料堆积。",
    "TARA 官方不为写作任务打分；平台分数仅用于训练反馈。",
  ],
  formatType: "current",
}));

const ALL_MOCK_PAPERS: MockPaper[] = [BMO_R2_MOCK_1, BMO_R2_MOCK_2, BMO_R2_MOCK_3, BMO_R2_MOCK_4, BMO_R2_MOCK_5, BMO_R2_MOCK_6, BMO_R2_MOCK_7, BMO_R2_MOCK_8, BMO_MOCK_1, BMO_MOCK_2, BMO_MOCK_3, BMO_MOCK_4, BMO_MOCK_5, BMO_MOCK_6, BMO_MOCK_7, BMO_MOCK_8, ESAT_MOCK_1, ESAT_MOCK_2, ESAT_MOCK_3, ESAT_MOCK_4, ESAT_MOCK_5, ESAT_MOCK_6, ESAT_MOCK_7, ESAT_MOCK_8, ESAT_MOCK_9, ESAT_MOCK_10, ESAT_GAP_PHYSICS_PAPER, ESAT_GAP_CHEMISTRY_PAPER, ESAT_GAP_BIOLOGY_PAPER, TMUA_CALIBRATION_1, TMUA_MOCK_1, TMUA_MOCK_2, TMUA_MOCK_3, TMUA_MOCK_4, TMUA_MOCK_5, TMUA_MOCK_6, TMUA_MOCK_7, TMUA_MOCK_8, TMUA_MOCK_9, TMUA_MOCK_10, MAT_MOCK_1, MAT_MOCK_2, MAT_MOCK_3, MAT_MOCK_4, PAT_MOCK_1, PAT_MOCK_2, PAT_MOCK_3, PAT_MOCK_4, PAT_MOCK_5, LNAT_MOCK_1, LNAT_MOCK_2, LNAT_MOCK_3, LNAT_MOCK_4, LNAT_MOCK_5, STEP_MOCK_1, STEP_MOCK_2, STEP_MOCK_3, STEP_MOCK_4, STEP_MOCK_5, TARA_MOCK_1, TARA_MOCK_2, TARA_MOCK_3, TARA_MOCK_4, TARA_MOCK_5, TARA_MOCK_6, BPHO_MOCK_1, BPHO_MOCK_2, BPHO_MOCK_3, BPHO_MOCK_4, BPHO_MOCK_5, BPHO_MOCK_6, BPHO_MOCK_7, BPHO_MOCK_8, BPHO_R2_MOCK_1, BPHO_R2_MOCK_2, BPHO_R2_MOCK_3, BPHO_R2_MOCK_4];
ALL_MOCK_PAPERS.unshift(
  ...MAT_WRITTEN_PAPERS, ...PAT_WRITTEN_PAPERS, ...STEP_WRITTEN_PAPERS,
  ...LNAT_WRITTEN_PAPERS, ...TARA_WRITTEN_PAPERS,
  BPHO_WRITTEN_PAPER_1, BPHO_WRITTEN_PAPER_2, BPHO_WRITTEN_PAPER_3,
  BMO1_WRITTEN_PAPER_1, BMO1_WRITTEN_PAPER_2, BMO1_WRITTEN_PAPER_3
);

export function getMockPapersForTest(testId: string): MockPaper[] {
  return ALL_MOCK_PAPERS.filter((p) => p.testId === testId);
}

export function getMockPaper(paperId: string): MockPaper | undefined {
  return ALL_MOCK_PAPERS.find((p) => p.id === paperId);
}

/** 给 lookup 用：扁平化所有模拟卷题目，便于历史回看/学情分析按 id 反查 */
export function getAllMockQuestions(): Question[] {
  return ALL_MOCK_PAPERS.flatMap((p) => p.modules.flatMap((m) => m.questions));
}
