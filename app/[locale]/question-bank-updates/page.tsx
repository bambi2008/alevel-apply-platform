import type { Metadata } from "next";
import { ADMISSIONS_TESTS } from "@/lib/tests";
import { getPracticeReleaseHistory } from "@/lib/tests/practice-updates";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Question-bank update history | QiaoShen" : "题库更新记录 | 桥申" };
}
export default async function QuestionBankUpdatesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ testId?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const english = locale === "en";
  const exams = ADMISSIONS_TESTS.filter(test => test.hasQuestionBank);
  const selected = exams.some(test => test.id === query.testId) ? query.testId : undefined;
  const history = getPracticeReleaseHistory(selected);
  return <section className="mx-auto max-w-5xl px-5 py-10">
    <h1 className="text-3xl font-semibold">{english ? "Question-bank update history" : "题库更新记录"}</h1>
    <p className="mt-3 text-sm text-black/70">{english ? "Weekly new questions enter topic practice only, not fixed mocks. Corrections use separate versions and preserve past attempts." : "每周新题只加入专项练习，不改模考；内容纠错另建版本，保留旧作答。"}</p>
    <form className="my-6 flex flex-wrap gap-3"><label className="text-sm">{english ? "Exam" : "考试"}<select aria-label={english ? "Exam" : "考试"} name="testId" defaultValue={selected ?? ""} className="ml-2 min-h-11 rounded border border-black/25 bg-white px-3"><option value="">{english ? "All exams" : "全部考试"}</option>{exams.map(test => <option key={test.id} value={test.id}>{test.abbr}</option>)}</select></label><button className="min-h-11 rounded border border-black/25 px-4 text-sm" type="submit">{english ? "Filter" : "筛选"}</button></form>
    <div className="divide-y divide-black/15 border-y border-black/15">{history.map(update => <article key={update.id} className="py-5">
      <p className="text-xs text-black/65"><time dateTime={update.publishedAt}>{new Date(update.publishedAt).toLocaleDateString(english ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai" })}</time> · <Link href={`/tests/${update.testId}`} className="inline-flex min-h-11 items-center underline">{update.testId.toUpperCase()}</Link>{update.addedQuestions > 0 ? ` · +${update.addedQuestions}` : ""}</p>
      <h2 className="font-semibold">{english ? update.titleEn : update.title}</h2><p className="mt-2 text-sm leading-6 text-black/70">{english ? update.summaryEn : update.summary}</p>
    </article>)}</div>
    {history.length === 0 && <p className="py-8 text-black/70">{english ? "No published updates for this exam yet." : "这门考试尚无已发布的题库更新。"}</p>}
  </section>;
}
