// TSA 题库聚合 —— 批判性思维（言语，文章锁定）+ 问题解决（可计算，sympy 验算）。
import type { MCQQuestion } from "./types";
import { TSA_CRITICAL } from "./tsa-critical";
import { TSA_PROBLEM } from "./tsa-problem";

export const TSA_QUESTIONS: MCQQuestion[] = [...TSA_CRITICAL, ...TSA_PROBLEM];
