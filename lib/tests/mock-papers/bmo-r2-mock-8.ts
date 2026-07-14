// BMO Round 2 模拟卷 8（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 每主题化为链式选择题阶梯，支持自动判分（真实 R2 需完整手写证明）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M8_T1: MCQQuestion[] = [
  { id: "bmo-r2mk8-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $3$ modulo $7$ is:",
    options: [{ key: "A", text: "$6$" },{ key: "B", text: "$2$" },{ key: "C", text: "$7$" },{ key: "D", text: "$4$" },{ key: "E", text: "$3$" }],
    answer: "A", solution: "$3^6\\equiv1\\pmod7$ and no smaller; order $=6$." },
  { id: "bmo-r2mk8-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $7^{50}$ are:",
    options: [{ key: "A", text: "$50$" },{ key: "B", text: "$7$" },{ key: "C", text: "$1$" },{ key: "D", text: "$49$" },{ key: "E", text: "$43$" }],
    answer: "D", solution: "$\\mathrm{ord}_{100}(7)=4$, $50\\equiv2$, $7^2=49$." },
  { id: "bmo-r2mk8-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $2^{60}$ is divided by $11$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$10$" },{ key: "C", text: "$0$" },{ key: "D", text: "$1$" },{ key: "E", text: "$5$" }],
    answer: "D", solution: "$\\mathrm{ord}_{11}(2)=10$, $60\\equiv0$, so $\\equiv1$." },
  { id: "bmo-r2mk8-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(600)$ equals:",
    options: [{ key: "A", text: "$161$" },{ key: "B", text: "$200$" },{ key: "C", text: "$240$" },{ key: "D", text: "$120$" },{ key: "E", text: "$160$" }],
    answer: "E", solution: "$600=2^3\\cdot3\\cdot5^2$, $\\varphi=600\\cdot\\tfrac12\\cdot\\tfrac23\\cdot\\tfrac45=160$." },
  { id: "bmo-r2mk8-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $5^k\\mid500!$ is:",
    options: [{ key: "A", text: "$100$" },{ key: "B", text: "$123$" },{ key: "C", text: "$125$" },{ key: "D", text: "$124$" },{ key: "E", text: "$120$" }],
    answer: "D", solution: "$100+20+4=124$." }
];

export const BMO_R2M8_T2: MCQQuestion[] = [
  { id: "bmo-r2mk8-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "If $x+\\tfrac1x=5$, then $x^3+\\tfrac1{x^3}$ equals:",
    options: [{ key: "A", text: "$120$" },{ key: "B", text: "$100$" },{ key: "C", text: "$125$" },{ key: "D", text: "$111$" },{ key: "E", text: "$110$" }],
    answer: "E", solution: "$s^3-3s=125-15=110$." },
  { id: "bmo-r2mk8-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1^3+2^3+\\cdots+6^3$ is:",
    options: [{ key: "A", text: "$442$" },{ key: "B", text: "$196$" },{ key: "C", text: "$441$" },{ key: "D", text: "$784$" },{ key: "E", text: "$225$" }],
    answer: "C", solution: "$=\\left(\\tfrac{6\\cdot7}2\\right)^2=21^2=441$." },
  { id: "bmo-r2mk8-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=1$ and $a_{n+1}=4a_n$, the value of $a_5$ is:",
    options: [{ key: "A", text: "$256$" },{ key: "B", text: "$128$" },{ key: "C", text: "$64$" },{ key: "D", text: "$257$" },{ key: "E", text: "$1024$" }],
    answer: "A", solution: "$a_n=4^{n-1}$: $a_5=256$." },
  { id: "bmo-r2mk8-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^4+x^2+2=0$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$3$" },{ key: "C", text: "$0$" },{ key: "D", text: "$1$" },{ key: "E", text: "$4$" }],
    answer: "C", solution: "$x^4+x^2+2\\ge2>0$; no real roots." },
  { id: "bmo-r2mk8-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "For positive reals with $a+b+c=15$, the minimum of $a^2+b^2+c^2$ is:",
    options: [{ key: "A", text: "$45$" },{ key: "B", text: "$76$" },{ key: "C", text: "$25$" },{ key: "D", text: "$225$" },{ key: "E", text: "$75$" }],
    answer: "E", solution: "$\\ge\\tfrac{(a+b+c)^2}3=75$, at $a=b=c=5$." }
];

