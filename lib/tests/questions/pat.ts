// PAT（Physics Aptitude Test，牛津物理能力测试）题库聚合。
// 力学/电磁/波动光学/热力学/现代物理/数学工具；含计算型与巧思型，答案均经程序验算。
import type { MCQQuestion } from "./types";
import { PAT_EXPANSION } from "./pat-expansion";
import { PAT_CLEVER } from "./pat-clever";

export const PAT_QUESTIONS: MCQQuestion[] = [
  ...PAT_EXPANSION,
  ...PAT_CLEVER,
];
