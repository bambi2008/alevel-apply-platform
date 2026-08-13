// BPhO 题库聚合 —— S1 短题（MCQ，sympy 验算）+ S2 长题（作者锁定 + 完整解答）。
import type { Question } from "./types";
import { BPHO_KINE_S1 } from "./bpho-kinematics";
import { BPHO_S1_MAIN } from "./bpho-s1";
import { BPHO_S1_B } from "./bpho-s1-b";
import { BPHO_S1_C } from "./bpho-s1-c";
import { BPHO_LONG_SAMPLE } from "./bpho-long";
import { BPHO2_LONG_SAMPLE } from "./bpho2-long";
import { BPHO3_LONG_SAMPLE } from "./bpho3-long";
import { BPHO4_LONG_SAMPLE } from "./bpho4-long";
import { BPHO5_LONG_SAMPLE } from "./bpho5-long";

export const BPHO_QUESTIONS: Question[] = [
  ...BPHO_KINE_S1,
  ...BPHO_S1_MAIN,
  ...BPHO_S1_B,
  ...BPHO_S1_C,
  ...BPHO_LONG_SAMPLE,
  ...BPHO2_LONG_SAMPLE,
  ...BPHO3_LONG_SAMPLE,
  ...BPHO4_LONG_SAMPLE,
  ...BPHO5_LONG_SAMPLE,
];
