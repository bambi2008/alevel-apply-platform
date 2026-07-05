// ESAT 模拟卷八（自然科学方向 · 数学 + 化学 · 对标 NSAA）—— 全新原创题。
// 依据 NSAA 2016–2023 真题校准：NSAA 为自然科学考试，含数学 + 物理 + 化学 + 生物；
// 本卷补足化学方向（与工程卷五/六/七的数理侧互补）。化学考点覆盖：原子结构与元素、
// 摩尔与相对分子质量、化学计量与方程式配平、浓度与气体体积、键合、酸碱与 pH、
// 反应速率、能量变化、氧化还原与电解、周期性、经验式。数学为自然科学风格基础—中等。
// 常用相对原子质量：H=1, C=12, N=14, O=16, Na=23, S=32, Cl=35.5, Ca=40。
// 题目全新原创，未照搬真题，也不与其他卷/练习库重复。id 前缀 esat-mk8-*。

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ── 模块一：数学（自然科学基础—中等）——27 题 / 40 分钟 ─────────────────────
export const ESAT_MK8_MATH: MCQQuestion[] = [
  { id: "esat-mk8-m-01", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Evaluate $2^5\\times2^{-2}$.",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$4$"},{key:"C",text:"$8$"},{key:"D",text:"$16$"},{key:"E",text:"$32$"} ],
    answer: "C", solution: "$2^{5-2}=2^3=8$." },

  { id: "esat-mk8-m-02", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Express $0.000045$ in standard form.",
    options: [ {key:"A",text:"$4.5\\times10^{-5}$"},{key:"B",text:"$45\\times10^{-6}$"},{key:"C",text:"$4.5\\times10^{-4}$"},{key:"D",text:"$4.5\\times10^{5}$"},{key:"E",text:"$0.45\\times10^{-4}$"} ],
    answer: "A", solution: "$0.000045=4.5\\times10^{-5}$." },

  { id: "esat-mk8-m-03", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $\\dfrac{x}{3}+\\dfrac{x}{6}=3$.",
    options: [ {key:"A",text:"$x=3$"},{key:"B",text:"$x=6$"},{key:"C",text:"$x=9$"},{key:"D",text:"$x=12$"},{key:"E",text:"$x=2$"} ],
    answer: "B", solution: "$\\dfrac{2x+x}{6}=3\\Rightarrow \\dfrac{3x}{6}=3\\Rightarrow x=6$." },

  { id: "esat-mk8-m-04", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Calculate $\\dfrac{3.0\\times10^{8}}{6.0\\times10^{4}}$.",
    options: [ {key:"A",text:"$5.0\\times10^{2}$"},{key:"B",text:"$5.0\\times10^{3}$"},{key:"C",text:"$2.0\\times10^{3}$"},{key:"D",text:"$5.0\\times10^{4}$"},{key:"E",text:"$2.0\\times10^{4}$"} ],
    answer: "B", solution: "$\\dfrac{3.0}{6.0}=0.5$ and $10^{8-4}=10^4$; $0.5\\times10^4=5.0\\times10^3$." },

  { id: "esat-mk8-m-05", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A quantity increases from $40$ to $50$. The percentage increase is:",
    options: [ {key:"A",text:"$10\\%$"},{key:"B",text:"$20\\%$"},{key:"C",text:"$25\\%$"},{key:"D",text:"$40\\%$"},{key:"E",text:"$80\\%$"} ],
    answer: "C", solution: "$\\dfrac{50-40}{40}=\\dfrac{10}{40}=25\\%$." },

  { id: "esat-mk8-m-06", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Make $T$ the subject of $v=u+aT$.",
    options: [ {key:"A",text:"$\\dfrac{v-u}{a}$"},{key:"B",text:"$\\dfrac{v+u}{a}$"},{key:"C",text:"$\\dfrac{u-v}{a}$"},{key:"D",text:"$a(v-u)$"},{key:"E",text:"$\\dfrac{v}{a}-u$"} ],
    answer: "A", solution: "$aT=v-u\\Rightarrow T=\\dfrac{v-u}{a}$." },

  { id: "esat-mk8-m-07", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify the ratio $250\\,\\text{mL}:1\\,\\text{L}$.",
    options: [ {key:"A",text:"$1:2$"},{key:"B",text:"$1:4$"},{key:"C",text:"$1:5$"},{key:"D",text:"$4:1$"},{key:"E",text:"$1:250$"} ],
    answer: "B", solution: "$1\\,\\text{L}=1000\\,\\text{mL}$; $250:1000=1:4$." },

  { id: "esat-mk8-m-08", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A sphere has radius $3\\,\\text{cm}$. Its volume is $\\left(V=\\tfrac43\\pi r^3\\right)$:",
    options: [ {key:"A",text:"$9\\pi\\,\\text{cm}^3$"},{key:"B",text:"$27\\pi\\,\\text{cm}^3$"},{key:"C",text:"$36\\pi\\,\\text{cm}^3$"},{key:"D",text:"$12\\pi\\,\\text{cm}^3$"},{key:"E",text:"$108\\pi\\,\\text{cm}^3$"} ],
    answer: "C", solution: "$V=\\tfrac43\\pi(27)=36\\pi\\,\\text{cm}^3$." },

  { id: "esat-mk8-m-09", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $3^x=81$, then $x=$",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$3$"},{key:"C",text:"$4$"},{key:"D",text:"$27$"},{key:"E",text:"$9$"} ],
    answer: "C", solution: "$81=3^4\\Rightarrow x=4$." },

  { id: "esat-mk8-m-10", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Solve $2x^2=18$.",
    options: [ {key:"A",text:"$x=3$"},{key:"B",text:"$x=\\pm3$"},{key:"C",text:"$x=9$"},{key:"D",text:"$x=\\pm9$"},{key:"E",text:"$x=\\pm\\sqrt{18}$"} ],
    answer: "B", solution: "$x^2=9\\Rightarrow x=\\pm3$." },

  { id: "esat-mk8-m-11", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "What is $\\dfrac34$ of $200$?",
    options: [ {key:"A",text:"$120$"},{key:"B",text:"$140$"},{key:"C",text:"$150$"},{key:"D",text:"$160$"},{key:"E",text:"$75$"} ],
    answer: "C", solution: "$\\tfrac34\\times200=150$." },

  { id: "esat-mk8-m-12", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The gradient of the line through $(1,2)$ and $(5,10)$ is:",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$\\dfrac12$"},{key:"E",text:"$4$"} ],
    answer: "B", solution: "$\\dfrac{10-2}{5-1}=\\dfrac{8}{4}=2$." },

  { id: "esat-mk8-m-13", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "$p$ is proportional to $q^2$. If $q$ increases by $20\\%$, $p$ increases by:",
    options: [ {key:"A",text:"$20\\%$"},{key:"B",text:"$40\\%$"},{key:"C",text:"$44\\%$"},{key:"D",text:"$144\\%$"},{key:"E",text:"$21\\%$"} ],
    answer: "C", solution: "$p\\propto q^2$; new $p=(1.2)^2=1.44$ times, i.e. a $44\\%$ increase." },

  { id: "esat-mk8-m-14", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify $\\dfrac{6a^2b}{2ab}$.",
    options: [ {key:"A",text:"$3a$"},{key:"B",text:"$3ab$"},{key:"C",text:"$3b$"},{key:"D",text:"$3a^2$"},{key:"E",text:"$3$"} ],
    answer: "A", solution: "$\\dfrac{6}{2}=3$; $\\dfrac{a^2}{a}=a$; $\\dfrac{b}{b}=1$; result $3a$." },

  { id: "esat-mk8-m-15", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "Evaluate $\\cos 60^\\circ\\times\\tan 45^\\circ$.",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$1$"},{key:"C",text:"$\\dfrac{\\sqrt3}{2}$"},{key:"D",text:"$0$"},{key:"E",text:"$2$"} ],
    answer: "A", solution: "$\\tfrac12\\times1=\\tfrac12$." },

  { id: "esat-mk8-m-16", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A number $n$ satisfies $\\dfrac{n}{100}\\times250=40$. Find $n$.",
    options: [ {key:"A",text:"$10$"},{key:"B",text:"$14$"},{key:"C",text:"$16$"},{key:"D",text:"$20$"},{key:"E",text:"$25$"} ],
    answer: "C", solution: "$n=\\dfrac{40\\times100}{250}=16$." },

  { id: "esat-mk8-m-17", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Solve $\\log_{10}(x)=-2$.",
    options: [ {key:"A",text:"$x=0.01$"},{key:"B",text:"$x=0.1$"},{key:"C",text:"$x=-100$"},{key:"D",text:"$x=-20$"},{key:"E",text:"$x=100$"} ],
    answer: "A", solution: "$x=10^{-2}=0.01$." },

  { id: "esat-mk8-m-18", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Expand $(2x-3)^2$.",
    options: [ {key:"A",text:"$4x^2-9$"},{key:"B",text:"$4x^2-12x+9$"},{key:"C",text:"$4x^2+9$"},{key:"D",text:"$2x^2-12x+9$"},{key:"E",text:"$4x^2-6x+9$"} ],
    answer: "B", solution: "$(2x)^2-2(2x)(3)+3^2=4x^2-12x+9$." },

  { id: "esat-mk8-m-19", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A recipe uses sugar and flour in the ratio $2:5$. If $350\\,\\text{g}$ of flour is used, how much sugar is needed?",
    options: [ {key:"A",text:"$100\\,\\text{g}$"},{key:"B",text:"$120\\,\\text{g}$"},{key:"C",text:"$140\\,\\text{g}$"},{key:"D",text:"$175\\,\\text{g}$"},{key:"E",text:"$700\\,\\text{g}$"} ],
    answer: "C", solution: "Flour $5$ parts $=350\\,\\text{g}\\Rightarrow1$ part $=70$; sugar $2$ parts $=140\\,\\text{g}$." },

  { id: "esat-mk8-m-20", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Find $\\dfrac{dy}{dx}$ for $y=5x^2-3x+2$ at $x=2$.",
    options: [ {key:"A",text:"$7$"},{key:"B",text:"$14$"},{key:"C",text:"$17$"},{key:"D",text:"$20$"},{key:"E",text:"$10$"} ],
    answer: "C", solution: "$\\dfrac{dy}{dx}=10x-3$; at $x=2$: $20-3=17$." },

  { id: "esat-mk8-m-21", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Convert $0.75$ to a fraction in lowest terms.",
    options: [ {key:"A",text:"$\\dfrac34$"},{key:"B",text:"$\\dfrac{7}{5}$"},{key:"C",text:"$\\dfrac{3}{5}$"},{key:"D",text:"$\\dfrac{75}{10}$"},{key:"E",text:"$\\dfrac{2}{3}$"} ],
    answer: "A", solution: "$0.75=\\dfrac{75}{100}=\\dfrac34$." },

  { id: "esat-mk8-m-22", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The solution to $\\dfrac{2}{x}=\\dfrac{x}{8}$ (with $x>0$) is:",
    options: [ {key:"A",text:"$x=2$"},{key:"B",text:"$x=4$"},{key:"C",text:"$x=8$"},{key:"D",text:"$x=16$"},{key:"E",text:"$x=\\sqrt{8}$"} ],
    answer: "B", solution: "Cross-multiply: $x^2=16\\Rightarrow x=4$ (positive root)." },

  { id: "esat-mk8-m-23", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The mean of $x, 2x, 3x$ is $12$. Find $x$.",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$4$"},{key:"C",text:"$6$"},{key:"D",text:"$8$"},{key:"E",text:"$12$"} ],
    answer: "C", solution: "Mean $=\\dfrac{x+2x+3x}{3}=2x=12\\Rightarrow x=6$." },

  { id: "esat-mk8-m-24", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A car travels $60\\,\\text{km}$ at $40\\,\\text{km/h}$. The time taken is:",
    options: [ {key:"A",text:"$1.0\\,\\text{h}$"},{key:"B",text:"$1.5\\,\\text{h}$"},{key:"C",text:"$2.0\\,\\text{h}$"},{key:"D",text:"$0.67\\,\\text{h}$"},{key:"E",text:"$2.4\\,\\text{h}$"} ],
    answer: "B", solution: "$t=\\dfrac{d}{v}=\\dfrac{60}{40}=1.5\\,\\text{h}$." },

  { id: "esat-mk8-m-25", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Given $\\dfrac{1}{a}+\\dfrac{1}{b}=\\dfrac{1}{2}$ and $a=6$, find $b$.",
    options: [ {key:"A",text:"$2$"},{key:"B",text:"$3$"},{key:"C",text:"$4$"},{key:"D",text:"$6$"},{key:"E",text:"$12$"} ],
    answer: "B", solution: "$\\dfrac1b=\\dfrac12-\\dfrac16=\\dfrac{3-1}{6}=\\dfrac{2}{6}=\\dfrac13\\Rightarrow b=3$." },

  { id: "esat-mk8-m-26", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A bag has $3$ red and $2$ blue balls. One ball is drawn at random. The probability it is red is:",
    options: [ {key:"A",text:"$\\dfrac25$"},{key:"B",text:"$\\dfrac35$"},{key:"C",text:"$\\dfrac13$"},{key:"D",text:"$\\dfrac23$"},{key:"E",text:"$\\dfrac12$"} ],
    answer: "B", solution: "$P(\\text{red})=\\dfrac{3}{5}$." },

  { id: "esat-mk8-m-27", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $y=kx$ and $y=15$ when $x=3$, find $y$ when $x=7$.",
    options: [ {key:"A",text:"$21$"},{key:"B",text:"$28$"},{key:"C",text:"$35$"},{key:"D",text:"$45$"},{key:"E",text:"$5$"} ],
    answer: "C", solution: "$k=\\dfrac{15}{3}=5$; $y=5\\times7=35$." },
];

