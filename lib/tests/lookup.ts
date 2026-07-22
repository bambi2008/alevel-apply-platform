// 题目检索助手 —— 把已接入的题库扁平化建索引，供「练习记录回看」按 questionId 还原题目。
// 注意：这里只收录已在 practice/mock 页面接入 QUESTION_BANKS 的题库（mat / step / esat）。
// 若以后接入新题库（如 tmua），在此处补一行 import 即可。

import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { PAT_QUESTIONS } from "@/lib/tests/questions/pat";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import { TARA_QUESTIONS } from "@/lib/tests/questions/tara";
import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import { BMO_QUESTIONS } from "@/lib/tests/questions/bmo";
import type { Question } from "@/lib/tests/questions/types";
import { getTestById } from "@/lib/tests";
import { getAllMockQuestions } from "@/lib/tests/mock-papers";

const PRACTICE_QUESTIONS: Question[] = [
  ...MAT_QUESTIONS,
  ...STEP_QUESTIONS,
  ...ESAT_QUESTIONS,
  ...TMUA_QUESTIONS,
  ...PAT_QUESTIONS,
  ...LNAT_QUESTIONS,
  ...TARA_QUESTIONS,
  ...BPHO_QUESTIONS,
  ...BMO_QUESTIONS,
];

const ALL_QUESTIONS: Question[] = [
  ...PRACTICE_QUESTIONS,
  ...getAllMockQuestions(), // 完整模拟卷题目（不进练习库，但回看/分析需可反查）
];

// O(1) 检索：questionId -> Question
const BY_ID = new Map<string, Question>(ALL_QUESTIONS.map((q) => [q.id, q]));

/** 按 id 取回完整题目（含题干、选项/小问、解答）。找不到返回 undefined。 */
export function getQuestionById(id: string): Question | undefined {
  return BY_ID.get(id);
}

/** 只返回专项练习题库，不混入固定模拟卷。 */
export function getPracticeQuestionsForTest(testId: string): Question[] {
  return PRACTICE_QUESTIONS.filter((question) => question.testId === testId);
}

/** 取该题所属知识点 id（从静态题库读取，作答记录里没有存 topicId）。 */
export function getTopicIdForQuestion(id: string): string | undefined {
  return BY_ID.get(id)?.topicId;
}

export interface TopicMeta {
  id: string;
  title: string;
  titleEn: string;
}

/** 取知识点的中文/英文标题（用于学情分析、回看页分组展示）。 */
export function getTopicMeta(testId: string, topicId: string): TopicMeta | undefined {
  const t = getTestById(testId)?.topics.find((tp) => tp.id === topicId);
  if (!t) return undefined;
  return { id: t.id, title: t.title, titleEn: t.titleEn };
}
