// 题库类型定义

export type QuestionDifficulty = 1 | 2 | 3;  // 1=基础, 2=中等, 3=挑战

export interface MCQOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;  // supports $...$ LaTeX
}

/** 选择题（MAT Part A, ENGAA, TMUA 等） */
export interface MCQQuestion {
  id: string;
  type: "mcq";
  testId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  marks: number;
  question: string;   // LaTeX: $ inline, $$ display
  options: MCQOption[];
  answer: "A" | "B" | "C" | "D" | "E";
  solution: string;   // step-by-step solution in LaTeX
  hint?: string;
}

/** 大题（MAT Part B, STEP 等）—— 需 AI 分步评分 */
export interface LongPart {
  label: string;    // "(i)", "(ii)", etc.
  marks: number;
  question: string; // LaTeX
  solutionOutline: string;  // key steps for Claude grader
  hint?: string;
}

export interface LongQuestion {
  id: string;
  type: "long";
  testId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  totalMarks: number;
  context?: string;   // shared context/preamble before parts
  parts: LongPart[];
  fullSolution: string;  // complete model solution
}

export type Question = MCQQuestion | LongQuestion;

/** 练习会话中单题的作答记录 */
export interface AnswerRecord {
  questionId: string;
  type: "mcq" | "long";
  // MCQ
  chosenOption?: "A" | "B" | "C" | "D" | "E";
  correct?: boolean;
  // Long
  studentWork?: string;
  gradingResult?: GradingResult;
}

export interface GradingResult {
  totalMarks: number;
  maxMarks: number;
  perPart: {
    label: string;
    earned: number;
    max: number;
    feedback: string;
  }[];
  overallFeedback: string;
  modelSolution: string;
}
