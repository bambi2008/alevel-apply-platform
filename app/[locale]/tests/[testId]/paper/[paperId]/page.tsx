import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { membershipAccess } from "@/lib/membership/access";
import { seasonPassOffer } from "@/lib/membership/config";
import { getMockPaper } from "@/lib/tests/mock-papers";
import { getCurrentP3PaperId } from "@/lib/tests/mock-papers/caie9709-p3-written-papers";
import { isReleasedPaper } from "@/lib/tests/syllabus-release";
import { englishPaperPresentation } from "@/lib/tests/english-presentation";
import { SecureStudySession } from "@/components/secure-study-session";
import { MembershipRequired } from "@/components/membership-required";
import { ExamScopeNote } from "@/components/exam-scope-note";

export default async function MockPaperPage({ params }: {
  params: Promise<{ testId: string; paperId: string; locale: string }>;
}) {
  const { testId, paperId, locale } = await params;
  const en = locale === "en";
  const paper = getMockPaper(paperId);
  if (!paper || paper.testId !== testId) notFound();
  if (!isReleasedPaper(paper)) return <section className="mx-auto max-w-4xl px-5 py-12">
    <h1 className="text-2xl font-semibold">{en ? "Archived practice paper" : "旧版训练卷已隔离"}</h1>
    <p className="mt-4">{en ? "This paper cannot start a new attempt. Original questions and previous answers remain in your historical records." : "此卷不再用于新作答，原题与历史作答仍保留在历史记录中。"}</p>
    {testId === "caie9709" && <Link href={`/tests/caie9709/paper/${getCurrentP3PaperId(paper.id)}`} className="mt-5 block underline">{en ? "Open the revised Pure 3 paper →" : "打开修订后的 Pure 3 训练卷 →"}</Link>}
    <Link href={`/tests/${testId}/mock`} className="mt-5 block underline">{en ? "Choose a reviewed paper →" : "选择范围核验后的训练卷 →"}</Link>
  </section>;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/${locale}/login`);
  const access = await membershipAccess(userId);
  const offer = seasonPassOffer();
  if (!access.active) return <MembershipRequired offer={offer} expiredTrial={access.membership?.plan === "trial"} />;
  const shown = englishPaperPresentation(paper, locale);
  return <>
    <SecureStudySession testId={testId} title={shown.title} paperId={paper.id} userId={userId} offer={offer} aiEnabled={process.env.AI_ENABLED === "true" && !!process.env.DEEPSEEK_API_KEY}
      paperSummary={shown.modules.map(module => ({ title: en ? module.titleEn : module.title, count: module.questions.length, minutes: Math.round(module.durationSec / 60) }))} />
    <aside className="mx-auto max-w-4xl px-5">
      <details className="border-t border-black/15 py-4"><summary className="cursor-pointer py-2">{en ? "Paper instructions" : "作答规则"}</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">{shown.instructions?.map((instruction, i) => <li key={i}>{instruction}</li>)}</ul></details>
      <ExamScopeNote testId={testId} locale={locale} />
    </aside>
  </>;
}
