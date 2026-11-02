import { Link } from "@/i18n/navigation";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { localizeStaticContent } from "@/lib/content-language";

export function CaieWrittenPaperList({ locale = "zh-CN" }: { locale?: string }) {
  const en = locale === "en";
  const papers = localizeStaticContent(getMockPapersForTest("caie9709"), locale)
    .slice().sort((a, b) => Number(a.id.match(/written-(\d+)/)?.[1]) - Number(b.id.match(/written-(\d+)/)?.[1]));
  const groups = [
    { title: en ? "Targeted error practice" : "错题强化综合卷", papers: papers.slice(8) },
    { title: en ? "Foundation and mixed practice" : "基础与综合练习卷", papers: papers.slice(0, 8) },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/tests/caie9709" className="text-sm text-[var(--indigo)]">{en ? "← CAIE 9709 overview" : "← CAIE 9709 备考详情"}</Link>
      <h1 className="mt-5 text-3xl font-bold">{en ? "CAIE 9709 P3 written practice papers" : "CAIE 9709 P3 完整书面模考"}</h1>
      <p className="mt-3 text-[var(--ink-soft)]">{en ? "11 structured questions · 75 marks · 110 minutes. Show your working." : "选择一套固定卷开始：全部为书面结构题，11 道大题 · 75 分 · 110 分钟。请写出推导过程。"}</p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{en ? "Original, unofficial practice. AI feedback is not an official result; ungraded work is retained as pending." : "非官方原创练习卷；AI 反馈不是官方成绩。未成功评分的题会保留作答并标为待评。"}</p>
      {groups.map((group) => (
        <section key={group.title} className="mt-8" aria-label={group.title}>
          <h2 className="border-b border-[var(--border)] pb-3 text-lg font-semibold">{group.title}</h2>
          {group.papers.map((paper) => (
            <Link key={paper.id} href={`/tests/caie9709/paper/${paper.id}`} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-5 hover:text-[var(--indigo)]">
              <span>{en ? paper.titleEn : paper.title}<span className="mt-1 block text-sm text-[var(--ink-soft)]">{en ? "11 written questions · 75 marks · 110 minutes" : "11 道书面题 · 75 分 · 110 分钟"}</span></span>
              <span className="shrink-0 text-sm text-[var(--indigo)]">{en ? "Open paper →" : "进入试卷 →"}</span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}
