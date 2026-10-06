import type { LongQuestion, MCQQuestion, QuestionDifficulty } from "./types";

// Original supplementary practice only. Fixed papers, their IDs, and the
// 44/88 candidate-error register are unchanged. Difficulty is an authored
// reasoning-demand estimate, not a statistically calibrated exam equivalence.
const s = String.raw;
type Part = [number, string, string];
function written(id: string, topic: string, difficulty: QuestionDifficulty, context: string, ...parts: Part[]): LongQuestion {
  const mapped = parts.map(([marks, question, solutionOutline], i) => ({ label: `(${String.fromCharCode(97+i)})`, marks, question, solutionOutline }));
  return { id: `caie9709-p3-practice-r3-${id}`, testId: "caie9709", type: "long", topicId: `caie9709-${topic}`, difficulty, context,
    totalMarks: mapped.reduce((n,p)=>n+p.marks,0), parts: mapped, fullSolution: mapped.map(p=>`${p.label} ${p.solutionOutline}`).join("\n\n") };
}

// 9709 2026–2027 §§3.2–3.8: each missing band receives a new task, not
// a relabelled old task. The challenge tasks add domain/parameter reasoning
// or comparison of iterations, without importing Further Mathematics.
export const P3_SYLLABUS_SUPPLEMENTS: LongQuestion[] = [
  written("log-parameter", "log-exp", 3, s`Consider $\ln(x-1)+\ln(5-x)=\ln k$, where $k$ is real.`,
    [3, "State the permitted values of x and k, and reduce the equation to a quadratic in x.", s`[B1] $1<x<5$, $k>0$. [M1] Combine logs on that domain. [A1] $(x-1)(5-x)=k$, or $(x-3)^2=4-k$.`],
    [4, "Determine the number of distinct real solutions for every real k. Then solve exactly when k=3.", s`[M1] On the domain the product is positive with maximum 4 at $x=3$. [A1] Two solutions if $0<k<4$, one if $k=4$, none if $k>4$. [B1] For $k\le0$ the original logarithm is undefined, so no admissible solution. [A1] For $k=3$, $x=2,4$; both pass the log-domain check.`]),
  written("trig-parameter", "trig", 3, s`Let $f(x)=3\sin2x+4\cos2x$, for $0\le x<\pi$.`,
    [3, s`Express f(x) as $R\cos(2x-\alpha)$ with $R>0$ and $0<\alpha<\pi/2$.`, s`[M1] Expand the compound angle. [A1] $R\cos\alpha=4$, $R\sin\alpha=3$, so $R=5$. [A1] $\alpha=\tan^{-1}(3/4)$.`],
    [3, "Solve f(x)=4 exactly, taking care with the half-open interval.", s`[M1] $\cos(2x-\alpha)=4/5=\cos\alpha$. [A1] $2x-\alpha=\pm\alpha+2n\pi$ gives $x=0,\alpha$ in the stated interval. [B1] $x=\pi$ is excluded; no other integer n works.`],
    [2, "For each real c, state the number of distinct solutions of f(x)=c in the interval.", s`[B1] A single complete period contains two roots for $-5<c<5$. [B1] One for $c=\pm5$ and none for $|c|>5$, with the right endpoint excluded to avoid double-counting.`]),
  written("diff-basic", "differentiation", 1, s`The curve is $y=\ln(2x+1)$.`,
    [2, "State its real domain and find dy/dx.", s`[B1] $x>-1/2$. [M1] $dy/dx=2/(2x+1)$.`],
    [2, "Find the tangent at x=0.", s`[B1] The point is $(0,0)$ and gradient is 2. [A1] $y=2x$.`]),
  written("numerical-basic", "numerical", 1, s`Let $f(x)=x^3+x-3$.`,
    [2, "Show that a root lies between 1 and 2.", s`[B1] $f(1)=-1$, $f(2)=7$. [B1] f is continuous, so the sign change gives a root in $(1,2)$.`],
    [2, s`Use the given iteration $x_{n+1}=(3-x_n)^{1/3}$ with $x_1=1$ to calculate $x_2$ and $x_3$ to 4 decimal places. Keep full precision internally.`, s`[M1] $x_2=\sqrt[3]2=1.2599$. [A1] $x_3=\sqrt[3]{3-\sqrt[3]2}=1.2028$. These are iterates, not a claim of a 4-decimal-place root.`]),
  written("numerical-comparison", "numerical", 3, s`The equation is $x+\ln x=2$, with $x>0$. Two proposed iterations are $g(x)=e^{2-x}$ and $h(x)=(x+2-\ln x)/2$.`,
    [2, "Show that the equation has exactly one root alpha between 1 and 2.", s`[B1] $f(1)=-1$, $f(2)=\ln2>0$, and f is continuous. [B1] $f'=1+1/x>0$, hence the root is unique.`],
    [3, "Show both rearrangements have alpha as a fixed point. Compare the magnitudes of their derivatives near alpha to explain which iteration is suitable.", s`[M1] Each fixed-point equation rearranges to $x+\ln x=2$. [A1] $g'(\alpha)=-\alpha$, so its magnitude exceeds 1; it is locally unstable. [A1] $h'(x)=(1-1/x)/2$, so on $[1,2]$ it is between 0 and 1/4; nearby errors contract. This is a local derivative comparison, not a required abstract fixed-point theorem.`],
    [3, "Starting at 1.5, use the suitable iteration to find alpha to 4 decimal places. Verify the rounding with a sign-change bracket.", s`[M1] Iterate h without premature rounding to $1.557145599$. [A1] $f(1.55705)<0<f(1.55715)$. [A1] $\alpha=1.5571$ to 4 decimal places.`]),
  written("vector-basic", "vectors", 1, s`Points A and B are $(1,2,-1)$ and $(3,-2,1)$.`,
    [2, "Find the vector AB and an equation of the line through A and B.", s`[B1] $\overrightarrow{AB}=(2,-4,2)$. [A1] $\mathbf r=(1,2,-1)+t(2,-4,2)$, $t\in\mathbb R$.`],
    [2, "Find the point on this line whose x-coordinate is 5.", s`[M1] $1+2t=5$, so $t=2$. [A1] The point is $(5,-6,3)$.`]),
  written("vector-intersection", "vectors", 2, s`Lines are $\mathbf r=(1,0,2)+\lambda(2,-1,1)$ and $\mathbf r=(3,-4,4)+\mu(1,1,0)$.`,
    [4, "Show that the lines intersect and find the intersection.", s`[M1] Equate x and y: $1+2\lambda=3+\mu$, $-\lambda=-4+\mu$. [A1] $\lambda=2$, $\mu=2$. [B1] Both give z=4, verifying the third coordinate. [A1] Intersection $(5,-2,4)$.`],
    [3, "Find the acute angle between the lines, giving an exact expression.", s`[M1] Use direction vectors a=(2,-1,1), b=(1,1,0); $a\cdot b=1$. [M1] $|a|=\sqrt6$, $|b|=\sqrt2$. [A1] $\theta=\cos^{-1}(1/(2\sqrt3))$. No plane or vector product is needed.`]),
  written("de-basic", "de", 1, s`A positive function satisfies $dy/dx=3x^2y$ and $y(0)=2$.`,
    [3, "Separate variables and solve the initial-value problem.", s`[M1] $dy/y=3x^2dx$. [M1] $\ln y=x^3+C$ and $C=\ln2$. [A1] $y=2e^{x^3}$.`],
    [2, "Find x when y=2e.", s`[M1] $e^{x^3}=e$, so $x^3=1$. [A1] $x=1$.`]),
];

