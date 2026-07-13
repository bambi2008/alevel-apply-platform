// BMO Round 2 模拟卷 1（主题阶梯）—— 对标真实 BMO2：3.5 小时 4 道主题长题。
// 本卷把每个主题化为「链式选择题阶梯」，沿推导路径逐级上难度，支持自动判分（真实 R2 需完整手写证明，请配合练习区 R2 长题与官方真题）。
// 100% 原创；仅以 2006–2026 BMO2 真题做主题/难度校准，未照搬真题；全部数值答案程序计算核对。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const BMO_R2M1_T1: MCQQuestion[] = [
  { id: "bmo-r2mk1-t1-q01", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The multiplicative order of $2$ modulo $25$ (the least $k\\ge1$ with $2^k\\equiv1\\pmod{25}$) is:",
    options: [{ key: "A", text: "$20$" },{ key: "B", text: "$5$" },{ key: "C", text: "$24$" },{ key: "D", text: "$10$" },{ key: "E", text: "$4$" }],
    answer: "A", solution: "$2^{20}\\equiv1\\pmod{25}$ and no smaller exponent works; order $=20$." },
  { id: "bmo-r2mk1-t1-q02", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The last two digits of $3^{2026}$ are:",
    options: [{ key: "A", text: "$27$" },{ key: "B", text: "$49$" },{ key: "C", text: "$81$" },{ key: "D", text: "$43$" },{ key: "E", text: "$29$" }],
    answer: "E", solution: "$\\mathrm{ord}_{100}(3)=20$, $2026\\equiv6$, $3^6=729\\equiv29\\pmod{100}$." },
  { id: "bmo-r2mk1-t1-q03", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The remainder when $7^{100}$ is divided by $13$ is:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$7$" },{ key: "C", text: "$1$" },{ key: "D", text: "$11$" },{ key: "E", text: "$3$" }],
    answer: "A", solution: "$\\mathrm{ord}_{13}(7)=12$, $100\\equiv4$, $7^4\\equiv9\\pmod{13}$." },
  { id: "bmo-r2mk1-t1-q04", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The number of integers $n$ with $1\\le n\\le100$ and $\\gcd(n,100)=1$ equals:",
    options: [{ key: "A", text: "$50$" },{ key: "B", text: "$20$" },{ key: "C", text: "$40$" },{ key: "D", text: "$60$" },{ key: "E", text: "$48$" }],
    answer: "C", solution: "$\\varphi(100)=100(1-\\tfrac12)(1-\\tfrac15)=40$." },
  { id: "bmo-r2mk1-t1-q05", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 5,
    question: "The largest $k$ such that $3^k$ divides $100!$ is:",
    options: [{ key: "A", text: "$47$" },{ key: "B", text: "$48$" },{ key: "C", text: "$33$" },{ key: "D", text: "$44$" },{ key: "E", text: "$50$" }],
    answer: "B", solution: "Legendre: $\\lfloor100/3\\rfloor+\\lfloor100/9\\rfloor+\\lfloor100/27\\rfloor+\\lfloor100/81\\rfloor=33+11+3+1=48$." }
];

export const BMO_R2M1_T2: MCQQuestion[] = [
  { id: "bmo-r2mk1-t2-q01", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "If $x+\\tfrac1x=3$, then $x^4+\\tfrac1{x^4}$ equals:",
    options: [{ key: "A", text: "$52$" },{ key: "B", text: "$47$" },{ key: "C", text: "$18$" },{ key: "D", text: "$34$" },{ key: "E", text: "$7$" }],
    answer: "B", solution: "$p_2=3^2-2=7$, $p_4=(p_2)^2-2=47$." },
  { id: "bmo-r2mk1-t2-q02", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The value of $100\\cdot\\displaystyle\\sum_{k=1}^{99}\\frac{1}{k(k+1)}$ is:",
    options: [{ key: "A", text: "$98$" },{ key: "B", text: "$100$" },{ key: "C", text: "$99$" },{ key: "D", text: "$101$" },{ key: "E", text: "$50$" }],
    answer: "C", solution: "Telescoping sum $=1-\\tfrac1{100}=\\tfrac{99}{100}$; times $100$ is $99$." },
  { id: "bmo-r2mk1-t2-q03", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The value of $1^3+2^3+\\cdots+10^3$ is:",
    options: [{ key: "A", text: "$2025$" },{ key: "B", text: "$3025$" },{ key: "C", text: "$4025$" },{ key: "D", text: "$385$" },{ key: "E", text: "$5050$" }],
    answer: "B", solution: "$=\\left(\\tfrac{10\\cdot11}2\\right)^2=55^2=3025$." },
  { id: "bmo-r2mk1-t2-q04", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 4,
    question: "The number of real roots of $x^8-x^5+x^2-x+1=0$ is:",
    options: [{ key: "A", text: "$2$" },{ key: "B", text: "$0$" },{ key: "C", text: "$1$" },{ key: "D", text: "$4$" },{ key: "E", text: "$8$" }],
    answer: "B", solution: "The polynomial is $>0$ for all real $x$, so it has no real roots." },
  { id: "bmo-r2mk1-t2-q05", type: "mcq", testId: "bmo", topicId: "bmo-algebra", difficulty: 3, marks: 5,
    question: "For the sequence $a_1=1,\\ a_{n+1}=a_n+\\tfrac1{a_n}$, the value of $\\lfloor a_{50}^2\\rfloor$ is:",
    options: [{ key: "A", text: "$99$" },{ key: "B", text: "$102$" },{ key: "C", text: "$100$" },{ key: "D", text: "$101$" },{ key: "E", text: "$98$" }],
    answer: "D", solution: "$a_n^2$ increases by $2+\\tfrac1{a_n^2}$ each step; $a_n^2$ grows by about $2$ each step from $a_1^2=1$, giving $a_{50}^2\\approx101.7$; floor $=101$." }
];

