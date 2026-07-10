// BPhO 题库聚合 —— S1 短题（MCQ，sympy 验算）+ S2 长题（作者锁定 + 完整解答）。
import type { Question } from "./types";
import { BPHO_KINE_S1 } from "./bpho-kinematics";
import { BPHO_S1_MAIN } from "./bpho-s1";
import { BPHO_LONG_SAMPLE } from "./bpho-long";

export const BPHO_QUESTIONS: Question[] = [...BPHO_KINE_S1, ...BPHO_S1_MAIN, ...BPHO_LONG_SAMPLE];
