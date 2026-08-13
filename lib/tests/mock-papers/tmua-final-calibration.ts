import type { MCQOptionKey, MCQQuestion, QuestionDifficulty } from "@/lib/tests/questions/types";

const KEYS = "ABCDEFGH" as const;
const COMBINATIONS = [
  "None of I, II and III",
  "III only",
  "II only",
  "II and III only",
  "I only",
  "I and III only",
  "I and II only",
  "I, II and III",
];

function q(
  id: string,
  topicId: string,
  difficulty: QuestionDifficulty,
  question: string,
  options: string[],
  answerIndex: number,
  solution: string,
): MCQQuestion {
  return {
    id,
    type: "mcq",
    testId: "tmua",
    topicId,
    difficulty,
    marks: 1,
    question,
    options: options.map((text, index) => ({ key: KEYS[index] as MCQOptionKey, text })),
    answer: KEYS[answerIndex] as MCQOptionKey,
    solution,
  };
}

export const TMUA_MK1_P1_FINAL: MCQQuestion[] = [
  q("tmua-mk1-final-p1-11", "tmua-algebra", 2, "The roots of $x^2-6x+2=0$ are $\\alpha$ and $\\beta$. What is $1/\\alpha+1/\\beta$?", ["$1/3$", "$1/2$", "$1$", "$3$", "$4$", "$6$"], 3, "By Vieta, $\\alpha+\\beta=6$ and $\\alpha\\beta=2$, so the required sum is $6/2=3$."),
  q("tmua-mk1-final-p1-12", "tmua-stats", 2, "A bag contains three red and two blue counters. Two are drawn without replacement. Given that at least one is red, what is the probability that both are red?", ["$1/5$", "$1/4$", "$3/10$", "$2/5$", "$1/2$", "$1/3$"], 5, "There are $10$ unordered pairs, of which one is blue-blue. Of the remaining nine pairs, three are red-red, giving $3/9=1/3$."),
  q("tmua-mk1-final-p1-13", "tmua-algebra", 2, "What is the range of $f(x)=(x^2+3)/(x^2+1)$ for real $x$?", ["$1<f<3$", "$1\\le f<3$", "$1<f\\le3$", "$1\\le f\\le3$", "$f>1$"], 2, "Since $f=1+2/(x^2+1)$, the value $3$ occurs at $x=0$ while $1$ is approached but never reached. Hence $1<f\\le3$."),
  q("tmua-mk1-final-p1-14", "tmua-geometry", 2, "The line $y=2x+c$ passes through $(1,4)$ and meets the $x$-axis at $P$. What is the distance from $P$ to $(1,4)$?", ["$\\sqrt5$", "$2\\sqrt5$", "$3$", "$4$", "$5$"], 1, "The point gives $c=2$, so the line meets the axis at $(-1,0)$. The distance to $(1,4)$ is $\\sqrt{2^2+4^2}=2\\sqrt5$."),
  q("tmua-mk1-final-p1-15", "tmua-calc", 3, "The curves $y=x^2$ and $y=4x-x^2$ enclose a finite region. What is its area?", ["$4/3$", "$2$", "$8/3$", "$4$", "$16/3$", "$8$"], 2, "They meet at $x=0,2$. The area is $\\int_0^2(4x-2x^2)\\,dx=8/3$."),
  q("tmua-mk1-final-p1-16", "tmua-discrete", 3, "How many arrangements of the letters in LEVEL have no two Es adjacent?", ["$6$", "$12$", "$18$", "$24$", "$30$", "$36$"], 2, "Arrange L,L,V in $3!/2!=3$ ways. Their four gaps provide $\\binom42=6$ positions for the two Es, giving $3\\cdot6=18$."),
  q("tmua-mk1-final-p1-17", "tmua-number", 3, "What is the remainder when $7^{100}+3^{100}$ is divided by $10$?", ["$0$", "$1$", "$2$", "$3$", "$4$", "$5$"], 2, "Both final-digit cycles have period $4$. Thus $7^{100}$ ends in $1$ and $3^{100}$ ends in $1$, so the remainder is $2$."),
  q("tmua-mk1-final-p1-18", "tmua-algebra", 3, "For how many real values of $k$ does $x^2-(k+2)x+2k=0$ have a repeated root?", ["$0$", "$1$", "$2$", "$3$", "$4$"], 1, "A repeated root requires $(k+2)^2-8k=0$, or $(k-2)^2=0$. There is exactly one real value, $k=2$."),
  q("tmua-mk1-final-p1-19", "tmua-calc", 3, "What is the maximum value of $x(6-x)^2$ on $0\\le x\\le6$?", ["$16$", "$24$", "$32$", "$36$", "$48$", "$54$"], 2, "Differentiating gives $(6-x)(6-3x)$, so the interior maximum occurs at $x=2$ and equals $2\\cdot4^2=32$."),
  q("tmua-mk1-final-p1-20", "tmua-geometry", 3, "A circle has centre $(2,-1)$ and is tangent to the line $3x+4y=20$. What is its area?", ["$9\\pi$", "$16\\pi$", "$25\\pi$", "$324\\pi/25$", "$36\\pi$"], 3, "The radius is the perpendicular distance $|6-4-20|/5=18/5$, so the area is $324\\pi/25$."),
];

