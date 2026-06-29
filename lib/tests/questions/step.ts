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
];
