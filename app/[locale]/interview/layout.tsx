export default async function InterviewLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <>
    <aside className="mx-auto w-full max-w-6xl border-b border-black/15 px-5 py-3 text-sm text-[var(--ink-soft)] sm:px-8" aria-label={locale === "en" ? "Development status" : "开发状态"}>
      <strong className="font-semibold text-[var(--ink)]">{locale === "en" ? "Interviews · In development" : "面试 · 开发中"}</strong>
      <span className="ml-3">{locale === "en" ? "Available for preview; device and handwriting-marking validation is pending." : "当前可预览；设备兼容与手写评分验证尚未完成。"}</span>
    </aside>
    {children}
  </>;
}
