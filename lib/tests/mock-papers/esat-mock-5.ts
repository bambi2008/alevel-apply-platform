// ESAT 模拟卷五（工程方向 · 对标 ENGAA 难度）—— 全新原创题。
// 参照 ENGAA 2016–2023 真题的题型、考点分布与难度校准，但题目均为原创，
// 未照搬任何真题，也不与练习题库（esat.ts / esat-topup.ts）及其他模拟卷重复。
// id 前缀 esat-mk5-* 唯一。全部五选一（A–E），无负分。
//
// 模块一：数学（含进阶）——27 题 / 40 分钟。
// 覆盖：代数与根式、指数对数、二次与判别式、数列与级数、坐标几何与圆、
//       三角方程、微积分（求导/积分/单调性/面积）、二项式、不等式、比例与变换。

import type { MCQQuestion } from "@/lib/tests/questions/types";

export const ESAT_MK5_MATH: MCQQuestion[] = [
  { id: "esat-mk5-m-01", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify $\\dfrac{\\sqrt{18}-\\sqrt{2}}{\\sqrt{2}}$.",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$\\sqrt{2}$"},{key:"D",text:"$3$"},{key:"E",text:"$2\\sqrt{2}$"} ],
    answer: "B", solution: "$\\sqrt{18}=3\\sqrt2$, so numerator $=2\\sqrt2$; dividing by $\\sqrt2$ gives $2$." },

  { id: "esat-mk5-m-02", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Evaluate $27^{2/3}\\times 4^{-1/2}$.",
    options: [ {key:"A",text:"$\\dfrac{9}{2}$"},{key:"B",text:"$3$"},{key:"C",text:"$\\dfrac{3}{2}$"},{key:"D",text:"$18$"},{key:"E",text:"$6$"} ],
    answer: "A", solution: "$27^{2/3}=9$, $4^{-1/2}=\\tfrac12$; product $=\\tfrac92$." },

  { id: "esat-mk5-m-03", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "For which values of $k$ does $x^2+kx+4=0$ have no real roots?",
    options: [ {key:"A",text:"$k>4$"},{key:"B",text:"$k<-4$"},{key:"C",text:"$-4<k<4$"},{key:"D",text:"$k>16$"},{key:"E",text:"$k<4$"} ],
    answer: "C", solution: "No real roots $\\Rightarrow$ discriminant $k^2-16<0\\Rightarrow -4<k<4$." },

  { id: "esat-mk5-m-04", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Make $x$ the subject of $y=\\dfrac{2x-1}{x+3}$.",
    options: [ {key:"A",text:"$\\dfrac{3y+1}{2-y}$"},{key:"B",text:"$\\dfrac{3y-1}{2-y}$"},{key:"C",text:"$\\dfrac{3y+1}{y-2}$"},{key:"D",text:"$\\dfrac{1-3y}{y+2}$"},{key:"E",text:"$\\dfrac{2y+1}{y-3}$"} ],
    answer: "A", solution: "$y(x+3)=2x-1\\Rightarrow x(y-2)=-1-3y\\Rightarrow x=\\dfrac{3y+1}{2-y}$." },

  { id: "esat-mk5-m-05", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The coefficient of $x^2$ in the expansion of $(2-x)^6$ is:",
    options: [ {key:"A",text:"$60$"},{key:"B",text:"$120$"},{key:"C",text:"$160$"},{key:"D",text:"$240$"},{key:"E",text:"$-240$"} ],
    answer: "D", solution: "$\\binom{6}{2}2^{4}(-1)^2=15\\cdot16=240$." },

  { id: "esat-mk5-m-06", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $\\log_3 x+\\log_3(x+6)=3$.",
    options: [ {key:"A",text:"$x=3$"},{key:"B",text:"$x=-9$"},{key:"C",text:"$x=3$ or $x=-9$"},{key:"D",text:"$x=9$"},{key:"E",text:"$x=21$"} ],
    answer: "A", solution: "$x(x+6)=27\\Rightarrow x^2+6x-27=0\\Rightarrow(x+9)(x-3)=0$; reject $x=-9$ (domain), so $x=3$." },

  { id: "esat-mk5-m-07", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A geometric series has first term $16$ and fifth term $1$, with positive common ratio. Its sum to infinity is:",
    options: [ {key:"A",text:"$24$"},{key:"B",text:"$28$"},{key:"C",text:"$30$"},{key:"D",text:"$32$"},{key:"E",text:"$36$"} ],
    answer: "D", solution: "$r^4=\\tfrac1{16}\\Rightarrow r=\\tfrac12$; $S_\\infty=\\dfrac{16}{1-\\frac12}=32$." },

  { id: "esat-mk5-m-08", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "The arithmetic series $3+7+11+\\cdots$ has a sum of $210$. How many terms are added?",
    options: [ {key:"A",text:"$8$"},{key:"B",text:"$9$"},{key:"C",text:"$10$"},{key:"D",text:"$11$"},{key:"E",text:"$12$"} ],
    answer: "C", solution: "$S_n=\\tfrac n2[6+4(n-1)]=n(2n+1)=210\\Rightarrow 2n^2+n-210=0\\Rightarrow n=10$." },

  { id: "esat-mk5-m-09", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The circle $x^2+y^2-4x+6y-12=0$ has radius:",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$4$"},{key:"C",text:"$5$"},{key:"D",text:"$6$"},{key:"E",text:"$\\sqrt{12}$"} ],
    answer: "C", solution: "Centre $(2,-3)$; $r=\\sqrt{2^2+3^2+12}=\\sqrt{25}=5$." },

  { id: "esat-mk5-m-10", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "For which value(s) of $c$ is the line $y=x+c$ a tangent to the circle $x^2+y^2=8$?",
    options: [ {key:"A",text:"$c=4$ only"},{key:"B",text:"$c=\\pm4$"},{key:"C",text:"$c=\\pm2\\sqrt2$"},{key:"D",text:"$c=\\pm8$"},{key:"E",text:"$c=2$ only"} ],
    answer: "B", solution: "Distance from origin to line $=\\dfrac{|c|}{\\sqrt2}$; tangency needs this $=\\sqrt8=2\\sqrt2\\Rightarrow|c|=4$." },

  { id: "esat-mk5-m-11", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "How many solutions does $2\\cos^2 x=1$ have for $0^\\circ\\le x\\le 360^\\circ$?",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$5$"} ],
    answer: "D", solution: "$\\cos^2x=\\tfrac12\\Rightarrow\\cos x=\\pm\\tfrac1{\\sqrt2}$; $x=45^\\circ,135^\\circ,225^\\circ,315^\\circ$." },

  { id: "esat-mk5-m-12", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "Given $3\\sin\\theta=2\\cos\\theta$ with $0^\\circ<\\theta<90^\\circ$, the value of $\\sin\\theta$ is:",
    options: [ {key:"A",text:"$\\dfrac{2}{3}$"},{key:"B",text:"$\\dfrac{2}{\\sqrt{13}}$"},{key:"C",text:"$\\dfrac{3}{\\sqrt{13}}$"},{key:"D",text:"$\\dfrac{2}{\\sqrt5}$"},{key:"E",text:"$\\dfrac{3}{5}$"} ],
    answer: "B", solution: "$\\tan\\theta=\\tfrac23$, so opposite $2$, adjacent $3$, hypotenuse $\\sqrt{13}$; $\\sin\\theta=\\tfrac2{\\sqrt{13}}$." },

  { id: "esat-mk5-m-13", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $x^2-x-6>0$.",
    options: [ {key:"A",text:"$-2<x<3$"},{key:"B",text:"$x<-2$ or $x>3$"},{key:"C",text:"$x<-3$ or $x>2$"},{key:"D",text:"$-3<x<2$"},{key:"E",text:"$x>3$ only"} ],
    answer: "B", solution: "$(x-3)(x+2)>0\\Rightarrow x<-2$ or $x>3$." },

  { id: "esat-mk5-m-14", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "At how many points does the curve $y=x^3-6x^2+9x$ have a horizontal tangent?",
    options: [ {key:"A",text:"$0$"},{key:"B",text:"$1$"},{key:"C",text:"$2$"},{key:"D",text:"$3$"},{key:"E",text:"$4$"} ],
    answer: "C", solution: "$\\dfrac{dy}{dx}=3x^2-12x+9=3(x-1)(x-3)=0$ at $x=1,3$ — two points." },

  { id: "esat-mk5-m-15", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "The area enclosed by $y=4x-x^2$ and the $x$-axis is:",
    options: [ {key:"A",text:"$16/3$"},{key:"B",text:"$8$"},{key:"C",text:"$32/3$"},{key:"D",text:"$16$"},{key:"E",text:"$64/3$"} ],
    answer: "C", solution: "The roots are $0$ and $4$. The area is $\\int_0^4(4x-x^2)\\,dx=32/3$." },

  { id: "esat-mk5-m-16", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Evaluate $\\displaystyle\\int_{-1}^{2}(x+2)\\,dx$.",
    options: [ {key:"A",text:"$\\dfrac{9}{2}$"},{key:"B",text:"$6$"},{key:"C",text:"$\\dfrac{13}{2}$"},{key:"D",text:"$\\dfrac{15}{2}$"},{key:"E",text:"$9$"} ],
    answer: "D", solution: "$\\left[\\tfrac{x^2}{2}+2x\\right]_{-1}^{2}=(2+4)-(\\tfrac12-2)=6-(-\\tfrac32)=\\tfrac{15}{2}$." },

  { id: "esat-mk5-m-17", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "For which values of $x$ is $f(x)=x^3-3x$ an increasing function?",
    options: [ {key:"A",text:"$-1<x<1$"},{key:"B",text:"$x<-1$ or $x>1$"},{key:"C",text:"$x>0$"},{key:"D",text:"$x<0$"},{key:"E",text:"all $x$"} ],
    answer: "B", solution: "$f'(x)=3x^2-3>0\\Rightarrow x^2>1\\Rightarrow x<-1$ or $x>1$." },

  { id: "esat-mk5-m-18", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Given that $x=1$ is a root of $x^3-2x^2-5x+6$, the sum of all three roots is:",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$5$"},{key:"E",text:"$6$"} ],
    answer: "B", solution: "By Vieta, sum of roots $=-\\dfrac{-2}{1}=2$ (roots are $1,3,-2$)." },

  { id: "esat-mk5-m-19", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The line $y=k$ meets the curve $y=x^2-4x+7$ at exactly one point when $k$ equals:",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$7$"} ],
    answer: "C", solution: "Minimum of $x^2-4x+7$ is at $x=2$: $4-8+7=3$; the line is tangent there." },

  { id: "esat-mk5-m-20", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The curve $y=x^2$ is translated by the vector $\\begin{pmatrix}3\\\\-2\\end{pmatrix}$. The equation of the new curve is:",
    options: [ {key:"A",text:"$y=(x-3)^2-2$"},{key:"B",text:"$y=(x+3)^2-2$"},{key:"C",text:"$y=(x-3)^2+2$"},{key:"D",text:"$y=(x-2)^2-3$"},{key:"E",text:"$y=(x+3)^2+2$"} ],
    answer: "A", solution: "Translation $(3,-2)$ replaces $x$ with $x-3$ and subtracts $2$: $y=(x-3)^2-2$." },

  { id: "esat-mk5-m-21", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $Q:R=3:4$ and $R:S=2:5$, then $Q:S$ in simplest form is:",
    options: [ {key:"A",text:"$3:5$"},{key:"B",text:"$3:10$"},{key:"C",text:"$6:5$"},{key:"D",text:"$3:20$"},{key:"E",text:"$6:20$"} ],
    answer: "B", solution: "Scale so $R$ matches: $Q:R=3:4$, $R:S=4:10$; thus $Q:S=3:10$." },

  { id: "esat-mk5-m-22", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "$y$ is inversely proportional to $x^2$. When $x=2$, $y=9$. Find $y$ when $x=3$.",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$4$"},{key:"C",text:"$6$"},{key:"D",text:"$\\dfrac{9}{2}$"},{key:"E",text:"$\\dfrac{4}{9}$"} ],
    answer: "B", solution: "$k=9\\cdot2^2=36$; at $x=3$: $y=\\dfrac{36}{9}=4$." },

  { id: "esat-mk5-m-23", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A machine worth £20000 depreciates by 15% each year. By how much has its value fallen after 2 years?",
    options: [ {key:"A",text:"£5100"},{key:"B",text:"£5550"},{key:"C",text:"£6000"},{key:"D",text:"£14450"},{key:"E",text:"£3000"} ],
    answer: "B", solution: "Value $=20000\\cdot0.85^2=14450$; fall $=20000-14450=5550$." },

  { id: "esat-mk5-m-24", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Solve $2^{x}\\cdot 4^{x-1}=32$.",
    options: [ {key:"A",text:"$x=2$"},{key:"B",text:"$x=\\dfrac{7}{3}$"},{key:"C",text:"$x=3$"},{key:"D",text:"$x=\\dfrac{5}{3}$"},{key:"E",text:"$x=\\dfrac{7}{2}$"} ],
    answer: "B", solution: "$2^{x}\\cdot2^{2x-2}=2^5\\Rightarrow 3x-2=5\\Rightarrow x=\\tfrac73$." },

  { id: "esat-mk5-m-25", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify $\\dfrac{x^2-9}{x^2+x-12}$.",
    options: [ {key:"A",text:"$\\dfrac{x+3}{x+4}$"},{key:"B",text:"$\\dfrac{x-3}{x+4}$"},{key:"C",text:"$\\dfrac{x+3}{x-4}$"},{key:"D",text:"$\\dfrac{x-3}{x-4}$"},{key:"E",text:"$\\dfrac{x+3}{x+12}$"} ],
    answer: "A", solution: "$\\dfrac{(x-3)(x+3)}{(x+4)(x-3)}=\\dfrac{x+3}{x+4}$." },

  { id: "esat-mk5-m-26", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The quadratic $x^2-6x+k=0$ has two roots that differ by $2$. Find $k$.",
    options: [ {key:"A",text:"$5$"},{key:"B",text:"$6$"},{key:"C",text:"$8$"},{key:"D",text:"$9$"},{key:"E",text:"$10$"} ],
    answer: "C", solution: "Roots $\\alpha,\\alpha+2$ sum to $6\\Rightarrow\\alpha=2$; product $=2\\cdot4=8=k$." },

  { id: "esat-mk5-m-27", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "A trapezium has parallel sides $(x+1)$ and $(x+7)$ and height $x$. Its area is $45$. The length of the longer parallel side is:",
    options: [ {key:"A",text:"$10$"},{key:"B",text:"$11$"},{key:"C",text:"$12$"},{key:"D",text:"$13$"},{key:"E",text:"$15$"} ],
    answer: "C", solution: "Area $=\\tfrac12(2x+8)x=x^2+4x=45\\Rightarrow(x+9)(x-5)=0\\Rightarrow x=5$; longer side $=x+7=12$." },
];

