// BMO Round 2 模拟卷 4（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M4_T1: MCQQuestion[] = [
  { id: "bmo-r2mk4-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $11$ is:",
    options: [{ key: "A", text: "$11$" },{ key: "B", text: "$9$" },{ key: "C", text: "$10$" },{ key: "D", text: "$5$" },{ key: "E", text: "$4$" }],
    answer: "C", solution: "$2^{10}\\equiv1\\pmod{11}$ and no smaller; order $=10$." },
  { id: "bmo-r2mk4-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $9^{2025}$ are (as a two-digit value):",
    options: [{ key: "A", text: "$81$" },{ key: "B", text: "$9$" },{ key: "C", text: "$50$" },{ key: "D", text: "$49$" },{ key: "E", text: "$29$" }],
    answer: "D", solution: "$\\mathrm{ord}_{100}(9)=10$, $2025\\equiv5$, $9^5\\equiv49\\pmod{100}$." },
  { id: "bmo-r2mk4-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $3^{100}$ is divided by $13$ is:",
    options: [{ key: "A", text: "$1$" },{ key: "B", text: "$3$" },{ key: "C", text: "$4$" },{ key: "D", text: "$2$" },{ key: "E", text: "$9$" }],
    answer: "B", solution: "$\\mathrm{ord}_{13}(3)=3$, $100\\equiv1$, so $\\equiv3$." },
  { id: "bmo-r2mk4-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(720)$ equals:",
    options: [{ key: "A", text: "$192$" },{ key: "B", text: "$240$" },{ key: "C", text: "$288$" },{ key: "D", text: "$193$" },{ key: "E", text: "$144$" }],
    answer: "A", solution: "$720=2^4\\cdot3^2\\cdot5$, $\\varphi=720\\cdot\\tfrac12\\cdot\\tfrac23\\cdot\\tfrac45=192$." },
  { id: "bmo-r2mk4-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $2^k\\mid50!$ is:",
    options: [{ key: "A", text: "$48$" },{ key: "B", text: "$44$" },{ key: "C", text: "$49$" },{ key: "D", text: "$47$" },{ key: "E", text: "$25$" }],
    answer: "D", solution: "$25+12+6+3+1=47$." }
];

export const BMO_R2M4_T2: MCQQuestion[] = [
  { id: "bmo-r2mk4-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=6$, then $x^3+\\tfrac1{x^3}$ equals:",
    options: [{ key: "A", text: "$216$" },{ key: "B", text: "$180$" },{ key: "C", text: "$199$" },{ key: "D", text: "$198$" },{ key: "E", text: "$210$" }],
    answer: "D", solution: "$s^3-3s=216-18=198$." },
  { id: "bmo-r2mk4-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1^3+2^3+\\cdots+8^3$ is:",
    options: [{ key: "A", text: "$2025$" },{ key: "B", text: "$204$" },{ key: "C", text: "$1297$" },{ key: "D", text: "$1296$" },{ key: "E", text: "$1024$" }],
    answer: "D", solution: "$=\\left(\\tfrac{8\\cdot9}2\\right)^2=36^2=1296$." },
  { id: "bmo-r2mk4-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=1$ and $a_{n+1}=3a_n+1$, the value of $a_4$ is:",
    options: [{ key: "A", text: "$121$" },{ key: "B", text: "$41$" },{ key: "C", text: "$40$" },{ key: "D", text: "$31$" },{ key: "E", text: "$13$" }],
    answer: "C", solution: "$a_2=4,a_3=13,a_4=40$." },
  { id: "bmo-r2mk4-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The value of $51\\cdot\\displaystyle\\sum_{k=1}^{50}\\frac1{k(k+1)}$ is:",
    options: [{ key: "A", text: "$50$" },{ key: "B", text: "$49$" },{ key: "C", text: "$25$" },{ key: "D", text: "$52$" },{ key: "E", text: "$51$" }],
    answer: "A", solution: "Telescoping $=\\tfrac{50}{51}$; times $51$ is $50$." },
  { id: "bmo-r2mk4-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "For positive reals with $a+b+c=9$, the minimum of $a^2+b^2+c^2$ is:",
    options: [{ key: "A", text: "$18$" },{ key: "B", text: "$27$" },{ key: "C", text: "$28$" },{ key: "D", text: "$81$" },{ key: "E", text: "$9$" }],
    answer: "B", solution: "$\\ge\\tfrac{(a+b+c)^2}3=27$, at $a=b=c=3$." }
];

