import type { MockPaper } from "./index";
import type { LongQuestion,MCQQuestion } from "../questions/types";
import { TMUA_QUESTIONS } from "../questions/tmua";
import { STEP_QUESTIONS } from "../questions/step";
import { assessSyllabusCandidate,syllabusText } from "../syllabus-policy";
const s=String.raw;

function normalizeTmua(q:MCQQuestion):MCQQuestion {
  // Old fixed papers incorrectly tagged their pure trigonometry as Calculus.
  // Only reviewed simple trig is remapped, with fresh revision identifiers.
  if(q.topicId==="tmua-calc" && /\\(?:sin|cos|tan)\b/.test(q.question) && !/differentiat|derivative|\\int|tangent.*curve|gradient.*curve/i.test(q.question)) return {...q,topicId:"tmua-geometry"};
  return q;
}
export function reviseTmuaPapers(papers:MockPaper[]):MockPaper[] {
  const safe=TMUA_QUESTIONS.filter(q=>assessSyllabusCandidate(q).allowed);
  const prompt=(q:MCQQuestion)=>q.question.toLowerCase().replace(/\s+/g," ").trim();
  const usedPrompts=new Set(papers.flatMap(p=>p.modules.flatMap(m=>m.questions))
    .filter((q):q is MCQQuestion=>q.type==="mcq").map(normalizeTmua)
    .filter(q=>assessSyllabusCandidate(q).allowed).map(prompt));
  return papers.map(p=> {
    const used=new Set<string>();
    const modules=p.modules.map((m,mi)=>({...m,questions:m.questions.map((old,qi)=> {
      if(old.type!=="mcq") throw new Error("TMUA cannot contain written questions");
      let q=normalizeTmua(old);
      if(!assessSyllabusCandidate(q).allowed) {
        const topic=mi===1?"tmua-logic":q.topicId;
        const replacement=safe.find((candidate):candidate is MCQQuestion=>candidate.type==="mcq" && candidate.topicId===topic && !used.has(candidate.id) && !usedPrompts.has(prompt(candidate)));
        if(!replacement) throw new Error(`No reviewed TMUA replacement for ${p.id}/${q.id}`);
        q=replacement;
      }
      used.add(q.id);
      usedPrompts.add(prompt(q));
      return {...q,id:`${p.id}-boundary-${mi+1}-${String(qi+1).padStart(2,"0")}`};
    })}));
    return {...p,id:`${p.id}-boundary`,title:`${p.title} · 范围修订版`,titleEn:`${p.titleEn} · scope revision`,description:"两卷各 20 题、75 分钟。隔离越界题，保留原有合法题并补入同范围题；不是官方真题，不声称官方难度等值。各修订卷可能复用少量替换题。",modules};
  });
}
const STEP2_EXTRA=/De Moivre|roots of unity|nth roots|cross product|vector product|plane equation|Maclaurin|polar coordinates|hyperbolic/i;
function complexReplacement():LongQuestion {
  const parts=[
    {label:"(i)",marks:6,question:s`The polynomial $p(x)=x^4-5x^3+ax^2+bx-30$ has real coefficients and $2+i$ is a root. Find $a,b$.`,solutionOutline:s`[M2] $(2+i)^2=3+4i$, $(2+i)^3=2+11i$, $(2+i)^4=-7+24i$. [M2] Equate real and imaginary parts: $3a+2b=47$, $4a+b=31$. [A2] $a=3,b=19$.`},
    {label:"(ii)",marks:4,question:s`Explain why $2-i$ is also a root and obtain a real quadratic factor of $p(x)$.`,solutionOutline:s`[B2] Real coefficients give conjugate pairs. [M1] $(x-2-i)(x-2+i)=(x-2)^2+1$. [A1] The factor is $x^2-4x+5$.`},
    {label:"(iii)",marks:4,question:s`Factorise $p(x)$ fully into real quadratic and linear factors, and find its remaining roots.`,solutionOutline:s`[M2] Division gives $x^2-x-6$. [A1] $p(x)=(x^2-4x+5)(x-3)(x+2)$. [A1] Remaining roots $3,-2$.`},
    {label:"(iv)",marks:6,question:s`On an Argand diagram shade the region $|z-(2+i)|\le2$ and $\operatorname{Im}z\ge1$. State which boundaries are included.`,solutionOutline:s`[B2] Circle centre $(2,1)$, radius 2. [B2] Intersect its interior with the half-plane above $y=1$, giving the upper half-disc. [B2] Include the upper semicircle and horizontal diameter because both inequalities are non-strict.`},
  ];
  return {id:"step-boundary-complex",testId:"step",topicId:"step-pure4",type:"long",difficulty:2,totalMarks:20,parts,fullSolution:parts.map(p=>`${p.label} ${p.solutionOutline}`).join("\n")};
}
function matrixReplacement():LongQuestion {
  const parts=[
    {label:"(i)",marks:5,question:s`Let $M=\begin{pmatrix}2&1\\1&2\end{pmatrix}$. Find its determinant and inverse.`,solutionOutline:s`[M2] $\det M=4-1=3$. [M2] Use the 2 by 2 inverse formula. [A1] $M^{-1}=\frac13\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$.`},
    {label:"(ii)",marks:5,question:s`Find all lines through the origin that map to themselves under $M$. Include a separate check of the vertical line.`,solutionOutline:s`[M2] A point $(x,mx)$ maps to $((2+m)x,(1+2m)x)$. [M1] The same line requires $1+2m=m(2+m)$, hence $m^2=1$. [A1] $y=x,y=-x$. [B1] $(0,y)$ maps to $(y,2y)$, so the vertical line is not invariant.`},
    {label:"(iii)",marks:5,question:s`Write $(u,v)=A(1,1)+B(1,-1)$. Find $A,B$ and use the action of $M$ on these two vectors to obtain the image under $n$ repeated applications.`,solutionOutline:s`[M1] $A=(u+v)/2$, $B=(u-v)/2$. [B2] $M(1,1)=3(1,1)$ and $M(1,-1)=(1,-1)$. [M1] Repeated multiplication gives $3^nA(1,1)+B(1,-1)$. [A1] Coordinates are $((3^n(u+v)+u-v)/2,(3^n(u+v)-u+v)/2)$.`},
    {label:"(iv)",marks:5,question:s`Deduce $M^n$ and verify the formula by matrix multiplication for $n=1$ and $n=2$.`,solutionOutline:s`[M2] $M^n=\frac12\begin{pmatrix}3^n+1&3^n-1\\3^n-1&3^n+1\end{pmatrix}$. [A1] At $n=1$ this gives $M$. [M1] Direct multiplication gives $M^2=\begin{pmatrix}5&4\\4&5\end{pmatrix}$. [A1] The formula at $n=2$ agrees.`},
  ];
  return {id:"step-boundary-matrix",testId:"step",topicId:"step-pure5",type:"long",difficulty:2,totalMarks:20,parts,fullSolution:parts.map(p=>`${p.label} ${p.solutionOutline}`).join("\n")};
}
export function reviseStepPapers(papers:MockPaper[]):MockPaper[] {
  return papers.map(p=> {
    const used=new Set(p.modules.flatMap(m=>m.questions).map(syllabusText));
    return {...p,id:`${p.id}-boundary`,title:`${p.title} · 范围修订版`,description:p.description+" 采用新题目编号，旧作答保留；替换题只要求给定引导和该层级已列出的知识。",modules:p.modules.map(m=>({...m,questions:m.questions.map((old,i)=> {
    let q=old;
    if(!assessSyllabusCandidate(old).allowed) q=matrixReplacement();
    else if(p.id.startsWith("step2-") && STEP2_EXTRA.test(syllabusText(old))) {
      const pool=STEP_QUESTIONS.filter((q):q is LongQuestion=>q.type==="long" && q.totalMarks===20 && q.topicId.startsWith("step-pure") && assessSyllabusCandidate(q).allowed && !STEP2_EXTRA.test(syllabusText(q)) && !used.has(syllabusText(q)));
      q=pool.find(q=>q.topicId===old.topicId)??pool[0]??complexReplacement();
    }
    used.add(syllabusText(q));
    return {...q,id:`${p.id}-boundary-q${String(i+1).padStart(2,"0")}`};
  })}))};
  });
}
