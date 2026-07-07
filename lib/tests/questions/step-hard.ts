// STEP 高难度加练题（全部原创，参照 STEP 大题题型与难度，不含真题）。每题分步 + 完整解答。
import type { LongQuestion } from "./types";

export const STEP_HARD: LongQuestion[] = [
  {
    id: "step-hard-001", type: "long", testId: "step", topicId: "step-pure1", difficulty: 3, totalMarks: 14,
    context: "A sequence is defined by $u_1 = 1$ and $u_{n+1} = 2u_n + 1$ for $n \\ge 1$.",
    parts: [
      {
        label: "(i)", marks: 4,
        question: "Compute $u_2, u_3$ and $u_4$, and conjecture a closed formula for $u_n$.",
        solutionOutline: "u2=3, u3=7, u4=15; conjecture u_n = 2^n - 1.",
        hint: "Compute a few terms and compare with powers of 2.",
      },
      {
        label: "(ii)", marks: 6,
        question: "Prove by induction that $u_n = 2^n - 1$ for all $n \\ge 1$.",
        solutionOutline: "Base n=1: 2^1-1=1 ✓. Assume u_k=2^k-1; then u_{k+1}=2(2^k-1)+1=2^{k+1}-1. Hence true for all n.",
        hint: "Assume the formula for n=k and substitute into the recurrence.",
      },
      {
        label: "(iii)", marks: 4,
        question: "Hence find a closed form for $S_n = \\sum_{k=1}^{n} u_k$.",
        solutionOutline: "S_n = sum(2^k-1) = (2^{n+1}-2) - n = 2^{n+1} - n - 2.",
        hint: "Split the sum into a geometric series and a sum of 1s.",
      },
    ],
    fullSolution:
      "(i) $u_2=2(1)+1=3$, $u_3=2(3)+1=7$, $u_4=2(7)+1=15$. These are $2^2-1,2^3-1,2^4-1$, suggesting $u_n=2^n-1$.\n(ii) Base case $n=1$: $2^1-1=1=u_1$. Inductive step: assume $u_k=2^k-1$. Then $u_{k+1}=2u_k+1=2(2^k-1)+1=2^{k+1}-2+1=2^{k+1}-1$. By induction the formula holds for all $n\\ge1$.\n(iii) $S_n=\\sum_{k=1}^n(2^k-1)=\\left(\\sum_{k=1}^n 2^k\\right)-n=(2^{n+1}-2)-n=2^{n+1}-n-2.$",
  },
  {
    id: "step-hard-002", type: "long", testId: "step", topicId: "step-pure3", difficulty: 3, totalMarks: 14,
    context: "For integers $n \\ge 0$, define $I_n = \\displaystyle\\int_0^{\\pi/2} \\sin^n x \\,\\mathrm{d}x$.",
    parts: [
      {
        label: "(i)", marks: 3,
        question: "Evaluate $I_0$ and $I_1$.",
        solutionOutline: "I_0 = π/2; I_1 = ∫_0^{π/2} sin x dx = 1.",
        hint: "sin^0 x = 1.",
      },
      {
        label: "(ii)", marks: 7,
        question: "Using integration by parts, show that $I_n = \\dfrac{n-1}{n} I_{n-2}$ for $n \\ge 2$.",
        solutionOutline: "Write sin^n = sin^{n-1}·sin, integrate by parts; boundary term vanishes; obtain I_n=(n-1)(I_{n-2}-I_n) → I_n = ((n-1)/n) I_{n-2}.",
        hint: "Take u=sin^{n-1}x, dv=sin x dx, and use cos^2 = 1 - sin^2.",
      },
      {
        label: "(iii)", marks: 4,
        question: "Hence evaluate $I_4$.",
        solutionOutline: "I_4 = (3/4)I_2 = (3/4)(1/2)I_0 = (3/4)(1/2)(π/2) = 3π/16.",
        hint: "Apply the reduction formula twice down to I_0.",
      },
    ],
    fullSolution:
      "(i) $I_0=\\int_0^{\\pi/2}1\\,dx=\\tfrac{\\pi}{2}$; $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=[-\\cos x]_0^{\\pi/2}=1$.\n(ii) With $u=\\sin^{n-1}x$, $dv=\\sin x\\,dx$: $I_n=[-\\sin^{n-1}x\\cos x]_0^{\\pi/2}+(n-1)\\int_0^{\\pi/2}\\sin^{n-2}x\\cos^2x\\,dx$. The boundary term is $0$. Using $\\cos^2x=1-\\sin^2x$: $I_n=(n-1)(I_{n-2}-I_n)$, so $nI_n=(n-1)I_{n-2}$, giving $I_n=\\tfrac{n-1}{n}I_{n-2}$.\n(iii) $I_4=\\tfrac34 I_2=\\tfrac34\\cdot\\tfrac12 I_0=\\tfrac38\\cdot\\tfrac{\\pi}{2}=\\tfrac{3\\pi}{16}.$",
  },
  {
    id: "step-hard-003", type: "long", testId: "step", topicId: "step-mech", difficulty: 3, totalMarks: 14,
    context: "A particle is projected up a rough plane inclined at angle $\\alpha$ to the horizontal with initial speed $u$. The coefficient of friction between particle and plane is $\\mu$, and $\\tan\\alpha > \\mu$.",
    parts: [
      {
        label: "(i)", marks: 5,
        question: "Show that while moving up the plane the deceleration is $g(\\sin\\alpha + \\mu\\cos\\alpha)$.",
        solutionOutline: "Up the plane: gravity component g sinα down-slope, friction μg cosα also down-slope (opposes motion). Deceleration = g(sinα+μcosα).",
        hint: "Both gravity and friction act down the slope while it moves up.",
      },
      {
        label: "(ii)", marks: 4,
        question: "Find the distance $d$ travelled up the plane before the particle momentarily stops.",
        solutionOutline: "v²=u²-2ad, 0 = u² - 2g(sinα+μcosα)d → d = u²/(2g(sinα+μcosα)).",
        hint: "Use v² = u² − 2ad with v = 0.",
      },
      {
        label: "(iii)", marks: 5,
        question: "Given that the particle then slides back down, find its speed when it returns to the starting point, in terms of $u$, $\\alpha$ and $\\mu$.",
        solutionOutline: "Down: accel g(sinα−μcosα). v² = 2·g(sinα−μcosα)·d = u²(sinα−μcosα)/(sinα+μcosα). v = u√[(sinα−μcosα)/(sinα+μcosα)].",
        hint: "On the way down friction now acts up the slope; reuse d from (ii).",
      },
    ],
    fullSolution:
      "(i) Moving up, gravity contributes $g\\sin\\alpha$ down the slope and friction $\\mu R=\\mu g\\cos\\alpha$ also down the slope (opposing motion). So the deceleration is $g(\\sin\\alpha+\\mu\\cos\\alpha)$.\n(ii) Using $v^2=u^2-2ad$ with $v=0$: $d=\\dfrac{u^2}{2g(\\sin\\alpha+\\mu\\cos\\alpha)}$.\n(iii) Sliding down, friction reverses, so the acceleration is $g(\\sin\\alpha-\\mu\\cos\\alpha)$ (positive since $\\tan\\alpha>\\mu$). Then $v^2=2g(\\sin\\alpha-\\mu\\cos\\alpha)\\,d=\\dfrac{u^2(\\sin\\alpha-\\mu\\cos\\alpha)}{\\sin\\alpha+\\mu\\cos\\alpha}$, so $v=u\\sqrt{\\dfrac{\\sin\\alpha-\\mu\\cos\\alpha}{\\sin\\alpha+\\mu\\cos\\alpha}}.$",
  },
];
