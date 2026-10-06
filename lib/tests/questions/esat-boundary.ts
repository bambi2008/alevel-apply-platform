import type { MCQQuestion } from "./types";
import { ESAT_MK1_MATH, ESAT_MK1_PHYS } from "../mock-papers/esat-mock-1";
import { ESAT_MK3_CHEM } from "../mock-papers/esat-mock-3";
import { ESAT_MK4_BIO } from "../mock-papers/esat-mock-4";
import { ESAT_GAP_FILL_QUESTIONS } from "./esat-gap-fill";

// Original, non-calculus Mathematics 1 replacement. No further-maths shortcut
// is required. References are to the October 2026 / January 2027 specification.
const s = String.raw;
type Seed = [string,string,string,[string,string,string,string],string];
const seeds: Seed[] = [
  ["M3", "Two litres of a 20% solution are mixed with three litres of an 80% solution. Volumes add. What is the new concentration?", "56%", ["44%","50%","60%","64%"], "Solute volume is 0.2×2+0.8×3=2.8 litres; 2.8/5=56%."],
  ["M3", "A price rises by 20% and then falls by 20%. The final price is £96. What was the original price?", "£100", ["£96","£104","£120","£80"], "The multiplier is 1.2×0.8=0.96, so the original price is 96/0.96=100."],
  ["M1", "A cyclist covers 6 km in 15 minutes, then 4 km in 25 minutes. What is the average speed for the whole journey?", "15 km/h", ["10 km/h","16 km/h","18 km/h","20 km/h"], "The total is 10 km in 40/60 hours, giving 15 km/h. Do not average the two speeds."],
  ["M2", s`What is $27^{2/3}16^{-1/2}$?`, s`$9/4$`, [s`$3/4$`,s`$9/2$`,s`$3/2$`,s`$36$`], s`$27^{2/3}=9$ and $16^{-1/2}=1/4$.`],
  ["M2", s`Simplify $\sqrt{75}-\sqrt{12}$.`, s`$3\sqrt3$`, [s`$\sqrt{63}$`,s`$7\sqrt3$`,s`$\sqrt3$`,s`$3\sqrt7$`], s`$\sqrt{75}=5\sqrt3$, $\sqrt{12}=2\sqrt3$.`],
  ["M2", "Two bells ring every 18 and 24 minutes. They ring together at 09:00. When do they next ring together?", "10:12", ["09:42","10:00","10:06","12:36"], "The least common multiple of 18 and 24 is 72 minutes."],
  ["M2", "The length of a rod rounds to 12.4 cm to the nearest 0.1 cm. Which is its error interval?", s`$12.35\le L<12.45$`, [s`$12.3\le L<12.5$`,s`$12.35<L\le12.45$`,s`$12.4\le L<12.5$`,s`$12.395\le L<12.405$`], "The half-step is 0.05 cm; the lower endpoint rounds up to 12.4 and the upper endpoint rounds to 12.5."],
  ["M3", "Six workers complete a task in 15 days. With identical productivity, how many days would ten workers take?", "9", ["6","10","15","25"], "The work is 6×15=90 worker-days. Divide by ten."],
  ["M4", s`Solve $3(2x-1)=4x+7$.`, s`$x=5$`, [s`$x=2$`,s`$x=-5$`,s`$x=4$`,s`$x=10$`], s`$6x-3=4x+7$, so $2x=10$.`],
  ["M4", s`Given $x+y=7$ and $2x-y=5$, what is $xy$?`, s`$12$`, [s`$10$`,s`$14$`,s`$15$`,s`$21$`], s`Adding gives $3x=12$, hence $x=4,y=3$.`],
  ["M4", s`What is the smaller root of $2x^2-7x+3=0$?`, s`$1/2$`, [s`$-1/2$`,s`$3$`,s`$1$`,s`$-3$`], s`$(2x-1)(x-3)=0$.`],
  ["M4", s`What is the minimum value of $x^2-6x+11$?`, s`$2$`, [s`$-2$`,s`$3$`,s`$5$`,s`$11$`], s`Complete the square: $(x-3)^2+2$, which is at least 2. No differentiation is needed.`],
  ["M4", s`Solve $5-2x>11$.`, s`$x<-3$`, [s`$x>-3$`,s`$x<3$`,s`$x>3$`,s`$x<-8$`], s`$-2x>6$; division by a negative reverses the inequality.`],
  ["M4", s`The nth term is $n^2+3n$. How much larger is the 8th term than the 7th?`, s`$18$`, [s`$15$`,s`$16$`,s`$17$`,s`$19$`], s`The terms are 88 and 70; their difference is 18.`],
  ["M4", s`Simplify $\frac{x^2-9}{x^2+x-6}$ where the denominator is nonzero.`, s`$\frac{x-3}{x-2}$`, [s`$\frac{x+3}{x+2}$`,s`$x-3$`,s`$\frac{x-3}{x+2}$`,s`$\frac{x+3}{x-2}$`], s`Factor as $(x-3)(x+3)/[(x+3)(x-2)]$ and cancel the common factor on the stated domain.`],
  ["M4", s`A line passes through $(2,5)$ and $(6,13)$. What is its y-intercept?`, s`$1$`, [s`$2$`,s`$3$`,s`$-1$`,s`$5$`], s`Its gradient is 8/4=2. Substitution into $y=2x+c$ gives $c=1$.`],
  ["M5", "Similar solids have lengths in the ratio 2:3. The smaller has volume 40 cm³. What is the larger volume?", "135 cm³", ["60 cm³","90 cm³","120 cm³","270 cm³"], "The volume multiplier is (3/2)³=27/8; 40×27/8=135."],
  ["M5", "A trapezium has parallel sides 5 cm and 11 cm and perpendicular height 4 cm. What is its area?", "32 cm²", ["20 cm²","22 cm²","44 cm²","64 cm²"], "Area is (5+11)×4/2=32."],
  ["M5", s`A right triangle has hypotenuse 13 cm and one other side 5 cm. What is its area?`, "30 cm²", ["15 cm²","32.5 cm²","60 cm²","65 cm²"], "The other side is √(169−25)=12 cm; area is 5×12/2=30."],
  ["M5", s`A circle has radius 6 cm. What is the area of its $120^\circ$ sector?`, s`$12\pi\,\mathrm{cm}^2$`, [s`$6\pi\,\mathrm{cm}^2$`,s`$18\pi\,\mathrm{cm}^2$`,s`$24\pi\,\mathrm{cm}^2$`,s`$36\pi\,\mathrm{cm}^2$`], s`Take 120/360 of $\pi6^2$.`],
  ["M5", "One angle of a triangle is 90°. Another is 35°. What is the third angle?", "55°", ["35°","45°","65°","145°"], "Angles in a triangle sum to 180°; 180−90−35=55."],
  ["M6", "The mean of five numbers is 8. Four of the numbers are 4, 6, 9 and 11. What is the fifth?", "10", ["8","9","11","12"], "The total is 40; the four known numbers total 30."],
  ["M6", "The ordered data are 2, 3, 5, 7, 11, 13. What is the median?", "6", ["5","7","8","9"], "For six entries average the third and fourth: (5+7)/2=6."],
  ["M6", "In a histogram, a class of width 5 has frequency 20. What is its frequency density?", "4", ["5","15","25","100"], "Frequency density is frequency divided by class width: 20/5=4."],
  ["M7", "A bag contains 3 red and 2 blue counters. Two are drawn without replacement. What is the probability both are red?", s`$3/10$`, [s`$9/25$`,s`$3/5$`,s`$1/5$`,s`$1/2$`], s`$(3/5)(2/4)=3/10$. The second denominator must be 4.`],
  ["M7", "A fair die is rolled 120 times. How many sixes are expected?", "20", ["6","12","24","60"], "Expected frequency is 120×1/6=20. This is elementary expected frequency, not a random-variable moment formula."],
  ["M7", "Of 30 students, 18 cycle, 12 walk, and 5 do both on different days. How many do neither?", "5", ["0","7","12","17"], "The union has 18+12−5=25 students; 30−25=5 do neither."],
];
const keys = ["A","B","C","D","E"] as const;
export const ESAT_MATH1_BOUNDARY: MCQQuestion[] = seeds.map(([reference,question,correct,wrong,solution],i)=> {
  const choices = [correct,...wrong];
  const shift = i%5;
  const rotated = [...choices.slice(shift),...choices.slice(0,shift)];
  return {id:`esat-boundary-m1-${String(i+1).padStart(2,"0")}`,type:"mcq",testId:"esat",topicId:"esat-math1",difficulty:2,marks:1,question,options:rotated.map((text,j)=>({key:keys[j],text})),answer:keys[(5-shift)%5],solution:`${solution} [${reference}]`};
});
function select(bank: MCQQuestion[],prefix:string,ns:number[]) {
  return ns.map(n=> {
    const q = bank.find(q=>q.id===`${prefix}${String(n).padStart(prefix==="esat-gap-new-"?3:2,"0")}`);
    if(!q) throw new Error(`Missing reviewed seed ${prefix}${n}`);
    return q;
  });
}
function release(bank:MCQQuestion[],module:"m2"|"p"|"c"|"b",topic?:string):MCQQuestion[] {
  return bank.map((q,i)=>{
    const originalCorrect=q.options.findIndex(o=>o.key===q.answer);
    if(originalCorrect<0) throw new Error("Missing reviewed correct answer");
    const target=i%5,shift=(originalCorrect-target+5)%5;
    const ordered=[...q.options.slice(shift),...q.options.slice(0,shift)];
    const keyMap=new Map(ordered.map((o,j)=>[o.key,keys[j]]));
    const optionExplanations=q.optionExplanations
      ? Object.fromEntries(ordered.map((o,j)=>[keys[j],q.optionExplanations?.[o.key]??""])) : undefined;
    const solution=q.solution.replace(/\b([Oo]ption|[Aa]nswer|[Cc]hoice)\s+([A-E])\b/g,
      (_,word:string,key:string)=>word+" "+(keyMap.get(key as typeof keys[number])??key));
    return {...q,id:"esat-boundary-"+module+"-"+String(i+1).padStart(2,"0"),topicId:topic??q.topicId,
      options:ordered.map((o,j)=>({...o,key:keys[j]})),answer:keys[target],solution,
      ...(optionExplanations ? {optionExplanations} : {}),
    };
  });
}
// Reviewed AS power calculus, algebra, logs and simple trig; not Math 1.
export const ESAT_MATH2_BOUNDARY = release(ESAT_MK1_MATH.map(q=> {
  if(q.id.endsWith("-10")) return {...q,question:s`Let $y=3x-2$. Express $x$ in terms of $y$.`,options:q.options.map(o=>({...o,text:o.text.replaceAll("x","y")})),solution:s`Rearranging gives $3x=y+2$, hence $x=(y+2)/3$.`};
  if(q.id.endsWith("-22")) return {...q,question:q.question+" Assume the denominator is nonzero."};
  if(q.id.endsWith("-23")) return {...q,question:q.question.replace("the common ratio are:","the positive common ratio are:").replace("common ratio are:","positive common ratio are:"),solution:q.solution.replace("r=3", "r=3 (given positive)")};
  return q;
}),"m2","esat-math2").map((q,i)=>({...q,topicId:[4,7,8,11,22,23].includes(i+1)?"esat-math3":q.topicId}));
const phys = select(ESAT_MK1_PHYS,"esat-mk1-p-",[1,2,3,4,5,6,7,8,11,12,13,17,18,19,20,21,24,25]).map(q=>({...q,topicId:
  [3,4,7].some(n=>q.id.endsWith(`-${String(n).padStart(2,"0")}`))?"esat-phys2":
  [11,12,13].some(n=>q.id.endsWith(`-${n}`))?"esat-phys3":
  [17,18,19].some(n=>q.id.endsWith(`-${n}`))?"esat-phys7":
  [20,21].some(n=>q.id.endsWith(`-${n}`))?"esat-phys4":
  [24,25].some(n=>q.id.endsWith(`-${n}`))?"esat-phys5":"esat-phys1"}));
