import { describe, expect, it } from "vitest";
import { renderToString } from "katex";
import data from "@/data/question-bank/candidates-20261028.json";
import { assessSyllabusCandidate } from "../syllabus-policy";
import { validatePracticeUpdates } from "../practice-updates";
import type { Question } from "./types";

const questions=data.questions as Question[];
describe("October 28 original practice challenge candidates",()=>{
  it("has seven distinct in-scope questions with complete marks and valid mathematical notation",()=>{
    expect(questions).toHaveLength(7);
    expect(new Set(questions.map(q=>q.id)).size).toBe(7);
    for(const testId of ["bpho","tmua"]) {
      const selected=questions.filter(q=>q.testId===testId);
      expect(()=>validatePracticeUpdates({schemaVersion:1,releases:[{id:`${testId}-candidate`,testId,publishedAt:"2026-10-28T00:00:00Z",kind:"addition",status:"draft",title:"草稿",titleEn:"Draft",summary:"待复核",summaryEn:"Pending review",subjectReview:"mathematical-checks",teachingReview:"pending-independent-review",questions:selected}]},new Set())).not.toThrow();
    }
    function check(v:unknown){
      if(typeof v==="string") for(const m of v.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) expect(()=>renderToString(m[1]??m[2],{throwOnError:true,strict:"ignore"})).not.toThrow();
      else if(Array.isArray(v)) v.forEach(check);
      else if(v&&typeof v==="object") Object.values(v).forEach(check);
    }
    for(const q of questions){expect(assessSyllabusCandidate(q).allowed,q.id).toBe(true);check(q);if(q.type==="long")expect(q.parts.reduce((s,p)=>s+p.marks,0)).toBe(q.totalMarks);}
  });
  it("recomputes the moving-ramp result from acceleration and the force constraint",()=>{
    const g=9.8,sin=.5,cos=Math.sqrt(3)/2;
    const acceleration=g*sin/(1-cos*cos/4);
    for(const h of [.1,1,3.7]){
      const u=Math.sqrt(2*acceleration*h/sin),ramp=-u*cos/4;
      expect(u*u).toBeCloseTo(32*g*h/13,12);
      const vx=ramp+u*cos,vy=-u*sin;
      expect(3*ramp+vx).toBeCloseTo(0,12);
      const rampEnergy=1.5*ramp*ramp,beadEnergy=.5*(vx*vx+vy*vy);
      expect(rampEnergy+beadEnergy).toBeCloseTo(g*h,12);
      expect(rampEnergy/(g*h)).toBeCloseTo(9/52,12);
    }
  });
  it("checks resonance order, both end corrections, nodes and cooling",()=>{
    const wavelength=2*(.495-.155),delta=wavelength/4-.155;
    expect(wavelength*500).toBeCloseTo(340,12);
    expect(delta).toBeCloseTo(.015,12);
    for(let n=2;n<10;n++)expect((2*n-1)*wavelength/4-.155).toBeGreaterThan(.04);
    const effective=.65+2*delta;
    expect(2*effective/wavelength).toBeCloseTo(2,12);
    for(const x of [.17,.51])expect(Math.cos(2*Math.PI*x/wavelength)).toBeCloseTo(0,12);
    expect(340*Math.sqrt(256/289)/500/4-delta).toBeCloseTo(.145,12);
  });
  it("rules out exact common resonance by parity, without claiming arbitrarily small absolute gaps",()=>{
    const closedEffective=.155+.015,openEffective=.325+2*.015,v=340;
    expect(v/(4*closedEffective)).toBeCloseTo(500,12);
    expect(v/(2*openEffective)).toBeCloseTo(34000/71,10);
    for(let j=1;j<=200;j++)for(let k=1;k<=200;k++){
      const integerGap=71*(2*j-1)-68*k;
      expect(Math.abs(integerGap)%2).toBe(1);
      expect(Math.abs(integerGap)).toBeGreaterThanOrEqual(1);
    }
    // The parity proof applies to every positive order; the sweep checks its algebra.
    expect(71*(2*12-1)-68*24).toBe(1);
    expect(JSON.stringify(questions[1])).not.toContain("Arbitrarily close frequencies");
    expect(JSON.stringify(questions[1])).toContain("71(2j-1)=68k");
  });
  it("checks triangle-capacitor node conservation, polarity and energy independently",()=>{
    const initialV=11,C=2,A=0,B=7,D=5;
    const nodeCharges=[C*(A-B)+3*C*(A-D),C*(B-A)+2*C*(B-D),2*C*(D-B)+3*C*(D-A)];
    expect(nodeCharges).toEqual([-2*C*initialV,C*initialV,C*initialV]);
    expect(A-B).toBeLessThan(0);
    const final=.5*C*(A-B)**2+C*(B-D)**2+1.5*C*(D-A)**2;
    expect(final).toBeCloseTo(6*C*initialV**2/11,12);
    expect(3*C*initialV**2-final).toBeCloseTo(27*C*initialV**2/11,12);
    expect(final).toBeCloseTo(.5*nodeCharges.reduce((s,q,i)=>s+q*[A,B,D][i],0),12);
  });
  it("checks thermal energy, final pressure and the forced reversal",()=>{
    for(const n of [1,2.5])for(const T of [100,300]){
      const R=8.31,V=.1,Tf=5*T/3,Va=2*V/3,Vb=4*V/3;
      expect(1.5*n*R*3*T+1.5*2*n*R*T).toBeCloseTo(1.5*3*n*R*Tf,8);
      expect(n*R*Tf/Va).toBeCloseTo(2*n*R*Tf/Vb,8);
      expect(n*R*Tf/Va).toBeCloseTo(5*n*R*T/(2*V),8);
      expect(3*n*R*T/V).toBeGreaterThan(2*n*R*T/V);
      expect(Va).toBeLessThan(V);
    }
  });
  it("checks the general initial-expansion/final-compression condition independently",()=>{
    for(const alpha of [1.25,2,3,5])for(const r of [.5,1,1.1,1.5,2,3,6]){
      const Tf=(alpha+r)/(1+r),Va=2/(1+r),Vb=2*r/(1+r);
      expect(1.5*(alpha+r)).toBeCloseTo(1.5*(1+r)*Tf,12);
      expect(Tf/Va).toBeCloseTo(r*Tf/Vb,12);
      expect((alpha-r)>0&&Va<1).toBe(r>1&&r<alpha);
    }
    const thermal=JSON.stringify(questions[3]);
    expect(thermal).toContain("finite positive thermal conductance");
    expect(thermal).toContain("impermeable");
    expect(thermal).toContain("path dependent");
  });
  it("checks photoelectric energies, magnetic radius and stopping endpoints",()=>{
    const E=12,phi=4,K1=E-phi,K2=E/2-phi,K3=2*E/3-phi;
    expect(Math.sqrt(K1/K2)).toBe(2);
    expect(phi/E).toBeCloseTo(1/3,12);
    expect(K3-E/6).toBe(K2);
    expect(K2-E/6).toBe(0);
    expect(K1-E/6).toBeGreaterThan(0);
    expect(K1-2*E/3).toBe(0);
  });
  it("checks the oblique barrier from separately conserved tangential motion",()=>{
    const K=12,eU=6;
    for(const degrees of [0,10,30,44,45,60,80]){
      const theta=degrees*Math.PI/180,normal=K*Math.cos(theta)**2,tangent=K*Math.sin(theta)**2;
      expect(normal+tangent).toBeCloseTo(K,12);
      expect(normal-eU>1e-10).toBe(degrees<45);
    }
    expect(K*Math.cos(Math.PI/3)**2-eU).toBeLessThan(0);
    expect(K-eU).toBeGreaterThan(0); // Total energy alone is not the transmission condition.
    const modern=questions[4];
    if(modern.type!=="long")throw new Error("Expected structured modern-physics task");
    expect(modern.fullSolution).toContain("0\\le\\theta<45^\\circ");
  });
  it("exhaustively checks all divisor pairs for the TMUA number item",()=>{
    const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
    const divisors=Array.from({length:2160},(_,i)=>i+1).filter(n=>2160%n===0);
    const pairs=divisors.flatMap(a=>divisors.filter(b=>a<b&&gcd(a,b)===12&&a*b/gcd(a,b)===2160&&(a+b)%7===0).map(b=>[a,b]));
    expect(pairs).toEqual([[48,540]]);
    expect(pairs[0][1]-pairs[0][0]).toBe(492);
    expect((questions[5] as {answer:string}).answer).toBe("C");
  });
  it("checks constructive witnesses and counterexamples for both quantifier orders",()=>{
    const expression=(k:number,x:number,y:number)=>x*x+y*y-2*k*x*y;
    for(let k=-3;k<=3;k+=.25){
      if(Math.abs(k)>=1)for(const x of [-5,-1,0,1,3])expect(expression(k,x,k*x)).toBeLessThanOrEqual(1e-12);
      else for(const y of [-5,-1,0,k,1,3])expect(expression(k,1,y)).toBeGreaterThan(0);
      for(const y of [-100,-1,0,.3,7])expect(expression(k,2*Math.abs(k*y)+1,y)).toBeGreaterThan(0);
    }
    expect((questions[6] as {answer:string}).answer).toBe("C");
  });
});
