import type { LongPart, LongQuestion } from "./types";
import { CAIE9709_P3_EXPANSION_QUESTIONS } from "./caie9709-expansion";

type QuestionInput = {
  id: string;
  topicId: string;
  difficulty: 1 | 2 | 3;
  totalMarks: number;
  context?: string;
  parts: LongPart[];
};

function longQuestion(input: QuestionInput): LongQuestion {
  return {
    ...input,
    type: "long",
    testId: "caie9709",
    fullSolution: input.parts
      .map((part) => `${part.label} ${part.solutionOutline}`)
      .join("\n\n"),
  };
}

export const CAIE9709_P3_MOCK_1: LongQuestion[] = [
  longQuestion({
    id: "caie9709-p3-m1-q01", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $2^{x+1}+8(2^{-x})=10$.", solutionOutline: "令 $u=2^x>0$。乘以 $u$ 得 $2u^2-10u+8=0$，即 $(u-1)(u-4)=0$。所以 $2^x=1$ 或 $4$，故 $x=0$ 或 $x=2$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q02", topicId: "caie9709-complex", difficulty: 1, totalMarks: 4,
    context: "The point representing $z$ lies on $|z-2i|=3$ with $\operatorname{Re}(z)\ge 0$. The transformation is $w=z^*-1$.",
    parts: [{ label: "", marks: 4, question: "Sketch and describe fully the locus of $w$.", solutionOutline: "共轭先把圆心 $2i$ 关于实轴反射到 $-2i$，再向左平移 1，所以新圆心为 $-1-2i$、半径为 3。因 $\operatorname{Re}(z)=\operatorname{Re}(z^*)=\operatorname{Re}(w)+1$，限制变为 $\operatorname{Re}(w)\ge-1$。轨迹是该圆的右半圆，端点为 $-1+i$ 与 $-1-5i$，端点包含。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q03", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Evaluate exactly $\displaystyle\int_0^{\pi/6}4\cos x\cos 2x\,dx$.", solutionOutline: "用积化和差 $4\cos x\cos2x=2(\cos3x+\cos x)$。积分为 $[\frac23\sin3x+2\sin x]_0^{\pi/6}=\frac23+1=\frac53$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q04", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    parts: [
      { label: "(a)", marks: 2, question: "The coefficient of $x^2$ in $(1+kx)^{-1/2}$ is $\frac32$, where $k>0$. Find $k$.", solutionOutline: "广义二项式中 $x^2$ 系数为 $\frac{(-1/2)(-3/2)}{2}k^2=\frac38k^2$。令其为 $\frac32$ 得 $k^2=4$；由 $k>0$ 得 $k=2$。" },
      { label: "(b)", marks: 3, question: "Hence find the coefficient of $x^3$ in $(1+x)(1+2x)^{-1/2}$.", solutionOutline: "$(1+2x)^{-1/2}=1-x+\frac32x^2-\frac52x^3+\cdots$。乘以 $1+x$ 后，$x^3$ 系数为 $-\frac52+\frac32=-1$。" },
      { label: "(c)", marks: 1, question: "State the range of values of $x$ for which the expansion is valid.", solutionOutline: "需 $|2x|<1$，所以 $|x|<\frac12$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q05", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    context: "$P(x)=x^4+ax^3+bx^2+ax+1$. It is known that $x-1$ and $x^2+x+1$ are factors of $P(x)$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find $a$ and $b$.", solutionOutline: "$P(1)=0$ 给出 $2+2a+b=0$。模 $x^2+x+1$ 有 $x^2=-x-1,\ x^3=1,\ x^4=x$，余式为 $(1+a-b)x+(1+a-b)$，故 $1+a-b=0$。联立得 $a=-1,b=0$。" },
      { label: "(b)", marks: 2, question: "Hence factorise $P(x)$ completely over the real numbers.", solutionOutline: "$P=x^4-x^3-x+1=(x-1)(x^3-1)=(x-1)^2(x^2+x+1)$。最后的二次因式在实数上不可再分。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q06", topicId: "caie9709-complex", difficulty: 2, totalMarks: 6,
    context: "$\lambda$ is real and positive, and $z=\dfrac{5+\lambda i}{\lambda+i}$. It is given that $\arg z=\dfrac\pi4$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find $\lambda$ exactly.", solutionOutline: "乘以 $\lambda-i$ 后，$z=\frac{6\lambda+(\lambda^2-5)i}{\lambda^2+1}$。辐角为 $\pi/4$ 表示实部、虚部相等且为正，故 $\lambda^2-5=6\lambda$。解得 $\lambda=3\pm\sqrt{14}$，由正值条件取 $3+\sqrt{14}$。" },
      { label: "(b)", marks: 2, question: "Find $|z|$ in exact form.", solutionOutline: "由 $\lambda^2=6\lambda+5$，实部为 $\frac{6\lambda}{\lambda^2+1}=\frac{\lambda}{\lambda+1}$，且两分量相等，所以 $|z|=\sqrt2\,\frac{\lambda}{\lambda+1}=\sqrt2\,\frac{3+\sqrt{14}}{4+\sqrt{14}}$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q07", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 7,
    context: "The equation $x+\ln x=3$ has a positive root $\alpha$.",
    parts: [
      { label: "(a)", marks: 2, question: "Show that the equation has exactly one positive root.", solutionOutline: "令 $f(x)=x+\ln x-3$。在 $x>0$ 上，$f'(x)=1+1/x>0$，所以至多一根；又 $f(2)<0,f(3)>0$，故恰有一根。" },
      { label: "(b)", marks: 2, question: "Show that $2.20<\alpha<2.21$.", solutionOutline: "$f(2.20)=2.20+\ln2.20-3<0$，而 $f(2.21)>0$；由连续性根位于两者之间。" },
      { label: "(c)", marks: 3, question: "Use $x_{n+1}=3-\ln x_n$ with $x_1=2.20$ to find $\alpha$ correct to 4 decimal places.", solutionOutline: "反复代入得到收敛序列，稳定到 $\alpha=2.2079$（4 d.p.）。在根附近 $|g'(x)|=1/x<1$，与收敛一致。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q08", topicId: "caie9709-differentiation", difficulty: 3, totalMarks: 8,
    context: "The curve is $(x+2)y^2=9x$.",
    parts: [
      { label: "(a)", marks: 4, question: "Show that $\displaystyle\frac{dy}{dx}=\frac{9}{y(x+2)^2}$.", solutionOutline: "隐式微分得 $y^2+2y(x+2)y'=9$。又由原式 $y^2=9x/(x+2)$，所以 $9-y^2=18/(x+2)$，代回得 $y'=9/[y(x+2)^2]$。" },
      { label: "(b)", marks: 4, question: "At $x=2$ the curve has two points. Find the acute angle between the tangents there.", solutionOutline: "$x=2$ 时 $y=\pm3/\sqrt2$，对应斜率 $m=9/(16y)=\pm3\sqrt2/16$。两切线关于 $x$ 轴对称，锐角为 $2\tan^{-1}(3\sqrt2/16)$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q09", topicId: "caie9709-de", difficulty: 3, totalMarks: 9,
    context: "A function $y$ satisfies $(y+2)e^x\dfrac{dy}{dx}=xy$, where $y=1$ when $x=0$.",
    parts: [
      { label: "(a)", marks: 7, question: "Find the solution in implicit form.", solutionOutline: "分离变量：$(1+2/y)dy=xe^{-x}dx$。积分得 $y+2\ln y=-(x+1)e^{-x}+C$。代入 $(0,1)$ 得 $C=2$，故 $y+2\ln y=2-(x+1)e^{-x}$。" },
      { label: "(b)", marks: 2, question: "Find the gradient of the solution curve at $x=0$ and explain why it is not necessary to solve explicitly for $y$.", solutionOutline: "直接代入原微分方程：$dy/dx=xy/[(y+2)e^x]=0$。所求是局部斜率，已知点值足够，无需把隐式式反解。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q10", topicId: "caie9709-integration", difficulty: 3, totalMarks: 9,
    parts: [
      { label: "(a)", marks: 4, question: "Evaluate $\displaystyle I=\int_0^1\frac{x^3}{(x^2+2)^2}\,dx$ exactly.", solutionOutline: "令 $u=x^2+2$，则 $x^3dx=(u-2)du/2$，界为 2 到 3。$I=\frac12\int_2^3(1/u-2/u^2)du=\frac12\ln(3/2)-\frac16$。" },
      { label: "(b)", marks: 5, question: "Using the same substitution, evaluate $\displaystyle J=\int_0^1\frac{x^5}{(x^2+2)^2}\,dx$ exactly.", solutionOutline: "$x^5dx=(u-2)^2du/2$，故 $J=\frac12\int_2^3(1-4/u+4/u^2)du=\frac12[u-4\ln u-4/u]_2^3=\frac56-2\ln(3/2)$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m1-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12,
    context: "Relative to an origin $O$, points $A$ and $B$ have position vectors $(1,0,2)$ and $(2,1,-1)$. Point $C$ has position vector $(p,1,q)$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the perpendicular distance from $A$ to the line $OB$.", solutionOutline: "$|\vec{OA}\times\vec{OB}|/|\vec{OB}|$。叉积为 $(-2,5,1)$，模为 $\sqrt{30}$；$|OB|=\sqrt6$，距离为 $\sqrt5$。" },
      { label: "(b)", marks: 8, question: "Given that $OC$ is perpendicular to $AB$ and that $\angle AOC=\angle COB$, find $p$ and $q$.", solutionOutline: "$OC\perp AB$ 给出 $C\cdot(B-A)=0$，故 $C\cdot A=C\cdot B=d$。等角条件为 $d/(|C|\sqrt5)=d/(|C|\sqrt6)$；因 $\sqrt5\ne\sqrt6$，必有 $d=0$。于是 $p+2q=0$ 且 $2p+1-q=0$，解得 $p=-2/5,q=1/5$。" },
    ],
  }),
];

export const CAIE9709_P3_MOCK_2: LongQuestion[] = [
  longQuestion({
    id: "caie9709-p3-m2-q01", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $\ln(x+2)+\ln(x-1)=\ln(4x)$, giving an exact answer.", solutionOutline: "定义域要求 $x>1$。合并对数得 $(x+2)(x-1)=4x$，即 $x^2-3x-2=0$。根为 $(3\pm\sqrt{17})/2$，只有 $(3+\sqrt{17})/2$ 满足定义域。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q02", topicId: "caie9709-complex", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $w^2=2-2\sqrt3\,i$, giving the roots in modulus-argument form.", solutionOutline: "右边模为 4，辐角为 $-\pi/3$。平方根模为 2，辐角相差 $\pi$，故 $w=2e^{-i\pi/6}$ 或 $w=2e^{5i\pi/6}$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q03", topicId: "caie9709-integration", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Evaluate exactly $\displaystyle\int_0^{\pi/4}\sin^2x\,dx$.", solutionOutline: "用 $\sin^2x=(1-\cos2x)/2$。积分为 $[x/2-\sin2x/4]_0^{\pi/4}=\pi/8-1/4$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q04", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    parts: [
      { label: "(a)", marks: 4, question: "Expand $(1-3x)^{-2/3}$ in ascending powers of $x$, up to and including $x^2$.", solutionOutline: "取 $n=-2/3,u=-3x$：$1+nu+n(n-1)u^2/2=1+2x+5x^2$。" },
      { label: "(b)", marks: 1, question: "Hence find the coefficient of $x^2$ in $(1+x^2)(1-3x)^{-2/3}$.", solutionOutline: "系数为原展开的 $5$ 加常数项乘 $x^2$ 的 $1$，共 $6$。" },
      { label: "(c)", marks: 1, question: "State the range of validity.", solutionOutline: "$|-3x|<1$，即 $|x|<1/3$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q05", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    context: "$P(x)=x^3+ax^2+bx+6$. It is known that $x-2$ is a factor and that the remainder on division by $x+1$ is 12.",
    parts: [
      { label: "(a)", marks: 3, question: "Find $a$ and $b$.", solutionOutline: "$P(2)=0$ 给 $2a+b=-7$；$P(-1)=12$ 给 $a-b=7$。解得 $a=0,b=-7$。" },
      { label: "(b)", marks: 3, question: "Hence solve $P(x)=0$.", solutionOutline: "$P=x^3-7x+6=(x-1)(x-2)(x+3)$，所以 $x=1,2,-3$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q06", topicId: "caie9709-complex", difficulty: 2, totalMarks: 6,
    context: "$z$ lies on $|z-(1+i)|=2$ with $\operatorname{Im}(z)\ge1$. The transformation is $w=iz+2$.",
    parts: [
      { label: "(a)", marks: 3, question: "Find the centre and radius of the locus of $w$.", solutionOutline: "乘以 $i$ 是绕原点逆时针 $90^\circ$ 旋转，再向右平移 2。圆心 $1+i$ 映为 $i(1+i)+2=1+i$，半径仍为 2。" },
      { label: "(b)", marks: 3, question: "State which half of the circle is traced and give its endpoints.", solutionOutline: "相对圆心写 $z-(1+i)=a+ib$，原限制为 $b\ge0$；乘 $i$ 后相对位移为 $-b+ia$，故 $\operatorname{Re}(w)\le1$，是左半圆。端点由 $b=0,a=\pm2$ 得 $w=1+i\pm2i$，即 $1+3i$ 与 $1-i$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q07", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 7,
    context: "$e^{-x}=x-1$ has a root $\alpha$ in $(1,2)$.",
    parts: [
      { label: "(a)", marks: 2, question: "Show that this root is unique.", solutionOutline: "令 $f=e^{-x}-x+1$，则 $f'=-e^{-x}-1<0$，所以至多一根；且 $f(1)>0,f(2)<0$，故恰有一根。" },
      { label: "(b)", marks: 2, question: "Explain why $x_{n+1}=1+e^{-x_n}$ is expected to converge near $\alpha$.", solutionOutline: "$g'(x)=-e^{-x}$，在 $(1,2)$ 上 $|g'(x)|<e^{-1}<1$，是局部压缩映射。" },
      { label: "(c)", marks: 3, question: "Starting with $x_1=1.3$, find $\alpha$ correct to 4 decimal places.", solutionOutline: "迭代 $x_{n+1}=1+e^{-x_n}$，数值稳定为 $\alpha=1.2785$（4 d.p.）。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q08", topicId: "caie9709-differentiation", difficulty: 3, totalMarks: 8,
    context: "$y=x^2e^{-x}$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the stationary points.", solutionOutline: "$y'=e^{-x}(2x-x^2)=xe^{-x}(2-x)$，故 $x=0,2$。点为 $(0,0)$ 与 $(2,4e^{-2})$。" },
      { label: "(b)", marks: 4, question: "Determine the nature of each stationary point and describe the limiting behaviour as $x\to\infty$.", solutionOutline: "$y'$ 在 $x<0$ 时为负，在 $(0,2)$ 内为正，所以 $(0,0)$ 是极小点；在 $x=2$ 前正、后负，所以 $(2,4e^{-2})$ 是极大点。指数衰减快于多项式增长，故 $y\to0^+$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q09", topicId: "caie9709-integration", difficulty: 3, totalMarks: 9,
    context: "For $0\le x\le1$, let $f(x)=\dfrac{x^2}{1+x}$.",
    parts: [
      { label: "(a)", marks: 4, question: "Evaluate $\displaystyle\int_0^1 f(x)\,dx$ exactly.", solutionOutline: "多项式除法得 $x^2/(1+x)=x-1+1/(1+x)$。积分为 $[x^2/2-x+\ln(1+x)]_0^1=\ln2-1/2$。" },
      { label: "(b)", marks: 5, question: "Find exactly the area enclosed by $y=x$, $y=f(x)$ and the lines $x=0$, $x=1$.", solutionOutline: "在区间内 $x-f(x)=x/(1+x)>0$，面积为 $\int_0^1x\,dx-\int_0^1f(x)\,dx=1/2-(\ln2-1/2)=1-\ln2$。需说明上下曲线。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q10", topicId: "caie9709-de", difficulty: 3, totalMarks: 9,
    context: "A positive function satisfies $(1+y^2)\dfrac{dy}{dx}=2xy$ and $y=1$ when $x=0$.",
    parts: [
      { label: "(a)", marks: 6, question: "Find the solution in implicit form.", solutionOutline: "分离得 $(1/y+y)dy=2x dx$。积分为 $\ln y+y^2/2=x^2+C$；代初值得 $C=1/2$，所以 $\ln y+y^2/2=x^2+1/2$。" },
      { label: "(b)", marks: 3, question: "Find the positive value of $x$ when $y=e$.", solutionOutline: "代入得 $1+e^2/2=x^2+1/2$，所以 $x^2=(1+e^2)/2$，取正值得 $x=\sqrt{(1+e^2)/2}$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m2-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12,
    context: "Points $A$ and $B$ have position vectors $(1,2,0)$ and $(2,1,1)$. Point $C$ has position vector $(p,-1,q)$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the perpendicular distance from $A$ to the line $OB$.", solutionOutline: "$A\times B=(2,-1,-3)$，所以距离为 $\sqrt{14}/\sqrt6=\sqrt{21}/3$。" },
      { label: "(b)", marks: 8, question: "Given that $OC\perp AB$ and $\angle AOC=\angle COB$, find $p$ and $q$.", solutionOutline: "垂直条件给 $C\cdot(B-A)=0$，即 $C\cdot A=C\cdot B=d$。因 $|A|=\sqrt5,|B|=\sqrt6$ 不同，而两角相等，必有 $d=0$。于是 $p-2=0$ 及 $2p-1+q=0$，得 $p=2,q=-3$。" },
    ],
  }),
];

export const CAIE9709_P3_MOCK_3: LongQuestion[] = [
  longQuestion({
    id: "caie9709-p3-m3-q01", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $2\cos^2x-3\sin x=0$ for $0\le x\le2\pi$.", solutionOutline: "用 $\cos^2x=1-\sin^2x$ 得 $2\sin^2x+3\sin x-2=0$，即 $(2\sin x-1)(\sin x+2)=0$。可行的是 $\sin x=1/2$，所以 $x=\pi/6,5\pi/6$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q02", topicId: "caie9709-complex", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $w^3=8i$, giving the three roots in modulus-argument form.", solutionOutline: "$8i=8e^{i\pi/2}$。三次根模为 2，辐角为 $\pi/6+2k\pi/3$，$k=0,1,2$。故根为 $2e^{i\pi/6},2e^{5i\pi/6},2e^{3i\pi/2}$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q03", topicId: "caie9709-integration", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Evaluate exactly $\displaystyle\int_0^{\pi/3}2\sin x\cos2x\,dx$.", solutionOutline: "$2\sin x\cos2x=\sin3x-\sin x$。积分为 $[-\cos3x/3+\cos x]_0^{\pi/3}=5/6-2/3=1/6$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q04", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    parts: [
      { label: "(a)", marks: 4, question: "Expand $(1+4x)^{1/2}$ up to and including the term in $x^3$.", solutionOutline: "广义二项式给 $1+2x-2x^2+4x^3+\cdots$。" },
      { label: "(b)", marks: 1, question: "Hence find the coefficient of $x^3$ in $(1-2x)(1+4x)^{1/2}$.", solutionOutline: "$x^3$ 系数为 $4+(-2)(-2)=8$。" },
      { label: "(c)", marks: 1, question: "State the range of validity.", solutionOutline: "$|4x|<1$，即 $|x|<1/4$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q05", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    context: "$P(x)=x^4+ax^3+bx^2-8x+4$, and $x=2$ is a repeated root.",
    parts: [
      { label: "(a)", marks: 4, question: "Find $a$ and $b$.", solutionOutline: "$P(2)=0$ 给 $2a+b=-1$；$P'(2)=0$ 给 $3a+b=-6$。解得 $a=-5,b=9$。" },
      { label: "(b)", marks: 2, question: "Factorise $P(x)$ completely over the real numbers.", solutionOutline: "$P=(x-2)^2(x^2-x+1)$。后二次式判别式为 $-3$，在实数上不可再分。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q06", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6,
    context: "$x^3+x=5$ has a positive root $\alpha$.",
    parts: [
      { label: "(a)", marks: 2, question: "Show that $1.5<\alpha<1.6$ and that the root is unique.", solutionOutline: "$f=x^3+x-5$，$f(1.5)<0,f(1.6)>0$；且 $f'=3x^2+1>0$，所以根唯一。" },
      { label: "(b)", marks: 4, question: "Use Newton's method with $x_1=1.5$ to find $\alpha$ correct to 4 decimal places.", solutionOutline: "$x_{n+1}=x_n-(x_n^3+x_n-5)/(3x_n^2+1)$。迭代稳定为 $\alpha=1.5160$（4 d.p.）。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q07", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7,
    context: "$x=t+t^{-1}$ and $y=t-t^{-1}$, where $t>0$.",
    parts: [
      { label: "(a)", marks: 3, question: "Find $dy/dx$ in terms of $t$.", solutionOutline: "$dx/dt=1-t^{-2}$，$dy/dt=1+t^{-2}$，故 $dy/dx=(t^2+1)/(t^2-1)$。" },
      { label: "(b)", marks: 2, question: "Find the point where the tangent is vertical.", solutionOutline: "竖直切线要求 $dx/dt=0$ 且 $dy/dt\ne0$，所以 $t=1$，点为 $(2,0)$。" },
      { label: "(c)", marks: 2, question: "Eliminate $t$ to find a Cartesian equation of the curve, including the restriction on $x$.", solutionOutline: "$x^2-y^2=(t+t^{-1})^2-(t-t^{-1})^2=4$。又因 $t>0$，由 AM-GM 得 $x=t+t^{-1}\ge2$，所以只取双曲线的右支。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q08", topicId: "caie9709-integration", difficulty: 3, totalMarks: 8,
    parts: [
      { label: "(a)", marks: 6, question: "Evaluate $\displaystyle\int_0^1x\tan^{-1}x\,dx$ exactly.", solutionOutline: "分部积分取 $u=\tan^{-1}x,dv=x\,dx$：$I=[x^2\tan^{-1}x/2]_0^1-\frac12\int_0^1x^2/(1+x^2)dx$。又 $x^2/(1+x^2)=1-1/(1+x^2)$，故 $I=\pi/8-\frac12(1-\pi/4)=\pi/4-1/2$。" },
      { label: "(b)", marks: 2, question: "Hence evaluate $\displaystyle\int_0^1x(\frac\pi4-\tan^{-1}x)\,dx$.", solutionOutline: "等于 $(\pi/4)\int_0^1x dx-I=\pi/8-(\pi/4-1/2)=1/2-\pi/8$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q09", topicId: "caie9709-de", difficulty: 3, totalMarks: 9,
    context: "For $x>0$, $y>0$ and $x\dfrac{dy}{dx}=y(1+\ln y)$. It is given that $y=1$ when $x=1$.",
    parts: [
      { label: "(a)", marks: 7, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "令 $u=\ln y$，则 $du/dx=y'/y$。方程化为 $xdu/dx=1+u$，分离并积分得 $\ln(1+u)=\ln x+C$。初值给 $C=0$，所以 $1+u=x$，即 $y=e^{x-1}$。" },
      { label: "(b)", marks: 2, question: "Verify the solution by substitution in the original equation.", solutionOutline: "$y'=e^{x-1}=y$。左边为 $xy$；右边 $y(1+\ln y)=y[1+(x-1)]=xy$，且初值成立。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q10", topicId: "caie9709-complex", difficulty: 3, totalMarks: 9,
    context: "A complex number $z$ satisfies $|z-1|=|z-3i|$ and $\arg z=\pi/4$.",
    parts: [
      { label: "(a)", marks: 4, question: "Show that the first locus is the straight line $x-3y+4=0$, where $z=x+iy$.", solutionOutline: "平方两边：$(x-1)^2+y^2=x^2+(y-3)^2$。展开约去平方项得 $x-3y+4=0$。" },
      { label: "(b)", marks: 5, question: "Sketch both loci and find $z$ exactly.", solutionOutline: "$\arg z=\pi/4$ 是第一象限射线 $y=x,x\ge0$。代入直线得 $x-3x+4=0$，所以 $x=y=2$，即 $z=2+2i$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m3-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12,
    context: "Points $A$ and $B$ have position vectors $(1,1,2)$ and $(2,-1,0)$. Point $C$ has position vector $(p,q,1)$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the perpendicular distance from $A$ to the line $OB$.", solutionOutline: "$A\times B=(2,4,-3)$，所以距离为 $\sqrt{29}/\sqrt5=\sqrt{145}/5$。" },
      { label: "(b)", marks: 8, question: "Given that $OC\perp AB$ and $\angle AOC=\angle COB$, find $p$ and $q$.", solutionOutline: "垂直条件使 $C\cdot A=C\cdot B=d$。因 $|A|=\sqrt6$、$|B|=\sqrt5$ 不同，等角迫使 $d=0$。于是 $p+q+2=0$ 且 $2p-q=0$，解得 $p=-2/3,q=-4/3$。" },
    ],
  }),
];

export const CAIE9709_P3_MOCK_4: LongQuestion[] = [
  longQuestion({
    id: "caie9709-p3-m4-q01", topicId: "caie9709-log-exp", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Solve $\ln(2x-1)=2\ln x$.", solutionOutline: "定义域为 $x>1/2$。方程等价于 $2x-1=x^2$，即 $(x-1)^2=0$，所以唯一解为 $x=1$。重根不能被误写成两个不同解。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q02", topicId: "caie9709-complex", difficulty: 1, totalMarks: 4,
    context: "$\lambda$ is real and $z=\dfrac{\lambda+2i}{1-i}$. The number $z$ is purely imaginary with positive imaginary part.",
    parts: [{ label: "", marks: 4, question: "Find $\lambda$ and $z$.", solutionOutline: "$z=[(\lambda-2)+(\lambda+2)i]/2$。纯虚数要求实部为 0，故 $\lambda=2$；此时虚部为 2>0，且 $z=2i$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q03", topicId: "caie9709-trig", difficulty: 1, totalMarks: 4,
    parts: [{ label: "", marks: 4, question: "Evaluate exactly $\displaystyle\int_0^{\pi/4}4\sin x\sin2x\,dx$.", solutionOutline: "用 $\sin2x=2\sin x\cos x$，积分化为 $8\int_0^{\pi/4}\sin^2x\cos x\,dx$。令 $u=\sin x$，结果为 $[8u^3/3]_0^{\sqrt2/2}=2\sqrt2/3$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q04", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    parts: [
      { label: "(a)", marks: 4, question: "Expand $(1-2x)^{-3/2}$ up to and including the term in $x^2$.", solutionOutline: "广义二项式给 $1+3x+\frac{15}{2}x^2+\cdots$。" },
      { label: "(b)", marks: 1, question: "Hence find the coefficient of $x^2$ in $(1+x+x^2)(1-2x)^{-3/2}$.", solutionOutline: "$x^2$ 系数为 $15/2+3+1=23/2$。" },
      { label: "(c)", marks: 1, question: "State the range of validity.", solutionOutline: "$|-2x|<1$，所以 $|x|<1/2$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q05", topicId: "caie9709-algebra", difficulty: 2, totalMarks: 6,
    context: "$P(x)=x^4+ax^3+bx^2+ax+1$. It is divisible by $x^2+1$ and $P(1)=0$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find $a$ and $b$.", solutionOutline: "模 $x^2+1$ 有 $x^2=-1,x^3=-x,x^4=1$，故余式为 $2-b$，所以 $b=2$。又 $P(1)=2+2a+b=0$，得 $a=-2$。" },
      { label: "(b)", marks: 2, question: "Factorise $P(x)$ completely over the real numbers.", solutionOutline: "$P=(x^2+1)(x^2-2x+1)=(x^2+1)(x-1)^2$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q06", topicId: "caie9709-numerical", difficulty: 2, totalMarks: 6,
    context: "$\ln x=2-x$ has a positive root $\alpha$.",
    parts: [
      { label: "(a)", marks: 2, question: "Show that $1.5<\alpha<1.6$ and that the root is unique.", solutionOutline: "$f=\ln x+x-2$，$f(1.5)<0,f(1.6)>0$，且 $f'=1/x+1>0$，所以根唯一。" },
      { label: "(b)", marks: 2, question: "Explain why $x_{n+1}=e^{2-x_n}$ is not a suitable iteration near $\alpha$.", solutionOutline: "其导数 $g'=-e^{2-x}$，在固定点处 $|g'(\alpha)|=\alpha>1$，所以误差会放大。" },
      { label: "(c)", marks: 2, question: "Give a suitable rearrangement and state why it should converge.", solutionOutline: "可用 $x_{n+1}=2-\ln x_n$。此时 $|g'(x)|=1/x<1$ 在根附近成立，故预期收敛。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q07", topicId: "caie9709-differentiation", difficulty: 2, totalMarks: 7,
    context: "$y=\dfrac{\ln x}{x}$, where $x>0$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the stationary point and determine its nature.", solutionOutline: "$y'=(1-\ln x)/x^2$，所以 $x=e,y=1/e$。导数在 $e$ 前正、后负，故为极大点。" },
      { label: "(b)", marks: 3, question: "Find the $x$-coordinate of the point of inflection.", solutionOutline: "$y''=(2\ln x-3)/x^3$。令其为 0 得 $\ln x=3/2$，故 $x=e^{3/2}$；两侧符号改变。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q08", topicId: "caie9709-integration", difficulty: 3, totalMarks: 8,
    parts: [{ label: "", marks: 8, question: "Evaluate $\displaystyle\int_1^e(\ln x)^2\,dx$ exactly, showing two applications of integration by parts.", solutionOutline: "先取 $u=(\ln x)^2,dv=dx$：$I=[x(\ln x)^2]_1^e-2\int_1^e\ln x\,dx$。再分部积分得 $\int\ln x\,dx=x\ln x-x$。所以原函数为 $x[(\ln x)^2-2\ln x+2]$，代界得 $e-2$。" }],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q09", topicId: "caie9709-de", difficulty: 3, totalMarks: 9,
    context: "$e^y\dfrac{dy}{dx}=xe^{-x^2}$ and $y=0$ when $x=0$.",
    parts: [
      { label: "(a)", marks: 6, question: "Find $y$ explicitly in terms of $x$.", solutionOutline: "积分 $e^y dy=xe^{-x^2}dx$，得 $e^y=-\frac12e^{-x^2}+C$。初值给 $C=3/2$，所以 $y=\ln[(3-e^{-x^2})/2]$。" },
      { label: "(b)", marks: 3, question: "Find the limiting value of $y$ as $x\to\infty$ and explain why the logarithm is defined for all real $x$.", solutionOutline: "$e^{-x^2}\to0$，故 $y\to\ln(3/2)$。且 $0<e^{-x^2}\le1$，所以 $(3-e^{-x^2})/2\ge1>0$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q10", topicId: "caie9709-differentiation", difficulty: 3, totalMarks: 9,
    context: "The curve is $x^2+xy+y^2=7$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find $dy/dx$ in terms of $x$ and $y$.", solutionOutline: "隐式微分：$2x+y+xy'+2yy'=0$，所以 $y'=-(2x+y)/(x+2y)$。" },
      { label: "(b)", marks: 5, question: "Find the equations of the two tangents that are parallel to $y=x$.", solutionOutline: "令斜率为 1：$-(2x+y)=x+2y$，故 $y=-x$。代入曲线得 $x^2=7$。两点为 $(\sqrt7,-\sqrt7)$ 与 $(-\sqrt7,\sqrt7)$，切线分别是 $y=x-2\sqrt7$ 和 $y=x+2\sqrt7$。" },
    ],
  }),
  longQuestion({
    id: "caie9709-p3-m4-q11", topicId: "caie9709-vectors", difficulty: 3, totalMarks: 12,
    context: "Points $A$ and $B$ have position vectors $(2,0,1)$ and $(1,2,2)$. Point $C$ has position vector $(p,1,q)$.",
    parts: [
      { label: "(a)", marks: 4, question: "Find the perpendicular distance from $A$ to the line $OB$.", solutionOutline: "$A\times B=(-2,-3,4)$，故距离为 $\sqrt{29}/3$。" },
      { label: "(b)", marks: 8, question: "Given that $OC\perp AB$ and $\angle AOC=\angle COB$, find $p$ and $q$.", solutionOutline: "垂直条件给 $C\cdot A=C\cdot B=d$。因 $|A|=\sqrt5$、$|B|=3$ 不同，等角迫使 $d=0$。于是 $2p+q=0$ 且 $p+2+2q=0$，解得 $p=2/3,q=-4/3$。" },
    ],
  }),
];

export const CAIE9709_QUESTIONS: LongQuestion[] = [
  ...CAIE9709_P3_MOCK_1,
  ...CAIE9709_P3_MOCK_2,
  ...CAIE9709_P3_MOCK_3,
  ...CAIE9709_P3_MOCK_4,
  ...CAIE9709_P3_EXPANSION_QUESTIONS,
];
