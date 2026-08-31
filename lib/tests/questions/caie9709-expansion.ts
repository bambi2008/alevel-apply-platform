import type { LongPart, LongQuestion } from "./types";

type Input = { id: string; topicId: string; difficulty: 1 | 2 | 3; totalMarks: number; context?: string; parts: LongPart[] };

function q(input: Input): LongQuestion {
  return {
    ...input,
    type: "long",
    testId: "caie9709",
    fullSolution: input.parts.map((part) => `${part.label} ${part.solutionOutline}`).join("\n\n"),
  };
}

export const CAIE9709_P3_MOCK_5: LongQuestion[] = [
  q({ id: "caie9709-p3-m5-q01", topicId: "caie9709-algebra", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve the inequality $|2x-3|<x+1$.", solutionOutline: "右边必须为正。由 $-(x+1)<2x-3<x+1$ 得 $x>2/3$ 且 $x<4$，所以解集为 $2/3<x<4$。两个端点均因严格不等号而不包含。" },
  ] }),
  q({ id: "caie9709-p3-m5-q02", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve $3^{2x}-10(3^x)+9=0$.", solutionOutline: "令 $u=3^x>0$，则 $u^2-10u+9=(u-1)(u-9)=0$。所以 $3^x=1$ 或 $9$，得到 $x=0$ 或 $x=2$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q03", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Express $3\\sin x-4\\cos x$ as $5\\sin(x-\\alpha)$, where $0<\\alpha<\\pi/2$, and hence solve $3\\sin x-4\\cos x=2$ for $0\\le x<2\\pi$.", solutionOutline: "比较系数得 $\\cos\\alpha=3/5,\\sin\\alpha=4/5$。于是 $\\sin(x-\\alpha)=2/5$，解为 $x=\\alpha+\\sin^{-1}(2/5)$ 或 $x=\\alpha+\\pi-\\sin^{-1}(2/5)$，两者均在指定区间。" },
  ] }),
  q({ id: "caie9709-p3-m5-q04", topicId: "caie9709-algebra", difficulty: 3, totalMarks: 6, parts: [
    { label: "(a)", marks: 3, question: "Express $\\dfrac{5x+7}{(x+1)(x+2)}$ in partial fractions.", solutionOutline: "设为 $A/(x+1)+B/(x+2)$。比较 $A+B=5,\\ 2A+B=7$，得 $A=2,B=3$。" },
    { label: "(b)", marks: 3, question: "Hence evaluate $\\displaystyle\\int_1^2\\dfrac{5x+7}{(x+1)(x+2)}\\,dx$ exactly.", solutionOutline: "积分为 $[2\\ln(x+1)+3\\ln(x+2)]_1^2=2\\ln(3/2)+3\\ln(4/3)$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q05", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6, context: "$x^3+x=7$ has a positive root $\\alpha$.", parts: [
    { label: "(a)", marks: 2, question: "Show that $1.7<\\alpha<1.8$.", solutionOutline: "对 $f(x)=x^3+x-7$，有 $f(1.7)<0$ 而 $f(1.8)>0$；连续性给出该区间内有根。" },
    { label: "(b)", marks: 4, question: "Use $x_{n+1}=(7-x_n)^{1/3}$ with $x_1=1.7$ to find $\\alpha$ correct to 4 decimal places.", solutionOutline: "依次代入并保留足够位数，数值稳定到 $1.7392$；相邻迭代值在第 4 小数位一致，故 $\\alpha=1.7392$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q06", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7, context: "$x=t^2+t^{-1}$ and $y=t^2-t^{-1}$, where $t>0$.", parts: [
    { label: "(a)", marks: 3, question: "Find $dy/dx$ in terms of $t$.", solutionOutline: "$dx/dt=2t-t^{-2}$、$dy/dt=2t+t^{-2}$，所以 $dy/dx=(2t+t^{-2})/(2t-t^{-2})$。" },
    { label: "(b)", marks: 2, question: "Find the tangent at the point where $t=1$.", solutionOutline: "$t=1$ 时点为 $(2,0)$，斜率为 $3$，故切线为 $y=3(x-2)$。" },
    { label: "(c)", marks: 2, question: "Find $d^2y/dx^2$ at this point.", solutionOutline: "对 $dy/dx$ 关于 $t$ 求导，在 $t=1$ 得 $-12$；再除以 $dx/dt=1$，故二阶导数为 $-12$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q07", topicId: "caie9709-complex", difficulty: 2, totalMarks: 7, context: "A monic cubic with real coefficients has roots $-1$ and $1+2i$.", parts: [
    { label: "(a)", marks: 2, question: "State the third root.", solutionOutline: "实系数多项式的非实根成共轭对，所以第三根为 $1-2i$。" },
    { label: "(b)", marks: 5, question: "Find the cubic polynomial in expanded form.", solutionOutline: "$P(z)=(z+1)[z-(1+2i)][z-(1-2i)]=(z+1)(z^2-2z+5)=z^3-z^2+3z+5$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q08", topicId: "caie9709-integration", difficulty: 2, totalMarks: 8, parts: [
    { label: "(a)", marks: 5, question: "Evaluate $\\displaystyle\\int_0^1xe^{2x}\\,dx$ exactly.", solutionOutline: "分部积分取 $u=x,dv=e^{2x}dx$，得原函数 $e^{2x}(2x-1)/4$。代入上下限为 $(e^2+1)/4$。" },
    { label: "(b)", marks: 3, question: "Hence evaluate $\\displaystyle\\int_0^1(1-x)e^{2x}\\,dx$.", solutionOutline: "用 $\\int_0^1e^{2x}dx=(e^2-1)/2$ 减去 (a)，结果为 $(e^2-3)/4$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q09", topicId: "caie9709-de", difficulty: 3, totalMarks: 9, context: "A quantity $M$ satisfies $dM/dt=k(20-M)$, where $k>0$. Initially $M=5$, and when $t=10$, $M=15$.", parts: [
    { label: "(a)", marks: 6, question: "Find $M$ in terms of $t$ and determine $k$.", solutionOutline: "分离变量得 $20-M=Ae^{-kt}$。初值得 $A=15$；$M(10)=15$ 给 $5=15e^{-10k}$，所以 $k=\\ln3/10$，且 $M=20-15e^{-kt}$。" },
    { label: "(b)", marks: 3, question: "Find $M$ when $t=20$ and interpret the limiting value.", solutionOutline: "$e^{-20k}=1/9$，故 $M(20)=20-15/9=55/3$。当 $t\\to\\infty$，指数项趋零，模型趋向上限 $20$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q10", topicId: "caie9709-integration", difficulty: 3, totalMarks: 9, parts: [
    { label: "", marks: 9, question: "Using the substitution $u=x^2+1$, evaluate $\\displaystyle\\int_0^{\\sqrt3}\\frac{x^3}{\\sqrt{x^2+1}}\\,dx$ exactly.", solutionOutline: "$x^3dx=(u-1)du/2$，界由 $1$ 到 $4$。积分为 $\\frac12\\int_1^4(u^{1/2}-u^{-1/2})du=[u^{3/2}/3-u^{1/2}]_1^4=4/3$。" },
  ] }),
  q({ id: "caie9709-p3-m5-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 11, context: "$l_1:\\mathbf r=(1,0,2)+s(1,2,-1)$ and $l_2:\\mathbf r=(3,4,0)+t(-1,0,1)$.", parts: [
    { label: "(a)", marks: 4, question: "Show that the lines intersect and find the point of intersection.", solutionOutline: "由第二坐标 $2s=4$ 得 $s=2$，代入 $l_1$ 得 $(3,4,0)$；在 $l_2$ 取 $t=0$ 得同一点，故交点为 $(3,4,0)$。" },
    { label: "(b)", marks: 3, question: "Find the acute angle between the lines.", solutionOutline: "方向向量点积为 $-2$，模分别为 $\\sqrt6,\\sqrt2$。取锐角得 $\\cos\\theta=2/\\sqrt{12}=1/\\sqrt3$，所以 $\\theta=\\cos^{-1}(1/\\sqrt3)$。" },
    { label: "(c)", marks: 4, question: "Find the foot of the perpendicular from $P(2,1,1)$ to $l_1$.", solutionOutline: "设垂足 $H=(1,0,2)+s(1,2,-1)$。令 $(P-H)\\cdot(1,2,-1)=0$，得 $s=2/3$，所以 $H=(5/3,4/3,4/3)$。" },
  ] }),
];

export const CAIE9709_P3_MOCK_6: LongQuestion[] = [
  q({ id: "caie9709-p3-m6-q01", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4, context: "$y=ka^x$, where $k,a>0$. The graph passes through $(1,12)$ and $(4,96)$.", parts: [
    { label: "", marks: 4, question: "Find $k$ and $a$, and find $x$ when $y=384$.", solutionOutline: "相除两式得 $a^3=8$，所以 $a=2$；再由 $12=2k$ 得 $k=6$。令 $384=6\\cdot2^x$，得 $2^x=64$，所以 $x=6$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q02", topicId: "caie9709-algebra", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Expand $(1+x)^{-2}$ up to $x^2$. Hence find the coefficient of $x^2$ in $(1+3x)(1+x)^{-2}$ and state the range of validity.", solutionOutline: "展开为 $1-2x+3x^2+\\cdots$。乘以 $1+3x$ 后 $x^2$ 系数为 $3-6=-3$；有效范围为 $|x|<1$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q03", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve $\\sec^2x=4\\tan x$ for $0\\le x<\\pi$.", solutionOutline: "令 $t=\\tan x$，用 $\\sec^2x=1+t^2$ 得 $t^2-4t+1=0$，故 $t=2\\pm\\sqrt3$。两值在该区间对应 $x=\\pi/12$ 与 $5\\pi/12$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q04", topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, parts: [
    { label: "(a)", marks: 3, question: "Describe the locus $|z-2|=|z-(2+4i)|$.", solutionOutline: "两定点的垂直平分线为 $\\operatorname{Im}z=2$，即直线 $y=2$。" },
    { label: "(b)", marks: 3, question: "Find the point on this locus satisfying $\\arg(z-1)=\\pi/4$.", solutionOutline: "辐角条件给从 $(1,0)$ 出发的射线 $y=x-1,x\\ge1$。与 $y=2$ 相交于 $x=3$，所以 $z=3+2i$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q05", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6, context: "$x+e^x=4$ has a root $\\alpha$ between 1 and 2.", parts: [
    { label: "(a)", marks: 2, question: "Verify the stated change of sign.", solutionOutline: "取 $f(x)=x+e^x-4$，有 $f(1)<0$、$f(2)>0$，所以连续性保证区间内有根。" },
    { label: "(b)", marks: 4, question: "Use $x_{n+1}=\\ln(4-x_n)$ with $x_1=1$ to find $\\alpha$ correct to 4 decimal places.", solutionOutline: "反复代入得到交替收敛的数列，保留足够位数后稳定为 $1.0737$，所以 $\\alpha=1.0737$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q06", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7, context: "$x^2+xy+y^2=3$.", parts: [
    { label: "(a)", marks: 3, question: "Find $dy/dx$.", solutionOutline: "隐式微分得 $2x+y+xy'+2yy'=0$，所以 $dy/dx=-(2x+y)/(x+2y)$。" },
    { label: "(b)", marks: 4, question: "Find the equations of all horizontal tangents.", solutionOutline: "水平切线要求 $2x+y=0$ 且分母非零。代 $y=-2x$ 入曲线得 $3x^2=3$，点为 $(1,-2),(-1,2)$，切线为 $y=-2$ 与 $y=2$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q07", topicId: "caie9709-integration", difficulty: 2, totalMarks: 7, parts: [
    { label: "(a)", marks: 4, question: "Express $\\dfrac{3x+5}{(x+1)(x+2)}$ in partial fractions.", solutionOutline: "比较 $A/(x+1)+B/(x+2)$ 得 $A+B=3,2A+B=5$，所以 $A=2,B=1$。" },
    { label: "(b)", marks: 3, question: "Hence evaluate its integral from $0$ to $1$ exactly.", solutionOutline: "$[2\\ln(x+1)+\\ln(x+2)]_0^1=2\\ln2+\\ln(3/2)=\\ln6$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q08", topicId: "caie9709-de", difficulty: 3, totalMarks: 8, context: "$(1+y)^{-1}dy/dx=x$ and $y=0$ when $x=0$.", parts: [
    { label: "(a)", marks: 5, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "方程等价于 $dy/(1+y)=x\\,dx$。积分得 $\\ln(1+y)=x^2/2+C$；初值给 $C=0$，所以 $y=e^{x^2/2}-1$。" },
    { label: "(b)", marks: 3, question: "Find the positive $x$ for which $y=e^2-1$.", solutionOutline: "$e^{x^2/2}=e^2$，故 $x^2/2=2$，取正值得 $x=2$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q09", topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$P(z)=z^4-4z^3+4z^2+4z-5$ and $2+i$ is a root.", parts: [
    { label: "(a)", marks: 3, question: "Explain why $2-i$ is also a root.", solutionOutline: "$P$ 的系数全为实数，所以非实根成共轭对，故 $2-i$ 也是根。" },
    { label: "(b)", marks: 6, question: "Factorise $P$ and find all its roots.", solutionOutline: "共轭根给因式 $(z-2)^2+1=z^2-4z+5$。相除得 $z^2-1$，所以 $P=(z^2-4z+5)(z-1)(z+1)$，根为 $2\\pm i,1,-1$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q10", topicId: "caie9709-integration", difficulty: 3, totalMarks: 9, parts: [
    { label: "(a)", marks: 4, question: "Evaluate $\\displaystyle\\int_0^1\\frac{x\\ln(1+x^2)}{1+x^2}\\,dx$.", solutionOutline: "令 $u=1+x^2$，再令 $v=\\ln u$，得到 $\\frac12\\int_0^{\\ln2}v\\,dv=(\\ln2)^2/4$。" },
    { label: "(b)", marks: 5, question: "Using the same substitutions, evaluate $\\displaystyle\\int_0^1\\frac{x[\\ln(1+x^2)]^2}{1+x^2}\\,dx$.", solutionOutline: "化为 $\\frac12\\int_0^{\\ln2}v^2dv$，所以结果为 $(\\ln2)^3/6$。" },
  ] }),
  q({ id: "caie9709-p3-m6-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 11, context: "$l_1:\\mathbf r=(1,2,0)+s(2,-1,2)$ and $l_2:\\mathbf r=(0,1,3)+t(1,1,0)$.", parts: [
    { label: "(a)", marks: 4, question: "Show that the lines are skew.", solutionOutline: "若相交，第三坐标给 $2s=3$，故 $s=3/2$；第一坐标再给 $t=4$。此时第二坐标在 $l_1$ 为 $1/2$，在 $l_2$ 为 $5$，矛盾；方向向量也不平行，故两线异面。" },
    { label: "(b)", marks: 3, question: "Find the acute angle between the lines.", solutionOutline: "方向点积为 $1$，模为 $3$ 与 $\\sqrt2$，所以 $\\theta=\\cos^{-1}(1/(3\\sqrt2))$。" },
    { label: "(c)", marks: 4, question: "Find the perpendicular distance from $P(2,0,1)$ to $l_1$.", solutionOutline: "垂足参数满足 $[(P-A)-s(2,-1,2)]\\cdot(2,-1,2)=0$，得 $s=2/3$。垂足为 $(7/3,4/3,4/3)$，距离为 $\\sqrt2$。" },
  ] }),
];

export const CAIE9709_P3_MOCK_7: LongQuestion[] = [
  q({ id: "caie9709-p3-m7-q01", topicId: "caie9709-algebra", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve $|3x-1|=x+5$.", solutionOutline: "平方前注意右边需非负。平方得 $9x^2-6x+1=x^2+10x+25$，即 $x^2-2x-3=0$，所以 $x=3$ 或 $x=-1$；代回均成立。" },
  ] }),
  q({ id: "caie9709-p3-m7-q02", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4, context: "$y=kx^n$, where $k>0$. Two data points are $(2,12)$ and $(8,96)$.", parts: [
    { label: "", marks: 4, question: "Use logarithms or ratios to find $n$ and $k$ exactly.", solutionOutline: "相除得 $8=(8/2)^n=4^n$，所以 $n=3/2$。再由 $12=k2^{3/2}$ 得 $k=3\\sqrt2$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q03", topicId: "caie9709-complex", difficulty: 1, totalMarks: 4, context: "$z=(4+\\lambda i)/(1+2i)$, where $\\lambda$ is real, and $z$ is real.", parts: [
    { label: "", marks: 4, question: "Find $\\lambda$ and $z$.", solutionOutline: "乘以 $1-2i$ 得 $z=[(4+2\\lambda)+(\\lambda-8)i]/5$。虚部为零给 $\\lambda=8$，此时 $z=(4+16)/5=4$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q04", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6, parts: [
    { label: "", marks: 6, question: "Express $\\dfrac{2x^2+5x+5}{(x+1)(x^2+1)}$ in partial fractions.", solutionOutline: "设为 $A/(x+1)+(Bx+C)/(x^2+1)$。比较系数得 $A+B=2,B+C=5,A+C=5$，解得 $A=1,B=1,C=4$，故为 $1/(x+1)+(x+4)/(x^2+1)$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q05", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6, context: "$\\cos x=x/2$ has a root $\\alpha$ in $(1,1.1)$.", parts: [
    { label: "(a)", marks: 2, question: "Verify the change of sign in this interval.", solutionOutline: "对 $f(x)=\\cos x-x/2$，计算得 $f(1)>0$、$f(1.1)<0$，所以区间内有根。" },
    { label: "(b)", marks: 4, question: "Use $x_{n+1}=\\cos^{-1}(x_n/2)$ with $x_1=1$ to find $\\alpha$ correct to 4 decimal places.", solutionOutline: "迭代值稳定到 $1.0299$；连续两项在第 4 小数位一致，所以 $\\alpha=1.0299$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q06", topicId: "caie9709-trig", difficulty: 2, totalMarks: 7, parts: [
    { label: "(a)", marks: 3, question: "Write $5\\cos x+12\\sin x$ as $13\\cos(x-\\alpha)$, where $0<\\alpha<\\pi/2$.", solutionOutline: "比较系数得 $\\cos\\alpha=5/13,\\sin\\alpha=12/13$，所以所求形式为 $13\\cos(x-\\alpha)$。" },
    { label: "(b)", marks: 4, question: "Hence solve $5\\cos x+12\\sin x=5$ for $0\\le x<2\\pi$.", solutionOutline: "$\\cos(x-\\alpha)=5/13=\\cos\\alpha$，故 $x-\\alpha=\\pm\\alpha+2k\\pi$。区间内解为 $x=0$ 和 $x=2\\alpha$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q07", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7, context: "$y=e^{-x}\\sin x$ for $0\\le x\\le2\\pi$.", parts: [
    { label: "(a)", marks: 4, question: "Find the stationary points.", solutionOutline: "$y'=e^{-x}(\\cos x-\\sin x)$，所以 $\\tan x=1$。区间内 $x=\\pi/4,5\\pi/4$，相应纵坐标为 $e^{-\\pi/4}/\\sqrt2$ 与 $-e^{-5\\pi/4}/\\sqrt2$。" },
    { label: "(b)", marks: 3, question: "Determine the nature of each stationary point.", solutionOutline: "$y''=-2e^{-x}\\cos x$。在 $\\pi/4$ 为负，故极大；在 $5\\pi/4$ 为正，故极小。" },
  ] }),
  q({ id: "caie9709-p3-m7-q08", topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [
    { label: "", marks: 8, question: "Evaluate $\\displaystyle\\int_0^1x^2e^{-x}\\,dx$ exactly, showing two applications of integration by parts.", solutionOutline: "两次分部积分得原函数 $-e^{-x}(x^2+2x+2)$。代入 $0$ 与 $1$，结果为 $2-5/e$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q09", topicId: "caie9709-de", difficulty: 3, totalMarks: 9, context: "A population $P$ satisfies $dP/dt=kP(1-P/100)$, where $P(0)=20$ and $P(5)=50$.", parts: [
    { label: "(a)", marks: 6, question: "Find $k$ and an equation relating $P$ and $t$.", solutionOutline: "分离并用部分分式得 $\\ln[P/(100-P)]=kt+C$。初值得 $e^C=1/4$；$P(5)=50$ 给 $e^{5k}=4$，故 $k=\\ln4/5$ 且 $P/(100-P)=e^{kt}/4$。" },
    { label: "(b)", marks: 3, question: "Find $P(10)$ and state the model's limiting population.", solutionOutline: "$e^{10k}=16$，所以比值为 $4$，解得 $P(10)=80$。当 $t\\to\\infty$，$P\\to100$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q10", topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$P(z)=z^4-2z^3-2z^2+8z-8$ and $1+i$ is a root.", parts: [
    { label: "(a)", marks: 3, question: "Find a real quadratic factor of $P$.", solutionOutline: "共轭根为 $1-i$，二者给因式 $(z-1)^2+1=z^2-2z+2$。" },
    { label: "(b)", marks: 6, question: "Factorise $P$ completely and solve $P(z)=0$.", solutionOutline: "相除得 $z^2-4$，所以 $P=(z^2-2z+2)(z-2)(z+2)$。根为 $1\\pm i,2,-2$。" },
  ] }),
  q({ id: "caie9709-p3-m7-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 11, context: "$l_1:\\mathbf r=(2,-1,1)+s(1,1,2)$ and $l_2:\\mathbf r=(4,1,5)+t(2,-1,1)$.", parts: [
    { label: "(a)", marks: 4, question: "Show that the lines intersect and find the intersection point.", solutionOutline: "在 $l_1$ 取 $s=2$ 得 $(4,1,5)$，正是 $l_2$ 在 $t=0$ 的点，故交点为 $(4,1,5)$。" },
    { label: "(b)", marks: 3, question: "Find the acute angle between the lines.", solutionOutline: "方向点积为 $3$，两者模均为 $\\sqrt6$，所以 $\\cos\\theta=1/2$，锐角为 $\\pi/3$。" },
    { label: "(c)", marks: 4, question: "Find the foot of the perpendicular from the origin to $l_1$.", solutionOutline: "点 $H=A+s(1,1,2)$ 为垂足时 $H\\cdot(1,1,2)=0$。$A\\cdot d=3,d\\cdot d=6$，故 $s=-1/2$，得到 $H=(3/2,-3/2,0)$。" },
  ] }),
];

export const CAIE9709_P3_MOCK_8: LongQuestion[] = [
  q({ id: "caie9709-p3-m8-q01", topicId: "caie9709-algebra", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Expand $(1-4x)^{-1/2}$ up to $x^2$. Hence find the coefficient of $x^2$ in $(1-x)(1-4x)^{-1/2}$ and state the range of validity.", solutionOutline: "展开为 $1+2x+6x^2+\\cdots$。乘以 $1-x$ 后 $x^2$ 系数为 $6-2=4$；有效范围为 $|x|<1/4$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q02", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve $\\ln(x-1)+\\ln(x+3)=\\ln(5x+3)$ exactly.", solutionOutline: "定义域要求 $x>1$。合并得 $(x-1)(x+3)=5x+3$，即 $x^2-3x-6=0$。只有 $x=(3+\\sqrt{33})/2$ 符合定义域。" },
  ] }),
  q({ id: "caie9709-p3-m8-q03", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [
    { label: "", marks: 4, question: "Solve $\\tan 2x=1$ for $0\\le x<\\pi$.", solutionOutline: "$2x=\\pi/4+k\\pi$。因 $0\\le2x<2\\pi$，取 $k=0,1$，所以 $x=\\pi/8$ 或 $x=5\\pi/8$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q04", topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, parts: [
    { label: "(a)", marks: 4, question: "Find the two square roots of $-7+24i$ in exact Cartesian form.", solutionOutline: "设平方根为 $a+bi$，则 $a^2-b^2=-7,2ab=24$，且 $a^2+b^2=25$。得 $a^2=9,b^2=16$，符号由 $ab=12$ 决定，根为 $3+4i$ 与 $-3-4i$。" },
    { label: "(b)", marks: 2, question: "State the modulus and principal argument of $3+4i$.", solutionOutline: "模为 $5$，主辐角为 $\\tan^{-1}(4/3)$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q05", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6, context: "$xe^x=3$ has a positive root $\\alpha$.", parts: [
    { label: "(a)", marks: 2, question: "Show that $1<\\alpha<1.1$.", solutionOutline: "对 $f(x)=xe^x-3$，有 $f(1)=e-3<0$，而 $f(1.1)>0$，所以根位于该区间。" },
    { label: "(b)", marks: 4, question: "Use $x_{n+1}=\\ln(3/x_n)$ with $x_1=1$ to find $\\alpha$ correct to 4 decimal places.", solutionOutline: "迭代值逐步稳定到 $1.0499$，相邻值足以确认第 4 小数位，故 $\\alpha=1.0499$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q06", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7, context: "$xe^y+ye^x=2$. The point $(0,2)$ lies on the curve.", parts: [
    { label: "(a)", marks: 4, question: "Find $dy/dx$ in terms of $x$ and $y$.", solutionOutline: "隐式微分得 $e^y+xe^y y'+e^x y'+ye^x=0$，所以 $y'=-(e^y+ye^x)/(xe^y+e^x)$。" },
    { label: "(b)", marks: 3, question: "Find the equation of the normal at $(0,2)$.", solutionOutline: "该点切线斜率为 $-(e^2+2)$，故法线斜率为 $1/(e^2+2)$，方程为 $y-2=x/(e^2+2)$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q07", topicId: "caie9709-integration", difficulty: 2, totalMarks: 7, parts: [
    { label: "(a)", marks: 4, question: "Express $\\dfrac{x+4}{(x+1)(x+2)}$ in partial fractions.", solutionOutline: "设为 $A/(x+1)+B/(x+2)$，比较得 $A+B=1,2A+B=4$，所以 $A=3,B=-2$。" },
    { label: "(b)", marks: 3, question: "Hence evaluate its integral from $0$ to $1$ exactly.", solutionOutline: "$[3\\ln(x+1)-2\\ln(x+2)]_0^1=3\\ln2-2\\ln(3/2)=5\\ln2-2\\ln3$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q08", topicId: "caie9709-de", difficulty: 3, totalMarks: 8, context: "$(1+y)dy/dx=2x$ and $y=1$ when $x=0$.", parts: [
    { label: "(a)", marks: 5, question: "Find $y$ explicitly, choosing the branch consistent with the initial condition.", solutionOutline: "积分得 $y+y^2/2=x^2+3/2$，即 $(y+1)^2=2x^2+4$。由初值选择正支，所以 $y=-1+\\sqrt{2x^2+4}$。" },
    { label: "(b)", marks: 3, question: "Find the gradient when $x=1$.", solutionOutline: "由原方程 $y'=2x/(1+y)$。在 $x=1$ 时 $1+y=\\sqrt6$，故斜率为 $2/\\sqrt6=\\sqrt6/3$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q09", topicId: "caie9709-integration", difficulty: 3, totalMarks: 9, parts: [
    { label: "(a)", marks: 6, question: "Evaluate $\\displaystyle\\int_1^e x\\ln x\\,dx$ exactly.", solutionOutline: "分部积分取 $u=\\ln x,dv=x\\,dx$，得原函数 $x^2\\ln x/2-x^2/4$。代界结果为 $(e^2+1)/4$。" },
    { label: "(b)", marks: 3, question: "Hence find the mean value of $x\\ln x$ on $[1,e]$.", solutionOutline: "平均值为积分除以区间长度 $e-1$，所以是 $(e^2+1)/[4(e-1)]$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q10", topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z$ satisfies $|z-(1+i)|=2$ and $w=(1+i)z-2$.", parts: [
    { label: "(a)", marks: 4, question: "Find the centre and radius of the locus of $w$.", solutionOutline: "变换乘以 $1+i$ 把长度放大 $\\sqrt2$，再平移 $-2$。圆心映为 $(1+i)^2-2=2i-2$，半径变为 $2\\sqrt2$。" },
    { label: "(b)", marks: 5, question: "Find the points on this locus for which $w$ is real.", solutionOutline: "令 $w=u$ 为实数。圆方程为 $|u-(-2+2i)|=2\\sqrt2$，故 $(u+2)^2+4=8$，所以 $u=0$ 或 $u=-4$。" },
  ] }),
  q({ id: "caie9709-p3-m8-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 11, context: "$l:\\mathbf r=(1,-2,3)+t(2,1,-2)$ and $P=(4,0,1)$.", parts: [
    { label: "(a)", marks: 5, question: "Find the foot $H$ of the perpendicular from $P$ to $l$.", solutionOutline: "设 $H=A+t(2,1,-2)$。令 $(P-H)\\cdot(2,1,-2)=0$；$(P-A)=(3,2,-2)$ 与方向点积为 $12$，方向模平方为 $9$，故 $t=4/3$，$H=(11/3,-2/3,1/3)$。" },
    { label: "(b)", marks: 3, question: "Find the distance from $P$ to $l$.", solutionOutline: "$P-H=(1/3,2/3,2/3)$，其模为 $1$，所以距离为 $1$。" },
    { label: "(c)", marks: 3, question: "Find the acute angle between $l$ and the line through $P$ with direction $(1,1,0)$.", solutionOutline: "方向点积为 $3$，模为 $3$ 与 $\\sqrt2$，所以 $\\cos\\theta=1/\\sqrt2$，锐角为 $\\pi/4$。" },
  ] }),
];

export const CAIE9709_P3_EXPANSION_QUESTIONS: LongQuestion[] = [
  ...CAIE9709_P3_MOCK_5,
  ...CAIE9709_P3_MOCK_6,
  ...CAIE9709_P3_MOCK_7,
  ...CAIE9709_P3_MOCK_8,
];
