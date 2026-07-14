// BMO Round 2 模拟卷 5（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M5_T1: MCQQuestion[] = [
  { id: "bmo-r2mk5-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $17$ is:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$8$" },{ key: "C", text: "$16$" },{ key: "D", text: "$2$" },{ key: "E", text: "$4$" }],
    answer: "B", solution: "$2^8=256\\equiv1\\pmod{17}$; order $=8$." },
  { id: "bmo-r2mk5-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $7^{100}$ are (as a two-digit value):",
    options: [{ key: "A", text: "$7$" },{ key: "B", text: "$43$" },{ key: "C", text: "$49$" },{ key: "D", text: "$51$" },{ key: "E", text: "$1$" }],
    answer: "E", solution: "$\\mathrm{ord}_{100}(7)=4$, $100\\equiv0$, so $\\equiv1$, i.e. $01$." },
  { id: "bmo-r2mk5-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $3^{50}$ is divided by $11$ is:",
    options: [{ key: "A", text: "$5$" },{ key: "B", text: "$2$" },{ key: "C", text: "$9$" },{ key: "D", text: "$1$" },{ key: "E", text: "$3$" }],
    answer: "D", solution: "$\\mathrm{ord}_{11}(3)=5$, $50\\equiv0$, so $\\equiv1$." },
  { id: "bmo-r2mk5-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(2025)$ equals:",
    options: [{ key: "A", text: "$810$" },{ key: "B", text: "$1080$" },{ key: "C", text: "$900$" },{ key: "D", text: "$1081$" },{ key: "E", text: "$1350$" }],
    answer: "B", solution: "$2025=3^4\\cdot5^2$, $\\varphi=2025\\cdot\\tfrac23\\cdot\\tfrac45=1080$." },
  { id: "bmo-r2mk5-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $7^k\\mid100!$ is:",
    options: [{ key: "A", text: "$14$" },{ key: "B", text: "$17$" },{ key: "C", text: "$20$" },{ key: "D", text: "$15$" },{ key: "E", text: "$16$" }],
    answer: "E", solution: "$\\lfloor100/7\\rfloor+\\lfloor100/49\\rfloor=14+2=16$." }
];

export const BMO_R2M5_T2: MCQQuestion[] = [
  { id: "bmo-r2mk5-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=7$, then $x^2+\\tfrac1{x^2}$ equals:",
    options: [{ key: "A", text: "$45$" },{ key: "B", text: "$51$" },{ key: "C", text: "$48$" },{ key: "D", text: "$49$" },{ key: "E", text: "$47$" }],
    answer: "E", solution: "$s^2-2=47$." },
  { id: "bmo-r2mk5-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1^2+2^2+\\cdots+10^2$ is:",
    options: [{ key: "A", text: "$386$" },{ key: "B", text: "$485$" },{ key: "C", text: "$385$" },{ key: "D", text: "$405$" },{ key: "E", text: "$285$" }],
    answer: "C", solution: "$=\\tfrac{10\\cdot11\\cdot21}6=385$." },
  { id: "bmo-r2mk5-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=1$ and $a_{n+1}=2a_n+3$, the value of $a_4$ is:",
    options: [{ key: "A", text: "$29$" },{ key: "B", text: "$30$" },{ key: "C", text: "$45$" },{ key: "D", text: "$13$" },{ key: "E", text: "$61$" }],
    answer: "A", solution: "$a_n=2^{n+1}-3$: $a_2=5,a_3=13,a_4=29$." },
  { id: "bmo-r2mk5-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^4+1=0$ is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$0$" },{ key: "C", text: "$1$" },{ key: "D", text: "$2$" },{ key: "E", text: "$4$" }],
    answer: "B", solution: "$x^4\\ge0$ so $x^4+1\\ge1>0$; no real roots." },
  { id: "bmo-r2mk5-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1+2+4+8+\\cdots+2^9$ is:",
    options: [{ key: "A", text: "$2047$" },{ key: "B", text: "$1022$" },{ key: "C", text: "$1023$" },{ key: "D", text: "$1024$" },{ key: "E", text: "$512$" }],
    answer: "C", solution: "Geometric sum $=2^{10}-1=1023$." }
];

