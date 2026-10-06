import { ESAT_KNOWLEDGE, type TopicKnowledge } from "./esat";
import { ESAT_BIO_CHEM_KNOWLEDGE } from "./esat-bio-chem";
import { ESAT_PHYS_EXTRA_KNOWLEDGE } from "./esat-phys-extra";
import { ESAT_CHEM_BIO_EXTRA_KNOWLEDGE } from "./esat-chem-bio-extra";
import { MAT_STEP_KNOWLEDGE } from "./mat-step";
import { PAT_KNOWLEDGE } from "./pat";
import { LNAT_KNOWLEDGE } from "./lnat";
import { TARA_KNOWLEDGE } from "./tara";
import { BPHO_KNOWLEDGE } from "./bpho";
import { BMO_KNOWLEDGE } from "./bmo";
import { TMUA_SPEC_KNOWLEDGE } from "./tmua-spec";
import { UCAT_KNOWLEDGE } from "./ucat";
import { IELTS_CSAT_KNOWLEDGE } from "./ielts-csat";
import { CAIE9709_KNOWLEDGE } from "./caie9709";
import { getReleasedPracticeQuestions } from "../practice-banks";
import { getTestById } from "../index";
import { EXAM_SCOPE_NOTES } from "../syllabus-release";

const ALL_KNOWLEDGE: TopicKnowledge[] = [
  ...ESAT_KNOWLEDGE,
  ...ESAT_BIO_CHEM_KNOWLEDGE,
  ...ESAT_PHYS_EXTRA_KNOWLEDGE,
  ...ESAT_CHEM_BIO_EXTRA_KNOWLEDGE,
  ...MAT_STEP_KNOWLEDGE,
  ...PAT_KNOWLEDGE,
  ...LNAT_KNOWLEDGE,
  ...TARA_KNOWLEDGE,
  ...BPHO_KNOWLEDGE,
  ...BMO_KNOWLEDGE,
  ...TMUA_SPEC_KNOWLEDGE,
  ...UCAT_KNOWLEDGE,
  ...IELTS_CSAT_KNOWLEDGE,
  ...CAIE9709_KNOWLEDGE,
];

export function getKnowledgeByTopicId(topicId: string): TopicKnowledge | undefined {
  const testId=topicId.split("-")[0];
  if(["esat","tmua","mat","step","pat","csat","bpho"].includes(testId)) {
    const topic=getTestById(testId)?.topics.find(t=>t.id===topicId);
    if(!topic) return undefined;
    const example=getReleasedPracticeQuestions(testId).find(q=>q.topicId===topicId);
    return {
      topicId, overview:topic.description,
      concepts:[{name:"训练边界",body:EXAM_SCOPE_NOTES[testId],keyPoints:["以考试机构给出的前置知识要求为准；新概念只有题目提供足够引导时才能使用。","本站例题是范围受限训练，不代表完整考纲覆盖或官方难度。"]}],
      workedExamples:example ? [example.type==="mcq"
        ? {title:"范围内基础例题",question:example.question,options:example.options,answer:example.answer,solution:example.solution}
        : {title:"范围内书面例题",question:[example.context,...example.parts.map(p=>p.question)].filter(Boolean).join("\n\n"),solution:example.fullSolution}] : [],
    };
  }
  return ALL_KNOWLEDGE.find((k) => k.topicId === topicId);
}

export type { TopicKnowledge, KnowledgeConcept, WorkedExample } from "./esat";
