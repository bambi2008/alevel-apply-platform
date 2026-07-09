import { ESAT_KNOWLEDGE, type TopicKnowledge } from "./esat";
import { ESAT_BIO_CHEM_KNOWLEDGE } from "./esat-bio-chem";
import { ESAT_PHYS_EXTRA_KNOWLEDGE } from "./esat-phys-extra";
import { ESAT_CHEM_BIO_EXTRA_KNOWLEDGE } from "./esat-chem-bio-extra";
import { MAT_STEP_KNOWLEDGE } from "./mat-step";
import { PAT_KNOWLEDGE } from "./pat";
import { LNAT_KNOWLEDGE } from "./lnat";

const ALL_KNOWLEDGE: TopicKnowledge[] = [
  ...ESAT_KNOWLEDGE,
  ...ESAT_BIO_CHEM_KNOWLEDGE,
  ...ESAT_PHYS_EXTRA_KNOWLEDGE,
  ...ESAT_CHEM_BIO_EXTRA_KNOWLEDGE,
  ...MAT_STEP_KNOWLEDGE,
  ...PAT_KNOWLEDGE,
  ...LNAT_KNOWLEDGE,
];

export function getKnowledgeByTopicId(topicId: string): TopicKnowledge | undefined {
  return ALL_KNOWLEDGE.find((k) => k.topicId === topicId);
}

export type { TopicKnowledge, KnowledgeConcept, WorkedExample } from "./esat";