export const ESAT_PHYSICS_BOUNDARY = release([...phys,...select(ESAT_GAP_FILL_QUESTIONS,"esat-gap-new-",[1,2,3,4,5,6,10,11,12])],"p");
export const ESAT_CHEMISTRY_BOUNDARY = release([...select(ESAT_MK3_CHEM,"esat-mk3-c-",[1,3,6,7,8,9,13,14,16,17,18,19,21,22,23,24,25,26,27]).map(q=>q.id.endsWith("-27")?{...q,topicId:"esat-chem5"}:q),...select(ESAT_GAP_FILL_QUESTIONS,"esat-gap-new-",[13,14,15,16,17,18,19,20])],"c");
export const ESAT_BIOLOGY_BOUNDARY = release([...select(ESAT_MK4_BIO,"esat-mk4-b-",[3,4,5,6,7,9,10,11,12,15,17,19,20,21,22,24,25]).map((q):MCQQuestion=> {
  if(q.id.endsWith("-04")) return {...q,question:q.question.replace("ATP","energy from respiration"),solution:"Active transport uses energy from respiration to move substances against their concentration gradient."};
  if(q.id.endsWith("-05")) return {...q,question:"Which description of an enzyme is correct?",options:[{key:"A",text:"A biological catalyst that increases reaction rate"},{key:"B",text:"A substance used up in every reaction"},{key:"C",text:"A membrane that blocks all transport"},{key:"D",text:"A product of every digestion reaction"},{key:"E",text:"An inorganic salt only"}],answer:"A" as const,solution:"Enzymes are biological catalysts, primarily proteins. They increase reaction rate and are not consumed. [B8.1]"};
  if(q.id.endsWith("-06")) return {...q,solution:"Above the optimum temperature the enzyme may denature. Its active site's shape changes, so the substrate no longer fits and the rate falls. [B8.2–B8.3]"};
  return q;
}),...select(ESAT_GAP_FILL_QUESTIONS,"esat-gap-new-",[43,44,45,48,49,50,51,52,53,54])],"b");
export const ESAT_BOUNDARY_QUESTIONS = [...ESAT_MATH1_BOUNDARY,...ESAT_MATH2_BOUNDARY,...ESAT_PHYSICS_BOUNDARY,...ESAT_CHEMISTRY_BOUNDARY,...ESAT_BIOLOGY_BOUNDARY];