function choice(id: string, testId: string, topicId: string, difficulty: QuestionDifficulty, question: string, answers: [string,string,string,string,string], correct: number, solution: string): MCQQuestion {
  const keys = ["A","B","C","D","E"] as const;
  return { id, testId, topicId, difficulty, type:"mcq", marks:1, question, options:answers.map((text,i)=>({key:keys[i],text})), answer:keys[correct], solution };
}
export const ESAT_SYLLABUS_SUPPLEMENTS: MCQQuestion[] = [
  choice("esat-boundary-m1-supp-01","esat","esat-math1",1,"What is 0.75 kg in grams?",["7.5","75","750","7500","75000"],2,"1 kg is 1000 g, so 0.75×1000=750 g. [M1.2]"),
  choice("esat-boundary-m1-supp-02","esat","esat-math1",3,"A 100-litre tank is 20% concentrate. V litres of well-mixed liquid are removed and replaced by water. After mixing, V litres are removed again and replaced by a 60% concentrate solution. The final concentration is 24.8%. What is V? Volumes add and 0<V<100.",["10 litres","20 litres","25 litres","40 litres","60 litres"],1,s`Set $u=V/100$. The retained concentrate fraction after both removals is $0.2(1-u)^2$, and the last refill adds $0.6u$. Thus $0.2u^2+0.2u+0.2=0.248$, giving $(u-0.2)(u+1.2)=0$. Only $u=0.2$ is permitted, so V=20 litres. The task requires modelling both replacements and rejecting a nonphysical root, not calculus. [M3.5, M4.15–16]`),
  choice("esat-boundary-b-supp-01","esat","esat-bio4",3,"In a food chain, producers store 10000 kJ. Initially 20% reaches herbivores and 10% of herbivore energy reaches predators. After a change, producer energy rises by 50%, the first transfer is 12% and the second is 25%. Using this supplied transfer model, by what percentage does predator energy increase?",["25%","50%","75%","125%","225%"],3,"Initially predators receive 10000×0.20×0.10=200 kJ. Afterwards they receive 15000×0.12×0.25=450 kJ. The increase is (450−200)/200×100=125%, not the new amount as a percentage of the old. Transfer fractions and the model are supplied; no advanced population model is assumed. [B10.1 ecosystems; M3 percentages]"),
  choice("esat-boundary-p-supp-01","esat","esat-phys6",2,s`A 200 g sample of water absorbs 8400 J with no heat loss or change of state. Its specific heat capacity is $4200\,\mathrm{J\,kg^{-1}\,K^{-1}}$. What is its temperature rise?`,["1 K","4 K","10 K","20 K","100 K"],2,s`Convert 200 g to 0.200 kg. Using $Q=mc\Delta T$ gives $\Delta T=8400/(0.2\times4200)=10$ K. [P4.4; M1.2]`),
  choice("esat-boundary-c-supp-01","esat","esat-chem5",2,"Molten lead(II) bromide is electrolysed using inert electrodes. Which substance forms at the negative electrode?",["Bromine","Oxygen","Hydrogen","Lead","Lead oxide"],3,s`Positive lead ions move to the negative cathode and gain electrons: $\mathrm{Pb^{2+}}+2e^-\longrightarrow\mathrm{Pb}$. Bromide ions form bromine at the anode; molten salt contains no water supplying hydrogen. [C12 electrolysis]`),
];
export const BPHO_SYLLABUS_SUPPLEMENTS: MCQQuestion[] = [
  choice("bpho-scope-modern-01","bpho","bpho-modern",2,"A radioactive source has activity 640 counts per minute above background. Its half-life is 6 hours. A detector's constant background is 20 counts per minute. What total rate is expected after 18 hours?",["40","80","100","160","180"],2,"Three half-lives reduce the source contribution to 640/8=80. Add the unchanged background 20 to obtain 100 counts per minute. This bounded school-physics exercise does not specify a full Olympiad paper."),
  choice("bpho-scope-modern-02","bpho","bpho-modern",2,s`Photon energy is given by $E=hf$ and wave speed by $c=f\lambda$. A light beam's wavelength is halved while its total power remains constant. How does its number of photons emitted per second change?`,["It doubles","It halves","It is unchanged","It quadruples","It becomes zero"],1,s`Halving $\lambda$ doubles f and hence E. Power is energy per second, so photon rate $P/E$ halves. Both formulas are supplied; no specialist quantum model is required. This is bounded training, not a full-paper claim.`),
];
