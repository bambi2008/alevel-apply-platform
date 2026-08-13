// ESAT 模拟卷六（后期趋势卷 · 对标 2019–2023 ENGAA 演变）—— 全新原创题。
// 设计依据：分析 ENGAA 2016–2023 真题发现，出题人自 2019 年起将卷子由 54 题/80 分钟
// 改为 40 题/60 分钟，每题配速不变（~1.5 分钟/题），改以「少而精、多步推理」的更硬题目
// 补偿；进阶数学（微积分/级数/坐标几何）与进阶物理（动量/力矩/抛体）权重升至约一半；
// 后期电路、波、热题增多，纯核物理递减。本卷据此校准：难度偏高、多步综合题为主。
// 题目均为原创，未照搬真题，也不与练习题库及其他模拟卷重复。id 前缀 esat-mk6-*。

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ── 模块一：数学（含进阶，偏多步）——27 题 / 40 分钟 ──────────────────────────
export const ESAT_MK6_MATH: MCQQuestion[] = [
  { id: "esat-mk6-m-01", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "For $y=x^3-3x$, how is the stationary point at $x=1$ classified?",
    options: [ {key:"A",text:"local maximum"},{key:"B",text:"local minimum"},{key:"C",text:"stationary point of inflection"},{key:"D",text:"non-stationary inflection"},{key:"E",text:"the curve has no stationary point there"} ],
    answer: "B", solution: "$y'=3x^2-3$ vanishes at $x=1$, and $y''=6x$ is positive there, so the point is a local minimum." },

  { id: "esat-mk6-m-02", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "For which values of $x$ is $x^2-6x+5<0$?",
    options: [ {key:"A",text:"$x<1$"},{key:"B",text:"$1<x<5$"},{key:"C",text:"$x>5$"},{key:"D",text:"$x<1$ or $x>5$"},{key:"E",text:"all real $x$"} ],
    answer: "B", solution: "$x^2-6x+5=(x-1)(x-5)$. The upward-opening quadratic is negative between its roots, so $1<x<5$." },

  { id: "esat-mk6-m-03", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "Find the sum to infinity of $27+18+12+\\cdots$",
    options: [ {key:"A",text:"$54$"},{key:"B",text:"$72$"},{key:"C",text:"$81$"},{key:"D",text:"$96$"},{key:"E",text:"$108$"} ],
    answer: "C", solution: "$r=\\tfrac23$; $S_\\infty=\\dfrac{27}{1-\\frac23}=\\dfrac{27}{1/3}=81$." },

  { id: "esat-mk6-m-04", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Which power of $3$ is equal to $81$?",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$3$"},{key:"C",text:"$4$"},{key:"D",text:"$9$"},{key:"E",text:"$27$"} ],
    answer: "C", solution: "$3^4=81$, so the required power is $4$." },

  { id: "esat-mk6-m-05", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $\\log_2 x-\\log_2(x-3)=2$.",
    options: [ {key:"A",text:"$x=4$"},{key:"B",text:"$x=6$"},{key:"C",text:"$x=3$"},{key:"D",text:"$x=12$"},{key:"E",text:"$x=2$"} ],
    answer: "A", solution: "$\\dfrac{x}{x-3}=4\\Rightarrow x=4x-12\\Rightarrow 3x=12\\Rightarrow x=4$." },

  { id: "esat-mk6-m-06", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "The length of the tangent from the origin to the circle with centre $(5,0)$ and radius $3$ is:",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$4$"},{key:"C",text:"$5$"},{key:"D",text:"$\\sqrt{34}$"},{key:"E",text:"$8$"} ],
    answer: "B", solution: "Tangent length $=\\sqrt{d^2-r^2}=\\sqrt{5^2-3^2}=\\sqrt{16}=4$." },

  { id: "esat-mk6-m-07", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A line perpendicular to $2y=x+4$ and passing through the origin has gradient:",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$2$"},{key:"C",text:"$-2$"},{key:"D",text:"$-\\dfrac12$"},{key:"E",text:"$-4$"} ],
    answer: "C", solution: "$2y=x+4\\Rightarrow y=\\tfrac12 x+2$, gradient $\\tfrac12$; perpendicular gradient $=-2$." },

  { id: "esat-mk6-m-08", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "The area enclosed between $y=2x$ and $y=x^2$ (from $x=0$ to $x=2$) is:",
    options: [ {key:"A",text:"$\\dfrac{2}{3}$"},{key:"B",text:"$\\dfrac{4}{3}$"},{key:"C",text:"$2$"},{key:"D",text:"$\\dfrac{8}{3}$"},{key:"E",text:"$4$"} ],
    answer: "B", solution: "$\\displaystyle\\int_0^2(2x-x^2)\\,dx=\\left[x^2-\\tfrac{x^3}{3}\\right]_0^2=4-\\tfrac83=\\tfrac43$." },

  { id: "esat-mk6-m-09", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The coefficient of $x$ in the expansion of $(1+3x)^4$ is:",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$4$"},{key:"C",text:"$9$"},{key:"D",text:"$12$"},{key:"E",text:"$27$"} ],
    answer: "D", solution: "$\\binom{4}{1}(3x)=12x$; coefficient $12$." },

  { id: "esat-mk6-m-10", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "For which value of $c$ does $2x^2+4x+c=0$ have equal roots?",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$4$"},{key:"D",text:"$8$"},{key:"E",text:"$16$"} ],
    answer: "B", solution: "Equal roots: $16-8c=0\\Rightarrow c=2$." },

  { id: "esat-mk6-m-11", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "In an arithmetic progression the 5th term is $17$ and the 9th term is $33$. The first term is:",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$3$"},{key:"C",text:"$5$"},{key:"D",text:"$-3$"},{key:"E",text:"$4$"} ],
    answer: "A", solution: "$d=\\dfrac{33-17}{4}=4$; $a=17-4d=17-16=1$." },

  { id: "esat-mk6-m-12", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Simplify $\\dfrac{(a^3)^2}{a^4}$.",
    options: [ {key:"A",text:"$a$"},{key:"B",text:"$a^2$"},{key:"C",text:"$a^3$"},{key:"D",text:"$a^{10}$"},{key:"E",text:"$a^{-2}$"} ],
    answer: "B", solution: "$\\dfrac{a^6}{a^4}=a^2$." },

  { id: "esat-mk6-m-13", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Rationalise and simplify $\\dfrac{6}{\\sqrt{3}}$.",
    options: [ {key:"A",text:"$2\\sqrt3$"},{key:"B",text:"$3\\sqrt2$"},{key:"C",text:"$\\sqrt6$"},{key:"D",text:"$6\\sqrt3$"},{key:"E",text:"$2$"} ],
    answer: "A", solution: "$\\dfrac{6}{\\sqrt3}\\cdot\\dfrac{\\sqrt3}{\\sqrt3}=\\dfrac{6\\sqrt3}{3}=2\\sqrt3$." },

  { id: "esat-mk6-m-14", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "How many solutions does $\\tan x=1$ have for $0^\\circ\\le x\\le360^\\circ$?",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$0$"} ],
    answer: "B", solution: "$x=45^\\circ,225^\\circ$ — two solutions." },

  { id: "esat-mk6-m-15", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The gradient of $y=(2x+1)^3$ at $x=0$ is:",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$3$"},{key:"C",text:"$6$"},{key:"D",text:"$9$"},{key:"E",text:"$12$"} ],
    answer: "C", solution: "$\\dfrac{dy}{dx}=3(2x+1)^2\\cdot2=6(2x+1)^2$; at $x=0$: $6$." },

  { id: "esat-mk6-m-16", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The perpendicular distance from $(3,4)$ to the line $3x+4y=0$ is:",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$4$"},{key:"C",text:"$5$"},{key:"D",text:"$7$"},{key:"E",text:"$25/7$"} ],
    answer: "C", solution: "The distance is $|3(3)+4(4)|/\\sqrt{3^2+4^2}=25/5=5$." },

  { id: "esat-mk6-m-17", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $x^2-5x+6<0$.",
    options: [ {key:"A",text:"$x<2$ or $x>3$"},{key:"B",text:"$2<x<3$"},{key:"C",text:"$-3<x<-2$"},{key:"D",text:"$x<-3$ or $x>-2$"},{key:"E",text:"$x>3$"} ],
    answer: "B", solution: "$(x-2)(x-3)<0\\Rightarrow 2<x<3$." },

  { id: "esat-mk6-m-18", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "A quantity doubles every 3 hours. By what factor has it grown after 9 hours?",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$6$"},{key:"C",text:"$8$"},{key:"D",text:"$9$"},{key:"E",text:"$16$"} ],
    answer: "C", solution: "$9\\text{ h}=3$ doublings $\\Rightarrow 2^3=8$." },

  { id: "esat-mk6-m-19", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $f(x)=x+2$ and $g(x)=x^2$, find $fg(3)$.",
    options: [ {key:"A",text:"$11$"},{key:"B",text:"$25$"},{key:"C",text:"$9$"},{key:"D",text:"$7$"},{key:"E",text:"$5$"} ],
    answer: "A", solution: "$fg(3)=f(g(3))=f(9)=9+2=11$." },

  { id: "esat-mk6-m-20", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Given that $x=2$ is a root of $x^3-3x^2+4$, the other distinct root is:",
    options: [ {key:"A",text:"$x=-1$"},{key:"B",text:"$x=1$"},{key:"C",text:"$x=-2$"},{key:"D",text:"$x=3$"},{key:"E",text:"$x=4$"} ],
    answer: "A", solution: "$x^3-3x^2+4=(x-2)^2(x+1)$; the other distinct root is $x=-1$." },

  { id: "esat-mk6-m-21", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "For which values of $x$ is $f(x)=2x^3-3x^2$ increasing?",
    options: [ {key:"A",text:"$0<x<1$"},{key:"B",text:"$x<0$ or $x>1$"},{key:"C",text:"$x>1$ only"},{key:"D",text:"$x<0$ only"},{key:"E",text:"all $x$"} ],
    answer: "B", solution: "$f'(x)=6x^2-6x=6x(x-1)>0\\Rightarrow x<0$ or $x>1$." },

  { id: "esat-mk6-m-22", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The sum of the first 6 terms of $2+4+8+\\cdots$ is:",
    options: [ {key:"A",text:"$62$"},{key:"B",text:"$96$"},{key:"C",text:"$126$"},{key:"D",text:"$128$"},{key:"E",text:"$254$"} ],
    answer: "C", solution: "$S_6=\\dfrac{2(2^6-1)}{2-1}=2\\times63=126$." },

  { id: "esat-mk6-m-23", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $A:B=2:3$ and $B:C=4:5$, then $A:C$ is:",
    options: [ {key:"A",text:"$2:5$"},{key:"B",text:"$8:15$"},{key:"C",text:"$3:10$"},{key:"D",text:"$6:5$"},{key:"E",text:"$8:5$"} ],
    answer: "B", solution: "Make $B$ common $(12)$: $A:B=8:12$, $B:C=12:15$; so $A:C=8:15$." },

  { id: "esat-mk6-m-24", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "Evaluate $\\sin 30^\\circ+\\cos 60^\\circ$.",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$1$"},{key:"C",text:"$\\dfrac{\\sqrt3}{2}$"},{key:"D",text:"$\\sqrt3$"},{key:"E",text:"$0$"} ],
    answer: "B", solution: "$\\tfrac12+\\tfrac12=1$." },

  { id: "esat-mk6-m-25", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The curve $y=x^2$ is reflected in the $x$-axis and then shifted up by $3$. Its new equation is:",
    options: [ {key:"A",text:"$y=-x^2+3$"},{key:"B",text:"$y=x^2-3$"},{key:"C",text:"$y=-(x-3)^2$"},{key:"D",text:"$y=-x^2-3$"},{key:"E",text:"$y=(x+3)^2$"} ],
    answer: "A", solution: "Reflection in $x$-axis: $y=-x^2$; shift up $3$: $y=-x^2+3$." },

  { id: "esat-mk6-m-26", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The roots of $2x^2-6x+1=0$ are $\\alpha$ and $\\beta$. The value of $\\alpha^2+\\beta^2$ is:",
    options: [ {key:"A",text:"$6$"},{key:"B",text:"$7$"},{key:"C",text:"$8$"},{key:"D",text:"$9$"},{key:"E",text:"$10$"} ],
    answer: "C", solution: "$\\alpha+\\beta=3$, $\\alpha\\beta=\\tfrac12$; $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=9-1=8$." },

  { id: "esat-mk6-m-27", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "How many points of intersection does the line $y=5$ have with the circle $x^2+y^2=25$?",
    options: [ {key:"A",text:"$0$"},{key:"B",text:"$1$"},{key:"C",text:"$2$"},{key:"D",text:"$3$"},{key:"E",text:"infinitely many"} ],
    answer: "B", solution: "$x^2+25=25\\Rightarrow x=0$; a single point $(0,5)$ — the line is tangent." },
];

