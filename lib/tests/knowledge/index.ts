import { ESAT_KNOWLEDGE, type TopicKnowledge } from "./esat";

const ALL_KNOWLEDGE: TopicKnowledge[] = [...ESAT_KNOWLEDGE];

export function getKnowledgeByTopicId(topicId: string): TopicKnowledge | undefined {
  return ALL_KNOWLEDGE.find((k) => k.topicId === topicId);
}

export type { TopicKnowledge, KnowledgeConcept, WorkedExample } from "./esat";
