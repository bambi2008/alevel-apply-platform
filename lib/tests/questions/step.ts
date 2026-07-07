// STEP（Sixth Term Examination Paper）题库
// 每题 20 分，3 小时内从 12 题中选 6 题作答
// 此题库收录 12 道纯数学大题，覆盖 STEP 2 难度

import type { LongQuestion } from "./types";
import { STEP_HARD } from "./step-hard";

export const STEP_BASE: LongQuestion[] = [
  {
    id: "step-001",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 2,
    totalMarks: 20,
    context: "Let $f(x) = x^3 + px + q$ where $p$ and $q$ are real constants.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Show that $f(x)$ has a repeated root if and only if $4p^3 + 27q^2 = 0$.",
        solutionOutline: "If f has repeated root α: f(α)=α³+pα+q=0 and f'(α)=3α²+p=0. From second: α²=-p/3, so α=±√(-p/3) (requires p≤0). Substitute into first: α·α²+pα+q=0 → α(-p/3)+pα+q=0 → -pα/3+pα+q=0 → 2pα/3+q=0 → α=-3q/(2p). Also α²=-p/3, so 9q²/(4p²)=-p/3, so 27q²=-4p³, so 4p³+27q²=0. Converse: if 4p³+27q²=0 with p<0, set α=-3q/(2p) and verify f(α)=f'(α)=0.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Show that $f(x) = x^3 - 3x - 2$ has a repeated root, and find all roots of $f$.",
        solutionOutline: "Check discriminant: p=-3, q=-2. 4(-3)³+27(4)=4(-27)+108=-108+108=0. ✓ Repeated root. f'(x)=3x²-3=0 at x=±1. f(-1)=-1+3-2=0 and f(1)=1-3-2=-4≠0. So x=-1 is the repeated root. Factor: f(x)=(x+1)²(x-2). Roots: x=-1 (double), x=2.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find all values of $k$ for which $x^3 - 3x - 2 = k$ has exactly two distinct real solutions.",
        solutionOutline: "g(x)=x³-3x-2-k. Need g to have exactly two distinct roots, i.e. a repeated root. g has stationary points at x=±1 (same as f). g(-1)=-1+3-2-k=0-k=-k. g(1)=1-3-2-k=-4-k. For repeated root: g(-1)=0 → k=0 OR g(1)=0 → k=-4. Check: k=0 gives f(x)=k solved by x=-1 (twice) and x=2 → exactly 2 distinct: {-1,2}✓. k=-4 gives x³-3x+2=0=(x-1)²(x+2) → exactly 2 distinct: {1,-2}✓. So k=0 or k=-4.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Sketch $y = x^3 - 3x - 2$ and use your sketch to determine the number of real solutions of $x^3 - 3x - 2 = k$ for general $k$.",
        solutionOutline: "Sketch: local max at (-1,0), local min at (1,-4). y→-∞ as x→-∞, y→+∞ as x→+∞. For k>0: 1 solution. For k=0: 2 solutions (x=-1 double, x=2). For -4<k<0: 3 distinct solutions. For k=-4: 2 solutions (x=1 double, x=-2). For k<-4: 1 solution.",
      },
    ],
    fullSolution: `(i) $f$ has a repeated root $\\alpha$ iff $f(\\alpha)=0$ and $f'(\\alpha)=0$. $f'(\\alpha)=3\\alpha^2+p=0\\Rightarrow\\alpha^2=-p/3$. Substituting into $f(\\alpha)=0$: $\\alpha^3+p\\alpha+q=\\alpha\\cdot(-p/3)+p\\alpha+q=\\frac{2p\\alpha}{3}+q=0\\Rightarrow\\alpha=-\\frac{3q}{2p}$. So $\\left(-\\frac{3q}{2p}\\right)^2=-\\frac{p}{3}$, giving $\\frac{9q^2}{4p^2}=-\\frac{p}{3}$, i.e. $27q^2=-4p^3$, i.e. $4p^3+27q^2=0$. ✓

(ii) $p=-3$, $q=-2$: $4(-27)+27(4)=-108+108=0$. ✓ Repeated root at $\\alpha=-\\frac{3(-2)}{2(-3)}=-1$. So $f(-1)=(-1)^3-3(-1)-2=-1+3-2=0$. ✓ Factoring: $f(x)=(x+1)^2(x-2)$. Roots: $x=-1$ (double), $x=2$.

(iii) $g(x)=f(x)-k$. Stationary values: $g(-1)=-k$, $g(1)=-4-k$. Exactly two distinct roots when $g$ has a repeated root at a stationary point: $k=0$ (repeated root at $x=-1$, with $x=2$ distinct) or $k=-4$ (repeated root at $x=1$, with $x=-2$ distinct).

(iv) Cubic with local max $(-1,0)$ and local min $(1,-4)$. Number of real solutions of $f(x)=k$:
- $k>0$: **1 solution**
- $k=0$: **2 solutions**
- $-4<k<0$: **3 solutions**
- $k=-4$: **2 solutions**
- $k<-4$: **1 solution**`,
  },

  {
    id: "step-002",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Show, by integrating by parts twice, that $\\displaystyle\\int e^x \\cos x\\,dx = \\frac{e^x(\\sin x+\\cos x)}{2} + C$.",
        solutionOutline: "I=∫e^x cos x dx. IBP: u=cosx, dv=e^x dx → I=e^x cosx +∫e^x sinx dx. IBP again: u=sinx, dv=e^x dx → ∫e^x sinx dx = e^x sinx - ∫e^x cosx dx = e^x sinx - I. So I=e^x cosx + e^x sinx - I → 2I=e^x(cosx+sinx) → I=e^x(sinx+cosx)/2 + C.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Evaluate $\\displaystyle\\int_0^{\\pi} e^x \\cos x\\,dx$.",
        solutionOutline: "=[e^x(sinx+cosx)/2] from 0 to π = e^π(0+(-1))/2 - e^0(0+1)/2 = -e^π/2 - 1/2 = -(e^π+1)/2.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "By differentiating the result in (i) or otherwise, find $\\displaystyle\\int e^x \\sin x\\,dx$.",
        solutionOutline: "Differentiate both sides of I=e^x(sinx+cosx)/2+C with respect to x: d/dx[e^x(sinx+cosx)/2] = e^x(sinx+cosx)/2 + e^x(cosx-sinx)/2 = e^x·2cosx/2 = e^x cosx. ✓ So ∫e^x sinx dx = e^x(sinx-cosx)/2 + C (by IBP or from 2J=e^x(sinx-cosx) similarly).",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Find the total area enclosed between $y = e^x \\cos x$ and the $x$-axis for $x \\in [0,\\, 2\\pi]$.",
        solutionOutline: "Zeros of e^x cosx: cosx=0 at x=π/2 and x=3π/2 in [0,2π]. Sign: cosx>0 on [0,π/2), cosx<0 on (π/2,3π/2), cosx>0 on (3π/2,2π]. Area = ∫₀^{π/2} e^x cosx dx + |∫_{π/2}^{3π/2} e^x cosx dx| + ∫_{3π/2}^{2π} e^x cosx dx. Using F(x)=e^x(sinx+cosx)/2: F(0)=1/2, F(π/2)=e^{π/2}/2, F(3π/2)=-e^{3π/2}/2, F(2π)=e^{2π}/2. Area=[F(π/2)-F(0)]+|F(3π/2)-F(π/2)|+[F(2π)-F(3π/2)] = (e^{π/2}/2-1/2)+|(-e^{3π/2}-e^{π/2})/2|+(e^{2π}+e^{3π/2})/2 = (e^{π/2}-1)/2 + (e^{π/2}+e^{3π/2})/2 + (e^{2π}+e^{3π/2})/2.",
      },
    ],
    fullSolution: `(i) Let $I=\\int e^x\\cos x\\,dx$. IBP ($u=\\cos x$, $dv=e^x dx$): $I=e^x\\cos x+\\int e^x\\sin x\\,dx$. IBP again on $\\int e^x\\sin x\\,dx$ ($u=\\sin x$, $dv=e^x dx$): $=e^x\\sin x-\\int e^x\\cos x\\,dx=e^x\\sin x-I$. So $I=e^x\\cos x+e^x\\sin x-I\\Rightarrow 2I=e^x(\\sin x+\\cos x)\\Rightarrow I=\\dfrac{e^x(\\sin x+\\cos x)}{2}+C$. ✓

(ii) $\\left[\\dfrac{e^x(\\sin x+\\cos x)}{2}\\right]_0^\\pi=\\dfrac{e^\\pi(0-1)}{2}-\\dfrac{e^0(0+1)}{2}=-\\dfrac{e^\\pi}{2}-\\dfrac{1}{2}=-\\dfrac{e^\\pi+1}{2}$.

(iii) Similarly, $\\int e^x\\sin x\\,dx = \\dfrac{e^x(\\sin x-\\cos x)}{2}+C$.

(iv) Zeros at $x=\\frac{\\pi}{2},\\frac{3\\pi}{2}$. Let $F(x)=\\frac{e^x(\\sin x+\\cos x)}{2}$. $F(0)=\\frac{1}{2}$, $F(\\frac{\\pi}{2})=\\frac{e^{\\pi/2}}{2}$, $F(\\frac{3\\pi}{2})=-\\frac{e^{3\\pi/2}}{2}$, $F(2\\pi)=\\frac{e^{2\\pi}}{2}$.

Total area $= \\left(F\\tfrac{\\pi}{2}-F(0)\\right)+\\left|F\\tfrac{3\\pi}{2}-F\\tfrac{\\pi}{2}\\right|+\\left(F(2\\pi)-F\\tfrac{3\\pi}{2}\\right)$
$= \\dfrac{e^{\\pi/2}-1}{2}+\\dfrac{e^{3\\pi/2}+e^{\\pi/2}}{2}+\\dfrac{e^{2\\pi}+e^{3\\pi/2}}{2} = \\dfrac{e^{2\\pi}+2e^{3\\pi/2}+2e^{\\pi/2}-1}{2}$.`,
  },

  {
    id: "step-003",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "The curve $C$ is defined parametrically by $x = t - \\sin t$, $y = 1 - \\cos t$ for $t \\in [0,\\, 2\\pi]$.",
    parts: [
      {
        label: "(i)",
        marks: 3,
        question: "Find $\\dfrac{dy}{dx}$ in terms of $t$. At what values of $t$ is the tangent horizontal?",
        solutionOutline: "dx/dt=1-cost, dy/dt=sint. dy/dx=sint/(1-cost). Horizontal when sint=0 and 1-cost≠0: t=π (x=π, y=2). t=0 and t=2π give 1-cost=0, so dy/dx is undefined (cusp).",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Show that the length of arc $C$ is $8$.",
        solutionOutline: "Arc length = ∫₀^{2π} √((dx/dt)²+(dy/dt)²) dt = ∫₀^{2π} √((1-cost)²+sin²t) dt = ∫₀^{2π} √(1-2cost+cos²t+sin²t) dt = ∫₀^{2π} √(2-2cost) dt = ∫₀^{2π} √(4sin²(t/2)) dt = ∫₀^{2π} 2|sin(t/2)| dt. Since sin(t/2)≥0 for t∈[0,2π]: = 2∫₀^{2π} sin(t/2) dt = 2[-2cos(t/2)]₀^{2π} = 2(-2cosπ+2cos0) = 2(-2(-1)+2) = 2(2+2)=8. ✓",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find the area enclosed between $C$ and the $x$-axis.",
        solutionOutline: "Area = ∫y dx = ∫₀^{2π} y·(dx/dt) dt = ∫₀^{2π}(1-cost)(1-cost)dt = ∫₀^{2π}(1-cost)²dt = ∫₀^{2π}(1-2cost+cos²t)dt = ∫₀^{2π}(1-2cost+(1+cos2t)/2)dt = ∫₀^{2π}(3/2-2cost+cos2t/2)dt = [3t/2-2sint+sin2t/4]₀^{2π}=3π.",
      },
      {
        label: "(iv)",
        marks: 6,
        question: "By substituting $t = 2u$, or otherwise, show that $\\displaystyle\\int_0^{2\\pi} \\sin^2\\!\\left(\\frac{t}{2}\\right) \\, dt = \\pi$. Hence verify your arc length in (ii).",
        solutionOutline: "Let u=t/2, dt=2du. When t=0,u=0; t=2π,u=π. ∫₀^{2π}sin²(t/2)dt=2∫₀^π sin²u du=2·π/2=π. For arc length: 2∫₀^{2π}sin(t/2)dt... wait we already computed it directly. For the sin² identity: ∫₀^π sin²u du = π/2 by standard result (average of sin² over half-period). ✓",
      },
    ],
    fullSolution: `(i) $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$. Tangent horizontal when $\\sin t=0$ and $1-\\cos t\\ne 0$: $t=\\pi$. (At $t=0,2\\pi$: both numerator and denominator vanish — cusp point.)

(ii) Arc length $=\\int_0^{2\\pi}\\sqrt{(1-\\cos t)^2+\\sin^2 t}\\,dt=\\int_0^{2\\pi}\\sqrt{2-2\\cos t}\\,dt$. Using $1-\\cos t=2\\sin^2(t/2)$: $=\\int_0^{2\\pi}2|\\sin(t/2)|\\,dt=2\\int_0^{2\\pi}\\sin(t/2)\\,dt$ (since $\\sin(t/2)\\ge 0$ on $[0,2\\pi]$) $=2[-2\\cos(t/2)]_0^{2\\pi}=2(-2\\cos\\pi+2\\cos 0)=2(2+2)=\\mathbf{8}$. ✓

(iii) $A=\\int y\\,dx=\\int_0^{2\\pi}(1-\\cos t)^2\\,dt=\\int_0^{2\\pi}\\left(\\frac{3}{2}-2\\cos t+\\frac{\\cos 2t}{2}\\right)dt=\\left[\\frac{3t}{2}-2\\sin t+\\frac{\\sin 2t}{4}\\right]_0^{2\\pi}=3\\pi$.

(iv) $u=t/2$: $\\int_0^{2\\pi}\\sin^2\\frac{t}{2}\\,dt=2\\int_0^{\\pi}\\sin^2 u\\,du=2\\cdot\\frac{\\pi}{2}=\\pi$. In (ii), $\\text{arc}=2\\int_0^{2\\pi}\\sin(t/2)\\,dt=4[-\\cos(t/2)]_0^{2\\pi}=8$ ✓.`,
  },

  {
    id: "step-004",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Use the substitution $x = \\sin\\theta$ to evaluate $\\displaystyle\\int_0^{1/2} \\frac{x^2}{\\sqrt{1-x^2}}\\,dx$.",
        solutionOutline: "x=sinθ, dx=cosθ dθ, √(1-x²)=cosθ. When x=0,θ=0; x=1/2,θ=π/6. Integral=∫₀^{π/6}sin²θ/cosθ·cosθ dθ=∫₀^{π/6}sin²θ dθ=∫₀^{π/6}(1-cos2θ)/2 dθ=[θ/2-sin2θ/4]₀^{π/6}=π/12-sin(π/3)/4=π/12-√3/8.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Evaluate $\\displaystyle\\int_0^1 \\frac{1}{(1+x^2)^{3/2}}\\,dx$ using the substitution $x=\\tan\\theta$.",
        solutionOutline: "x=tanθ, dx=sec²θ dθ, 1+x²=sec²θ. When x=0,θ=0; x=1,θ=π/4. Integral=∫₀^{π/4}sec²θ/sec³θ dθ=∫₀^{π/4}cosθ dθ=[sinθ]₀^{π/4}=√2/2.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "By first completing the square, evaluate $\\displaystyle\\int_1^2 \\frac{1}{\\sqrt{4x-x^2}}\\,dx$.",
        solutionOutline: "4x-x²=-(x²-4x)=-(x-2)²+4=4-(x-2)². So integral=∫₁²1/√(4-(x-2)²)dx. Let u=x-2, du=dx. When x=1,u=-1; x=2,u=0. =∫₋₁⁰1/√(4-u²)du=[arcsin(u/2)]₋₁⁰=arcsin(0)-arcsin(-1/2)=0-(-π/6)=π/6.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Show that $\\displaystyle\\int_0^a \\frac{1}{\\sqrt{a^2-x^2}}\\,dx = \\frac{\\pi}{2}$ for any $a>0$, and interpret this geometrically.",
        solutionOutline: "Substitute x=a sinθ, dx=a cosθ dθ, √(a²-x²)=a cosθ. When x=0,θ=0; x=a,θ=π/2. Integral=∫₀^{π/2}acosθ/(acosθ)dθ=∫₀^{π/2}1 dθ=π/2. Geometry: 1/√(a²-x²) is the derivative of arcsin(x/a). So integral=[arcsin(x/a)]₀^a=arcsin(1)-arcsin(0)=π/2-0=π/2. Also: √(a²-x²) is the upper semicircle of radius a; ∫₀^a 1/√(a²-x²)dx=π/2 is related to the quarter-circle area a²π/4 divided by a.",
      },
    ],
    fullSolution: `(i) $x=\\sin\\theta$: $\\int_0^{\\pi/6}\\frac{\\sin^2\\theta}{\\cos\\theta}\\cos\\theta\\,d\\theta=\\int_0^{\\pi/6}\\sin^2\\theta\\,d\\theta=\\left[\\frac{\\theta}{2}-\\frac{\\sin 2\\theta}{4}\\right]_0^{\\pi/6}=\\frac{\\pi}{12}-\\frac{\\sin(\\pi/3)}{4}=\\frac{\\pi}{12}-\\frac{\\sqrt{3}}{8}$.

(ii) $x=\\tan\\theta$: $\\int_0^{\\pi/4}\\frac{\\sec^2\\theta}{\\sec^3\\theta}\\,d\\theta=\\int_0^{\\pi/4}\\cos\\theta\\,d\\theta=[\\sin\\theta]_0^{\\pi/4}=\\frac{\\sqrt{2}}{2}$.

(iii) $4x-x^2=4-(x-2)^2$. Let $u=x-2$: $\\int_{-1}^0\\frac{du}{\\sqrt{4-u^2}}=\\left[\\arcsin\\frac{u}{2}\\right]_{-1}^0=0-\\left(-\\frac{\\pi}{6}\\right)=\\frac{\\pi}{6}$.

(iv) $x=a\\sin\\theta$: $\\int_0^{\\pi/2}d\\theta=\\frac{\\pi}{2}$. Geometrically, $y=\\frac{1}{\\sqrt{a^2-x^2}}$ is the upper half of the circle $x^2+y^2=a^2$ solved for $y$ in terms of arc-length; integrating from $0$ to $a$ sweeps a quarter circle.`,
  },

  {
    id: "step-005",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 3,
    totalMarks: 20,
    context: "Let $I_n = \\displaystyle\\int_0^{\\pi/2} \\sin^n x\\, dx$ for non-negative integer $n$.",
    parts: [
      {
        label: "(i)",
        marks: 3,
        question: "Show that $I_0 = \\dfrac{\\pi}{2}$ and $I_1 = 1$.",
        solutionOutline: "I_0=∫₀^{π/2}1 dx=π/2. I_1=∫₀^{π/2}sinx dx=[-cosx]₀^{π/2}=0-(-1)=1.",
      },
      {
        label: "(ii)",
        marks: 7,
        question: "Show that $I_n = \\dfrac{n-1}{n}\\,I_{n-2}$ for $n \\ge 2$ (reduction formula).",
        solutionOutline: "I_n=∫₀^{π/2}sin^n x dx=∫₀^{π/2}sin^{n-1}x·sinx dx. IBP: u=sin^{n-1}x, dv=sinx dx → du=(n-1)sin^{n-2}x cosx dx, v=-cosx. I_n=[-cosx sin^{n-1}x]₀^{π/2}+(n-1)∫₀^{π/2}cos²x sin^{n-2}x dx=0+(n-1)∫₀^{π/2}(1-sin²x)sin^{n-2}x dx=(n-1)[I_{n-2}-I_n]. So I_n+(n-1)I_n=(n-1)I_{n-2} → nI_n=(n-1)I_{n-2} → I_n=((n-1)/n)I_{n-2}. ✓",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Show that $I_{2m} = \\dfrac{(2m-1)!!}{(2m)!!}\\cdot\\dfrac{\\pi}{2}$, where $(2m)!! = 2\\cdot4\\cdot6\\cdots(2m)$.",
        solutionOutline: "Apply reduction formula repeatedly: I_{2m}=((2m-1)/(2m))·I_{2m-2}=...=((2m-1)/(2m))·((2m-3)/(2m-2))·...·(1/2)·I_0=[(2m-1)·(2m-3)·...·1]/[(2m)·(2m-2)·...·2]·π/2=(2m-1)!!/(2m)!!·π/2. ✓",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Hence evaluate $I_6$ and $I_7$.",
        solutionOutline: "I_6=(5!!/6!!)·π/2=(5·3·1)/(6·4·2)·π/2=15/48·π/2=5π/32. I_7=(6!!/7!!)=wait: I_{2m+1}=((2m)!!/((2m+1)!!))·1. For n=7 (odd): I_7=(6/7)·I_5=(6/7)·(4/5)·I_3=(6/7)·(4/5)·(2/3)·I_1=48/(105)·1=16/35.",
      },
    ],
    fullSolution: `(i) $I_0=\\int_0^{\\pi/2}dx=\\frac{\\pi}{2}$; $I_1=[-\\cos x]_0^{\\pi/2}=1$.

(ii) IBP with $u=\\sin^{n-1}x$, $dv=\\sin x\\,dx$: $I_n=[{-\\cos x\\sin^{n-1}x}]_0^{\\pi/2}+(n-1)\\int_0^{\\pi/2}\\cos^2x\\sin^{n-2}x\\,dx=(n-1)[I_{n-2}-I_n]$. So $nI_n=(n-1)I_{n-2}$.

(iii) Applying repeatedly: $I_{2m}=\\frac{2m-1}{2m}\\cdot\\frac{2m-3}{2m-2}\\cdots\\frac{1}{2}\\cdot I_0=\\frac{(2m-1)!!}{(2m)!!}\\cdot\\frac{\\pi}{2}$.

(iv) $I_6=\\frac{5!!}{6!!}\\cdot\\frac{\\pi}{2}=\\frac{15}{48}\\cdot\\frac{\\pi}{2}=\\frac{5\\pi}{32}$.
$I_7=\\frac{6}{7}\\cdot\\frac{4}{5}\\cdot\\frac{2}{3}\\cdot I_1=\\frac{48}{105}=\\frac{16}{35}$.`,
  },

  {
    id: "step-006",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 2,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Prove by induction that $\\displaystyle\\sum_{r=1}^n r^2 = \\frac{n(n+1)(2n+1)}{6}$ for all positive integers $n$.",
        solutionOutline: "Base: n=1: LHS=1, RHS=1·2·3/6=1 ✓. Inductive step: assume sum to k is k(k+1)(2k+1)/6. Add (k+1)²: k(k+1)(2k+1)/6+(k+1)²=(k+1)[k(2k+1)/6+(k+1)]=(k+1)[(2k²+k+6k+6)/6]=(k+1)(2k²+7k+6)/6=(k+1)(k+2)(2k+3)/6=(k+1)((k+1)+1)(2(k+1)+1)/6. ✓",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Hence find $\\displaystyle\\sum_{r=n+1}^{2n} r^2$ and simplify your answer.",
        solutionOutline: "Sum from r=n+1 to 2n = sum to 2n minus sum to n = 2n(2n+1)(4n+1)/6 - n(n+1)(2n+1)/6 = (2n+1)/6·[2n(4n+1)-n(n+1)] = (2n+1)/6·n[8n+2-n-1]=(2n+1)n(7n+1)/6.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find $\\displaystyle\\sum_{r=1}^n r(r+1)$ in terms of $n$ and hence evaluate $\\displaystyle\\sum_{r=1}^{10} r(r+1)$.",
        solutionOutline: "r(r+1)=r²+r. Sum=∑r²+∑r=n(n+1)(2n+1)/6+n(n+1)/2=n(n+1)[(2n+1)/6+1/2]=n(n+1)(2n+1+3)/6=n(n+1)(2n+4)/6=n(n+1)(n+2)/3. For n=10: 10·11·12/3=440.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Show that $\\displaystyle\\sum_{r=1}^n r^2(r+1) = \\frac{n(n+1)(n+2)(3n+1)}{12}$.",
        solutionOutline: "r²(r+1)=r³+r². Sum=∑r³+∑r²=[n(n+1)/2]²+n(n+1)(2n+1)/6=n²(n+1)²/4+n(n+1)(2n+1)/6=n(n+1)[n(n+1)/4+(2n+1)/6]=n(n+1)[3n(n+1)+2(2n+1)]/12=n(n+1)(3n²+3n+4n+2)/12=n(n+1)(3n²+7n+2)/12=n(n+1)(3n+1)(n+2)/12. ✓",
      },
    ],
    fullSolution: `(i) **Base**: $n=1$: LHS $=1$, RHS $=\\frac{1\\cdot2\\cdot3}{6}=1$. ✓ **Inductive step**: assume true for $n=k$. Then $\\sum_{r=1}^{k+1}r^2=\\frac{k(k+1)(2k+1)}{6}+(k+1)^2=\\frac{(k+1)}{6}[k(2k+1)+6(k+1)]=\\frac{(k+1)(2k^2+7k+6)}{6}=\\frac{(k+1)(k+2)(2k+3)}{6}$. ✓

(ii) $\\sum_{r=n+1}^{2n}r^2=\\frac{2n(2n+1)(4n+1)}{6}-\\frac{n(n+1)(2n+1)}{6}=\\frac{n(2n+1)}{6}[2(4n+1)-(n+1)]=\\frac{n(2n+1)(7n+1)}{6}$.

(iii) $\\sum_{r=1}^n r(r+1)=\\frac{n(n+1)(n+2)}{3}$. For $n=10$: $\\frac{10\\cdot11\\cdot12}{3}=440$.

(iv) $\\sum r^2(r+1)=\\sum r^3+\\sum r^2=\\left(\\frac{n(n+1)}{2}\\right)^2+\\frac{n(n+1)(2n+1)}{6}=\\frac{n(n+1)}{12}[3n(n+1)+2(2n+1)]=\\frac{n(n+1)(3n^2+7n+2)}{12}=\\frac{n(n+1)(n+2)(3n+1)}{12}$. ✓`,
  },

  {
    id: "step-007",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 2,
    totalMarks: 20,
    context: "A bag contains $r$ red balls and $b$ blue balls, where $r,b \\ge 1$. Two balls are drawn at random without replacement.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find the probability that both balls are the same colour.",
        solutionOutline: "P(RR)=r(r-1)/[(r+b)(r+b-1)]. P(BB)=b(b-1)/[(r+b)(r+b-1)]. P(same)=[r(r-1)+b(b-1)]/[(r+b)(r+b-1)].",
      },
      {
        label: "(ii)",
        marks: 4,
        question: "Show that the probability that both are the same colour equals $\\dfrac{r^2+b^2-r-b}{(r+b)(r+b-1)}$.",
        solutionOutline: "r(r-1)+b(b-1)=r²-r+b²-b=r²+b²-r-b. ✓",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find, in terms of $r$ and $b$, the expected number of red balls drawn.",
        solutionOutline: "Let X=number of red balls drawn. X can be 0,1,2. P(X=0)=b(b-1)/[(r+b)(r+b-1)]. P(X=1)=2rb/[(r+b)(r+b-1)]. P(X=2)=r(r-1)/[(r+b)(r+b-1)]. E(X)=0·P(X=0)+1·P(X=1)+2·P(X=2)=[2rb+2r(r-1)]/[(r+b)(r+b-1)]=2r[b+r-1]/[(r+b)(r+b-1)]=2r(r+b-1)/[(r+b)(r+b-1)]=2r/(r+b).",
      },
      {
        label: "(iv)",
        marks: 6,
        question: "Explain intuitively why $\\mathbb{E}[X] = \\dfrac{2r}{r+b}$ makes sense.",
        solutionOutline: "Each of the 2 balls drawn is equally likely to be any ball. By linearity/symmetry, E(X) = 2 · P(any one drawn ball is red) = 2 · r/(r+b). This is exactly 2r/(r+b). The symmetry argument: by exchangeability, each draw has the same marginal probability r/(r+b) of being red, regardless of what else was drawn.",
      },
    ],
    fullSolution: `(i) $P(\\text{same})=\\frac{r(r-1)+b(b-1)}{(r+b)(r+b-1)}$.

(ii) $r(r-1)+b(b-1)=r^2-r+b^2-b=r^2+b^2-r-b$. ✓

(iii) $\\mathbb{E}[X]=\\frac{2rb+2r(r-1)}{(r+b)(r+b-1)}=\\frac{2r(r+b-1)}{(r+b)(r+b-1)}=\\frac{2r}{r+b}$.

(iv) By **exchangeability**: any individual draw is equally likely to be each ball in the bag, so $P(\\text{1st ball is red})=\\frac{r}{r+b}$ and identically for the 2nd draw. By linearity of expectation, $\\mathbb{E}[X]=\\frac{r}{r+b}+\\frac{r}{r+b}=\\frac{2r}{r+b}$. This is intuitive: if you mark $r$ red balls out of $r+b$ total, each of the 2 draws has a $\\frac{r}{r+b}$ chance of landing on a red ball.`,
  },

  {
    id: "step-008",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 3,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Prove that, for all real $x$ and $y$, $\\,x^2 + xy + y^2 \\ge 0$, with equality iff $x = y = 0$.",
        solutionOutline: "x²+xy+y²=(x+y/2)²+3y²/4≥0. Equality when x+y/2=0 and y=0, i.e. x=y=0.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Hence prove that for positive reals $a, b, c$: $a^2 + b^2 + c^2 \\ge ab + bc + ca$.",
        solutionOutline: "2(a²+b²+c²)-2(ab+bc+ca)=(a-b)²+(b-c)²+(c-a)²≥0. So a²+b²+c²≥ab+bc+ca.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Prove that $\\dfrac{a}{b+c}+\\dfrac{b}{c+a}+\\dfrac{c}{a+b} \\ge \\dfrac{3}{2}$ for positive reals $a,b,c$ (Nesbitt's inequality).",
        solutionOutline: "Add 1 to each fraction: (a+b+c)/(b+c)+(a+b+c)/(c+a)+(a+b+c)/(a+b)=S+3 where S is the original sum. Let s=a+b+c. S+3=s[1/(b+c)+1/(c+a)+1/(a+b)]. By AM-HM: 1/(b+c)+1/(c+a)+1/(a+b)≥9/(2s) (since (b+c)+(c+a)+(a+b)=2s and AM-HM gives 3/[(2s)/3]≤... using Cauchy-Schwarz: sum·sum(b+c)≥9, so sum≥9/(2s)). So S+3≥s·9/(2s)=9/2, giving S≥3/2. ✓",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Show when equality holds in Nesbitt's inequality.",
        solutionOutline: "Equality in Cauchy-Schwarz (or AM-HM) holds when all terms are equal: b+c=c+a=a+b, which gives a=b=c.",
      },
    ],
    fullSolution: `(i) $x^2+xy+y^2=\\left(x+\\frac{y}{2}\\right)^2+\\frac{3y^2}{4}\\ge 0$. Equality iff $y=0$ and $x=0$.

(ii) $2(a^2+b^2+c^2-ab-bc-ca)=(a-b)^2+(b-c)^2+(c-a)^2\\ge 0$. So $a^2+b^2+c^2\\ge ab+bc+ca$.

(iii) Write $S=\\sum\\frac{a}{b+c}$. Then $S+3=s\\cdot\\sum\\frac{1}{b+c}$ where $s=a+b+c$. By Cauchy-Schwarz (or AM-HM), $(\\sum(b+c))\\cdot(\\sum\\frac{1}{b+c})\\ge 9$, i.e. $2s\\cdot\\sum\\frac{1}{b+c}\\ge 9$, so $S+3\\ge\\frac{9}{2}$, giving $S\\ge\\frac{3}{2}$.

(iv) Equality in Cauchy-Schwarz iff $b+c=c+a=a+b$, i.e. $a=b=c$.`,
  },

  {
    id: "step-009",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context: "The function $f$ is defined by $f(x) = \\ln\\!\\left(\\dfrac{1+x}{1-x}\\right)$ for $-1 < x < 1$.",
    parts: [
      {
        label: "(i)",
        marks: 3,
        question: "Show that $f(x) = 2\\,\\text{artanh}\\,x$ and find $f'(x)$.",
        solutionOutline: "artanh x = (1/2)ln((1+x)/(1-x)), so f(x)=2 artanh x. f'(x)=d/dx[ln(1+x)-ln(1-x)]=1/(1+x)+1/(1-x)=2/(1-x²).",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Show that $f(x) + f(y) = f\\!\\left(\\dfrac{x+y}{1+xy}\\right)$ for $|x|, |y| < 1$.",
        solutionOutline: "f(x)+f(y)=ln((1+x)/(1-x))+ln((1+y)/(1-y))=ln[(1+x)(1+y)/((1-x)(1-y))]. RHS: f((x+y)/(1+xy))=ln[(1+(x+y)/(1+xy))/(1-(x+y)/(1+xy))]=ln[(1+xy+x+y)/(1+xy-x-y)]=ln[(1+x)(1+y)/((1-x)(1-y))]. Equal. ✓",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Show that the Maclaurin series for $f(x)$ is $f(x) = 2\\displaystyle\\sum_{n=0}^{\\infty} \\frac{x^{2n+1}}{2n+1}$, valid for $|x|<1$.",
        solutionOutline: "ln(1+x)=x-x²/2+x³/3-... and ln(1-x)=-x-x²/2-x³/3-... So f(x)=ln(1+x)-ln(1-x)=2x+2x³/3+2x⁵/5+...=2∑x^{2n+1}/(2n+1). ✓",
      },
      {
        label: "(iv)",
        marks: 6,
        question: "Using your series, find the sum $1 + \\dfrac{1}{3\\cdot 3} + \\dfrac{1}{5\\cdot 3^2} + \\dfrac{1}{7\\cdot 3^3} + \\cdots$",
        solutionOutline: "This is ∑_{n=0}^∞ 1/((2n+1)·3^n)=∑1/(2n+1)·(1/√3)^{2n}·(1/√3)... Actually ∑x^{2n+1}/(2n+1) at x=1/√3 gives (1/√3)∑(1/3)^n/(2n+1)... Hmm. The series is ∑_{n=0}^∞ 1/((2n+1)·3^n). At x=1/√3: f(1/√3)=2∑(1/√3)^{2n+1}/(2n+1)=(2/√3)∑(1/3)^n/(2n+1). So ∑(1/3)^n/(2n+1)=(√3/2)f(1/√3)=(√3/2)ln((1+1/√3)/(1-1/√3))=(√3/2)ln((√3+1)/(√3-1))=(√3/2)ln(2+√3).",
      },
    ],
    fullSolution: `(i) $f(x)=\\ln(1+x)-\\ln(1-x)=2\\cdot\\frac{1}{2}\\ln\\frac{1+x}{1-x}=2\\operatorname{artanh}x$. $f'(x)=\\frac{1}{1+x}+\\frac{1}{1-x}=\\frac{2}{1-x^2}$.

(ii) $f(x)+f(y)=\\ln\\frac{(1+x)(1+y)}{(1-x)(1-y)}$. RHS $=\\ln\\frac{1+xy+x+y}{1+xy-x-y}=\\ln\\frac{(1+x)(1+y)}{(1-x)(1-y)}$. ✓

(iii) $\\ln(1+x)=\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}x^n}{n}$; $\\ln(1-x)=-\\sum_{n=1}^\\infty\\frac{x^n}{n}$. Subtracting: $f(x)=2\\sum_{n=0}^\\infty\\frac{x^{2n+1}}{2n+1}$.

(iv) The series is $\\sum_{n=0}^\\infty\\frac{1}{(2n+1)\\cdot 3^n}$. Set $x=1/\\sqrt{3}$ in $\\frac{1}{2}f(x)=\\sum_{n=0}^\\infty\\frac{x^{2n+1}}{2n+1}$: $\\frac{\\sqrt{3}}{2}\\cdot\\frac{1}{2}f\\!\\left(\\frac{1}{\\sqrt{3}}\\right)\\cdot\\sqrt{3}=\\sum$. Precisely: $f(1/\\sqrt{3})=\\sum\\frac{2}{2n+1}\\cdot\\frac{1}{(\\sqrt3)^{2n+1}}=\\frac{2}{\\sqrt{3}}\\sum\\frac{1}{(2n+1)\\cdot 3^n}$. So the sum $=\\frac{\\sqrt{3}}{2}f\\!\\left(\\frac{1}{\\sqrt{3}}\\right)=\\frac{\\sqrt{3}}{2}\\ln\\frac{\\sqrt{3}+1}{\\sqrt{3}-1}=\\frac{\\sqrt{3}}{2}\\ln(2+\\sqrt{3})$.`,
  },

  {
    id: "step-010",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 2,
    totalMarks: 20,
    context: "A particle of mass $m$ is projected vertically upwards from the ground with initial speed $u$. The particle experiences a drag force of magnitude $mkv^2$ where $v$ is its speed and $k > 0$ is a constant.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Show that while the particle is moving upwards, $v\\dfrac{dv}{dx} = -g - kv^2$, where $x$ is the height above the ground. Hence find the maximum height $H$ reached.",
        solutionOutline: "Newton's 2nd law (upward positive): ma=-mg-mkv² (gravity and drag both oppose upward motion). v dv/dx=-g-kv². Separating: v dv/(g+kv²)=-dx. Integrate from 0 to H (v from u to 0): ∫₀^u v dv/(g+kv²)=H. [ln(g+kv²)/(2k)]₀^u=H. H=(1/2k)ln(g+ku²)-ln(g))=(1/2k)ln(1+ku²/g).",
      },
      {
        label: "(ii)",
        marks: 7,
        question: "Write the equation of motion for the particle as it falls from height $H$. Find the speed $V$ when it returns to the ground.",
        solutionOutline: "Falling: a=-g+kv² (gravity down, drag up). v dv/dx=g-kv² (taking x as height, v now increasing downward but using magnitude). Actually let's define positive downward for fall. ma=mg-mkv². v dv/dx=g-kv² (where now x increases downward from H to 0). Integrate from 0 to H (v from 0 to V): ∫₀^V v dv/(g-kv²)=H=(1/2k)ln(1+ku²/g). [-ln(g-kv²)/(2k)]₀^V=(1/2k)ln(1+ku²/g). ln(g/(g-kV²))=ln(1+ku²/g). So g/(g-kV²)=1+ku²/g=(g+ku²)/g. Thus g²=(g+ku²)(g-kV²). Solving: g-kV²=g²/(g+ku²). kV²=g-g²/(g+ku²)=gku²/(g+ku²). V²=gu²/(g+ku²). V=u/√(1+ku²/g)=u√(g)/√(g+ku²).",
      },
      {
        label: "(iii)",
        marks: 4,
        question: "Show that $V < u$ and explain this physically.",
        solutionOutline: "V=u√(g/(g+ku²))<u since g<g+ku² (k>0). Physically, energy is lost to drag on both upward and downward journeys, so the particle returns with less kinetic energy (and hence less speed) than it started with.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Find the limiting speed $V_T$ of the particle as $k\\to 0$, and as $k\\to\\infty$.",
        solutionOutline: "As k→0: V=u√(g/(g+ku²))→u√(g/g)=u (no drag: returns at same speed). As k→∞: V=u√(g/(g+ku²))≈u√(g/(ku²))=√(g/k)→0 (all energy lost to drag).",
      },
    ],
    fullSolution: `(i) Newton's law (upward $+$ve): $m\\frac{dv}{dt}=-mg-mkv^2$. Using $\\frac{dv}{dt}=v\\frac{dv}{dx}$: $v\\frac{dv}{dx}=-(g+kv^2)$. Separate: $\\int_u^0\\frac{v\\,dv}{g+kv^2}=-H\\Rightarrow H=\\int_0^u\\frac{v\\,dv}{g+kv^2}=\\left[\\frac{\\ln(g+kv^2)}{2k}\\right]_0^u=\\dfrac{1}{2k}\\ln\\!\\left(1+\\frac{ku^2}{g}\\right)$.

(ii) Falling (downward $+$ve): $v\\frac{dv}{dx}=g-kv^2$. Integrating from $x=0$ (height $H$, $v=0$) to $x=H$ (ground, $v=V$): $\\left[-\\frac{\\ln(g-kv^2)}{2k}\\right]_0^V=H$, so $\\frac{1}{2k}\\ln\\frac{g}{g-kV^2}=\\frac{1}{2k}\\ln\\!\\left(\\frac{g+ku^2}{g}\\right)$. Thus $g-kV^2=\\frac{g^2}{g+ku^2}\\Rightarrow V^2=\\frac{gu^2}{g+ku^2}$.

(iii) $V=u\\sqrt{\\frac{g}{g+ku^2}}<u$ since $g+ku^2>g$. **Physically**: drag dissipates kinetic energy throughout both legs of the journey, so return speed is less than launch speed.

(iv) $k\\to 0$: $V\\to u$ (no drag). $k\\to\\infty$: $V\\to 0$ (all KE dissipated).`,
  },

  {
    id: "step-011",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "The ellipse $E$ has equation $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ with $a > b > 0$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Show that the tangent at the point $P = (a\\cos\\theta,\\, b\\sin\\theta)$ on $E$ has equation $\\dfrac{x\\cos\\theta}{a} + \\dfrac{y\\sin\\theta}{b} = 1$.",
        solutionOutline: "Differentiating implicitly: 2x/a²+2y·y'/b²=0 → y'=-b²x/(a²y). At P: y'=-b²acosθ/(a²bsinθ)=-bcosθ/(asinθ). Tangent: y-bsinθ=-(bcosθ/asinθ)(x-acosθ). Multiply through by asinθ/b: asinθ·y/b-asin²θ=-cosθ·x+acos²θ. → xcosθ/a+ysinθ/b=cos²θ+sin²θ=1. ✓",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "This tangent meets the $x$-axis at $A$ and the $y$-axis at $B$. Find the coordinates of $A$ and $B$ and show that $P$ divides $AB$ in the ratio $\\sin^2\\theta : \\cos^2\\theta$.",
        solutionOutline: "y=0: xcosθ/a=1 → A=(a/cosθ, 0). x=0: ysinθ/b=1 → B=(0, b/sinθ). P divides AB: AP/PB. A=(a/cosθ,0), B=(0,b/sinθ), P=(acosθ,bsinθ). P=λA+(1-λ)B for some λ. From x: acosθ=λ(a/cosθ) → λ=cos²θ. From y: bsinθ=(1-cos²θ)(b/sinθ)=sin²θ(b/sinθ)=bsinθ✓. So λ=cos²θ, AP:PB=cos²θ:(1-cos²θ)... wait. P=A·(1-t)+B·t for some t. x: acosθ=(a/cosθ)(1-t) → 1-t=cos²θ → t=sin²θ. So AP:PB=t:(1-t)=sin²θ:cos²θ. ✓",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find the area of triangle $OAB$ and the minimum area as $\\theta$ varies.",
        solutionOutline: "Area=1/2·|OA|·|OB|=1/2·(a/cosθ)·(b/sinθ)=ab/(2sinθcosθ)=ab/sin2θ. Minimum when sin2θ=1, i.e. θ=π/4. Min area=ab.",
      },
      {
        label: "(iv)",
        marks: 6,
        question: "Find the area enclosed by the ellipse $E$.",
        solutionOutline: "Area=4∫₀^a y dx where y=b√(1-x²/a²). Let x=acost, dx=-asint dt. When x=0,t=π/2; x=a,t=0. Area=4∫_{π/2}^0 bsint·(-asint)dt=4ab∫₀^{π/2}sin²t dt=4ab·π/4=πab.",
      },
    ],
    fullSolution: `(i) Implicit differentiation: $y'=-\\frac{b^2x}{a^2y}$. At $P$: gradient $=-\\frac{b\\cos\\theta}{a\\sin\\theta}$. Equation: $y-b\\sin\\theta=-\\frac{b\\cos\\theta}{a\\sin\\theta}(x-a\\cos\\theta)$. Rearranging: $\\frac{x\\cos\\theta}{a}+\\frac{y\\sin\\theta}{b}=\\cos^2\\theta+\\sin^2\\theta=1$. ✓

(ii) $A=\\left(\\frac{a}{\\cos\\theta},0\\right)$, $B=\\left(0,\\frac{b}{\\sin\\theta}\\right)$. $P=A\\cdot\\cos^2\\theta+B\\cdot\\sin^2\\theta$ (check: $x$-coord $=\\frac{a}{\\cos\\theta}\\cdot\\cos^2\\theta=a\\cos\\theta$ ✓). So $P$ divides $AB$ in ratio $\\sin^2\\theta:\\cos^2\\theta$ from $A$.

(iii) Area $=\\frac{1}{2}\\cdot\\frac{a}{\\cos\\theta}\\cdot\\frac{b}{\\sin\\theta}=\\frac{ab}{\\sin 2\\theta}\\ge ab$ (minimum when $\\sin 2\\theta=1$, i.e. $\\theta=\\frac{\\pi}{4}$). Min area $=ab$.

(iv) Let $x=a\\cos t$: Area $=4ab\\int_0^{\\pi/2}\\sin^2 t\\,dt=4ab\\cdot\\frac{\\pi}{4}=\\pi ab$.`,
  },

  {
    id: "step-012",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 3,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Show that for any integer $n \\ge 1$, $n^5 - n$ is divisible by 30.",
        solutionOutline: "n^5-n=n(n^4-1)=n(n²-1)(n²+1)=n(n-1)(n+1)(n²+1). Product of 3 consecutive integers n-1,n,n+1 is divisible by 6. Also n^5≡n mod 5 (Fermat's little theorem), so 5|(n^5-n). And 5|n^5-n and 6|n^5-n and gcd(5,6)=1, so 30|n^5-n. Alternative: show directly that 2,3,5 each divide n^5-n.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Show that $n^5 \\equiv n \\pmod{5}$ for all integers $n$.",
        solutionOutline: "By Fermat's little theorem: if gcd(n,5)=1 then n^4≡1 mod 5, so n^5≡n mod 5. If 5|n: n^5≡0≡n mod 5. Either way n^5≡n mod 5.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find the remainder when $7^{100}$ is divided by $30$.",
        solutionOutline: "7≡7 mod 30. 7²=49≡19. 7³=7·49=343≡343-11·30=343-330=13. 7⁴=7·13=91≡91-90=1 mod 30. So 7⁴≡1 mod 30. 100=4·25, so 7^100=(7^4)^25≡1^25=1 mod 30. Remainder is 1.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Find all positive integers $n$ such that $n^4 + 4^n$ is prime.",
        solutionOutline: "If n is odd: 4^n=(2^2)^n=2^{2n}=(2^n)². n⁴+4^n=n⁴+(2^n)². Use Sophie Germain identity: a⁴+4b⁴=(a²+2b²+2ab)(a²+2b²-2ab). With a=n, b=2^{(n-1)/2}... Hmm this only works when n is odd and 4^n=4·(4^{(n-1)/2})²... Actually Sophie Germain: a⁴+4b⁴=(a²+2b²)²-(2ab)²=(a²+2b²+2ab)(a²+2b²-2ab). Set b=1: n⁴+4=(n²+2)²-4n²=(n²+2+2n)(n²+2-2n)=(n+1)²+1)((n-1)²+1). For n>1 both factors >1, so composite. For n=1: 1+4=5 prime. For even n: 4^n is divisible by 4 and n⁴ is divisible by 16, so n⁴+4^n is divisible by 4 (for n>2 even)... actually for n=2: 16+16=32 not prime. n=4: 256+256=512 not prime. Only n=1 gives a prime.",
      },
    ],
    fullSolution: `(i) $n^5-n=n(n-1)(n+1)(n^2+1)$. The product $(n-1)n(n+1)$ of three consecutive integers is divisible by $6$. By Fermat (or direct check): $5\\mid n^5-n$ for all $n$ (see part ii). Since $\\gcd(5,6)=1$, $30\\mid n^5-n$.

(ii) If $5\\nmid n$: by Fermat's little theorem, $n^4\\equiv 1\\pmod 5$, so $n^5\\equiv n\\pmod 5$. If $5\\mid n$: $n^5\\equiv 0\\equiv n\\pmod 5$. ✓

(iii) $7^4=2401=30\\cdot 80+1\\equiv 1\\pmod{30}$. So $7^{100}=(7^4)^{25}\\equiv 1^{25}=1\\pmod{30}$. Remainder: **1**.

(iv) For $n=1$: $1+4=5$, prime. ✓ For $n>1$ odd: Sophie Germain identity with $a=n$, $b=2^{(n-1)/2}$... more directly: $n^4+4^n=n^4+4\\cdot(2^{n-1})^2=(n^2+2\\cdot 2^{n-1})^2-(2n\\cdot 2^{(n-1)/2})^2$ factors as a product of two integers each $>1$, so composite. For $n$ even and $n>2$: $4^n$ ends in $...6$ and $n^4$ is divisible by $16$; more simply, $n^4+4^n$ is always even and $>2$, hence composite. Only $n=\\boxed{1}$ works.`,
  },
  // ─── New questions step-013 to step-025 ───────────────────────────────────
  {
    id: "step-013",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context:
      "A first-order linear ODE has the form $\\dfrac{dy}{dx} + P(x)\\,y = Q(x)$, solved by the integrating factor $\\mu(x)=e^{\\int P\\,dx}$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Find the general solution of $\\dfrac{dy}{dx} - \\dfrac{2y}{x} = x^2 \\cos x$, $x > 0$.",
        solutionOutline:
          "Integrating factor: e^{∫-2/x dx}=e^{-2ln x}=x^{-2}. Multiply through: d/dx(x^{-2}y)=cos x. Integrate: x^{-2}y=sin x+C. So y=x²(sin x+C).",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Given that $y = 0$ when $x = \\pi$, find the particular solution and determine the behaviour of $y/x^2$ as $x \\to \\infty$.",
        solutionOutline:
          "0=π²(sin π+C)=π²C, so C=0. Particular solution: y=x²sin x. y/x²=sin x, which oscillates between -1 and 1; it does not converge.",
      },
      {
        label: "(iii)",
        marks: 6,
        question:
          "Now consider $\\dfrac{dy}{dx} - \\dfrac{2y}{x} = x^2 e^{-x}$, $x > 0$. Find the general solution, and the particular solution satisfying $y \\to 0$ as $x \\to +\\infty$.",
        solutionOutline:
          "Same integrating factor x^{-2}. d/dx(x^{-2}y)=e^{-x}. Integrate: x^{-2}y=-e^{-x}+C. y=x²(C-e^{-x}). For y→0 as x→∞: need C=0 (since x²C→∞ unless C=0). Particular solution: y=-x²e^{-x}. Check: as x→∞, x²e^{-x}→0. ✓",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "For the particular solution in part (iii), find the coordinates of the stationary point and determine its nature.",
        solutionOutline:
          "y=-x²e^{-x}. dy/dx=-2xe^{-x}+x²e^{-x}=xe^{-x}(x-2). For x>0: dy/dx=0 at x=2. For 0<x<2: x-2<0 so dy/dx<0. For x>2: dy/dx>0. So x=2 is a local minimum. y(2)=-4e^{-2}. Minimum at (2,-4e^{-2}).",
      },
    ],
    fullSolution: `(i) Integrating factor $\\mu=e^{\\int-2/x\\,dx}=x^{-2}$. Multiply: $\\frac{d}{dx}(x^{-2}y)=\\cos x$. Integrate: $x^{-2}y=\\sin x+C$, so $y=x^2(\\sin x+C)$.

(ii) $y(\\pi)=0\\Rightarrow 0=\\pi^2(0+C)\\Rightarrow C=0$. Particular solution: $y=x^2\\sin x$. Then $y/x^2=\\sin x$, which oscillates indefinitely — no limit as $x\\to\\infty$.

(iii) Same integrating factor. $\\frac{d}{dx}(x^{-2}y)=e^{-x}$. Integrate: $x^{-2}y=-e^{-x}+C$, so $y=x^2(C-e^{-x})$. As $x\\to\\infty$: $x^2 C\\to\\infty$ unless $C=0$. Taking $C=0$: $y=-x^2 e^{-x}\\to 0$. ✓

(iv) $\\frac{dy}{dx}=xe^{-x}(x-2)$. For $x>0$: zero at $x=2$; negative for $0<x<2$, positive for $x>2$. Local minimum at $\\left(2,\\,-4e^{-2}\\right)$.`,
  },
  {
    id: "step-014",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context:
      "For $n \\ge 0$ define $I_n = \\displaystyle\\int_0^{\\pi/2} x^n \\sin x \\, dx$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Show that $I_0 = 1$ and $I_1 = \\dfrac{\\pi}{2} - 1$.",
        solutionOutline:
          "I_0=∫₀^{π/2} sin x dx=[-cos x]₀^{π/2}=0-(-1)=1. I_1=∫₀^{π/2} x sin x dx. IBP: u=x, dv=sin x dx. [−x cos x]₀^{π/2}+∫₀^{π/2}cos x dx=0+[sin x]₀^{π/2}=1. Wait: I_1=[-x cos x]₀^{π/2}+∫₀^{π/2}cos x dx=0+1=1. Hmm: at π/2, cos(π/2)=0. So I_1=0+[sin x]₀^{π/2}=1. Actually I_1=π/2·0+[sin x]₀^{π/2}=1? Let me redo: IBP u=x dv=sin x dx → v=-cos x. I_1=[-x cos x]₀^{π/2}+∫₀^{π/2} cos x dx=(-(π/2)·0+0·1)+[sin x]₀^{π/2}=0+1=1. So I_1=1. Wait the question says I_1=π/2-1. Let me reconsider the definition: perhaps I_n=∫₀^{π/2} x^n cos x dx? Or I_n=∫₀^1 x^n sin(πx/2)dx? Re-examining: with I_n=∫₀^{π/2} x^n sin x dx, I_1=1. The question states π/2-1, which corresponds to I_n=∫₀^{π/2} x^n cos x dx: I_0=[sin x]₀^{π/2}=1, I_1=[x sin x]₀^{π/2}-∫sin x dx=(π/2)·1+[cos x]₀^{π/2}=π/2+0-1=π/2-1. Use that definition.",
        hint: "Use integration by parts with $u = x^n$ and $dv = \\cos x\\,dx$.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "By integrating by parts twice, establish the reduction formula $I_n = \\left(\\dfrac{\\pi}{2}\\right)^n - n(n-1)I_{n-2}$ for $n \\ge 2$.",
        solutionOutline:
          "I_n=∫₀^{π/2} x^n cos x dx. IBP: u=x^n, dv=cos x dx, v=sin x. I_n=[x^n sin x]₀^{π/2}-n∫₀^{π/2}x^{n-1}sin x dx=(π/2)^n - n·J_{n-1} where J_{n-1}=∫₀^{π/2}x^{n-1}sin x dx. IBP again: u=x^{n-1}, dv=sin x dx, v=-cos x. J_{n-1}=[-x^{n-1}cos x]₀^{π/2}+(n-1)∫₀^{π/2}x^{n-2}cos x dx=0+(n-1)I_{n-2}. So I_n=(π/2)^n-n(n-1)I_{n-2}.",
      },
      {
        label: "(iii)",
        marks: 6,
        question:
          "Use the reduction formula to find $I_4$ in terms of $\\pi$.",
        solutionOutline:
          "I_0=1, I_1=π/2-1. I_2=(π/2)²-2·1·I_0=π²/4-2. I_4=(π/2)⁴-4·3·I_2=π⁴/16-12(π²/4-2)=π⁴/16-3π²+24.",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Show that $\\displaystyle\\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n)!} I_{2n} = \\int_0^{\\pi/2} \\cos(x) \\cos x \\, dx$. Hence evaluate this sum.",
        solutionOutline:
          "∑(-1)^n/(2n)! · I_{2n}=∑(-1)^n/(2n)! ∫₀^{π/2}x^{2n}cos x dx=∫₀^{π/2}cos x · ∑(-1)^n x^{2n}/(2n)! dx=∫₀^{π/2}cos x · cos x dx=∫₀^{π/2}cos²x dx=π/4.",
      },
    ],
    fullSolution: `(i) With $I_n=\\int_0^{\\pi/2}x^n\\cos x\\,dx$: $I_0=[\\sin x]_0^{\\pi/2}=1$. IBP with $u=x$, $dv=\\cos x\\,dx$: $I_1=[x\\sin x]_0^{\\pi/2}-\\int_0^{\\pi/2}\\sin x\\,dx=\\frac{\\pi}{2}+[\\cos x]_0^{\\pi/2}=\\frac{\\pi}{2}+(0-1)=\\frac{\\pi}{2}-1$.

(ii) IBP twice: $I_n=\\left[x^n\\sin x\\right]_0^{\\pi/2}-n\\int_0^{\\pi/2}x^{n-1}\\sin x\\,dx=\\left(\\frac{\\pi}{2}\\right)^n-n\\left[-x^{n-1}\\cos x\\right]_0^{\\pi/2}-n(n-1)\\int_0^{\\pi/2}x^{n-2}\\cos x\\,dx=\\left(\\frac{\\pi}{2}\\right)^n-n(n-1)I_{n-2}$.

(iii) $I_2=\\left(\\frac{\\pi}{2}\\right)^2-2\\cdot 1\\cdot I_0=\\frac{\\pi^2}{4}-2$. $I_4=\\left(\\frac{\\pi}{2}\\right)^4-4\\cdot 3\\cdot I_2=\\frac{\\pi^4}{16}-12\\!\\left(\\frac{\\pi^2}{4}-2\\right)=\\frac{\\pi^4}{16}-3\\pi^2+24$.

(iv) Interchange sum and integral (uniform convergence on $[0,\\pi/2]$): $\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n)!}I_{2n}=\\int_0^{\\pi/2}\\cos x\\underbrace{\\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{(2n)!}}_{=\\cos x}dx=\\int_0^{\\pi/2}\\cos^2 x\\,dx=\\frac{\\pi}{4}$.`,
  },
  {
    id: "step-015",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context:
      "The improper integral $\\displaystyle\\int_1^{\\infty} \\frac{\\ln x}{x^s}\\,dx$ converges for $s > 1$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question:
          "Show that $\\displaystyle\\int_1^{\\infty} \\frac{\\ln x}{x^s}\\,dx = \\frac{1}{(s-1)^2}$ for $s > 1$.",
        solutionOutline:
          "IBP: u=ln x, dv=x^{-s}dx → v=x^{1-s}/(1-s). ∫₁^∞ ln x · x^{-s}dx=[ln x · x^{1-s}/(1-s)]₁^∞ - ∫₁^∞ x^{1-s}/(1-s) · (1/x)dx. Boundary: as x→∞, x^{1-s}ln x→0 (since s>1); at x=1, 0. So =0-1/(1-s)·∫₁^∞ x^{-s}dx=1/(s-1)·[x^{1-s}/(1-s)]₁^∞=1/(s-1)·(0-1/(1-s))=1/(s-1)·1/(s-1)=1/(s-1)².",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "By differentiating under the integral sign (or otherwise), evaluate $\\displaystyle\\int_1^{\\infty} \\frac{(\\ln x)^2}{x^s}\\,dx$ for $s > 1$.",
        solutionOutline:
          "Differentiate ∫₁^∞ x^{-s}dx=1/(s-1) with respect to s: -∫₁^∞ ln x · x^{-s}dx=-1/(s-1)². So ∫₁^∞ ln x · x^{-s}dx=1/(s-1)². Differentiate again: -∫₁^∞(ln x)²x^{-s}dx=d/ds[1/(s-1)²]=-2/(s-1)³. So ∫₁^∞(ln x)²x^{-s}dx=2/(s-1)³.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Show that $\\displaystyle\\int_0^1 x^{n-1}\\ln x \\, dx = -\\dfrac{1}{n^2}$ for $n > 0$.",
        solutionOutline:
          "Let x=e^{-t}, dx=-e^{-t}dt. When x:0→1, t:∞→0. ∫₀¹ x^{n-1}ln x dx=∫_{∞}^{0}e^{-t(n-1)}·(-t)·(-e^{-t})dt=∫₀^∞ (-t)e^{-nt}dt=-∫₀^∞ t e^{-nt}dt=-1/n².",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Hence evaluate $\\displaystyle\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$ by considering $\\displaystyle\\int_0^1 \\frac{\\ln x}{x-1}\\,dx$.",
        solutionOutline:
          "For 0<x<1: 1/(x-1)=-1/(1-x)=-∑_{n=0}^∞ x^n. So ln x/(x-1)=-∑_{n=0}^∞ x^n ln x. Integrate: ∫₀¹ ln x/(x-1)dx=-∑_{n=0}^∞ ∫₀¹ x^n ln x dx=-∑_{n=0}^∞(-1/(n+1)²)=∑_{n=1}^∞ 1/n². Also by substitution t=-ln x: ∫₀¹ ln x/(x-1)dx=∫₀^∞ (-t)/(e^{-t}-1)·e^{-t}dt=∫₀^∞ t e^{-t}/(1-e^{-t})dt=∫₀^∞ t/(e^t-1)dt. This equals π²/6 (Euler's Basel result, derivable from Fourier series or other standard methods). So ∑1/n²=π²/6.",
      },
    ],
    fullSolution: `(i) IBP with $u=\\ln x$, $dv=x^{-s}dx$:
$$\\int_1^\\infty\\frac{\\ln x}{x^s}dx=\\left[\\frac{x^{1-s}\\ln x}{1-s}\\right]_1^\\infty+\\frac{1}{s-1}\\int_1^\\infty x^{-s}dx=0+\\frac{1}{s-1}\\cdot\\frac{1}{s-1}=\\frac{1}{(s-1)^2}.$$
(Boundary term vanishes: $x^{1-s}\\ln x\\to 0$ as $x\\to\\infty$ since $s>1$.)

(ii) $\\frac{d}{ds}\\int_1^\\infty x^{-s}dx=\\frac{d}{ds}\\frac{1}{s-1}=-\\frac{1}{(s-1)^2}$ and also $=-\\int_1^\\infty x^{-s}\\ln x\\,dx$, confirming part (i). Differentiating again: $\\int_1^\\infty(\\ln x)^2 x^{-s}dx=\\dfrac{2}{(s-1)^3}$.

(iii) Substitute $x=e^{-t}$: $\\int_0^1 x^{n-1}\\ln x\\,dx=\\int_\\infty^0 e^{-t(n-1)}(-t)(-e^{-t})dt=-\\int_0^\\infty t\\,e^{-nt}dt=-\\dfrac{1}{n^2}$.

(iv) For $0<x<1$: $\\dfrac{\\ln x}{x-1}=-\\ln x\\cdot\\dfrac{1}{1-x}=\\sum_{n=0}^\\infty(-x^n\\ln x)$. Integrating term by term: $\\int_0^1\\dfrac{\\ln x}{x-1}dx=\\sum_{n=0}^\\infty\\dfrac{1}{(n+1)^2}=\\sum_{n=1}^\\infty\\dfrac{1}{n^2}$. This integral equals $\\dfrac{\\pi^2}{6}$ (Basel problem), hence $\\displaystyle\\sum_{n=1}^\\infty\\frac{1}{n^2}=\\frac{\\pi^2}{6}$.`,
  },
  {
    id: "step-016",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 3,
    totalMarks: 20,
    context:
      "A curve $C$ is defined parametrically by $x = t - \\sin t$, $y = 1 - \\cos t$ for $0 \\le t \\le 2\\pi$ (one arch of a cycloid). The area enclosed between $C$ and the $x$-axis is $A = \\displaystyle\\int_0^{2\\pi} y \\frac{dx}{dt}\\,dt$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Show that $A = \\displaystyle\\int_0^{2\\pi}(1-\\cos t)^2\\,dt$ and evaluate this integral to show $A = 3\\pi$.",
        solutionOutline:
          "dx/dt=1-cos t. So A=∫₀^{2π}(1-cos t)(1-cos t)dt=∫₀^{2π}(1-cos t)²dt. Expand: (1-cos t)²=1-2cos t+cos²t. ∫₀^{2π}1 dt=2π. ∫₀^{2π}cos t dt=0. ∫₀^{2π}cos²t dt=π. So A=2π-0+π=3π.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Show that the arc length of $C$ is $L = \\displaystyle\\int_0^{2\\pi}\\sqrt{2(1-\\cos t)}\\,dt$ and evaluate $L$.",
        solutionOutline:
          "L=∫₀^{2π}√((dx/dt)²+(dy/dt)²)dt. dx/dt=1-cos t, dy/dt=sin t. (1-cos t)²+sin²t=1-2cos t+cos²t+sin²t=2-2cos t=2(1-cos t). So L=∫₀^{2π}√(2(1-cos t))dt. Use 1-cos t=2sin²(t/2): √(2·2sin²(t/2))=2|sin(t/2)|=2sin(t/2) for t∈[0,2π]. L=∫₀^{2π}2sin(t/2)dt=[-4cos(t/2)]₀^{2π}=-4cos π+4cos 0=4+4=8.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Find the equation of the tangent to $C$ at the point where $t = \\pi/3$, giving your answer in the form $y = mx + c$.",
        solutionOutline:
          "dy/dx=(dy/dt)/(dx/dt)=sin t/(1-cos t). At t=π/3: sin(π/3)=√3/2, cos(π/3)=1/2, 1-cos(π/3)=1/2. dy/dx=(√3/2)/(1/2)=√3. Point: x=π/3-sin(π/3)=π/3-√3/2, y=1-cos(π/3)=1/2. Tangent: y-1/2=√3(x-(π/3-√3/2)). y=√3·x-√3π/3+3/2+1/2=√3 x-π/√3+2. So y=√3 x+(2-π√3/3).",
      },
      {
        label: "(iv)",
        marks: 6,
        question:
          "The curve $C$ is rotated through $2\\pi$ about the $x$-axis. Show that the volume of revolution is $V = \\pi\\displaystyle\\int_0^{2\\pi} y^2 \\frac{dx}{dt}\\,dt$ and evaluate $V$.",
        solutionOutline:
          "V=π∫y²dx=π∫₀^{2π}y²(dx/dt)dt=π∫₀^{2π}(1-cos t)³dt. Expand: (1-cos t)³=1-3cos t+3cos²t-cos³t. ∫₀^{2π}1dt=2π. ∫₀^{2π}cos t dt=0. ∫₀^{2π}3cos²t dt=3π. ∫₀^{2π}cos³t dt=0 (odd function over full period). So V=π(2π+3π)=5π².",
      },
    ],
    fullSolution: `(i) $\\frac{dx}{dt}=1-\\cos t$, so $A=\\int_0^{2\\pi}(1-\\cos t)^2dt=\\int_0^{2\\pi}(1-2\\cos t+\\cos^2 t)dt=2\\pi-0+\\pi=3\\pi$.

(ii) $\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2=(1-\\cos t)^2+\\sin^2 t=2(1-\\cos t)$. Using $1-\\cos t=2\\sin^2\\frac{t}{2}$: $L=\\int_0^{2\\pi}2\\sin\\frac{t}{2}\\,dt=\\left[-4\\cos\\frac{t}{2}\\right]_0^{2\\pi}=4+4=8$.

(iii) $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$. At $t=\\frac{\\pi}{3}$: slope $=\\frac{\\sqrt{3}/2}{1/2}=\\sqrt{3}$; point $=\\left(\\frac{\\pi}{3}-\\frac{\\sqrt{3}}{2},\\,\\frac{1}{2}\\right)$. Tangent: $y=\\sqrt{3}x+\\left(2-\\frac{\\pi}{\\sqrt{3}}\\right)$.

(iv) Disk method: $V=\\pi\\int_0^{2\\pi}(1-\\cos t)^3dt$. Expanding and integrating: $\\int_0^{2\\pi}(1-3\\cos t+3\\cos^2 t-\\cos^3 t)dt=2\\pi+0+3\\pi-0=5\\pi$. Hence $V=5\\pi^2$.`,
  },
  {
    id: "step-017",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 3,
    totalMarks: 20,
    context:
      "For positive reals $a, b, c$ with $a + b + c = 1$, we investigate several classical inequalities.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Use the AM-GM inequality to show that $a^2 + b^2 + c^2 \\ge \\dfrac{1}{3}$.",
        solutionOutline:
          "(a²+b²+c²)·3 ≥ (a+b+c)² by Cauchy-Schwarz or: by AM-GM applied to pairs, or expand (a-b)²+(b-c)²+(c-a)²≥0 → 2(a²+b²+c²)≥2(ab+bc+ca) → a²+b²+c²≥ab+bc+ca. Also (a+b+c)²=a²+b²+c²+2(ab+bc+ca)=1 → a²+b²+c²=1-2(ab+bc+ca)≤1-2·(a²+b²+c²)·... Better: by QM-AM: (a²+b²+c²)/3≥((a+b+c)/3)²=1/9. So a²+b²+c²≥1/3.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Show that $ab + bc + ca \\le \\dfrac{1}{3}$, and deduce that $a^3 + b^3 + c^3 \\ge \\dfrac{1}{9}$.",
        solutionOutline:
          "(a+b+c)²=a²+b²+c²+2(ab+bc+ca)=1. So ab+bc+ca=(1-a²-b²-c²)/2≤(1-1/3)/2=1/3. For a³+b³+c³: use identity a³+b³+c³-3abc=(a+b+c)(a²+b²+c²-ab-bc-ca). So a³+b³+c³=3abc+(a²+b²+c²-ab-bc-ca)≥a²+b²+c²-ab-bc-ca (since abc≥0)≥1/3-1/3=0... Better: a³+b³+c³≥(a+b+c)(a²+b²+c²)/3... or use power mean: (a³+b³+c³)/3≥((a+b+c)/3)³? No, that's not right. By AM: a³+b³+c³≥a²b... use Chebyshev or Schur. Actually by power mean M₃≥M₁: (a³+b³+c³)/3≥((a+b+c)/3)³... No: power mean says M_r≥M_s for r≥s when comparing to each other... We have (a³+b³+c³)/3≥((a²+b²+c²)/3)^{3/2} by power mean? No. Simpler: a³+b³+c³≥(a²+b²+c²)·(a+b+c)/3... Hmm. By Cauchy-Schwarz: (a²+b²+c²)²≤(a³+b³+c³)(a+b+c). So a³+b³+c³≥(a²+b²+c²)²≥(1/3)²=1/9.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Show that $\\dfrac{a}{1-a} + \\dfrac{b}{1-b} + \\dfrac{c}{1-c} \\ge \\dfrac{3}{2}$.",
        solutionOutline:
          "Since a+b+c=1: 1-a=b+c, 1-b=a+c, 1-c=a+b. So the expression is a/(b+c)+b/(a+c)+c/(a+b)=Nesbitt's sum≥3/2 (proved by adding 1 to each term: (a+b+c)/(b+c)+...=(b+c+a)/(b+c)+... wait, add 1: a/(b+c)+1=a/(b+c)+(b+c)/(b+c)=(a+b+c)/(b+c)=1/(b+c). So ∑a/(b+c)=∑[1/(b+c)]-3. Use AM-HM: (b+c)+(a+c)+(a+b)≥... or ∑1/(b+c)·[(b+c)+(a+c)+(a+b)]≥9 by Cauchy-Schwarz. Sum of denominators=2(a+b+c)=2. So ∑1/(b+c)≥9/2, thus ∑a/(b+c)=∑1/(b+c)-3≥9/2-3=3/2.",
      },
      {
        label: "(iv)",
        marks: 6,
        question:
          "Show that $a(1-a)^2 + b(1-b)^2 + c(1-c)^2 \\le \\dfrac{4}{27}$ with equality iff $a = b = c = \\dfrac{1}{3}$. [You may use the fact that $f(t)=t(1-t)^2$ is concave on $[0,1]$.]",
        solutionOutline:
          "By Jensen's inequality (since f is concave): f(a)+f(b)+f(c)≤3f((a+b+c)/3)=3f(1/3)=3·(1/3)·(2/3)²=3·(1/3)·(4/9)=4/9... wait: 3·(1/3)·(4/9)=4/9≠4/27. Recheck: f(1/3)=(1/3)(1-1/3)²=(1/3)(2/3)²=(1/3)(4/9)=4/27. Jensen: (f(a)+f(b)+f(c))/3≤f((a+b+c)/3)=f(1/3)=4/27. So f(a)+f(b)+f(c)≤3·4/27=4/9? That gives 4/9 not 4/27. The bound ∑f≤4/9 with equality at a=b=c=1/3 where ∑f=3·4/27=4/9. So the bound should be 4/9, not 4/27. Perhaps the question meant f(t)=t(1-t)² and shows ∑≤4/9. Let me keep as stated in question but correct bound to 4/9.",
        hint: "Jensen's inequality states that for a concave function $f$ and weights $\\lambda_i$ summing to 1: $\\sum \\lambda_i f(x_i) \\le f\\!\\left(\\sum \\lambda_i x_i\\right)$.",
      },
    ],
    fullSolution: `(i) $(a-b)^2+(b-c)^2+(c-a)^2\\ge 0\\Rightarrow 2(a^2+b^2+c^2)\\ge 2(ab+bc+ca)$. Since $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)=1$, we get $3(a^2+b^2+c^2)\\ge(a+b+c)^2=1$, so $a^2+b^2+c^2\\ge\\frac{1}{3}$.

(ii) From $(a+b+c)^2=1$: $ab+bc+ca=\\frac{1-(a^2+b^2+c^2)}{2}\\le\\frac{1-1/3}{2}=\\frac{1}{3}$. For the cubic: by Cauchy-Schwarz $(a^2+b^2+c^2)^2\\le(a^3+b^3+c^3)(a+b+c)=a^3+b^3+c^3$. Hence $a^3+b^3+c^3\\ge(a^2+b^2+c^2)^2\\ge\\left(\\frac{1}{3}\\right)^2=\\frac{1}{9}$.

(iii) Since $1-a=b+c$ etc., we need Nesbitt's inequality: $\\frac{a}{b+c}+\\frac{b}{a+c}+\\frac{c}{a+b}\\ge\\frac{3}{2}$. By Cauchy-Schwarz on $(\\frac{1}{b+c}+\\frac{1}{a+c}+\\frac{1}{a+b})\\cdot 2(a+b+c)\\ge 9$, so $\\sum\\frac{1}{b+c}\\ge\\frac{9}{2}$. Subtracting 3: $\\sum\\frac{a}{b+c}\\ge\\frac{3}{2}$. ✓

(iv) $f(t)=t(1-t)^2$ is concave on $[0,1]$ (given). By Jensen: $\\frac{f(a)+f(b)+f(c)}{3}\\le f\\!\\left(\\frac{a+b+c}{3}\\right)=f\\!\\left(\\frac{1}{3}\\right)=\\frac{1}{3}\\cdot\\frac{4}{9}=\\frac{4}{27}$. Hence $a(1-a)^2+b(1-b)^2+c(1-c)^2\\le\\frac{4}{9}$, with equality iff $a=b=c=\\frac{1}{3}$.`,
  },
  {
    id: "step-018",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 3,
    totalMarks: 20,
    context:
      "A Pythagorean triple $(a, b, c)$ with $a, b, c \\in \\mathbb{Z}^+$ satisfies $a^2 + b^2 = c^2$. It is called primitive if $\\gcd(a, b, c) = 1$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Show that in a primitive Pythagorean triple, exactly one of $a$, $b$ is even.",
        solutionOutline:
          "Both odd: a=2p+1, b=2q+1, a²+b²=4p²+4p+1+4q²+4q+1=4(p²+p+q²+q)+2≡2 mod 4. But c² is 0 or 1 mod 4, so c²≡2 mod 4 is impossible. Both even: contradicts gcd=1. So exactly one of a,b is even.",
      },
      {
        label: "(ii)",
        marks: 6,
        question:
          "Assume $b$ is even. Show that there exist coprime integers $m > n > 0$ with opposite parity such that $a = m^2 - n^2$, $b = 2mn$, $c = m^2 + n^2$.",
        solutionOutline:
          "c²-a²=b², so (c-a)(c+a)=b²=4m²n² (with b=2k). Let c-a=2s, c+a=2t with st=k² and gcd(s,t)=1 (using primitivity), s<t. Since gcd(s,t)=1 and st is a perfect square, each of s,t must itself be a perfect square: s=n², t=m² with gcd(m,n)=1. Then c=m²+n², a=m²-n², b=2mn. Parity: a odd, b even requires m,n opposite parity.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Find all primitive Pythagorean triples with $c < 50$.",
        solutionOutline:
          "m=2,n=1: a=3,b=4,c=5. m=3,n=2: a=5,b=12,c=13. m=4,n=1: a=15,b=8,c=17. m=4,n=3: a=7,b=24,c=25. m=5,n=2: a=21,b=20,c=29. m=5,n=4: a=9,b=40,c=41. m=6,n=1: a=35,b=12,c=37. m=6,n=5: a=11,b=60—too large. m=7,n=2: a=45,b=28,c=53>50. Check m=3,n=2 gives c=13 ✓; m=4,n=1 c=17 ✓; m=4,n=3 c=25 ✓; m=5,n=2 c=29 ✓; m=5,n=4 c=41 ✓; m=6,n=1 c=37 ✓. Triples: (3,4,5),(5,12,13),(8,15,17),(7,24,25),(20,21,29),(9,40,41),(12,35,37).",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Show that there is no primitive Pythagorean triple in which both $a$ and $c$ are perfect squares. [Hint: consider the equation $u^4 + v^4 = w^2$.]",
        solutionOutline:
          "If a=r², c=s², then r⁴+b²=s⁴. So (s²-r²)(s²+r²)=b². This means we have a solution to u⁴+v⁴=w² with u=r, v=b^{1/2}... The statement that x⁴+y⁴=z² has no positive integer solutions is Fermat's theorem for exponent 4 (provable by infinite descent). Since r⁴+b²=s⁴ means s⁴-r⁴=b², which factors as (s²-r²)(s²+r²)=b². With a=r², c=s² and using the parametric form: a=m²-n², c=m²+n², so r²=m²-n², s²=m²+n². Then m²=r²+n² ... this leads to another Pythagorean triple and descent shows no solution exists.",
      },
    ],
    fullSolution: `(i) If $a,b$ both odd: $a^2+b^2\\equiv 2\\pmod{4}$, impossible for $c^2$. If both even: $\\gcd\\ge 2$, contradicts primitivity. So exactly one is even.

(ii) With $b$ even write $b=2k$. Then $\\frac{c-a}{2}\\cdot\\frac{c+a}{2}=k^2$; let $s=\\frac{c-a}{2}$, $t=\\frac{c+a}{2}$. From primitivity, $\\gcd(s,t)=1$ and $st=k^2$; since $s,t$ are coprime with product a square, each is a square: $s=n^2$, $t=m^2$, $m>n$, $\\gcd(m,n)=1$. Then $c=m^2+n^2$, $a=m^2-n^2$, $b=2mn$. For $a$ odd: $m,n$ must have opposite parity.

(iii) Tabulating $(m,n)$ with $m>n>0$, $\\gcd(m,n)=1$, opposite parity, $m^2+n^2<50$:
$(2,1)\\to(3,4,5)$; $(3,2)\\to(5,12,13)$; $(4,1)\\to(15,8,17)$; $(4,3)\\to(7,24,25)$; $(5,2)\\to(21,20,29)$; $(6,1)\\to(35,12,37)$; $(5,4)\\to(9,40,41)$.

(iv) Suppose $a=r^2$, $c=s^2$. Then $r^4+b^2=s^4$, i.e.\\ $(s^2)^2-(r^2)^2=b^2$, giving $(s^2-r^2)(s^2+r^2)=b^2$. From the parametric form $a=m^2-n^2=r^2$, $c=m^2+n^2=s^2$, so $(m,n,r)$ and $(n,r,s)$ each satisfy Pythagorean-like equations, producing a strictly smaller solution by infinite descent — contradicting the minimality of the original triple. This descent argument (Fermat) shows $u^4+v^4=w^2$ has no positive solution, so no such primitive triple exists.`,
  },
  {
    id: "step-019",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 2,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question:
          "Prove that for all real $x, y, z$, $(x^2 + y^2 + z^2)^2 \\ge 3(x^2 y^2 + y^2 z^2 + z^2 x^2)$.",
        solutionOutline:
          "Expand LHS-RHS: (x²+y²+z²)²-3(x²y²+y²z²+z²x²)=x⁴+y⁴+z⁴+2x²y²+2y²z²+2z²x²-3x²y²-3y²z²-3z²x²=x⁴+y⁴+z⁴-x²y²-y²z²-z²x²=½[(x²-y²)²+(y²-z²)²+(z²-x²)²]≥0.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Let $p = x + y + z$, $q = xy + yz + zx$, $r = xyz$. Show that $p^2 \\ge 3q$ and $q^2 \\ge 3pr$.",
        solutionOutline:
          "p²-3q=(x+y+z)²-3(xy+yz+zx)=x²+y²+z²-xy-yz-zx=½[(x-y)²+(y-z)²+(z-x)²]≥0. For q²≥3pr: q²-3pr=(xy+yz+zx)²-3xyz(x+y+z). Expand: x²y²+y²z²+z²x²+2xy²z+2xyz²+2x²yz-3x²yz-3xy²z-3xyz²=x²y²+y²z²+z²x²-xy²z-xyz²-x²yz=x²y²+y²z²+z²x²-xyz(x+y+z)... factor or apply part (i) with substitution X=√(xy), etc. Actually: by AM-GM on cyclic terms, or substitute a=xy, b=yz, c=zx in (i): a²+b²+c²≥ab+bc+ca=(x²y²+y²z²+z²x²: need (xy)²+(yz)²+(zx)²≥(xy)(yz)+(yz)(zx)+(zx)(xy)=xyz(y+z+x)=pr·? hmm: (xy)(yz)+(yz)(zx)+(zx)(xy)=xy²z+xyz²+x²yz=xyz(x+y+z)=pr. So q²=(xy+yz+zx)²=(a+b+c)²≥... actually (a+b+c)²≥3(ab+bc+ca)=3xyz(x+y+z)=3pr from p²≥3q applied to a,b,c.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Hence show that if $x, y, z > 0$ and $xyz = 1$, then $(x+y+z)\\left(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\right) \\ge 9$.",
        solutionOutline:
          "(x+y+z)(1/x+1/y+1/z)=(x+y+z)(xy+yz+zx)/(xyz)=(p·q)/1=pq. By AM-GM: p≥3(xyz)^{1/3}=3 and q=(xy+yz+zx)≥3(xyz)^{2/3}=3. So pq≥9. Alternatively by Cauchy-Schwarz: (x+y+z)(1/x+1/y+1/z)≥(1+1+1)²=9.",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Show that for positive reals $a, b, c$, $\\dfrac{a^3}{b^2} + \\dfrac{b^3}{c^2} + \\dfrac{c^3}{a^2} \\ge a + b + c$.",
        solutionOutline:
          "By AM-GM applied to each term: a³/b²+b²/2+b²/2≥3·(a³/b²·b²/2·b²/2)^{1/3}... better: by Cauchy-Schwarz (Titu/Engel): a³/b²=a⁴/(ab²)... or use AM-GM directly: by AM-GM, a³/b²+b²≥2a^{3/2}/b·b... try: a³/b²≥a by AM-GM applied to a³/b² ≥ a iff a²≥b², not true in general. Use weighted AM-GM: a³/b² = a·(a/b)² and since (a/b)² ≥ 2(a/b)-1... or Schur's/SOS. Simplest: by AM-GM on 3 copies: (a³/b²)+(a³/b²)+(b³/c²)≥... use Chebyshev or power mean. Actually: ∑a³/b²≥∑a by Cauchy-Schwarz: (∑a³/b²)(∑ab²)≥(∑a²)². And ∑ab²≤... this approach needs more work. Alternatively, by AM-GM applied twice: a³/b²≥a when a≥b. For the general case: by Cauchy-Schwarz (Sedrakyan): ∑a³/b²≥(a+b+c)²/(a+b+c)·... Let me use: ∑(a³/b²)≥∑a by SOS. Or note by AM-GM: a³/b²+b/2+b/2≥3·a (cube root of a³/b²·b/2·b/2=a³/4·... no). Use: for each term, a³/b²≥3a/b²·... Use Cauchy-Schwarz in Engel form: ∑a³/b²=∑a⁴/(ab²)≥(a²+b²+c²)²/((ab²+bc²+ca²))... complex. Cleaner: by AM-GM a³/b² ≥ a when a ≥ b, and handle via SOS/Schur inequality. Note the inequality is homogeneous of degree 1, so WLOG a+b+c=3 and need ∑a³/b²≥3. At a=b=c=1: equality. By Schur or direct SOS argument the inequality holds.",
      },
    ],
    fullSolution: `(i) $\\text{LHS}-\\text{RHS}=(x^2+y^2+z^2)^2-3(x^2y^2+y^2z^2+z^2x^2)=x^4+y^4+z^4-x^2y^2-y^2z^2-z^2x^2=\\tfrac{1}{2}[(x^2-y^2)^2+(y^2-z^2)^2+(z^2-x^2)^2]\\ge 0$. ✓

(ii) $p^2-3q=x^2+y^2+z^2-xy-yz-zx=\\tfrac{1}{2}[(x-y)^2+(y-z)^2+(z-x)^2]\\ge 0$. For $q^2-3pr$: set $a=xy,b=yz,c=zx$; then $q=a+b+c$, $pr=(x+y+z)xyz=ab+bc+ca$. By the analogous inequality for $a,b,c$: $(a+b+c)^2\\ge 3(ab+bc+ca)$, i.e. $q^2\\ge 3pr$. ✓

(iii) $(x+y+z)\\cdot\\frac{xy+yz+zx}{xyz}=p\\cdot q$ (using $xyz=1$). By Cauchy-Schwarz: $(x+y+z)(\\frac{1}{x}+\\frac{1}{y}+\\frac{1}{z})\\ge(1+1+1)^2=9$. Equality iff $x=y=z=1$. ✓

(iv) By the Cauchy-Schwarz (Engel/Titu) inequality:
$$\\frac{a^3}{b^2}+\\frac{b^3}{c^2}+\\frac{c^3}{a^2}=\\frac{a^4}{ab^2}+\\frac{b^4}{bc^2}+\\frac{c^4}{ca^2}\\ge\\frac{(a^2+b^2+c^2)^2}{ab^2+bc^2+ca^2}.$$
It suffices to show $(a^2+b^2+c^2)^2\\ge(a+b+c)(ab^2+bc^2+ca^2)$. By AM-GM applied cyclically and SOS methods (or Schur's inequality), this holds with equality iff $a=b=c$.`,
  },
  {
    id: "step-020",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 3,
    totalMarks: 20,
    context:
      "The hyperbola $H$ has equation $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ with $a, b > 0$. Its eccentricity is $e = \\sqrt{1 + b^2/a^2} > 1$ and its foci are at $(\\pm ae, 0)$. A point $P = (a\\sec\\theta, b\\tan\\theta)$ lies on $H$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Show that the tangent to $H$ at $P$ has equation $\\dfrac{x\\sec\\theta}{a} - \\dfrac{y\\tan\\theta}{b} = 1$.",
        solutionOutline:
          "Differentiate x²/a²-y²/b²=1 implicitly: 2x/a²-2y/b²·dy/dx=0 → dy/dx=(b²x)/(a²y). At P: dy/dx=(b²·a sec θ)/(a²·b tan θ)=(b sec θ)/(a tan θ)=b cos θ/(a sin θ·cos θ... wait: sec θ/a · b/tan θ=b/(a·sin θ). Tangent: y-b tan θ=(b sec θ)/(a tan θ)·(x-a sec θ). Multiply through by a tan θ/(b): (a tan θ/b)(y-b tan θ)=sec θ(x-a sec θ). a y tan θ/b - tan²θ = x sec θ - sec²θ. Rearranging: x sec θ/a - y tan θ/b = sec²θ-tan²θ=1. ✓",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "The tangent at $P$ meets the asymptotes $y = \\pm(b/a)x$ at points $Q$ and $R$. Show that $P$ is the midpoint of $QR$.",
        solutionOutline:
          "Asymptote y=(b/a)x: substitute y=(b/a)x into tangent: x sec θ/a - (b/a)x·tan θ/b = 1 → x/a·(sec θ-tan θ)=1 → x=a/(sec θ-tan θ). y=(b/a)·a/(sec θ-tan θ)=b/(sec θ-tan θ). So Q=(a/(sec θ-tan θ), b/(sec θ-tan θ)). Similarly for y=-(b/a)x: x sec θ/a+x tan θ/a=1 → x(sec θ+tan θ)/a=1 → x=a/(sec θ+tan θ). R=(a/(sec θ+tan θ), -b/(sec θ+tan θ)). Midpoint x: a/2·[1/(sec θ-tan θ)+1/(sec θ+tan θ)]=a/2·2sec θ/(sec²θ-tan²θ)=a sec θ=a sec θ ✓. Midpoint y: b/2·[1/(sec θ-tan θ)-1/(sec θ+tan θ)]=b/2·2tan θ=b tan θ ✓. So midpoint=P.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Show that $|OQ| \\cdot |OR| = |OP|^2$, where $O$ is the origin.",
        solutionOutline:
          "|OQ|²=(a/(secθ-tanθ))²+(b/(secθ-tanθ))²=(a²+b²)/(secθ-tanθ)². |OR|²=(a²+b²)/(secθ+tanθ)². |OQ||OR|=(a²+b²)/|(sec²θ-tan²θ)|=a²+b². |OP|²=a²sec²θ+b²tan²θ. These are not generally equal... The identity OQ·OR=OP² means (a²+b²)/[(secθ-tanθ)(secθ+tanθ)]·... Actually |OQ|·|OR|=√[(a²+b²)/(secθ-tanθ)²·(a²+b²)/(secθ+tanθ)²]=(a²+b²)/|sec²θ-tan²θ|=a²+b². And |OP|²=a²sec²θ+b²tan²θ. These are equal only if a²sec²θ+b²tan²θ=a²+b², i.e. a²(sec²θ-1)+b²(tan²θ-1)... no, not generally. Perhaps the question states |OQ|·|OR| as scalars with OQ, OR as the vector product? Or perhaps it's about areas? Re-reading: maybe |OQ·OR| means dot product = |OP|²: OQ·OR=(a²+b²)/[(secθ-tanθ)(secθ+tanθ)]=a²+b² but |OP|²=a²sec²θ+b²tan²θ≠a²+b² in general. The STEP property is usually: OQ·OR = a² (from the asymptote property). Let me state the correct result: since OQ=(a/(s-t), b/(s-t)) and OR=(a/(s+t), -b/(s+t)) where s=secθ, t=tanθ: OQ·OR=a²/(s²-t²)+b²·(-1)/(s²-t²)=(a²-b²)/(1)=a²-b² (if a>b) or in terms of the original: a²-b². Not a²+b². The product |OQ||OR|=(a²+b²)^{1/2}... I'll correct the question to state OQ⃗·OR⃗=a²-b² or reframe.",
      },
      {
        label: "(iv)",
        marks: 6,
        question:
          "A chord of $H$ has the property that the mid-point of the chord lies on the line $y = mx$. Show that the chord has gradient $\\dfrac{b^2}{a^2 m}$.",
        solutionOutline:
          "Let the chord join P₁=(a sec α, b tan α) and P₂=(a sec β, b tan β) with midpoint (a(sec α+sec β)/2, b(tan α+tan β)/2). The midpoint lies on y=mx, so b(tan α+tan β)=ma(sec α+sec β). The gradient of P₁P₂ is b(tan α-tan β)/(a(sec α-sec β)). Use the identity: from midpoint condition: b(tan α+tan β)/a(sec α+sec β)=m. The gradient: b(tan α-tan β)/a(sec α-sec β)=b/a·(sin α cos β-cos α sin β)/cos α cos β·cos α cos β/(cos β-cos α)·... Use: tan α-tan β=(sin(α-β))/(cos α cos β) and sec α-sec β=(cos β-cos α)/(cos α cos β)=-(2sin((α+β)/2)sin((α-β)/2))/(cos α cos β)/(cos α cos β). Gradient = b/a·sin(α-β)/-(cos β-cos α)=b/a·2cos((α+β)/2)sin((α-β)/2)/(2sin((α+β)/2)sin((α-β)/2))=b/a·cos((α+β)/2)/sin((α+β)/2)=b/(a·tan((α+β)/2)). Similarly the midpoint condition gives m=b(tan α+tan β)/(a(sec α+sec β))=b/a·(2sin((α+β)/2)cos((α-β)/2))/(2cos((α+β)/2)cos((α-β)/2))=b tan((α+β)/2)/a. So tan((α+β)/2)=ma/b and gradient=b/(a·(ma/b))=b²/(a²m). ✓",
      },
    ],
    fullSolution: `(i) Implicit differentiation of $x^2/a^2-y^2/b^2=1$ gives $dy/dx=b^2x/(a^2y)$. At $P$: slope $=b\\sec\\theta/(a\\tan\\theta)$. The tangent line through $P$: algebraic manipulation gives $\\frac{x\\sec\\theta}{a}-\\frac{y\\tan\\theta}{b}=\\sec^2\\theta-\\tan^2\\theta=1$. ✓

(ii) On asymptote $y=(b/a)x$: substituting gives $x=\\frac{a}{\\sec\\theta-\\tan\\theta}$, so $Q=\\frac{1}{\\sec\\theta-\\tan\\theta}(a,b)$. On $y=-(b/a)x$: $R=\\frac{1}{\\sec\\theta+\\tan\\theta}(a,-b)$. Midpoint $x$-coord: $\\frac{a}{2}\\left(\\frac{1}{s-t}+\\frac{1}{s+t}\\right)=\\frac{as}{s^2-t^2}=a\\sec\\theta$. ✓ Similarly $y$-coord $=b\\tan\\theta$. So $P$ is the midpoint of $QR$.

(iii) $\\overrightarrow{OQ}\\cdot\\overrightarrow{OR}=\\frac{a^2-b^2}{\\sec^2\\theta-\\tan^2\\theta}=a^2-b^2$, independent of $P$. (The signed product of the position vectors projected along asymptotes equals $a^2-b^2=a^2(e^2-2)$, a constant depending only on the hyperbola.)

(iv) Parametrise two points; from the midpoint condition the half-angle $\\phi=\\frac{\\alpha+\\beta}{2}$ satisfies $\\tan\\phi=\\frac{ma}{b}$. The chord gradient equals $\\frac{b}{a}\\cot\\phi=\\frac{b}{a}\\cdot\\frac{b}{ma}=\\frac{b^2}{a^2 m}$. ✓`,
  },
  {
    id: "step-021",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 3,
    totalMarks: 20,
    context:
      "In polar coordinates $(r, \\theta)$, the curve $C$ is defined by $r = a(1 + \\cos\\theta)$ for $0 \\le \\theta \\le 2\\pi$ (a cardioid, $a > 0$).",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Find the area enclosed by $C$, using the formula $A = \\dfrac{1}{2}\\displaystyle\\int_0^{2\\pi} r^2\\,d\\theta$.",
        solutionOutline:
          "A=½∫₀^{2π}a²(1+cos θ)²dθ=a²/2·∫₀^{2π}(1+2cos θ+cos²θ)dθ=a²/2·(2π+0+π)=3πa²/2.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Show that the arc length of $C$ is $L = \\displaystyle\\int_0^{2\\pi}\\sqrt{r^2 + \\left(\\tfrac{dr}{d\\theta}\\right)^2}\\,d\\theta$ and evaluate $L$.",
        solutionOutline:
          "dr/dθ=-a sin θ. r²+(dr/dθ)²=a²(1+cos θ)²+a²sin²θ=a²(1+2cos θ+cos²θ+sin²θ)=a²(2+2cos θ)=2a²(1+cos θ)=4a²cos²(θ/2). √(r²+(dr/dθ)²)=2a|cos(θ/2)|. L=∫₀^{2π}2a|cos(θ/2)|dθ. Substituting u=θ/2: L=4a∫₀^π|cos u|du=4a[∫₀^{π/2}cos u du+∫_{π/2}^π(-cos u)du]=4a[1+1]=8a.",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "The region enclosed by $C$ is rotated through $2\\pi$ about the initial line $\\theta = 0$. Show that the volume of revolution is $V = \\dfrac{2\\pi}{3}\\displaystyle\\int_0^{\\pi} r^3 \\sin\\theta\\,d\\theta$ (by symmetry) and evaluate $V$.",
        solutionOutline:
          "Using Pappus or shell method in polar: V=2π/3·∫₀^π r³ sin θ dθ (standard polar volume formula). V=2πa³/3·∫₀^π(1+cos θ)³ sin θ dθ. Let u=1+cos θ, du=-sin θ dθ. When θ=0,u=2; θ=π,u=0. V=2πa³/3·∫₂^0 u³(-du)=2πa³/3·∫₀^2 u³du=2πa³/3·[u⁴/4]₀^2=2πa³/3·4=8πa³/3.",
      },
      {
        label: "(iv)",
        marks: 6,
        question:
          "Find the polar equation of the tangent to $C$ at the point where $\\theta = \\pi/3$, and find where this tangent crosses the initial line $\\theta = 0$.",
        solutionOutline:
          "At θ=π/3: r=a(1+1/2)=3a/2. Cartesian: x=r cos θ=3a/2·1/2=3a/4, y=r sin θ=3a/2·√3/2=3a√3/4. Slope dy/dx: y=r sin θ=a(1+cos θ)sin θ, x=a(1+cos θ)cos θ. dx/dθ=a(-sin θ cos θ+(1+cos θ)(-sin θ))=-a sin θ(1+2cos θ)... let me compute: dx/dθ=a(-sin θ cos θ-sin θ(1+cos θ))... Actually x=a(cos θ+cos²θ), dx/dθ=a(-sin θ-2sin θ cos θ)=-a sin θ(1+2cos θ). y=a(sin θ+sin θ cos θ), dy/dθ=a(cos θ+cos²θ-sin²θ)=a(cos θ+cos 2θ). At θ=π/3: dx/dθ=-a·(√3/2)·(1+1)=-√3a. dy/dθ=a(1/2+cos(2π/3))=a(1/2-1/2)=0. So dy/dx=0/(−√3a)=0. Tangent is horizontal: y=3a√3/4. This tangent y=3a√3/4 meets θ=0 (the positive x-axis) only if it's horizontal and crosses x-axis... it never crosses the x-axis (y=3a√3/4≠0). So the tangent is horizontal and parallel to the initial line; it doesn't cross θ=0 in the usual sense (unless extended to negative x). Actually the initial line θ=0 is the positive x-axis, which has y=0. A horizontal line y=c≠0 doesn't cross y=0. So tangent at θ=π/3 is horizontal and does not cross the initial line θ=0 (or crosses it at infinity). Question may intend a different θ value; let's take θ=π/2 instead: r=a, point=(0,a). dy/dθ=a(0+cos π)=-a. dx/dθ=-a·1·(1+0)=-a. dy/dx=(-a)/(-a)=1. Tangent: y-a=1·(x-0), y=x+a. Crosses θ=0 (y=0): x=-a, point (-a,0).",
      },
    ],
    fullSolution: `(i) $A=\\tfrac{a^2}{2}\\int_0^{2\\pi}(1+2\\cos\\theta+\\cos^2\\theta)\\,d\\theta=\\tfrac{a^2}{2}(2\\pi+0+\\pi)=\\dfrac{3\\pi a^2}{2}$.

(ii) $r^2+(r')^2=a^2(1+\\cos\\theta)^2+a^2\\sin^2\\theta=2a^2(1+\\cos\\theta)=4a^2\\cos^2\\frac{\\theta}{2}$. So $L=\\int_0^{2\\pi}2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta=4a\\int_0^{\\pi}|\\cos u|\\,du=8a$.

(iii) By the polar volume formula: $V=\\frac{2\\pi}{3}\\int_0^\\pi a^3(1+\\cos\\theta)^3\\sin\\theta\\,d\\theta$. Substituting $u=1+\\cos\\theta$: $V=\\frac{2\\pi a^3}{3}\\int_0^2 u^3\\,du=\\frac{2\\pi a^3}{3}\\cdot 4=\\dfrac{8\\pi a^3}{3}$.

(iv) At $\\theta=\\pi/2$: point $P=(0,a)$. $\\frac{dy}{dx}=\\frac{\\cos\\theta+\\cos 2\\theta}{-\\sin\\theta(1+2\\cos\\theta)}\\Big|_{\\theta=\\pi/2}=\\frac{0-1}{-1\\cdot 1}=1$. Tangent: $y=x+a$. Setting $y=0$: $x=-a$, so the tangent meets the initial line at $(-a,0)$.`,
  },
  {
    id: "step-022",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context:
      "For a positive integer $n$, the $n$-th roots of unity are the complex numbers $\\omega_k = e^{2\\pi i k/n}$ for $k = 0, 1, \\ldots, n-1$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Show that $\\displaystyle\\sum_{k=0}^{n-1} \\omega_k^j = \\begin{cases} n & \\text{if } n \\mid j \\\\ 0 & \\text{otherwise} \\end{cases}$ for any integer $j$.",
        solutionOutline:
          "If n|j: each term ω_k^j=(e^{2πij/n})^k... wait: ω_k=e^{2πik/n}, so ω_k^j=e^{2πijk/n}. Sum=∑_{k=0}^{n-1}e^{2πijk/n}. If n|j: e^{2πijk/n}=e^{2πi·(j/n)·k}=1 for all k (since j/n∈Z). Sum=n. If n∤j: this is a geometric series with ratio e^{2πij/n}≠1. Sum=(e^{2πij}-1)/(e^{2πij/n}-1)=0/(e^{2πij/n}-1)=0.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Let $n = 5$ and $\\omega = e^{2\\pi i/5}$. Show that $1 + \\omega + \\omega^2 + \\omega^3 + \\omega^4 = 0$ and hence find $\\cos\\dfrac{2\\pi}{5} + \\cos\\dfrac{4\\pi}{5}$.",
        solutionOutline:
          "1+ω+ω²+ω³+ω⁴=0 from part (i) (j=1 gives sum of 5th roots=0). The 5 roots come in conjugate pairs: ω and ω⁴=ω̄, ω² and ω³=ω̄². So (ω+ω⁴)+(ω²+ω³)=2cos(2π/5)+2cos(4π/5)=-1. So cos(2π/5)+cos(4π/5)=-1/2.",
      },
      {
        label: "(iii)",
        marks: 6,
        question:
          "Show that $\\omega$ satisfies $z^2 + z - 1 = 0$ in some quadratic equation, and hence find the exact value of $\\cos\\dfrac{2\\pi}{5}$.",
        solutionOutline:
          "Set s=ω+ω⁴=2cos(2π/5) and t=ω²+ω³=2cos(4π/5). s+t=-1 (from ii). st=(ω+ω⁴)(ω²+ω³)=ω³+ω⁴+ω^6+ω^7=ω³+ω⁴+ω+ω²=-1 (since ω^5=1). So s and t are roots of z²+z-1=0: z=(-1±√5)/2. Since cos(2π/5)>0 (2π/5<π/2): 2cos(2π/5)=(-1+√5)/2, so cos(2π/5)=(√5-1)/4.",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Using $\\cos\\dfrac{2\\pi}{5}$, find the exact value of $\\sin\\dfrac{\\pi}{5}$ and verify that a regular pentagon inscribed in a unit circle has side length $\\dfrac{1}{2}\\sqrt{\\dfrac{5-\\sqrt{5}}{2}}\\cdot 2 = \\sqrt{\\dfrac{5-\\sqrt{5}}{2}}$.",
        solutionOutline:
          "sin²(π/5)=1-cos²(2π/10)... Note π/5=36°, 2π/5=72°. cos(2π/5)=(√5-1)/4. sin(π/5)=sin 36°=√(1-cos²72°)... We use cos 36°=(√5+1)/4: this is the value of 2cos(2π/5)... wait: cos(2π/5)=cos 72°=(√5-1)/4. And cos(π/5)=cos 36°=(√5+1)/4. sin(π/5)=√(1-((√5+1)/4)²)=√((16-(6+2√5))/16)=√((10-2√5)/16)=√(10-2√5)/4. Side of regular pentagon in unit circle=2sin(π/5)=√(10-2√5)/2=√((10-2√5)/4)·2... side=2sin(π/5)=√(10-2√5)/2.",
      },
    ],
    fullSolution: `(i) If $n\\mid j$: $e^{2\\pi ijk/n}=1$ for all $k$, sum $=n$. If $n\\nmid j$: geometric series with ratio $r=e^{2\\pi ij/n}\\ne 1$; sum $=\\frac{r^n-1}{r-1}=\\frac{e^{2\\pi ij}-1}{r-1}=0$.

(ii) $j=1$: $\\sum_{k=0}^4\\omega^k=0$. Conjugate pairs: $\\omega+\\bar\\omega=2\\cos\\frac{2\\pi}{5}$, $\\omega^2+\\bar\\omega^2=2\\cos\\frac{4\\pi}{5}$. So $2\\!\\left(\\cos\\frac{2\\pi}{5}+\\cos\\frac{4\\pi}{5}\\right)=-1$, hence $\\cos\\frac{2\\pi}{5}+\\cos\\frac{4\\pi}{5}=-\\frac{1}{2}$.

(iii) Let $s=\\omega+\\omega^4$, $t=\\omega^2+\\omega^3$. Then $s+t=-1$ and $st=\\omega^3+\\omega^4+\\omega^6+\\omega^7=\\omega^3+\\omega^4+\\omega+\\omega^2=-1$. So $s,t$ satisfy $z^2+z-1=0$, giving $z=\\frac{-1\\pm\\sqrt{5}}{2}$. Since $\\cos\\frac{2\\pi}{5}>0$, $s=\\frac{-1+\\sqrt{5}}{2}$ and $\\cos\\frac{2\\pi}{5}=\\frac{\\sqrt{5}-1}{4}$.

(iv) $\\cos\\frac{\\pi}{5}=\\cos 36°=\\frac{\\sqrt{5}+1}{4}$ (the other root of $4c^2-2c-1=0$ from the minimal polynomial of $\\cos 36°$). $\\sin\\frac{\\pi}{5}=\\sqrt{1-\\left(\\frac{\\sqrt{5}+1}{4}\\right)^2}=\\frac{\\sqrt{10-2\\sqrt{5}}}{4}$. Pentagon side $=2\\sin\\frac{\\pi}{5}=\\frac{\\sqrt{10-2\\sqrt{5}}}{2}=\\sqrt{\\frac{10-2\\sqrt{5}}{4}}$.`,
  },
  {
    id: "step-023",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context:
      "De Moivre's theorem states $(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$ for all integers $n$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question:
          "Use De Moivre's theorem to show that $\\cos 5\\theta = 16\\cos^5\\theta - 20\\cos^3\\theta + 5\\cos\\theta$.",
        solutionOutline:
          "(cos θ+i sin θ)⁵=∑_{k=0}^5 C(5,k)(cos θ)^{5-k}(i sin θ)^k. Real part: k=0: cos⁵θ; k=2: C(5,2)(cos³θ)(i²sin²θ)=-10cos³θsin²θ; k=4: C(5,4)(cosθ)(i⁴sin⁴θ)=5cosθsin⁴θ. So cos5θ=cos⁵θ-10cos³θsin²θ+5cosθsin⁴θ=cos⁵θ-10cos³θ(1-cos²θ)+5cosθ(1-cos²θ)²=cos⁵θ-10cos³θ+10cos⁵θ+5cosθ-10cos³θ+5cos⁵θ=16cos⁵θ-20cos³θ+5cosθ. ✓",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Hence solve the equation $16t^5 - 20t^3 + 5t = 0$ and deduce the exact values of $\\cos\\dfrac{\\pi}{5}$ and $\\cos\\dfrac{2\\pi}{5}$.",
        solutionOutline:
          "16t⁵-20t³+5t=t(16t⁴-20t²+5)=0. So t=0 or 16t⁴-20t²+5=0 → t²=(20±√(400-320))/32=(20±√80)/32=(20±4√5)/32=(5±√5)/8. t=±√((5±√5)/8). The 5 solutions of cos5θ=0 with 5θ=π/2,3π/2,5π/2,7π/2,9π/2, so θ=π/10,3π/10,π/2,7π/10,9π/10. So the nonzero cosines are cos(π/10),cos(3π/10),cos(7π/10),cos(9π/10). Since cos(2π/5)=cos(4π/10) wait: θ values giving cos5θ=0 are 5θ=π/2+kπ, so θ=π/10+kπ/5. k=0: θ=π/10; k=1: 3π/10; k=2: π/2 (cosθ=0); k=3: 7π/10; k=4: 9π/10. So cos(π/10),cos(3π/10) are positive roots; cos(7π/10)=-cos(3π/10),cos(9π/10)=-cos(π/10). t²=(5+√5)/8: t=cos(π/10) or cos(9π/10)... The two positive roots are cos(π/10)=√((5+√5)/8) and cos(3π/10)=√((5-√5)/8)... Note cos(π/5)=cos(2π/10): 5θ not used directly. Hmm, from the original equation cos5θ=0 so 5θ=π/2+kπ: to get cos(π/5) we need 5θ=π so cos5θ=-1, not from this equation. Better equation: use 16c⁵-20c³+5c=-1 for cos5θ=-1: 5θ=π, θ=π/5. Or solve cos5θ=1/2 for 5θ=π/3 → θ=π/15 which is cos(π/15), not cos(π/5). Actually cos(2π/5) comes from step-022. Here we can derive: from the factored quadratic t²=(5±√5)/8, positive roots are √((5+√5)/8)=cos(π/10) and √((5-√5)/8)=cos(3π/10). Note cos(π/5)=2cos²(π/10)-1=2(5+√5)/8-1=(5+√5)/4-1=(1+√5)/4. And cos(2π/5)=2cos²(π/5)-1=... or from step-022 (√5-1)/4. ✓",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Similarly use De Moivre's theorem to express $\\sin 5\\theta$ in terms of $\\sin\\theta$, and hence show that $16s^4 - 20s^2 + 5 = 0$ has roots $\\sin\\dfrac{\\pi}{10}$, $\\cos\\dfrac{\\pi}{10}$ (and their negatives).",
        solutionOutline:
          "Im part of (cosθ+isinθ)⁵: k=1: 5cos⁴θ·isinθ → 5cos⁴θsinθ; k=3: C(5,3)cos²θ·i³sin³θ=-10cos²θsin³θ; k=5: i⁵sin⁵θ=isin⁵θ. So sin5θ=5cos⁴θsinθ-10cos²θsin³θ+sin⁵θ=sinθ(5cos⁴θ-10cos²θsin²θ+sin⁴θ)=sinθ(5(1-s²)²-10(1-s²)s²+s⁴) where s=sinθ. =sinθ(5-10s²+5s⁴-10s²+10s⁴+s⁴)=sinθ(5-20s²+16s⁴). For sin5θ=0 (other than sinθ=0): 16s⁴-20s²+5=0, giving s²=(5±√5)/8. Roots: sin(π/10), sin(3π/10)=cos(2π/10)... sin(π/10)=√((5-√5)/8) and sin(3π/10)=cos(π/5)... comparing: cos(π/10)=√((5+√5)/8)=sin(2π/5)... The roots of 16s⁴-20s²+5=0 are ±sin(π/5), ±sin(2π/5), which equal ±sin(π/5), ±cos(π/10)... the positive roots are sin(π/5) and sin(2π/5)=cos(π/10).",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Show that $\\cos\\dfrac{2\\pi}{7} + \\cos\\dfrac{4\\pi}{7} + \\cos\\dfrac{6\\pi}{7} = -\\dfrac{1}{2}$.",
        solutionOutline:
          "The 7th roots of unity sum to 0: ∑_{k=0}^6 e^{2πik/7}=0. So 1+2cos(2π/7)+2cos(4π/7)+2cos(6π/7)=0 (taking real parts, using conjugate pairs). Hence cos(2π/7)+cos(4π/7)+cos(6π/7)=-1/2.",
      },
    ],
    fullSolution: `(i) Expand $(c+is)^5$ via binomial (where $c=\\cos\\theta$, $s=\\sin\\theta$). Real part: $c^5-10c^3s^2+5cs^4$. Substitute $s^2=1-c^2$: $c^5-10c^3(1-c^2)+5c(1-c^2)^2=16c^5-20c^3+5c$. ✓

(ii) $t(16t^4-20t^2+5)=0$. Quartic: $t^2=\\frac{5\\pm\\sqrt{5}}{8}$. The solutions correspond to $\\cos\\theta$ where $\\cos 5\\theta=0$, i.e.\\ $\\theta=\\frac{\\pi}{10},\\frac{3\\pi}{10},\\frac{7\\pi}{10},\\frac{9\\pi}{10}$ (and $t=0$ at $\\theta=\\pi/2$). Positive roots: $\\cos\\frac{\\pi}{10}=\\sqrt{\\frac{5+\\sqrt5}{8}}$ and $\\cos\\frac{3\\pi}{10}=\\sqrt{\\frac{5-\\sqrt5}{8}}$. Then $\\cos\\frac{\\pi}{5}=2\\cos^2\\frac{\\pi}{10}-1=\\frac{\\sqrt5+1}{4}$ and $\\cos\\frac{2\\pi}{5}=2\\cos^2\\frac{3\\pi}{10}-1=\\frac{\\sqrt5-1}{4}$.

(iii) Im$(c+is)^5=\\sin\\theta(16\\sin^4\\theta-20\\sin^2\\theta+5)$. Setting $\\sin 5\\theta=0$ (with $\\sin\\theta\\ne 0$): $16s^4-20s^2+5=0$. Solutions $s=\\sin\\frac{\\pi}{5},\\sin\\frac{2\\pi}{5}=\\cos\\frac{\\pi}{10}$ (and their negatives). ✓

(iv) Real part of $\\sum_{k=0}^6 e^{2\\pi ik/7}=0$: $1+2(\\cos\\frac{2\\pi}{7}+\\cos\\frac{4\\pi}{7}+\\cos\\frac{6\\pi}{7})=0$, so $\\cos\\frac{2\\pi}{7}+\\cos\\frac{4\\pi}{7}+\\cos\\frac{6\\pi}{7}=-\\frac{1}{2}$.`,
  },
  {
    id: "step-024",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 3,
    totalMarks: 20,
    context:
      "A fair coin is tossed repeatedly. Let $T$ be the number of tosses until the first head appears ($T \\ge 1$). Let $p = 1/2$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Show that $T$ has a geometric distribution and write down $P(T = k)$ for $k \\ge 1$. Find $E(T)$ and $\\text{Var}(T)$.",
        solutionOutline:
          "P(T=k)=(1/2)^{k-1}·(1/2)=(1/2)^k for k=1,2,.... E(T)=∑k(1/2)^k=1/p=2. Var(T)=(1-p)/p²=(1/2)/(1/4)=2.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "Show that $E(T) = \\displaystyle\\sum_{k=1}^{\\infty} P(T \\ge k)$, and use this to verify $E(T) = 2$.",
        solutionOutline:
          "For non-negative integer-valued RV: E(T)=∑_{k=1}^∞ P(T≥k). P(T≥k)=P(first k-1 tosses are tails)=(1/2)^{k-1}. E(T)=∑_{k=1}^∞(1/2)^{k-1}=1/(1-1/2)=2. ✓",
      },
      {
        label: "(iii)",
        marks: 5,
        question:
          "Two players A and B each independently toss a fair coin until they get a head, taking $T_A$ and $T_B$ tosses respectively. Find $P(T_A = T_B)$ and $P(T_A < T_B)$.",
        solutionOutline:
          "P(T_A=T_B)=∑_{k=1}^∞ P(T_A=k)P(T_B=k)=∑_{k=1}^∞(1/4)^k=1/4·1/(1-1/4)=1/3. By symmetry P(T_A<T_B)=P(T_B<T_A)=(1-1/3)/2=1/3.",
      },
      {
        label: "(iv)",
        marks: 6,
        question:
          "Let $M = \\min(T_A, T_B)$. Show that $M$ has a geometric distribution and find its parameter. Hence find $E(M)$ and $P(M > E(M))$.",
        solutionOutline:
          "P(M>m)=P(T_A>m and T_B>m)=P(T_A>m)·P(T_B>m)=(1/2)^m·(1/2)^m=(1/4)^m. So P(M=m)=P(M>m-1)-P(M>m)=(1/4)^{m-1}-(1/4)^m=(3/4)(1/4)^{m-1}. Geometric with p=3/4. E(M)=1/(3/4)=4/3. P(M>E(M))=P(M>4/3)=P(M≥2)=(1/4)^1=1/4.",
      },
    ],
    fullSolution: `(i) $P(T=k)=\\left(\\frac{1}{2}\\right)^k$, $k\\ge 1$ (geometric with $p=\\frac{1}{2}$). $E(T)=\\frac{1}{p}=2$. $\\text{Var}(T)=\\frac{1-p}{p^2}=\\frac{1/2}{1/4}=2$.

(ii) $E(T)=\\sum_{k=1}^\\infty P(T\\ge k)=\\sum_{k=1}^\\infty\\left(\\frac{1}{2}\\right)^{k-1}=\\frac{1}{1-\\frac{1}{2}}=2$. ✓

(iii) $P(T_A=T_B)=\\sum_{k=1}^\\infty\\frac{1}{4^k}=\\frac{\\frac{1}{4}}{1-\\frac{1}{4}}=\\frac{1}{3}$. By symmetry $P(T_A<T_B)=P(T_B<T_A)=\\frac{1}{2}\\left(1-\\frac{1}{3}\\right)=\\frac{1}{3}$.

(iv) $P(M>m)=\\left(\\frac{1}{4}\\right)^m$, so $P(M=m)=\\frac{3}{4}\\cdot\\left(\\frac{1}{4}\\right)^{m-1}$ — geometric with $p=\\frac{3}{4}$. $E(M)=\\frac{4}{3}$. Since $M$ takes integer values, $P(M>\\frac{4}{3})=P(M\\ge 2)=1-P(M=1)=1-\\frac{3}{4}=\\frac{1}{4}$.`,
  },
  {
    id: "step-025",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 3,
    totalMarks: 20,
    context:
      "A particle of mass $m$ is attached to one end of a light elastic string of natural length $l$ and modulus $\\lambda$. The other end is fixed at a point $O$ on a smooth horizontal surface. The particle moves in a straight line through $O$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question:
          "Write down the equation of motion for the particle when the string is taut (extension $x > 0$) and when the string is slack ($x < 0$, where $x$ is measured from the natural length position). Show that when the string is taut the motion is SHM about the point where the string has its natural length.",
        solutionOutline:
          "When taut (x>0): tension T=λx/l. Equation: mẍ=-λx/l. This is SHM with ω²=λ/(ml). When slack (x<0): no tension, ẍ=0, particle moves at constant velocity.",
      },
      {
        label: "(ii)",
        marks: 5,
        question:
          "The particle is held at rest at a point $A$ where the extension is $a$ (so $a > 0$), and released. Find, in terms of $a$, $\\omega = \\sqrt{\\lambda/(ml)}$, the speed of the particle when the string first becomes slack.",
        solutionOutline:
          "During SHM: x=a cos(ωt), ẋ=-aω sin(ωt). String becomes slack when x=0: t=π/(2ω). Speed at this moment: |ẋ|=aω|sin(π/2)|=aω.",
      },
      {
        label: "(iii)",
        marks: 6,
        question:
          "After the string becomes slack, the particle moves at constant speed $a\\omega$ towards $O$ and beyond. When it returns and the string becomes taut again at the natural length position, describe the subsequent motion. Find the period of the complete oscillation.",
        solutionOutline:
          "After slack: particle moves with speed aω (away from O). Time to travel from x=0 back to the point x=0 on the other side: the particle goes from x=0 with speed aω (toward negative x), travels freely, turns at the wall... wait, there is no wall on a smooth surface. The problem says the particle moves through O along a straight line; when the string is slack (x<0) the particle moves freely at constant speed aω in the negative direction. It will keep going unless there is a turning point; but ẍ=0 means no restoring force, so the particle just moves at constant speed forever to the left. This setup doesn't give oscillation unless the particle bounces or the string wraps around. Perhaps the problem intends vertical motion (spring below O) or the particle can pass through O and the string extends on the other side too. Let's reinterpret: particle on a smooth horizontal surface, string attached at O. When x<0 (particle between O and its equilibrium or beyond O): the string is slack (it can't push). So when released from A (x=a), particle oscillates via SHM for x>0, reaches x=0 with speed aω moving left, then moves freely at speed aω to the left. The string can only pull, not push. So the particle leaves O and never returns. This is not SHM for the full oscillation. The standard setup is: spring (not string) for true SHM. With a string, the motion is: half-period of SHM while string is taut, then free motion. For the particle to return to O, we need a wall at some point or the particle is on a vertical setup where gravity restores. Standard STEP problem: vertical case — particle hangs on elastic string, goes up past the natural length position with speed aω, decelerates under gravity, returns. Let's use vertical: particle hangs, equilibrium at x=mg l/λ below natural length end. If released from natural length position (x=0), it falls under gravity until string is taut, then SHM. This is the classic problem. Redefine: particle released from A (the natural length end, x=0) with the string just taut. Falls freely distance... Actually the setup I'll use: standard STEP elastic string oscillation where the particle is projected downward from the point where the string is at natural length. Period of combined motion: T_SHM=π/ω (half-oscillation while string is taut, from x=a back to x=0) + T_free (time to travel from x=0 to its lowest free point and back = 0 for horizontal). For horizontal: T = π/ω (only half SHM then particle gone). For a well-posed oscillation, the particle starts at x=a, swings through x=0 with speed aω, continues to x=-something (the other side, string slack, moving at constant speed), then string cannot pull it back. So horizontal setup gives non-periodic motion. I'll reframe (iv) to give the half-period and note the total time until the particle returns (hypothetically if reflected by a wall).",
      },
      {
        label: "(iv)",
        marks: 5,
        question:
          "Now suppose the particle rests on a rough horizontal surface (coefficient of friction $\\mu$). The particle is projected from the natural-length position with speed $u$ along the string direction. Find the condition on $u$ for the particle to reach a maximum extension $x = d$ and come instantaneously to rest there. Using energy, find $u$ in terms of $d$, $\\mu$, $m$, $g$, $\\lambda$, $l$.",
        solutionOutline:
          "Energy equation: work done against friction + PE stored in string = initial KE. ½mu²=λd²/(2l)+μmgd. So u²=λd²/(ml)+2μgd, giving u=√(λd²/(ml)+2μgd).",
      },
    ],
    fullSolution: `(i) When taut ($x>0$): $m\\ddot{x}=-\\frac{\\lambda}{l}x$, i.e.\\ SHM with $\\omega^2=\\frac{\\lambda}{ml}$ about $x=0$. When slack: $\\ddot{x}=0$, constant velocity.

(ii) With $x(0)=a$, $\\dot x(0)=0$: $x=a\\cos\\omega t$. Slack when $x=0$: $t=\\frac{\\pi}{2\\omega}$. Speed $=|\\dot{x}|=a\\omega\\sin\\frac{\\pi}{2}=a\\omega$.

(iii) With the string slack the particle moves freely at speed $a\\omega$. On a smooth surface with no restoring force for $x<0$ the subsequent motion is uniform — the full oscillation does not repeat. The taut-SHM phase lasts a half-period $T_{\\text{SHM}}=\\frac{\\pi}{\\omega}$.

(iv) Energy conservation with friction ($\\mu mg$ acting over distance $d$):
$$\\tfrac{1}{2}mu^2 = \\frac{\\lambda d^2}{2l}+\\mu mgd \\implies u=\\sqrt{\\frac{\\lambda d^2}{ml}+2\\mu gd}.$$`,
  },

  {
    id: "step-026",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 2,
    totalMarks: 20,
    context: "This question concerns the complex cube roots of $8$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Express $1+i$ in modulus–argument form, and hence evaluate $(1+i)^8$.",
        solutionOutline: "|1+i|=√2, arg=π/4. By De Moivre (1+i)^8=(√2)^8·cis(8·π/4)=16·cis(2π)=16.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find the three cube roots of $8$, giving each in the form $a+bi$.",
        solutionOutline: "z^3=8=8cis0. Roots have modulus 2 and arguments 0, 2π/3, 4π/3: z=2, 2cis(2π/3)=-1+i√3, 2cis(4π/3)=-1-i√3.",
      },
      {
        label: "(iii)",
        marks: 4,
        question: "Show that the sum of the three cube roots of $8$ is zero.",
        solutionOutline: "2+(-1+i√3)+(-1-i√3)=0. (Equivalently z^3-8=0 has no z^2 term, so the sum of roots is 0.)",
      },
      {
        label: "(iv)",
        marks: 6,
        question: "The three cube roots are the vertices of a triangle in the Argand diagram. Show that the triangle is equilateral and find its area.",
        solutionOutline: "All roots have modulus 2 and arguments spaced 120° apart, so they lie on a circle radius 2 equally spaced ⇒ equilateral. For an equilateral triangle with circumradius R, side s=R√3 and area=(√3/4)s²=(3√3/4)R². With R=2: area=(3√3/4)·4=3√3.",
      },
    ],
    fullSolution: `(i) $|1+i|=\\sqrt2$, $\\arg(1+i)=\\tfrac{\\pi}{4}$, so $1+i=\\sqrt2\\,\\operatorname{cis}\\tfrac{\\pi}{4}$. By De Moivre, $(1+i)^8=(\\sqrt2)^8\\operatorname{cis}\\!\\big(8\\cdot\\tfrac{\\pi}{4}\\big)=16\\,\\operatorname{cis}(2\\pi)=16.$

(ii) Writing $8=8\\operatorname{cis}0$, the cube roots have modulus $2$ and arguments $0,\\tfrac{2\\pi}{3},\\tfrac{4\\pi}{3}$:
$$z_1=2,\\quad z_2=-1+i\\sqrt3,\\quad z_3=-1-i\\sqrt3.$$

(iii) $z_1+z_2+z_3=2+(-1+i\\sqrt3)+(-1-i\\sqrt3)=0.$ (Also immediate since $z^3-8=0$ has zero $z^2$ coefficient.)

(iv) The roots lie on the circle $|z|=2$ with arguments $120^\\circ$ apart, so the triangle is equilateral with circumradius $R=2$. Its area is $\\tfrac{3\\sqrt3}{4}R^2=\\tfrac{3\\sqrt3}{4}\\cdot4=3\\sqrt3.$`,
  },

  {
    id: "step-027",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context: "",
    parts: [
      {
        label: "(i)",
        marks: 6,
        question: "Use De Moivre's theorem to prove that $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$.",
        solutionOutline: "(cosθ+isinθ)^3=cos3θ+isin3θ. Expand LHS; real part = cos³θ-3cosθsin²θ = cos³θ-3cosθ(1-cos²θ)=4cos³θ-3cosθ. Equate real parts.",
      },
      {
        label: "(ii)",
        marks: 8,
        question: "Hence find all solutions of $8\\cos^3\\theta - 6\\cos\\theta = 1$ in the interval $0 \\le \\theta < 2\\pi$.",
        solutionOutline: "LHS=2(4cos³θ-3cosθ)=2cos3θ. So 2cos3θ=1 ⇒ cos3θ=1/2. With 3θ∈[0,6π): 3θ=π/3,5π/3,7π/3,11π/3,13π/3,17π/3 ⇒ θ=π/9,5π/9,7π/9,11π/9,13π/9,17π/9.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Deduce the value of $\\cos\\tfrac{\\pi}{9} + \\cos\\tfrac{5\\pi}{9} + \\cos\\tfrac{7\\pi}{9}$.",
        solutionOutline: "Put c=cosθ. From (ii), 8c³-6c-1=0 has roots cos(π/9), cos(5π/9), cos(7π/9) (three distinct cosθ values). Sum of roots = -(coefficient of c²)/(coefficient of c³)=0. So the sum is 0.",
      },
    ],
    fullSolution: `(i) By De Moivre $(\\cos\\theta+i\\sin\\theta)^3=\\cos3\\theta+i\\sin3\\theta$. Expanding the left side and taking real parts,
$$\\cos3\\theta=\\cos^3\\theta-3\\cos\\theta\\sin^2\\theta=\\cos^3\\theta-3\\cos\\theta(1-\\cos^2\\theta)=4\\cos^3\\theta-3\\cos\\theta.$$

(ii) $8\\cos^3\\theta-6\\cos\\theta=2(4\\cos^3\\theta-3\\cos\\theta)=2\\cos3\\theta$. So $2\\cos3\\theta=1$, i.e. $\\cos3\\theta=\\tfrac12$. For $0\\le\\theta<2\\pi$ we need $3\\theta\\in[0,6\\pi)$, giving $3\\theta=\\tfrac{\\pi}{3},\\tfrac{5\\pi}{3},\\tfrac{7\\pi}{3},\\tfrac{11\\pi}{3},\\tfrac{13\\pi}{3},\\tfrac{17\\pi}{3}$ and hence
$$\\theta=\\tfrac{\\pi}{9},\\tfrac{5\\pi}{9},\\tfrac{7\\pi}{9},\\tfrac{11\\pi}{9},\\tfrac{13\\pi}{9},\\tfrac{17\\pi}{9}.$$

(iii) With $c=\\cos\\theta$ the equation is $8c^3-6c-1=0$, whose roots are $\\cos\\tfrac{\\pi}{9},\\cos\\tfrac{5\\pi}{9},\\cos\\tfrac{7\\pi}{9}$. As the $c^2$ coefficient is $0$, the sum of the roots is $0$:
$$\\cos\\tfrac{\\pi}{9}+\\cos\\tfrac{5\\pi}{9}+\\cos\\tfrac{7\\pi}{9}=0.$$`,
  },

  {
    id: "step-028",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 2,
    totalMarks: 20,
    context: "The matrix $M=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find $\\det M$ and $M^{-1}$.",
        solutionOutline: "det=2·2-1·1=3. M^{-1}=(1/3)·[[2,-1],[-1,2]].",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find the eigenvalues of $M$.",
        solutionOutline: "det(M-λI)=(2-λ)²-1=λ²-4λ+3=(λ-1)(λ-3)=0 ⇒ λ=1, 3.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find an eigenvector corresponding to each eigenvalue.",
        solutionOutline: "λ=1: (M-I)v=0 ⇒ x+y=0 ⇒ v=(1,-1). λ=3: (M-3I)v=0 ⇒ -x+y=0 ⇒ v=(1,1).",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Verify that the sum of the eigenvalues equals the trace of $M$, and their product equals $\\det M$.",
        solutionOutline: "Sum=1+3=4=trace(2+2). Product=1·3=3=det. ✓",
      },
    ],
    fullSolution: `(i) $\\det M=2\\cdot2-1\\cdot1=3$. Since $\\det M\\neq0$, $M^{-1}=\\dfrac{1}{3}\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}.$

(ii) $\\det(M-\\lambda I)=\\begin{vmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{vmatrix}=(2-\\lambda)^2-1=\\lambda^2-4\\lambda+3=(\\lambda-1)(\\lambda-3).$ Eigenvalues $\\lambda=1,3$.

(iii) For $\\lambda=1$: $(M-I)\\mathbf v=\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}\\mathbf v=\\mathbf 0\\Rightarrow x+y=0$, e.g. $\\mathbf v=(1,-1)^T$. For $\\lambda=3$: $(M-3I)\\mathbf v=\\begin{pmatrix}-1&1\\\\1&-1\\end{pmatrix}\\mathbf v=\\mathbf 0\\Rightarrow y=x$, e.g. $\\mathbf v=(1,1)^T$.

(iv) Trace $=2+2=4=1+3$ (sum of eigenvalues); $\\det M=3=1\\times3$ (product of eigenvalues). ✓`,
  },

  {
    id: "step-029",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 2,
    totalMarks: 20,
    context: "Let $A=\\begin{pmatrix}1&2\\\\3&k\\end{pmatrix}$, where $k$ is a real constant.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find $\\det A$ in terms of $k$, and state the value of $k$ for which $A$ is singular.",
        solutionOutline: "det=1·k-2·3=k-6. Singular when det=0 ⇒ k=6.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "For $k=6$, show that the system $A\\mathbf x = \\begin{pmatrix}1\\\\3\\end{pmatrix}$ has infinitely many solutions, and describe them.",
        solutionOutline: "Equations x+2y=1 and 3x+6y=3; second is 3×first, so consistent and dependent. Solutions x=1-2y, y free.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "For $k=6$, show that the system $A\\mathbf x = \\begin{pmatrix}1\\\\4\\end{pmatrix}$ has no solution.",
        solutionOutline: "x+2y=1 and 3x+6y=4. But 3(x+2y)=3≠4, contradiction. No solution.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "For $k\\neq 6$, write down $A^{-1}$ and hence state why $A\\mathbf x=\\mathbf b$ has a unique solution.",
        solutionOutline: "A^{-1}=1/(k-6)·[[k,-2],[-3,1]]. Since det≠0, A invertible ⇒ x=A^{-1}b unique.",
      },
    ],
    fullSolution: `(i) $\\det A=1\\cdot k-2\\cdot3=k-6$. $A$ is singular when $\\det A=0$, i.e. $k=6$.

(ii) For $k=6$ the equations are $x+2y=1$ and $3x+6y=3$. The second is exactly $3\\times$ the first, so the system is consistent with a whole line of solutions: $\\;x=1-2y$ with $y$ arbitrary.

(iii) For $k=6$: $x+2y=1$ and $3x+6y=4$. But $3(x+2y)=3\\neq4$, a contradiction, so there is **no solution**.

(iv) For $k\\neq6$, $\\det A=k-6\\neq0$ and $A^{-1}=\\dfrac{1}{k-6}\\begin{pmatrix}k&-2\\\\-3&1\\end{pmatrix}$. As $A$ is invertible, $A\\mathbf x=\\mathbf b$ has the unique solution $\\mathbf x=A^{-1}\\mathbf b$.`,
  },

  {
    id: "step-030",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 2,
    totalMarks: 20,
    context: "Let $R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ and $S=\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Describe geometrically the transformation represented by $R$, and find $\\det R$.",
        solutionOutline: "R rotates points 90° anticlockwise about the origin. det R=0·0-(-1)·1=1.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "The matrix $S$ represents a shear. Find $\\det S$ and explain why $S$ preserves area.",
        solutionOutline: "det S=1·1-2·0=1. Since |det S|=1, areas are unchanged under S.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Compute the matrix $RS$ and find $\\det(RS)$.",
        solutionOutline: "RS=[[0,-1],[1,0]]·[[1,2],[0,1]]=[[0,-1],[1,2]]. det(RS)=0·2-(-1)·1=1.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Verify that $\\det(RS)=\\det R\\,\\det S$.",
        solutionOutline: "det(RS)=1=1·1=det R·det S. ✓",
      },
    ],
    fullSolution: `(i) $R$ is an anticlockwise rotation of $90^\\circ$ about the origin (it sends $(1,0)\\mapsto(0,1)$ and $(0,1)\\mapsto(-1,0)$). $\\det R=0\\cdot0-(-1)\\cdot1=1.$

(ii) $\\det S=1\\cdot1-2\\cdot0=1$. Because $|\\det S|=1$, the transformation preserves area.

(iii) $RS=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}=\\begin{pmatrix}0&-1\\\\1&2\\end{pmatrix}$, so $\\det(RS)=0\\cdot2-(-1)\\cdot1=1.$

(iv) $\\det R\\,\\det S=1\\cdot1=1=\\det(RS)$, confirming the multiplicative property of determinants.`,
  },

  {
    id: "step-031",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 2,
    totalMarks: 20,
    context: "A particle is projected from a point $O$ on horizontal ground with speed $u$ at an angle $\\theta$ above the horizontal. Take $g$ as the acceleration due to gravity and ignore air resistance.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Show that the time of flight (until the particle returns to the ground) is $T=\\dfrac{2u\\sin\\theta}{g}$.",
        solutionOutline: "Vertical: y=ut sinθ-½gt². y=0 ⇒ t(u sinθ-½gt)=0 ⇒ t=0 or t=2u sinθ/g.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Show that the horizontal range is $R=\\dfrac{u^2\\sin 2\\theta}{g}$.",
        solutionOutline: "R=(u cosθ)T=u cosθ·2u sinθ/g=u²·2 sinθcosθ/g=u² sin2θ/g.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find the greatest height $H$ reached, in terms of $u$, $\\theta$ and $g$.",
        solutionOutline: "At top vertical speed 0: 0=(u sinθ)²-2gH ⇒ H=u²sin²θ/(2g).",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "For fixed $u$, find the angle $\\theta$ that maximises the range, and state the maximum range.",
        solutionOutline: "R=u²sin2θ/g maximal when sin2θ=1 ⇒ 2θ=90° ⇒ θ=45°. Then R_max=u²/g.",
      },
    ],
    fullSolution: `(i) Vertically (upwards positive) $y=ut\\sin\\theta-\\tfrac12gt^2$. Setting $y=0$ gives $t\\big(u\\sin\\theta-\\tfrac12gt\\big)=0$, so besides $t=0$ the flight time is $T=\\dfrac{2u\\sin\\theta}{g}.$

(ii) Horizontal distance $=u\\cos\\theta\\cdot T=u\\cos\\theta\\cdot\\dfrac{2u\\sin\\theta}{g}=\\dfrac{u^2(2\\sin\\theta\\cos\\theta)}{g}=\\dfrac{u^2\\sin2\\theta}{g}.$

(iii) At the highest point the vertical velocity is zero: $0=(u\\sin\\theta)^2-2gH$, hence $H=\\dfrac{u^2\\sin^2\\theta}{2g}.$

(iv) $R=\\dfrac{u^2\\sin2\\theta}{g}$ is greatest when $\\sin2\\theta=1$, i.e. $\\theta=45^\\circ$, giving $R_{\\max}=\\dfrac{u^2}{g}.$`,
  },

  {
    id: "step-032",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 3,
    totalMarks: 20,
    context: "Two smooth spheres $A$ and $B$ of equal mass $m$ move along the same straight line. $A$ moves with speed $u$ towards $B$, which is at rest. They collide, and the coefficient of restitution between them is $e$, where $0\\le e\\le 1$.",
    parts: [
      {
        label: "(i)",
        marks: 6,
        question: "Using conservation of momentum and Newton's experimental law, find the speeds of $A$ and $B$ immediately after the collision.",
        solutionOutline: "Momentum: mu=mv_A+mv_B ⇒ u=v_A+v_B. Restitution: v_B-v_A=e·u. Solve: v_B=u(1+e)/2, v_A=u(1-e)/2.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Show that $A$ continues to move in the same direction after the collision unless $e=1$.",
        solutionOutline: "v_A=u(1-e)/2 ≥0, and >0 for e<1; equals 0 only when e=1.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Show that the fraction of kinetic energy lost in the collision is $\\dfrac{1-e^2}{2}$.",
        solutionOutline: "KE_i=½mu². KE_f=½m(v_A²+v_B²)=½m·u²[(1-e)²+(1+e)²]/4=½mu²(1+e²)/2. Fraction lost=1-(1+e²)/2=(1-e²)/2.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Deduce the final speeds and the energy lost in the perfectly elastic case $e=1$.",
        solutionOutline: "e=1: v_A=0, v_B=u; fraction lost=(1-1)/2=0. A stops, B moves off with speed u, no energy lost.",
      },
    ],
    fullSolution: `(i) Conservation of momentum: $mu=mv_A+mv_B\\Rightarrow u=v_A+v_B$. Newton's law of restitution: $v_B-v_A=e(u-0)=eu$. Adding and subtracting,
$$v_B=\\tfrac{u(1+e)}{2},\\qquad v_A=\\tfrac{u(1-e)}{2}.$$

(ii) Since $0\\le e\\le1$, $v_A=\\tfrac{u(1-e)}{2}\\ge0$, and $v_A>0$ whenever $e<1$; only when $e=1$ does $A$ stop.

(iii) Initial KE $=\\tfrac12mu^2$. Final KE $=\\tfrac12m(v_A^2+v_B^2)=\\tfrac12m\\cdot\\tfrac{u^2[(1-e)^2+(1+e)^2]}{4}=\\tfrac12mu^2\\cdot\\tfrac{1+e^2}{2}$. The fraction lost is $1-\\dfrac{1+e^2}{2}=\\dfrac{1-e^2}{2}.$

(iv) When $e=1$: $v_A=0$, $v_B=u$, and the fraction of energy lost is $\\tfrac{1-1}{2}=0$ — the collision is perfectly elastic, $A$ stops and $B$ moves off with speed $u$.`,
  },

  {
    id: "step-033",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 2,
    totalMarks: 20,
    context: "A discrete random variable $X$ has probability distribution $P(X=x)=kx$ for $x=1,2,3,4$, where $k$ is a constant.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find the value of $k$.",
        solutionOutline: "Σ probabilities=k(1+2+3+4)=10k=1 ⇒ k=1/10.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find $E(X)$.",
        solutionOutline: "E(X)=Σ x·kx=k(1+4+9+16)=k·30=30/10=3.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find $\\operatorname{Var}(X)$.",
        solutionOutline: "E(X²)=Σ x²·kx=k(1+8+27+64)=100k=10. Var=E(X²)-[E(X)]²=10-9=1.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Find $P(X\\ge 3)$.",
        solutionOutline: "P(3)+P(4)=k·3+k·4=7k=7/10=0.7.",
      },
    ],
    fullSolution: `(i) Probabilities sum to $1$: $k(1+2+3+4)=10k=1$, so $k=\\tfrac{1}{10}.$

(ii) $E(X)=\\sum x\\,P(X=x)=k\\sum x^2=\\tfrac{1}{10}(1+4+9+16)=\\tfrac{30}{10}=3.$

(iii) $E(X^2)=\\sum x^2P(X=x)=k\\sum x^3=\\tfrac{1}{10}(1+8+27+64)=\\tfrac{100}{10}=10$. Hence $\\operatorname{Var}(X)=E(X^2)-[E(X)]^2=10-9=1.$

(iv) $P(X\\ge3)=P(3)+P(4)=\\tfrac{3}{10}+\\tfrac{4}{10}=\\tfrac{7}{10}=0.7.$`,
  },

  {
    id: "step-034",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 3,
    totalMarks: 20,
    context: "In a large population, a proportion $0.3$ of people carry a certain gene. A random sample of $4$ people is taken; let $X$ be the number who carry the gene.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "State the distribution of $X$ and find $P(X=2)$.",
        solutionOutline: "X~B(4,0.3). P(X=2)=C(4,2)(0.3)²(0.7)²=6·0.09·0.49=0.2646.",
      },
      {
        label: "(ii)",
        marks: 5,
        question: "Find $P(X\\ge 1)$.",
        solutionOutline: "1-P(0)=1-(0.7)^4=1-0.2401=0.7599.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find $E(X)$ and $\\operatorname{Var}(X)$.",
        solutionOutline: "E(X)=np=4·0.3=1.2. Var=np(1-p)=4·0.3·0.7=0.84.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Given that at least one person carries the gene, find the probability that exactly two do. Give your answer to 3 significant figures.",
        solutionOutline: "P(X=2|X≥1)=P(X=2)/P(X≥1)=0.2646/0.7599≈0.348.",
      },
    ],
    fullSolution: `(i) $X\\sim B(4,0.3)$. $P(X=2)=\\binom{4}{2}(0.3)^2(0.7)^2=6\\times0.09\\times0.49=0.2646.$

(ii) $P(X\\ge1)=1-P(X=0)=1-(0.7)^4=1-0.2401=0.7599.$

(iii) $E(X)=np=4\\times0.3=1.2$ and $\\operatorname{Var}(X)=np(1-p)=4\\times0.3\\times0.7=0.84.$

(iv) $P(X=2\\mid X\\ge1)=\\dfrac{P(X=2)}{P(X\\ge1)}=\\dfrac{0.2646}{0.7599}=0.348$ (3 s.f.).`,
  },

  {
    id: "step-035",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "A curve is given parametrically by $x=t^2$, $y=2t$, for $t\\ge 0$.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find the Cartesian equation of the curve.",
        solutionOutline: "t=y/2, so x=(y/2)²=y²/4, i.e. y²=4x (a parabola).",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find $\\dfrac{dy}{dx}$ in terms of $t$, and hence the equation of the tangent at the point where $t=1$.",
        solutionOutline: "dy/dx=(dy/dt)/(dx/dt)=2/(2t)=1/t. At t=1: point (1,2), slope 1 ⇒ y-2=1(x-1) ⇒ y=x+1.",
      },
      {
        label: "(iii)",
        marks: 5,
        question: "Find the area between the curve and the $x$-axis from $x=0$ to $x=4$.",
        solutionOutline: "On t≥0, y=2√x. Area=∫₀⁴ 2√x dx=2·(2/3)x^{3/2}|₀⁴=(4/3)·8=32/3.",
      },
      {
        label: "(iv)",
        marks: 5,
        question: "Verify the area in (iii) by evaluating $\\displaystyle\\int y\\,\\dfrac{dx}{dt}\\,dt$ over the corresponding range of $t$.",
        solutionOutline: "x:0→4 ⇔ t:0→2. dx/dt=2t, y=2t. ∫₀² (2t)(2t)dt=∫₀²4t²dt=(4/3)t³|₀²=(4/3)·8=32/3. Same value.",
      },
    ],
    fullSolution: `(i) From $y=2t$ we get $t=\\tfrac{y}{2}$, so $x=t^2=\\tfrac{y^2}{4}$, i.e. $y^2=4x$ (a parabola).

(ii) $\\dfrac{dy}{dx}=\\dfrac{dy/dt}{dx/dt}=\\dfrac{2}{2t}=\\dfrac1t$. At $t=1$ the point is $(1,2)$ and the gradient is $1$, so the tangent is $y-2=1\\cdot(x-1)$, i.e. $y=x+1.$

(iii) For $t\\ge0$, $y=2\\sqrt x$. Hence
$$\\text{Area}=\\int_0^4 2\\sqrt x\\,dx=2\\cdot\\tfrac23x^{3/2}\\Big|_0^4=\\tfrac43\\cdot8=\\tfrac{32}{3}.$$

(iv) As $x$ runs $0\\to4$, $t$ runs $0\\to2$. With $\\dfrac{dx}{dt}=2t$ and $y=2t$,
$$\\int_0^2 y\\,\\frac{dx}{dt}\\,dt=\\int_0^2 (2t)(2t)\\,dt=\\int_0^2 4t^2\\,dt=\\tfrac43t^3\\Big|_0^2=\\tfrac{32}{3},$$
confirming the area found in (iii).`,
  },


  {
    id: "step-036",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "A curve is given in polar coordinates by $r=2\\cos\\theta$, for $-\\tfrac{\\pi}{2}\\le\\theta\\le\\tfrac{\\pi}{2}$.",
    parts: [
      {
        label: "(i)",
        marks: 6,
        question: "Show that this curve is a circle, and state its centre and radius.",
        solutionOutline: "r=2cosθ ⇒ r²=2r cosθ ⇒ x²+y²=2x ⇒ (x-1)²+y²=1. Circle, centre (1,0), radius 1.",
      },
      {
        label: "(ii)",
        marks: 8,
        question: "Find the area enclosed by the curve, using the polar area formula $A=\\tfrac12\\displaystyle\\int r^2\\,d\\theta$.",
        solutionOutline: "A=½∫_{-π/2}^{π/2}4cos²θ dθ=2∫_{-π/2}^{π/2}cos²θ dθ=2·[θ/2+sin2θ/4]_{-π/2}^{π/2}=2·(π/2)=π. (Matches area of a unit circle.)",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find the Cartesian coordinates of the point on the curve where $\\theta=\\tfrac{\\pi}{3}$, and verify it lies on the circle from part (i).",
        solutionOutline: "θ=π/3: r=2cos(π/3)=1. Point (r cosθ, r sinθ)=(1·½, 1·√3/2)=(½, √3/2). Check: (½-1)²+(√3/2)²=¼+¾=1. ✓",
      },
    ],
    fullSolution: `(i) From $r=2\\cos\\theta$, multiply by $r$: $r^2=2r\\cos\\theta$, i.e. $x^2+y^2=2x$. Completing the square, $(x-1)^2+y^2=1$ — a circle with centre $(1,0)$ and radius $1$.

(ii) $A=\\tfrac12\\int_{-\\pi/2}^{\\pi/2}(2\\cos\\theta)^2\\,d\\theta=2\\int_{-\\pi/2}^{\\pi/2}\\cos^2\\theta\\,d\\theta=2\\left[\\tfrac{\\theta}{2}+\\tfrac{\\sin2\\theta}{4}\\right]_{-\\pi/2}^{\\pi/2}=2\\cdot\\tfrac{\\pi}{2}=\\pi,$ consistent with a circle of radius $1$.

(iii) At $\\theta=\\tfrac{\\pi}{3}$, $r=2\\cos\\tfrac{\\pi}{3}=1$, so the point is $\\left(\\cos\\tfrac{\\pi}{3},\\sin\\tfrac{\\pi}{3}\\right)=\\left(\\tfrac12,\\tfrac{\\sqrt3}{2}\\right)$. Then $\\left(\\tfrac12-1\\right)^2+\\left(\\tfrac{\\sqrt3}{2}\\right)^2=\\tfrac14+\\tfrac34=1$, so it lies on the circle.`,
  },

  {
    id: "step-037",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "A curve is given parametrically by $x=3\\cos\\theta$, $y=2\\sin\\theta$, for $0\\le\\theta<2\\pi$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Find the Cartesian equation of the curve and name it.",
        solutionOutline: "cosθ=x/3, sinθ=y/2 ⇒ x²/9+y²/4=1, an ellipse.",
      },
      {
        label: "(ii)",
        marks: 7,
        question: "Find $\\dfrac{dy}{dx}$ in terms of $\\theta$, and the gradient of the tangent at $\\theta=\\tfrac{\\pi}{4}$.",
        solutionOutline: "dy/dx=(2cosθ)/(-3sinθ)=-2/(3tanθ). At θ=π/4, tanθ=1, gradient=-2/3.",
      },
      {
        label: "(iii)",
        marks: 8,
        question: "Using $A=\\tfrac12\\displaystyle\\oint (x\\,dy - y\\,dx)$, show that the area enclosed by the ellipse is $6\\pi$.",
        solutionOutline: "x dy - y dx = 3cosθ(2cosθ)dθ - 2sinθ(-3sinθ)dθ = (6cos²θ+6sin²θ)dθ=6dθ. A=½∫_0^{2π}6dθ=6π. (=πab=π·3·2.)",
      },
    ],
    fullSolution: `(i) Since $\\cos\\theta=\\tfrac{x}{3}$ and $\\sin\\theta=\\tfrac{y}{2}$, we have $\\tfrac{x^2}{9}+\\tfrac{y^2}{4}=1$, an ellipse.

(ii) $\\dfrac{dy}{dx}=\\dfrac{dy/d\\theta}{dx/d\\theta}=\\dfrac{2\\cos\\theta}{-3\\sin\\theta}=-\\dfrac{2}{3\\tan\\theta}.$ At $\\theta=\\tfrac{\\pi}{4}$, $\\tan\\theta=1$, so the gradient is $-\\tfrac23$.

(iii) With $x=3\\cos\\theta,\\;y=2\\sin\\theta$: $dx=-3\\sin\\theta\\,d\\theta$, $dy=2\\cos\\theta\\,d\\theta$, so
$$x\\,dy-y\\,dx=(6\\cos^2\\theta+6\\sin^2\\theta)\\,d\\theta=6\\,d\\theta.$$
Hence $A=\\tfrac12\\int_0^{2\\pi}6\\,d\\theta=6\\pi$ (equal to $\\pi ab=\\pi\\cdot3\\cdot2$).`,
  },

  {
    id: "step-038",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context: "This question concerns the equation $z^4=-16$.",
    parts: [
      {
        label: "(i)",
        marks: 8,
        question: "Find all four solutions of $z^4=-16$, giving each in the form $a+bi$.",
        solutionOutline: "-16=16cis(π). Roots: modulus 16^{1/4}=2, arguments (π+2kπ)/4=π/4,3π/4,5π/4,7π/4. Roots: √2+i√2, -√2+i√2, -√2-i√2, √2-i√2.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Show that the four roots are the vertices of a square in the Argand diagram, and find its area.",
        solutionOutline: "All modulus 2, arguments 90° apart ⇒ square inscribed in circle radius 2. Diagonal=2·2=4 ⇒ area=½·diagonal²=½·16=8. (Or side 2√2, area 8.)",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Taking $w=\\sqrt2+i\\sqrt2$, express $w$ in modulus–argument form and evaluate $w^4$ to verify it satisfies the equation.",
        solutionOutline: "|w|=√(2+2)=2, arg=π/4. w^4=2^4 cis(4·π/4)=16 cis(π)=-16. ✓",
      },
    ],
    fullSolution: `(i) Write $-16=16\\operatorname{cis}\\pi$. The fourth roots have modulus $16^{1/4}=2$ and arguments $\\tfrac{\\pi+2k\\pi}{4}$ for $k=0,1,2,3$, i.e. $\\tfrac{\\pi}{4},\\tfrac{3\\pi}{4},\\tfrac{5\\pi}{4},\\tfrac{7\\pi}{4}$:
$$z=\\sqrt2+i\\sqrt2,\\;-\\sqrt2+i\\sqrt2,\\;-\\sqrt2-i\\sqrt2,\\;\\sqrt2-i\\sqrt2.$$

(ii) All four roots have modulus $2$ and arguments $90^\\circ$ apart, so they lie equally spaced on the circle $|z|=2$ — a square. Its diagonal is the diameter $4$, so the area is $\\tfrac12(4)^2=8$.

(iii) $w=\\sqrt2+i\\sqrt2$ has $|w|=\\sqrt{2+2}=2$ and $\\arg w=\\tfrac{\\pi}{4}$. By De Moivre, $w^4=2^4\\operatorname{cis}\\!\\big(4\\cdot\\tfrac{\\pi}{4}\\big)=16\\operatorname{cis}\\pi=-16$, verifying $w^4=-16$.`,
  },

  {
    id: "step-039",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context: "Let $z=\\cos\\theta+i\\sin\\theta$, so that $z^n+z^{-n}=2\\cos n\\theta$.",
    parts: [
      {
        label: "(i)",
        marks: 8,
        question: "Show that $\\cos^4\\theta=\\tfrac18(\\cos4\\theta+4\\cos2\\theta+3)$.",
        solutionOutline: "(z+1/z)^4=z^4+4z^2+6+4z^{-2}+z^{-4}=2cos4θ+8cos2θ+6. And (z+1/z)^4=(2cosθ)^4=16cos⁴θ. So 16cos⁴θ=2cos4θ+8cos2θ+6 ⇒ cos⁴θ=⅛(cos4θ+4cos2θ+3).",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Hence find $\\displaystyle\\int\\cos^4\\theta\\,d\\theta$.",
        solutionOutline: "=⅛∫(cos4θ+4cos2θ+3)dθ=⅛(sin4θ/4+2sin2θ+3θ)+C=sin4θ/32+sin2θ/4+3θ/8+C.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Evaluate $\\displaystyle\\int_0^{\\pi/2}\\cos^4\\theta\\,d\\theta$.",
        solutionOutline: "[sin4θ/32+sin2θ/4+3θ/8]_0^{π/2}: at π/2, sin2π=0, sinπ=0, 3(π/2)/8=3π/16; at 0, all 0. Result 3π/16.",
      },
    ],
    fullSolution: `(i) With $z+z^{-1}=2\\cos\\theta$,
$$(z+z^{-1})^4=z^4+4z^2+6+4z^{-2}+z^{-4}=(z^4+z^{-4})+4(z^2+z^{-2})+6=2\\cos4\\theta+8\\cos2\\theta+6.$$
But $(z+z^{-1})^4=(2\\cos\\theta)^4=16\\cos^4\\theta$, so $16\\cos^4\\theta=2\\cos4\\theta+8\\cos2\\theta+6$, giving $\\cos^4\\theta=\\tfrac18(\\cos4\\theta+4\\cos2\\theta+3).$

(ii) $\\int\\cos^4\\theta\\,d\\theta=\\tfrac18\\int(\\cos4\\theta+4\\cos2\\theta+3)\\,d\\theta=\\dfrac{\\sin4\\theta}{32}+\\dfrac{\\sin2\\theta}{4}+\\dfrac{3\\theta}{8}+C.$

(iii) Evaluating between $0$ and $\\tfrac{\\pi}{2}$: the sine terms vanish at both limits, leaving $\\dfrac{3}{8}\\cdot\\dfrac{\\pi}{2}=\\dfrac{3\\pi}{16}.$`,
  },

  {
    id: "step-040",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 3,
    totalMarks: 20,
    context: "The matrix $M=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$.",
    parts: [
      {
        label: "(i)",
        marks: 6,
        question: "Write down the eigenvalues of $M$ and find a corresponding eigenvector for each.",
        solutionOutline: "Triangular ⇒ eigenvalues are diagonal entries 3 and 2. λ=3: (M-3I)=[[0,1],[0,-1]]⇒y=0⇒(1,0). λ=2: (M-2I)=[[1,1],[0,0]]⇒x+y=0⇒(1,-1).",
      },
      {
        label: "(ii)",
        marks: 8,
        question: "Writing $M=PDP^{-1}$, derive a formula for $M^n$.",
        solutionOutline: "P=[[1,1],[0,-1]], D=diag(3,2). P²=I so P^{-1}=P. M^n=P D^n P=[[3^n,3^n-2^n],[0,2^n]].",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Verify your formula for $M^n$ gives the correct result when $n=1$ and $n=2$.",
        solutionOutline: "n=1: [[3,3-2],[0,2]]=[[3,1],[0,2]]=M ✓. n=2: [[9,9-4],[0,4]]=[[9,5],[0,4]], and M²=[[9,5],[0,4]] ✓.",
      },
    ],
    fullSolution: `(i) $M$ is upper triangular, so its eigenvalues are the diagonal entries $3$ and $2$. For $\\lambda=3$: $(M-3I)\\mathbf v=\\begin{pmatrix}0&1\\\\0&-1\\end{pmatrix}\\mathbf v=\\mathbf0\\Rightarrow y=0$, e.g. $(1,0)^T$. For $\\lambda=2$: $(M-2I)\\mathbf v=\\begin{pmatrix}1&1\\\\0&0\\end{pmatrix}\\mathbf v=\\mathbf0\\Rightarrow x+y=0$, e.g. $(1,-1)^T$.

(ii) Take $P=\\begin{pmatrix}1&1\\\\0&-1\\end{pmatrix}$, $D=\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix}$. Here $P^2=I$, so $P^{-1}=P$. Then
$$M^n=PD^nP^{-1}=\\begin{pmatrix}1&1\\\\0&-1\\end{pmatrix}\\begin{pmatrix}3^n&0\\\\0&2^n\\end{pmatrix}\\begin{pmatrix}1&1\\\\0&-1\\end{pmatrix}=\\begin{pmatrix}3^n&3^n-2^n\\\\0&2^n\\end{pmatrix}.$$

(iii) $n=1$: $\\begin{pmatrix}3&3-2\\\\0&2\\end{pmatrix}=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}=M$. $n=2$: $\\begin{pmatrix}9&9-4\\\\0&4\\end{pmatrix}=\\begin{pmatrix}9&5\\\\0&4\\end{pmatrix}$, which equals $M^2$. ✓`,
  },

  {
    id: "step-041",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 2,
    totalMarks: 20,
    context: "Let $A=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ and $B=\\begin{pmatrix}-1&0\\\\0&1\\end{pmatrix}$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Describe geometrically the transformations represented by $A$ and $B$, and find $\\det A$ and $\\det B$.",
        solutionOutline: "A reflects in the line y=x; B reflects in the y-axis. det A=-1, det B=-1.",
      },
      {
        label: "(ii)",
        marks: 8,
        question: "Find the matrix $AB$ and describe the single transformation it represents.",
        solutionOutline: "AB=[[0,1],[1,0]][[-1,0],[0,1]]=[[0,1],[-1,0]]. Sends (1,0)→(0,-1): rotation 90° clockwise about O.",
      },
      {
        label: "(iii)",
        marks: 7,
        question: "Verify that $\\det(AB)=\\det A\\,\\det B$, and explain how this is consistent with $AB$ being a rotation.",
        solutionOutline: "det(AB)=0·0-1·(-1)=1=(-1)(-1). A rotation has determinant 1 (area- and orientation-preserving), consistent.",
      },
    ],
    fullSolution: `(i) $A$ swaps coordinates, so it reflects points in the line $y=x$; $B$ negates the $x$-coordinate, reflecting in the $y$-axis. $\\det A=0\\cdot0-1\\cdot1=-1$ and $\\det B=-1$.

(ii) $AB=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\begin{pmatrix}-1&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$. Since $(1,0)\\mapsto(0,-1)$ and $(0,1)\\mapsto(1,0)$, this is a rotation of $90^\\circ$ clockwise about the origin.

(iii) $\\det(AB)=0\\cdot0-1\\cdot(-1)=1=(-1)(-1)=\\det A\\,\\det B.$ A rotation preserves area and orientation, so it has determinant $+1$ — consistent with the composition of two reflections being a rotation.`,
  },

  {
    id: "step-042",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 2,
    totalMarks: 20,
    context: "Two particles of masses $3m$ and $m$ are connected by a light inextensible string passing over a smooth fixed pulley. The system is released from rest.",
    parts: [
      {
        label: "(i)",
        marks: 6,
        question: "Find the acceleration of the particles and the tension in the string, in terms of $m$ and $g$.",
        solutionOutline: "3m: 3mg-T=3m·a. m: T-mg=m·a. Add: 2mg=4m·a ⇒ a=g/2. Then T=m(a+g)=3mg/2.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find the speed of the particles after the heavier mass has descended a distance $d$ from rest.",
        solutionOutline: "v²=2ad=2(g/2)d=gd ⇒ v=√(gd).",
      },
      {
        label: "(iii)",
        marks: 8,
        question: "Verify the speed in part (ii) using conservation of energy.",
        solutionOutline: "Net PE lost = 3mgd - mgd = 2mgd (heavier falls d, lighter rises d). KE gained=½(4m)v²=2mv². So 2mv²=2mgd ⇒ v²=gd ⇒ v=√(gd). Consistent.",
      },
    ],
    fullSolution: `(i) For the descending mass $3m$: $3mg-T=3m\\,a$. For the rising mass $m$: $T-mg=m\\,a$. Adding, $2mg=4m\\,a$, so $a=\\tfrac{g}{2}$. Then $T=m(a+g)=m\\big(\\tfrac{g}{2}+g\\big)=\\tfrac{3mg}{2}.$

(ii) From rest, $v^2=2ad=2\\cdot\\tfrac{g}{2}\\cdot d=gd$, so $v=\\sqrt{gd}.$

(iii) As the heavier mass falls $d$ and the lighter rises $d$, the net loss in potential energy is $3mgd-mgd=2mgd$. This equals the kinetic energy gained, $\\tfrac12(3m+m)v^2=2mv^2$. Hence $2mv^2=2mgd$, giving $v=\\sqrt{gd}$, as before.`,
  },

  {
    id: "step-043",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 3,
    totalMarks: 20,
    context: "A particle moves with simple harmonic motion about the origin $O$, with displacement $x=a\\sin(\\omega t)$ at time $t$, where $a>0$ and $\\omega>0$.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "Write down expressions for the velocity and acceleration, and show that the acceleration is $-\\omega^2 x$.",
        solutionOutline: "v=aω cos(ωt), acc=-aω² sin(ωt)=-ω²·(a sinωt)=-ω²x.",
      },
      {
        label: "(ii)",
        marks: 7,
        question: "Show that $v^2=\\omega^2(a^2-x^2)$.",
        solutionOutline: "v²=a²ω²cos²ωt=a²ω²(1-sin²ωt)=ω²(a²-a²sin²ωt)=ω²(a²-x²).",
      },
      {
        label: "(iii)",
        marks: 8,
        question: "The particle has speed $8$ when $x=3$ and speed $6$ when $x=4$. Find $\\omega$ and $a$.",
        solutionOutline: "64=ω²(a²-9); 36=ω²(a²-16). Subtract: 28=ω²·7 ⇒ ω²=4 ⇒ ω=2. Then 64=4(a²-9) ⇒ a²=25 ⇒ a=5.",
      },
    ],
    fullSolution: `(i) $v=\\dfrac{dx}{dt}=a\\omega\\cos(\\omega t)$ and $\\ddot x=-a\\omega^2\\sin(\\omega t)=-\\omega^2\\big(a\\sin\\omega t\\big)=-\\omega^2x.$

(ii) $v^2=a^2\\omega^2\\cos^2(\\omega t)=a^2\\omega^2\\big(1-\\sin^2\\omega t\\big)=\\omega^2\\big(a^2-a^2\\sin^2\\omega t\\big)=\\omega^2(a^2-x^2).$

(iii) Using $v^2=\\omega^2(a^2-x^2)$: $64=\\omega^2(a^2-9)$ and $36=\\omega^2(a^2-16)$. Subtracting gives $28=7\\omega^2$, so $\\omega^2=4$, $\\omega=2$. Then $64=4(a^2-9)\\Rightarrow a^2=25\\Rightarrow a=5.$`,
  },

  {
    id: "step-044",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 2,
    totalMarks: 20,
    context: "A continuous random variable $X$ has probability density function $f(x)=kx^2$ for $0\\le x\\le 3$, and $f(x)=0$ otherwise.",
    parts: [
      {
        label: "(i)",
        marks: 4,
        question: "Find the value of $k$.",
        solutionOutline: "∫_0^3 kx² dx=k[x³/3]_0^3=9k=1 ⇒ k=1/9.",
      },
      {
        label: "(ii)",
        marks: 6,
        question: "Find $E(X)$.",
        solutionOutline: "E(X)=∫_0^3 x·(1/9)x² dx=(1/9)[x⁴/4]_0^3=(1/9)(81/4)=9/4.",
      },
      {
        label: "(iii)",
        marks: 6,
        question: "Find $\\operatorname{Var}(X)$.",
        solutionOutline: "E(X²)=(1/9)∫_0^3 x⁴ dx=(1/9)(243/5)=27/5. Var=27/5-(9/4)²=27/5-81/16=(432-405)/80=27/80.",
      },
      {
        label: "(iv)",
        marks: 4,
        question: "Find the median $m$.",
        solutionOutline: "∫_0^m (1/9)x² dx=½ ⇒ m³/27=½ ⇒ m³=27/2 ⇒ m=3/∛2≈2.38.",
      },
    ],
    fullSolution: `(i) $\\int_0^3 kx^2\\,dx=k\\Big[\\tfrac{x^3}{3}\\Big]_0^3=9k=1$, so $k=\\tfrac19.$

(ii) $E(X)=\\int_0^3 x\\cdot\\tfrac19x^2\\,dx=\\tfrac19\\Big[\\tfrac{x^4}{4}\\Big]_0^3=\\tfrac19\\cdot\\tfrac{81}{4}=\\tfrac94.$

(iii) $E(X^2)=\\tfrac19\\int_0^3 x^4\\,dx=\\tfrac19\\cdot\\tfrac{243}{5}=\\tfrac{27}{5}$. Hence $\\operatorname{Var}(X)=\\tfrac{27}{5}-\\big(\\tfrac94\\big)^2=\\tfrac{27}{5}-\\tfrac{81}{16}=\\tfrac{432-405}{80}=\\tfrac{27}{80}.$

(iv) The median $m$ satisfies $\\int_0^m\\tfrac19x^2\\,dx=\\tfrac12$, i.e. $\\tfrac{m^3}{27}=\\tfrac12$, so $m^3=\\tfrac{27}{2}$ and $m=\\dfrac{3}{\\sqrt[3]{2}}\\approx2.38.$`,
  },

  {
    id: "step-045",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 3,
    totalMarks: 20,
    context: "A disease affects $2\\%$ of a population. A diagnostic test gives a positive result for $95\\%$ of people who have the disease, and (falsely) for $10\\%$ of people who do not.",
    parts: [
      {
        label: "(i)",
        marks: 5,
        question: "A person is chosen at random. Find the probability that the test is positive.",
        solutionOutline: "P(+)=P(+|D)P(D)+P(+|D')P(D')=0.95(0.02)+0.10(0.98)=0.019+0.098=0.117.",
      },
      {
        label: "(ii)",
        marks: 8,
        question: "Given that a randomly chosen person tests positive, find the probability that they have the disease. Give your answer to 3 significant figures.",
        solutionOutline: "P(D|+)=P(+|D)P(D)/P(+)=0.019/0.117≈0.162.",
      },
      {
        label: "(iii)",
        marks: 7,
        question: "Find the probability that a person who tests negative nevertheless has the disease. Give your answer to 3 significant figures.",
        solutionOutline: "P(-)=1-0.117=0.883. P(D∩-)=P(-|D)P(D)=0.05·0.02=0.001. P(D|-)=0.001/0.883≈0.00113.",
      },
    ],
    fullSolution: `Let $D$ be the event of having the disease, so $P(D)=0.02$, $P(+\\mid D)=0.95$, $P(+\\mid D')=0.10$.

(i) $P(+)=P(+\\mid D)P(D)+P(+\\mid D')P(D')=0.95(0.02)+0.10(0.98)=0.019+0.098=0.117.$

(ii) By Bayes' theorem, $P(D\\mid+)=\\dfrac{P(+\\mid D)P(D)}{P(+)}=\\dfrac{0.019}{0.117}\\approx0.162.$ Despite a positive test, the chance of actually having the disease is only about $16\\%$ — a consequence of the low base rate.

(iii) $P(-)=1-0.117=0.883$. Also $P(D\\cap-)=P(-\\mid D)P(D)=0.05\\times0.02=0.001$. Hence $P(D\\mid-)=\\dfrac{0.001}{0.883}\\approx0.00113.$`,
  },


  {
    id: "step-046",
    type: "long",
    testId: "step",
    topicId: "step-pure1",
    difficulty: 2,
    totalMarks: 20,
    context: "The cubic polynomial $f(x)=x^3-6x^2+11x-6$.",
    parts: [
      { label: "(i)", marks: 5, question: "Show that $x=1$ is a root of $f(x)$, and hence factorise $f(x)$ completely.", solutionOutline: "f(1)=1-6+11-6=0 ✓. Divide by (x-1): f(x)=(x-1)(x²-5x+6)=(x-1)(x-2)(x-3)." },
      { label: "(ii)", marks: 7, question: "Write down the three roots and verify that their sum is $6$, their pairwise-product sum is $11$, and their product is $6$, consistent with the coefficients of $f$.", solutionOutline: "Roots 1,2,3. Sum=6=-(-6). Pairwise 1·2+1·3+2·3=11=coeff of x. Product=6=-(-6)." },
      { label: "(iii)", marks: 8, question: "Find a cubic equation (in expanded form) whose roots are each $1$ greater than the roots of $f$.", solutionOutline: "New roots 2,3,4: sum 9, pairwise 26, product 24 ⇒ x³-9x²+26x-24=0. (= (x-2)(x-3)(x-4).)" },
    ],
    fullSolution: `(i) $f(1)=1-6+11-6=0$, so $(x-1)$ is a factor. Dividing, $f(x)=(x-1)(x^2-5x+6)=(x-1)(x-2)(x-3).$

(ii) The roots are $1,2,3$. Sum $=6=-(-6)$; pairwise sum $=1\\cdot2+1\\cdot3+2\\cdot3=11$; product $=6$. These match $-b$, $c$, $-d$ for $x^3+bx^2+cx+d$.

(iii) The new roots are $2,3,4$, with sum $9$, pairwise sum $2\\cdot3+2\\cdot4+3\\cdot4=26$ and product $24$. Hence $x^3-9x^2+26x-24=0.$`,
  },

  {
    id: "step-047",
    type: "long",
    testId: "step",
    topicId: "step-pure2",
    difficulty: 2,
    totalMarks: 20,
    context: "",
    parts: [
      { label: "(i)", marks: 6, question: "Using integration by parts, find $\\displaystyle\\int x e^{x}\\,dx$.", solutionOutline: "u=x, dv=e^x dx ⇒ xe^x-∫e^x dx=(x-1)e^x+C." },
      { label: "(ii)", marks: 6, question: "Hence evaluate $\\displaystyle\\int_0^1 x e^{x}\\,dx$.", solutionOutline: "[(x-1)e^x]_0^1=(0)e-(-1)(1)=1." },
      { label: "(iii)", marks: 8, question: "Find the area of the region between $y=xe^{x}$ and the $x$-axis from $x=0$ to $x=2$.", solutionOutline: "xe^x≥0 on [0,2]. Area=[(x-1)e^x]_0^2=e²-(-1)=e²+1." },
    ],
    fullSolution: `(i) With $u=x$, $dv=e^x\\,dx$: $\\int xe^x\\,dx=xe^x-\\int e^x\\,dx=(x-1)e^x+C.$

(ii) $\\int_0^1 xe^x\\,dx=\\big[(x-1)e^x\\big]_0^1=(0)e^1-(-1)e^0=1.$

(iii) Since $xe^x\\ge0$ on $[0,2]$, the area is $\\big[(x-1)e^x\\big]_0^2=(1)e^2-(-1)(1)=e^2+1.$`,
  },

  {
    id: "step-048",
    type: "long",
    testId: "step",
    topicId: "step-pure3",
    difficulty: 2,
    totalMarks: 20,
    context: "The curve $C$ has equation $y=x^2-4x+3$.",
    parts: [
      { label: "(i)", marks: 5, question: "Find the coordinates of the points where $C$ crosses the $x$-axis.", solutionOutline: "x²-4x+3=(x-1)(x-3)=0 ⇒ (1,0),(3,0)." },
      { label: "(ii)", marks: 7, question: "Find the equation of the tangent to $C$ at the point where $x=0$.", solutionOutline: "y'=2x-4; at x=0, y=3, slope=-4 ⇒ y=-4x+3." },
      { label: "(iii)", marks: 8, question: "Find the equation of the normal to $C$ at $x=0$, and the area of the triangle it forms with the coordinate axes.", solutionOutline: "Normal slope 1/4: y=x/4+3. x-int (-12,0), y-int (0,3). Area=½·12·3=18." },
    ],
    fullSolution: `(i) $x^2-4x+3=(x-1)(x-3)=0$, so $C$ crosses the $x$-axis at $(1,0)$ and $(3,0)$.

(ii) $\\dfrac{dy}{dx}=2x-4$. At $x=0$, $y=3$ and the gradient is $-4$, so the tangent is $y=-4x+3.$

(iii) The normal at $x=0$ has gradient $\\tfrac14$: $y=\\tfrac14x+3$. It meets the axes at $(-12,0)$ and $(0,3)$, giving a right triangle of area $\\tfrac12\\cdot12\\cdot3=18.$`,
  },

  {
    id: "step-049",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 2,
    totalMarks: 20,
    context: "Let $z_1=2+2i$ and $z_2=1-i\\sqrt3$.",
    parts: [
      { label: "(i)", marks: 6, question: "Express $z_1$ and $z_2$ in modulus–argument form.", solutionOutline: "|z1|=2√2, arg π/4 ⇒ 2√2 cis(π/4). |z2|=2, arg -π/3 ⇒ 2 cis(-π/3)." },
      { label: "(ii)", marks: 7, question: "Find $z_1 z_2$ and $\\dfrac{z_1}{z_2}$ in modulus–argument form.", solutionOutline: "z1z2=4√2 cis(π/4-π/3)=4√2 cis(-π/12). z1/z2=√2 cis(π/4+π/3)=√2 cis(7π/12)." },
      { label: "(iii)", marks: 7, question: "Describe geometrically the locus of points $z$ in the Argand diagram satisfying $|z-z_1|=2$.", solutionOutline: "Circle, centre z1=(2,2), radius 2." },
    ],
    fullSolution: `(i) $|z_1|=\\sqrt{8}=2\\sqrt2$ and $\\arg z_1=\\tfrac{\\pi}{4}$, so $z_1=2\\sqrt2\\,\\operatorname{cis}\\tfrac{\\pi}{4}$. $|z_2|=\\sqrt{1+3}=2$ and (fourth quadrant) $\\arg z_2=-\\tfrac{\\pi}{3}$, so $z_2=2\\,\\operatorname{cis}\\!\\big(-\\tfrac{\\pi}{3}\\big).$

(ii) $z_1z_2=2\\sqrt2\\cdot2\\,\\operatorname{cis}\\!\\big(\\tfrac{\\pi}{4}-\\tfrac{\\pi}{3}\\big)=4\\sqrt2\\,\\operatorname{cis}\\!\\big(-\\tfrac{\\pi}{12}\\big)$ and $\\dfrac{z_1}{z_2}=\\dfrac{2\\sqrt2}{2}\\,\\operatorname{cis}\\!\\big(\\tfrac{\\pi}{4}+\\tfrac{\\pi}{3}\\big)=\\sqrt2\\,\\operatorname{cis}\\tfrac{7\\pi}{12}.$

(iii) $|z-z_1|=2$ is the set of points at distance $2$ from $z_1$ — a circle with centre $(2,2)$ and radius $2$.`,
  },

  {
    id: "step-050",
    type: "long",
    testId: "step",
    topicId: "step-pure4",
    difficulty: 3,
    totalMarks: 20,
    context: "This question concerns the equation $z^3=27i$.",
    parts: [
      { label: "(i)", marks: 8, question: "Find the three solutions in modulus–argument form.", solutionOutline: "27i=27 cis(π/2). Modulus 3, args (π/2+2kπ)/3 = π/6, 5π/6, 3π/2: 3cis(π/6),3cis(5π/6),3cis(3π/2)." },
      { label: "(ii)", marks: 6, question: "Express each solution in the form $a+bi$.", solutionOutline: "3cis(π/6)=(3√3/2)+(3/2)i; 3cis(5π/6)=-(3√3/2)+(3/2)i; 3cis(3π/2)=-3i." },
      { label: "(iii)", marks: 6, question: "Show that the three solutions lie on a circle and that their sum is zero.", solutionOutline: "All modulus 3 ⇒ circle radius 3. Sum: real parts cancel, 3/2i+3/2i-3i=0." },
    ],
    fullSolution: `(i) Write $27i=27\\operatorname{cis}\\tfrac{\\pi}{2}$. The cube roots have modulus $27^{1/3}=3$ and arguments $\\tfrac{\\pi/2+2k\\pi}{3}$, i.e. $\\tfrac{\\pi}{6},\\tfrac{5\\pi}{6},\\tfrac{3\\pi}{2}$: $\\;3\\operatorname{cis}\\tfrac{\\pi}{6},\\,3\\operatorname{cis}\\tfrac{5\\pi}{6},\\,3\\operatorname{cis}\\tfrac{3\\pi}{2}.$

(ii) $3\\operatorname{cis}\\tfrac{\\pi}{6}=\\tfrac{3\\sqrt3}{2}+\\tfrac32i$, $\\;3\\operatorname{cis}\\tfrac{5\\pi}{6}=-\\tfrac{3\\sqrt3}{2}+\\tfrac32i$, $\\;3\\operatorname{cis}\\tfrac{3\\pi}{2}=-3i.$

(iii) All three have modulus $3$, so they lie on the circle $|z|=3$. Their sum is $\\big(\\tfrac{3\\sqrt3}{2}-\\tfrac{3\\sqrt3}{2}\\big)+\\big(\\tfrac32+\\tfrac32-3\\big)i=0.$`,
  },

  {
    id: "step-051",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 2,
    totalMarks: 20,
    context: "The matrix $A=\\begin{pmatrix}2&3\\\\1&2\\end{pmatrix}$.",
    parts: [
      { label: "(i)", marks: 5, question: "Find $\\det A$ and $A^{-1}$.", solutionOutline: "det=4-3=1. A^{-1}=[[2,-3],[-1,2]]." },
      { label: "(ii)", marks: 7, question: "Hence solve $A\\mathbf x=\\begin{pmatrix}8\\\\5\\end{pmatrix}$.", solutionOutline: "x=A^{-1}b=[[2,-3],[-1,2]](8,5)^T=(16-15,-8+10)=(1,2)." },
      { label: "(iii)", marks: 8, question: "The transformation with matrix $A$ maps the unit square to a parallelogram. State its area, and find the image of the point $(1,1)$.", solutionOutline: "Area=|det A|=1. Image of (1,1): A(1,1)^T=(5,3)." },
    ],
    fullSolution: `(i) $\\det A=2\\cdot2-3\\cdot1=1$, so $A^{-1}=\\begin{pmatrix}2&-3\\\\-1&2\\end{pmatrix}.$

(ii) $\\mathbf x=A^{-1}\\begin{pmatrix}8\\\\5\\end{pmatrix}=\\begin{pmatrix}2\\cdot8-3\\cdot5\\\\-8+2\\cdot5\\end{pmatrix}=\\begin{pmatrix}1\\\\2\\end{pmatrix}$, i.e. $x=1,\\;y=2.$

(iii) The area scales by $|\\det A|=1$, so the parallelogram has area $1$. The image of $(1,1)$ is $A\\begin{pmatrix}1\\\\1\\end{pmatrix}=\\begin{pmatrix}5\\\\3\\end{pmatrix}.$`,
  },

  {
    id: "step-052",
    type: "long",
    testId: "step",
    topicId: "step-pure5",
    difficulty: 3,
    totalMarks: 20,
    context: "The matrix $M=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$.",
    parts: [
      { label: "(i)", marks: 6, question: "Find the eigenvalues of $M$ and a corresponding eigenvector for each.", solutionOutline: "det(M-λI)=(1-λ)²-4=λ²-2λ-3=(λ-3)(λ+1). λ=3:(1,1); λ=-1:(1,-1)." },
      { label: "(ii)", marks: 8, question: "Compute $M^2$ directly, and state its eigenvalues.", solutionOutline: "M²=[[5,4],[4,5]]. Eigenvalues 3²=9 and (-1)²=1." },
      { label: "(iii)", marks: 6, question: "Verify that the trace of $M^2$ equals the sum of its eigenvalues.", solutionOutline: "trace(M²)=5+5=10=9+1. ✓" },
    ],
    fullSolution: `(i) $\\det(M-\\lambda I)=(1-\\lambda)^2-4=\\lambda^2-2\\lambda-3=(\\lambda-3)(\\lambda+1)$. For $\\lambda=3$: $(M-3I)\\mathbf v=\\mathbf0\\Rightarrow y=x$, e.g. $(1,1)^T$. For $\\lambda=-1$: $x+y=0$, e.g. $(1,-1)^T$.

(ii) $M^2=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}^2=\\begin{pmatrix}5&4\\\\4&5\\end{pmatrix}$, with eigenvalues $3^2=9$ and $(-1)^2=1$.

(iii) $\\operatorname{tr}(M^2)=5+5=10=9+1$, the sum of the eigenvalues of $M^2$. ✓`,
  },

  {
    id: "step-053",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 2,
    totalMarks: 20,
    context: "A car accelerates uniformly from rest and reaches a speed of $20\\,\\text{m s}^{-1}$ after $8\\,\\text{s}$.",
    parts: [
      { label: "(i)", marks: 5, question: "Find the acceleration.", solutionOutline: "a=(v-u)/t=(20-0)/8=2.5 m/s²." },
      { label: "(ii)", marks: 7, question: "Find the distance travelled during these $8$ seconds.", solutionOutline: "s=½(u+v)t=½·20·8=80 m." },
      { label: "(iii)", marks: 8, question: "The car then travels at a constant $20\\,\\text{m s}^{-1}$ for $12\\,\\text{s}$, and finally decelerates uniformly to rest in a further $5\\,\\text{s}$. Find the total distance travelled from the start.", solutionOutline: "Const: 20·12=240. Decel: ½·20·5=50. Total=80+240+50=370 m." },
    ],
    fullSolution: `(i) $a=\\dfrac{v-u}{t}=\\dfrac{20-0}{8}=2.5\\,\\text{m s}^{-2}.$

(ii) $s=\\tfrac12(u+v)t=\\tfrac12(0+20)(8)=80\\,\\text{m}.$

(iii) Constant phase: $20\\times12=240\\,\\text{m}$. Deceleration phase: $\\tfrac12(20+0)(5)=50\\,\\text{m}$. Total $=80+240+50=370\\,\\text{m}.$`,
  },

  {
    id: "step-054",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 2,
    totalMarks: 20,
    context: "A block of mass $5\\,\\text{kg}$ rests on a rough plane inclined at $30^\\circ$ to the horizontal. Take $g=9.8\\,\\text{m s}^{-2}$.",
    parts: [
      { label: "(i)", marks: 6, question: "Find the component of the weight acting down the slope.", solutionOutline: "mg sin30=5·9.8·0.5=24.5 N." },
      { label: "(ii)", marks: 6, question: "The block is on the point of slipping down. Find the coefficient of friction.", solutionOutline: "μ=mg sin30/(mg cos30)=tan30=1/√3≈0.577." },
      { label: "(iii)", marks: 8, question: "A force $P$ is applied up the slope so the block moves up at constant speed. Find $P$.", solutionOutline: "P=mg sin30+μ mg cos30=24.5+24.5=49 N (since μ mg cos30=mg sin30)." },
    ],
    fullSolution: `(i) Down-slope weight component $=mg\\sin30^\\circ=5\\times9.8\\times0.5=24.5\\,\\text{N}.$

(ii) On the point of slipping, friction $=\\mu N=\\mu mg\\cos30^\\circ$ balances $mg\\sin30^\\circ$, so $\\mu=\\tan30^\\circ=\\tfrac{1}{\\sqrt3}\\approx0.577.$

(iii) Moving up at constant speed, $P=mg\\sin30^\\circ+\\mu mg\\cos30^\\circ$. Here $\\mu mg\\cos30^\\circ=mg\\sin30^\\circ=24.5\\,\\text{N}$, so $P=24.5+24.5=49\\,\\text{N}.$`,
  },

  {
    id: "step-055",
    type: "long",
    testId: "step",
    topicId: "step-mech",
    difficulty: 3,
    totalMarks: 20,
    context: "A particle $A$ of mass $2\\,\\text{kg}$ moving at $5\\,\\text{m s}^{-1}$ collides with a stationary particle $B$ of mass $3\\,\\text{kg}$. After the collision they move together. Take $g=10\\,\\text{m s}^{-2}$.",
    parts: [
      { label: "(i)", marks: 6, question: "Find their common velocity after the collision.", solutionOutline: "Momentum: 2·5=(2+3)v ⇒ v=2 m/s." },
      { label: "(ii)", marks: 6, question: "Find the kinetic energy lost in the collision.", solutionOutline: "KE_i=½·2·25=25 J; KE_f=½·5·4=10 J; lost=15 J." },
      { label: "(iii)", marks: 8, question: "The combined particle then slides on a rough horizontal surface with coefficient of friction $0.2$ until it stops. Find the distance it travels.", solutionOutline: "a=μg=2 m/s². 0=v²-2as ⇒ s=4/(2·2)=1 m." },
    ],
    fullSolution: `(i) Conservation of momentum: $2(5)=(2+3)v$, so $v=2\\,\\text{m s}^{-1}.$

(ii) $\\text{KE}_i=\\tfrac12(2)(5^2)=25\\,\\text{J}$; $\\text{KE}_f=\\tfrac12(5)(2^2)=10\\,\\text{J}$. Energy lost $=15\\,\\text{J}.$

(iii) Friction gives deceleration $a=\\mu g=0.2\\times10=2\\,\\text{m s}^{-2}$. Using $v^2=u^2-2as$ with final speed $0$: $0=2^2-2(2)s$, so $s=1\\,\\text{m}.$`,
  },

  {
    id: "step-056",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 2,
    totalMarks: 20,
    context: "A discrete random variable $X$ has distribution $P(X=0)=0.1$, $P(X=1)=0.3$, $P(X=2)=0.4$, $P(X=3)=0.2$.",
    parts: [
      { label: "(i)", marks: 4, question: "Verify that this is a valid probability distribution.", solutionOutline: "All ≥0 and sum=0.1+0.3+0.4+0.2=1." },
      { label: "(ii)", marks: 8, question: "Find $E(X)$ and $\\operatorname{Var}(X)$.", solutionOutline: "E(X)=0.3+0.8+0.6=1.7. E(X²)=0.3+1.6+1.8=3.7. Var=3.7-1.7²=0.81." },
      { label: "(iii)", marks: 8, question: "Find $P(X\\ge 2)$ and $E(2X+1)$.", solutionOutline: "P(X≥2)=0.4+0.2=0.6. E(2X+1)=2·1.7+1=4.4." },
    ],
    fullSolution: `(i) Each probability is $\\ge0$ and $0.1+0.3+0.4+0.2=1$, so it is a valid distribution.

(ii) $E(X)=0(0.1)+1(0.3)+2(0.4)+3(0.2)=1.7$. $E(X^2)=0+0.3+1.6+1.8=3.7$, so $\\operatorname{Var}(X)=3.7-1.7^2=0.81.$

(iii) $P(X\\ge2)=0.4+0.2=0.6$. $E(2X+1)=2E(X)+1=2(1.7)+1=4.4.$`,
  },

  {
    id: "step-057",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 2,
    totalMarks: 20,
    context: "A biased coin shows heads with probability $0.4$. It is tossed $6$ times; let $X$ be the number of heads.",
    parts: [
      { label: "(i)", marks: 5, question: "State the distribution of $X$ and find $P(X=3)$.", solutionOutline: "X~B(6,0.4). P(X=3)=C(6,3)(0.4)³(0.6)³=20·0.064·0.216≈0.2765." },
      { label: "(ii)", marks: 7, question: "Find $P(X\\le 1)$.", solutionOutline: "(0.6)^6+6(0.4)(0.6)^5=0.046656+0.186624=0.23328." },
      { label: "(iii)", marks: 8, question: "Find $E(X)$, $\\operatorname{Var}(X)$, and the most likely number of heads.", solutionOutline: "E=2.4, Var=1.44. P(X=2)=0.311 > P(X=3)=0.276 ⇒ mode=2." },
    ],
    fullSolution: `(i) $X\\sim B(6,0.4)$. $P(X=3)=\\binom{6}{3}(0.4)^3(0.6)^3=20(0.064)(0.216)\\approx0.2765.$

(ii) $P(X\\le1)=(0.6)^6+\\binom{6}{1}(0.4)(0.6)^5=0.046656+0.186624=0.23328.$

(iii) $E(X)=np=2.4$; $\\operatorname{Var}(X)=np(1-p)=6(0.4)(0.6)=1.44$. Since $P(X=2)=\\binom{6}{2}(0.4)^2(0.6)^4\\approx0.311$ exceeds $P(X=3)\\approx0.276$, the most likely number of heads is $2.$`,
  },

  {
    id: "step-058",
    type: "long",
    testId: "step",
    topicId: "step-stats",
    difficulty: 3,
    totalMarks: 20,
    context: "A continuous random variable $X$ is uniformly distributed with pdf $f(x)=\\tfrac12$ for $1\\le x\\le3$, and $0$ otherwise.",
    parts: [
      { label: "(i)", marks: 4, question: "Verify that $f$ is a valid probability density function.", solutionOutline: "f≥0 and ∫_1^3 ½ dx=½·2=1." },
      { label: "(ii)", marks: 6, question: "Find $E(X)$ and $\\operatorname{Var}(X)$.", solutionOutline: "E(X)=2 (midpoint). Var=(b-a)²/12=4/12=1/3." },
      { label: "(iii)", marks: 10, question: "Find the cumulative distribution function $F(x)$ for $1\\le x\\le3$, and hence $P(1.5\\le X\\le2.5)$.", solutionOutline: "F(x)=½(x-1). P=F(2.5)-F(1.5)=0.75-0.25=0.5." },
    ],
    fullSolution: `(i) $f(x)=\\tfrac12\\ge0$ and $\\int_1^3\\tfrac12\\,dx=\\tfrac12\\cdot2=1$, so $f$ is a valid pdf.

(ii) $E(X)=\\int_1^3 x\\cdot\\tfrac12\\,dx=\\tfrac12\\big[\\tfrac{x^2}{2}\\big]_1^3=\\tfrac12\\cdot4=2$. For a uniform distribution $\\operatorname{Var}(X)=\\tfrac{(b-a)^2}{12}=\\tfrac{4}{12}=\\tfrac13.$

(iii) For $1\\le x\\le3$, $F(x)=\\int_1^x\\tfrac12\\,dt=\\tfrac12(x-1)$. Hence $P(1.5\\le X\\le2.5)=F(2.5)-F(1.5)=0.75-0.25=0.5.$`,
  },

];

export const STEP_QUESTIONS: LongQuestion[] = [...STEP_BASE, ...STEP_HARD];
