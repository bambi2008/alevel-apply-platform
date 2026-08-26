import type { LongPart, LongQuestion } from "./types";

type Draft = {
  topicId: string;
  difficulty: 1 | 2 | 3;
  totalMarks: number;
  context?: string;
  parts: LongPart[];
};

function question(paper: number, number: number, draft: Draft): LongQuestion {
  return {
    ...draft,
    id: `caie9709-p3-m${paper}-q${String(number).padStart(2, "0")}`,
    type: "long",
    testId: "caie9709",
    fullSolution: draft.parts.map((part) => `${part.label} ${part.solutionOutline}`).join("\n\n"),
  };
}

const binomial = [
  ["(1+2x)^{-1/2}", "1-x+\\frac32x^2", "|x|<\\frac12"],
  ["(1-3x)^{-1}", "1+3x+9x^2", "|x|<\\frac13"],
  ["(1+4x)^{-2}", "1-8x+48x^2", "|x|<\\frac14"],
  ["(1-2x)^{-3/2}", "1+3x+\\frac{15}{2}x^2", "|x|<\\frac12"],
  ["(1+5x)^{-1/2}", "1-\\frac52x+\\frac{75}{8}x^2", "|x|<\\frac15"],
  ["(1-4x)^{-2}", "1+8x+48x^2", "|x|<\\frac14"],
  ["(1+3x)^{-3}", "1-9x+54x^2", "|x|<\\frac13"],
  ["(1-5x)^{-1}", "1+5x+25x^2", "|x|<\\frac15"],
] as const;

const exponentialModels = [
  ["$(2,12)$ and $(5,96)$", "a^3=8", "a=2", "k=3"],
  ["$(1,15)$ and $(3,135)$", "a^2=9", "a=3", "k=5"],
  ["$(1,8)$ and $(3,128)$", "a^2=16", "a=4", "k=2"],
  ["$(2,28)$ and $(5,224)$", "a^3=8", "a=2", "k=7"],
  ["$(0,4)$ and $(2,36)$", "a^2=9", "a=3", "k=4"],
  ["$(1,10)$ and $(3,250)$", "a^2=25", "a=5", "k=2"],
  ["$(1,18)$ and $(4,144)$", "a^3=8", "a=2", "k=9"],
  ["$(1,4)$ and $(3,1)$", "a^2=1/4", "a=1/2", "k=8"],
] as const;

const trigQuestions: Draft[] = [
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Express $5\\cos x-12\\sin x$ as $13\\cos(x+\\alpha)$, where $0<\\alpha<\\pi/2$, and state $\\tan\\alpha$.", solutionOutline: "比较系数得 $13\\cos\\alpha=5$、$13\\sin\\alpha=12$，所以 $\\cos\\alpha=5/13$、$\\sin\\alpha=12/13$，从而 $\\tan\\alpha=12/5$。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Solve $2\\sin^2x+3\\cos x-3=0$ for $0\\le x\\le2\\pi$.", solutionOutline: "用 $\\sin^2x=1-\\cos^2x$ 得 $2\\cos^2x-3\\cos x+1=0$，故 $\\cos x=1$ 或 $1/2$。区间内解为 $x=0,\\pi/3,5\\pi/3,2\\pi$。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Given $\\tan\\theta=2$ and $\\pi<\\theta<3\\pi/2$, find the exact values of $\\sin2\\theta$ and $\\cos2\\theta$.", solutionOutline: "第三象限中正切为正。用倍角公式 $\\sin2\\theta=2\\tan\\theta/(1+\\tan^2\\theta)=4/5$，$\\cos2\\theta=(1-\\tan^2\\theta)/(1+\\tan^2\\theta)=-3/5$。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Solve $3\\tan^2x-4\\tan x+1=0$ for $-\\pi/2<x<\\pi/2$.", solutionOutline: "因式分解为 $(3\\tan x-1)(\\tan x-1)=0$。指定区间内正切一一对应，故 $x=\\tan^{-1}(1/3)$ 或 $x=\\pi/4$。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Express $8\\sin x+6\\cos x$ as $10\\sin(x+\\beta)$ and hence state its maximum value.", solutionOutline: "比较系数得 $\\cos\\beta=4/5$、$\\sin\\beta=3/5$，所以表达式为 $10\\sin(x+\\beta)$；正弦最大为 1，原式最大值为 10。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Solve $\\sec^2x=3\\tan x+1$ for $0\\le x<\\pi$.", solutionOutline: "由 $\\sec^2x=1+\\tan^2x$ 得 $\\tan x(\\tan x-3)=0$。因此 $x=0$ 或 $x=\\tan^{-1}3$；$x=\\pi$ 不在区间内。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "If $\\sin x=3/5$ and $\\pi/2<x<\\pi$, find exactly $\\cos2x$ and $\\tan x$.", solutionOutline: "第二象限余弦为负，故 $\\cos x=-4/5$。于是 $\\cos2x=1-2(9/25)=7/25$，且 $\\tan x=(3/5)/(-4/5)=-3/4$。" }] },
  { topicId: "caie9709-trig", difficulty: 1, totalMarks: 4, parts: [{ label: "", marks: 4, question: "Solve $2\\cos2x=1$ for $0\\le x<2\\pi$.", solutionOutline: "$\\cos2x=1/2$，所以 $2x=\\pi/3,5\\pi/3,7\\pi/3,11\\pi/3$。除以 2 得 $x=\\pi/6,5\\pi/6,7\\pi/6,11\\pi/6$。" }] },
];

