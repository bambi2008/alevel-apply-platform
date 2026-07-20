// ESAT 模拟卷七（高频核心卷 · 跨 2016–2023 恒定高频考点）—— 全新原创题。
// 设计依据：分析 ENGAA 2016–2023 八年真题，提取跨年稳定、几乎每年必考的「高频核心」考点，
// 组成一套打基本功的均衡卷（与偏难的「后期趋势卷·卷六」互补）。
// 高频核心：物理=能量与功、力与牛顿定律、电路（欧姆/功率）、运动学、波、密度压强；
//           数学=代数与根式、二次、三角、比例与百分数、坐标几何、数列、基础微积分。
// 难度以基础—中等为主，少量挑战。题目全新原创，未照搬真题，也不与其他卷/练习库重复。
// id 前缀 esat-mk7-*。

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ── 模块一：数学（高频核心）——27 题 / 40 分钟 ───────────────────────────────
export const ESAT_MK7_MATH: MCQQuestion[] = [
  { id: "esat-mk7-m-01", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Simplify $\\sqrt{50}-\\sqrt{18}$.",
    options: [ {key:"A",text:"$\\sqrt{32}$"},{key:"B",text:"$2\\sqrt2$"},{key:"C",text:"$\\sqrt2$"},{key:"D",text:"$4\\sqrt2$"},{key:"E",text:"$8\\sqrt2$"} ],
    answer: "B", solution: "$5\\sqrt2-3\\sqrt2=2\\sqrt2$." },

  { id: "esat-mk7-m-02", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Evaluate $16^{3/4}$.",
    options: [ {key:"A",text:"$4$"},{key:"B",text:"$6$"},{key:"C",text:"$8$"},{key:"D",text:"$12$"},{key:"E",text:"$64$"} ],
    answer: "C", solution: "$16^{1/4}=2$, then $2^3=8$." },

  { id: "esat-mk7-m-03", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "For which values of $k$ does $x^2+4x+k=0$ have no real roots?",
    options: [ {key:"A",text:"$k<4$"},{key:"B",text:"$k=4$"},{key:"C",text:"$k>4$"},{key:"D",text:"$k\\leq4$"},{key:"E",text:"all real $k$"} ],
    answer: "C", solution: "No real roots require $16-4k<0$, hence $k>4$." },

  { id: "esat-mk7-m-04", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Factorise fully $2x^2-8$.",
    options: [ {key:"A",text:"$2(x-2)(x+2)$"},{key:"B",text:"$2(x-4)(x+1)$"},{key:"C",text:"$(2x-4)(x+2)$"},{key:"D",text:"$2(x^2-4)$"},{key:"E",text:"$(x-2)(2x+4)$"} ],
    answer: "A", solution: "$2x^2-8=2(x^2-4)=2(x-2)(x+2)$." },

  { id: "esat-mk7-m-05", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Make $r$ the subject of $A=\\pi r^2$ (taking the positive root).",
    options: [ {key:"A",text:"$\\sqrt{\\dfrac{A}{\\pi}}$"},{key:"B",text:"$\\dfrac{A}{\\pi}$"},{key:"C",text:"$\\dfrac{\\sqrt A}{\\pi}$"},{key:"D",text:"$\\dfrac{A^2}{\\pi}$"},{key:"E",text:"$\\pi\\sqrt A$"} ],
    answer: "A", solution: "$r^2=\\dfrac{A}{\\pi}\\Rightarrow r=\\sqrt{\\dfrac{A}{\\pi}}$." },

  { id: "esat-mk7-m-06", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "In a right-angled triangle the two shorter sides are $5$ and $12$. The hypotenuse is:",
    options: [ {key:"A",text:"$13$"},{key:"B",text:"$17$"},{key:"C",text:"$7$"},{key:"D",text:"$\\sqrt{17}$"},{key:"E",text:"$60$"} ],
    answer: "A", solution: "$\\sqrt{5^2+12^2}=\\sqrt{169}=13$." },

  { id: "esat-mk7-m-07", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "Evaluate $\\tan 45^\\circ+\\sin 90^\\circ$.",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$0$"},{key:"D",text:"$\\dfrac32$"},{key:"E",text:"$\\sqrt2$"} ],
    answer: "B", solution: "$\\tan45^\\circ=1$, $\\sin90^\\circ=1$; sum $=2$." },

  { id: "esat-mk7-m-08", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A jacket costs £80 after a 20% discount. Its original price was:",
    options: [ {key:"A",text:"£96"},{key:"B",text:"£100"},{key:"C",text:"£64"},{key:"D",text:"£120"},{key:"E",text:"£90"} ],
    answer: "B", solution: "$80=0.80\\times\\text{original}\\Rightarrow\\text{original}=\\dfrac{80}{0.8}=£100$." },

  { id: "esat-mk7-m-09", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $5:x=3:9$, then $x$ equals:",
    options: [ {key:"A",text:"$10$"},{key:"B",text:"$12$"},{key:"C",text:"$15$"},{key:"D",text:"$18$"},{key:"E",text:"$27$"} ],
    answer: "C", solution: "$\\dfrac5x=\\dfrac39=\\dfrac13\\Rightarrow x=15$." },

  { id: "esat-mk7-m-10", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve the simultaneous equations $2x+y=7$ and $x-y=2$.",
    options: [ {key:"A",text:"$x=3,\\;y=1$"},{key:"B",text:"$x=1,\\;y=5$"},{key:"C",text:"$x=2,\\;y=3$"},{key:"D",text:"$x=3,\\;y=-1$"},{key:"E",text:"$x=4,\\;y=-1$"} ],
    answer: "A", solution: "Add: $3x=9\\Rightarrow x=3$; then $y=7-6=1$." },

  { id: "esat-mk7-m-11", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The 10th term of the arithmetic sequence $2,5,8,\\ldots$ is:",
    options: [ {key:"A",text:"$26$"},{key:"B",text:"$29$"},{key:"C",text:"$30$"},{key:"D",text:"$32$"},{key:"E",text:"$27$"} ],
    answer: "B", solution: "$a=2,d=3$; $a_{10}=2+9(3)=29$." },

  { id: "esat-mk7-m-12", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Differentiate $y=4x^3-2x$ and evaluate the gradient at $x=1$.",
    options: [ {key:"A",text:"$6$"},{key:"B",text:"$8$"},{key:"C",text:"$10$"},{key:"D",text:"$12$"},{key:"E",text:"$2$"} ],
    answer: "C", solution: "$\\dfrac{dy}{dx}=12x^2-2$; at $x=1$: $12-2=10$." },

  { id: "esat-mk7-m-13", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Evaluate $\\displaystyle\\int_0^3 2x\\,dx$.",
    options: [ {key:"A",text:"$6$"},{key:"B",text:"$9$"},{key:"C",text:"$12$"},{key:"D",text:"$18$"},{key:"E",text:"$3$"} ],
    answer: "B", solution: "$[x^2]_0^3=9$." },

  { id: "esat-mk7-m-14", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Expand and simplify $(x+3)(x-5)$.",
    options: [ {key:"A",text:"$x^2-2x-15$"},{key:"B",text:"$x^2+2x-15$"},{key:"C",text:"$x^2-2x+15$"},{key:"D",text:"$x^2-15$"},{key:"E",text:"$x^2-8x-15$"} ],
    answer: "A", solution: "$x^2-5x+3x-15=x^2-2x-15$." },

  { id: "esat-mk7-m-15", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "What is $30\\%$ of $250$?",
    options: [ {key:"A",text:"$60$"},{key:"B",text:"$70$"},{key:"C",text:"$75$"},{key:"D",text:"$80$"},{key:"E",text:"$85$"} ],
    answer: "C", solution: "$0.30\\times250=75$." },

  { id: "esat-mk7-m-16", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "The point $C$ is due north of $A$ and the bearing of $C$ from $B$ is $315^\\circ$. If $B$ is due east of $A$ with $AB=10\\,\\text{km}$, the distance $AC$ is:",
    options: [ {key:"A",text:"$5\\,\\text{km}$"},{key:"B",text:"$10\\,\\text{km}$"},{key:"C",text:"$10\\sqrt2\\,\\text{km}$"},{key:"D",text:"$20\\,\\text{km}$"},{key:"E",text:"$5\\sqrt2\\,\\text{km}$"} ],
    answer: "B", solution: "Bearing $315^\\circ$ from $B$ points north-west at $45^\\circ$; triangle $ABC$ is right-angled at $A$ with angle $45^\\circ$ at $B$, so $AC=AB\\tan45^\\circ=10\\,\\text{km}$." },

  { id: "esat-mk7-m-17", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify $\\dfrac{x^2+2x}{x}$ (for $x\\ne0$).",
    options: [ {key:"A",text:"$x+2$"},{key:"B",text:"$x^2+2$"},{key:"C",text:"$2x$"},{key:"D",text:"$x+2x$"},{key:"E",text:"$2$"} ],
    answer: "A", solution: "$\\dfrac{x(x+2)}{x}=x+2$." },

  { id: "esat-mk7-m-18", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The mean of five numbers is $12$. Four of them are $10, 11, 13, 14$. The fifth number is:",
    options: [ {key:"A",text:"$10$"},{key:"B",text:"$12$"},{key:"C",text:"$13$"},{key:"D",text:"$14$"},{key:"E",text:"$16$"} ],
    answer: "B", solution: "Sum $=5\\times12=60$; known four sum to $48$; fifth $=60-48=12$." },

  { id: "esat-mk7-m-19", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The circle $(x-2)^2+(y+1)^2=16$ has centre and radius:",
    options: [ {key:"A",text:"centre $(2,-1)$, radius $4$"},{key:"B",text:"centre $(-2,1)$, radius $4$"},{key:"C",text:"centre $(2,-1)$, radius $16$"},{key:"D",text:"centre $(-2,1)$, radius $16$"},{key:"E",text:"centre $(2,1)$, radius $4$"} ],
    answer: "A", solution: "Standard form gives centre $(2,-1)$ and radius $\\sqrt{16}=4$." },

  { id: "esat-mk7-m-20", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Solve $3(x-2)=9$.",
    options: [ {key:"A",text:"$x=3$"},{key:"B",text:"$x=5$"},{key:"C",text:"$x=4$"},{key:"D",text:"$x=6$"},{key:"E",text:"$x=1$"} ],
    answer: "B", solution: "$x-2=3\\Rightarrow x=5$." },

  { id: "esat-mk7-m-21", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A cylinder has radius $2\\,\\text{cm}$ and height $5\\,\\text{cm}$. Its volume is:",
    options: [ {key:"A",text:"$10\\pi\\,\\text{cm}^3$"},{key:"B",text:"$20\\pi\\,\\text{cm}^3$"},{key:"C",text:"$40\\pi\\,\\text{cm}^3$"},{key:"D",text:"$20\\,\\text{cm}^3$"},{key:"E",text:"$100\\pi\\,\\text{cm}^3$"} ],
    answer: "B", solution: "$V=\\pi r^2 h=\\pi(4)(5)=20\\pi\\,\\text{cm}^3$." },

  { id: "esat-mk7-m-22", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $y=2x-1$, what is $x$ in terms of $y$?",
    options: [ {key:"A",text:"$\\dfrac{y+1}{2}$"},{key:"B",text:"$\\dfrac{y-1}{2}$"},{key:"C",text:"$2y+1$"},{key:"D",text:"$\\dfrac{1-y}{2}$"},{key:"E",text:"$2(y+1)$"} ],
    answer: "A", solution: "$y+1=2x\\Rightarrow x=\\dfrac{y+1}{2}$." },

  { id: "esat-mk7-m-23", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The quadratic $x^2+bx+12=0$ has roots $2$ and $6$. The value of $b$ is:",
    options: [ {key:"A",text:"$8$"},{key:"B",text:"$-8$"},{key:"C",text:"$12$"},{key:"D",text:"$-12$"},{key:"E",text:"$4$"} ],
    answer: "B", solution: "Sum of roots $=-b=2+6=8\\Rightarrow b=-8$ (product $2\\times6=12$ checks out)." },

  { id: "esat-mk7-m-24", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "How many solutions does $\\sin x=0$ have for $0^\\circ\\le x\\le360^\\circ$?",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$0$"} ],
    answer: "C", solution: "$x=0^\\circ,180^\\circ,360^\\circ$ — three solutions in the closed interval." },

  { id: "esat-mk7-m-25", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "$y$ is directly proportional to $\\sqrt{x}$. When $x=9$, $y=12$. Find $y$ when $x=25$.",
    options: [ {key:"A",text:"$16$"},{key:"B",text:"$18$"},{key:"C",text:"$20$"},{key:"D",text:"$24$"},{key:"E",text:"$33\\dfrac13$"} ],
    answer: "C", solution: "$y=k\\sqrt x$; $12=k\\cdot3\\Rightarrow k=4$; at $x=25$: $y=4\\times5=20$." },

  { id: "esat-mk7-m-26", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "The curve $y=x^2-4x+3$ crosses the $x$-axis at two points. The distance between them is:",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$\\sqrt3$"} ],
    answer: "B", solution: "$x^2-4x+3=(x-1)(x-3)=0\\Rightarrow x=1,3$; distance $=2$." },

  { id: "esat-mk7-m-27", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Flour and sugar are mixed in the ratio $5:2$. How much sugar is needed for $350\\,\\text{g}$ of flour?",
    options: [ {key:"A",text:"$70\\,\\text{g}$"},{key:"B",text:"$120\\,\\text{g}$"},{key:"C",text:"$140\\,\\text{g}$"},{key:"D",text:"$175\\,\\text{g}$"},{key:"E",text:"$875\\,\\text{g}$"} ],
    answer: "C", solution: "One ratio part is $350/5=70\\,\\text{g}$, so the sugar mass is $2\\times70=140\\,\\text{g}$." },
];

