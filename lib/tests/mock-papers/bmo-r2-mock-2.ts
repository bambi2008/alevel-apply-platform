// BMO Round 2 模拟卷 2（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 本卷把每个主题化为「链式选择题阶梯」，沿推导路径逐级上难度，支持自动判分（真实 R2 需完整手写证明，请配合练习区 R2 长题与官方真题）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准，未照搬真题；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M2_T1: MCQQuestion[] = [
  { id: "bmo-r2mk2-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $3$ modulo $16$ is:",
    options: [{ key: "A", text: "$8$" },{ key: "B", text: "$3$" },{ key: "C", text: "$2$" },{ key: "D", text: "$16$" },{ key: "E", text: "$4$" }],
    answer: "E", solution: "$3^2=9,\\ 3^4=81\\equiv1\\pmod{16}$; order $=4$." },
  { id: "bmo-r2mk2-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $7^{2025}$ are (as a two-digit value, e.g. $07$):",
    options: [{ key: "A", text: "$7$" },{ key: "B", text: "$21$" },{ key: "C", text: "$1$" },{ key: "D", text: "$49$" },{ key: "E", text: "$43$" }],
    answer: "A", solution: "$\\mathrm{ord}_{100}(7)=4$, $2025\\equiv1$, $7^1=7$, i.e. $07$." },
  { id: "bmo-r2mk2-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $2^{50}$ is divided by $7$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$6$" },{ key: "C", text: "$4$" },{ key: "D", text: "$3$" },{ key: "E", text: "$1$" }],
    answer: "C", solution: "$\\mathrm{ord}_7(2)=3$, $50\\equiv2$, $2^2=4$." },
  { id: "bmo-r2mk2-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "$\\varphi(360)$ equals:",
    options: [{ key: "A", text: "$180$" },{ key: "B", text: "$120$" },{ key: "C", text: "$72$" },{ key: "D", text: "$144$" },{ key: "E", text: "$96$" }],
    answer: "E", solution: "$360=2^3\\cdot3^2\\cdot5$, $\\varphi=360\\cdot\\tfrac12\\cdot\\tfrac23\\cdot\\tfrac45=96$." },
  { id: "bmo-r2mk2-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ with $2^k\\mid100!$ is:",
    options: [{ key: "A", text: "$98$" },{ key: "B", text: "$50$" },{ key: "C", text: "$99$" },{ key: "D", text: "$97$" },{ key: "E", text: "$94$" }],
    answer: "D", solution: "$50+25+12+6+3+1=97$." }
];

export const BMO_R2M2_T2: MCQQuestion[] = [
  { id: "bmo-r2mk2-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=4$, then $x^3+\\tfrac1{x^3}$ equals:",
    options: [{ key: "A", text: "$52$" },{ key: "B", text: "$44$" },{ key: "C", text: "$48$" },{ key: "D", text: "$60$" },{ key: "E", text: "$64$" }],
    answer: "A", solution: "$x^3+\\tfrac1{x^3}=s^3-3s=64-12=52$." },
  { id: "bmo-r2mk2-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 3,
    question: "The value of $1+3+5+\\cdots+39$ (the first $20$ odd numbers) is:",
    options: [{ key: "A", text: "$441$" },{ key: "B", text: "$400$" },{ key: "C", text: "$420$" },{ key: "D", text: "$380$" },{ key: "E", text: "$361$" }],
    answer: "B", solution: "Sum of first $n$ odds $=n^2=20^2=400$." },
  { id: "bmo-r2mk2-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "With $a_1=2$ and $a_{n+1}=a_n^2-a_n+1$, the value of $a_4$ is:",
    options: [{ key: "A", text: "$31$" },{ key: "B", text: "$57$" },{ key: "C", text: "$21$" },{ key: "D", text: "$43$" },{ key: "E", text: "$13$" }],
    answer: "D", solution: "$a_2=3,\\ a_3=7,\\ a_4=43$." },
  { id: "bmo-r2mk2-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^4+x^2+1=0$ is:",
    options: [{ key: "A", text: "$3$" },{ key: "B", text: "$2$" },{ key: "C", text: "$1$" },{ key: "D", text: "$4$" },{ key: "E", text: "$0$" }],
    answer: "E", solution: "$x^4+x^2+1=(x^2+x+1)(x^2-x+1)>0$; no real roots." },
  { id: "bmo-r2mk2-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "For positive reals with $a+b+c=6$, the minimum possible value of $a^2+b^2+c^2$ is:",
    options: [{ key: "A", text: "$36$" },{ key: "B", text: "$12$" },{ key: "C", text: "$18$" },{ key: "D", text: "$9$" },{ key: "E", text: "$6$" }],
    answer: "B", solution: "By QM–AM, $a^2+b^2+c^2\\ge\\tfrac{(a+b+c)^2}{3}=12$, at $a=b=c=2$." }
];

