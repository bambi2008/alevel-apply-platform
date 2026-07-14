// BMO Round 2 模拟卷 6（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M6_T1: MCQQuestion[] = [
  { id: "bmo-r2mk6-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $13$ is:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$4$" },{ key: "C", text: "$13$" },{ key: "D", text: "$3$" },{ key: "E", text: "$6$" }],
    answer: "A", solution: "$2^{12}\\equiv1\\pmod{13}$ and no smaller; order $=12$." },
  { id: "bmo-r2mk6-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $3^{999}$ are:",
    options: [{ key: "A", text: "$68$" },{ key: "B", text: "$27$" },{ key: "C", text: "$87$" },{ key: "D", text: "$67$" },{ key: "E", text: "$47$" }],
    answer: "D", solution: "$\\mathrm{ord}_{100}(3)=20$, $999\\equiv19$, $3^{19}\\equiv67\\pmod{100}$." },
  { id: "bmo-r2mk6-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $2^{100}$ is divided by $5$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$3$" },{ key: "C", text: "$0$" },{ key: "D", text: "$1$" },{ key: "E", text: "$4$" }],
    answer: "D", solution: "$\\mathrm{ord}_5(2)=4$, $100\\equiv0$, so $\\equiv1$." },
  { id: "bmo-r2mk6-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(1024)$ equals:",
    options: [{ key: "A", text: "$513$" },{ key: "B", text: "$256$" },{ key: "C", text: "$1023$" },{ key: "D", text: "$500$" },{ key: "E", text: "$512$" }],
    answer: "E", solution: "$1024=2^{10}$, $\\varphi=2^9=512$." },
  { id: "bmo-r2mk6-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $3^k\\mid50!$ is:",
    options: [{ key: "A", text: "$16$" },{ key: "B", text: "$23$" },{ key: "C", text: "$25$" },{ key: "D", text: "$22$" },{ key: "E", text: "$20$" }],
    answer: "D", solution: "$16+5+1=22$." }
];

export const BMO_R2M6_T2: MCQQuestion[] = [
  { id: "bmo-r2mk6-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "If $x+\\tfrac1x=3$, then $x^5+\\tfrac1{x^5}$ equals:",
    options: [{ key: "A", text: "$141$" },{ key: "B", text: "$110$" },{ key: "C", text: "$47$" },{ key: "D", text: "$124$" },{ key: "E", text: "$123$" }],
    answer: "E", solution: "$p_5=s p_4-p_3=3\\cdot47-18=123$." },
  { id: "bmo-r2mk6-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1^3+2^3+\\cdots+9^3$ is:",
    options: [{ key: "A", text: "$2026$" },{ key: "B", text: "$2016$" },{ key: "C", text: "$2025$" },{ key: "D", text: "$3025$" },{ key: "E", text: "$1296$" }],
    answer: "C", solution: "$=\\left(\\tfrac{9\\cdot10}2\\right)^2=45^2=2025$." },
  { id: "bmo-r2mk6-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=2$ and $a_{n+1}=a_n^2-1$, the value of $a_4$ is:",
    options: [{ key: "A", text: "$63$" },{ key: "B", text: "$255$" },{ key: "C", text: "$8$" },{ key: "D", text: "$64$" },{ key: "E", text: "$48$" }],
    answer: "A", solution: "$a_2=3,a_3=8,a_4=63$." },
  { id: "bmo-r2mk6-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^2-x+1=0$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$4$" },{ key: "C", text: "$0$" },{ key: "D", text: "$1$" },{ key: "E", text: "$3$" }],
    answer: "C", solution: "Discriminant $1-4=-3<0$; no real roots." },
  { id: "bmo-r2mk6-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "For positive reals with $a+b+c=12$, the minimum of $a^2+b^2+c^2$ is:",
    options: [{ key: "A", text: "$36$" },{ key: "B", text: "$49$" },{ key: "C", text: "$24$" },{ key: "D", text: "$144$" },{ key: "E", text: "$48$" }],
    answer: "E", solution: "$\\ge\\tfrac{(a+b+c)^2}3=48$, at $a=b=c=4$." }
];