export const TMUA_MK1_P2_FINAL: MCQQuestion[] = [
  q("tmua-mk1-final-p2-11", "tmua-discrete", 2, "A sequence satisfies $a_1=2$ and $a_{n+1}=a_n+2n+1$.\nI. $a_n=n^2+1$.\nII. Every term is even.\nIII. The sequence is strictly increasing.\nWhich statements are true?", COMBINATIONS, 5, "The recurrence gives $a_n=n^2+1$, and all increments are positive. The parity alternates, so I and III only are true."),
  q("tmua-mk1-final-p2-12", "tmua-number", 2, "For every integer $n$:\nI. $n(n+1)$ is even.\nII. $n^2+n+2$ is even.\nIII. $n^2-n$ is divisible by $4$.\nWhich statements are true?", COMBINATIONS, 6, "I is a product of consecutive integers. Adding $2$ preserves evenness, so II holds. III fails at $n=2$. Thus I and II only."),
  q("tmua-mk1-final-p2-13", "tmua-algebra", 2, "Let $f(x)=x^2$ with domain $x\\ge0$.\nI. $f$ is one-to-one.\nII. The range is $y\\ge0$.\nIII. The inverse is $f^{-1}(x)=\\sqrt{x}$.\nWhich statements are true?", COMBINATIONS, 7, "On the restricted domain, squaring is strictly increasing, has non-negative range, and has the principal square-root inverse. All three hold."),
  q("tmua-mk1-final-p2-14", "tmua-stats", 3, "Events $A$ and $B$ are independent and have probabilities strictly between $0$ and $1$.\nI. $A$ and $B^c$ are independent.\nII. $A^c$ and $B^c$ are independent.\nIII. $A$ and $B$ are mutually exclusive.\nWhich statements are true?", COMBINATIONS, 6, "Independence is preserved on replacing either event by its complement, so I and II hold. Positive-probability independent events have a positive intersection, so III is false."),
  q("tmua-mk1-final-p2-15", "tmua-calc", 3, "Let $f$ be differentiable on an interval.\nI. If $f'(x)>0$ throughout, then $f$ is increasing.\nII. If $f$ is increasing, then $f'(x)>0$ throughout.\nIII. If $f'(x)=0$ throughout, then $f$ is constant.\nWhich statements are true?", COMBINATIONS, 5, "I follows from the mean value theorem. II fails for $f(x)=x^3$ at zero. III also follows from the mean value theorem. Hence I and III only."),
  q("tmua-mk1-final-p2-16", "tmua-geometry", 3, "For every non-degenerate triangle:\nI. The medians are concurrent.\nII. The angle bisectors are concurrent.\nIII. The two points of concurrence are always the same.\nWhich statements are true?", COMBINATIONS, 6, "The medians meet at the centroid and the angle bisectors at the incentre. These need not coincide, so I and II only."),
  q("tmua-mk1-final-p2-17", "tmua-number", 3, "For every integer $n$:\nI. $n^3-n$ is divisible by $3$.\nII. $n^3-n$ is divisible by $6$.\nIII. $n^3-n$ is divisible by $12$.\nWhich statements are true?", COMBINATIONS, 6, "$n^3-n$ is the product of three consecutive integers, hence divisible by $6$. At $n=2$ it is $6$, so III fails. Thus I and II only."),
  q("tmua-mk1-final-p2-18", "tmua-algebra", 3, "For $p(x)=x^2+bx+c$:\nI. If $c<0$, then $p$ has two distinct real roots.\nII. If $p$ has two positive roots, then $b<0$.\nIII. If $b^2<4c$, then $p(x)>0$ for every real $x$.\nWhich statements are true?", COMBINATIONS, 7, "I follows because the product of the roots is negative. II follows from their positive sum $-b$. In III, $c>b^2/4$ makes the upward quadratic's minimum positive. All hold."),
  q("tmua-mk1-final-p2-19", "tmua-discrete", 3, "A finite graph is a tree.\nI. It is connected.\nII. It has no cycles.\nIII. Removing any edge disconnects it.\nWhich statements are true?", COMBINATIONS, 7, "Connectedness and absence of cycles define a tree. Every edge is a bridge because an alternative path would create a cycle. All statements hold."),
  q("tmua-mk1-final-p2-20", "tmua-logic", 3, "A claim has the form $\\forall x\\,P(x)$.\nI. Verifying one value proves the claim.\nII. A single counterexample disproves the claim.\nIII. Its negation is $\\exists x\\,\\neg P(x)$.\nWhich statements are true?", COMBINATIONS, 3, "One example cannot prove a universal statement. One counterexample disproves it, and the stated existential form is its negation. Thus II and III only."),
];