export const BMO_R2M2_T3: MCQQuestion[] = [
  { id: "bmo-r2mk2-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "A right triangle has legs $6$ and $8$ (right angle between them). Its hypotenuse length is:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$11$" },{ key: "C", text: "$14$" },{ key: "D", text: "$10$" },{ key: "E", text: "$7$" }],
    answer: "D", solution: "$\\sqrt{6^2+8^2}=10$." },
  { id: "bmo-r2mk2-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For that $6$–$8$–$10$ right triangle, the circumradius equals:",
    options: [{ key: "A", text: "$10$" },{ key: "B", text: "$8$" },{ key: "C", text: "$4$" },{ key: "D", text: "$6$" },{ key: "E", text: "$5$" }],
    answer: "E", solution: "Circumradius $=$ hypotenuse$/2=5$." },
  { id: "bmo-r2mk2-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $6$–$8$–$10$ right triangle, the length of the median from the right-angle vertex to the hypotenuse is:",
    options: [{ key: "A", text: "$5$" },{ key: "B", text: "$4$" },{ key: "C", text: "$3$" },{ key: "D", text: "$6$" },{ key: "E", text: "$7$" }],
    answer: "A", solution: "Median to hypotenuse $=$ half the hypotenuse $=5$." },
  { id: "bmo-r2mk2-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For that $6$–$8$–$10$ right triangle, the inradius equals:",
    options: [{ key: "A", text: "$0$" },{ key: "B", text: "$4$" },{ key: "C", text: "$1$" },{ key: "D", text: "$2$" },{ key: "E", text: "$3$" }],
    answer: "D", solution: "$r=\\text{Area}/s=24/12=2$." },
  { id: "bmo-r2mk2-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "Place the $6$–$8$–$10$ triangle as $A(0,0),B(8,0),C(0,6)$. If $G$ is the centroid, then $3\\cdot AG$ equals:",
    options: [{ key: "A", text: "$10$" },{ key: "B", text: "$12$" },{ key: "C", text: "$6$" },{ key: "D", text: "$8$" },{ key: "E", text: "$11$" }],
    answer: "A", solution: "$G=(8/3,2)$, $AG=\\sqrt{(8/3)^2+2^2}=10/3$, so $3AG=10$." }
];

export const BMO_R2M2_T4: MCQQuestion[] = [
  { id: "bmo-r2mk2-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of ways to tile a $2\\times6$ rectangle with $2\\times1$ dominoes is:",
    options: [{ key: "A", text: "$14$" },{ key: "B", text: "$21$" },{ key: "C", text: "$11$" },{ key: "D", text: "$8$" },{ key: "E", text: "$13$" }],
    answer: "E", solution: "Fibonacci-type recurrence $T_n=T_{n-1}+T_{n-2}$, $T_6=13$." },
  { id: "bmo-r2mk2-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "In a group of $10$ people where everyone shakes hands with everyone else once, the number of handshakes is:",
    options: [{ key: "A", text: "$45$" },{ key: "B", text: "$90$" },{ key: "C", text: "$100$" },{ key: "D", text: "$46$" },{ key: "E", text: "$50$" }],
    answer: "A", solution: "$\\binom{10}{2}=45$." },
  { id: "bmo-r2mk2-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least number of integers to choose from $\\{1,2,\\dots,20\\}$ to guarantee two of them are coprime is:",
    options: [{ key: "A", text: "$13$" },{ key: "B", text: "$20$" },{ key: "C", text: "$11$" },{ key: "D", text: "$10$" },{ key: "E", text: "$12$" }],
    answer: "C", solution: "Pairing into $10$ consecutive pairs; $10+1=11$ forces a coprime (consecutive) pair." },
  { id: "bmo-r2mk2-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The number of subsets of $\\{1,2,\\dots,8\\}$ is:",
    options: [{ key: "A", text: "$257$" },{ key: "B", text: "$512$" },{ key: "C", text: "$256$" },{ key: "D", text: "$128$" },{ key: "E", text: "$255$" }],
    answer: "C", solution: "$2^8=256$." },
  { id: "bmo-r2mk2-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 5,
    question: "Every sequence of $26$ distinct reals is guaranteed to contain a monotonic subsequence of length at least:",
    options: [{ key: "A", text: "$7$" },{ key: "B", text: "$26$" },{ key: "C", text: "$8$" },{ key: "D", text: "$6$" },{ key: "E", text: "$5$" }],
    answer: "D", solution: "Erdős–Szekeres: $\\ge\\lceil\\sqrt{26}\\rceil=6$ (since $5^2=25<26$)." }
];
