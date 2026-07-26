import type { MockPaper } from "./index";
import type { Question } from "@/lib/tests/questions/types";
import { IELTS_QUESTIONS } from "@/lib/tests/questions/ielts";
import { CSAT_QUESTIONS } from "@/lib/tests/questions/csat";

function paperCopies(prefix: string, questions: Question[]): Question[] {
  return questions.map((question, index) => ({
    ...question,
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
  }));
}

const ieltsWriting = paperCopies(
  "ielts-written-diagnostic-writing",
  IELTS_QUESTIONS.filter((question) => question.topicId === "ielts-writing")
);

function csatQuestions(ids: string[]): Question[] {
  return ids.map((id) => {
    const question = CSAT_QUESTIONS.find((item) => item.id === id);
    if (!question) throw new Error(`Missing CSAT question: ${id}`);
    return question;
  });
}

const CSAT_PAPER_1 = csatQuestions([
  "csat-01", "csat-03", "csat-05", "csat-07",
  "csat-09", "csat-02", "csat-06", "csat-10",
]);
const CSAT_PAPER_2 = csatQuestions([
  "csat-11", "csat-12", "csat-13", "csat-14",
  "csat-15", "csat-16", "csat-04", "csat-08",
]);

export const IELTS_WRITTEN_DIAGNOSTIC: MockPaper = {
  id: "ielts-written-diagnostic-1",
  testId: "ielts",
  title: "IELTS Academic Writing 短诊断",
  titleEn: "IELTS Academic Writing Diagnostic",
  description: "平台原创短版写作诊断，用于检查 Task 1 概括和 Task 2 论证。完整 60 分钟固定卷请使用 IELTS Academic Writing 固定卷 1。",
  modules: [
    { id: "writing", title: "Academic Writing Task 1 + Task 2", titleEn: "Academic Writing Tasks 1 and 2", durationSec: 60 * 60, questions: ieltsWriting },
  ],
  instructions: [
    "Writing Task 1 建议约 20 分钟，Task 2 建议约 40 分钟。",
    "本卷不给官方 IELTS Band，只提供按四维量表生成的形成性反馈。",
  ],
  formatType: "extension",
};

export const CSAT_WRITTEN_PAPERS: MockPaper[] = [
  {
    id: "csat-written-1",
    testId: "csat",
    title: "CSAT 学院评估训练卷 1",
    titleEn: "CSAT College Assessment Training Paper 1",
    description: "桥申原创书面训练卷，参照公开的 2025 CSAT 选题式问题解决结构。它不是剑桥或学院官方试卷；当前周期的题数、时长和提交要求以学院通知为准。",
    modules: [{
      id: "written",
      title: "8 题选 6 题计分",
      titleEn: "Answer any 6 of 8",
      durationSec: 180 * 60,
      questions: paperCopies("csat-written-1", CSAT_PAPER_1),
    }],
    instructions: [
      "先浏览全卷，再选择最有把握的 6 题；系统按最高 6 题计分。",
      "写出定义、关键观察、算法正确性和证明过程；只给最终答案不能体现完整能力。",
      "本卷为训练结构，收到学院邀请后必须按邮件中的最新安排执行。",
    ],
    bestQuestionCount: 6,
    formatType: "extension",
  },
  {
    id: "csat-written-2",
    testId: "csat",
    title: "CSAT 学院评估训练卷 2",
    titleEn: "CSAT College Assessment Training Paper 2",
    description: "第二套桥申原创选题训练卷，强化算法、图论、组合与建模之间的切换。不是学院官方卷，评分仅用于形成性反馈。",
    modules: [{
      id: "written",
      title: "8 题选 6 题计分",
      titleEn: "Answer any 6 of 8",
      durationSec: 180 * 60,
      questions: paperCopies("csat-written-2", CSAT_PAPER_2),
    }],
    instructions: [
      "选题本身是考试策略的一部分；不要按题号顺序机械作答。",
      "每个结论说明理由，并主动检查小规模和边界情况。",
      "平台评分不对应剑桥官方分数或录取阈值。",
    ],
    bestQuestionCount: 6,
    formatType: "extension",
  },
];
