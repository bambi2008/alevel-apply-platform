import { describe,expect,it } from "vitest";
import { STEP_WRITTEN_PAPERS,getRegisteredMockPapersForTest } from "./index";
import { reviseStepPapers,reviseTmuaPapers } from "./boundary-revisions";
import { paperMeetsBoundary } from "../syllabus-release";
import { syllabusText } from "../syllabus-policy";
describe("fixed paper scope revisions",()=>{
  it("retains 12 written questions and 8 pure/2 mechanics/2 statistics at the correct STEP level",()=>{
    const papers=reviseStepPapers(STEP_WRITTEN_PAPERS);
    expect(papers).toHaveLength(4);
    for(const p of papers) {
      expect(paperMeetsBoundary(p),p.id).toBe(true);
      const qs=p.modules.flatMap(m=>m.questions);
      expect(qs.filter(q=>q.topicId.startsWith("step-pure"))).toHaveLength(8);
      expect(new Set(qs.map(syllabusText)).size).toBe(12);
      expect(qs.map(syllabusText).join(" ")).not.toMatch(/eigenvalue|eigenvector|diagonalis/i);
      for(const q of qs) expect(STEP_WRITTEN_PAPERS.flatMap(p=>p.modules.flatMap(m=>m.questions)).some(old=>old.id===q.id)).toBe(false);
    }
  });
  it("rebuilds TMUA as two 20-question papers without deleting slots",()=>{
    for(const p of reviseTmuaPapers(getRegisteredMockPapersForTest("tmua").filter(p=>!p.id.endsWith("-boundary")))) {
      expect(paperMeetsBoundary(p),p.id).toBe(true);
      expect(p.modules).toHaveLength(2);
      for(const m of p.modules) expect(m.questions).toHaveLength(20);
      expect(p.modules.flatMap(m=>m.questions).map(syllabusText).join(" ")).not.toMatch(/variance|covariance|random variable|mathematical induction|induction step/i);
    }
  });
  it("independently verifies the replacement matrix inverse and powers",()=>{
    const mult=(a:number[][],b:number[][])=>a.map(r=>b[0].map((_,j)=>r.reduce((n,v,k)=>n+v*b[k][j],0)));
    const m=[[2,1],[1,2]],inv=[[2/3,-1/3],[-1/3,2/3]];
    expect(mult(m,inv)).toEqual([[1,0],[0,1]]);
    let power=[[1,0],[0,1]];
    for(let n=1;n<=6;n++) {
      power=mult(power,m);
      expect(power).toEqual([[(3**n+1)/2,(3**n-1)/2],[(3**n-1)/2,(3**n+1)/2]]);
    }
  });
});
