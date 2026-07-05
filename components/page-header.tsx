import type { ReactNode } from "react";

// 统一的内页页头（内嵌式圆角块，放在页面容器内，只替换原标题区即可）。
// 浅色渐变网格 + 渐变标题，让各功能页与新首页视觉一致。
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  icon,
  actions,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mesh-hero grain relative overflow-hidden rounded-3xl border border-[var(--border)] px-6 py-8 sm:px-8 sm:py-9 mb-8 ${className}`}
    >
      <div className="pointer-events-none absolute -top-12 right-0 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.16),transparent_70%)] floaty-slow" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold text-[var(--indigo)] tracking-wide uppercase mb-2">{eyebrow}</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight flex items-center gap-2.5">
            {icon && <span className="text-3xl shrink-0">{icon}</span>}
            <span className="text-gradient">{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-3 text-[var(--ink-soft)] leading-relaxed max-w-2xl">{subtitle}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