export const BMO_R2M6_T3: MCQQuestion[] = [
  { id: "bmo-r2mk6-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $9$ and $40$. Its hypotenuse is:",
    options: [{ key: "A", text: "$39$" },{ key: "B", text: "$49$" },{ key: "C", text: "$40$" },{ key: "D", text: "$42$" },{ key: "E", text: "$41$" }],
    answer: "E", solution: "$\\sqrt{81+1600}=41$." },
  { id: "bmo-r2mk6-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $9$–$40$–$41$ right triangle, the perimeter is:",
    options: [{ key: "A", text: "$90$" },{ key: "B", text: "$92$" },{ key: "C", text: "$88$" },{ key: "D", text: "$91$" },{ key: "E", text: "$82$" }],
    answer: "A", solution: "$9+40+41=90$." },
  { id: "bmo-r2mk6-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $9$–$40$–$41$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$8$" },{ key: "B", text: "$4$" },{ key: "C", text: "$6$" },{ key: "D", text: "$5$" },{ key: "E", text: "$3$" }],
    answer: "B", solution: "$r=\\text{Area}/s=180/45=4$." },
  { id: "bmo-r2mk6-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $9$–$40$–$41$ right triangle, the area is:",
    options: [{ key: "A", text: "$164$" },{ key: "B", text: "$196$" },{ key: "C", text: "$360$" },{ key: "D", text: "$181$" },{ key: "E", text: "$180$" }],
    answer: "E", solution: "$\\tfrac12\\cdot9\\cdot40=180$." },
  { id: "bmo-r2mk6-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $9$–$40$–$41$ right triangle, twice the median to the hypotenuse equals:",
    options: [{ key: "A", text: "$42$" },{ key: "B", text: "$20$" },{ key: "C", text: "$82$" },{ key: "D", text: "$40$" },{ key: "E", text: "$41$" }],
    answer: "E", solution: "Median to hypotenuse $=$ hyp$/2$, so twice it $=41$." }
];

export const BMO_R2M6_T4: MCQQuestion[] = [
  { id: "bmo-r2mk6-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times9$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$56$" },{ key: "B", text: "$21$" },{ key: "C", text: "$34$" },{ key: "D", text: "$89$" },{ key: "E", text: "$55$" }],
    answer: "E", solution: "Fibonacci-type: $T_9=55$." },
  { id: "bmo-r2mk6-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{11}{3}$ equals:",
    options: [{ key: "A", text: "$120$" },{ key: "B", text: "$166$" },{ key: "C", text: "$165$" },{ key: "D", text: "$286$" },{ key: "E", text: "$220$" }],
    answer: "C", solution: "$\\binom{11}3=165$." },
  { id: "bmo-r2mk6-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of subsets of $\\{1,\\dots,10\\}$ is:",
    options: [{ key: "A", text: "$2048$" },{ key: "B", text: "$512$" },{ key: "C", text: "$1025$" },{ key: "D", text: "$1024$" },{ key: "E", text: "$1000$" }],
    answer: "D", solution: "$2^{10}=1024$." },
  { id: "bmo-r2mk6-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of handshakes among $12$ people (everyone with everyone) is:",
    options: [{ key: "A", text: "$144$" },{ key: "B", text: "$66$" },{ key: "C", text: "$132$" },{ key: "D", text: "$67$" },{ key: "E", text: "$72$" }],
    answer: "B", solution: "$\\binom{12}2=66$." },
  { id: "bmo-r2mk6-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least $n$ such that every $2$-colouring of the edges of $K_n$ has a monochromatic triangle is:",
    options: [{ key: "A", text: "$6$" },{ key: "B", text: "$8$" },{ key: "C", text: "$5$" },{ key: "D", text: "$7$" },{ key: "E", text: "$9$" }],
    answer: "A", solution: "$R(3,3)=6$." }
];
