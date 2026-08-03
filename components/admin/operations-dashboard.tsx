"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  Users,
} from "lucide-react";
import type { OperationsDashboardData } from "@/lib/operations/dashboard";

function formatTime(value: string | null) {
  if (!value) return "暂无";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function eventMessage(meta: unknown) {
  if (!meta || typeof meta !== "object") return "未提供详情";
  const message = (meta as { message?: unknown }).message;
  return typeof message === "string" ? message : "未提供详情";
}

export function OperationsDashboard({ initialData }: { initialData: OperationsDashboardData }) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/operations", { cache: "no-store" });
      if (!response.ok) throw new Error("refresh failed");
      setData(await response.json() as OperationsDashboardData);
      setRefreshError(false);
    } catch {
      setRefreshError(true);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const healthy = data.status === "healthy";
  const backupHealthy = data.backup.status === "ok";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-950">运行状态</h1>
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${healthy ? "text-emerald-700" : "text-red-700"}`}>
              {healthy ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
              {healthy ? "服务正常" : "服务降级"}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">发布、依赖、备份、异常事件与管理员操作的实时视图</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />刷新
        </button>
      </header>

      {refreshError && <p className="border-l-2 border-red-500 pl-3 text-sm text-red-700">刷新失败，正在保留最近一次成功结果。</p>}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="运行摘要">
        {[
          { label: "当前发布", value: data.release, detail: `运行 ${Math.floor(data.uptimeSeconds / 60)} 分钟`, icon: Server },
          { label: "数据库", value: data.checks.database.status === "ok" ? "正常" : "异常", detail: `${data.checks.database.latencyMs} ms`, icon: Database },
          { label: "文件存储", value: data.checks.storage.status === "ok" ? "正常" : "异常", detail: `${data.checks.storage.latencyMs} ms`, icon: HardDrive },
          { label: "加密备份", value: backupHealthy ? "正常" : data.backup.status, detail: data.backup.ageHours === null ? "暂无可用备份" : `${data.backup.ageHours} 小时前`, icon: Clock3 },
        ].map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500"><span className="text-xs font-medium">{label}</span><Icon className="size-4" /></div>
            <p className="mt-2 truncate text-lg font-semibold text-neutral-950" title={String(value)}>{value}</p>
            <p className="mt-1 text-xs text-neutral-500">{detail}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-base font-semibold text-neutral-950">过去 24 小时</h2><p className="mt-0.5 text-xs text-neutral-500">用于快速判断业务是否仍在正常流动</p></div>
          <span className="text-xs text-neutral-500">更新于 {formatTime(data.checkedAt)}</span>
        </div>
        <div className="grid grid-cols-3 border-y border-neutral-200 bg-neutral-50">
          {[
            ["新用户", data.activity.users, Users],
            ["完成考试", data.activity.examSessions, Activity],
            ["系统事件", data.activity.operationalEvents, AlertTriangle],
          ].map(([label, value, Icon]) => {
            const MetricIcon = Icon as typeof Activity;
            return <div key={String(label)} className="border-r border-neutral-200 px-4 py-4 last:border-r-0"><MetricIcon className="mb-2 size-4 text-neutral-500" /><p className="text-2xl font-semibold tabular-nums text-neutral-950">{String(value)}</p><p className="text-xs text-neutral-500">{String(label)}</p></div>;
          })}
        </div>
      </section>

      <section>
        <div className="mb-3"><h2 className="text-base font-semibold text-neutral-950">最近系统事件</h2><p className="mt-0.5 text-xs text-neutral-500">应用错误和健康检查异常会自动进入这里并触发已配置的 Webhook</p></div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2.5">时间</th><th className="px-3 py-2.5">级别</th><th className="px-3 py-2.5">来源</th><th className="px-3 py-2.5">事件</th><th className="px-3 py-2.5">详情</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {data.operationalEvents.length ? data.operationalEvents.map((event) => (
                <tr key={String(event.id)}><td className="whitespace-nowrap px-3 py-3 text-neutral-500">{formatTime(String(event.createdAt))}</td><td className="px-3 py-3 font-medium text-red-700">{String(event.action).replace("OPERATIONS_", "")}</td><td className="px-3 py-3 text-neutral-700">{String(event.entity ?? "application")}</td><td className="px-3 py-3 font-mono text-xs text-neutral-700">{String(event.entityId ?? "-")}</td><td className="max-w-sm truncate px-3 py-3 text-neutral-600">{eventMessage(event.meta)}</td></tr>
              )) : <tr><td colSpan={5} className="px-3 py-8 text-left text-sm text-neutral-500 sm:text-center">暂无系统异常事件</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3"><h2 className="text-base font-semibold text-neutral-950">管理员审计轨迹</h2><p className="mt-0.5 text-xs text-neutral-500">最近的角色、内容与题库校准操作</p></div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2.5">时间</th><th className="px-3 py-2.5">操作</th><th className="px-3 py-2.5">对象</th><th className="px-3 py-2.5">管理员</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {data.auditLogs.length ? data.auditLogs.map((event) => {
                const actor = event.actor as { email?: string | null; phone?: string | null } | null;
                return <tr key={String(event.id)}><td className="whitespace-nowrap px-3 py-3 text-neutral-500">{formatTime(String(event.createdAt))}</td><td className="px-3 py-3 font-medium text-neutral-900">{String(event.action)}</td><td className="px-3 py-3 text-neutral-600">{String(event.entity ?? "-")} {event.entityId ? `· ${String(event.entityId).slice(0, 12)}` : ""}</td><td className="px-3 py-3 text-neutral-600">{actor?.email || actor?.phone || "系统"}</td></tr>;
              }) : <tr><td colSpan={4} className="px-3 py-8 text-center text-sm text-neutral-500">暂无管理员操作记录</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
