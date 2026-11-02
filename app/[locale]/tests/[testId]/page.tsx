import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { TestDetailContent } from "@/components/test-detail";
import { getTestById } from "@/lib/tests";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { REGISTRATION_INFO } from "@/lib/tests/registration";
import { examTrainingActionLabel } from "@/lib/tests/syllabus-release";
import { localizeStaticContent } from "@/lib/content-language";
import { uiCopy } from "@/lib/ui-copy";

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string; locale: string }> }) {
  const { testId, locale } = await params;
  setRequestLocale(locale);
  const test = getTestById(testId);
  if (!test) notFound();
  return <TestDetailContent
    test={localizeStaticContent(test, locale)}
    registration={localizeStaticContent(REGISTRATION_INFO[testId], locale)}
    learnableTopicIds={test.topics.filter(topic => getKnowledgeByTopicId(topic.id)).map(topic => topic.id)}
    trainingLabel={uiCopy(locale, examTrainingActionLabel(testId))}
  />;
}
