import { Link } from "@/i18n/navigation";
import { CAIE9709_P3_WRITTEN_PAPERS } from "@/lib/tests/mock-papers/caie9709-p3-written-papers";

export function CaieWrittenPaperList() {
  const groups = [
    { title: "错题强化综合卷", papers: CAIE9709_P3_WRITTEN_PAPERS.slice(8) },
    { title: "基础与综合练习卷", papers: CAIE9709_P3_WRITTEN_PAPERS.slice(0, 8) },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/tests/caie9709" className="text-sm text-[var(--indigo)]">← CAIE 9709 备考详情</Link>
      <h1 className="mt-5 text-3xl font-bold">CAIE 9709 P3 完整书面模考</h1>
      <p className="mt-3 text-[var(--ink-soft)]">选择一套固定卷开始：全部为书面结构题，11 道大题 · 75 分 · 110 分钟。请写出推导过程。</p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">非官方原创练习卷；AI 反馈不是官方成绩。未成功评分的题会保留作答并标为待评。</p>
      {groups.map((group) => (
        <section key={group.title} className="mt-8" aria-label={group.title}>
          <h2 className="border-b border-[var(--border)] pb-3 text-lg font-semibold">{group.title}</h2>
          {group.papers.map((paper) => (
            <Link key={paper.id} href={`/tests/caie9709/paper/${paper.id}`} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-5 hover:text-[var(--indigo)]">
              <span>{paper.title}<span className="mt-1 block text-sm text-[var(--ink-soft)]">11 道书面题 · 75 分 · 110 分钟</span></span>
              <span className="shrink-0 text-sm text-[var(--indigo)]">进入试卷 →</span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}
