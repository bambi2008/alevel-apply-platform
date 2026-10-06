import type { Question } from "./questions/types";
import type { MockPaper } from "./mock-papers";
import { assessSyllabusCandidate,syllabusFingerprint,syllabusText } from "./syllabus-policy";
import { PAPER_RELEASE_HASHES, PRACTICE_RELEASE_HASHES } from "./syllabus-manifest";

export const EXAM_SCOPE_NOTES:Record<string,string> = {
  esat:"五模块分开核验。Math 1 无微积分；Math 2 不要求复数、矩阵或一般微分方程。各组合复用模块题，与专项练习共享；仅供范围受限训练，不代表未见题、完整覆盖或官方难度。请按申请课程选择模块。",
  tmua:"微积分限有理幂及化简后的和差；不要求指数/三角求导、方差、随机变量分布或数学归纳法。基础期望频数仍在考纲内。",
  caie9709:"仅为 9709 Pure 3，不混 Paper 1 / Mechanics / Statistics；现行向量为点、线和标量积。",
  step:"STEP 2/3 分开核验。复数与 2×2 矩阵可属 STEP 2；De Moivre、一般复根、平面与向量积等属 STEP 3。",
  mat:"已停用，仅保留最后历史考纲范围训练，不是现行入学考试。",
  pat:"已停用，仅为历史基础训练；不当作当前 ESAT 的题库或完整模考。",
  csat:"部分学院附加评估；当前公开来源不足以确认本站卷面结构。仅供准备训练，不宣称现行全真卷。",
  bpho:"Round 1/2 不能混用。本站只提供范围受限的训练；未核实的大学级方法不进入新题组，不宣称官方完整卷。",
  bmo:"BMO1 是完整书面证明；短选择题仅供基础练习，不是 BMO1/BMO2 完整模考。",
  tara:"日常推理、基础算术、问题解决与写作；不要求先验专业学科知识。",
  ucat:"四模块能力测试；不含 Abstract Reasoning，不要求医学知识或高阶数学。",
  lnat:"基于给定文章阅读和论证写作，不要求法律专业知识。",
  ielts:"语言技能训练，不要求先验学科知识；合成听力音频和平台评分不等于官方录音或官方 Band。",
};
export function bankReleaseFingerprint(bank:Question[]):string {return syllabusFingerprint({bank} as unknown as Question);}
export function paperReleaseFingerprint(paper:MockPaper):string {return syllabusFingerprint(paper as unknown as Question);}
export function releasedPracticeBank(testId:string,bank:Question[]):Question[] {
  if(PRACTICE_RELEASE_HASHES[testId]!==bankReleaseFingerprint(bank)) return [];
  return bank.filter(q=>q.testId===testId && assessSyllabusCandidate(q).allowed);
}
export function isReleasedPaper(paper:MockPaper):boolean {
  return PAPER_RELEASE_HASHES[paper.id]===paperReleaseFingerprint(paper) && paperMeetsBoundary(paper);
}
/** Display-only: original IDs/content remain immutable for historical grading. */
export const LIMITED_TRAINING_TEST_IDS = ["esat","bpho","csat","ielts"] as const;
export function isLimitedTrainingTest(testId:string):boolean {
  return (LIMITED_TRAINING_TEST_IDS as readonly string[]).includes(testId);
}
export function examTrainingActionLabel(testId:string):string {
  return testId==="esat" ? "模块计时训练" : isLimitedTrainingTest(testId) || ["mat","pat"].includes(testId) ? "计时训练" : "选择训练卷";
}
export function paperTrainingTitle(paper:MockPaper):string {
  if(isLimitedTrainingTest(paper.testId)) {
    const identity=paper.testId==="esat" ? paper.modules.map(m=>m.titleEn).join(" + ") : paper.id;
    return `${paper.testId.toUpperCase()} · 范围训练 · ${identity}`;
  }
  if(["mat","pat"].includes(paper.testId)) return paper.title+" · 历史训练";
  return paper.title;
}
export function limitedTrainingInstructions(paper:MockPaper):string[] {
  return [
    "范围受限的原创计时训练，不是官方真题、全真考试或完整考纲覆盖。",
    "题目可能与其他训练组合及专项练习复用；训练分数不代表官方成绩或难度等值。",
    ...(paper.testId==="esat" ? ["无计算器；各模块独立计时，时间不能互相挪用。"] : []),
  ];
}
export function paperPresentation(paper:MockPaper):MockPaper {
  if(isLimitedTrainingTest(paper.testId)) return {...paper,title:paperTrainingTitle(paper),titleEn:`${paper.testId.toUpperCase()} · Limited timed practice · ${paper.id}`,
    description:EXAM_SCOPE_NOTES[paper.testId],formatType:"extension",instructions:limitedTrainingInstructions(paper)};
  if(!["mat","pat"].includes(paper.testId)) return paper;
  return {...paper,title:paperTrainingTitle(paper),description:EXAM_SCOPE_NOTES[paper.testId]};
}
/** A real presentation contract, not an allowlist of audit warnings. Missing or
 * modified disclaimers and any full-exam relabelling remain release blockers. */
export function trainingPresentationViolations(source:MockPaper,shown:MockPaper):string[] {
  if(!isLimitedTrainingTest(source.testId)) return [];
  const failures:string[]=[];
  if(shown.id!==source.id || shown.testId!==source.testId || shown.modules!==source.modules) failures.push("Training identity or module content changed");
  if(shown.title!==paperTrainingTitle(source) || shown.titleEn!==`${source.testId.toUpperCase()} · Limited timed practice · ${source.id}`) failures.push("Unsupported full-exam title");
  if(shown.formatType!=="extension") failures.push("Limited training cannot be advertised as a verified current full examination");
  if(shown.description!==EXAM_SCOPE_NOTES[source.testId]) failures.push("Required scope disclosure is missing or changed");
  if(JSON.stringify(shown.instructions)!==JSON.stringify(limitedTrainingInstructions(source))) failures.push("Required training/score/reuse limitations are missing");
  return failures;
}
export function paperMeetsBoundary(paper:MockPaper):boolean {
  const qs=paper.modules.flatMap(m=>m.questions);
  if(!qs.length || qs.some(q=>q.testId!==paper.testId || !assessSyllabusCandidate(q).allowed)) return false;
  if(paper.testId==="esat") return paper.modules.length===3 && paper.modules[0].id==="math1"
    && new Set(paper.modules.map(m=>m.id)).size===3
    && paper.modules.every(m=>m.durationSec===2400 && m.questions.length===27 && m.questions.every(q=>assessSyllabusCandidate(q).module===m.id));
  if(paper.testId==="tmua") return paper.modules.length===2 && paper.modules.every(m=>m.durationSec===4500 && m.questions.length===20 && m.questions.every(q=>q.type==="mcq"));
  if(paper.testId==="step") {
    if(!/^step[23]-written-/.test(paper.id) || qs.length!==12 || qs.some(q=>q.type!=="long" || q.totalMarks!==20) || paper.bestQuestionCount!==6) return false;
    if(paper.id.startsWith("step2-")) return !qs.some(q=>/De Moivre|roots of unity|nth roots|cross product|vector product|plane equation|Maclaurin|polar coordinates|hyperbolic/i.test(syllabusText(q)));
  }
  if(paper.testId==="bmo") return qs.length===6 && qs.every(q=>q.type==="long" && q.totalMarks===10) && paper.modules.length===1 && paper.modules[0].durationSec===12600;
  if(paper.testId==="bpho") return paper.id.startsWith("bpho-written-");
  return true;
}
