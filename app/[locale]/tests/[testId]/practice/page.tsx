import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SecureStudySession } from "@/components/secure-study-session";
import { MembershipRequired } from "@/components/membership-required";
import { ExamScopeNote } from "@/components/exam-scope-note";
import { auth } from "@/auth";
import { membershipAccess } from "@/lib/membership/access";
import { seasonPassOffer } from "@/lib/membership/config";
import { getTestById } from "@/lib/tests";
import { getReleasedPracticeQuestions } from "@/lib/tests/practice-banks";
import { assessSyllabusCandidate } from "@/lib/tests/syllabus-policy";
import { localizeStaticContent } from "@/lib/content-language";

export default async function PracticePage({ params }: {
  params: Promise<{ locale: string; testId: string }>;
}) {
  const { locale, testId } = await params;
  setRequestLocale(locale);
  const test = getTestById(testId);
  if (!test?.hasQuestionBank) notFound();
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/${locale}/login`);
  const access = await membershipAccess(userId);
  const offer = seasonPassOffer();
  if (!access.active) return <MembershipRequired offer={offer} expiredTrial={access.membership?.plan === "trial"} />;
  const questions = getReleasedPracticeQuestions(testId);
  // Eligibility uses canonical originals, before presentation translation.
  const shown = localizeStaticContent(test, locale);
  return <>
    <SecureStudySession testId={testId} title={shown.name} userId={userId} offer={offer} aiEnabled={process.env.AI_ENABLED === "true" && !!process.env.DEEPSEEK_API_KEY}
      topics={shown.topics.map(topic => ({ id: topic.id, title: locale === "en" ? topic.titleEn : topic.title }))}
      catalog={questions.map(question => ({ id: question.id, topicId: question.topicId,
        difficulty: question.difficulty, type: question.type, module: assessSyllabusCandidate(question).module }))} />
    <aside className="mx-auto max-w-4xl px-5"><ExamScopeNote testId={testId} locale={locale} /></aside>
  </>;
}
