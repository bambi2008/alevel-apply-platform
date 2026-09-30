import type { ReactNode } from "react";

export function CorePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#f4f4f0] text-[#101817]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</div>
    </div>
  );
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
    <header className="grid gap-6 border-b border-black/15 pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/45">CORE {step}</p>
        <h1 className="mt-3 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-[#101817]">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-black/55 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      {meta ? <div className="shrink-0 text-xs font-semibold tracking-[0.16em] text-black/35">{meta}</div> : null}
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
    <nav aria-label={label} className="flex overflow-x-auto border-y border-black/15">
      {children}
    </nav>
  );
}

export const coreTabClass = (active: boolean) =>
  `shrink-0 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#101817] ${
    active
      ? "bg-[#101817] text-white"
      : "text-black/55 hover:bg-white/60 hover:text-black"
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
      <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[#101817]">{title}</h2>
      {meta ? <span className="text-xs font-semibold tracking-[0.12em] text-black/35">{meta}</span> : null}
    </div>
  );
}

export function CoreList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-4 divide-y divide-black/15 border-y border-black/15 ${className}`}>
      {children}
    </div>
  );
}
