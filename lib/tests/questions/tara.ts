// TARA 题库聚合 —— 批判性思维（言语，文章锁定）+ 问题解决（可计算，sympy 验算）。
import type { Question } from "./types";
import { TARA_FIXED_PS_PAPERS } from "../mock-papers/tara-fixed-problem-papers";
import { TARA_CRITICAL } from "./tara-critical";
import { TARA_CRITICAL_2 } from "./tara-critical-2";
import { TARA_WRITING_QUESTIONS } from "./tara-writing";

export const TARA_QUESTIONS: Question[] = [
  ...TARA_CRITICAL,
  ...TARA_CRITICAL_2,
  ...TARA_FIXED_PS_PAPERS.flat(),
  ...TARA_WRITING_QUESTIONS,
];
