// 背景规划存储层。登录 → 数据库；匿名 → localStorage。事件总线驱动刷新。

import {
  listBackgroundAction,
  addBackgroundAction,
  updateBackgroundAction,
  deleteBackgroundAction,
} from "./actions";

export type BgStatus = "PLANNED" | "IN_PROGRESS" | "DONE";

export interface BackgroundPlanItem {
  id: string;
  catalogId?: string | null;
  title: string;
  category: string;
  field?: string | null;
  status: BgStatus;
  notes?: string | null;
  targetDate?: string | null;
  createdAt: number;
}

export const BG_STATUS_LABELS: { value: BgStatus; label: string }[] = [
  { value: "PLANNED", label: "计划中" },
  { value: "IN_PROGRESS", label: "进行中" },
  { value: "DONE", label: "已完成" },
];

export function statusLabel(s: BgStatus): string {
  return BG_STATUS_LABELS.find((x) => x.value === s)?.label ?? s;
}

const KEY = "alevel:background:v1";
const EVENT = "alevel:background";

function readLocal(): BackgroundPlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BackgroundPlanItem[]) : [];
  } catch {
    return [];
  }
}

function notify(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

function writeLocal(items: BackgroundPlanItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  notify();
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return "bg-" + Math.random().toString(36).slice(2) + Date.now();
}

export async function listBackground(): Promise<BackgroundPlanItem[]> {
  try {
    const r = await listBackgroundAction();
    if (r.authed) return r.items.slice().sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    /* 回退本地 */
  }
  return readLocal().sort((a, b) => a.createdAt - b.createdAt);
}

export async function addBackground(input: {
  catalogId?: string | null;
  title: string;
  category: string;
  field?: string | null;
  targetDate?: string | null;
}): Promise<void> {
  try {
    const r = await addBackgroundAction(input);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  const items = readLocal();
  // 本地也做 catalogId 去重
  if (input.catalogId && items.some((i) => i.catalogId === input.catalogId)) return;
  items.push({
    id: uuid(),
    catalogId: input.catalogId ?? null,
    title: input.title,
    category: input.category,
    field: input.field ?? null,
    status: "PLANNED",
    targetDate: input.targetDate ?? null,
    createdAt: Date.now(),
  });
  writeLocal(items);
}

export async function updateBackground(
  id: string,
  patch: Partial<Pick<BackgroundPlanItem, "status" | "notes" | "targetDate">>
): Promise<void> {
  try {
    const r = await updateBackgroundAction(id, patch);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(readLocal().map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

export async function deleteBackground(id: string): Promise<void> {
  try {
    const r = await deleteBackgroundAction(id);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(readLocal().filter((i) => i.id !== id));
}

/** 已加入规划的 catalogId 集合（用于在推荐里标记"已添加"）。 */
export function plannedCatalogIds(items: BackgroundPlanItem[]): Set<string> {
  return new Set(items.map((i) => i.catalogId).filter(Boolean) as string[]);
}

export function subscribeBackground(cb: () => void): () => void {
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
