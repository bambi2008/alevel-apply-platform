// BMO Round 2 模拟卷 7（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M7_T1: MCQQuestion[] = [
  { id: "bmo-r2mk7-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $19$ is:",
    options: [{ key: "A", text: "$19$" },{ key: "B", text: "$18$" },{ key: "C", text: "$6$" },{ key: "D", text: "$3$" },{ key: "E", text: "$9$" }],
    answer: "B", solution: "$2^{18}\\equiv1\\pmod{19}$ and no smaller; order $=18$." },
  { id: "bmo-r2mk7-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $3^{2024}$ are:",
    options: [{ key: "A", text: "$27$" },{ key: "B", text: "$29$" },{ key: "C", text: "$43$" },{ key: "D", text: "$82$" },{ key: "E", text: "$81$" }],
    answer: "E", solution: "$\\mathrm{ord}_{100}(3)=20$, $2024\\equiv4$, $3^4=81$." },
  { id: "bmo-r2mk7-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $5^{40}$ is divided by $13$ is:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$2$" },{ key: "C", text: "$8$" },{ key: "D", text: "$1$" },{ key: "E", text: "$5$" }],
    answer: "D", solution: "$\\mathrm{ord}_{13}(5)=4$, $40\\equiv0$, so $\\equiv1$." },
  { id: "bmo-r2mk7-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(500)$ equals:",
    options: [{ key: "A", text: "$400$" },{ key: "B", text: "$200$" },{ key: "C", text: "$100$" },{ key: "D", text: "$201$" },{ key: "E", text: "$250$" }],
    answer: "B", solution: "$500=2^2\\cdot5^3$, $\\varphi=500\\cdot\\tfrac12\\cdot\\tfrac45=200$." },
  { id: "bmo-r2mk7-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $2^k\\mid60!$ is:",
    options: [{ key: "A", text: "$30$" },{ key: "B", text: "$57$" },{ key: "C", text: "$52$" },{ key: "D", text: "$58$" },{ key: "E", text: "$56$" }],
    answer: "E", solution: "$30+15+7+3+1=56$." }
];

export const BMO_R2M7_T2: MCQQuestion[] = [
  { id: "bmo-r2mk7-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=4$, then $x^2+\\tfrac1{x^2}$ equals:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$18$" },{ key: "C", text: "$15$" },{ key: "D", text: "$16$" },{ key: "E", text: "$14$" }],
    answer: "E", solution: "$s^2-2=14$." },
  { id: "bmo-r2mk7-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1+2+\\cdots+12$ is:",
    options: [{ key: "A", text: "$79$" },{ key: "B", text: "$84$" },{ key: "C", text: "$78$" },{ key: "D", text: "$66$" },{ key: "E", text: "$72$" }],
    answer: "C", solution: "$\\tfrac{12\\cdot13}2=78$." },
  { id: "bmo-r2mk7-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=1$ and $a_{n+1}=2a_n+1$, the value of $a_6$ is:",
    options: [{ key: "A", text: "$63$" },{ key: "B", text: "$64$" },{ key: "C", text: "$45$" },{ key: "D", text: "$31$" },{ key: "E", text: "$127$" }],
    answer: "A", solution: "$a_n=2^n-1$: $a_6=63$." },
  { id: "bmo-r2mk7-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^2+4=0$ is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$0$" },{ key: "C", text: "$1$" },{ key: "D", text: "$2$" },{ key: "E", text: "$4$" }],
    answer: "B", solution: "$x^2\\ge0\\Rightarrow x^2+4\\ge4>0$; no real roots." },
  { id: "bmo-r2mk7-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1^2+2^2+\\cdots+7^2$ is:",
    options: [{ key: "A", text: "$168$" },{ key: "B", text: "$141$" },{ key: "C", text: "$140$" },{ key: "D", text: "$120$" },{ key: "E", text: "$196$" }],
    answer: "C", solution: "$=\\tfrac{7\\cdot8\\cdot15}6=140$." }
];

