import type { ReactNode } from "react";

export function LegalPage({
  title,
  version,
  intro,
  children,
}: {
  title: string;
  version: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-semibold text-[var(--indigo)]">版本 {version}</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--ink)]">{title}</h1>
      <p className="mt-4 leading-7 text-[var(--ink-soft)]">{intro}</p>
      <div className="mt-10 space-y-9 text-[var(--ink)] [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-7 [&_p]:text-[var(--ink-soft)] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:leading-7 [&_ul]:text-[var(--ink-soft)]">
        {children}
      </div>
    </main>
  );
}