// ── 模块二：物理（高频核心）——27 题 / 40 分钟 ───────────────────────────────
// g = 10 N/kg。
export const ESAT_MK7_PHYS: MCQQuestion[] = [
  { id: "esat-mk7-p-01", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 1, marks: 1,
    question: "A $2.0\\,\\text{kg}$ mass is lifted through a height of $3.0\\,\\text{m}$. The gain in gravitational potential energy is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$6\\,\\text{J}$"},{key:"B",text:"$30\\,\\text{J}$"},{key:"C",text:"$60\\,\\text{J}$"},{key:"D",text:"$600\\,\\text{J}$"},{key:"E",text:"$15\\,\\text{J}$"} ],
    answer: "C", solution: "$\\Delta E_p=mgh=2.0\\times10\\times3.0=60\\,\\text{J}$." },

  { id: "esat-mk7-p-02", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A $0.50\\,\\text{kg}$ ball moves at $4.0\\,\\text{m/s}$. Its kinetic energy is:",
    options: [ {key:"A",text:"$1.0\\,\\text{J}$"},{key:"B",text:"$2.0\\,\\text{J}$"},{key:"C",text:"$4.0\\,\\text{J}$"},{key:"D",text:"$8.0\\,\\text{J}$"},{key:"E",text:"$16\\,\\text{J}$"} ],
    answer: "C", solution: "$E_k=\\tfrac12mv^2=\\tfrac12(0.50)(16)=4.0\\,\\text{J}$." },

  { id: "esat-mk7-p-03", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 1, marks: 1,
    question: "A resultant force of $12\\,\\text{N}$ acts on a $3.0\\,\\text{kg}$ mass. Its acceleration is:",
    options: [ {key:"A",text:"$2.0\\,\\text{m/s}^2$"},{key:"B",text:"$4.0\\,\\text{m/s}^2$"},{key:"C",text:"$9.0\\,\\text{m/s}^2$"},{key:"D",text:"$36\\,\\text{m/s}^2$"},{key:"E",text:"$15\\,\\text{m/s}^2$"} ],
    answer: "B", solution: "$a=\\dfrac{F}{m}=\\dfrac{12}{3.0}=4.0\\,\\text{m/s}^2$." },

  { id: "esat-mk7-p-04", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 1, marks: 1,
    question: "The weight of a $6.0\\,\\text{kg}$ object is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$0.6\\,\\text{N}$"},{key:"B",text:"$6\\,\\text{N}$"},{key:"C",text:"$16\\,\\text{N}$"},{key:"D",text:"$60\\,\\text{N}$"},{key:"E",text:"$600\\,\\text{N}$"} ],
    answer: "D", solution: "$W=mg=6.0\\times10=60\\,\\text{N}$." },

  { id: "esat-mk7-p-05", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 1, marks: 1,
    question: "A resistor of $4.0\\,\\Omega$ carries a current of $3.0\\,\\text{A}$. The voltage across it is:",
    options: [ {key:"A",text:"$0.75\\,\\text{V}$"},{key:"B",text:"$1.3\\,\\text{V}$"},{key:"C",text:"$7.0\\,\\text{V}$"},{key:"D",text:"$12\\,\\text{V}$"},{key:"E",text:"$1.0\\,\\text{V}$"} ],
    answer: "D", solution: "$V=IR=3.0\\times4.0=12\\,\\text{V}$." },

  { id: "esat-mk7-p-06", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "Two resistors, $3.0\\,\\Omega$ and $6.0\\,\\Omega$, are connected in series. Their combined resistance is:",
    options: [ {key:"A",text:"$2.0\\,\\Omega$"},{key:"B",text:"$4.5\\,\\Omega$"},{key:"C",text:"$9.0\\,\\Omega$"},{key:"D",text:"$18\\,\\Omega$"},{key:"E",text:"$0.5\\,\\Omega$"} ],
    answer: "C", solution: "Series: $3.0+6.0=9.0\\,\\Omega$." },

  { id: "esat-mk7-p-07", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A device uses $2.0\\,\\text{A}$ at $230\\,\\text{V}$. Its power is:",
    options: [ {key:"A",text:"$115\\,\\text{W}$"},{key:"B",text:"$232\\,\\text{W}$"},{key:"C",text:"$460\\,\\text{W}$"},{key:"D",text:"$115\\,\\text{kW}$"},{key:"E",text:"$46\\,\\text{W}$"} ],
    answer: "C", solution: "$P=VI=230\\times2.0=460\\,\\text{W}$." },

  { id: "esat-mk7-p-08", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 1, marks: 1,
    question: "A car travels $150\\,\\text{m}$ in $10\\,\\text{s}$ at constant speed. Its speed is:",
    options: [ {key:"A",text:"$10\\,\\text{m/s}$"},{key:"B",text:"$15\\,\\text{m/s}$"},{key:"C",text:"$20\\,\\text{m/s}$"},{key:"D",text:"$1500\\,\\text{m/s}$"},{key:"E",text:"$1.5\\,\\text{m/s}$"} ],
    answer: "B", solution: "$v=\\dfrac{d}{t}=\\dfrac{150}{10}=15\\,\\text{m/s}$." },

  { id: "esat-mk7-p-09", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A ball is dropped from rest. After $3.0\\,\\text{s}$ its speed is: ($g=10\\,\\text{N/kg}$, air resistance ignored)",
    options: [ {key:"A",text:"$3.0\\,\\text{m/s}$"},{key:"B",text:"$10\\,\\text{m/s}$"},{key:"C",text:"$30\\,\\text{m/s}$"},{key:"D",text:"$45\\,\\text{m/s}$"},{key:"E",text:"$90\\,\\text{m/s}$"} ],
    answer: "C", solution: "$v=gt=10\\times3.0=30\\,\\text{m/s}$." },

  { id: "esat-mk7-p-10", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A ball is dropped from rest. How far does it fall in $2.0\\,\\text{s}$? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$10\\,\\text{m}$"},{key:"B",text:"$20\\,\\text{m}$"},{key:"C",text:"$40\\,\\text{m}$"},{key:"D",text:"$5\\,\\text{m}$"},{key:"E",text:"$80\\,\\text{m}$"} ],
    answer: "B", solution: "$s=\\tfrac12gt^2=\\tfrac12(10)(4)=20\\,\\text{m}$." },

  { id: "esat-mk7-p-11", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A force of $20\\,\\text{N}$ moves an object $5.0\\,\\text{m}$ in the direction of the force. The work done is:",
    options: [ {key:"A",text:"$4\\,\\text{J}$"},{key:"B",text:"$25\\,\\text{J}$"},{key:"C",text:"$100\\,\\text{J}$"},{key:"D",text:"$15\\,\\text{J}$"},{key:"E",text:"$1000\\,\\text{J}$"} ],
    answer: "C", solution: "$W=Fd=20\\times5.0=100\\,\\text{J}$." },

  { id: "esat-mk7-p-12", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A machine does $600\\,\\text{J}$ of work in $30\\,\\text{s}$. Its power output is:",
    options: [ {key:"A",text:"$10\\,\\text{W}$"},{key:"B",text:"$20\\,\\text{W}$"},{key:"C",text:"$30\\,\\text{W}$"},{key:"D",text:"$18000\\,\\text{W}$"},{key:"E",text:"$2.0\\,\\text{W}$"} ],
    answer: "B", solution: "$P=\\dfrac{W}{t}=\\dfrac{600}{30}=20\\,\\text{W}$." },

  { id: "esat-mk7-p-13", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "A wave travels at $300\\,\\text{m/s}$ with wavelength $1.5\\,\\text{m}$. Its frequency is:",
    options: [ {key:"A",text:"$150\\,\\text{Hz}$"},{key:"B",text:"$200\\,\\text{Hz}$"},{key:"C",text:"$450\\,\\text{Hz}$"},{key:"D",text:"$2.0\\,\\text{Hz}$"},{key:"E",text:"$0.005\\,\\text{Hz}$"} ],
    answer: "B", solution: "$f=\\dfrac{v}{\\lambda}=\\dfrac{300}{1.5}=200\\,\\text{Hz}$." },

  { id: "esat-mk7-p-14", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "An object of mass $600\\,\\text{g}$ has a volume of $300\\,\\text{cm}^3$. Its density is:",
    options: [ {key:"A",text:"$0.5\\,\\text{g/cm}^3$"},{key:"B",text:"$2.0\\,\\text{g/cm}^3$"},{key:"C",text:"$1.8\\,\\text{g/cm}^3$"},{key:"D",text:"$3.0\\,\\text{g/cm}^3$"},{key:"E",text:"$0.2\\,\\text{g/cm}^3$"} ],
    answer: "B", solution: "$\\rho=\\dfrac{600}{300}=2.0\\,\\text{g/cm}^3$." },

  { id: "esat-mk7-p-15", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A $4.0\\,\\text{kg}$ object rests on a horizontal surface. A horizontal push of $10\\,\\text{N}$ does not move it. The friction force is:",
    options: [ {key:"A",text:"$0\\,\\text{N}$"},{key:"B",text:"$4.0\\,\\text{N}$"},{key:"C",text:"$10\\,\\text{N}$"},{key:"D",text:"$40\\,\\text{N}$"},{key:"E",text:"$14\\,\\text{N}$"} ],
    answer: "C", solution: "The object is in equilibrium, so static friction balances the push: $10\\,\\text{N}$." },

  { id: "esat-mk7-p-16", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A $2.0\\,\\text{kg}$ trolley moving at $3.0\\,\\text{m/s}$ has momentum:",
    options: [ {key:"A",text:"$1.5\\,\\text{kg·m/s}$"},{key:"B",text:"$5.0\\,\\text{kg·m/s}$"},{key:"C",text:"$6.0\\,\\text{kg·m/s}$"},{key:"D",text:"$9.0\\,\\text{kg·m/s}$"},{key:"E",text:"$0.67\\,\\text{kg·m/s}$"} ],
    answer: "C", solution: "$p=mv=2.0\\times3.0=6.0\\,\\text{kg·m/s}$." },

  { id: "esat-mk7-p-17", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A charge of $60\\,\\text{C}$ passes a point in $20\\,\\text{s}$. The current is:",
    options: [ {key:"A",text:"$0.33\\,\\text{A}$"},{key:"B",text:"$3.0\\,\\text{A}$"},{key:"C",text:"$40\\,\\text{A}$"},{key:"D",text:"$1200\\,\\text{A}$"},{key:"E",text:"$80\\,\\text{A}$"} ],
    answer: "B", solution: "$I=\\dfrac{Q}{t}=\\dfrac{60}{20}=3.0\\,\\text{A}$." },

  { id: "esat-mk7-p-18", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "Take water density as $1000\\,\\text{kg m}^{-3}$ and $g=10\\,\\text{N kg}^{-1}$. What is the gauge pressure $3.0\\,\\text{m}$ below a calm water surface?",
    options: [ {key:"A",text:"$300\\,\\text{Pa}$"},{key:"B",text:"$3000\\,\\text{Pa}$"},{key:"C",text:"$30000\\,\\text{Pa}$"},{key:"D",text:"$300000\\,\\text{Pa}$"},{key:"E",text:"$3.0\\times10^6\\,\\text{Pa}$"} ],
    answer: "C", solution: "$p=\\rho gh=1000\\times10\\times3.0=30000\\,\\text{Pa}$." },

  { id: "esat-mk7-p-19", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A $1000\\,\\text{kg}$ car accelerates from $10\\,\\text{m/s}$ to $20\\,\\text{m/s}$ in $5.0\\,\\text{s}$. The resultant force on it is:",
    options: [ {key:"A",text:"$1000\\,\\text{N}$"},{key:"B",text:"$2000\\,\\text{N}$"},{key:"C",text:"$4000\\,\\text{N}$"},{key:"D",text:"$5000\\,\\text{N}$"},{key:"E",text:"$200\\,\\text{N}$"} ],
    answer: "B", solution: "$a=\\dfrac{20-10}{5.0}=2.0\\,\\text{m/s}^2$; $F=ma=1000\\times2.0=2000\\,\\text{N}$." },

  { id: "esat-mk7-p-20", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 3, marks: 1,
    question: "A $0.20\\,\\text{kg}$ ball is dropped from $2.0\\,\\text{m}$ and rebounds to $1.25\\,\\text{m}$. The energy lost in the bounce is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$0.5\\,\\text{J}$"},{key:"B",text:"$1.5\\,\\text{J}$"},{key:"C",text:"$2.5\\,\\text{J}$"},{key:"D",text:"$4.0\\,\\text{J}$"},{key:"E",text:"$0.15\\,\\text{J}$"} ],
    answer: "B", solution: "$\\Delta E=mg\\Delta h=0.20\\times10\\times(2.0-1.25)=0.20\\times10\\times0.75=1.5\\,\\text{J}$." },

  { id: "esat-mk7-p-21", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A uniform metre rule is pivoted at its centre. A $2.0\\,\\text{N}$ weight hangs $30\\,\\text{cm}$ from the pivot. What weight at $20\\,\\text{cm}$ on the other side balances it?",
    options: [ {key:"A",text:"$1.5\\,\\text{N}$"},{key:"B",text:"$3.0\\,\\text{N}$"},{key:"C",text:"$4.0\\,\\text{N}$"},{key:"D",text:"$6.0\\,\\text{N}$"},{key:"E",text:"$2.0\\,\\text{N}$"} ],
    answer: "B", solution: "Moments balance: $2.0\\times30=W\\times20\\Rightarrow W=\\dfrac{60}{20}=3.0\\,\\text{N}$." },

  { id: "esat-mk7-p-22", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 1, marks: 1,
    question: "An alpha particle consists of:",
    options: [ {key:"A",text:"2 protons and 2 neutrons"},{key:"B",text:"1 proton and 1 neutron"},{key:"C",text:"2 protons only"},{key:"D",text:"1 electron"},{key:"E",text:"2 electrons and 2 protons"} ],
    answer: "A", solution: "An alpha particle is a helium nucleus: 2 protons and 2 neutrons." },

  { id: "esat-mk7-p-23", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 3, marks: 1,
    question: "A $6.0\\,\\Omega$ resistor and a $3.0\\,\\Omega$ resistor are in parallel, and this pair is connected to a $12\\,\\text{V}$ battery of negligible internal resistance. The power delivered by the battery is:",
    options: [ {key:"A",text:"$24\\,\\text{W}$"},{key:"B",text:"$48\\,\\text{W}$"},{key:"C",text:"$72\\,\\text{W}$"},{key:"D",text:"$144\\,\\text{W}$"},{key:"E",text:"$12\\,\\text{W}$"} ],
    answer: "C", solution: "Parallel $=\\dfrac{6\\times3}{9}=2.0\\,\\Omega$; $P=\\dfrac{V^2}{R}=\\dfrac{144}{2.0}=72\\,\\text{W}$." },

  { id: "esat-mk7-p-24", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "The period of a wave is $0.25\\,\\text{s}$. Its frequency is:",
    options: [ {key:"A",text:"$0.25\\,\\text{Hz}$"},{key:"B",text:"$2.0\\,\\text{Hz}$"},{key:"C",text:"$4.0\\,\\text{Hz}$"},{key:"D",text:"$8.0\\,\\text{Hz}$"},{key:"E",text:"$0.5\\,\\text{Hz}$"} ],
    answer: "C", solution: "$f=\\dfrac1T=\\dfrac{1}{0.25}=4.0\\,\\text{Hz}$." },

  { id: "esat-mk7-p-25", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 3, marks: 1,
    question: "A $50\\,\\text{kg}$ athlete runs up a flight of stairs of total height $4.0\\,\\text{m}$ in $5.0\\,\\text{s}$. The useful power developed is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$40\\,\\text{W}$"},{key:"B",text:"$200\\,\\text{W}$"},{key:"C",text:"$400\\,\\text{W}$"},{key:"D",text:"$1000\\,\\text{W}$"},{key:"E",text:"$2000\\,\\text{W}$"} ],
    answer: "C", solution: "Work $=mgh=50\\times10\\times4.0=2000\\,\\text{J}$; power $=\\dfrac{2000}{5.0}=400\\,\\text{W}$." },

  { id: "esat-mk7-p-26", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A $2.0\\,\\text{kg}$ object hangs at rest from a single vertical rope. The tension in the rope is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$2.0\\,\\text{N}$"},{key:"B",text:"$10\\,\\text{N}$"},{key:"C",text:"$20\\,\\text{N}$"},{key:"D",text:"$0\\,\\text{N}$"},{key:"E",text:"$40\\,\\text{N}$"} ],
    answer: "C", solution: "At rest, tension equals weight: $T=mg=2.0\\times10=20\\,\\text{N}$." },

  { id: "esat-mk7-p-27", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A $12\\,\\text{V}$ battery drives a current of $2.0\\,\\text{A}$ through a resistor. The energy transferred in $60\\,\\text{s}$ is:",
    options: [ {key:"A",text:"$24\\,\\text{J}$"},{key:"B",text:"$144\\,\\text{J}$"},{key:"C",text:"$720\\,\\text{J}$"},{key:"D",text:"$1440\\,\\text{J}$"},{key:"E",text:"$360\\,\\text{J}$"} ],
    answer: "D", solution: "$P=VI=24\\,\\text{W}$; $E=Pt=24\\times60=1440\\,\\text{J}$." },
];