export const BMO_R2M5_T3: MCQQuestion[] = [
  { id: "bmo-r2mk5-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $7$ and $24$. Its hypotenuse is:",
    options: [{ key: "A", text: "$26$" },{ key: "B", text: "$25$" },{ key: "C", text: "$28$" },{ key: "D", text: "$24$" },{ key: "E", text: "$23$" }],
    answer: "B", solution: "$\\sqrt{49+576}=25$." },
  { id: "bmo-r2mk5-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $7$–$24$–$25$ right triangle, the area is:",
    options: [{ key: "A", text: "$80$" },{ key: "B", text: "$88$" },{ key: "C", text: "$168$" },{ key: "D", text: "$84$" },{ key: "E", text: "$85$" }],
    answer: "D", solution: "$\\tfrac12\\cdot7\\cdot24=84$." },
  { id: "bmo-r2mk5-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $7$–$24$–$25$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$5$" },{ key: "C", text: "$4$" },{ key: "D", text: "$6$" },{ key: "E", text: "$3$" }],
    answer: "E", solution: "$r=\\text{Area}/s=84/28=3$." },
  { id: "bmo-r2mk5-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $7$–$24$–$25$ right triangle, twice the circumradius equals:",
    options: [{ key: "A", text: "$26$" },{ key: "B", text: "$50$" },{ key: "C", text: "$12$" },{ key: "D", text: "$24$" },{ key: "E", text: "$25$" }],
    answer: "E", solution: "$2R=$ hypotenuse $=25$." },
  { id: "bmo-r2mk5-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "Place it as $A(0,0),B(24,0),C(0,7)$. Then $3G_x$ equals:",
    options: [{ key: "A", text: "$8$" },{ key: "B", text: "$25$" },{ key: "C", text: "$7$" },{ key: "D", text: "$16$" },{ key: "E", text: "$24$" }],
    answer: "E", solution: "$G_x=(0+24+0)/3=8$, so $3G_x=24$." }
];

export const BMO_R2M5_T4: MCQQuestion[] = [
  { id: "bmo-r2mk5-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times8$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$21$" },{ key: "B", text: "$55$" },{ key: "C", text: "$35$" },{ key: "D", text: "$13$" },{ key: "E", text: "$34$" }],
    answer: "E", solution: "Fibonacci-type: $T_8=34$." },
  { id: "bmo-r2mk5-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{9}{3}$ equals:",
    options: [{ key: "A", text: "$72$" },{ key: "B", text: "$84$" },{ key: "C", text: "$126$" },{ key: "D", text: "$64$" },{ key: "E", text: "$85$" }],
    answer: "B", solution: "$\\binom93=84$." },
  { id: "bmo-r2mk5-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of subsets of $\\{1,\\dots,9\\}$ with even element-sum is:",
    options: [{ key: "A", text: "$128$" },{ key: "B", text: "$256$" },{ key: "C", text: "$257$" },{ key: "D", text: "$512$" },{ key: "E", text: "$255$" }],
    answer: "B", solution: "$=2^8=256$." },
  { id: "bmo-r2mk5-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least number of integers to choose from $\\{1,\\dots,40\\}$ to guarantee two where one divides the other is:",
    options: [{ key: "A", text: "$21$" },{ key: "B", text: "$16$" },{ key: "C", text: "$20$" },{ key: "D", text: "$26$" },{ key: "E", text: "$22$" }],
    answer: "A", solution: "Odd-part pigeonhole: $20$ odd parts, so $21$ forces a divisor pair." },
  { id: "bmo-r2mk5-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "Every sequence of $37$ distinct reals is guaranteed to contain a monotonic subsequence of length at least:",
    options: [{ key: "A", text: "$37$" },{ key: "B", text: "$7$" },{ key: "C", text: "$8$" },{ key: "D", text: "$6$" },{ key: "E", text: "$9$" }],
    answer: "B", solution: "$\\ge\\lceil\\sqrt{37}\\rceil=7$ (since $6^2=36<37$)." }
];
