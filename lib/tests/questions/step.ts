// STEP（Sixth Term Examination Paper）题库
// 每题 20 分，3 小时内从 12 题中选 6 题作答
// 此题库收录 12 道纯数学大题，覆盖 STEP 2 难度

import type { LongQuestion } from "./types";

export const STEP_QUESTIONS: LongQuestion[] = [
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
];
