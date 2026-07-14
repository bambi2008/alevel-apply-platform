// BMO Round 2 模拟卷 3（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M3_T1: MCQQuestion[] = [
  { id: "bmo-r2mk3-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $9$ is:",
    options: [{ key: "A", text: "$6$" },{ key: "B", text: "$9$" },{ key: "C", text: "$8$" },{ key: "D", text: "$3$" },{ key: "E", text: "$2$" }],
    answer: "A", solution: "$2^1..2^6=2,4,8,7,5,1$; order $=6$." },
  { id: "bmo-r2mk3-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $3^{1000}$ are (as a two-digit value):",
    options: [{ key: "A", text: "$1$" },{ key: "B", text: "$3$" },{ key: "C", text: "$49$" },{ key: "D", text: "$43$" },{ key: "E", text: "$2$" }],
    answer: "A", solution: "$\\mathrm{ord}_{100}(3)=20$, $1000\\equiv0$, so $3^{1000}\\equiv1$, i.e. $01$." },
  { id: "bmo-r2mk3-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $5^{30}$ is divided by $7$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$5$" },{ key: "C", text: "$1$" },{ key: "D", text: "$6$" },{ key: "E", text: "$0$" }],
    answer: "C", solution: "$\\mathrm{ord}_7(5)=6$, $30\\equiv0$, so $\\equiv1$." },
  { id: "bmo-r2mk3-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(1000)$ equals:",
    options: [{ key: "A", text: "$800$" },{ key: "B", text: "$500$" },{ key: "C", text: "$600$" },{ key: "D", text: "$401$" },{ key: "E", text: "$400$" }],
    answer: "E", solution: "$1000=2^3\\cdot5^3$, $\\varphi=1000\\cdot\\tfrac12\\cdot\\tfrac45=400$." },
  { id: "bmo-r2mk3-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $5^k\\mid200!$ is:",
    options: [{ key: "A", text: "$50$" },{ key: "B", text: "$40$" },{ key: "C", text: "$48$" },{ key: "D", text: "$51$" },{ key: "E", text: "$49$" }],
    answer: "E", solution: "$\\lfloor200/5\\rfloor+\\lfloor200/25\\rfloor+\\lfloor200/125\\rfloor=40+8+1=49$." }
];

export const BMO_R2M3_T2: MCQQuestion[] = [
  { id: "bmo-r2mk3-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=5$, then $x^2+\\tfrac1{x^2}$ equals:",
    options: [{ key: "A", text: "$25$" },{ key: "B", text: "$27$" },{ key: "C", text: "$21$" },{ key: "D", text: "$24$" },{ key: "E", text: "$23$" }],
    answer: "E", solution: "$x^2+\\tfrac1{x^2}=s^2-2=23$." },
  { id: "bmo-r2mk3-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1+2+3+\\cdots+100$ is:",
    options: [{ key: "A", text: "$5000$" },{ key: "B", text: "$5050$" },{ key: "C", text: "$5150$" },{ key: "D", text: "$5055$" },{ key: "E", text: "$4950$" }],
    answer: "B", solution: "$=\\tfrac{100\\cdot101}2=5050$." },
  { id: "bmo-r2mk3-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=3$ and $a_{n+1}=2a_n-1$, the value of $a_5$ is:",
    options: [{ key: "A", text: "$65$" },{ key: "B", text: "$17$" },{ key: "C", text: "$31$" },{ key: "D", text: "$33$" },{ key: "E", text: "$49$" }],
    answer: "D", solution: "$a_n=2^n+1$: $a_2=5,a_3=9,a_4=17,a_5=33$." },
  { id: "bmo-r2mk3-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^2+x+1=0$ is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$1$" },{ key: "C", text: "$4$" },{ key: "D", text: "$0$" },{ key: "E", text: "$2$" }],
    answer: "D", solution: "Discriminant $1-4=-3<0$; no real roots." },
  { id: "bmo-r2mk3-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1+3+5+\\cdots+29$ (first $15$ odd numbers) is:",
    options: [{ key: "A", text: "$196$" },{ key: "B", text: "$210$" },{ key: "C", text: "$240$" },{ key: "D", text: "$255$" },{ key: "E", text: "$225$" }],
    answer: "E", solution: "Sum of first $n$ odds $=n^2=225$." }
];

