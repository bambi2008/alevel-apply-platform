import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";

export type EsatAuditSeverity = "critical" | "warning" | "info";

export interface EsatAuditIssue {
  paperId: string;
  moduleId?: string;
  questionId?: string;
  code: string;
  severity: EsatAuditSeverity;
  message: string;
}

export interface EsatModuleAuditSummary {
  paperId: string;
  moduleId: string;
  subject: EsatSubject;
  questions: number;
  difficulty: Record<1 | 2 | 3, number>;
  answerCounts: Record<string, number>;
  dominantAnswerShare: number;
  longestAnswerRun: number;
  topicCounts: Record<string, number>;
}

export interface EsatMockAuditReport {
  paperCount: number;
  completePaperCount: number;
  gapPaperCount: number;
  intensificationPaperCount: number;
  moduleCount: number;
  questionCount: number;
  subjectModules: Record<EsatSubject, number>;
  critical: number;
  warnings: number;
  modules: EsatModuleAuditSummary[];
  issues: EsatAuditIssue[];
}

type EsatSubject = "math" | "physics" | "chemistry" | "biology";


const normalize=(text:string)=>text.toLowerCase().replace(/\s+/g," ").trim();
export function buildEsatMockAudit():EsatMockAuditReport {
  const papers=getMockPapersForTest("esat"),issues:EsatAuditIssue[]=[];
  const add=(paperId:string,code:string,severity:EsatAuditSeverity,message:string,moduleId?:string,questionId?:string)=>issues.push({paperId,code,severity,message,moduleId,questionId});
  if(papers.length!==6) add("suite","PAPER_INVENTORY","critical","Expected six course-dependent reviewed triples.");
  add("suite","REUSED_MODULE_BANKS","warning","These combinations reuse five 27-question module banks and practice questions. They are not six unseen or officially calibrated mocks.");
  const allIds=new Set<string>();
  const modules=papers.flatMap(p=>{
    if(p.modules.length!==3 || p.modules[0].id!=="math1" || new Set(p.modules.map(m=>m.id)).size!==3)
      add(p.id,"MODULE_COUNT","critical","Each triple starts with Math 1 and two distinct course-dependent modules.");
    return p.modules.map(m=>{
      const qs=m.questions.filter((q):q is MCQQuestion=>q.type==="mcq");
      if(qs.length!==27 || qs.length!==m.questions.length) add(p.id,"QUESTION_COUNT","critical","Each module requires 27 MCQs.",m.id);
      if(m.durationSec!==2400) add(p.id,"DURATION","critical","Each module is independently timed for 40 minutes.",m.id);
      const prompts=new Set<string>(),structures=new Set<string>();
      for(const q of qs) {
        if(q.testId!=="esat") add(p.id,"TEST_ID","critical","Cross-exam question.",m.id,q.id);
        if(q.options.map(o=>o.key).join("")!=="ABCDE" || !q.options.some(o=>o.key===q.answer))
          add(p.id,"OPTION_KEYS","critical","Five continuous options and a valid answer are required.",m.id,q.id);
        if(new Set(q.options.map(o=>normalize(o.text))).size!==5) add(p.id,"DUPLICATE_DISTRACTOR","critical","Duplicate option text.",m.id,q.id);
        if(allIds.has(q.id)) add(p.id,"DUPLICATE_ID","critical","Question ID collision.",m.id,q.id);
        allIds.add(q.id);
        const prompt=normalize(q.question);
        if(prompts.has(prompt)) add(p.id,"DUPLICATE_PROMPT","critical","A prompt repeats within the same module.",m.id,q.id);
        prompts.add(prompt);
        const signature=prompt.replace(/\d+(?:\.\d+)?/g,"#");
        if(structures.has(signature)) add(p.id,"DUPLICATE_STRUCTURE","warning","A numeric template repeats within this module.",m.id,q.id);
        structures.add(signature);
      }
      const difficulty:Record<1|2|3,number>={1:0,2:0,3:0},answerCounts:Record<string,number>={},topicCounts:Record<string,number>={};
      let last="",run=0,longestAnswerRun=0;
      for(const q of qs) {
        difficulty[q.difficulty]++;answerCounts[q.answer]=(answerCounts[q.answer]??0)+1;topicCounts[q.topicId]=(topicCounts[q.topicId]??0)+1;
        run=q.answer===last?run+1:1;last=q.answer;longestAnswerRun=Math.max(run,longestAnswerRun);
      }
      const dominantAnswerShare=Math.max(0,...Object.values(answerCounts))/Math.max(1,qs.length);
      if(difficulty[3]<4) add(p.id,"TOO_FEW_HARD","warning","Difficulty is not calibrated to official challenging items; do not relabel routine items to suppress this warning.",m.id);
      if(dominantAnswerShare>0.25 || "ABCDE".split("").some(k=>!answerCounts[k])) add(p.id,"ANSWER_POSITION_BIAS","warning","Answer position imbalance.",m.id);
      if(longestAnswerRun>2) add(p.id,"ANSWER_RUN","warning","Repeated answer positions.",m.id);
      const subject:EsatSubject=m.id.startsWith("math")?"math":m.id==="chemistry"?"chemistry":m.id==="biology"?"biology":"physics";
      return {paperId:p.id,moduleId:m.id,subject,questions:qs.length,difficulty,answerCounts,topicCounts,dominantAnswerShare,longestAnswerRun};
    });
  });
  const subjectModules:Record<EsatSubject,number>={math:0,physics:0,chemistry:0,biology:0};
  for(const m of modules) subjectModules[m.subject]++;
  return {paperCount:papers.length,completePaperCount:papers.length,gapPaperCount:0,intensificationPaperCount:0,moduleCount:modules.length,questionCount:modules.reduce((n,m)=>n+m.questions,0),subjectModules,critical:issues.filter(i=>i.severity==="critical").length,warnings:issues.filter(i=>i.severity==="warning").length,modules,issues};
}
