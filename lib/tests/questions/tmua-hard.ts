// TMUA 高难度加练题（全部原创，参照 TMUA 推理/逻辑题型与难度，不含真题）。五选一 A–E。
import type { MCQQuestion } from "@/lib/tests/questions/types";

export const TMUA_HARD: MCQQuestion[] = [
  {
    id: "tmua-hard-001", type: "mcq", testId: "tmua", topicId: "tmua-algebra", difficulty: 3, marks: 1,
    question: "How many real values of $x$ satisfy $|x-2| + |x+3| = 5$?",
    options: [
      { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" },
      { key: "D", text: "infinitely many" }, { key: "E", text: "exactly $5$" },
    ],
    answer: "D",
    solution: "$|x-2|+|x+3|$ is the total distance from $x$ to $2$ and to $-3$. Its minimum value is the gap $|2-(-3)|=5$, attained for every $x$ in $[-3,2]$. So the equation holds for all such $x$: infinitely many solutions.",
    hint: "Interpret the sum of absolute values as distances on the number line.",
  },
  {
    id: "tmua-hard-002", type: "mcq", testId: "tmua", topicId: "tmua-calc", difficulty: 3, marks: 1,
    question: "How many stationary points does $f(x)=x^3-3x^2+3x-1$ have?",
    options: [
      { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" },
      { key: "D", text: "$3$" }, { key: "E", text: "infinitely many" },
    ],
    answer: "B",
    solution: "$f'(x)=3x^2-6x+3=3(x-1)^2$. This is zero only at $x=1$ (a repeated root), so there is exactly one stationary point (a point of inflection).",
    hint: "Factorise $f'(x)$ and count its distinct roots.",
  },
  {
    id: "tmua-hard-003", type: "mcq", testId: "tmua", topicId: "tmua-logic", difficulty: 3, marks: 1,
    question: "Consider the statement: 'If it rains, then the match is cancelled.' Given that the match was not cancelled, which conclusion is logically valid?",
    options: [
      { key: "A", text: "It rained" }, { key: "B", text: "It did not rain" },
      { key: "C", text: "The match was cancelled" }, { key: "D", text: "Nothing can be concluded" },
      { key: "E", text: "It will rain later" },
    ],
    answer: "B",
    solution: "The contrapositive of 'rain $\\Rightarrow$ cancelled' is 'not cancelled $\\Rightarrow$ not rain', which is logically equivalent to the original. Since the match was not cancelled, it did not rain.",
    hint: "Use the contrapositive, which is always logically equivalent.",
  },
  {
    id: "tmua-hard-004", type: "mcq", testId: "tmua", topicId: "tmua-discrete", difficulty: 3, marks: 1,
    question: "How many subsets of $\\{1,2,3,4,5\\}$ contain at least one even number?",
    options: [
      { key: "A", text: "$24$" }, { key: "B", text: "$28$" }, { key: "C", text: "$16$" },
      { key: "D", text: "$8$" }, { key: "E", text: "$20$" },
    ],
    answer: "A",
    solution: "There are $2^5=32$ subsets in total. Those with no even number use only $\\{1,3,5\\}$: there are $2^3=8$ of them. So subsets with at least one even number: $32-8=24$.",
    hint: "Count the complement — subsets containing no even number.",
  },
  {
    id: "tmua-hard-005", type: "mcq", testId: "tmua", topicId: "tmua-stats", difficulty: 3, marks: 1,
    question: "A fair coin is tossed $4$ times. Given that at least one head appears, what is the probability of exactly two heads?",
    options: [
      { key: "A", text: "$\\tfrac{2}{5}$" }, { key: "B", text: "$\\tfrac{3}{8}$" }, { key: "C", text: "$\\tfrac{1}{2}$" },
      { key: "D", text: "$\\tfrac{6}{16}$" }, { key: "E", text: "$\\tfrac{1}{4}$" },
    ],
    answer: "A",
    solution: "$P(\\text{exactly }2)=\\tfrac{\\binom{4}{2}}{16}=\\tfrac{6}{16}$. $P(\\text{at least }1)=1-\\tfrac{1}{16}=\\tfrac{15}{16}$. The conditional probability is $\\dfrac{6/16}{15/16}=\\dfrac{6}{15}=\\dfrac{2}{5}$.",
    hint: "Use $P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$; here $A\\subset B$.",
  },
  {
    id: "tmua-hard-006", type: "mcq", testId: "tmua", topicId: "tmua-logic", difficulty: 3, marks: 1,
    question: "Given that 'all P are Q' and 'some Q are R', which statement must necessarily be true?",
    options: [
      { key: "A", text: "All P are R" }, { key: "B", text: "Some P are R" }, { key: "C", text: "Some R are P" },
      { key: "D", text: "None of these must be true" }, { key: "E", text: "No P are R" },
    ],
    answer: "D",
    solution: "The Q that are R need not be among the P. For example, P = cats, Q = animals, R = birds: all cats are animals and some animals are birds, yet no cat is a bird. So none of the other conclusions is forced.",
    hint: "Try to construct a counterexample for each candidate conclusion.",
  },
];
