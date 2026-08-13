"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NavIcon } from "@/components/nav-icons";

interface Notice {
  id: string;
  title: string;
  body: string;
  href: string | null;
  priority: "INFO" | "IMPORTANT" | "URGENT";
  readAt: string | null;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notice[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/notifications?limit=5");
    if (!response.ok) return;
    const data = await response.json() as { items: Notice[]; unreadCount: number };
    setItems(data.items);
    setUnreadCount(data.unreadCount);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const markRead = async (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
    setUnreadCount((count) => Math.max(0, count - (items.find((item) => item.id === id)?.readAt ? 0 : 1)));
    await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "read", id }) });
  };

  const readAll = async () => {
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
    setUnreadCount(0);
    await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "readAll" }) });
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={`消息提醒${unreadCount ? `，${unreadCount} 条未读` : ""}`} className="relative flex size-9 items-center justify-center rounded-md text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]">
        <NavIcon name="bell" width={19} height={19} />
        {unreadCount > 0 && <span className="absolute right-0 top-0 flex min-w-4 h-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
          <div className="flex h-12 items-center justify-between border-b border-[var(--border)] px-4">
            <span className="text-sm font-bold">消息提醒</span>
            {unreadCount > 0 && <button type="button" onClick={readAll} className="inline-flex items-center gap-1 text-xs font-medium text-[var(--indigo)]"><CheckCheck className="size-3.5" />全部已读</button>}
          </div>
          <div className="max-h-80 divide-y divide-[var(--border)] overflow-y-auto">
            {items.length === 0 ? <p className="px-4 py-8 text-center text-sm text-[var(--ink-faint)]">当前没有新提醒</p> : items.map((item) => (
              <Link key={item.id} href={item.href ?? "/notifications"} onClick={() => { void markRead(item.id); setOpen(false); }} className={`block px-4 py-3 hover:bg-[var(--surface)] ${item.readAt ? "opacity-65" : ""}`}>
                <div className="flex gap-2">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.priority === "URGENT" ? "bg-[var(--danger)]" : item.priority === "IMPORTANT" ? "bg-[var(--warning)]" : "bg-[var(--indigo)]"}`} />
                  <span className="min-w-0"><span className="block text-sm font-semibold text-[var(--ink)]">{item.title}</span><span className="mt-0.5 block text-xs leading-5 text-[var(--ink-soft)]">{item.body}</span></span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-[var(--border)] px-4 py-3 text-center text-xs font-semibold text-[var(--indigo)] hover:bg-[var(--surface)]">查看全部消息</Link>
        </div>
      )}
    </div>
  );
}
