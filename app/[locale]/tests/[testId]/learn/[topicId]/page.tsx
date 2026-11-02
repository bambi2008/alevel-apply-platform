import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTestById } from "@/lib/tests";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { localizeStaticContent } from "@/lib/content-language";
import { KnowledgeTopic } from "@/components/knowledge-topic";

/** Select static study content on the server; do not ship unrelated banks. */
export default async function LearnPage({ params }: {
  params: Promise<{ testId: string; topicId: string; locale: string }>;
}) {
  const { testId, topicId, locale } = await params;
  setRequestLocale(locale);
  const test = getTestById(testId);
  const topic = test?.topics.find(t => t.id === topicId);
  const knowledge = topic ? getKnowledgeByTopicId(topicId) : undefined;
  if (!test || !topic || !knowledge) notFound();
  return <KnowledgeTopic testId={testId} testAbbr={test.abbr}
    topicTitle={locale === "en" ? topic.titleEn : topic.title} topicTitleEn={topic.titleEn}
    knowledge={localizeStaticContent(knowledge, locale)} />;
}
