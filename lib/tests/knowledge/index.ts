import { ESAT_KNOWLEDGE, type TopicKnowledge } from "./esat";
import { ESAT_BIO_CHEM_KNOWLEDGE } from "./esat-bio-chem";

const ALL_KNOWLEDGE: TopicKnowledge[] = [...ESAT_KNOWLEDGE, ...ESAT_BIO_CHEM_KNOWLEDGE];

export function getKnowledgeByTopicId(topicId: string): TopicKnowledge | undefined {
  return ALL_KNOWLEDGE.find((k) => k.topicId === topicId);
}

export type { TopicKnowledge, KnowledgeConcept, WorkedExample } from "./esat";
