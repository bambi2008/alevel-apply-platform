// 申请清单 + Offer 存储层（当前 localStorage；接 DB 后改服务端，页面不变）。

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
  programId: string;
  addedAt: number;
  status: AppStatus;
  offer?: OfferInfo;
}

const KEY = "alevel:applications:v1";
const EVENT = "alevel:apps";

function read(): ApplicationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ApplicationItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: ApplicationItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function listApplications(): ApplicationItem[] {
  return read().sort((a, b) => a.addedAt - b.addedAt);
}

export function hasApplication(programId: string): boolean {
  return read().some((a) => a.programId === programId);
}

export function addApplication(programId: string): void {
  const items = read();
  if (items.some((a) => a.programId === programId)) return;
  items.push({ programId, addedAt: Date.now(), status: "PLANNING" });
  write(items);
}

export function removeApplication(programId: string): void {
  write(read().filter((a) => a.programId !== programId));
}

export function updateApplication(programId: string, patch: Partial<ApplicationItem>): void {
  write(read().map((a) => (a.programId === programId ? { ...a, ...patch } : a)));
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
