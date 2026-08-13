"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CalendarClock, CheckCheck, ClipboardCheck, GraduationCap, Settings2, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Category = "STUDY" | "APPLICATION" | "DEADLINE" | "REPORT" | "SYSTEM";
interface Notice {
  id: string;
  category: Category;
  priority: "INFO" | "IMPORTANT" | "URGENT";
  title: string;
  body: string;
  href: string | null;
  scheduledFor: string;
  readAt: string | null;
}
interface Preferences {
  studyEnabled: boolean;
  applicationEnabled: boolean;
  deadlineEnabled: boolean;
  weeklyReportEnabled: boolean;
  emailDigestEnabled: boolean;
}

const categoryMeta = {
  STUDY: { label: "备考任务", icon: GraduationCap },
  APPLICATION: { label: "申请待办", icon: ClipboardCheck },
  DEADLINE: { label: "关键日期", icon: CalendarClock },
  REPORT: { label: "学习报告", icon: CheckCheck },
  SYSTEM: { label: "系统消息", icon: Bell },
} satisfies Record<Category, { label: string; icon: typeof Bell }>;

function timeLabel(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [noticesResponse, preferencesResponse] = await Promise.all([
        fetch("/api/notifications?limit=100"), fetch("/api/notifications/preferences"),
      ]);
      if (noticesResponse.status === 401 || preferencesResponse.status === 401) { setState("unauthorized"); return; }
      if (!noticesResponse.ok || !preferencesResponse.ok) throw new Error("load failed");
      const notices = await noticesResponse.json() as { authenticated: boolean; items: Notice[] };
      if (!notices.authenticated) { setState("unauthorized"); return; }
      setItems(notices.items);
      setPreferences(await preferencesResponse.json() as Preferences);
      setState("ready");
    } catch { setState("error"); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  const visibleItems = useMemo(() => filter === "unread" ? items.filter((item) => !item.readAt) : items, [filter, items]);
  const unreadCount = items.filter((item) => !item.readAt).length;

  const action = async (type: "read" | "dismiss" | "readAll", id?: string) => {
    if (type === "dismiss" && id) setItems((current) => current.filter((item) => item.id !== id));
    if (type === "read" && id) setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
    if (type === "readAll") setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
    await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: type, id }) });
  };

  const togglePreference = async (key: keyof Preferences) => {
    if (!preferences || key === "emailDigestEnabled") return;
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    const response = await fetch("/api/notifications/preferences", {
      method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ [key]: next[key] }),
    });
    if (response.ok) await refresh();
  };

  if (state === "loading") return <main className="mx-auto max-w-5xl px-4 py-12"><div className="h-72 animate-pulse bg-[var(--surface)]" /></main>;
  if (state === "unauthorized") return <main className="mx-auto max-w-xl px-4 py-20 text-center"><Bell className="mx-auto size-8 text-[var(--indigo)]" /><h1 className="mt-4 text-2xl font-bold">登录后查看消息</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">申请节点、备考任务和学习报告会集中显示在这里。</p><Link href="/login" className="mt-5 inline-flex rounded-md bg-[var(--indigo)] px-5 py-2.5 text-sm font-medium text-white">前往登录</Link></main>;
  if (state === "error") return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--danger)]">消息中心暂时无法加载，请稍后刷新。</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div><div className="text-xs font-semibold text-[var(--indigo)]">NOTIFICATION CENTER</div><h1 className="mt-1 text-3xl font-bold">消息中心</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">把今天该做的事、临近截止和学习反馈放在一个地方。</p></div>
        <button type="button" onClick={() => setSettingsOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface)]"><Settings2 className="size-4" />提醒设置</button>
      </header>

      {settingsOpen && preferences && (
        <section className="border-b border-[var(--border)] py-6">
          <h2 className="text-base font-bold">站内提醒</h2>
          <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <PreferenceToggle label="备考任务" detail="今日计划与逾期训练" enabled={preferences.studyEnabled} onToggle={() => togglePreference("studyEnabled")} />
            <PreferenceToggle label="申请待办" detail="七天内截止的个人任务" enabled={preferences.applicationEnabled} onToggle={() => togglePreference("applicationEnabled")} />
            <PreferenceToggle label="关键日期" detail="三十天内的重要申请节点" enabled={preferences.deadlineEnabled} onToggle={() => togglePreference("deadlineEnabled")} />
            <PreferenceToggle label="学习报告" detail="每周训练表现汇总" enabled={preferences.weeklyReportEnabled} onToggle={() => togglePreference("weeklyReportEnabled")} />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 opacity-55"><div><div className="text-sm font-medium">邮件周报</div><div className="text-xs text-[var(--ink-faint)]">邮件发送通道配置后开放</div></div><span className="text-xs font-medium text-[var(--ink-faint)]">即将开放</span></div>
        </section>
      )}

      <section className="py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-[var(--border)] p-1">
            <button type="button" onClick={() => setFilter("all")} className={`rounded px-3 py-1.5 text-sm ${filter === "all" ? "bg-[var(--ink)] text-white" : "text-[var(--ink-soft)]"}`}>全部 {items.length}</button>
            <button type="button" onClick={() => setFilter("unread")} className={`rounded px-3 py-1.5 text-sm ${filter === "unread" ? "bg-[var(--ink)] text-white" : "text-[var(--ink-soft)]"}`}>未读 {unreadCount}</button>
          </div>
          {unreadCount > 0 && <button type="button" onClick={() => action("readAll")} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--indigo)]"><CheckCheck className="size-4" />全部标为已读</button>}
        </div>

        <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {visibleItems.length === 0 ? <div className="py-16 text-center"><Bell className="mx-auto size-7 text-[var(--ink-faint)]" /><p className="mt-3 text-sm text-[var(--ink-faint)]">{filter === "unread" ? "没有未读消息" : "当前没有提醒"}</p></div> : visibleItems.map((item) => {
            const meta = categoryMeta[item.category];
            const Icon = meta.icon;
            return (
              <article key={item.id} className={`flex gap-3 py-5 sm:gap-4 ${item.readAt ? "opacity-65" : ""}`}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--info-bg)] text-[var(--indigo)]"><Icon className="size-4.5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-medium text-[var(--ink-faint)]">{meta.label}</span>{item.priority === "URGENT" && <span className="text-xs font-semibold text-[var(--danger)]">紧急</span>}<span className="text-xs text-[var(--ink-faint)]">{timeLabel(item.scheduledFor)}</span></div>
                  <h2 className="mt-1 text-sm font-bold text-[var(--ink)]">{item.title}</h2><p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{item.body}</p>
                  <div className="mt-3 flex items-center gap-4">{item.href && <Link href={item.href} onClick={() => action("read", item.id)} className="text-xs font-semibold text-[var(--indigo)]">查看并处理</Link>}{!item.readAt && <button type="button" onClick={() => action("read", item.id)} className="text-xs text-[var(--ink-soft)]">标为已读</button>}</div>
                </div>
                <button type="button" onClick={() => action("dismiss", item.id)} title="忽略此消息" className="flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--ink-faint)] hover:bg-[var(--surface)] hover:text-[var(--danger)]"><Trash2 className="size-4" /></button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PreferenceToggle({ label, detail, enabled, onToggle }: { label: string; detail: string; enabled: boolean; onToggle: () => void }) {
  return <div className="flex items-center justify-between gap-4"><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-[var(--ink-faint)]">{detail}</div></div><button type="button" role="switch" aria-checked={enabled} aria-label={`${label}提醒`} onClick={onToggle} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-[var(--indigo)]" : "bg-neutral-300"}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "left-6" : "left-1"}`} /></button></div>;
}
