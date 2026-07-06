// 全站统一状态标签（小圆点 + 文字 pill）。UCAS/Common App 式的清晰状态语义。
// 只用这一套，替代各页零散的蓝/绿/红/琥珀写法。

export type StatusKind = "todo" | "active" | "done" | "warning" | "danger" | "neutral";

const STYLES: Record<StatusKind, { dot: string; cls: string }> = {
  todo: { dot: "bg-[var(--ink-faint)]", cls: "bg-[var(--surface-2)] text-[var(--ink-soft)]" },
  active: { dot: "bg-[var(--indigo)]", cls: "bg-[var(--info-bg)] text-[var(--indigo)]" },
  done: { dot: "bg-[var(--success)]", cls: "bg-[var(--success-bg)] text-[var(--success)]" },
  warning: { dot: "bg-[var(--warning)]", cls: "bg-[var(--warning-bg)] text-[var(--warning)]" },
  danger: { dot: "bg-[var(--danger)]", cls: "bg-[var(--danger-bg)] text-[var(--danger)]" },
  neutral: { dot: "bg-[var(--ink-faint)]", cls: "bg-[var(--surface-2)] text-[var(--ink-soft)]" },
};

export function StatusBadge({
  kind,
  label,
  dot = true,
}: {
  kind: StatusKind;
  label: string;
  dot?: boolean;
}) {
  const s = STYLES[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}
      {label}
    </span>
  );
}

// 申请状态（AppStatus 枚举）→ 统一标签的映射
export function appStatusMeta(status: string): { kind: StatusKind; label: string } {
  switch (status) {
    case "PLANNING": return { kind: "todo", label: "计划中" };
    case "IN_PROGRESS": return { kind: "active", label: "进行中" };
    case "SUBMITTED": return { kind: "done", label: "已提交" };
    case "INTERVIEW": return { kind: "active", label: "面试中" };
    case "OFFER": return { kind: "done", label: "已获 Offer" };
    case "ACCEPTED": return { kind: "done", label: "已接受" };
    case "REJECTED": return { kind: "danger", label: "未录取" };
    case "WITHDRAWN": return { kind: "neutral", label: "已撤回" };
    default: return { kind: "neutral", label: status };
  }
}
