import {
  INTERVIEW_SUBJECTS as CORE_SUBJECTS,
  INTERVIEW_QUESTIONS as CORE_QUESTIONS,
  INTERVIEW_CATEGORIES as CORE_CATEGORIES,
  type InterviewSubject,
  type InterviewQuestion,
  type InterviewCategory,
} from "./questions";
import {
  ASSESSMENT_CATEGORIES,
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_SUBJECTS,
} from "./assessment-questions";

export const INTERVIEW_SUBJECTS = [...CORE_SUBJECTS, ...ASSESSMENT_SUBJECTS];
export const INTERVIEW_QUESTIONS = [...CORE_QUESTIONS, ...ASSESSMENT_QUESTIONS];
export const INTERVIEW_CATEGORIES = [...CORE_CATEGORIES, ...ASSESSMENT_CATEGORIES];

export {
  type InterviewSubject,
  type InterviewQuestion,
  type InterviewCategory,
};

export function getSubject(id: string): InterviewSubject | undefined {
  return INTERVIEW_SUBJECTS.find((s) => s.id === id);
}

export function getSubjectsByCategory(cat: InterviewCategory): InterviewSubject[] {
  return INTERVIEW_SUBJECTS.filter((s) => s.category === cat);
}

export function getQuestionsBySubject(subjectId: string): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.subjectId === subjectId);
}

// 通用面试指导（原创），教「如何现场思考」，而非背答案。
export const INTERVIEW_GUIDE: { title: string; body: string }[] = [
  {
    title: "面试到底在考什么",
    body: "牛剑及顶尖英国大学的学科面试，不是考你知道多少，而是考你面对陌生问题时怎么思考——像一场'迷你辅导课'。导师想看到的是你的推理过程、对提示的反应、以及被追问时能否调整。真题从不公开，因为它们会跨年重复使用，考的正是现场思维而非背诵。",
  },
  {
    title: "把思路说出来",
    body: "沉默是面试大忌。哪怕还没有答案，也要把你的思考过程讲出来：'我先假设……''我注意到……''这让我想到……'。导师需要听见你的推理，才能引导你。想错了没关系，能在提示下修正反而是加分项。",
  },
  {
    title: "从简单情形入手",
    body: "遇到复杂问题，先试最小、最特殊的例子，找规律，再推广。承认'我不确定，但我可以试试这样想'远好过硬装。允许自己出声地试错。",
  },
  {
    title: "把追问当作邀请",
    body: "导师追问'为什么''如果换成……呢'，通常不是说你错了，而是想看你能走多远。顺着往下想，别慌。被指出问题时，大方接受并调整，这展示了你的可塑性——正是导师最看重的。",
  },
  {
    title: "诚实胜过表演",
    body: "不懂就说不懂，但紧跟一句'不过我可以从……推一下'。别背模板答案、别不懂装懂——导师每年面很多人，一眼看穿。真实的好奇心和思考，比光鲜的套话有力得多。",
  },
];