// ── 模块二：化学（对标 NSAA）——27 题 / 40 分钟 ──────────────────────────────
// 相对原子质量：H=1, C=12, N=14, O=16, Na=23, S=32, Cl=35.5, Ca=40。
export const ESAT_MK8_CHEM: MCQQuestion[] = [
  { id: "esat-mk8-c-01", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 1, marks: 1,
    question: "How many protons are in an atom of $^{23}_{11}\\text{Na}$?",
    options: [ {key:"A",text:"$11$"},{key:"B",text:"$12$"},{key:"C",text:"$23$"},{key:"D",text:"$34$"},{key:"E",text:"$1$"} ],
    answer: "A", solution: "The atomic number (bottom) is the number of protons: $11$." },

  { id: "esat-mk8-c-02", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 1, marks: 1,
    question: "How many neutrons are in an atom of $^{23}_{11}\\text{Na}$?",
    options: [ {key:"A",text:"$11$"},{key:"B",text:"$12$"},{key:"C",text:"$23$"},{key:"D",text:"$34$"},{key:"E",text:"$1$"} ],
    answer: "B", solution: "Neutrons $=$ mass number $-$ protons $=23-11=12$." },

  { id: "esat-mk8-c-03", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "The relative formula mass ($M_r$) of $\\text{CaCO}_3$ is: (Ca=40, C=12, O=16)",
    options: [ {key:"A",text:"$68$"},{key:"B",text:"$82$"},{key:"C",text:"$100$"},{key:"D",text:"$116$"},{key:"E",text:"$56$"} ],
    answer: "C", solution: "$40+12+3(16)=40+12+48=100$." },

  { id: "esat-mk8-c-04", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "How many moles are in $36\\,\\text{g}$ of water, $\\text{H}_2\\text{O}$? ($M_r=18$)",
    options: [ {key:"A",text:"$1\\,\\text{mol}$"},{key:"B",text:"$2\\,\\text{mol}$"},{key:"C",text:"$0.5\\,\\text{mol}$"},{key:"D",text:"$18\\,\\text{mol}$"},{key:"E",text:"$36\\,\\text{mol}$"} ],
    answer: "B", solution: "$n=\\dfrac{m}{M_r}=\\dfrac{36}{18}=2\\,\\text{mol}$." },

  { id: "esat-mk8-c-05", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "What is the mass of $0.25\\,\\text{mol}$ of $\\text{CO}_2$? ($M_r=44$)",
    options: [ {key:"A",text:"$11\\,\\text{g}$"},{key:"B",text:"$22\\,\\text{g}$"},{key:"C",text:"$44\\,\\text{g}$"},{key:"D",text:"$88\\,\\text{g}$"},{key:"E",text:"$176\\,\\text{g}$"} ],
    answer: "A", solution: "$m=n\\times M_r=0.25\\times44=11\\,\\text{g}$." },

  { id: "esat-mk8-c-06", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Balance: $\\text{__ H}_2+\\text{O}_2\\rightarrow\\text{__ H}_2\\text{O}$. The coefficients (in order) are:",
    options: [ {key:"A",text:"$1,1$"},{key:"B",text:"$2,2$"},{key:"C",text:"$2,1\\to2$ i.e. $2,2$"},{key:"D",text:"$1,2$"},{key:"E",text:"$2,3$"} ],
    answer: "C", solution: "$2\\text{H}_2+\\text{O}_2\\rightarrow2\\text{H}_2\\text{O}$; the H$_2$ and H$_2$O coefficients are both $2$." },

  { id: "esat-mk8-c-07", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "In $2\\text{H}_2+\\text{O}_2\\rightarrow2\\text{H}_2\\text{O}$, how many moles of water form from $4\\,\\text{mol}$ of $\\text{H}_2$ (with excess $\\text{O}_2$)?",
    options: [ {key:"A",text:"$2\\,\\text{mol}$"},{key:"B",text:"$4\\,\\text{mol}$"},{key:"C",text:"$8\\,\\text{mol}$"},{key:"D",text:"$1\\,\\text{mol}$"},{key:"E",text:"$16\\,\\text{mol}$"} ],
    answer: "B", solution: "Ratio H$_2$:H$_2$O $=2:2=1:1$, so $4\\,\\text{mol}$ H$_2$ gives $4\\,\\text{mol}$ H$_2$O." },

  { id: "esat-mk8-c-08", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 3, marks: 1,
    question: "A compound contains $40\\%$ C, $6.7\\%$ H and $53.3\\%$ O by mass. Its empirical formula is: (C=12, H=1, O=16)",
    options: [ {key:"A",text:"$\\text{CH}_2\\text{O}$"},{key:"B",text:"$\\text{C}_2\\text{H}_4\\text{O}$"},{key:"C",text:"$\\text{CHO}$"},{key:"D",text:"$\\text{CH}_4\\text{O}$"},{key:"E",text:"$\\text{C}_2\\text{H}_6\\text{O}$"} ],
    answer: "A", solution: "Moles: C $=40/12=3.33$, H $=6.7/1=6.7$, O $=53.3/16=3.33$; ratio $1:2:1\\Rightarrow\\text{CH}_2\\text{O}$." },

  { id: "esat-mk8-c-09", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "What volume does $0.5\\,\\text{mol}$ of a gas occupy at room temperature and pressure? (molar gas volume $=24\\,\\text{dm}^3/\\text{mol}$)",
    options: [ {key:"A",text:"$6\\,\\text{dm}^3$"},{key:"B",text:"$12\\,\\text{dm}^3$"},{key:"C",text:"$24\\,\\text{dm}^3$"},{key:"D",text:"$48\\,\\text{dm}^3$"},{key:"E",text:"$0.5\\,\\text{dm}^3$"} ],
    answer: "B", solution: "$V=n\\times24=0.5\\times24=12\\,\\text{dm}^3$." },

  { id: "esat-mk8-c-10", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "The concentration of a solution containing $0.2\\,\\text{mol}$ in $500\\,\\text{cm}^3$ is:",
    options: [ {key:"A",text:"$0.1\\,\\text{mol/dm}^3$"},{key:"B",text:"$0.4\\,\\text{mol/dm}^3$"},{key:"C",text:"$0.2\\,\\text{mol/dm}^3$"},{key:"D",text:"$2.0\\,\\text{mol/dm}^3$"},{key:"E",text:"$4.0\\,\\text{mol/dm}^3$"} ],
    answer: "B", solution: "$500\\,\\text{cm}^3=0.5\\,\\text{dm}^3$; $c=\\dfrac{0.2}{0.5}=0.4\\,\\text{mol/dm}^3$." },

  { id: "esat-mk8-c-11", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "Which type of bonding holds sodium chloride ($\\text{NaCl}$) together?",
    options: [ {key:"A",text:"ionic"},{key:"B",text:"covalent"},{key:"C",text:"metallic"},{key:"D",text:"hydrogen"},{key:"E",text:"none"} ],
    answer: "A", solution: "NaCl is formed from a metal and a non-metal by transfer of electrons — ionic bonding." },

  { id: "esat-mk8-c-12", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "How many covalent bonds does a carbon atom typically form?",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$6$"} ],
    answer: "D", solution: "Carbon has $4$ outer electrons and forms $4$ covalent bonds." },

  { id: "esat-mk8-c-13", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "A solution with $\\text{pH}=1$ is:",
    options: [ {key:"A",text:"strongly acidic"},{key:"B",text:"weakly acidic"},{key:"C",text:"neutral"},{key:"D",text:"weakly alkaline"},{key:"E",text:"strongly alkaline"} ],
    answer: "A", solution: "pH $1$ is very low, so the solution is strongly acidic." },

  { id: "esat-mk8-c-14", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Which of these is a product when an acid reacts with a metal carbonate?",
    options: [ {key:"A",text:"hydrogen only"},{key:"B",text:"carbon dioxide"},{key:"C",text:"oxygen"},{key:"D",text:"ammonia"},{key:"E",text:"chlorine"} ],
    answer: "B", solution: "Acid + carbonate $\\rightarrow$ salt + water + carbon dioxide." },

  { id: "esat-mk8-c-15", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "What mass of $\\text{CaO}$ is produced when $50\\,\\text{g}$ of $\\text{CaCO}_3$ decomposes completely? $\\text{CaCO}_3\\rightarrow\\text{CaO}+\\text{CO}_2$ ($M_r$: CaCO$_3$=100, CaO=56)",
    options: [ {key:"A",text:"$22\\,\\text{g}$"},{key:"B",text:"$28\\,\\text{g}$"},{key:"C",text:"$44\\,\\text{g}$"},{key:"D",text:"$56\\,\\text{g}$"},{key:"E",text:"$50\\,\\text{g}$"} ],
    answer: "B", solution: "$n(\\text{CaCO}_3)=\\dfrac{50}{100}=0.5\\,\\text{mol}$; $1:1$ gives $0.5\\,\\text{mol}$ CaO $=0.5\\times56=28\\,\\text{g}$." },

  { id: "esat-mk8-c-16", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Which change would increase the rate of a reaction between a solid and a solution?",
    options: [ {key:"A",text:"using larger lumps of solid"},{key:"B",text:"lowering the temperature"},{key:"C",text:"decreasing the concentration"},{key:"D",text:"grinding the solid into powder"},{key:"E",text:"cooling the solution"} ],
    answer: "D", solution: "Powder has a larger surface area, increasing the frequency of collisions and hence the rate." },

  { id: "esat-mk8-c-17", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "A reaction that releases heat to the surroundings is described as:",
    options: [ {key:"A",text:"endothermic"},{key:"B",text:"exothermic"},{key:"C",text:"reversible"},{key:"D",text:"neutral"},{key:"E",text:"catalytic"} ],
    answer: "B", solution: "Reactions that release heat are exothermic (temperature of surroundings rises)." },

  { id: "esat-mk8-c-18", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "The electronic configuration of a chlorine atom (17 electrons) is:",
    options: [ {key:"A",text:"$2,8,7$"},{key:"B",text:"$2,8,8$"},{key:"C",text:"$2,7,8$"},{key:"D",text:"$8,8,1$"},{key:"E",text:"$2,8,7,0$"} ],
    answer: "A", solution: "$17=2+8+7$, giving $2,8,7$." },

  { id: "esat-mk8-c-19", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 1, marks: 1,
    question: "Elements in the same group of the periodic table have the same number of:",
    options: [ {key:"A",text:"protons"},{key:"B",text:"neutrons"},{key:"C",text:"outer-shell electrons"},{key:"D",text:"occupied shells"},{key:"E",text:"isotopes"} ],
    answer: "C", solution: "Group number corresponds to the number of outer-shell (valence) electrons." },

  { id: "esat-mk8-c-20", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 3, marks: 1,
    question: "During the electrolysis of molten sodium chloride, sodium is formed at the cathode because sodium ions are:",
    options: [ {key:"A",text:"negatively charged and gain electrons"},{key:"B",text:"positively charged and gain electrons"},{key:"C",text:"positively charged and lose electrons"},{key:"D",text:"neutral"},{key:"E",text:"attracted to the anode"} ],
    answer: "B", solution: "Na$^+$ ions are positive, move to the negative cathode, and are reduced (gain electrons) to form Na." },

  { id: "esat-mk8-c-21", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "What volume of $2.0\\,\\text{mol/dm}^3$ HCl contains $0.1\\,\\text{mol}$ of HCl?",
    options: [ {key:"A",text:"$20\\,\\text{cm}^3$"},{key:"B",text:"$50\\,\\text{cm}^3$"},{key:"C",text:"$100\\,\\text{cm}^3$"},{key:"D",text:"$200\\,\\text{cm}^3$"},{key:"E",text:"$5\\,\\text{cm}^3$"} ],
    answer: "B", solution: "$V=\\dfrac{n}{c}=\\dfrac{0.1}{2.0}=0.05\\,\\text{dm}^3=50\\,\\text{cm}^3$." },

  { id: "esat-mk8-c-22", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "Which particle has no overall electric charge?",
    options: [ {key:"A",text:"proton"},{key:"B",text:"electron"},{key:"C",text:"neutron"},{key:"D",text:"$\\text{Na}^+$ ion"},{key:"E",text:"$\\text{Cl}^-$ ion"} ],
    answer: "C", solution: "A neutron is electrically neutral." },

  { id: "esat-mk8-c-23", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Adding a catalyst to a reaction:",
    options: [ {key:"A",text:"increases the rate and is used up"},{key:"B",text:"increases the rate without being used up"},{key:"C",text:"decreases the rate"},{key:"D",text:"changes the products"},{key:"E",text:"increases the yield"} ],
    answer: "B", solution: "A catalyst speeds up a reaction by providing a lower-energy pathway and is not consumed overall." },

  { id: "esat-mk8-c-24", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "How many molecules are in $0.5\\,\\text{mol}$ of a gas? (Avogadro constant $=6.0\\times10^{23}/\\text{mol}$)",
    options: [ {key:"A",text:"$3.0\\times10^{23}$"},{key:"B",text:"$6.0\\times10^{23}$"},{key:"C",text:"$1.2\\times10^{24}$"},{key:"D",text:"$3.0\\times10^{24}$"},{key:"E",text:"$0.5\\times10^{23}$"} ],
    answer: "A", solution: "$0.5\\times6.0\\times10^{23}=3.0\\times10^{23}$ molecules." },

  { id: "esat-mk8-c-25", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "In the reaction $\\text{Zn}+\\text{CuSO}_4\\rightarrow\\text{ZnSO}_4+\\text{Cu}$, zinc is:",
    options: [ {key:"A",text:"reduced"},{key:"B",text:"oxidised"},{key:"C",text:"a catalyst"},{key:"D",text:"unchanged"},{key:"E",text:"the solvent"} ],
    answer: "B", solution: "Zn loses electrons to form Zn$^{2+}$, so it is oxidised (it displaces the less reactive copper)." },

  { id: "esat-mk8-c-26", type: "mcq", testId: "esat", topicId: "esat-chem1", difficulty: 2, marks: 1,
    question: "The percentage by mass of oxygen in water, $\\text{H}_2\\text{O}$, is: ($M_r=18$)",
    options: [ {key:"A",text:"$11\\%$"},{key:"B",text:"$50\\%$"},{key:"C",text:"$78\\%$"},{key:"D",text:"$89\\%$"},{key:"E",text:"$16\\%$"} ],
    answer: "D", solution: "$\\dfrac{16}{18}\\times100\\approx89\\%$." },

  { id: "esat-mk8-c-27", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "The products of neutralising hydrochloric acid with sodium hydroxide are:",
    options: [ {key:"A",text:"a salt and water"},{key:"B",text:"a salt and hydrogen"},{key:"C",text:"water and carbon dioxide"},{key:"D",text:"hydrogen and oxygen"},{key:"E",text:"a salt only"} ],
    answer: "A", solution: "Acid + alkali $\\rightarrow$ salt + water: HCl + NaOH $\\rightarrow$ NaCl + H$_2$O." },
];
