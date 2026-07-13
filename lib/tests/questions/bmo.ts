// BMO/UKMT 题库聚合 —— SMC 风格短题（MCQ，sympy/程序断言验算）+ BMO1 风格证明长题（作者锁定 + 完整解答）。
// 站内 testId: "bmo"；4 考点：bmo-number / bmo-algebra / bmo-geometry / bmo-combinatorics。
import type { Question } from "./types";
import { BMO_SMC_SAMPLE } from "./bmo-smc-sample";
import { BMO_SMC_MAIN } from "./bmo-smc-main";
import { BMO_SMC_B } from "./bmo-smc-b";
import { BMO_LONG_SAMPLE } from "./bmo-long";

export const BMO_QUESTIONS: Question[] = [...BMO_SMC_SAMPLE, ...BMO_SMC_MAIN, ...BMO_SMC_B, ...BMO_LONG_SAMPLE];
