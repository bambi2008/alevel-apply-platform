import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PracticeSession } from "@/components/practice-session";
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
  const questions = getReleasedPracticeQuestions(testId);
  // Eligibility uses canonical originals, before presentation translation.
  const questionModules = Object.fromEntries(questions.map(question =>
    [question.id, assessSyllabusCandidate(question).module]));
  return <PracticeSession test={localizeStaticContent(test, locale)}
    questions={localizeStaticContent(questions, locale)} questionModules={questionModules} />;
}
