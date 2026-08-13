import type { MCQOptionKey, MCQQuestion, QuestionDifficulty } from "@/lib/tests/questions/types";

type Seed = [string, [string, string, string, string, string], number, string, QuestionDifficulty, string];
const KEYS = ["A", "B", "C", "D", "E"] as const;

function buildModule(moduleNumber: number, seeds: Seed[]): MCQQuestion[] {
  return seeds.map(([question, choices, answerIndex, solution, difficulty, topicId], index) => ({
    id: `esat-math-pressure-${moduleNumber}-${String(index + 1).padStart(2, "0")}`,
    type: "mcq",
    testId: "esat",
    topicId,
    difficulty,
    marks: 1,
    question,
    options: choices.map((text, optionIndex) => ({ key: KEYS[optionIndex], text })),
    answer: KEYS[answerIndex] as MCQOptionKey,
    solution,
  }));
}

const MODULE_1: Seed[] = [
  ["Evaluate $\\dfrac78-\\dfrac13$.", ["$\\frac5{24}$", "$\\frac{11}{24}$", "$\\frac{13}{24}$", "$\\frac{17}{24}$", "$\\frac12$"], 2, "Using denominator $24$: $21/24-8/24=13/24$.", 1, "esat-math1"],
  ["Two quantities are in the ratio $3:5$ and total $64$. Find the smaller quantity.", ["$16$", "$20$", "$24$", "$32$", "$40$"], 2, "There are $8$ parts, each worth $8$; the smaller quantity is $3\\times8=24$.", 1, "esat-math1"],
  ["Write $0.000072$ in standard form.", ["$7.2\\times10^{-6}$", "$7.2\\times10^{-5}$", "$7.2\\times10^{-4}$", "$72\\times10^{-5}$", "$0.72\\times10^{-4}$"], 1, "Moving the decimal point five places gives $7.2\\times10^{-5}$.", 1, "esat-math1"],
  ["Solve $4(2x-3)=20$.", ["$2$", "$3$", "$4$", "$5$", "$7$"], 2, "$8x-12=20$, hence $8x=32$ and $x=4$.", 1, "esat-math1"],
  ["If $x+y=7$ and $2x-y=5$, find $x$.", ["$2$", "$3$", "$4$", "$5$", "$6$"], 2, "Adding the equations gives $3x=12$, so $x=4$.", 2, "esat-math1"],
  ["The roots of $x^2-7x+12=0$ are", ["$1,12$", "$2,6$", "$3,4$", "$-3,-4$", "$-2,-6$"], 2, "Factorising gives $(x-3)(x-4)=0$.", 2, "esat-math1"],
  ["Solve $|2x-3|<5$.", ["$-4<x<1$", "$-1<x<4$", "$-1<x<1$", "$x<-1$ or $x>4$", "$0<x<4$"], 1, "$-5<2x-3<5$, so $-2<2x<8$ and $-1<x<4$.", 2, "esat-math1"],
  ["The sequence $2,6,12,20,\\ldots$ has $n$th term $n(n+1)$. Its sixth term is", ["$30$", "$36$", "$40$", "$42$", "$48$"], 3, "$6(6+1)=42$.", 2, "esat-math1"],
  ["Solve $9^x=27$.", ["$1$", "$3/2$", "$2$", "$5/2$", "$3$"], 1, "$3^{2x}=3^3$, so $2x=3$ and $x=3/2$.", 2, "esat-math1"],
  ["Solve $\\log_2(x-1)=3$.", ["$4$", "$7$", "$8$", "$9$", "$10$"], 3, "$x-1=2^3=8$, so $x=9$.", 2, "esat-math1"],
  ["Find the gradient of the line through $(2,-1)$ and $(6,7)$.", ["$1/2$", "$1$", "$2$", "$3$", "$4$"], 2, "Gradient $=(7-(-1))/(6-2)=8/4=2$.", 2, "esat-math4"],
  ["The line $x=3$ cuts the circle $x^2+y^2=25$ at two points. Find the distance between them.", ["$4$", "$6$", "$8$", "$10$", "$16$"], 2, "$9+y^2=25$, so $y=\\pm4$; the vertical separation is $8$.", 2, "esat-math4"],
  ["Evaluate $\\sin30^\\circ+\\cos60^\\circ$.", ["$0$", "$1/2$", "$1$", "$\\sqrt2$", "$2$"], 2, "Both exact values are $1/2$, so their sum is $1$.", 2, "esat-math4"],
  ["For $0^\\circ\\le x\\le180^\\circ$, solve $2\\sin x=1$.", ["$30^\\circ$ only", "$150^\\circ$ only", "$30^\\circ,150^\\circ$", "$60^\\circ,120^\\circ$", "$45^\\circ,135^\\circ$"], 2, "$\\sin x=1/2$ in quadrants I and II, giving $30^\\circ$ and $150^\\circ$.", 2, "esat-math4"],
  ["Find the magnitude of the vector $\\begin{pmatrix}3\\\\-4\\end{pmatrix}$.", ["$1$", "$4$", "$5$", "$7$", "$25$"], 2, "The magnitude is $\\sqrt{3^2+(-4)^2}=5$.", 2, "esat-math4"],
  ["Given $P(A)=0.6$, $P(B)=0.5$ and $P(A\\cap B)=0.3$, find $P(A\\mid B)$.", ["$0.1$", "$0.3$", "$0.5$", "$0.6$", "$0.9$"], 3, "$P(A\\mid B)=P(A\\cap B)/P(B)=0.3/0.5=0.6$.", 2, "esat-math3"],
  ["How many unordered pairs can be selected from $6$ distinct objects?", ["$6$", "$12$", "$15$", "$20$", "$30$"], 2, "$\\binom62=6\\times5/2=15$.", 2, "esat-math3"],
  ["Four values have mean $5$. After adding a fifth value of $10$, the new mean is", ["$5$", "$6$", "$6.5$", "$7$", "$7.5$"], 1, "The original total is $20$; the new mean is $(20+10)/5=6$.", 3, "esat-math3"],
  ["For $y=(x^2+1)^3$, find $dy/dx$ at $x=1$.", ["$6$", "$12$", "$18$", "$24$", "$32$"], 3, "$dy/dx=3(x^2+1)^2(2x)$. At $x=1$ this is $3\\times4\\times2=24$.", 3, "esat-math2"],
  ["The function $f(x)=x^3-3x^2-9x$ has a local maximum at", ["$x=-3$", "$x=-1$", "$x=0$", "$x=1$", "$x=3$"], 1, "$f'(x)=3(x-3)(x+1)$. Since $f''(-1)<0$, the maximum occurs at $x=-1$.", 3, "esat-math2"],
  ["Find the tangent to $y=x+1/x$ at $x=1$.", ["$y=x+1$", "$y=2x$", "$y=2$", "$y=x+2$", "$y=1$"], 2, "$y(1)=2$ and $dy/dx=1-1/x^2=0$ at $x=1$, so the tangent is $y=2$.", 3, "esat-math2"],
  ["Evaluate $\\int_0^1(4x^3+2x)\\,dx$.", ["$1$", "$3/2$", "$2$", "$5/2$", "$3$"], 2, "$[x^4+x^2]_0^1=2$.", 3, "esat-math2"],
  ["Find the area enclosed by $y=2x$ and $y=x^2$.", ["$2/3$", "$1$", "$4/3$", "$2$", "$8/3$"], 2, "The curves meet at $0,2$. Area $=\\int_0^2(2x-x^2)dx=4/3$.", 3, "esat-math2"],
  ["A particle has displacement $s=t^4-4t^2$. Find its acceleration at $t=1$.", ["$-8$", "$-4$", "$0$", "$4$", "$8$"], 3, "$v=4t^3-8t$ and $a=12t^2-8$, so $a(1)=4$.", 3, "esat-math2"],
  ["A rectangle with upper corners on $y=12-x^2$ is symmetric about the $y$-axis and has its base on the $x$-axis. Its maximum area is", ["$24$", "$28$", "$32$", "$36$", "$48$"], 2, "Area $A=2x(12-x^2)$. Then $A'=24-6x^2=0$ gives $x=2$, and $A=4(8)=32$.", 3, "esat-math2"],
  ["The polynomial $x^3+ax^2+bx+6$ has roots $1$, $2$ and $c$. Find $a+b$.", ["$-9$", "$-7$", "$-5$", "$5$", "$7$"], 1, "The product of the roots is $-6$, so $c=-3$. Their sum is $0$, giving $a=0$; their pairwise-product sum is $b=2-3-6=-7$. Hence $a+b=-7$.", 3, "esat-math1"],
  ["If $f(x)=2x+3$, find $f^{-1}(11)$.", ["$3$", "$4$", "$5$", "$7$", "$19$"], 1, "Solve $2x+3=11$, giving $x=4$.", 3, "esat-math1"],
];