const complexQuestions: Draft[] = [
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, context: "$z=3-4i$.", parts: [{ label: "(a)", marks: 2, question: "Find $|z|$ and $\\arg z$.", solutionOutline: "$|z|=5$，且点在第四象限，所以主辐角为 $-\\tan^{-1}(4/3)$。" }, { label: "(b)", marks: 4, question: "Find $z^{-1}$ in Cartesian form and verify your answer by multiplication.", solutionOutline: "$z^{-1}=(3+4i)/25$。相乘得 $(3-4i)(3+4i)/25=25/25=1$，验证完成。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, context: "A quadratic with real coefficients has a root $2+3i$ and constant term 13.", parts: [{ label: "(a)", marks: 2, question: "State the other root.", solutionOutline: "实系数多项式的非实根成共轭对，所以另一根为 $2-3i$。" }, { label: "(b)", marks: 4, question: "Find the quadratic in monic expanded form.", solutionOutline: "两根之和为 4、积为 $2^2+3^2=13$，所以多项式为 $z^2-4z+13$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, parts: [{ label: "(a)", marks: 3, question: "Describe geometrically the locus $|z-(1+i)|=2$.", solutionOutline: "这是阿根图上以 $(1,1)$ 为圆心、半径为 2 的圆。" }, { label: "(b)", marks: 3, question: "Find the points on the locus whose real part is 1.", solutionOutline: "令 $z=1+yi$，则距离条件给 $|y-1|=2$，所以 $y=3$ 或 $-1$，点为 $1+3i$ 与 $1-i$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, context: "$w=(1+i)^6$.", parts: [{ label: "(a)", marks: 3, question: "Express $1+i$ in modulus-argument form.", solutionOutline: "$1+i$ 的模为 $\\sqrt2$、辐角为 $\\pi/4$，所以是 $\\sqrt2(\\cos\\pi/4+i\\sin\\pi/4)$。" }, { label: "(b)", marks: 3, question: "Hence find $w$ exactly in Cartesian form.", solutionOutline: "De Moivre 定理给模 $(\\sqrt2)^6=8$、辐角 $6\\pi/4=3\\pi/2$，故 $w=-8i$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, parts: [{ label: "(a)", marks: 3, question: "Solve $z^2-6z+25=0$.", solutionOutline: "判别式为 $36-100=-64$，所以 $z=(6\\pm8i)/2=3\\pm4i$。" }, { label: "(b)", marks: 3, question: "Write both roots in modulus-argument form using principal arguments.", solutionOutline: "两根模均为 5，辐角分别为 $\\pm\\tan^{-1}(4/3)$，故写成 $5e^{\\pm i\\tan^{-1}(4/3)}$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, parts: [{ label: "(a)", marks: 3, question: "Describe the locus $|z-2|=|z+2|$.", solutionOutline: "到实轴上 $2$ 与 $-2$ 等距的点组成虚轴，即 $\\operatorname{Re}z=0$。" }, { label: "(b)", marks: 3, question: "Find the point on this locus for which $|z-(1+i)|=\\sqrt5$ and $\\operatorname{Im}z>0$.", solutionOutline: "令 $z=yi$，则 $1+(y-1)^2=5$，所以 $y=3$ 或 $-1$；取正虚部得到 $z=3i$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, context: "$z=-1+\\sqrt3i$.", parts: [{ label: "(a)", marks: 3, question: "Write $z$ in modulus-argument form.", solutionOutline: "模为 2，且位于第二象限、参考角为 $\\pi/3$，所以 $z=2e^{2\\pi i/3}$。" }, { label: "(b)", marks: 3, question: "Find $z^5$ in Cartesian form.", solutionOutline: "$z^5=32e^{10\\pi i/3}=32e^{4\\pi i/3}=-16-16\\sqrt3i$。" }] },
  { topicId: "caie9709-complex", difficulty: 2, totalMarks: 6, context: "$z=(2+i)/(1-2i)$.", parts: [{ label: "(a)", marks: 3, question: "Express $z$ in Cartesian form.", solutionOutline: "乘以分母共轭得 $(2+i)(1+2i)/5=5i/5=i$。" }, { label: "(b)", marks: 3, question: "Hence find all possible values of $\\arg(z^3)$ in $(-\\pi,\\pi]$.", solutionOutline: "$z=i=e^{i\\pi/2}$，所以 $z^3=-i$，在指定主值区间的辐角为 $-\\pi/2$。" }] },
];

const normalQuestions: Draft[] = [
  ["$y=x^3-3x$ at $x=2$", "$dy/dx=3x^2-3$，在 $x=2$ 时切线斜率为 9。", "点为 $(2,2)$，法线斜率为 $-1/9$，所以完整方程是 $y-2=-\\frac19(x-2)$。"],
  ["$y=\\ln x$ at $x=1$", "$dy/dx=1/x$，在 $x=1$ 时切线斜率为 1。", "点为 $(1,0)$，法线斜率为 $-1$，所以完整方程是 $y=1-x$。"],
  ["$y=xe^x$ at $x=0$", "$dy/dx=e^x(1+x)$，在 $x=0$ 时切线斜率为 1。", "点为 $(0,0)$，法线斜率为 $-1$，所以完整方程是 $y=-x$。"],
  ["$y=\\sqrt{2x+1}$ at $x=4$", "$dy/dx=(2x+1)^{-1/2}$，在 $x=4$ 时切线斜率为 $1/3$。", "点为 $(4,3)$，法线斜率为 $-3$，所以完整方程是 $y-3=-3(x-4)$。"],
  ["$x^2+xy+y^2=7$ at $(2,1)$", "隐式微分得 $2x+y+(x+2y)y'=0$，故该点切线斜率为 $-5/4$。", "法线斜率为 $4/5$，所以完整方程是 $y-1=\\frac45(x-2)$。"],
  ["$x=t^2+1, y=t^3-t$ at $t=1$", "$dx/dt=2t$、$dy/dt=3t^2-1$，故 $t=1$ 时 $dy/dx=1$。", "点为 $(2,0)$，法线斜率为 $-1$，所以完整方程是 $y=2-x$。"],
  ["$y=e^{2x}$ at $x=0$", "$dy/dx=2e^{2x}$，在 $x=0$ 时切线斜率为 2。", "点为 $(0,1)$，法线斜率为 $-1/2$，所以完整方程是 $y-1=-x/2$。"],
  ["$y=x+4/x$ at $x=1$", "$dy/dx=1-4/x^2$，在 $x=1$ 时切线斜率为 $-3$。", "点为 $(1,5)$，法线斜率为 $1/3$，所以完整方程是 $y-5=\\frac13(x-1)$。"],
].map(([curve, derivative, normal]) => ({
  topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 6, context: `Consider the curve ${curve}.`, parts: [
    { label: "(a)", marks: 3, question: "Find the gradient of the tangent at the stated point.", solutionOutline: derivative },
    { label: "(b)", marks: 3, question: "Find the complete equation of the normal at this point.", solutionOutline: normal },
  ],
}));

const differentialEquations: Draft[] = [
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=2xy$ and $y=3$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Solve the differential equation for $y$ in terms of $x$.", solutionOutline: "分离变量得 $dy/y=2x\\,dx$，所以 $\\ln y=x^2+C$。初值给 $C=\\ln3$，故 $y=3e^{x^2}$。" }, { label: "(b)", marks: 2, question: "Find $y$ when $x=\\sqrt{\\ln2}$.", solutionOutline: "代入 $x^2=\\ln2$ 得 $y=3e^{\\ln2}=6$。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=(1+y)/(1+x)$ and $y=1$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ explicitly in terms of $x$ for $x>-1$.", solutionOutline: "分离后 $d y/(1+y)=dx/(1+x)$，得 $\\ln(1+y)=\\ln(1+x)+C$。初值给常数因子 2，所以 $1+y=2(1+x)$，即 $y=1+2x$。" }, { label: "(b)", marks: 2, question: "State the value of $x$ when $y=5$.", solutionOutline: "由 $5=1+2x$ 直接得到 $x=2$，且满足原定义域。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$e^y dy/dx=3x^2$ and $y=0$ when $x=1$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ in terms of $x$.", solutionOutline: "注意 $d(e^y)/dx=e^y y'$，积分得 $e^y=x^3+C$。初值给 $1=1+C$，故 $y=3\\ln x$，在初值所在正分支取 $x>0$。" }, { label: "(b)", marks: 2, question: "Find the gradient when $x=2$.", solutionOutline: "由 $y=3\\ln x$ 得 $dy/dx=3/x$，所以 $x=2$ 时梯度为 $3/2$。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=x(4-y)$ and $y=0$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "分离得 $-\\ln(4-y)=x^2/2+C$，所以 $4-y=Ae^{-x^2/2}$。初值给 $A=4$，故 $y=4(1-e^{-x^2/2})$。" }, { label: "(b)", marks: 2, question: "State the limiting value as $x\\to\\infty$.", solutionOutline: "指数项 $e^{-x^2/2}$ 趋于 0，因此 $y$ 的极限为 4。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=(x+1)e^{-y}$ and $y=0$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "$e^y dy=(x+1)dx$，积分得 $e^y=x^2/2+x+C$。初值给 $C=1$，所以 $y=\\ln(x^2/2+x+1)$。" }, { label: "(b)", marks: 2, question: "Explain why the expression is defined for every real $x$.", solutionOutline: "$x^2/2+x+1=((x+1)^2+1)/2>0$，所以对所有实数 $x$ 对数真数均为正。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=y\\cos x$ and $y=2$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ in terms of $x$.", solutionOutline: "分离得 $dy/y=\\cos x\\,dx$，所以 $\\ln y=\\sin x+C$。初值给 $C=\\ln2$，故 $y=2e^{\\sin x}$。" }, { label: "(b)", marks: 2, question: "Find the maximum possible value of $y$.", solutionOutline: "因为 $-1\\le\\sin x\\le1$，指数最大在 $\\sin x=1$，故最大值为 $2e$。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$x dy/dx=2y$ for $x>0$, and $y=5$ when $x=1$.", parts: [{ label: "(a)", marks: 5, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "$dy/y=2dx/x$，所以 $\\ln y=2\\ln x+C$，即 $y=Ax^2$。初值给 $A=5$，故 $y=5x^2$。" }, { label: "(b)", marks: 2, question: "Find $x$ when $y=45$.", solutionOutline: "$5x^2=45$ 给 $x^2=9$；因定义域 $x>0$，所以只取 $x=3$。" }] },
  { topicId: "caie9709-de", difficulty: 2, totalMarks: 7, context: "$dy/dx=2x/(1+y)$ and $y=1$ when $x=0$.", parts: [{ label: "(a)", marks: 5, question: "Find the branch of $y$ that satisfies the initial condition.", solutionOutline: "$(1+y)dy=2x dx$，积分得 $y+y^2/2=x^2+C$。初值给 $C=3/2$，整理为 $(y+1)^2=2x^2+4$；初值选正根，故 $y=\\sqrt{2x^2+4}-1$。" }, { label: "(b)", marks: 2, question: "Explain why the negative square-root branch is rejected.", solutionOutline: "负分支在 $x=0$ 给 $y=-3$，不满足已给初值 $y=1$，所以必须舍去。" }] },
];

const numericalQuestions: Draft[] = [
  ["$x^3+x=7$", "$y=x^3+x$ and $y=7$", "$1.7<\\alpha<1.8$", "$x_{n+1}=(7-x_n)^{1/3}$", "$x_1=1.7$", "1.7392", "在正数范围 $3x^2+1>0$，左侧严格递增，与水平直线只交一次。"],
  ["$x+e^x=4$", "$y=e^x$ and $y=4-x$", "$1.0<\\alpha<1.1$", "$x_{n+1}=\\ln(4-x_n)$", "$x_1=1$", "1.0737", "$e^x$ 严格递增而 $4-x$ 严格递减，所以交点至多一个。"],
  ["$2\\cos x=x$", "$y=2\\cos x$ and $y=x$", "$1.0<\\alpha<1.1$", "$x_{n+1}=\\cos^{-1}(x_n/2)$", "$x_1=1$", "1.0299", "在该区间 $2\\cos x$ 严格递减而 $x$ 严格递增，所以交点唯一。"],
  ["$xe^x=3$", "$y=xe^x$ and $y=3$", "$1.0<\\alpha<1.1$", "$x_{n+1}=\\ln(3/x_n)$", "$x_1=1$", "1.0499", "对 $x>0$，$xe^x$ 的导数 $e^x(1+x)>0$，所以正根唯一。"],
  ["$x^3+2x=5$", "$y=x^3+2x$ and $y=5$", "$1.3<\\alpha<1.4$", "$x_{n+1}=(5-2x_n)^{1/3}$", "$x_1=1.3$", "1.3283", "左侧导数 $3x^2+2>0$，所以函数严格递增并只与 $y=5$ 相交一次。"],
  ["$e^{-x}=x$", "$y=e^{-x}$ and $y=x$", "$0.5<\\alpha<0.6$", "$x_{n+1}=e^{-x_n}$", "$x_1=0.5$", "0.5671", "$e^{-x}$ 严格递减而 $x$ 严格递增，因此交点唯一。"],
  ["$\\ln x+x=3$", "$y=\\ln x+x$ and $y=3$", "$2.2<\\alpha<2.3$", "$x_{n+1}=3-\\ln x_n$", "$x_1=2.2$", "2.2079", "对 $x>0$ 左侧导数 $1/x+1>0$，所以正根唯一。"],
  ["$x^2=2+\\ln x$", "$y=x^2$ and $y=2+\\ln x$", "$1.5<\\alpha<1.6$", "$x_{n+1}=\\sqrt{2+\\ln x_n}$", "$x_1=1.5$", "1.5645", "对 $x>1$，差函数导数 $2x-1/x>0$，所以该区间后的正根唯一。"],
].map(([equation, graphs, bracket, iteration, start, answer, uniqueness]) => ({
  topicId: "caie9709-numerical", difficulty: 2, totalMarks: 7, context: `${equation} has a root $\\alpha$ in the stated positive interval.`, parts: [
    { label: "(a)", marks: 2, question: `Sketch the pair of graphs ${graphs} and explain why their intersection in the stated interval is unique.`, solutionOutline: `${uniqueness} 草图应画出这两个函数，而不是只画差函数。` },
    { label: "(b)", marks: 2, question: `Verify ${bracket} by evaluating a suitable continuous difference function at both endpoints.`, solutionOutline: "把区间两端代入“左侧减右侧”的连续函数，所得数值异号，因此由连续性知区间内有根。" },
    { label: "(c)", marks: 3, question: `Use ${iteration} with ${start}. Record iterates to at least 5 decimal places and give $\\alpha$ to 4 decimal places.`, solutionOutline: `反复代入且中间值至少保留 5 位小数，直至相邻迭代在所需位数稳定，得到 $\\alpha=${answer}$。` },
  ],
}));

const broadIntegrals: Draft[] = [
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "(a)", marks: 3, question: "Express $(5x+7)/[(x+1)(x+2)]$ in partial fractions.", solutionOutline: "设为 $A/(x+1)+B/(x+2)$，比较系数得 $A=2,B=3$。" }, { label: "(b)", marks: 5, question: "Hence evaluate $\\int_0^1(5x+7)/[(x+1)(x+2)]\\,dx$ exactly.", solutionOutline: "积分为 $[2\\ln(x+1)+3\\ln(x+2)]_0^1=2\\ln2+3\\ln(3/2)$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "", marks: 8, question: "Use integration by parts twice to evaluate $\\int_0^1x^2e^x\\,dx$ exactly.", solutionOutline: "第一次分部得 $[x^2e^x]_0^1-2\\int_0^1xe^x dx$；第二次给 $\\int xe^x dx=e^x(x-1)$。合并原函数 $e^x(x^2-2x+2)$，代界得 $e-2$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "", marks: 8, question: "Using $u=x^2+4$, evaluate $\\int_0^{\\sqrt5}x^3/\\sqrt{x^2+4}\\,dx$ exactly.", solutionOutline: "$x^3dx=(u-4)du/2$，界从 4 到 9。积分为 $\\frac12\\int_4^9(u^{1/2}-4u^{-1/2})du=[u^{3/2}/3-4u^{1/2}]_4^9=7/3$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "(a)", marks: 3, question: "Express $(3x+1)/(x^2-x-2)$ in partial fractions.", solutionOutline: "分母为 $(x-2)(x+1)$。令为 $A/(x-2)+B/(x+1)$，比较得 $A=7/3,B=2/3$。" }, { label: "(b)", marks: 5, question: "Hence find an exact antiderivative valid on $x>2$.", solutionOutline: "在 $x>2$ 无需绝对值分支说明，原函数为 $\\frac73\\ln(x-2)+\\frac23\\ln(x+1)+C$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "", marks: 8, question: "Evaluate $\\int_1^e(\\ln x)^2\\,dx$ exactly, showing both integrations by parts.", solutionOutline: "分部两次得到原函数 $x[(\\ln x)^2-2\\ln x+2]$。代入 $e$ 与 1，结果为 $e-2$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "", marks: 8, question: "Using $u=1+x^2$, evaluate $\\int_0^{\\sqrt3}x^3/(1+x^2)^2\\,dx$ exactly.", solutionOutline: "$x^3dx=(u-1)du/2$，界从 1 到 4。积分为 $\\frac12\\int_1^4(u^{-1}-u^{-2})du=\\frac12[\\ln u+u^{-1}]_1^4=\\ln2-3/8$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "(a)", marks: 4, question: "Find $\\int xe^{2x}\\,dx$ by parts.", solutionOutline: "取 $u=x,dv=e^{2x}dx$，得 $e^{2x}(2x-1)/4+C$。" }, { label: "(b)", marks: 4, question: "Hence evaluate $\\int_0^1(2x+1)e^{2x}\\,dx$ exactly.", solutionOutline: "用两倍 (a) 再加 $\\int e^{2x}dx$，化简原函数为 $xe^{2x}$，代界结果为 $e^2$。" }] },
  { topicId: "caie9709-integration", difficulty: 3, totalMarks: 8, parts: [{ label: "", marks: 8, question: "Evaluate $\\int_0^1x/(x+1)^2\\,dx$ exactly using the substitution $u=x+1$.", solutionOutline: "$x=u-1$，界从 1 到 2，积分化为 $\\int_1^2(u^{-1}-u^{-2})du=[\\ln u+u^{-1}]_1^2=\\ln2-1/2$。" }] },
];

const exactTrigIntegrals: Draft[] = [
  ["\\sin^3x\\cos x", "0", "\\pi/4", "$u=\\sin x$", "1/16"],
  ["\\cos^3(2x)\\sin(2x)", "0", "\\pi/6", "$u=\\cos2x$", "15/128"],
  ["\\sin x/(2+\\cos x)", "0", "\\pi/2", "$u=2+\\cos x$", "\\ln(3/2)"],
  ["1/(1+\\sin x)", "0", "\\pi/4", "multiply by $(1-\\sin x)/(1-\\sin x)$", "2-\\sqrt2"],
  ["\\sin^2(3x)", "0", "\\pi/6", "$\\sin^2u=(1-\\cos2u)/2$", "\\pi/12"],
  ["\\sin x\\cos^2x", "0", "\\pi/3", "$u=\\cos x$", "7/24"],
  ["(\\sin x+\\cos x)^2", "0", "\\pi/4", "$(\\sin x+\\cos x)^2=1+\\sin2x$", "\\pi/4+1/2"],
  ["\\sin2x\\cos^2x", "0", "\\pi/4", "$\\sin2x=2\\sin x\\cos x$ and $u=\\cos x$", "3/8"],
].map(([integrand, lower, upper, method, answer]) => ({
  topicId: "caie9709-trig", difficulty: 3, totalMarks: 8, parts: [
    { label: "(a)", marks: 2, question: `State the exact identity or substitution needed to integrate $${integrand}$.`, solutionOutline: `使用 ${method}，并在换元时同步改变微分和上下限。` },
    { label: "(b)", marks: 6, question: `Hence evaluate $\\displaystyle\\int_${lower}^{${upper}}${integrand}\\,dx$ exactly.`, solutionOutline: `按 (a) 化为单一代数函数后精确积分，并在代入原上下限后化简，结果为 $${answer}$。不得以小数替代所求精确值。` },
  ],
}));

const advancedComplex: Draft[] = [
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z^4=16i$.", parts: [{ label: "(a)", marks: 3, question: "Write $16i$ in modulus-argument form.", solutionOutline: "$16i=16e^{i(\\pi/2+2k\\pi)}$。" }, { label: "(b)", marks: 6, question: "Find all four roots in exact modulus-argument form.", solutionOutline: "四次根的模为 2，辐角为 $\\pi/8+k\\pi/2$，其中 $k=0,1,2,3$；四根为 $2e^{i\\pi/8},2e^{i5\\pi/8},2e^{i9\\pi/8},2e^{i13\\pi/8}$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z^3=-8$.", parts: [{ label: "(a)", marks: 3, question: "Represent $-8$ using the complete set of arguments.", solutionOutline: "$-8=8e^{i(\\pi+2k\\pi)}$，其中 $k$ 为整数。" }, { label: "(b)", marks: 6, question: "Find all roots and identify the real root.", solutionOutline: "根的模为 2、辐角为 $(\\pi+2k\\pi)/3$，取 $k=0,1,2$ 得 $2e^{i\\pi/3},-2,2e^{i5\\pi/3}$；实根为 $-2$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$w=(1+i)/(1-i\\sqrt3)$.", parts: [{ label: "(a)", marks: 4, question: "Find the modulus and principal argument of $w$.", solutionOutline: "分子模 $\\sqrt2$、辐角 $\\pi/4$；分母模 2、辐角 $-\\pi/3$。故 $|w|=1/\\sqrt2$，主辐角为 $7\\pi/12$。" }, { label: "(b)", marks: 5, question: "Hence find the modulus and principal argument of $w^3$.", solutionOutline: "$|w^3|=1/(2\\sqrt2)$，初始辐角 $7\\pi/4$，减去 $2\\pi$ 得主辐角 $-\\pi/4$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "The roots of $z^3=8$ are vertices of a triangle in an Argand diagram.", parts: [{ label: "(a)", marks: 5, question: "Find the three roots in Cartesian form.", solutionOutline: "根为 $2e^{2k\\pi i/3}$。笛卡尔形式是 $2$、$-1+\\sqrt3i$、$-1-\\sqrt3i$。" }, { label: "(b)", marks: 4, question: "Find the exact area of the triangle.", solutionOutline: "三边均长 $2\\sqrt3$，为等边三角形，面积为 $\\sqrt3(2\\sqrt3)^2/4=3\\sqrt3$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z+1/z=2$ and $z\\ne0$.", parts: [{ label: "(a)", marks: 4, question: "Show that the equation has a repeated root and find it.", solutionOutline: "乘以 $z$ 得 $z^2-2z+1=0=(z-1)^2$，所以重复根为 $z=1$。" }, { label: "(b)", marks: 5, question: "Solve instead $z+1/z=0$ and give both roots in modulus-argument form.", solutionOutline: "$z^2+1=0$，故 $z=\\pm i$。两者模为 1，主辐角分别为 $\\pi/2$ 与 $-\\pi/2$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z^2=3+4i$.", parts: [{ label: "(a)", marks: 5, question: "Let $z=a+bi$ with real $a,b$. Find equations for $a$ and $b$ and hence one square root.", solutionOutline: "$a^2-b^2=3$、$2ab=4$，且 $a^2+b^2=5$。由此 $a^2=4,b^2=1$ 且同号，取一根 $2+i$。" }, { label: "(b)", marks: 4, question: "State the other root and verify their product.", solutionOutline: "另一根为 $-2-i$；两根乘积为 $(2+i)(-2-i)=-(2+i)^2=-(3+4i)$，等于二次方程 $z^2-(3+4i)=0$ 的常数项。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "$z=2e^{i\\theta}$ and $z+\\bar z=2$.", parts: [{ label: "(a)", marks: 4, question: "Find all possible $\\theta$ in $(-\\pi,\\pi]$.", solutionOutline: "$z+\\bar z=4\\cos\\theta=2$，所以 $\\cos\\theta=1/2$，得到 $\\theta=\\pm\\pi/3$。" }, { label: "(b)", marks: 5, question: "Find the corresponding Cartesian values of $z^2$.", solutionOutline: "$z^2=4e^{\\pm2\\pi i/3}=4(-1/2\\pm\\sqrt3i/2)=-2\\pm2\\sqrt3i$。" }] },
  { topicId: "caie9709-complex", difficulty: 3, totalMarks: 9, context: "The locus satisfies $|z-1|=|z-i|$ and $|z|=\\sqrt2$.", parts: [{ label: "(a)", marks: 4, question: "Show that the first condition is the line $y=x$.", solutionOutline: "令 $z=x+iy$，平方距离得 $(x-1)^2+y^2=x^2+(y-1)^2$，化简为 $y=x$。" }, { label: "(b)", marks: 5, question: "Find every point satisfying both conditions.", solutionOutline: "再用 $x^2+y^2=2$ 且 $y=x$，得 $2x^2=2$，所以 $x=\\pm1$。对应点为 $1+i$ 与 $-1-i$。" }] },
];

const foundationDifficultyGaps: Partial<Record<number, Draft>> = {
  0: { topicId: "caie9709-differentiation", difficulty: 1, totalMarks: 4, context: "$y=x^2+2/x$, where $x>0$.", parts: [{ label: "", marks: 4, question: "Find the stationary point and determine its nature.", solutionOutline: "$dy/dx=2x-2/x^2$，令其为 0 得 $x^3=1$，所以点为 $(1,3)$。导数在 1 左负、右正，故为极小点。" }] },
  1: { topicId: "caie9709-numerical", difficulty: 1, totalMarks: 4, context: "$f(x)=x^3-x-1$ has a root between 1 and 2.", parts: [{ label: "", marks: 4, question: "Perform one bisection step and state the resulting interval containing the root.", solutionOutline: "$f(1)=-1$、$f(2)=5$。中点为 1.5，且 $f(1.5)=0.875>0$，所以变号区间缩小为 $(1,1.5)$。" }] },
  2: { topicId: "caie9709-de", difficulty: 1, totalMarks: 4, context: "$dy/dx=2y$ and $y=3$ when $x=0$.", parts: [{ label: "", marks: 4, question: "Verify the exponential solution form and find the particular solution.", solutionOutline: "设 $y=Ce^{2x}$，则 $dy/dx=2Ce^{2x}=2y$，确为通解形式。初值给 $C=3$，所以 $y=3e^{2x}$。" }] },
  3: { topicId: "caie9709-vectors", difficulty: 1, totalMarks: 4, context: "Points are $A(1,2,-1)$, $B(4,0,5)$ and $P(7,-2,11)$.", parts: [{ label: "", marks: 4, question: "Find a vector equation of line $AB$ and determine whether $P$ lies on it.", solutionOutline: "$B-A=(3,-2,6)$，故直线为 $r=(1,2,-1)+t(3,-2,6)$。取 $t=2$ 得 $(7,-2,11)=P$，所以 $P$ 在线上。" }] },
};

const middleDifficultyGaps: Partial<Record<number, Draft>> = {
  4: { topicId: "caie9709-log-exp", difficulty: 2, totalMarks: 6, parts: [{ label: "(a)", marks: 4, question: "Solve $2e^{2x}-7e^x+3=0$ exactly.", solutionOutline: "令 $u=e^x>0$，则 $(2u-1)(u-3)=0$，所以 $e^x=1/2$ 或 3，得到 $x=-\\ln2$ 或 $x=\\ln3$。" }, { label: "(b)", marks: 2, question: "Explain why no candidate root is rejected.", solutionOutline: "代换量 $u=e^x$ 对所有实数 $x$ 都为正，而 $1/2$ 与 3 均为正，所以两根都有效。" }] },
  5: { topicId: "caie9709-vectors", difficulty: 2, totalMarks: 6, context: "$l:r=(1,2,-1)+t(2,-1,2)$.", parts: [{ label: "(a)", marks: 3, question: "Find the point on $l$ whose $y$-coordinate is zero.", solutionOutline: "$2-t=0$ 给 $t=2$，代入其余坐标得到点 $(5,0,3)$。" }, { label: "(b)", marks: 3, question: "Find the acute angle between $l$ and the positive $x$-axis.", solutionOutline: "方向向量模为 3，与 $(1,0,0)$ 点积为 2，所以 $\\cos\\theta=2/3$，即 $\\theta=\\cos^{-1}(2/3)$。" }] },
};

const advancedDifficultyGaps: Partial<Record<number, Draft>> = {
  6: { topicId: "caie9709-log-exp", difficulty: 3, totalMarks: 9, context: "$f(x)=e^{2x}-6e^x+5$.", parts: [{ label: "(a)", marks: 3, question: "Solve $f(x)=0$ exactly.", solutionOutline: "令 $u=e^x>0$，则 $(u-1)(u-5)=0$，所以 $x=0$ 或 $x=\\ln5$。" }, { label: "(b)", marks: 3, question: "Find the stationary point and determine its nature.", solutionOutline: "$f'(x)=2e^x(e^x-3)$，所以 $x=\\ln3$ 且 $f=-4$。导数由负变正，故为极小点 $(\\ln3,-4)$。" }, { label: "(c)", marks: 3, question: "Hence solve $f(x)\\le0$.", solutionOutline: "函数在两根之间不高于横轴，并在区间外为正，所以解集为 $0\\le x\\le\\ln5$。" }] },
  7: { topicId: "caie9709-numerical", difficulty: 3, totalMarks: 9, context: "$x^3+x-4=0$ has a root $\\alpha$ between 1.3 and 1.4.", parts: [{ label: "(a)", marks: 2, question: "Verify the stated bracket.", solutionOutline: "$f(1.3)=-0.503<0$，$f(1.4)=0.144>0$，所以连续性给区间内有根。" }, { label: "(b)", marks: 3, question: "Derive the Newton-Raphson iteration for this equation.", solutionOutline: "$f'(x)=3x^2+1$，所以 $x_{n+1}=x_n-(x_n^3+x_n-4)/(3x_n^2+1)$。" }, { label: "(c)", marks: 4, question: "Starting with $x_1=1.3$, calculate two iterations and give $\\alpha$ to 4 decimal places.", solutionOutline: "$x_2=1.3828665568$、$x_3=1.3788068900$；继续检查下一值稳定在所需位数，得到 $\\alpha=1.3788$。" }] },
};

const vectorQuestions: Draft[] = [
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "Points are $A(0,0,0)$, $B(4,0,0)$, $C(3,2,2)$ and $D(1,2,2)$.", parts: [{ label: "(a)", marks: 4, question: "Prove that $ABCD$ is a trapezium but not a parallelogram.", solutionOutline: "$\\overrightarrow{AB}=(4,0,0)$、$\\overrightarrow{DC}=C-D=(2,0,0)$，故一组对边平行；$\\overrightarrow{AD}=(1,2,2)$ 与 $\\overrightarrow{BC}=(-1,2,2)$ 不成比例，所以不是平行四边形。" }, { label: "(b)", marks: 4, question: "Find the perpendicular distance from $C$ to line $AB$.", solutionOutline: "直线 $AB$ 是 $x$ 轴，$C$ 到该线的垂直分量为 $(0,2,2)$，距离是 $\\sqrt{2^2+2^2}=2\\sqrt2$。" }, { label: "(c)", marks: 4, question: "Hence find the exact area of the trapezium.", solutionOutline: "平行边长分别为 4 和 2，高为 $2\\sqrt2$，面积为 $\\frac12(4+2)(2\\sqrt2)=6\\sqrt2$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "Points are $A(0,0,0)$, $B(0,4,0)$, $C(2,3,2)$ and $D(2,1,2)$.", parts: [{ label: "(a)", marks: 4, question: "Show that exactly one pair of opposite sides is parallel.", solutionOutline: "$\\overrightarrow{AB}=(0,4,0)$ 与 $\\overrightarrow{DC}=(0,2,0)$ 平行；$\\overrightarrow{AD}=(2,1,2)$ 与 $\\overrightarrow{BC}=(2,-1,2)$ 不成比例，所以恰有一组对边平行。" }, { label: "(b)", marks: 4, question: "Find the distance from $D$ to line $AB$.", solutionOutline: "沿 $y$ 轴的分量不影响距离，垂直分量为 $(2,0,2)$，所以距离为 $2\\sqrt2$。" }, { label: "(c)", marks: 4, question: "Calculate the area of $ABCD$ exactly.", solutionOutline: "两条平行边长为 4 和 2，高为 $2\\sqrt2$，故面积为 $\\frac12(4+2)2\\sqrt2=6\\sqrt2$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "Points are $A(1,1,0)$, $B(5,1,0)$, $C(4,3,2)$ and $D(2,3,2)$.", parts: [{ label: "(a)", marks: 4, question: "Use direction vectors to classify quadrilateral $ABCD$.", solutionOutline: "$AB=(4,0,0)$、$DC=(2,0,0)$ 平行，而 $AD=(1,2,2)$、$BC=(-1,2,2)$ 不平行，所以是梯形而不是平行四边形。" }, { label: "(b)", marks: 4, question: "Find the shortest distance from $C$ to the line through $A$ and $B$.", solutionOutline: "该直线方向沿 $x$ 轴；$C-A=(3,2,2)$ 的垂直分量为 $(0,2,2)$，距离为 $2\\sqrt2$。" }, { label: "(c)", marks: 4, question: "Find the exact area of the quadrilateral.", solutionOutline: "平行边长为 4、2，高为 $2\\sqrt2$，面积为 $6\\sqrt2$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "Points are $A(0,1,1)$, $B(0,5,1)$, $C(3,4,5)$ and $D(3,2,5)$.", parts: [{ label: "(a)", marks: 4, question: "Prove that the four points form a trapezium and exclude a parallelogram.", solutionOutline: "$AB=(0,4,0)$、$DC=(0,2,0)$ 平行；$AD=(3,1,4)$、$BC=(3,-1,4)$ 不成比例，故为非平行四边形的梯形。" }, { label: "(b)", marks: 4, question: "Find the perpendicular distance between the two parallel sides.", solutionOutline: "两平行线沿 $y$ 方向，连接位移中的垂直分量是 $(3,0,4)$，其长度为 5。" }, { label: "(c)", marks: 4, question: "Hence calculate the exact area.", solutionOutline: "平行边长为 4 和 2，高为 5，所以面积为 $\\frac12(4+2)5=15$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "$l_1:r=(1,0,1)+s(1,2,1)$ and $l_2:r=(3,4,3)+t(2,-1,0)$.", parts: [{ label: "(a)", marks: 4, question: "Show that the lines intersect and find the point.", solutionOutline: "在 $l_1$ 取 $s=2$ 得 $(3,4,3)$，恰为 $l_2$ 在 $t=0$ 的点，因此交点为 $(3,4,3)$。" }, { label: "(b)", marks: 4, question: "Find the acute angle between the lines.", solutionOutline: "方向向量点积为 $1(2)+2(-1)+1(0)=0$，所以两线垂直，锐角为 $\\pi/2$。" }, { label: "(c)", marks: 4, question: "Find a vector equation of the line through the intersection perpendicular to both lines.", solutionOutline: "取叉积 $(1,2,1)\\times(2,-1,0)=(1,2,-5)$（任意非零倍数均可），故所求线为 $r=(3,4,3)+u(1,2,-5)$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "$l_1:r=(0,1,2)+s(2,1,-1)$ and $l_2:r=(4,3,0)+t(1,-1,2)$.", parts: [{ label: "(a)", marks: 5, question: "Determine whether the lines intersect.", solutionOutline: "由第一、二坐标方程可解得 $s=2,t=0$；第三坐标也给 $2-s=0+2t=0$，一致，所以交点为 $(4,3,0)$。" }, { label: "(b)", marks: 3, question: "Find the cosine of the acute angle between them.", solutionOutline: "方向点积为 $2-1-2=-1$，模分别为 $\\sqrt6$、$\\sqrt6$，锐角余弦取绝对值得 $1/6$。" }, { label: "(c)", marks: 4, question: "Let $U$ be the point on $l_1$ where $s=0$, and $V$ the point on $l_2$ where $t=1$. Find the area of triangle $UIV$, where $I$ is the intersection.", solutionOutline: "$I-U=(4,2,-2)$，$V-I=(1,-1,2)$。叉积为 $(2,-10,-6)$，其模为 $2\\sqrt{35}$，所以三角形面积为 $\\sqrt{35}$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "Points $A(1,2,0)$, $B(4,2,3)$ and $C(2,-1,1)$ are given.", parts: [{ label: "(a)", marks: 4, question: "Find a vector equation of line $AB$.", solutionOutline: "$B-A=(3,0,3)=3(1,0,1)$，所以可写 $r=(1,2,0)+t(1,0,1)$。" }, { label: "(b)", marks: 4, question: "Find the angle $BAC$.", solutionOutline: "$AB=(3,0,3)$、$AC=(1,-3,1)$，点积为 6，模为 $3\\sqrt2$ 与 $\\sqrt{11}$，故 $\\cos A=2/\\sqrt{22}$。" }, { label: "(c)", marks: 4, question: "Find the exact area of triangle $ABC$.", solutionOutline: "$AB\\times AC=(9,0,-9)$，模为 $9\\sqrt2$，所以三角形面积为 $9\\sqrt2/2$。" }] },
  { topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12, context: "$l:r=(2,-1,3)+t(1,2,-2)$ and points $P(3,1,1)$, $Q(5,5,-3)$.", parts: [{ label: "(a)", marks: 4, question: "Show that $P$ and $Q$ lie on $l$ and give their parameter values.", solutionOutline: "取 $t=1$ 得 $(3,1,1)=P$，取 $t=3$ 得 $(5,5,-3)=Q$，所以两点都在线上。" }, { label: "(b)", marks: 4, question: "Find the position vector of the point that divides $PQ$ internally in the ratio $1:3$.", solutionOutline: "若 $PR:RQ=1:3$，则 $R=(3P+Q)/4=(14,8,0)/4=(7/2,2,0)$。" }, { label: "(c)", marks: 4, question: "Find the length $PQ$ and a unit vector from $P$ to $Q$.", solutionOutline: "$Q-P=(2,4,-4)=2(1,2,-2)$，长度为 6；单位向量为 $(1,2,-2)/3$。" }] },
];

const papers: LongQuestion[][] = Array.from({ length: 8 }, (_, index) => {
  const paper = index + 9;
  const [expression, expansion, validity] = binomial[index];
  const [points, ratio, a, k] = exponentialModels[index];
  const drafts: Draft[] = [
    { topicId: "caie9709-algebra", difficulty: 1, totalMarks: 4, parts: [
      { label: "(a)", marks: 3, question: `Expand $${expression}$ up to and including the term in $x^2$.`, solutionOutline: `由广义二项式逐项计算，得到 $${expansion}+O(x^3)$。` },
      { label: "(b)", marks: 1, question: "State the complete interval of validity of this expansion.", solutionOutline: `内层变量的绝对值必须小于 1，所以完整有效区间为 $${validity}$，两个端点均不包含。` },
    ] },
    { topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4, context: `The model is $y=ka^x$, where $k,a>0$, and it passes through ${points}.`, parts: [
      { label: "", marks: 4, question: "Use the straight-line form of $\\ln y$ against $x$ to find $a$ and the requested value of $k$ (not merely $\\ln k$).", solutionOutline: `相减两点的对数方程得到 $${ratio}$，所以 $${a}$。再代回截距 $\\ln k$ 并取指数，最终得到 $${k}$；答案必须从 $\\ln k$ 转换为 $k$。` },
    ] },
    foundationDifficultyGaps[index] ?? trigQuestions[index],
    middleDifficultyGaps[index] ?? complexQuestions[index],
    normalQuestions[index],
    differentialEquations[index],
    numericalQuestions[index],
    broadIntegrals[index],
    exactTrigIntegrals[index],
    advancedDifficultyGaps[index] ?? advancedComplex[index],
    vectorQuestions[index],
  ];
  return drafts.map((draft, questionIndex) => question(paper, questionIndex + 1, draft));
});

export const CAIE9709_P3_MOCK_9 = papers[0];
export const CAIE9709_P3_MOCK_10 = papers[1];
export const CAIE9709_P3_MOCK_11 = papers[2];
export const CAIE9709_P3_MOCK_12 = papers[3];
export const CAIE9709_P3_MOCK_13 = papers[4];
export const CAIE9709_P3_MOCK_14 = papers[5];
export const CAIE9709_P3_MOCK_15 = papers[6];
export const CAIE9709_P3_MOCK_16 = papers[7];

export const CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS = papers.flat();

const coreTargetedNumbers = new Set([1, 2, 5, 7, 9]);
export const CAIE9709_P3_CANDIDATE_TARGETED_IDS = new Set(
  papers.flatMap((paper, paperIndex) => paper
    .filter((_, questionIndex) => coreTargetedNumbers.has(questionIndex + 1) || (questionIndex === 10 && paperIndex < 4))
    .map((item) => item.id)),
);
