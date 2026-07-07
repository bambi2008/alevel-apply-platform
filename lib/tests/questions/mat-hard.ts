// MAT 高难度加练题（全部原创，参照 MAT Part A 题型与难度，不含真题）
import type { MCQQuestion } from "./types";

export const MAT_HARD: MCQQuestion[] = [
  {
    id: "mat-hard-001", type: "mcq", testId: "mat", topicId: "mat-poly", difficulty: 3, marks: 2,
    question: "How many real solutions does the equation $(x-1)^4 = 16$ have?",
    options: [
      { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" }, { key: "D", text: "$4$" },
    ],
    answer: "C",
    solution: "$(x-1)^4=16\\Rightarrow (x-1)^2=4$ (the other square root is negative and impossible). Then $x-1=\\pm2$, so $x=3$ or $x=-1$: two real solutions.",
    hint: "Take square roots carefully — a fourth power equals a positive number.",
  },
  {
    id: "mat-hard-002", type: "mcq", testId: "mat", topicId: "mat-log", difficulty: 3, marks: 2,
    question: "How many real solutions does $2^{2x} - 5\\cdot 2^{x} + 4 = 0$ have?",
    options: [
      { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" }, { key: "D", text: "$4$" },
    ],
    answer: "C",
    solution: "Let $y=2^x>0$. Then $y^2-5y+4=0\\Rightarrow(y-1)(y-4)=0$, so $y=1$ or $y=4$. Both are positive, giving $x=0$ and $x=2$: two solutions.",
    hint: "Substitute $y=2^x$ and remember $y>0$.",
  },
  {
    id: "mat-hard-003", type: "mcq", testId: "mat", topicId: "mat-trig", difficulty: 3, marks: 2,
    question: "For how many integer values of $k$ does the equation $3\\sin x + 4\\cos x = k$ have a real solution?",
    options: [
      { key: "A", text: "$9$" }, { key: "B", text: "$10$" }, { key: "C", text: "$11$" }, { key: "D", text: "$25$" },
    ],
    answer: "C",
    solution: "$3\\sin x+4\\cos x=R\\sin(x+\\varphi)$ with $R=\\sqrt{3^2+4^2}=5$, so the expression ranges over $[-5,5]$. Integer $k$ from $-5$ to $5$ inclusive: $11$ values.",
    hint: "Write $a\\sin x+b\\cos x=R\\sin(x+\\varphi)$ with $R=\\sqrt{a^2+b^2}$.",
  },
  {
    id: "mat-hard-004", type: "mcq", testId: "mat", topicId: "mat-calc", difficulty: 3, marks: 2,
    question: "The tangent to the curve $y=x^3-3x$ at the point where $x=2$ meets the curve again at another point. What is the $x$-coordinate of that point?",
    options: [
      { key: "A", text: "$-4$" }, { key: "B", text: "$-2$" }, { key: "C", text: "$4$" }, { key: "D", text: "$1$" },
    ],
    answer: "A",
    solution: "At $x=2$: $y=2$ and $y'=3x^2-3=9$. Tangent: $y=9x-16$. Setting equal: $x^3-3x=9x-16\\Rightarrow x^3-12x+16=0$. Since $x=2$ is a repeated root, $x^3-12x+16=(x-2)^2(x+4)$, giving the other intersection at $x=-4$.",
    hint: "The tangent point is a double root of the intersection equation.",
  },
  {
    id: "mat-hard-005", type: "mcq", testId: "mat", topicId: "mat-seq", difficulty: 3, marks: 2,
    question: "A geometric series with $|r|<1$ has sum to infinity $9$, and the sum of its first two terms is $5$. Find the common ratio $r$.",
    options: [
      { key: "A", text: "$\\tfrac13$" }, { key: "B", text: "$\\tfrac23$" }, { key: "C", text: "$\\tfrac12$" }, { key: "D", text: "$\\tfrac34$" },
    ],
    answer: "B",
    solution: "$\\dfrac{a}{1-r}=9$ and $a(1+r)=5$. From the first, $a=9(1-r)$; substitute: $9(1-r)(1+r)=5\\Rightarrow 9(1-r^2)=5\\Rightarrow r^2=\\tfrac49$. With $|r|<1$ and positive terms, $r=\\tfrac23$.",
    hint: "Use $S_\\infty=\\tfrac{a}{1-r}$ and $a+ar=5$.",
  },
  {
    id: "mat-hard-006", type: "mcq", testId: "mat", topicId: "mat-cs", difficulty: 3, marks: 2,
    question: "How many $4$-digit numbers have digits that are strictly increasing from left to right (for example $1359$)?",
    options: [
      { key: "A", text: "$126$" }, { key: "B", text: "$210$" }, { key: "C", text: "$3024$" }, { key: "D", text: "$5040$" },
    ],
    answer: "A",
    solution: "A strictly increasing $4$-digit number uses $4$ distinct digits from $\\{1,\\dots,9\\}$ (a $0$ can never appear, as it would need to be first but must be the smallest). Each choice of $4$ digits gives exactly one increasing arrangement, so the count is $\\binom{9}{4}=126$.",
    hint: "Choosing the digit set determines the order uniquely.",
  },
  {
    id: "mat-hard-007", type: "mcq", testId: "mat", topicId: "mat-geo", difficulty: 3, marks: 2,
    question: "A circle passes through the points $(0,0)$, $(4,0)$ and $(0,6)$. What is its radius?",
    options: [
      { key: "A", text: "$\\sqrt{13}$" }, { key: "B", text: "$\\sqrt{11}$" }, { key: "C", text: "$5$" }, { key: "D", text: "$2\\sqrt{13}$" },
    ],
    answer: "A",
    solution: "Use $x^2+y^2+Dx+Ey+F=0$. Through $(0,0)$: $F=0$. Through $(4,0)$: $16+4D=0\\Rightarrow D=-4$. Through $(0,6)$: $36+6E=0\\Rightarrow E=-6$. Centre $(2,3)$, radius $\\sqrt{2^2+3^2}=\\sqrt{13}$.",
    hint: "The chords from the origin along the axes make this a right-angled setup.",
  },
  {
    id: "mat-hard-008", type: "mcq", testId: "mat", topicId: "mat-logic", difficulty: 3, marks: 2,
    question: "For how many integers $n$ with $1\\le n\\le 100$ is $n^2+n+1$ divisible by $3$?",
    options: [
      { key: "A", text: "$33$" }, { key: "B", text: "$34$" }, { key: "C", text: "$50$" }, { key: "D", text: "$66$" },
    ],
    answer: "B",
    solution: "Work mod $3$: if $n\\equiv0$, $n^2+n+1\\equiv1$; if $n\\equiv1$, $\\equiv3\\equiv0$; if $n\\equiv2$, $\\equiv4+2+1=7\\equiv1$. So it is divisible only when $n\\equiv1\\pmod3$. In $1..100$ these are $1,4,\\dots,100$: $\\tfrac{100-1}{3}+1=34$.",
    hint: "Check $n^2+n+1$ for each residue class mod $3$.",
  },
];
