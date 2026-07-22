// 申请清单 + Offer 存储层。
// 登录用户：Server Actions 读写数据库（跨设备持久化）。
// 匿名用户：回退 localStorage。
// 数据读写改为异步；subscribeApps 事件总线保留，写入后统一 notify() 触发重新同步。

import {
  listApplicationsAction,
  hasApplicationAction,
  addApplicationAction,
  removeApplicationAction,
  updateApplicationAction,
} from "./actions";

export type AppStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ACCEPTED"
  | "WITHDRAWN";

export const APP_STATUSES: { value: AppStatus; label: string; en: string; color: string }[] = [
  { value: "PLANNING", label: "计划中", en: "Planning", color: "bg-neutral-100 text-neutral-600" },
  { value: "IN_PROGRESS", label: "准备中", en: "In Progress", color: "bg-blue-50 text-blue-700" },
  { value: "SUBMITTED", label: "已提交", en: "Submitted", color: "bg-indigo-50 text-indigo-700" },
  { value: "INTERVIEW", label: "面试中", en: "Interview", color: "bg-purple-50 text-purple-700" },
  { value: "OFFER", label: "已获 Offer", en: "Offer", color: "bg-green-50 text-green-700" },
  { value: "ACCEPTED", label: "已接受", en: "Accepted", color: "bg-emerald-100 text-emerald-700" },
  { value: "REJECTED", label: "被拒", en: "Rejected", color: "bg-red-50 text-red-600" },
  { value: "WITHDRAWN", label: "已撤回", en: "Withdrawn", color: "bg-neutral-100 text-neutral-400" },
];

export const OFFER_TYPES = [
  { value: "CONDITIONAL", label: "有条件" },
  { value: "UNCONDITIONAL", label: "无条件" },
] as const;

export const OFFER_DECISIONS = [
  { value: "FIRM", label: "第一志愿 (Firm)" },
  { value: "INSURANCE", label: "保底 (Insurance)" },
  { value: "DECLINE", label: "拒绝" },
  { value: "ACCEPTED", label: "已接受" },
] as const;

export interface OfferInfo {
  type?: "CONDITIONAL" | "UNCONDITIONAL";
  conditions?: string;
  decision?: "FIRM" | "INSURANCE" | "DECLINE" | "ACCEPTED";
}

export interface ApplicationItem {
  id?: string;
  programId: string;
  addedAt: number;
  status: AppStatus;
  offer?: OfferInfo;
}

const KEY = "alevel:applications:v1";
const EVENT = "alevel:apps";

// ---------- localStorage（匿名用户回退） ----------
function readLocal(): ApplicationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ApplicationItem[]) : [];
  } catch {
    return [];
  }
}

function notify(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

function writeLocal(items: ApplicationItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  notify();
}

// ---------- 对外 API（异步：DB 优先，匿名回退 localStorage） ----------
export async function listApplications(): Promise<ApplicationItem[]> {
  try {
    const r = await listApplicationsAction();
    if (r.authed) return r.items.slice().sort((a, b) => a.addedAt - b.addedAt);
  } catch {
    /* 回退本地 */
  }
  return readLocal().sort((a, b) => a.addedAt - b.addedAt);
}

export async function hasApplication(programId: string): Promise<boolean> {
  try {
    const r = await hasApplicationAction(programId);
    if (r.authed) return r.has;
  } catch {
    /* 回退本地 */
  }
  return readLocal().some((a) => a.programId === programId);
}

export async function addApplication(programId: string): Promise<void> {
  try {
    const r = await addApplicationAction(programId);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  const items = readLocal();
  if (items.some((a) => a.programId === programId)) return;
  items.push({ programId, addedAt: Date.now(), status: "PLANNING" });
  writeLocal(items);
}

export async function removeApplication(programId: string): Promise<void> {
  try {
    const r = await removeApplicationAction(programId);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(readLocal().filter((a) => a.programId !== programId));
}

export async function updateApplication(
  programId: string,
  patch: Partial<ApplicationItem>
): Promise<void> {
  try {
    const r = await updateApplicationAction(programId, patch);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(
    readLocal().map((a) => (a.programId === programId ? { ...a, ...patch } : a))
  );
}

/** 订阅申请清单变化（同窗口写入 + 跨标签 storage 事件）。返回取消订阅函数。 */
export function subscribeApps(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
