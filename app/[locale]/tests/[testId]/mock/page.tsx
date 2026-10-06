import { CaieWrittenPaperList } from "@/components/caie-written-paper-list";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { getTestById } from "@/lib/tests";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ExamScopeNote } from "@/components/exam-scope-note";
import { paperTrainingTitle } from "@/lib/tests/syllabus-release";

export default async function MockExamPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  // The main CTA and existing /mock bookmarks both reach fixed written papers.
  if (testId === "caie9709") return <CaieWrittenPaperList />;
  const test=getTestById(testId);
  if(!test?.hasQuestionBank) notFound();
  const papers=getMockPapersForTest(testId);
  return <main className="mx-auto max-w-6xl px-4 py-8">
    <Link href={`/tests/${testId}`} className="text-sm">← 返回 {test.name}</Link>
    <h1 className="mt-6 text-3xl font-bold">选择训练卷</h1>
    <ExamScopeNote testId={testId} />
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {papers.map(p=><Link key={p.id} href={`/tests/${testId}/paper/${p.id}`} className="rounded border p-5 transition hover:bg-black/5">
        <h2 className="font-semibold">{paperTrainingTitle(p)}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{p.modules.map(m=>`${m.title} · ${m.questions.length}题 · ${Math.round(m.durationSec/60)}分钟`).join(" / ")}</p>
        <span className="mt-4 block text-sm">开始训练 →</span>
      </Link>)}
    </div>
    {!papers.length && <p className="mt-6">当前卷面更新待核验，请先进行专项练习。</p>}
  </main>;
}