export const BMO_R2M1_T3: MCQQuestion[] = [
  { id: "bmo-r2mk1-t3-q01", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "Triangle has vertices $A(0,0),B(6,0),C(2,4)$. The square of the median length from $A$ to the midpoint of $BC$ is:",
    options: [{ key: "A", text: "$20$" },{ key: "B", text: "$25$" },{ key: "C", text: "$10$" },{ key: "D", text: "$18$" },{ key: "E", text: "$16$" }],
    answer: "A", solution: "Midpoint $(4,2)$; $AM^2=4^2+2^2=20$." },
  { id: "bmo-r2mk1-t3-q02", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 5,
    question: "For the same triangle $A(0,0),B(6,0),C(2,4)$, the square of the circumradius $R^2$ equals:",
    options: [{ key: "A", text: "$12$" },{ key: "B", text: "$16$" },{ key: "C", text: "$8$" },{ key: "D", text: "$5$" },{ key: "E", text: "$10$" }],
    answer: "E", solution: "Area $=12$, sides give $R=abc/(4\\cdot\\text{Area})=\\sqrt{10}$, so $R^2=10$." },
  { id: "bmo-r2mk1-t3-q03", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "$ABCD$ is a square inscribed in a circle of radius $1$ (vertices in order). Then $AC\\cdot BD$ equals:",
    options: [{ key: "A", text: "$1$" },{ key: "B", text: "$2$" },{ key: "C", text: "$4$" },{ key: "D", text: "$3$" },{ key: "E", text: "$8$" }],
    answer: "C", solution: "Diagonals are diameters $=2$; product $=2\\cdot2=4$ (matches Ptolemy $AB\\cdot CD+AD\\cdot BC$)." },
  { id: "bmo-r2mk1-t3-q04", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "For triangle $A(0,0),B(6,0),C(2,4)$, the orthocentre $H=(h_1,h_2)$ has $h_1+h_2=$",
    options: [{ key: "A", text: "$0$" },{ key: "B", text: "$2$" },{ key: "C", text: "$4$" },{ key: "D", text: "$8$" },{ key: "E", text: "$6$" }],
    answer: "C", solution: "Altitudes meet at $H=(2,2)$, so $h_1+h_2=4$." },
  { id: "bmo-r2mk1-t3-q05", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 3,
    question: "For triangle $A(0,0),B(6,0),C(2,4)$, if the centroid is $G$, then $3G_x$ equals:",
    options: [{ key: "A", text: "$10$" },{ key: "B", text: "$6$" },{ key: "C", text: "$12$" },{ key: "D", text: "$4$" },{ key: "E", text: "$8$" }],
    answer: "E", solution: "$G_x=(0+6+2)/3=8/3$, so $3G_x=8$." }
];

export const BMO_R2M1_T4: MCQQuestion[] = [
  { id: "bmo-r2mk1-t4-q01", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The least $n$ such that every $2$-colouring of the edges of $K_n$ contains a monochromatic triangle is:",
    options: [{ key: "A", text: "$9$" },{ key: "B", text: "$4$" },{ key: "C", text: "$6$" },{ key: "D", text: "$5$" },{ key: "E", text: "$7$" }],
    answer: "C", solution: "$R(3,3)=6$; $K_5$ has a colouring with no monochromatic triangle." },
  { id: "bmo-r2mk1-t4-q02", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "Every sequence of $50$ distinct reals is guaranteed to contain a monotonic subsequence of length at least:",
    options: [{ key: "A", text: "$7$" },{ key: "B", text: "$25$" },{ key: "C", text: "$10$" },{ key: "D", text: "$6$" },{ key: "E", text: "$8$" }],
    answer: "E", solution: "Erdős–Szekeres: length $\\ge\\lceil\\sqrt{50}\\rceil=8$ (since $7^2=49<50$)." },
  { id: "bmo-r2mk1-t4-q03", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 4,
    question: "The number of subsets of $\\{1,2,\\dots,10\\}$ whose element-sum is even equals:",
    options: [{ key: "A", text: "$500$" },{ key: "B", text: "$512$" },{ key: "C", text: "$511$" },{ key: "D", text: "$256$" },{ key: "E", text: "$1024$" }],
    answer: "B", solution: "Even-sum and odd-sum subsets are equinumerous $=2^{9}=512$." },
  { id: "bmo-r2mk1-t4-q04", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 3,
    question: "The least number of people needed to guarantee two share the same birth month is:",
    options: [{ key: "A", text: "$11$" },{ key: "B", text: "$24$" },{ key: "C", text: "$13$" },{ key: "D", text: "$12$" },{ key: "E", text: "$7$" }],
    answer: "C", solution: "Pigeonhole with $12$ months: $12+1=13$." },
  { id: "bmo-r2mk1-t4-q05", type: "mcq", testId: "bmo", topicId: "bmo-combinatorics", difficulty: 3, marks: 5,
    question: "The maximum number of edges of $K_5$ that can go between the two parts of a vertex bipartition (the max-cut) is:",
    options: [{ key: "A", text: "$10$" },{ key: "B", text: "$5$" },{ key: "C", text: "$4$" },{ key: "D", text: "$8$" },{ key: "E", text: "$6$" }],
    answer: "E", solution: "Split $2$ vs $3$: $2\\cdot3=6$ cross edges, the maximum." }
];