// ── 模块二：物理（含进阶，偏电路/波/热 + 多步力学）——27 题 / 40 分钟 ──────────
// g = 10 N/kg。
export const ESAT_MK6_PHYS: MCQQuestion[] = [
  { id: "esat-mk6-p-01", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 1, marks: 1,
    question: "Two equal resistors are connected in series across a $12\\,\\text{V}$ battery. The potential difference across one resistor is:",
    options: [ {key:"A",text:"$3\\,\\text{V}$"},{key:"B",text:"$6\\,\\text{V}$"},{key:"C",text:"$12\\,\\text{V}$"},{key:"D",text:"$24\\,\\text{V}$"},{key:"E",text:"$4\\,\\text{V}$"} ],
    answer: "B", solution: "Equal resistors share the voltage equally: $12/2=6\\,\\text{V}$." },

  { id: "esat-mk6-p-02", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 1, marks: 1,
    question: "Two $4.0\\,\\Omega$ resistors are connected in parallel. Their combined resistance is:",
    options: [ {key:"A",text:"$1.0\\,\\Omega$"},{key:"B",text:"$2.0\\,\\Omega$"},{key:"C",text:"$4.0\\,\\Omega$"},{key:"D",text:"$8.0\\,\\Omega$"},{key:"E",text:"$0.5\\,\\Omega$"} ],
    answer: "B", solution: "$\\dfrac{1}{R}=\\dfrac{1}{4}+\\dfrac{1}{4}=\\dfrac12\\Rightarrow R=2.0\\,\\Omega$." },

  { id: "esat-mk6-p-03", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 1, marks: 1,
    question: "A bulb operating at $12\\,\\text{V}$ carries a current of $3.0\\,\\text{A}$. Its power is:",
    options: [ {key:"A",text:"$4\\,\\text{W}$"},{key:"B",text:"$9\\,\\text{W}$"},{key:"C",text:"$36\\,\\text{W}$"},{key:"D",text:"$15\\,\\text{W}$"},{key:"E",text:"$0.25\\,\\text{W}$"} ],
    answer: "C", solution: "$P=VI=12\\times3.0=36\\,\\text{W}$." },

  { id: "esat-mk6-p-04", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A $2.0\\,\\Omega$ and a $4.0\\,\\Omega$ resistor are in series across a $12\\,\\text{V}$ battery. The potential difference across the $4.0\\,\\Omega$ resistor is:",
    options: [ {key:"A",text:"$3\\,\\text{V}$"},{key:"B",text:"$4\\,\\text{V}$"},{key:"C",text:"$6\\,\\text{V}$"},{key:"D",text:"$8\\,\\text{V}$"},{key:"E",text:"$9\\,\\text{V}$"} ],
    answer: "D", solution: "$I=\\dfrac{12}{6}=2.0\\,\\text{A}$; $V_4=2.0\\times4.0=8\\,\\text{V}$." },

  { id: "esat-mk6-p-05", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 3, marks: 1,
    question: "A heater transfers $2400\\,\\text{J}$ in $2.0\\,\\text{minutes}$ while carrying a current of $4.0\\,\\text{A}$. The voltage across it is:",
    options: [ {key:"A",text:"$5.0\\,\\text{V}$"},{key:"B",text:"$10\\,\\text{V}$"},{key:"C",text:"$20\\,\\text{V}$"},{key:"D",text:"$2.5\\,\\text{V}$"},{key:"E",text:"$48\\,\\text{V}$"} ],
    answer: "A", solution: "Power $=\\dfrac{2400}{120}=20\\,\\text{W}$; $V=\\dfrac{P}{I}=\\dfrac{20}{4.0}=5.0\\,\\text{V}$." },

  { id: "esat-mk6-p-06", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "Three $6.0\\,\\Omega$ resistors are connected in parallel. The combined resistance is:",
    options: [ {key:"A",text:"$1.0\\,\\Omega$"},{key:"B",text:"$2.0\\,\\Omega$"},{key:"C",text:"$3.0\\,\\Omega$"},{key:"D",text:"$6.0\\,\\Omega$"},{key:"E",text:"$18\\,\\Omega$"} ],
    answer: "B", solution: "$\\dfrac1R=\\dfrac{3}{6}\\Rightarrow R=2.0\\,\\Omega$." },

  { id: "esat-mk6-p-07", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "A sound wave of frequency $170\\,\\text{Hz}$ has a wavelength of $2.0\\,\\text{m}$. Its speed is:",
    options: [ {key:"A",text:"$85\\,\\text{m/s}$"},{key:"B",text:"$170\\,\\text{m/s}$"},{key:"C",text:"$340\\,\\text{m/s}$"},{key:"D",text:"$680\\,\\text{m/s}$"},{key:"E",text:"$1.0\\,\\text{m/s}$"} ],
    answer: "C", solution: "$v=f\\lambda=170\\times2.0=340\\,\\text{m/s}$." },

  { id: "esat-mk6-p-08", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 3, marks: 1,
    question: "A particle oscillates with amplitude $5.0\\,\\text{cm}$ and frequency $2.0\\,\\text{Hz}$. What total distance does it travel in $3.0\\,\\text{s}$?",
    options: [ {key:"A",text:"$30\\,\\text{cm}$"},{key:"B",text:"$60\\,\\text{cm}$"},{key:"C",text:"$120\\,\\text{cm}$"},{key:"D",text:"$240\\,\\text{cm}$"},{key:"E",text:"$20\\,\\text{cm}$"} ],
    answer: "C", solution: "Per cycle a particle covers $4A=20\\,\\text{cm}$; cycles $=2.0\\times3.0=6$; total $=6\\times20=120\\,\\text{cm}$." },

  { id: "esat-mk6-p-09", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "A wave has frequency $50\\,\\text{Hz}$. Its period is:",
    options: [ {key:"A",text:"$0.02\\,\\text{s}$"},{key:"B",text:"$0.05\\,\\text{s}$"},{key:"C",text:"$0.2\\,\\text{s}$"},{key:"D",text:"$2.0\\,\\text{s}$"},{key:"E",text:"$50\\,\\text{s}$"} ],
    answer: "A", solution: "$T=\\dfrac1f=\\dfrac{1}{50}=0.02\\,\\text{s}$." },

  { id: "esat-mk6-p-10", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "How much energy is needed to raise the temperature of $2.0\\,\\text{kg}$ of a substance (specific heat capacity $4000\\,\\text{J kg}^{-1}\\text{K}^{-1}$) by $10\\,\\text{K}$?",
    options: [ {key:"A",text:"$8000\\,\\text{J}$"},{key:"B",text:"$40000\\,\\text{J}$"},{key:"C",text:"$80000\\,\\text{J}$"},{key:"D",text:"$800\\,\\text{J}$"},{key:"E",text:"$20000\\,\\text{J}$"} ],
    answer: "C", solution: "$Q=mc\\Delta T=2.0\\times4000\\times10=80000\\,\\text{J}$." },

  { id: "esat-mk6-p-11", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "A $500\\,\\text{W}$ heater supplies $60000\\,\\text{J}$ of energy. How long does this take?",
    options: [ {key:"A",text:"$60\\,\\text{s}$"},{key:"B",text:"$120\\,\\text{s}$"},{key:"C",text:"$300\\,\\text{s}$"},{key:"D",text:"$30\\,\\text{s}$"},{key:"E",text:"$600\\,\\text{s}$"} ],
    answer: "B", solution: "$t=\\dfrac{E}{P}=\\dfrac{60000}{500}=120\\,\\text{s}$." },

  { id: "esat-mk6-p-12", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "Which surface is the best emitter of thermal radiation?",
    options: [ {key:"A",text:"shiny white"},{key:"B",text:"shiny silver"},{key:"C",text:"dull black"},{key:"D",text:"polished metal"},{key:"E",text:"transparent glass"} ],
    answer: "C", solution: "Dull, dark (matt black) surfaces are the best emitters (and absorbers) of thermal radiation." },

  { id: "esat-mk6-p-13", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A motor has an input power of $200\\,\\text{W}$ and a useful output power of $150\\,\\text{W}$. Its efficiency is:",
    options: [ {key:"A",text:"$50\\%$"},{key:"B",text:"$65\\%$"},{key:"C",text:"$75\\%$"},{key:"D",text:"$85\\%$"},{key:"E",text:"$133\\%$"} ],
    answer: "C", solution: "Efficiency $=\\dfrac{150}{200}=0.75=75\\%$." },

  { id: "esat-mk6-p-14", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A pendulum bob is released from a height of $0.80\\,\\text{m}$ above its lowest point. Its speed at the lowest point is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$2.0\\,\\text{m/s}$"},{key:"B",text:"$4.0\\,\\text{m/s}$"},{key:"C",text:"$8.0\\,\\text{m/s}$"},{key:"D",text:"$16\\,\\text{m/s}$"},{key:"E",text:"$1.6\\,\\text{m/s}$"} ],
    answer: "B", solution: "$v=\\sqrt{2gh}=\\sqrt{2\\times10\\times0.80}=\\sqrt{16}=4.0\\,\\text{m/s}$." },

  { id: "esat-mk6-p-15", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A $3.0\\,\\text{kg}$ trolley moving at $4.0\\,\\text{m/s}$ collides with a stationary $1.0\\,\\text{kg}$ trolley and they move off together. Their common speed is:",
    options: [ {key:"A",text:"$1.0\\,\\text{m/s}$"},{key:"B",text:"$2.0\\,\\text{m/s}$"},{key:"C",text:"$3.0\\,\\text{m/s}$"},{key:"D",text:"$4.0\\,\\text{m/s}$"},{key:"E",text:"$12\\,\\text{m/s}$"} ],
    answer: "C", solution: "$3.0\\times4.0=(3.0+1.0)v\\Rightarrow v=\\dfrac{12}{4}=3.0\\,\\text{m/s}$." },

  { id: "esat-mk6-p-16", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A stationary $2.0\\,\\text{kg}$ object explodes into two pieces. A $0.50\\,\\text{kg}$ piece moves at $6.0\\,\\text{m/s}$. The speed of the other piece is:",
    options: [ {key:"A",text:"$1.0\\,\\text{m/s}$"},{key:"B",text:"$1.5\\,\\text{m/s}$"},{key:"C",text:"$2.0\\,\\text{m/s}$"},{key:"D",text:"$3.0\\,\\text{m/s}$"},{key:"E",text:"$6.0\\,\\text{m/s}$"} ],
    answer: "C", solution: "Other piece mass $=1.5\\,\\text{kg}$. Momentum conserved: $1.5v=0.50\\times6.0\\Rightarrow v=2.0\\,\\text{m/s}$ (opposite direction)." },

  { id: "esat-mk6-p-17", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A uniform beam of weight $30\\,\\text{N}$ and length $2.0\\,\\text{m}$ rests on a pivot at its centre. A $10\\,\\text{N}$ weight hangs $0.50\\,\\text{m}$ to the left of the pivot. What weight, hung $0.25\\,\\text{m}$ to the right of the pivot, balances the beam?",
    options: [ {key:"A",text:"$5\\,\\text{N}$"},{key:"B",text:"$10\\,\\text{N}$"},{key:"C",text:"$20\\,\\text{N}$"},{key:"D",text:"$30\\,\\text{N}$"},{key:"E",text:"$40\\,\\text{N}$"} ],
    answer: "C", solution: "The beam's own weight acts at the pivot (no moment). Balance: $10\\times0.50=W\\times0.25\\Rightarrow W=20\\,\\text{N}$." },

  { id: "esat-mk6-p-18", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "An object is projected horizontally at $20\\,\\text{m/s}$ from a height of $45\\,\\text{m}$. How far horizontally does it travel before landing? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$20\\,\\text{m}$"},{key:"B",text:"$45\\,\\text{m}$"},{key:"C",text:"$60\\,\\text{m}$"},{key:"D",text:"$90\\,\\text{m}$"},{key:"E",text:"$120\\,\\text{m}$"} ],
    answer: "C", solution: "Fall time: $45=\\tfrac12(10)t^2\\Rightarrow t=3.0\\,\\text{s}$; range $=20\\times3.0=60\\,\\text{m}$." },

  { id: "esat-mk6-p-19", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A car decelerates uniformly from $30\\,\\text{m/s}$ to $10\\,\\text{m/s}$ in $4.0\\,\\text{s}$. How far does it travel in this time?",
    options: [ {key:"A",text:"$40\\,\\text{m}$"},{key:"B",text:"$60\\,\\text{m}$"},{key:"C",text:"$80\\,\\text{m}$"},{key:"D",text:"$120\\,\\text{m}$"},{key:"E",text:"$160\\,\\text{m}$"} ],
    answer: "C", solution: "Average velocity $=\\dfrac{30+10}{2}=20\\,\\text{m/s}$; distance $=20\\times4.0=80\\,\\text{m}$." },

  { id: "esat-mk6-p-20", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A block slides down a frictionless plane inclined at $30^\\circ$ to the horizontal. Its acceleration is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$2.5\\,\\text{m/s}^2$"},{key:"B",text:"$5.0\\,\\text{m/s}^2$"},{key:"C",text:"$8.7\\,\\text{m/s}^2$"},{key:"D",text:"$10\\,\\text{m/s}^2$"},{key:"E",text:"$7.5\\,\\text{m/s}^2$"} ],
    answer: "B", solution: "$a=g\\sin30^\\circ=10\\times0.5=5.0\\,\\text{m/s}^2$." },

  { id: "esat-mk6-p-21", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A $60\\,\\text{kg}$ person stands in a lift that accelerates upwards at $2.0\\,\\text{m/s}^2$. The force the floor exerts on them is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$480\\,\\text{N}$"},{key:"B",text:"$600\\,\\text{N}$"},{key:"C",text:"$720\\,\\text{N}$"},{key:"D",text:"$120\\,\\text{N}$"},{key:"E",text:"$1200\\,\\text{N}$"} ],
    answer: "C", solution: "$N-mg=ma\\Rightarrow N=m(g+a)=60\\times12=720\\,\\text{N}$." },

  { id: "esat-mk6-p-22", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A car experiences a total driving force of $5000\\,\\text{N}$ while moving at a constant $20\\,\\text{m/s}$. The output power is:",
    options: [ {key:"A",text:"$250\\,\\text{W}$"},{key:"B",text:"$25\\,\\text{kW}$"},{key:"C",text:"$100\\,\\text{kW}$"},{key:"D",text:"$250\\,\\text{kW}$"},{key:"E",text:"$1\\,\\text{MW}$"} ],
    answer: "C", solution: "$P=Fv=5000\\times20=100000\\,\\text{W}=100\\,\\text{kW}$." },

  { id: "esat-mk6-p-23", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "A force of $200\\,\\text{N}$ acts over an area of $0.50\\,\\text{m}^2$. The pressure is:",
    options: [ {key:"A",text:"$100\\,\\text{Pa}$"},{key:"B",text:"$400\\,\\text{Pa}$"},{key:"C",text:"$40\\,\\text{Pa}$"},{key:"D",text:"$1000\\,\\text{Pa}$"},{key:"E",text:"$4.0\\,\\text{Pa}$"} ],
    answer: "B", solution: "$P=\\dfrac{F}{A}=\\dfrac{200}{0.50}=400\\,\\text{Pa}$." },

  { id: "esat-mk6-p-24", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "An object has mass $500\\,\\text{g}$ and volume $200\\,\\text{cm}^3$. Its density is:",
    options: [ {key:"A",text:"$0.4\\,\\text{g/cm}^3$"},{key:"B",text:"$2.5\\,\\text{g/cm}^3$"},{key:"C",text:"$2.0\\,\\text{g/cm}^3$"},{key:"D",text:"$4.0\\,\\text{g/cm}^3$"},{key:"E",text:"$100\\,\\text{g/cm}^3$"} ],
    answer: "B", solution: "$\\rho=\\dfrac{500}{200}=2.5\\,\\text{g/cm}^3$." },

  { id: "esat-mk6-p-25", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 3, marks: 1,
    question: "A $2.0\\,\\Omega$ and a $3.0\\,\\Omega$ resistor are connected in series, and this combination is connected in parallel with a $5.0\\,\\Omega$ resistor. The total resistance is:",
    options: [ {key:"A",text:"$1.5\\,\\Omega$"},{key:"B",text:"$2.5\\,\\Omega$"},{key:"C",text:"$5.0\\,\\Omega$"},{key:"D",text:"$10\\,\\Omega$"},{key:"E",text:"$3.3\\,\\Omega$"} ],
    answer: "B", solution: "Series: $2+3=5\\,\\Omega$; parallel with $5\\,\\Omega$: $\\dfrac{5\\times5}{5+5}=2.5\\,\\Omega$." },

  { id: "esat-mk6-p-26", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "A person claps and hears an echo from a cliff $0.40\\,\\text{s}$ later. If the speed of sound is $340\\,\\text{m/s}$, how far away is the cliff?",
    options: [ {key:"A",text:"$34\\,\\text{m}$"},{key:"B",text:"$68\\,\\text{m}$"},{key:"C",text:"$136\\,\\text{m}$"},{key:"D",text:"$170\\,\\text{m}$"},{key:"E",text:"$85\\,\\text{m}$"} ],
    answer: "B", solution: "Sound travels to the cliff and back: $340\\times0.40=136\\,\\text{m}$ total, so distance $=68\\,\\text{m}$." },

  { id: "esat-mk6-p-27", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "A radioactive sample has a half-life of $5.0\\,\\text{days}$. What fraction of the original sample remains after $10\\,\\text{days}$?",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$\\dfrac14$"},{key:"C",text:"$\\dfrac18$"},{key:"D",text:"$\\dfrac{1}{10}$"},{key:"E",text:"$\\dfrac{1}{16}$"} ],
    answer: "B", solution: "$10\\,\\text{days}=2$ half-lives; fraction $=\\left(\\tfrac12\\right)^2=\\tfrac14$." },
];
