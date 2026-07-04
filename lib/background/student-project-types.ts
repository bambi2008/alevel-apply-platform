// 学生自提课题（AI 辅助结构化）的共享类型 —— 可被客户端与服务端引用。

// 学生填写的原始想法
export interface StudentIdeaInputs {
  question: string; // 你想研究什么问题
  motivation: string; // 是什么让你对它感兴趣
  method: string; // 你打算用什么方法/工具
  variables: string; // 你想比较/测量什么
}

// AI 生成 + 学生编辑后的课题结构（对齐平台课题的要素）
export interface StudentStage {
  num: number;
  title: string;
  goal: string;
  tasks: string;
  deliverable: string;
  metrics: string[];
}

export interface StudentStructure {
  summary: string;
  primaryTool: string;
  baseline: string;
  challenge: string;
  stages: StudentStage[];
  reflection: string[];
  psUse: string;
}

export type StudentProjectStatus = "DRAFT" | "ACTIVE" | "COMPLETE";

// 进度
export interface StudentStageProgress {
  stageNum: number;
  status: "todo" | "submitted";
  submission: string;
  attachments?: { key: string; name: string; docId: string }[];
}

export interface StudentProgress {
  stages: StudentStageProgress[];
  reflectionNotes?: string;
}

// 传输对象（读出给前端）
export interface StudentProjectDTO {
  id: string;
  title: string;
  field: string;
  summary: string | null;
  ideaInputs: StudentIdeaInputs;
  structure: StudentStructure | null;
  progress: StudentProgress | null;
  status: StudentProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export const EMPTY_IDEA: StudentIdeaInputs = {
  question: "",
  motivation: "",
  method: "",
  variables: "",
};