export const TMUA_MK4_P1_FINAL: MCQQuestion[] = [
  q("tmua-mk4-final-p1-11", "tmua-algebra", 2, "If $x+1/x=4$, what is $x^2+1/x^2$?", ["$8$", "$10$", "$12$", "$14$", "$16$"], 3, "Squaring gives $x^2+2+1/x^2=16$, so the required value is $14$."),
  q("tmua-mk4-final-p1-12", "tmua-stats", 2, "Two fair dice are rolled. Given that the scores are different, what is the probability that their sum is $7$?", ["$1/12$", "$1/6$", "$1/5$", "$1/4$", "$1/3$"], 2, "There are $30$ outcomes with unequal scores. Six have sum $7$, giving $6/30=1/5$."),
  q("tmua-mk4-final-p1-13", "tmua-geometry", 2, "The midpoint of $A(2,-3)$ and $B(8,5)$ lies on the line $y=mx+1$. What is $m$?", ["$-1$", "$-1/2$", "$0$", "$1/5$", "$1/2$", "$1$"], 2, "The midpoint is $(5,1)$, so $1=5m+1$ and $m=0$."),
  q("tmua-mk4-final-p1-14", "tmua-number", 2, "How many positive divisors does $2^4\\cdot3^2$ have?", ["$10$", "$12$", "$15$", "$18$", "$20$"], 2, "A divisor chooses the exponent of $2$ in five ways and that of $3$ in three ways, giving $5\\cdot3=15$."),
  q("tmua-mk4-final-p1-15", "tmua-calc", 3, "The tangent to $y=x^3-2x$ at $x=1$ meets the $y$-axis at what value?", ["$-4$", "$-3$", "$-2$", "$-1$", "$0$", "$1$"], 2, "At $x=1$, $y=-1$ and the gradient is $1$. The tangent is $y+1=x-1$, so its intercept is $-2$."),
  q("tmua-mk4-final-p1-16", "tmua-discrete", 3, "How many five-digit numbers formed from $1,2,3,4,5$ without repetition are divisible by $4$?", ["$12$", "$18$", "$24$", "$30$", "$36$", "$48$"], 2, "The possible final pairs are $12,24,32,52$. Each leaves $3!$ orders for the first digits, giving $4\\cdot6=24$."),
  q("tmua-mk4-final-p1-17", "tmua-algebra", 3, "For which real values of $k$ does $x^2-2kx+k+2=0$ have two distinct real roots?", ["$k<-1$", "$k>2$", "$-1<k<2$", "$k<-1$ or $k>2$", "$k\\ne0$"], 3, "The discriminant is $4(k^2-k-2)=4(k-2)(k+1)$, positive exactly when $k<-1$ or $k>2$."),
  q("tmua-mk4-final-p1-18", "tmua-geometry", 3, "A circle has equation $x^2+y^2-6x+8y-11=0$. What is its radius?", ["$3$", "$4$", "$5$", "$6$", "$7$"], 3, "Completing squares gives $(x-3)^2+(y+4)^2=36$, so the radius is $6$."),
  q("tmua-mk4-final-p1-19", "tmua-calc", 3, "Evaluate $\\int_0^2 x(2-x)\\,dx$.", ["$2/3$", "$1$", "$4/3$", "$2$", "$8/3$"], 2, "Integration gives $[x^2-x^3/3]_0^2=4-8/3=4/3$."),
  q("tmua-mk4-final-p1-20", "tmua-number", 3, "What is the smallest positive integer $n$ for which $3^n\\equiv1\\pmod{13}$?", ["$2$", "$3$", "$4$", "$6$", "$12$"], 1, "$3^1\\equiv3$, $3^2\\equiv9$ and $3^3\\equiv27\\equiv1\\pmod{13}$, so the least such $n$ is $3$."),
];