export const BMO_R2M4_T3: MCQQuestion[] = [
  { id: "bmo-r2mk4-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $8$ and $15$. Its hypotenuse is:",
    options: [{ key: "A", text: "$23$" },{ key: "B", text: "$16$" },{ key: "C", text: "$19$" },{ key: "D", text: "$18$" },{ key: "E", text: "$17$" }],
    answer: "E", solution: "$\\sqrt{64+225}=17$." },
  { id: "bmo-r2mk4-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $8$–$15$–$17$ right triangle, the perimeter is:",
    options: [{ key: "A", text: "$41$" },{ key: "B", text: "$42$" },{ key: "C", text: "$38$" },{ key: "D", text: "$44$" },{ key: "E", text: "$40$" }],
    answer: "E", solution: "$8+15+17=40$." },
  { id: "bmo-r2mk4-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $8$–$15$–$17$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$3$" },{ key: "C", text: "$6$" },{ key: "D", text: "$4$" },{ key: "E", text: "$5$" }],
    answer: "B", solution: "$r=\\text{Area}/s=60/20=3$." },
  { id: "bmo-r2mk4-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $8$–$15$–$17$ right triangle, the area is:",
    options: [{ key: "A", text: "$52$" },{ key: "B", text: "$120$" },{ key: "C", text: "$68$" },{ key: "D", text: "$60$" },{ key: "E", text: "$61$" }],
    answer: "D", solution: "$\\tfrac12\\cdot8\\cdot15=60$." },
  { id: "bmo-r2mk4-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "For that $8$–$15$–$17$ right triangle, twice the median to the hypotenuse equals:",
    options: [{ key: "A", text: "$17$" },{ key: "B", text: "$18$" },{ key: "C", text: "$15$" },{ key: "D", text: "$8$" },{ key: "E", text: "$34$" }],
    answer: "A", solution: "Median to hypotenuse $=$ hypotenuse$/2$, so twice it $=17$." }
];

export const BMO_R2M4_T4: MCQQuestion[] = [
  { id: "bmo-r2mk4-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times7$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$34$" },{ key: "B", text: "$13$" },{ key: "C", text: "$18$" },{ key: "D", text: "$21$" },{ key: "E", text: "$22$" }],
    answer: "D", solution: "Fibonacci-type: $T_7=21$." },
  { id: "bmo-r2mk4-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{10}{4}$ equals:",
    options: [{ key: "A", text: "$211$" },{ key: "B", text: "$120$" },{ key: "C", text: "$252$" },{ key: "D", text: "$210$" },{ key: "E", text: "$200$" }],
    answer: "D", solution: "$\\binom{10}4=210$." },
  { id: "bmo-r2mk4-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of subsets of $\\{1,\\dots,7\\}$ is:",
    options: [{ key: "A", text: "$129$" },{ key: "B", text: "$256$" },{ key: "C", text: "$128$" },{ key: "D", text: "$127$" },{ key: "E", text: "$64$" }],
    answer: "C", solution: "$2^7=128$." },
  { id: "bmo-r2mk4-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of handshakes among $8$ people (everyone with everyone) is:",
    options: [{ key: "A", text: "$56$" },{ key: "B", text: "$29$" },{ key: "C", text: "$28$" },{ key: "D", text: "$64$" },{ key: "E", text: "$32$" }],
    answer: "C", solution: "$\\binom82=28$." },
  { id: "bmo-r2mk4-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 5,
    question: "Every sequence of $17$ distinct reals is guaranteed to contain a monotonic subsequence of length at least:",
    options: [{ key: "A", text: "$5$" },{ key: "B", text: "$6$" },{ key: "C", text: "$4$" },{ key: "D", text: "$17$" },{ key: "E", text: "$7$" }],
    answer: "A", solution: "Erdős–Szekeres: $\\ge\\lceil\\sqrt{17}\\rceil=5$ (since $4^2=16<17$)." }
];
