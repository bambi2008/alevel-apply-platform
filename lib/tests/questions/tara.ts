// TARA 题库聚合 —— 批判性思维（言语，文章锁定）+ 问题解决（可计算，sympy 验算）。
import type { MCQQuestion } from "./types";
import { TARA_CRITICAL } from "./tara-critical";
import { TARA_CRITICAL_2 } from "./tara-critical-2";
import { TARA_PROBLEM } from "./tara-problem";
import { TARA_PROBLEM_2 } from "./tara-problem-2";

export const TARA_QUESTIONS: MCQQuestion[] = [...TARA_CRITICAL, ...TARA_CRITICAL_2, ...TARA_PROBLEM, ...TARA_PROBLEM_2];
