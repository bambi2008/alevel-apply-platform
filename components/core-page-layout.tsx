import type { ReactNode } from "react";

export function CorePageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">{children}</div>;
}

export function CorePageHeader({
  step,
  title,
  description,
  meta,
}: {
  step: string;
  title: string;
  description: string;
  meta?: ReactNode;
}) {
  return (
    <header className="border-b border-[var(--border)] pb-6">
      <p className="text-sm font-medium text-[var(--indigo)]">核心功能 {step}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-[var(--ink)] sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
            {description}
          </p>
        </div>
        {meta ? <div className="shrink-0 text-sm text-[var(--ink-faint)]">{meta}</div> : null}
      </div>
    </header>
  );
}

export function CoreTabBar({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={label} className="flex gap-6 overflow-x-auto border-b border-[var(--border)]">
      {children}
    </nav>
  );
}

export const coreTabClass = (active: boolean) =>
  `shrink-0 border-b-2 px-0.5 py-3 text-sm font-medium transition ${
    active
      ? "border-[var(--indigo)] text-[var(--indigo)]"
      : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
  }`;

export function CoreSectionHeader({
  title,
  meta,
}: {
  title: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
      {meta ? <span className="text-xs text-[var(--ink-faint)]">{meta}</span> : null}
    </div>
  );
}

export function CoreList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)] ${className}`}>
      {children}
    </div>
  );
}
