// 待办清单存储层。登录用户 → 数据库；匿名用户 → localStorage。
// 与申请清单同套模式：异步 API + 事件总线（写后 notify 重新同步）。

import {
  listTasksAction,
  addTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "./actions";

export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface TaskItem {
  id: string;
  title: string;
  category?: string | null;
  dueDate?: string | null; // YYYY-MM-DD
  status: TaskStatus;
  createdAt: number;
}

export const TASK_CATEGORIES: { value: string; label: string }[] = [
  { value: "DOC", label: "材料准备" },
  { value: "WRITING", label: "文书写作" },
  { value: "SUBMIT", label: "提交申请" },
  { value: "TEST", label: "笔试备考" },
  { value: "INTERVIEW", label: "面试准备" },
  { value: "OTHER", label: "其他" },
];

export function categoryLabel(v?: string | null): string {
  if (!v) return "其他";
  return TASK_CATEGORIES.find((c) => c.value === v)?.label ?? "其他";
}

const KEY = "alevel:tasks:v1";
const EVENT = "alevel:tasks";

// ---------- localStorage（匿名回退） ----------
function readLocal(): TaskItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TaskItem[]) : [];
  } catch {
    return [];
  }
}

function notify(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

function writeLocal(items: TaskItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  notify();
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return "t-" + Math.random().toString(36).slice(2) + Date.now();
}

// ---------- 对外 API ----------
export async function listTasks(): Promise<TaskItem[]> {
  try {
    const r = await listTasksAction();
    if (r.authed) return r.items.slice().sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    /* 回退本地 */
  }
  return readLocal().sort((a, b) => a.createdAt - b.createdAt);
}

export async function addTask(input: {
  title: string;
  category?: string | null;
  dueDate?: string | null;
}): Promise<void> {
  try {
    const r = await addTaskAction(input);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  const items = readLocal();
  items.push({
    id: uuid(),
    title: input.title,
    category: input.category ?? null,
    dueDate: input.dueDate ?? null,
    status: "TODO",
    createdAt: Date.now(),
  });
  writeLocal(items);
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<TaskItem, "title" | "category" | "dueDate" | "status">>
): Promise<void> {
  try {
    const r = await updateTaskAction(id, patch);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(readLocal().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const r = await deleteTaskAction(id);
    if (r.authed) {
      notify();
      return;
    }
  } catch {
    /* 回退本地 */
  }
  writeLocal(readLocal().filter((t) => t.id !== id));
}

/** 订阅待办变化。返回取消订阅函数。 */
export function subscribeTasks(cb: () => void): () => void {
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
