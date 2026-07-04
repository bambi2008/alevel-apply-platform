// 文书（UCAS 个人陈述）存储层。2026 入学起 UCAS 改为 3 个结构化问题。
// 登录用户：Server Actions 读写数据库；匿名用户：回退 localStorage。
import { getUcasPsAction, saveUcasPsAction, getHkEssayAction, saveHkEssayAction, type HkEssayContent } from "./actions";

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

// ---------- 香港 essay（单篇） ----------
export type { HkEssayContent } from "./actions";

export interface HkEssay {
  content: HkEssayContent;
  updatedAt: number;
}

// 各校字数/格式提示（据官方要求）
export const HK_UNIS: { value: string; label: string; hint: string; limit: number }[] = [
  { value: "HKU", label: "香港大学 HKU", hint: "不超过 1000 字（英文 words），说明你为何申请该校与该专业。", limit: 1000 },
  { value: "CUHK", label: "香港中文大学 CUHK", hint: "不超过 2 页 A4（约 800–1000 words），说明你为何选择这些专业。", limit: 1000 },
  { value: "HKUST", label: "香港科技大学 HKUST", hint: "1–2 页（官方不设硬性字数，建议 ~800 words，忌冗长空泛）。", limit: 1000 },
  { value: "OTHER", label: "其它港校 / 通用", hint: "多数港校 essay 约 500–1000 words，务必写清为何选该校该专业。", limit: 1000 },
];

export const HK_SELF_CHECK = [
  "写清了『为什么选这所学校、这个专业』（港校看重，与英国相反）",
  "把研究/实习/领导力等经历连回了个人成长与洞察，而非罗列",
  "点明了未来目标，以及你能为学校贡献什么",
  "内容原创、未套模板或复制粘贴（招生官易识别）",
  "没有只写自己、也谈了学校能给你什么",
  "没有提到你在考虑的其它学校，未夸大或撒谎",
];

const HK_KEY = "alevel:statement:hk:v1";

export const emptyHkEssay: HkEssay = { content: { body: "", targetUni: "HKU" }, updatedAt: 0 };

function loadLocalHk(): HkEssay | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HK_KEY);
    return raw ? (JSON.parse(raw) as HkEssay) : null;
  } catch {
    return null;
  }
}

function saveLocalHk(content: HkEssayContent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HK_KEY, JSON.stringify({ content, updatedAt: Date.now() }));
}

export async function loadHkEssay(): Promise<HkEssay | null> {
  try {
    const r = await getHkEssayAction();
    if (r.authed) return r.content ? { content: r.content, updatedAt: r.updatedAt ?? 0 } : null;
  } catch {
    /* 回退本地 */
  }
  return loadLocalHk();
}

export async function saveHkEssay(content: HkEssayContent): Promise<void> {
  try {
    const r = await saveHkEssayAction(content);
    if (r.authed) return;
  } catch {
    /* 回退本地 */
  }
  saveLocalHk(content);
}
