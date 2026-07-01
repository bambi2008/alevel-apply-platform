"use client";

import { useEffect, useState } from "react";
import {
  listTasks,
  addTask,
  updateTask,
  deleteTask,
  subscribeTasks,
  categoryLabel,
  TASK_CATEGORIES,
  type TaskItem,
} from "@/lib/tasks/store";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DOC");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "DONE">("ALL");

  useEffect(() => {
    const sync = () => {
      listTasks().then((t) => {
        setTasks(t);
        setLoaded(true);
      });
    };
    sync();
    return subscribeTasks(sync);
  }, []);

  const onAdd = async () => {
    const t = title.trim();
    if (!t) return;
    setTitle("");
    setDueDate("");
    await addTask({ title: t, category, dueDate: dueDate || null });
  };

  const toggle = (task: TaskItem) =>
    updateTask(task.id, { status: task.status === "DONE" ? "TODO" : "DONE" });

  const visible = tasks.filter((t) =>
    filter === "ALL"
      ? true
      : filter === "DONE"
      ? t.status === "DONE"
      : t.status !== "DONE"
  );

  const openCount = tasks.filter((t) => t.status !== "DONE").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;

  const overdue = (d?: string | null) =>
    d && new Date(d) < new Date(new Date().toDateString());

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">待办清单</h1>
      <p className="text-sm text-neutral-500 mb-6">
        记录申请路上的每一项待办，登录后自动跨设备保存。
      </p>

      {/* 添加 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-6">
        <div className="flex gap-2 mb-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
            placeholder="要做什么？例如：准备成绩单翻译件"
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            onClick={onAdd}
            className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 whitespace-nowrap"
          >
            添加
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm bg-white"
          >
            {TASK_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-600"
          />
          <span className="text-xs text-neutral-400 self-center">
            （可选：分类 / 截止日期）
          </span>
        </div>
      </div>

      {/* 过滤 */}
      <div className="flex gap-1 mb-3 text-sm">
        {([
          ["ALL", `全部 ${tasks.length}`],
          ["OPEN", `未完成 ${openCount}`],
          ["DONE", `已完成 ${doneCount}`],
        ] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-3 py-1 rounded-full ${
              filter === v
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      {!loaded ? (
        <div className="py-16 text-center text-neutral-400 text-sm">加载中…</div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-neutral-400 text-sm">
          {tasks.length === 0 ? "还没有待办，添加第一条吧" : "此筛选下没有待办"}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((t) => {
            const done = t.status === "DONE";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(t)}
                  className="w-4 h-4 shrink-0 accent-blue-600"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      done ? "text-neutral-400 line-through" : "text-neutral-800"
                    }`}
                  >
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-400">
                      {categoryLabel(t.category)}
                    </span>
                    {t.dueDate && (
                      <span
                        className={`text-xs ${
                          !done && overdue(t.dueDate)
                            ? "text-red-500 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        截止 {t.dueDate}
                        {!done && overdue(t.dueDate) ? " · 已逾期" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-sm text-neutral-300 hover:text-red-600 shrink-0"
                >
                  删除
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
