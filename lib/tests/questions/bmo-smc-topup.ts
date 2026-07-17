// BMO/UKMT SMC 定向补强：数论 10 题 + 几何 10 题。
import type { MCQQuestion } from "./types";

export const BMO_SMC_TOPUP: MCQQuestion[] = [
  {
    id: "bmo-topup-n-001", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 2, marks: 4,
    question: "What is the remainder when $2^{100}+3^{100}$ is divided by $5$?",
    options: [{ key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" }, { key: "D", text: "$3$" }, { key: "E", text: "$4$" }],
    answer: "C", solution: "$2^4\\equiv3^4\\equiv1\\pmod5$，且 $100$ 是 $4$ 的倍数，所以余数为 $1+1=2$。",
  },
  {
    id: "bmo-topup-n-002", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 1, marks: 4,
    question: "What is the least perfect square divisible by both $12$ and $18$?",
    options: [{ key: "A", text: "$24$" }, { key: "B", text: "$36$" }, { key: "C", text: "$72$" }, { key: "D", text: "$144$" }, { key: "E", text: "$324$" }],
    answer: "B", solution: "$\\operatorname{lcm}(12,18)=36=6^2$，本身已是完全平方数。",
  },
  {
    id: "bmo-topup-n-003", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "How many ordered pairs of positive integers $(x,y)$ satisfy $\\frac1x+\\frac1y=\\frac16$?",
    options: [{ key: "A", text: "$6$" }, { key: "B", text: "$8$" }, { key: "C", text: "$9$" }, { key: "D", text: "$10$" }, { key: "E", text: "$12$" }],
    answer: "C", solution: "整理得 $(x-6)(y-6)=36$。每个正因数 $d\\mid36$ 唯一给出 $(x-6,y-6)=(d,36/d)$；$36$ 有 $9$ 个正因数。",
  },
  {
    id: "bmo-topup-n-004", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "The three numbers $p$, $p+10$ and $p+14$ are all prime. What is $p$?",
    options: [{ key: "A", text: "$2$" }, { key: "B", text: "$3$" }, { key: "C", text: "$5$" }, { key: "D", text: "$7$" }, { key: "E", text: "$11$" }],
    answer: "B", solution: "模 $3$ 看，$p,p+10,p+14$ 分别覆盖三个余数类，其中一个必被 $3$ 整除。它仍为素数只能等于 $3$；检验 $3,13,17$ 均为素数。",
  },
  {
    id: "bmo-topup-n-005", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 2, marks: 4,
    question: "What are the last two digits of $7^{2026}$?",
    options: [{ key: "A", text: "$01$" }, { key: "B", text: "$07$" }, { key: "C", text: "$21$" }, { key: "D", text: "$43$" }, { key: "E", text: "$49$" }],
    answer: "E", solution: "$7^4=2401\\equiv1\\pmod{100}$，而 $2026\\equiv2\\pmod4$，所以 $7^{2026}\\equiv7^2=49\\pmod{100}$。",
  },
  {
    id: "bmo-topup-n-006", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 2, marks: 4,
    question: "How many positive integers less than $100$ are coprime to $100$?",
    options: [{ key: "A", text: "$20$" }, { key: "B", text: "$25$" }, { key: "C", text: "$40$" }, { key: "D", text: "$50$" }, { key: "E", text: "$60$" }],
    answer: "C", solution: "$100=2^2 5^2$，故 $\\varphi(100)=100(1-1/2)(1-1/5)=40$。",
  },
  {
    id: "bmo-topup-n-007", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 2, marks: 4,
    question: "Which of the following must divide the ten-digit number $1111111111$?",
    options: [{ key: "A", text: "$7$" }, { key: "B", text: "$9$" }, { key: "C", text: "$11$" }, { key: "D", text: "$13$" }, { key: "E", text: "$17$" }],
    answer: "C", solution: "交错位数字和之差为 $(1-1)+(1-1)+\\cdots=0$，由 $11$ 的整除判据可知该数被 $11$ 整除。",
  },
  {
    id: "bmo-topup-n-008", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "How many positive divisors of $360$ are multiples of $12$?",
    options: [{ key: "A", text: "$6$" }, { key: "B", text: "$8$" }, { key: "C", text: "$9$" }, { key: "D", text: "$12$" }, { key: "E", text: "$24$" }],
    answer: "B", solution: "$360=2^3 3^2 5$。倍数 $12=2^2 3$ 的因数需 $2$ 的指数选 $2,3$，$3$ 的指数选 $1,2$，$5$ 的指数选 $0,1$，共 $2\\times2\\times2=8$。",
  },
  {
    id: "bmo-topup-n-009", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 3, marks: 4,
    question: "How many residues $r$ with $0\\le r<24$ satisfy $r^2\\equiv1\\pmod{24}$?",
    options: [{ key: "A", text: "$2$" }, { key: "B", text: "$4$" }, { key: "C", text: "$6$" }, { key: "D", text: "$8$" }, { key: "E", text: "$12$" }],
    answer: "D", solution: "条件等价于 $r$ 为奇数且不被 $3$ 整除。$0$ 到 $23$ 中共有 $12$ 个奇数，去掉其中 $4$ 个 $3$ 的倍数，余 $8$ 个；它们的平方均模 $24$ 余 $1$。",
  },
  {
    id: "bmo-topup-n-010", type: "mcq", testId: "bmo", topicId: "bmo-number", difficulty: 2, marks: 4,
    question: "For every positive integer $n$, which expression equals $n(n+1)(n+2)(n+3)+1$?",
    options: [{ key: "A", text: "$(n^2+3n+1)^2$" }, { key: "B", text: "$(n^2+2n+1)^2$" }, { key: "C", text: "$(n^2+3n-1)^2$" }, { key: "D", text: "$(n^2+n+1)^2$" }, { key: "E", text: "$(n^2+4n+1)^2$" }],
    answer: "A", solution: "配对得 $n(n+3)=n^2+3n$，$(n+1)(n+2)=n^2+3n+2$。令 $u=n^2+3n$，则乘积加一为 $u(u+2)+1=(u+1)^2$。",
  },
  {
    id: "bmo-topup-g-001", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "A triangle has side lengths $13$, $14$ and $15$. What is its area?",
    options: [{ key: "A", text: "$72$" }, { key: "B", text: "$78$" }, { key: "C", text: "$84$" }, { key: "D", text: "$90$" }, { key: "E", text: "$96$" }],
    answer: "C", solution: "半周长 $s=21$。由海伦公式，面积 $=\\sqrt{21\\cdot8\\cdot7\\cdot6}=\\sqrt{7056}=84$。",
  },
  {
    id: "bmo-topup-g-002", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    question: "What is the inradius of a right-angled triangle with legs $6$ and $8$?",
    options: [{ key: "A", text: "$1$" }, { key: "B", text: "$2$" }, { key: "C", text: "$3$" }, { key: "D", text: "$4$" }, { key: "E", text: "$5$" }],
    answer: "B", solution: "斜边为 $10$。直角三角形内切圆半径 $r=(a+b-c)/2=(6+8-10)/2=2$。",
  },
  {
    id: "bmo-topup-g-003", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "Each interior angle of a regular polygon is $156^\\circ$. How many sides does it have?",
    options: [{ key: "A", text: "$12$" }, { key: "B", text: "$15$" }, { key: "C", text: "$18$" }, { key: "D", text: "$20$" }, { key: "E", text: "$24$" }],
    answer: "B", solution: "外角为 $180^\\circ-156^\\circ=24^\\circ$，边数 $=360/24=15$。",
  },
  {
    id: "bmo-topup-g-004", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "A chord of a circle has length $10$. Its distance from the centre is $12$. What is the radius?",
    options: [{ key: "A", text: "$12$" }, { key: "B", text: "$13$" }, { key: "C", text: "$14$" }, { key: "D", text: "$15$" }, { key: "E", text: "$17$" }],
    answer: "B", solution: "圆心到弦的垂线平分弦，形成直角边 $5,12$ 的三角形，半径 $=\\sqrt{5^2+12^2}=13$。",
  },
  {
    id: "bmo-topup-g-005", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "A rectangle has perimeter $34$ and diagonal $13$. What is its area?",
    options: [{ key: "A", text: "$48$" }, { key: "B", text: "$54$" }, { key: "C", text: "$60$" }, { key: "D", text: "$65$" }, { key: "E", text: "$72$" }],
    answer: "C", solution: "若边长为 $a,b$，则 $a+b=17$、$a^2+b^2=169$。所以 $2ab=17^2-169=120$，面积 $ab=60$。",
  },
  {
    id: "bmo-topup-g-006", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "The centroid of a triangle is $8$ units from a vertex along a median. What is the length of that median?",
    options: [{ key: "A", text: "$10$" }, { key: "B", text: "$12$" }, { key: "C", text: "$14$" }, { key: "D", text: "$16$" }, { key: "E", text: "$24$" }],
    answer: "B", solution: "重心把中线按从顶点起 $2:1$ 分割，因此 $8$ 是中线的 $2/3$，中线长 $8\\times3/2=12$。",
  },
  {
    id: "bmo-topup-g-007", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "From a point $P$ outside a circle, a tangent has length $12$. If the distance from $P$ to the centre is $13$, what is the radius?",
    options: [{ key: "A", text: "$4$" }, { key: "B", text: "$5$" }, { key: "C", text: "$6$" }, { key: "D", text: "$7$" }, { key: "E", text: "$8$" }],
    answer: "B", solution: "半径垂直于切线，故 $r^2+12^2=13^2$，得到 $r=5$。",
  },
  {
    id: "bmo-topup-g-008", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    question: "Two similar triangles have areas in the ratio $25:49$. What is the ratio of corresponding side lengths?",
    options: [{ key: "A", text: "$5:7$" }, { key: "B", text: "$25:49$" }, { key: "C", text: "$25:7$" }, { key: "D", text: "$7:5$" }, { key: "E", text: "$3:4$" }],
    answer: "A", solution: "相似图形面积比是对应长度比的平方，所以长度比为 $\\sqrt{25:49}=5:7$。",
  },
  {
    id: "bmo-topup-g-009", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 2, marks: 4,
    question: "One angle of a cyclic quadrilateral is $112^\\circ$. What is the opposite angle?",
    options: [{ key: "A", text: "$58^\\circ$" }, { key: "B", text: "$68^\\circ$" }, { key: "C", text: "$78^\\circ$" }, { key: "D", text: "$88^\\circ$" }, { key: "E", text: "$112^\\circ$" }],
    answer: "B", solution: "圆内接四边形对角互补，故所求为 $180^\\circ-112^\\circ=68^\\circ$。",
  },
  {
    id: "bmo-topup-g-010", type: "mcq", testId: "bmo", topicId: "bmo-geometry", difficulty: 3, marks: 4,
    question: "In triangle $ABC$, the internal angle bisector from $A$ meets $BC$ at $D$. If $AB:AC=3:5$ and $BC=16$, what is $BD$?",
    options: [{ key: "A", text: "$5$" }, { key: "B", text: "$6$" }, { key: "C", text: "$8$" }, { key: "D", text: "$10$" }, { key: "E", text: "$12$" }],
    answer: "B", solution: "角平分线定理给 $BD:DC=AB:AC=3:5$。总长分成 $8$ 份，每份 $2$，故 $BD=6$。",
  },
];
