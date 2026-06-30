// 文书（UCAS 个人陈述）存储层。2026 入学起 UCAS 改为 3 个结构化问题。
// 登录用户：Server Actions 读写数据库；匿名用户：回退 localStorage。
import { getUcasPsAction, saveUcasPsAction } from "./actions";

export interface UcasPsContent {
  q1: string;
  q2: string;
  q3: string;
}

export interface UcasPs {
  content: UcasPsContent;
  updatedAt: number;
}

// UCAS 三问（2026 入学起）。整体合计上限约 4000 字符，每题建议不少于 ~350 字符。
export const UCAS_QUESTIONS: {
  key: keyof UcasPsContent;
  title: string;
  hint: string;
}[] = [
  {
    key: "q1",
    title: "Q1 · 为什么想学这个专业？",
    hint: "说明你对该学科的兴趣来源与动机，避免空泛的『从小就喜欢』，用具体经历支撑。",
  },
  {
    key: "q2",
    title: "Q2 · 你的学业如何为之做准备？",
    hint: "结合 A-Level 科目、课题、阅读或项目，说明它们如何培养了相关知识与能力。",
  },
  {
    key: "q3",
    title: "Q3 · 教育之外做了哪些准备，为何有用？",
    hint: "竞赛、科研、实习、志愿、自学等课外经历，重点是『学到了什么 / 与专业的关联』。",
  },
];

export const UCAS_TOTAL_LIMIT = 4000; // 字符（含空格）
export const UCAS_PER_QUESTION_MIN = 350;

export const SELF_CHECK = [
  "内容为本人原创，未抄袭或代写（UCAS 内置相似度检测）",
  "聚焦学术动机与能力，少写无关的个人情感",
  "用具体事例与成果，而非空泛形容词",
  "未使用特殊格式 / 表情符号 / 超链接",
  "避免老套开头（如名人名言、字典定义）",
  "三题合计不超过 4000 字符",
];

const KEY = "alevel:statement:ucas:v1";

export const emptyUcasPs: UcasPs = {
  content: { q1: "", q2: "", q3: "" },
  updatedAt: 0,
};

function loadLocalUcasPs(): UcasPs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UcasPs) : null;
  } catch {
    return null;
  }
}

function saveLocalUcasPs(content: UcasPsContent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ content, updatedAt: Date.now() }));
}

export async function loadUcasPs(): Promise<UcasPs | null> {
  try {
    const r = await getUcasPsAction();
    if (r.authed) return r.ps; // 登录：数据库为准（可能尚未建档=null）
  } catch {
    /* 回退本地 */
  }
  return loadLocalUcasPs();
}

export async function saveUcasPs(content: UcasPsContent): Promise<void> {
  try {
    const r = await saveUcasPsAction(content);
    if (r.authed) return;
  } catch {
    /* 回退本地 */
  }
  saveLocalUcasPs(content);
}

export function totalChars(c: UcasPsContent): number {
  return c.q1.length + c.q2.length + c.q3.length;
}