export const TMUA_MK4_P2_FINAL: MCQQuestion[] = [
  q("tmua-mk4-final-p2-11", "tmua-algebra", 2, "Let $f(x)=2x+1$ on the real numbers.\nI. $f$ is one-to-one.\nII. $f$ is onto the real numbers.\nIII. $f^{-1}(x)=(x-1)/2$.\nWhich statements are true?", COMBINATIONS, 7, "A non-constant linear function on the reals is bijective. Solving $y=2x+1$ gives the stated inverse, so all three hold."),
  q("tmua-mk4-final-p2-12", "tmua-number", 2, "For every integer $n$:\nI. $n^2$ and $n$ have the same parity.\nII. $n^2+n$ is even.\nIII. $n^2+n+1$ is even.\nWhich statements are true?", COMBINATIONS, 6, "Squaring preserves parity, and $n(n+1)$ is even. Adding one makes III odd, so I and II only."),
  q("tmua-mk4-final-p2-13", "tmua-geometry", 2, "For two congruent triangles:\nI. Corresponding sides are equal.\nII. Corresponding angles are equal.\nIII. Their areas are equal.\nWhich statements are true?", COMBINATIONS, 7, "All three statements are consequences of congruence."),
  q("tmua-mk4-final-p2-14", "tmua-stats", 3, "Events $A,B$ have positive probability.\nI. If they are mutually exclusive, they are independent.\nII. If they are independent, $P(A\\cap B)=P(A)P(B)$.\nIII. If $A\\subseteq B$, then $P(A\\mid B)=P(A)/P(B)$.\nWhich statements are true?", COMBINATIONS, 3, "I is false for positive-probability mutually exclusive events. II is the definition of independence, and III follows from $A\\cap B=A$. Thus II and III only."),
  q("tmua-mk4-final-p2-15", "tmua-calc", 3, "Let $f$ be twice differentiable near $a$.\nI. If $f'(a)=0$ and $f''(a)>0$, then $a$ is a local minimum.\nII. If $a$ is a local minimum, then $f''(a)>0$.\nIII. If $f''(x)=0$ throughout an interval, then $f$ is linear there.\nWhich statements are true?", COMBINATIONS, 5, "I is the second derivative test. II fails for $f(x)=x^4$ at zero. III follows because $f'$ is constant. Thus I and III only."),
  q("tmua-mk4-final-p2-16", "tmua-discrete", 3, "A finite graph has exactly two vertices of odd degree.\nI. The two vertices lie in the same connected component.\nII. The graph has an Euler trail using every edge if it is connected.\nIII. The graph must be a tree.\nWhich statements are true?", COMBINATIONS, 6, "Each component has an even number of odd-degree vertices, so the two lie together. If connected, exactly two odd vertices give an Euler trail. Cycles may still occur, so III is false."),
  q("tmua-mk4-final-p2-17", "tmua-algebra", 3, "Let $p$ be a real polynomial.\nI. If $p(0)p(1)<0$, then $p$ has a root in $(0,1)$.\nII. If $p$ has a root in $(0,1)$, then $p(0)p(1)<0$.\nIII. If $p(0)=p(1)=0$, then $x(x-1)$ divides $p(x)$.\nWhich statements are true?", COMBINATIONS, 5, "I follows from continuity. II can fail when the graph touches the axis or crosses twice. III follows from the factor theorem. Thus I and III only."),
  q("tmua-mk4-final-p2-18", "tmua-number", 3, "For an integer $n$:\nI. If $6$ divides $n^2$, then $6$ divides $n$.\nII. If $12$ divides $n^2$, then $6$ divides $n$.\nIII. If $8$ divides $n^2$, then $4$ divides $n$.\nWhich statements are true?", COMBINATIONS, 7, "Prime exponents in a square are even. Each condition forces the stated factors of $2$ and $3$ into $n$, so all three hold."),
  q("tmua-mk4-final-p2-19", "tmua-geometry", 3, "For a cyclic quadrilateral:\nI. Opposite angles sum to $180^\\circ$.\nII. An exterior angle equals the opposite interior angle.\nIII. Its diagonals are always perpendicular.\nWhich statements are true?", COMBINATIONS, 6, "I is the cyclic quadrilateral theorem and II follows from it. III is not generally true, so I and II only."),
  q("tmua-mk4-final-p2-20", "tmua-logic", 3, "A statement has the form $\\exists x\\,\\forall y\\,P(x,y)$.\nI. One value of $x$ must work for every $y$.\nII. The value of $x$ may depend on $y$.\nIII. Its negation is $\\forall x\\,\\exists y\\,\\neg P(x,y)$.\nWhich statements are true?", COMBINATIONS, 5, "The existential choice precedes the universal quantifier, so one fixed $x$ must work and II is false. Negating swaps both quantifiers and negates the predicate. Thus I and III only."),
];