export const BMO_R2M3_T3: MCQQuestion[] = [
  { id: "bmo-r2mk3-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $5$ and $12$. Its hypotenuse is:",
    options: [{ key: "A", text: "$11$" },{ key: "B", text: "$13$" },{ key: "C", text: "$14$" },{ key: "D", text: "$15$" },{ key: "E", text: "$17$" }],
    answer: "B", solution: "$\\sqrt{25+144}=13$." },
  { id: "bmo-r2mk3-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $5$–$12$–$13$ right triangle, the area is:",
    options: [{ key: "A", text: "$31$" },{ key: "B", text: "$32.5$" },{ key: "C", text: "$26$" },{ key: "D", text: "$30$" },{ key: "E", text: "$60$" }],
    answer: "D", solution: "$\\tfrac12\\cdot5\\cdot12=30$." },
  { id: "bmo-r2mk3-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $5$–$12$–$13$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$2.5$" },{ key: "C", text: "$4$" },{ key: "D", text: "$2$" },{ key: "E", text: "$1$" }],
    answer: "D", solution: "$r=\\text{Area}/s=30/15=2$." },
  { id: "bmo-r2mk3-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $5$–$12$–$13$ right triangle, twice the circumradius equals:",
    options: [{ key: "A", text: "$13$" },{ key: "B", text: "$26$" },{ key: "C", text: "$6$" },{ key: "D", text: "$12$" },{ key: "E", text: "$14$" }],
    answer: "A", solution: "Circumradius $=$ hypotenuse$/2$, so $2R=13$." },
  { id: "bmo-r2mk3-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "Place it as $A(0,0),B(12,0),C(0,5)$. Then $3G_x$ (thrice the centroid $x$-coordinate) equals:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$13$" },{ key: "C", text: "$16$" },{ key: "D", text: "$8$" },{ key: "E", text: "$4$" }],
    answer: "A", solution: "$G_x=(0+12+0)/3=4$, so $3G_x=12$." }
];

export const BMO_R2M3_T4: MCQQuestion[] = [
  { id: "bmo-r2mk3-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times5$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$5$" },{ key: "C", text: "$13$" },{ key: "D", text: "$9$" },{ key: "E", text: "$8$" }],
    answer: "E", solution: "Fibonacci-type: $T_5=8$." },
  { id: "bmo-r2mk3-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{8}{3}$ equals:",
    options: [{ key: "A", text: "$57$" },{ key: "B", text: "$28$" },{ key: "C", text: "$70$" },{ key: "D", text: "$64$" },{ key: "E", text: "$56$" }],
    answer: "E", solution: "$\\binom83=56$." },
  { id: "bmo-r2mk3-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of subsets of $\\{1,\\dots,6\\}$ with even element-sum is:",
    options: [{ key: "A", text: "$33$" },{ key: "B", text: "$30$" },{ key: "C", text: "$32$" },{ key: "D", text: "$31$" },{ key: "E", text: "$64$" }],
    answer: "C", solution: "Even- and odd-sum subsets are equal in number $=2^5=32$." },
  { id: "bmo-r2mk3-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least number of integers to choose from $\\{1,\\dots,30\\}$ to guarantee two where one divides the other is:",
    options: [{ key: "A", text: "$11$" },{ key: "B", text: "$16$" },{ key: "C", text: "$15$" },{ key: "D", text: "$20$" },{ key: "E", text: "$17$" }],
    answer: "B", solution: "Odd-part pigeonhole: $15$ odd parts, so $16$ forces a divisor pair." },
  { id: "bmo-r2mk3-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The least number of integers needed to guarantee two are congruent modulo $7$ is:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$7$" },{ key: "C", text: "$14$" },{ key: "D", text: "$6$" },{ key: "E", text: "$8$" }],
    answer: "E", solution: "Pigeonhole with $7$ residues: $7+1=8$." }
];
