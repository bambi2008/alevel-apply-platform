import type { MCQOptionKey, MCQQuestion, QuestionDifficulty } from "./types";

type Seed = {
  question: string;
  choices: [string, string, string, string, string];
  answer: number;
  solution: string;
  difficulty: QuestionDifficulty;
  hint?: string;
};

const KEYS = ["A", "B", "C", "D", "E"] as const;

function buildQuestion(seed: Seed, index: number): MCQQuestion {
  return {
    id: `esat-calc-plus-${String(index + 1).padStart(2, "0")}`,
    type: "mcq",
    testId: "esat",
    topicId: "esat-math2",
    difficulty: seed.difficulty,
    marks: 1,
    question: seed.question,
    options: seed.choices.map((text, optionIndex) => ({ key: KEYS[optionIndex], text })),
    answer: KEYS[seed.answer] as MCQOptionKey,
    solution: seed.solution,
    hint: seed.hint,
  };
}

const SEEDS: Seed[] = [
  {
    question: "For $f(x)=3x^4-5x^2+2$, find $f'(1)$.",
    choices: ["$-2$", "$0$", "$2$", "$4$", "$12$"], answer: 2, difficulty: 2,
    solution: "$f'(x)=12x^3-10x$, so $f'(1)=12-10=2$.",
  },
  {
    question: "The curve $y=x^3-4x$ has a tangent at $x=2$. What is the tangent's equation?",
    choices: ["$y=4x-8$", "$y=8x-16$", "$y=8x-8$", "$y=12x-24$", "$y=4x$"], answer: 1, difficulty: 2,
    solution: "$y(2)=0$ and $dy/dx=3x^2-4$, giving gradient $8$. Hence $y=8(x-2)=8x-16$.",
  },
  {
    question: "The normal to $y=x^2+3x$ at $x=1$ has gradient",
    choices: ["$5$", "$-5$", "$1/5$", "$-1/5$", "$-1/2$"], answer: 3, difficulty: 2,
    solution: "The tangent gradient is $2(1)+3=5$, so the normal gradient is the negative reciprocal, $-1/5$.",
  },
  {
    question: "The curve $y=x^3-3ax$ has a stationary point at $x=2$. Find $a$.",
    choices: ["$1$", "$2$", "$3$", "$4$", "$6$"], answer: 3, difficulty: 2,
    solution: "$dy/dx=3x^2-3a$. At $x=2$, $12-3a=0$, so $a=4$.",
  },
  {
    question: "A rectangle has perimeter $20$. If its width is $x$, its maximum possible area is",
    choices: ["$20$", "$24$", "$25$", "$40$", "$50$"], answer: 2, difficulty: 2,
    solution: "The other side is $10-x$, so $A=x(10-x)=25-(x-5)^2$. The maximum is $25$.",
  },
  {
    question: "A circle's radius increases at $0.4\,\text{cm s}^{-1}$. At radius $5\,\text{cm}$, the area increases at",
    choices: ["$2\pi$", "$4\pi$", "$5\pi$", "$8\pi$", "$10\pi$"], answer: 1, difficulty: 3,
    solution: "$A=\pi r^2$, so $dA/dt=2\pi r\,dr/dt=2\pi(5)(0.4)=4\pi\,\text{cm}^2\text{s}^{-1}$.",
  },
  {
    question: "Differentiate $(2x-1)^5$.",
    choices: ["$5(2x-1)^4$", "$10(2x-1)^4$", "$10(2x-1)^5$", "$5(2x-1)^6$", "$2(2x-1)^4$"], answer: 1, difficulty: 2,
    solution: "By the chain rule, $5(2x-1)^4\times2=10(2x-1)^4$.",
  },
  {
    question: "If $y=x^2e^x$, then $dy/dx=$",
    choices: ["$2xe^x$", "$x^2e^x$", "$e^x(x^2+2x)$", "$e^x(x+2)$", "$x^2e^{x-1}$"], answer: 2, difficulty: 3,
    solution: "The product rule gives $dy/dx=2xe^x+x^2e^x=e^x(x^2+2x)$.",
  },
  {
    question: "For $x\ne-1$, the derivative of $\dfrac{x-1}{x+1}$ is",
    choices: ["$\dfrac{2}{(x+1)^2}$", "$-\dfrac{2}{(x+1)^2}$", "$\dfrac{1}{x+1}$", "$\dfrac{2x}{(x+1)^2}$", "$0$"], answer: 0, difficulty: 3,
    solution: "The quotient rule gives $[(x+1)-(x-1)]/(x+1)^2=2/(x+1)^2$.",
  },
  {
    question: "The curve $x^2+xy+y^2=7$ passes through $(1,2)$. Find $dy/dx$ there.",
    choices: ["$-4/5$", "$-5/4$", "$4/5$", "$5/4$", "$-1$"], answer: 0, difficulty: 3,
    solution: "Implicit differentiation gives $2x+y+x y'+2yy'=0$, so $y'=-(2x+y)/(x+2y)=-4/5$.",
  },
  {
    question: "For $f(x)=x^4-4x^3$, at which value of $x$ is $f''(x)=0$?",
    choices: ["$0$ only", "$1$ only", "$2$ only", "$0$ or $2$", "$1$ or $3$"], answer: 3, difficulty: 2,
    solution: "$f''(x)=12x^2-24x=12x(x-2)$, which is zero at $x=0$ or $x=2$.",
  },
  {
    question: "The function $f(x)=x^3-6x^2+9x$ has a local maximum at",
    choices: ["$x=0$", "$x=1$", "$x=2$", "$x=3$", "$x=4$"], answer: 1, difficulty: 3,
    solution: "$f'(x)=3(x-1)(x-3)$. Since $f''(1)=6-12<0$, the point at $x=1$ is a local maximum.",
  },
  {
    question: "Evaluate $\int_0^2(3x^2-2x+1)\,dx$.",
    choices: ["$4$", "$6$", "$8$", "$10$", "$12$"], answer: 1, difficulty: 2,
    solution: "An antiderivative is $x^3-x^2+x$. At $2$ this is $8-4+2=6$, and at $0$ it is $0$.",
  },
  {
    question: "Find the total area between $y=x-1$ and the $x$-axis for $0\le x\le3$.",
    choices: ["$1$", "$2$", "$5/2$", "$3$", "$7/2$"], answer: 2, difficulty: 3,
    solution: "The graph crosses at $x=1$. The two triangular areas are $1/2$ and $2$, so the total is $5/2$.",
  },
  {
    question: "Evaluate $\int_0^1 2x(x^2+1)^3\,dx$.",
    choices: ["$7/4$", "$15/4$", "$4$", "$5$", "$8$"], answer: 1, difficulty: 3,
    solution: "Put $u=x^2+1$, $du=2x\,dx$. The limits become $1$ and $2$, so the integral is $[u^4/4]_1^2=15/4$.",
  },
  {
    question: "For $a>0$, $\int_0^a(2x+1)\,dx=15$. Find $a$.",
    choices: ["$2$", "$3$", "$4$", "$5$", "$6$"], answer: 1, difficulty: 2,
    solution: "$[x^2+x]_0^a=a^2+a=15$, so $(a-3)(a+5)=0$. Since $a>0$, $a=3$.",
  },
  {
    question: "The mean value of $f(x)=x^2$ on $0\le x\le3$ is",
    choices: ["$1$", "$2$", "$3$", "$9/2$", "$9$"], answer: 2, difficulty: 3,
    solution: "The mean value is $\frac1{3}\int_0^3x^2dx=\frac13[x^3/3]_0^3=3$.",
  },
  {
    question: "A particle has displacement $s=t^3-6t^2+9t$. At what positive times is it instantaneously at rest?",
    choices: ["$t=1$ only", "$t=3$ only", "$t=1$ or $3$", "$t=2$ or $4$", "$t=3$ or $6$"], answer: 2, difficulty: 3,
    solution: "$v=ds/dt=3(t-1)(t-3)$. Thus $v=0$ at $t=1$ and $t=3$.",
  },
  {
    question: "Find the area enclosed by $y=4x-x^2$ and $y=x^2$.",
    choices: ["$4/3$", "$2$", "$8/3$", "$4$", "$16/3$"], answer: 2, difficulty: 3,
    solution: "The curves meet at $x=0,2$. Area $=\int_0^2(4x-2x^2)dx=[2x^2-2x^3/3]_0^2=8/3$.",
  },
  {
    question: "Evaluate $\int_{-2}^{2}(x^5+3x^2)\,dx$.",
    choices: ["$0$", "$8$", "$12$", "$16$", "$24$"], answer: 3, difficulty: 3,
    solution: "$x^5$ is odd, so its symmetric integral is zero. Thus the value is $3[x^3/3]_{-2}^{2}=16$.",
  },
  {
    question: "Let $F(x)=\int_1^{x^2}(t^2+1)\,dt$. Find $F'(1)$.",
    choices: ["$1$", "$2$", "$3$", "$4$", "$6$"], answer: 3, difficulty: 3,
    solution: "By the fundamental theorem and chain rule, $F'(x)=((x^2)^2+1)(2x)=2x(x^4+1)$, so $F'(1)=4$.",
  },
  {
    question: "For $f(x)=x^3-3x$, the signed area $\int_{-1}^{2}f(x)\,dx$ equals",
    choices: ["$-9/4$", "$-3/4$", "$0$", "$3/4$", "$9/4$"], answer: 0, difficulty: 3,
    solution: "An antiderivative is $x^4/4-3x^2/2$. Its values at $2$ and $-1$ are $-2$ and $1/4$, giving $-9/4$.",
  },
  {
    question: "The curve $y=x^3+px^2+3x$ has exactly one stationary point. Which condition is required?",
    choices: ["$p^2<9$", "$p^2=9$", "$p^2>9$", "$p=0$", "$p>3$"], answer: 1, difficulty: 3,
    solution: "$y'=3x^2+2px+3$. Exactly one stationary point means this quadratic has one repeated root: $(2p)^2-36=0$, so $p^2=9$.",
  },
  {
    question: "A curve satisfies $dy/dx=6x-4$ and passes through $(2,5)$. Find $y(0)$.",
    choices: ["$-1$", "$1$", "$3$", "$5$", "$9$"], answer: 1, difficulty: 2,
    solution: "$y=3x^2-4x+C$. Using $(2,5)$ gives $5=12-8+C$, hence $C=1$ and $y(0)=1$.",
  },
];

export const ESAT_CALCULUS_INTENSIFICATION_QUESTIONS = SEEDS.map(buildQuestion);
