import type { ReactNode } from "react";

// 统一内页页头（UCAS 白底风）：蓝色细横线 + 超大黑标题 + 大留白，无深色块、无渐变。
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
    <div className={`mb-8 ${className}`}>
      <span className="ucas-accent-bar" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold text-[var(--indigo)] tracking-[0.14em] uppercase mb-2">{eyebrow}</p>
          )}
          {icon && (
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--tint-blue)] text-2xl mb-3">
              {icon}
            </span>
          )}
          <h1 className="ucas-title">
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">{subtitle}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