// ── 模块二：物理（含进阶）——27 题 / 40 分钟 ─────────────────────────────────
// 覆盖：运动学、力与牛顿定律、能量与功率、动量与碰撞、力矩与平衡、
//       圆周与抛体、电路（欧姆定律/功率/电荷）、波、核物理、热与辐射、密度压强。
// g = 10 N/kg（与 ENGAA 惯例一致，便于无计算器求解）。
export const ESAT_MK5_PHYS: MCQQuestion[] = [
  { id: "esat-mk5-p-01", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A ball is thrown vertically upwards at $20\\,\\text{m/s}$. Ignoring air resistance, how high does it rise? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$10\\,\\text{m}$"},{key:"B",text:"$15\\,\\text{m}$"},{key:"C",text:"$20\\,\\text{m}$"},{key:"D",text:"$25\\,\\text{m}$"},{key:"E",text:"$40\\,\\text{m}$"} ],
    answer: "C", solution: "$v^2=u^2-2gh$; at top $0=20^2-2(10)h\\Rightarrow h=\\dfrac{400}{20}=20\\,\\text{m}$." },

  { id: "esat-mk5-p-02", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 2, marks: 1,
    question: "A car accelerates uniformly from rest to $30\\,\\text{m/s}$ in $12\\,\\text{s}$. How far does it travel in this time?",
    options: [ {key:"A",text:"$180\\,\\text{m}$"},{key:"B",text:"$240\\,\\text{m}$"},{key:"C",text:"$360\\,\\text{m}$"},{key:"D",text:"$90\\,\\text{m}$"},{key:"E",text:"$450\\,\\text{m}$"} ],
    answer: "A", solution: "Distance $=\\text{average velocity}\\times t=\\dfrac{0+30}{2}\\times12=180\\,\\text{m}$." },

  { id: "esat-mk5-p-03", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A $2.0\\,\\text{kg}$ block is pulled along a rough horizontal floor by a horizontal force of $12\\,\\text{N}$. The frictional force is $4.0\\,\\text{N}$. What is the block's acceleration?",
    options: [ {key:"A",text:"$2.0\\,\\text{m/s}^2$"},{key:"B",text:"$4.0\\,\\text{m/s}^2$"},{key:"C",text:"$6.0\\,\\text{m/s}^2$"},{key:"D",text:"$8.0\\,\\text{m/s}^2$"},{key:"E",text:"$3.0\\,\\text{m/s}^2$"} ],
    answer: "B", solution: "Resultant $=12-4=8\\,\\text{N}$; $a=\\dfrac{F}{m}=\\dfrac{8}{2}=4.0\\,\\text{m/s}^2$." },

  { id: "esat-mk5-p-04", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A lift of mass $500\\,\\text{kg}$ accelerates upwards at $2.0\\,\\text{m/s}^2$. What is the tension in the supporting cable? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$1000\\,\\text{N}$"},{key:"B",text:"$4000\\,\\text{N}$"},{key:"C",text:"$5000\\,\\text{N}$"},{key:"D",text:"$6000\\,\\text{N}$"},{key:"E",text:"$7000\\,\\text{N}$"} ],
    answer: "D", solution: "$T-mg=ma\\Rightarrow T=m(g+a)=500(12)=6000\\,\\text{N}$." },

  { id: "esat-mk5-p-05", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A $0.50\\,\\text{kg}$ ball falls from rest through $8.0\\,\\text{m}$. Ignoring air resistance, its kinetic energy just before impact is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$20\\,\\text{J}$"},{key:"B",text:"$40\\,\\text{J}$"},{key:"C",text:"$4.0\\,\\text{J}$"},{key:"D",text:"$80\\,\\text{J}$"},{key:"E",text:"$16\\,\\text{J}$"} ],
    answer: "B", solution: "$E_k=mgh=0.50\\times10\\times8.0=40\\,\\text{J}$." },

  { id: "esat-mk5-p-06", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 2, marks: 1,
    question: "A motor lifts a $30\\,\\text{kg}$ load at a constant speed of $0.50\\,\\text{m/s}$. What is the useful output power? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$15\\,\\text{W}$"},{key:"B",text:"$60\\,\\text{W}$"},{key:"C",text:"$150\\,\\text{W}$"},{key:"D",text:"$300\\,\\text{W}$"},{key:"E",text:"$600\\,\\text{W}$"} ],
    answer: "C", solution: "$P=Fv=(30\\times10)\\times0.50=150\\,\\text{W}$." },

  { id: "esat-mk5-p-07", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 3, marks: 1,
    question: "A $1200\\,\\text{kg}$ car moving at $20\\,\\text{m/s}$ brakes to rest over $50\\,\\text{m}$. What is the average braking force?",
    options: [ {key:"A",text:"$2400\\,\\text{N}$"},{key:"B",text:"$4800\\,\\text{N}$"},{key:"C",text:"$9600\\,\\text{N}$"},{key:"D",text:"$12000\\,\\text{N}$"},{key:"E",text:"$24000\\,\\text{N}$"} ],
    answer: "B", solution: "$E_k=\\tfrac12(1200)(20^2)=240000\\,\\text{J}$; $F=\\dfrac{E}{d}=\\dfrac{240000}{50}=4800\\,\\text{N}$." },

  { id: "esat-mk5-p-08", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A $4.0\\,\\text{kg}$ trolley moving at $6.0\\,\\text{m/s}$ collides with a stationary $2.0\\,\\text{kg}$ trolley and they move off together. Their common velocity is:",
    options: [ {key:"A",text:"$2.0\\,\\text{m/s}$"},{key:"B",text:"$3.0\\,\\text{m/s}$"},{key:"C",text:"$4.0\\,\\text{m/s}$"},{key:"D",text:"$4.5\\,\\text{m/s}$"},{key:"E",text:"$6.0\\,\\text{m/s}$"} ],
    answer: "C", solution: "Momentum: $4.0\\times6.0=(4.0+2.0)v\\Rightarrow v=\\dfrac{24}{6}=4.0\\,\\text{m/s}$." },

  { id: "esat-mk5-p-09", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A ball of mass $0.20\\,\\text{kg}$ hits a wall at $8.0\\,\\text{m/s}$ and rebounds at $6.0\\,\\text{m/s}$ in the opposite direction. The magnitude of the impulse on the ball is:",
    options: [ {key:"A",text:"$0.40\\,\\text{N·s}$"},{key:"B",text:"$1.2\\,\\text{N·s}$"},{key:"C",text:"$1.6\\,\\text{N·s}$"},{key:"D",text:"$2.8\\,\\text{N·s}$"},{key:"E",text:"$0.28\\,\\text{N·s}$"} ],
    answer: "D", solution: "$\\Delta p=m(v-u)=0.20(6.0-(-8.0))=0.20\\times14=2.8\\,\\text{N·s}$." },

  { id: "esat-mk5-p-10", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A uniform beam of weight $200\\,\\text{N}$ and length $4.0\\,\\text{m}$ rests on a pivot $1.0\\,\\text{m}$ from its left end. What downward force at the left end keeps it horizontal?",
    options: [ {key:"A",text:"$100\\,\\text{N}$"},{key:"B",text:"$150\\,\\text{N}$"},{key:"C",text:"$200\\,\\text{N}$"},{key:"D",text:"$300\\,\\text{N}$"},{key:"E",text:"$400\\,\\text{N}$"} ],
    answer: "C", solution: "Weight acts at centre $1.0\\,\\text{m}$ right of pivot. Taking moments about pivot: $F\\times1.0=200\\times1.0\\Rightarrow F=200\\,\\text{N}$." },

  { id: "esat-mk5-p-11", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A $6.0\\,\\Omega$ and a $3.0\\,\\Omega$ resistor are connected in parallel across a $12\\,\\text{V}$ battery of negligible internal resistance. The total current drawn from the battery is:",
    options: [ {key:"A",text:"$2.0\\,\\text{A}$"},{key:"B",text:"$4.0\\,\\text{A}$"},{key:"C",text:"$6.0\\,\\text{A}$"},{key:"D",text:"$1.3\\,\\text{A}$"},{key:"E",text:"$18\\,\\text{A}$"} ],
    answer: "C", solution: "Parallel resistance $=\\dfrac{6\\times3}{6+3}=2.0\\,\\Omega$; $I=\\dfrac{12}{2.0}=6.0\\,\\text{A}$." },

  { id: "esat-mk5-p-12", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A resistor dissipates $18\\,\\text{W}$ when a current of $3.0\\,\\text{A}$ flows through it. Its resistance is:",
    options: [ {key:"A",text:"$2.0\\,\\Omega$"},{key:"B",text:"$3.0\\,\\Omega$"},{key:"C",text:"$6.0\\,\\Omega$"},{key:"D",text:"$54\\,\\Omega$"},{key:"E",text:"$1.5\\,\\Omega$"} ],
    answer: "A", solution: "$P=I^2R\\Rightarrow R=\\dfrac{P}{I^2}=\\dfrac{18}{9}=2.0\\,\\Omega$." },

  { id: "esat-mk5-p-13", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 3, marks: 1,
    question: "A $5.0\\,\\Omega$ resistor is connected in series with a $10\\,\\Omega$ resistor across a $9.0\\,\\text{V}$ battery. What is the potential difference across the $10\\,\\Omega$ resistor?",
    options: [ {key:"A",text:"$3.0\\,\\text{V}$"},{key:"B",text:"$4.5\\,\\text{V}$"},{key:"C",text:"$6.0\\,\\text{V}$"},{key:"D",text:"$9.0\\,\\text{V}$"},{key:"E",text:"$1.8\\,\\text{V}$"} ],
    answer: "C", solution: "$I=\\dfrac{9.0}{15}=0.60\\,\\text{A}$; $V_{10}=0.60\\times10=6.0\\,\\text{V}$." },

  { id: "esat-mk5-p-14", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 2, marks: 1,
    question: "A current of $0.50\\,\\text{A}$ flows for $4.0\\,\\text{minutes}$. How much charge passes?",
    options: [ {key:"A",text:"$2.0\\,\\text{C}$"},{key:"B",text:"$30\\,\\text{C}$"},{key:"C",text:"$120\\,\\text{C}$"},{key:"D",text:"$240\\,\\text{C}$"},{key:"E",text:"$8.0\\,\\text{C}$"} ],
    answer: "C", solution: "$Q=It=0.50\\times(4.0\\times60)=0.50\\times240=120\\,\\text{C}$." },

  { id: "esat-mk5-p-15", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "A wave has frequency $250\\,\\text{Hz}$ and travels at $340\\,\\text{m/s}$. Its wavelength is closest to:",
    options: [ {key:"A",text:"$0.74\\,\\text{m}$"},{key:"B",text:"$1.4\\,\\text{m}$"},{key:"C",text:"$1.36\\,\\text{m}$"},{key:"D",text:"$85\\,\\text{m}$"},{key:"E",text:"$0.85\\,\\text{m}$"} ],
    answer: "C", solution: "$\\lambda=\\dfrac{v}{f}=\\dfrac{340}{250}=1.36\\,\\text{m}$." },

  { id: "esat-mk5-p-16", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 3, marks: 1,
    question: "A transverse wave has frequency $4.0\\,\\text{Hz}$ and amplitude $3.0\\,\\text{cm}$. What total distance does a particle of the medium move in $2.0\\,\\text{s}$?",
    options: [ {key:"A",text:"$24\\,\\text{cm}$"},{key:"B",text:"$48\\,\\text{cm}$"},{key:"C",text:"$96\\,\\text{cm}$"},{key:"D",text:"$12\\,\\text{cm}$"},{key:"E",text:"$8.0\\,\\text{cm}$"} ],
    answer: "C", solution: "In one period a particle covers $4A=12\\,\\text{cm}$. Cycles in $2.0\\,\\text{s}=4.0\\times2.0=8$; total $=8\\times12=96\\,\\text{cm}$." },

  { id: "esat-mk5-p-17", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "A nucleus $^{238}_{92}\\text{U}$ emits an alpha particle. The resulting nucleus is:",
    options: [ {key:"A",text:"$^{234}_{90}\\text{Th}$"},{key:"B",text:"$^{234}_{92}\\text{U}$"},{key:"C",text:"$^{238}_{90}\\text{Th}$"},{key:"D",text:"$^{234}_{88}\\text{Ra}$"},{key:"E",text:"$^{236}_{90}\\text{Th}$"} ],
    answer: "A", solution: "Alpha emission reduces mass number by $4$ and atomic number by $2$: $^{234}_{90}\\text{Th}$." },

  { id: "esat-mk5-p-18", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 3, marks: 1,
    question: "A radioactive isotope has a half-life of $8.0\\,\\text{days}$. What fraction of the original sample remains after $24\\,\\text{days}$?",
    options: [ {key:"A",text:"$\\dfrac{1}{2}$"},{key:"B",text:"$\\dfrac{1}{4}$"},{key:"C",text:"$\\dfrac{1}{8}$"},{key:"D",text:"$\\dfrac{1}{16}$"},{key:"E",text:"$\\dfrac{1}{3}$"} ],
    answer: "C", solution: "$24\\,\\text{days}=3$ half-lives; fraction $=\\left(\\tfrac12\\right)^3=\\tfrac18$." },

  { id: "esat-mk5-p-19", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "A block has mass $2.4\\,\\text{kg}$ and volume $300\\,\\text{cm}^3$. Its density is:",
    options: [ {key:"A",text:"$0.80\\,\\text{g/cm}^3$"},{key:"B",text:"$8.0\\,\\text{g/cm}^3$"},{key:"C",text:"$1.25\\,\\text{g/cm}^3$"},{key:"D",text:"$12.5\\,\\text{g/cm}^3$"},{key:"E",text:"$720\\,\\text{g/cm}^3$"} ],
    answer: "B", solution: "$2.4\\,\\text{kg}=2400\\,\\text{g}$; $\\rho=\\dfrac{2400}{300}=8.0\\,\\text{g/cm}^3$." },

  { id: "esat-mk5-p-20", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "A force of $60\\,\\text{N}$ acts on an area of $0.30\\,\\text{m}^2$. The pressure is:",
    options: [ {key:"A",text:"$18\\,\\text{Pa}$"},{key:"B",text:"$20\\,\\text{Pa}$"},{key:"C",text:"$180\\,\\text{Pa}$"},{key:"D",text:"$200\\,\\text{Pa}$"},{key:"E",text:"$2.0\\,\\text{Pa}$"} ],
    answer: "D", solution: "$P=\\dfrac{F}{A}=\\dfrac{60}{0.30}=200\\,\\text{Pa}$." },

  { id: "esat-mk5-p-21", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "An object is projected horizontally at $15\\,\\text{m/s}$ from a height of $20\\,\\text{m}$. How far horizontally does it land? ($g=10\\,\\text{N/kg}$, air resistance ignored)",
    options: [ {key:"A",text:"$15\\,\\text{m}$"},{key:"B",text:"$20\\,\\text{m}$"},{key:"C",text:"$30\\,\\text{m}$"},{key:"D",text:"$45\\,\\text{m}$"},{key:"E",text:"$60\\,\\text{m}$"} ],
    answer: "C", solution: "Fall time: $20=\\tfrac12(10)t^2\\Rightarrow t=2.0\\,\\text{s}$; range $=15\\times2.0=30\\,\\text{m}$." },

  { id: "esat-mk5-p-22", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 3, marks: 1,
    question: "A pump raises $200\\,\\text{kg}$ of water per minute through a height of $6.0\\,\\text{m}$. The minimum power required is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$120\\,\\text{W}$"},{key:"B",text:"$200\\,\\text{W}$"},{key:"C",text:"$720\\,\\text{W}$"},{key:"D",text:"$1200\\,\\text{W}$"},{key:"E",text:"$12000\\,\\text{W}$"} ],
    answer: "B", solution: "Work per minute $=mgh=200\\times10\\times6.0=12000\\,\\text{J}$; power $=\\dfrac{12000}{60}=200\\,\\text{W}$." },

  { id: "esat-mk5-p-23", type: "mcq", testId: "esat", topicId: "esat-phys3", difficulty: 3, marks: 1,
    question: "In $3.0\\,\\text{minutes}$ a heater transfers $5400\\,\\text{J}$ while connected to a $6.0\\,\\text{V}$ supply. The current through the heater is:",
    options: [ {key:"A",text:"$0.50\\,\\text{A}$"},{key:"B",text:"$2.0\\,\\text{A}$"},{key:"C",text:"$5.0\\,\\text{A}$"},{key:"D",text:"$30\\,\\text{A}$"},{key:"E",text:"$3.0\\,\\text{A}$"} ],
    answer: "C", solution: "Power $=\\dfrac{5400}{180}=30\\,\\text{W}$; $I=\\dfrac{P}{V}=\\dfrac{30}{6.0}=5.0\\,\\text{A}$." },

  { id: "esat-mk5-p-24", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "Two forces of $9.0\\,\\text{N}$ and $12\\,\\text{N}$ act on a point at right angles to each other. The magnitude of their resultant is:",
    options: [ {key:"A",text:"$3.0\\,\\text{N}$"},{key:"B",text:"$15\\,\\text{N}$"},{key:"C",text:"$21\\,\\text{N}$"},{key:"D",text:"$10.5\\,\\text{N}$"},{key:"E",text:"$\\sqrt{21}\\,\\text{N}$"} ],
    answer: "B", solution: "$R=\\sqrt{9^2+12^2}=\\sqrt{81+144}=\\sqrt{225}=15\\,\\text{N}$." },

  { id: "esat-mk5-p-25", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "When a nucleus emits a beta-minus particle, its atomic number:",
    options: [ {key:"A",text:"decreases by 1"},{key:"B",text:"increases by 1"},{key:"C",text:"decreases by 2"},{key:"D",text:"stays the same"},{key:"E",text:"increases by 2"} ],
    answer: "B", solution: "A neutron becomes a proton (plus an electron emitted), so the atomic number increases by 1 while mass number is unchanged." },

  { id: "esat-mk5-p-26", type: "mcq", testId: "esat", topicId: "esat-phys2", difficulty: 3, marks: 1,
    question: "A ball of mass $0.40\\,\\text{kg}$ is released from rest at height $5.0\\,\\text{m}$ and rebounds to $3.2\\,\\text{m}$. How much energy is lost in the bounce? ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$0.72\\,\\text{J}$"},{key:"B",text:"$1.8\\,\\text{J}$"},{key:"C",text:"$2.9\\,\\text{J}$"},{key:"D",text:"$7.2\\,\\text{J}$"},{key:"E",text:"$12.8\\,\\text{J}$"} ],
    answer: "D", solution: "$\\Delta E=mg\\Delta h=0.40\\times10\\times(5.0-3.2)=0.40\\times10\\times1.8=7.2\\,\\text{J}$." },

  { id: "esat-mk5-p-27", type: "mcq", testId: "esat", topicId: "esat-phys1", difficulty: 3, marks: 1,
    question: "A $50\\,\\text{kg}$ mass hangs from a rope inside a lift. When the lift accelerates downwards at $2.0\\,\\text{m/s}^2$, the tension in the rope is: ($g=10\\,\\text{N/kg}$)",
    options: [ {key:"A",text:"$100\\,\\text{N}$"},{key:"B",text:"$400\\,\\text{N}$"},{key:"C",text:"$500\\,\\text{N}$"},{key:"D",text:"$600\\,\\text{N}$"},{key:"E",text:"$700\\,\\text{N}$"} ],
    answer: "B", solution: "$mg-T=ma\\Rightarrow T=m(g-a)=50(10-2.0)=400\\,\\text{N}$." },
];
