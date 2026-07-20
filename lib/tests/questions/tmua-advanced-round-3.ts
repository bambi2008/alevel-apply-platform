import type { MCQOptionKey, MCQQuestion } from "./types";

type TopicId = MCQQuestion["topicId"];

const q = (
  id: string,
  topicId: TopicId,
  difficulty: 2 | 3,
  question: string,
  options: string[],
  answerIndex: number,
  solution: string,
): MCQQuestion => {
  const optionKey = (index: number) => String.fromCharCode(65 + index) as MCQOptionKey;

  return {
  id,
  type: "mcq",
  testId: "tmua",
  topicId,
  difficulty,
  marks: 1,
  question,
  options: options.map((text, index) => ({ key: optionKey(index), text })),
  answer: optionKey(answerIndex),
  solution,
  };
};

// Seven balanced modules, pitched at the middle and upper end of TMUA practice.
// These are original questions informed by the public specification, not past-paper copies.
export const TMUA_ADVANCED_ROUND_3: MCQQuestion[] = [
  // Algebra and functions
  q("tmua-r3-a01", "tmua-algebra", 3, "The roots of $x^2-5x+3=0$ are $\\alpha$ and $\\beta$. What is $1/\\alpha+1/\\beta$?", ["$3/5$", "$5/3$", "$2$", "$5$", "$8/3$"], 1, "By Vieta, $\\alpha+\\beta=5$ and $\\alpha\\beta=3$. Hence $1/\\alpha+1/\\beta=(\\alpha+\\beta)/(\\alpha\\beta)=5/3$."),
  q("tmua-r3-a02", "tmua-algebra", 2, "How many real solutions does $|x-1|+|x+1|=4$ have?", ["$0$", "$1$", "$2$", "$3$", "$4$"], 2, "For $-1\\le x\\le1$ the left side is $2$. Outside that interval it is $2|x|$, so equality holds at $x=\\pm2$: two solutions."),
  q("tmua-r3-a03", "tmua-algebra", 3, "For which real values of $k$ is $x^2+2kx+4\\ge0$ for every real $x$?", ["$k\\le-2$", "$-2\\le k\\le2$", "$k\\ge2$", "$|k|<4$", "all real $k$"], 1, "The leading coefficient is positive, so the quadratic is non-negative everywhere exactly when its discriminant is non-positive: $4k^2-16\\le0$, giving $|k|\\le2$."),
  q("tmua-r3-a04", "tmua-algebra", 3, "What is the coefficient of $x^4$ in $(1+x)^6(1-x)^2$?", ["$-20$", "$-10$", "$0$", "$10$", "$20$"], 1, "The coefficient is $\\binom64-2\\binom63+\\binom62=15-40+15=-10$."),
  q("tmua-r3-a05", "tmua-algebra", 2, "Let $f(x)=2x-3$. Which value of $x$ satisfies $f(f(x))=x$?", ["$-3$", "$0$", "$1$", "$3$", "$9$"], 3, "$f(f(x))=2(2x-3)-3=4x-9$. Thus $4x-9=x$, so $x=3$."),
  q("tmua-r3-a06", "tmua-algebra", 2, "How many distinct real roots does $x^4-5x^2+4=0$ have?", ["$0$", "$1$", "$2$", "$3$", "$4$"], 4, "Put $u=x^2$. Then $(u-1)(u-4)=0$, so $x=\\pm1,\\pm2$, giving four distinct roots."),
  q("tmua-r3-a07", "tmua-algebra", 3, "A polynomial $p(x)$ leaves remainder $5$ when divided by $x-2$ and remainder $-4$ when divided by $x+1$. What is the remainder when $p(x)$ is divided by $(x-2)(x+1)$?", ["$3x-1$", "$3x+1$", "$x+3$", "$5x-4$", "$9x-13$"], 0, "Write the linear remainder as $ax+b$. Then $2a+b=5$ and $-a+b=-4$. Hence $a=3$, $b=-1$, so the remainder is $3x-1$."),
  q("tmua-r3-a08", "tmua-algebra", 2, "How many positive real solutions does $\\log_2x+\\log_2(8/x)=3$ have?", ["$0$", "$1$", "$2$", "$3$", "infinitely many"], 4, "For every $x>0$, the left side is $\\log_2(8)=3$. Therefore every positive real $x$ is a solution."),
  q("tmua-r3-a09", "tmua-algebra", 3, "A geometric sequence satisfies $a_1+a_2=6$ and $a_2+a_3=12$. What is $a_4$?", ["$8$", "$12$", "$16$", "$18$", "$24$"], 2, "The second sum is $r(a_1+a_2)$, so $r=2$. Then $a_1(1+r)=6$ gives $a_1=2$, and $a_4=2\\cdot2^3=16$."),
  q("tmua-r3-a10", "tmua-algebra", 3, "How many integer values of $x$ satisfy $(x-2)/(x+1)<0$?", ["$0$", "$1$", "$2$", "$3$", "infinitely many"], 2, "The quotient is negative between its critical values, so $-1<x<2$. The integer solutions are $0$ and $1$."),

  // Calculus
  q("tmua-r3-c01", "tmua-calc", 2, "For $x>0$, what is the minimum value of $x+9/x$?", ["$3$", "$6$", "$9$", "$10$", "$18$"], 1, "By AM-GM, $x+9/x\\ge2\\sqrt9=6$, with equality at $x=3$."),
  q("tmua-r3-c02", "tmua-calc", 3, "Evaluate $\\int_0^1|2x-1|\\,dx$.", ["$1/4$", "$1/2$", "$3/4$", "$1$", "$3/2$"], 1, "Split at $x=1/2$. The two congruent triangular regions each have area $1/4$, so the integral is $1/2$."),
  q("tmua-r3-c03", "tmua-calc", 2, "A differentiable function has $f'(x)=(x-1)(x+2)$. At which value of $x$ does $f$ have a local maximum?", ["$-2$", "$-1$", "$0$", "$1$", "$2$"], 0, "The derivative changes from positive to negative at $x=-2$, giving a local maximum. At $x=1$ it changes from negative to positive."),
  q("tmua-r3-c04", "tmua-calc", 3, "What is the finite area enclosed by $y=x^2$ and $y=2x$?", ["$2/3$", "$1$", "$4/3$", "$2$", "$8/3$"], 2, "The curves meet at $x=0,2$. The area is $\\int_0^2(2x-x^2)\\,dx=[x^2-x^3/3]_0^2=4/3$."),
  q("tmua-r3-c05", "tmua-calc", 3, "If $y=\\sqrt{1+x^2}$, what is $dy/dx$ at $x=\\sqrt3$?", ["$1/2$", "$\\sqrt3/2$", "$1$", "$2/\\sqrt3$", "$\\sqrt3$"], 1, "$dy/dx=x/\\sqrt{1+x^2}$. At $x=\\sqrt3$ this is $\\sqrt3/2$."),
  q("tmua-r3-c06", "tmua-calc", 2, "The positive number $a$ satisfies $\\int_0^a2x\\,dx=9$. What is $a$?", ["$2$", "$3$", "$9/2$", "$6$", "$9$"], 1, "The integral is $[x^2]_0^a=a^2$. Since $a>0$ and $a^2=9$, $a=3$."),
  q("tmua-r3-c07", "tmua-calc", 3, "The tangent to $y=x^3$ at $x=1$ meets the $x$-axis at which $x$-coordinate?", ["$-2/3$", "$0$", "$1/3$", "$2/3$", "$1$"], 3, "The tangent has gradient $3$ and equation $y-1=3(x-1)$, or $y=3x-2$. Setting $y=0$ gives $x=2/3$."),
  q("tmua-r3-c08", "tmua-calc", 3, "What is the maximum value of $x^2(6-x)$ on $0\\le x\\le6$?", ["$24$", "$27$", "$32$", "$36$", "$48$"], 2, "Differentiating gives $3x(4-x)$. The interior maximum is at $x=4$, where the value is $16\\cdot2=32$; both endpoints give zero."),
  q("tmua-r3-c09", "tmua-calc", 3, "How many stationary points does $f(x)=x^2e^x$ have?", ["$0$", "$1$", "$2$", "$3$", "infinitely many"], 2, "$f'(x)=e^x(x^2+2x)=e^xx(x+2)$. Since $e^x$ is never zero, the stationary points occur at $x=0$ and $x=-2$."),
  q("tmua-r3-c10", "tmua-calc", 2, "What is the average value of $3x^2$ on the interval $0\\le x\\le2$?", ["$2$", "$3$", "$4$", "$6$", "$8$"], 2, "The average value is $\\frac1{2-0}\\int_0^2 3x^2\\,dx=\\frac12[x^3]_0^2=4$."),

  // Probability and statistics
  q("tmua-r3-s01", "tmua-stats", 3, "Two fair dice are rolled. What is the probability that the larger score is exactly $4$?", ["$1/6$", "$7/36$", "$2/9$", "$1/4$", "$5/18$"], 1, "There are $4^2=16$ outcomes with both scores at most $4$, and $3^2=9$ with both at most $3$. The required probability is $(16-9)/36=7/36$."),
  q("tmua-r3-s02", "tmua-stats", 3, "A bag contains $4$ red and $3$ blue counters. Three are selected without replacement. What is the probability of selecting exactly two red counters?", ["$6/35$", "$12/35$", "$18/35$", "$3/5$", "$24/35$"], 2, "There are $\\binom73=35$ selections. Favourable selections number $\\binom42\\binom31=18$, giving $18/35$."),
  q("tmua-r3-s03", "tmua-stats", 2, "A random variable $X$ takes values $0,1,2$ with probabilities $1/4,1/2,1/4$ respectively. What is $E(X)$?", ["$1/2$", "$3/4$", "$1$", "$5/4$", "$3/2$"], 2, "$E(X)=0(1/4)+1(1/2)+2(1/4)=1$."),
  q("tmua-r3-s04", "tmua-stats", 3, "A random variable satisfies $E(X)=2$ and $E(X^2)=7$. What is $\\operatorname{Var}(X)$?", ["$2$", "$3$", "$4$", "$5$", "$7$"], 1, "$\\operatorname{Var}(X)=E(X^2)-[E(X)]^2=7-4=3$."),
  q("tmua-r3-s05", "tmua-stats", 2, "How many distinct arrangements are there of the letters in LEVEL?", ["$20$", "$24$", "$30$", "$60$", "$120$"], 2, "There are five letters with two Ls and two Es, so the number is $5!/(2!2!)=30$."),
  q("tmua-r3-s06", "tmua-stats", 3, "Seven people stand in a line. In how many arrangements are two specified people not adjacent?", ["$720$", "$1440$", "$2880$", "$3600$", "$4320$"], 3, "There are $7!=5040$ arrangements. Treating the specified pair as a block gives $2\\cdot6!=1440$ adjacent arrangements, leaving $3600$."),
  q("tmua-r3-s07", "tmua-stats", 3, "Events $A$ and $B$ satisfy $P(A)=0.5$, $P(B)=0.4$ and $P(A\\cup B)=0.7$. What is $P(A\\mid B)$?", ["$1/4$", "$2/5$", "$1/2$", "$3/5$", "$3/4$"], 2, "$P(A\\cap B)=0.5+0.4-0.7=0.2$. Hence $P(A\\mid B)=0.2/0.4=1/2$."),
  q("tmua-r3-s08", "tmua-stats", 2, "A subset of a five-element set is chosen uniformly at random from all its subsets. What is the expected number of elements chosen?", ["$1$", "$2$", "$5/2$", "$3$", "$5$"], 2, "Each of the five elements is included with probability $1/2$. By linearity of expectation, the expected size is $5/2$."),
  q("tmua-r3-s09", "tmua-stats", 3, "A committee of three is selected from five men and four women. How many possible committees contain at least one woman?", ["$64$", "$70$", "$74$", "$80$", "$84$"], 2, "Subtract all-male committees from all committees: $\\binom93-\\binom53=84-10=74$."),
  q("tmua-r3-s10", "tmua-stats", 2, "A fair die is rolled three times. What is the probability of obtaining exactly one six?", ["$5/72$", "$25/216$", "$25/72$", "$5/12$", "$125/216$"], 2, "Choose which roll is the six, then require two non-sixes: $\\binom31(1/6)(5/6)^2=25/72$."),

  // Logic and proof
  q("tmua-r3-l01", "tmua-logic", 2, "For an integer $n$, which statement correctly describes the condition '$n$ is divisible by $6$'?", ["It is necessary but not sufficient for divisibility by $3$", "It is sufficient but not necessary for divisibility by $3$", "It is necessary and sufficient for divisibility by $3$", "It is neither necessary nor sufficient", "It is equivalent to divisibility by $12$"], 1, "Divisibility by $6$ always implies divisibility by $3$, so it is sufficient. It is not necessary because, for example, $3$ is divisible by $3$ but not by $6$."),
  q("tmua-r3-l02", "tmua-logic", 3, "Suppose $P\\Rightarrow Q$ and $Q\\Rightarrow R$ are true, while $R$ is false. What must be true?", ["$P$ is true", "$Q$ is true", "$P$ and $Q$ are false", "$P$ and $R$ are equivalent", "Nothing follows"], 2, "From the contrapositives, $\\neg R\\Rightarrow\\neg Q$ and then $\\neg Q\\Rightarrow\\neg P$. Therefore both $P$ and $Q$ are false."),
  q("tmua-r3-l03", "tmua-logic", 2, "Which value is a counterexample to the claim 'if $x^2>x$, then $x>1$'?", ["$x=-1$", "$x=0$", "$x=1/2$", "$x=1$", "$x=2$"], 0, "At $x=-1$, $x^2=1>-1$, but $x>1$ is false. This makes the hypothesis true and conclusion false."),
  q("tmua-r3-l04", "tmua-logic", 3, "A proposed proof of $x=y$ starts from $x^2=y^2$ and takes square roots of both sides. What extra condition makes this step valid?", ["$x$ and $y$ are integers", "$x,y\\ge0$", "$x,y\\ne0$", "$x+y>0$", "$x-y>0$"], 1, "In general $x^2=y^2$ gives $|x|=|y|$, so $x$ may equal $-y$. If both values are non-negative, taking principal square roots gives $x=y$."),
  q("tmua-r3-l05", "tmua-logic", 2, "In a proof by induction, after verifying $P(1)$, what must the induction step establish?", ["$P(k)$ is true for one chosen $k$", "$P(k+1)\\Rightarrow P(k)$", "$P(k)\\Rightarrow P(k+1)$ for every relevant $k$", "$P(1)\\Rightarrow P(n)$ directly", "$P(n)$ is true for infinitely many $n$"], 2, "The induction step assumes $P(k)$ and proves $P(k+1)$ for an arbitrary relevant $k$. Together with the base case this propagates the result."),
  q("tmua-r3-l06", "tmua-logic", 3, "What is the negation of 'For every real $x$, there exists a real $y$ such that $y>x$'?", ["For every $x$ and every $y$, $y\\le x$", "There exists an $x$ such that every $y$ satisfies $y\\le x$", "There exists a $y$ greater than every $x$", "For every $x$, there exists a $y$ with $y\\le x$", "There exist $x,y$ with $y\\le x$"], 1, "Negating swaps each quantifier and negates the final inequality: $\\neg(\\forall x\\exists y\, y>x)$ is $\\exists x\\forall y\, y\\le x$."),
  q("tmua-r3-l07", "tmua-logic", 2, "Which expression is logically equivalent to $\\neg(P\\lor Q)$?", ["$\\neg P\\lor\\neg Q$", "$\\neg P\\land\\neg Q$", "$P\\land Q$", "$P\\Rightarrow Q$", "$Q\\Rightarrow P$"], 1, "De Morgan's law gives $\\neg(P\\lor Q)=\\neg P\\land\\neg Q$."),
  q("tmua-r3-l08", "tmua-logic", 3, "For real $a$, the statement '$x^2+a=0$ has a real solution' is equivalent to which condition?", ["$a<0$", "$a\\le0$", "$a=0$", "$a\\ge0$", "$a>0$"], 1, "The equation requires $x^2=-a$. A real square can be any non-negative number, so a real solution exists exactly when $-a\\ge0$, i.e. $a\\le0$."),
  q("tmua-r3-l09", "tmua-logic", 2, "To prove by contradiction that $\\sqrt2$ is irrational, which assumption should be made first?", ["$\\sqrt2$ is negative", "$\\sqrt2$ is rational", "$2$ is irrational", "$\\sqrt2$ is an integer", "$2$ is prime"], 1, "A contradiction proof begins by assuming the negation of the desired conclusion, namely that $\\sqrt2$ is rational."),
  q("tmua-r3-l10", "tmua-logic", 3, "Which pair of implications is exactly equivalent to $P\\Leftrightarrow Q$?", ["$P\\Rightarrow Q$ and $Q\\Rightarrow P$", "$P\\Rightarrow Q$ and $\\neg P\\Rightarrow\\neg Q$", "$Q\\Rightarrow P$ and $\\neg Q\\Rightarrow\\neg P$", "$P\\Rightarrow\\neg Q$ and $Q\\Rightarrow\\neg P$", "$P\\lor Q$ and $\\neg P\\lor\\neg Q$"], 0, "A biconditional means both directions hold: $P$ implies $Q$, and $Q$ implies $P$."),

  // Discrete mathematics
  q("tmua-r3-d01", "tmua-discrete", 2, "A sequence satisfies $a_1=1$ and $a_{n+1}=2a_n+1$. What is $a_5$?", ["$15$", "$23$", "$31$", "$32$", "$63$"], 2, "The terms are $1,3,7,15,31$, so $a_5=31$."),
  q("tmua-r3-d02", "tmua-discrete", 3, "How many onto functions are there from a three-element set to a two-element set?", ["$2$", "$4$", "$6$", "$8$", "$9$"], 2, "There are $2^3=8$ functions in total. Exclude the two constant functions, which each miss one target value, leaving $6$."),
  q("tmua-r3-d03", "tmua-discrete", 3, "How many binary strings of length $6$ contain exactly two $1$s with no two $1$s adjacent?", ["$6$", "$8$", "$10$", "$12$", "$15$"], 2, "Choose two non-adjacent positions from six. Shifting the second chosen position down by one gives $\\binom{5}{2}=10$ choices."),
  q("tmua-r3-d04", "tmua-discrete", 2, "A graph has five vertices with degrees $1,2,2,3,4$. How many edges does it have?", ["$5$", "$6$", "$8$", "$10$", "$12$"], 1, "The degree sum is $12$. By the handshaking lemma this equals twice the number of edges, so there are $6$ edges."),
  q("tmua-r3-d05", "tmua-discrete", 2, "How many edges does a tree with $12$ vertices have?", ["$10$", "$11$", "$12$", "$13$", "$22$"], 1, "Every tree with $n$ vertices has $n-1$ edges, hence a 12-vertex tree has $11$."),
  q("tmua-r3-d06", "tmua-discrete", 2, "What is the least number of people needed to guarantee that two were born in the same month?", ["$12$", "$13$", "$14$", "$24$", "$25$"], 1, "There are 12 months. With 13 people, the pigeonhole principle guarantees that some month contains at least two birthdays."),
  q("tmua-r3-d07", "tmua-discrete", 3, "How many subsets of a ten-element set contain two specified elements and exclude a third specified element?", ["$64$", "$128$", "$256$", "$512$", "$1024$"], 1, "The inclusion or exclusion of the remaining seven elements is unrestricted, giving $2^7=128$ subsets."),
  q("tmua-r3-d08", "tmua-discrete", 3, "How many ordered triples of non-negative integers $(a,b,c)$ satisfy $a+b+c=7$?", ["$21$", "$28$", "$36$", "$42$", "$49$"], 2, "Stars and bars gives $\\binom{7+3-1}{3-1}=\\binom92=36$."),
  q("tmua-r3-d09", "tmua-discrete", 3, "A set has $n$ elements and exactly $64$ subsets. What is $n$?", ["$4$", "$5$", "$6$", "$7$", "$8$"], 2, "An $n$-element set has $2^n$ subsets. Since $64=2^6$, $n=6$."),
  q("tmua-r3-d10", "tmua-discrete", 3, "What is the final digit of $7^{202}$?", ["$1$", "$3$", "$7$", "$9$", "$0$"], 3, "The final digits of powers of $7$ cycle $7,9,3,1$ with period $4$. Since $202\\equiv2\\pmod4$, the final digit is $9$."),

  // Geometry and trigonometry
  q("tmua-r3-g01", "tmua-geometry", 2, "How many points of intersection are there between $x^2+y^2=25$ and $y=4$?", ["$0$", "$1$", "$2$", "$3$", "$4$"], 2, "Substitution gives $x^2+16=25$, so $x=\\pm3$. These give two distinct intersection points."),
  q("tmua-r3-g02", "tmua-geometry", 3, "A triangle has side lengths $5,5,6$. What is its area?", ["$10$", "$12$", "$15$", "$18$", "$24$"], 1, "The altitude to the side of length $6$ bisects it into lengths $3$ and $3$. The altitude is $\\sqrt{5^2-3^2}=4$, so the area is $6\\cdot4/2=12$."),
  q("tmua-r3-g03", "tmua-geometry", 2, "If $\\sin\\theta=3/5$ and $\\theta$ is acute, what is $\\cos2\\theta$?", ["$-7/25$", "$1/5$", "$7/25$", "$16/25$", "$24/25$"], 2, "$\\cos2\\theta=1-2\\sin^2\\theta=1-18/25=7/25$."),
  q("tmua-r3-g04", "tmua-geometry", 2, "A sector has radius $6$ and angle $\\pi/3$ radians. What is its area?", ["$3\\pi$", "$6\\pi$", "$9\\pi$", "$12\\pi$", "$18\\pi$"], 1, "Sector area is $\\frac12r^2\\theta=\\frac12\\cdot36\\cdot\\pi/3=6\\pi$."),
  q("tmua-r3-g05", "tmua-geometry", 3, "Two similar triangles have areas in the ratio $25:49$. What is the ratio of their corresponding side lengths?", ["$5:7$", "$25:49$", "$7:5$", "$10:21$", "$625:2401$"], 0, "Area ratios are the squares of corresponding length ratios. Taking positive square roots gives $5:7$."),
  q("tmua-r3-g06", "tmua-geometry", 3, "What is the area of the triangle with vertices $(0,0)$, $(4,1)$ and $(2,5)$?", ["$7$", "$8$", "$9$", "$10$", "$18$"], 2, "The determinant of vectors $(4,1)$ and $(2,5)$ is $20-2=18$. The triangle's area is half its magnitude, namely $9$."),
  q("tmua-r3-g07", "tmua-geometry", 3, "A tangent at $A$ to a circle makes an angle of $38^\\circ$ with chord $AB$. What angle does chord $AB$ subtend at a point on the opposite arc?", ["$19^\\circ$", "$38^\\circ$", "$52^\\circ$", "$76^\\circ$", "$142^\\circ$"], 1, "By the alternate segment theorem, the angle between the tangent and chord equals the angle subtended by that chord in the opposite arc: $38^\\circ$."),
  q("tmua-r3-g08", "tmua-geometry", 2, "At what point do the lines $y=2x-1$ and $y=5-x$ intersect?", ["$(1,1)$", "$(2,3)$", "$(3,2)$", "$(4,1)$", "$(5,0)$"], 1, "Equating the two expressions gives $2x-1=5-x$, so $x=2$ and $y=3$."),
  q("tmua-r3-g09", "tmua-geometry", 3, "How many solutions does $\\cos(2\\theta)=0$ have for $0\\le\\theta<2\\pi$?", ["$1$", "$2$", "$3$", "$4$", "$8$"], 3, "$2\\theta=\\pi/2+k\\pi$. In the range $0\\le2\\theta<4\\pi$, four values occur, so there are four solutions for $\\theta$."),
  q("tmua-r3-g10", "tmua-geometry", 3, "Two chords intersect inside a circle. One chord is split into lengths $3$ and $8$; the other into lengths $4$ and $x$. What is $x$?", ["$4$", "$5$", "$6$", "$8$", "$12$"], 2, "The intersecting chords theorem gives $3\\cdot8=4x$, hence $x=6$."),

  // Number, ratio and estimation
  q("tmua-r3-n01", "tmua-number", 2, "Two positive integers have highest common factor $6$, lowest common multiple $180$, and one integer is $30$. What is the other integer?", ["$24$", "$30$", "$36$", "$42$", "$60$"], 2, "The product of the two integers equals HCF times LCM. Thus the other integer is $6\\cdot180/30=36$."),
  q("tmua-r3-n02", "tmua-number", 3, "How many integers $n$ with $0\\le n<12$ satisfy $n^2\\equiv1\\pmod{12}$?", ["$1$", "$2$", "$3$", "$4$", "$6$"], 3, "Testing residues, $1,5,7,11$ each have square congruent to $1$ modulo $12$, giving four solutions."),
  q("tmua-r3-n03", "tmua-number", 3, "How many trailing zeros does $50!$ have?", ["$8$", "$10$", "$11$", "$12$", "$13$"], 3, "Count factors of $5$: $\\lfloor50/5\\rfloor+\\lfloor50/25\\rfloor=10+2=12$. There are more than enough factors of $2$."),
  q("tmua-r3-n04", "tmua-number", 2, "The recurring decimal $0.272727\\ldots$ is equal to:", ["$2/9$", "$3/11$", "$27/100$", "$27/90$", "$11/40$"], 1, "Let $x=0.272727\\ldots$. Then $100x-x=27$, so $x=27/99=3/11$."),
  q("tmua-r3-n05", "tmua-number", 3, "A length is recorded as $8.4$ cm correct to the nearest $0.1$ cm. Which interval contains the true length $L$?", ["$8.3\\le L<8.5$", "$8.35\\le L<8.45$", "$8.35<L\\le8.45$", "$8.39\\le L<8.41$", "$8.4\\le L<8.5$"], 1, "Rounding to the nearest $0.1$ gives a half-unit tolerance of $0.05$: $8.35\\le L<8.45$."),
  q("tmua-r3-n06", "tmua-number", 2, "After a $20\\%$ discount, an item costs $72$. What was its original price?", ["$80$", "$86.40$", "$90$", "$92$", "$96$"], 2, "The sale price is $80\\%$ of the original. Thus the original price is $72/0.8=90$."),
  q("tmua-r3-n07", "tmua-number", 3, "The ratio of Alice's age to Ben's age is $3:5$. In eight years it will be $5:7$. How old is Alice now?", ["$10$", "$12$", "$15$", "$18$", "$20$"], 1, "Let the ages be $3k$ and $5k$. Then $(3k+8)/(5k+8)=5/7$, so $21k+56=25k+40$, giving $k=4$ and Alice's age $12$."),
  q("tmua-r3-n08", "tmua-number", 2, "Which expression is rational?", ["$\\sqrt2+1$", "$\\sqrt8/\\sqrt2$", "$\\sqrt3\\sqrt2$", "$1/\\sqrt5$", "$\\sqrt7-2$"], 1, "$\\sqrt8/\\sqrt2=\\sqrt4=2$, which is rational. Each other expression is irrational."),
  q("tmua-r3-n09", "tmua-number", 3, "A positive integer has prime factorisation $2^3\\cdot3^2\\cdot5$. How many positive divisors does it have?", ["$18$", "$20$", "$24$", "$30$", "$36$"], 2, "Choose exponents independently: four choices for the power of $2$, three for $3$, and two for $5$. Thus there are $4\\cdot3\\cdot2=24$ divisors."),
  q("tmua-r3-n10", "tmua-number", 3, "Which option lists all remainders that are impossible when an integer square is divided by $4$?", ["$0$ only", "$1$ only", "$2$ only", "$3$ only", "$2$ and $3$"], 4, "An even square is divisible by $4$, while an odd square is congruent to $1$ modulo $4$. Therefore remainders $2$ and $3$ are both impossible."),
];