export const BMO_R2M8_T3: MCQQuestion[] = [
  { id: "bmo-r2mk8-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $12$ and $35$. Its hypotenuse is:",
    options: [{ key: "A", text: "$38$" },{ key: "B", text: "$49$" },{ key: "C", text: "$39$" },{ key: "D", text: "$36$" },{ key: "E", text: "$37$" }],
    answer: "E", solution: "$\\sqrt{144+1225}=37$." },
  { id: "bmo-r2mk8-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $12$–$35$–$37$ right triangle, the perimeter is:",
    options: [{ key: "A", text: "$84$" },{ key: "B", text: "$88$" },{ key: "C", text: "$80$" },{ key: "D", text: "$85$" },{ key: "E", text: "$74$" }],
    answer: "A", solution: "$12+35+37=84$." },
  { id: "bmo-r2mk8-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $12$–$35$–$37$ right triangle, the inradius is:",
    options: [{ key: "A", text: "$10$" },{ key: "B", text: "$5$" },{ key: "C", text: "$7$" },{ key: "D", text: "$6$" },{ key: "E", text: "$4$" }],
    answer: "B", solution: "$r=\\text{Area}/s=210/42=5$." },
  { id: "bmo-r2mk8-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $12$–$35$–$37$ right triangle, the area is:",
    options: [{ key: "A", text: "$196$" },{ key: "B", text: "$222$" },{ key: "C", text: "$420$" },{ key: "D", text: "$211$" },{ key: "E", text: "$210$" }],
    answer: "E", solution: "$\\tfrac12\\cdot12\\cdot35=210$." },
  { id: "bmo-r2mk8-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $12$–$35$–$37$ right triangle, twice the median to the hypotenuse equals:",
    options: [{ key: "A", text: "$38$" },{ key: "B", text: "$18$" },{ key: "C", text: "$74$" },{ key: "D", text: "$36$" },{ key: "E", text: "$37$" }],
    answer: "E", solution: "Median to hyp $=$ hyp$/2$, so twice it $=37$." }
];

export const BMO_R2M8_T4: MCQQuestion[] = [
  { id: "bmo-r2mk8-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times4$ rectangle with dominoes is:",
    options: [{ key: "A", text: "$6$" },{ key: "B", text: "$4$" },{ key: "C", text: "$3$" },{ key: "D", text: "$8$" },{ key: "E", text: "$5$" }],
    answer: "E", solution: "Fibonacci-type: $T_4=5$." },
  { id: "bmo-r2mk8-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "$\\binom{12}{3}$ equals:",
    options: [{ key: "A", text: "$165$" },{ key: "B", text: "$221$" },{ key: "C", text: "$220$" },{ key: "D", text: "$120$" },{ key: "E", text: "$286$" }],
    answer: "C", solution: "$\\binom{12}3=220$." },
  { id: "bmo-r2mk8-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of subsets of $\\{1,\\dots,11\\}$ is:",
    options: [{ key: "A", text: "$4096$" },{ key: "B", text: "$512$" },{ key: "C", text: "$2049$" },{ key: "D", text: "$2048$" },{ key: "E", text: "$1024$" }],
    answer: "D", solution: "$2^{11}=2048$." },
  { id: "bmo-r2mk8-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of handshakes among $15$ people (everyone with everyone) is:",
    options: [{ key: "A", text: "$225$" },{ key: "B", text: "$105$" },{ key: "C", text: "$210$" },{ key: "D", text: "$106$" },{ key: "E", text: "$120$" }],
    answer: "B", solution: "$\\binom{15}2=105$." },
  { id: "bmo-r2mk8-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "Every sequence of $65$ distinct reals is guaranteed to contain a monotonic subsequence of length at least:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$11$" },{ key: "C", text: "$8$" },{ key: "D", text: "$10$" },{ key: "E", text: "$65$" }],
    answer: "A", solution: "$\\ge\\lceil\\sqrt{65}\\rceil=9$ (since $8^2=64<65$)." }
];