const MODULE_2: Seed[] = [
  ["After a $20\\%$ increase, a quantity is $120$. Its original value was", ["$80$", "$90$", "$96$", "$100$", "$110$"], 3, "Original value $=120/1.2=100$.", 1, "esat-math1"],
  ["A car travels $150$ km in $2.5$ hours. Its average speed is", ["$50$", "$55$", "$60$", "$65$", "$75$"], 2, "$150/2.5=60$ km h$^{-1}$.", 1, "esat-math1"],
  ["Solve $\sqrt{x+9}-\sqrt{x}=1$ for $x\ge0$.", ["$4$", "$9$", "$12$", "$16$", "$25$"], 3, "Rearrange to $\sqrt{x+9}=\sqrt{x}+1$ and square: $x+9=x+1+2\sqrt{x}$. Thus $\sqrt{x}=4$ and $x=16$.", 2, "esat-math1"],
  ["Simplify $\\sqrt{50}-\\sqrt8$.", ["$\\sqrt2$", "$2\\sqrt2$", "$3\\sqrt2$", "$5\\sqrt2$", "$7\\sqrt2$"], 2, "$\\sqrt{50}=5\\sqrt2$ and $\\sqrt8=2\\sqrt2$, so the result is $3\\sqrt2$.", 2, "esat-math1"],
  ["If $3x+2y=16$ and $x-y=2$, find $y$.", ["$1$", "$2$", "$3$", "$4$", "$5$"], 1, "From $x=y+2$, substitution gives $3y+6+2y=16$, so $y=2$.", 2, "esat-math1"],
  ["The minimum value of $x^2-8x+3$ is", ["$-16$", "$-13$", "$-5$", "$3$", "$13$"], 1, "$x^2-8x+3=(x-4)^2-13$, whose minimum is $-13$.", 2, "esat-math1"],
  ["Solve $(x-2)(x+1)>0$.", ["$-1<x<2$", "$x<-1$ or $x>2$", "$x<2$", "$x>-1$", "$x<-2$ or $x>1$"], 1, "The product is positive outside its roots, so $x<-1$ or $x>2$.", 2, "esat-math1"],
  ["The sixth term of $3,6,12,24,\\ldots$ is", ["$48$", "$72$", "$96$", "$128$", "$192$"], 2, "$u_n=3\\cdot2^{n-1}$, so $u_6=3\\cdot32=96$.", 2, "esat-math1"],
  ["Evaluate $\\log_{10}(0.001)$.", ["$-3$", "$-2$", "$-1$", "$1/3$", "$3$"], 0, "$0.001=10^{-3}$.", 2, "esat-math1"],
  ["Let $f(x)=x^2+1$ and $g(x)=2x-3$. Find $f(g(2))$.", ["$1$", "$2$", "$3$", "$4$", "$5$"], 1, "$g(2)=1$ and $f(1)=2$.", 2, "esat-math1"],
  ["A line perpendicular to $y=-\\frac23x+5$ has gradient", ["$-3/2$", "$-2/3$", "$2/3$", "$3/2$", "$2$"], 3, "The perpendicular gradient is the negative reciprocal, $3/2$.", 2, "esat-math4"],
  ["The tangent to $x^2+y^2=25$ at $(3,4)$ has gradient", ["$-4/3$", "$-3/4$", "$3/4$", "$4/3$", "$0$"], 1, "Implicit differentiation gives $2x+2yy'=0$, so $y'=-x/y=-3/4$.", 2, "esat-math4"],
  ["Evaluate $\\tan45^\\circ+\\sin30^\\circ$.", ["$1/2$", "$1$", "$3/2$", "$\\sqrt2$", "$2$"], 2, "$\\tan45^\\circ=1$ and $\\sin30^\\circ=1/2$, giving $3/2$.", 2, "esat-math4"],
  ["For $0^\\circ\\le x\\le180^\\circ$, solve $\\cos(2x)=0$.", ["$x=45^\\circ$ only", "$x=90^\\circ$ only", "$x=45^\\circ,135^\\circ$", "$x=30^\\circ,150^\\circ$", "$x=0^\\circ,180^\\circ$"], 2, "$2x=90^\\circ$ or $270^\\circ$, so $x=45^\\circ$ or $135^\\circ$.", 2, "esat-math4"],
  ["The vectors $\\begin{pmatrix}2\\\\1\\end{pmatrix}$ and $\\begin{pmatrix}3\\\\-6\\end{pmatrix}$ are", ["parallel", "perpendicular", "equal", "opposite", "of equal magnitude"], 1, "Their dot product is $2(3)+1(-6)=0$, so they are perpendicular.", 2, "esat-math4"],
  ["Two fair dice are rolled. The probability of at least one six is", ["$1/6$", "$5/18$", "$11/36$", "$1/3$", "$25/36$"], 2, "Use the complement: $1-(5/6)^2=11/36$.", 2, "esat-math3"],
  ["How many distinct arrangements are there of the letters in LEVEL?", ["$20$", "$30$", "$60$", "$90$", "$120$"], 1, "There are $5!/(2!2!)=30$ arrangements because L and E each repeat twice.", 3, "esat-math3"],
  ["Every value in a data set is multiplied by $3$. Its variance is multiplied by", ["$3$", "$6$", "$9$", "$12$", "$27$"], 2, "Variance scales with the square of the multiplier, so it is multiplied by $3^2=9$.", 3, "esat-math3"],
  ["For $f(x)=\\dfrac{x}{x^2+1}$, find $f'(1)$.", ["$-1/2$", "$-1/4$", "$0$", "$1/4$", "$1/2$"], 2, "$f'(x)=(1-x^2)/(x^2+1)^2$, so $f'(1)=0$.", 3, "esat-math2"],
  ["The curve $xy+x+y=5$ passes through $(1,2)$. Find $dy/dx$ there.", ["$-3$", "$-3/2$", "$-2/3$", "$1/2$", "$3/2$"], 1, "Implicit differentiation gives $y+xy'+1+y'=0$. At $(1,2)$, $3+2y'=0$, so $y'=-3/2$.", 3, "esat-math2"],
  ["Find the normal to $y=x^3$ at $(1,1)$.", ["$y-1=-3(x-1)$", "$y-1=-\\frac13(x-1)$", "$y-1=\\frac13(x-1)$", "$y-1=3(x-1)$", "$y=x$"], 1, "The tangent gradient is $3$, so the normal gradient is $-1/3$.", 3, "esat-math2"],
  ["Evaluate $\\int_{-1}^{1}(2x^3+3)\\,dx$.", ["$0$", "$3$", "$4$", "$6$", "$8$"], 3, "The odd term integrates to zero over symmetric limits; $\\int_{-1}^1 3dx=6$.", 3, "esat-math2"],
  ["Find the total area between $y=x^2-1$ and the $x$-axis for $-1\\le x\\le1$.", ["$2/3$", "$1$", "$4/3$", "$3/2$", "$2$"], 2, "Here $x^2-1\\le0$, so area $=\\int_{-1}^1(1-x^2)dx=4/3$.", 3, "esat-math2"],
  ["A particle has velocity $v=3t^2-12t+9$. Its minimum velocity is", ["$-6$", "$-3$", "$0$", "$3$", "$9$"], 1, "The quadratic has its vertex at $t=2$, where $v=12-24+9=-3$.", 3, "esat-math2"],
  ["For $x>0$, the minimum value of $x+9/x$ is", ["$3$", "$5$", "$6$", "$9$", "$10$"], 2, "The derivative $1-9/x^2$ vanishes at $x=3$; the value is $3+3=6$.", 3, "esat-math2"],
  ["The line $y=kx-4$ is tangent to $y=x^2$. Which condition holds?", ["$k=0$", "$k=2$", "$k=4$ only", "$k=-4$ only", "$k=\\pm4$"], 4, "Intersection gives $x^2-kx+4=0$. Tangency requires $k^2-16=0$, so $k=\\pm4$.", 3, "esat-math1"],
  ["A sequence satisfies $u_{n+1}=2u_n-1$ and $u_1=4$. Find $u_4$.", ["$13$", "$15$", "$17$", "$21$", "$25$"], 4, "$u_2=7$, $u_3=13$, and $u_4=2(13)-1=25$.", 3, "esat-math1"],
];

export const ESAT_MATH_PRESSURE_1 = buildModule(1, MODULE_1);
export const ESAT_MATH_PRESSURE_2 = buildModule(2, MODULE_2);