export const BMO_R2M7_T3: MCQQuestion[] = [
  { id: "bmo-r2mk7-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $20$ and $21$. Its hypotenuse is:",
    options: [{ key: "A", text: "$30$" },{ key: "B", text: "$29$" },{ key: "C", text: "$41$" },{ key: "D", text: "$31$" },{ key: "E", text: "$28$" }],
    answer: "B", solution: "$\\sqrt{400+441}=29$." },
  { id: "bmo-r2mk7-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $20$–$21$–$29$ right triangle, the area is:",
    options: [{ key: "A", text: "$200$" },{ key: "B", text: "$220$" },{ key: "C", text: "$420$" },{ key: "D", text: "$210$" },{ key: "E", text: "$211$" }],
    answer: "D", solution: "$\\tfrac12\\cdot20\\cdot21=210$." },
  { id: "bmo-r2mk7-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $20$–$21$–$29$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$5$" },{ key: "B", text: "$8$" },{ key: "C", text: "$7$" },{ key: "D", text: "$12$" },{ key: "E", text: "$6$" }],
    answer: "E", solution: "$r=\\text{Area}/s=210/35=6$." },
  { id: "bmo-r2mk7-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $20$–$21$–$29$ right triangle, twice the circumradius equals:",
    options: [{ key: "A", text: "$30$" },{ key: "B", text: "$58$" },{ key: "C", text: "$14$" },{ key: "D", text: "$28$" },{ key: "E", text: "$29$" }],
    answer: "E", solution: "$2R=$ hypotenuse $=29$." },
  { id: "bmo-r2mk7-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "Place it as $A(0,0),B(21,0),C(0,20)$. Then $3G_x$ equals:",
    options: [{ key: "A", text: "$7$" },{ key: "B", text: "$22$" },{ key: "C", text: "$20$" },{ key: "D", text: "$14$" },{ key: "E", text: "$21$" }],
    answer: "E", solution: "$G_x=(0+21+0)/3=7$, so $3G_x=21$." }
];

export const BMO_R2M7_T4: MCQQuestion[] = [
  { id: "bmo-r2mk7-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times10$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$55$" },{ key: "B", text: "$144$" },{ key: "C", text: "$90$" },{ key: "D", text: "$34$" },{ key: "E", text: "$89$" }],
    answer: "E", solution: "Fibonacci-type: $T_{10}=89$." },
  { id: "bmo-r2mk7-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{7}{2}$ equals:",
    options: [{ key: "A", text: "$14$" },{ key: "B", text: "$21$" },{ key: "C", text: "$28$" },{ key: "D", text: "$42$" },{ key: "E", text: "$22$" }],
    answer: "B", solution: "$\\binom72=21$." },
  { id: "bmo-r2mk7-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of subsets of $\\{1,\\dots,5\\}$ is:",
    options: [{ key: "A", text: "$64$" },{ key: "B", text: "$32$" },{ key: "C", text: "$33$" },{ key: "D", text: "$25$" },{ key: "E", text: "$16$" }],
    answer: "B", solution: "$2^5=32$." },
  { id: "bmo-r2mk7-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least number of integers to choose from $\\{1,\\dots,24\\}$ to guarantee two where one divides the other is:",
    options: [{ key: "A", text: "$13$" },{ key: "B", text: "$11$" },{ key: "C", text: "$12$" },{ key: "D", text: "$16$" },{ key: "E", text: "$14$" }],
    answer: "A", solution: "Odd-part pigeonhole: $12$ odd parts, so $13$ forces a divisor pair." },
  { id: "bmo-r2mk7-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least $n$ such that every $2$-colouring of $K_n$ has a monochromatic triangle is:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$6$" },{ key: "C", text: "$7$" },{ key: "D", text: "$5$" },{ key: "E", text: "$8$" }],
    answer: "B", solution: "$R(3,3)=6$." }
];
