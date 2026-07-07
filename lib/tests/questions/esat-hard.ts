// ESAT 高难度·多步推理加练题（全部原创，参照 ESAT 题型与难度，不含任何真题）
// 难度统一 difficulty 3，每题 2 分，含完整分步解答。
import type { MCQQuestion } from "./types";

export const ESAT_HARD_QUESTIONS: MCQQuestion[] = [
  {
    id: "esat-hard-001",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math2",
    difficulty: 3,
    marks: 2,
    question:
      "Given that $\\log_2 x + \\log_4 y = 4$ and $\\log_4 x + \\log_2 y = 5$, find $\\log_2(xy)$.",
    options: [
      { key: "A", text: "$5$" },
      { key: "B", text: "$6$" },
      { key: "C", text: "$7$" },
      { key: "D", text: "$8$" },
    ],
    answer: "B",
    solution:
      "Let $a=\\log_2 x,\\ b=\\log_2 y$, so $\\log_4 x=\\tfrac{a}{2},\\ \\log_4 y=\\tfrac{b}{2}$. The equations become $a+\\tfrac{b}{2}=4$ and $\\tfrac{a}{2}+b=5$, i.e. $2a+b=8$ and $a+2b=10$. Solving: $a=2,\\ b=4$. Hence $\\log_2(xy)=a+b=6$.",
    hint: "Set $a=\\log_2 x,\\ b=\\log_2 y$ and use $\\log_4 t=\\tfrac12\\log_2 t$.",
  },
  {
    id: "esat-hard-002",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math1",
    difficulty: 3,
    marks: 2,
    question:
      "The cubic $p(x)=x^3+ax^2+bx+c$ has three roots in arithmetic progression. Given $a=-6$ and $b=11$, find $c$.",
    options: [
      { key: "A", text: "$-6$" },
      { key: "B", text: "$-4$" },
      { key: "C", text: "$6$" },
      { key: "D", text: "$8$" },
    ],
    answer: "A",
    solution:
      "Let the roots be $r-d,\\ r,\\ r+d$. Sum $=3r=-a=6\\Rightarrow r=2$. Pairwise sum $=b$: $(r-d)r+(r-d)(r+d)+r(r+d)=3r^2-d^2=12-d^2=11\\Rightarrow d^2=1$, so roots are $1,2,3$. Then $c=-(1)(2)(3)=-6$.",
    hint: "Write the roots as $r-d,\\,r,\\,r+d$ and use Vieta's formulas.",
  },
  {
    id: "esat-hard-003",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math3",
    difficulty: 3,
    marks: 2,
    question:
      "The region enclosed by the curve $y=x^2$ and the line $y=mx$ (with $m>0$) has area $\\dfrac{9}{2}$. Find $m$.",
    options: [
      { key: "A", text: "$2$" },
      { key: "B", text: "$3$" },
      { key: "C", text: "$4$" },
      { key: "D", text: "$27$" },
    ],
    answer: "B",
    solution:
      "The curves meet where $x^2=mx\\Rightarrow x=0,\\ x=m$. Area $=\\int_0^m (mx-x^2)\\,dx=\\left[\\tfrac{mx^2}{2}-\\tfrac{x^3}{3}\\right]_0^m=\\tfrac{m^3}{2}-\\tfrac{m^3}{3}=\\tfrac{m^3}{6}$. Setting $\\tfrac{m^3}{6}=\\tfrac{9}{2}$ gives $m^3=27$, so $m=3$.",
    hint: "Integrate (line $-$ curve) between the intersection points.",
  },
  {
    id: "esat-hard-004",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math2",
    difficulty: 3,
    marks: 2,
    question:
      "Find the sum of all solutions of $\\sin 2x=\\cos x$ in the interval $0\\le x<2\\pi$.",
    options: [
      { key: "A", text: "$2\\pi$" },
      { key: "B", text: "$3\\pi$" },
      { key: "C", text: "$4\\pi$" },
      { key: "D", text: "$\\dfrac{7\\pi}{2}$" },
    ],
    answer: "B",
    solution:
      "$\\sin 2x=2\\sin x\\cos x=\\cos x\\Rightarrow \\cos x(2\\sin x-1)=0$. So $\\cos x=0\\Rightarrow x=\\tfrac{\\pi}{2},\\tfrac{3\\pi}{2}$; or $\\sin x=\\tfrac12\\Rightarrow x=\\tfrac{\\pi}{6},\\tfrac{5\\pi}{6}$. Sum $=\\tfrac{\\pi}{2}+\\tfrac{3\\pi}{2}+\\tfrac{\\pi}{6}+\\tfrac{5\\pi}{6}=2\\pi+\\pi=3\\pi$.",
    hint: "Expand $\\sin 2x$ and factor out $\\cos x$.",
  },
  {
    id: "esat-hard-005",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math2",
    difficulty: 3,
    marks: 2,
    question:
      "Given $2^a=3$, $3^b=5$ and $5^c=8$, find the value of $abc$.",
    options: [
      { key: "A", text: "$2$" },
      { key: "B", text: "$3$" },
      { key: "C", text: "$\\log_2 15$" },
      { key: "D", text: "$8$" },
    ],
    answer: "B",
    solution:
      "Taking logs base 2: $a=\\log_2 3,\\ b=\\log_3 5,\\ c=\\log_5 8$. Then $abc=\\log_2 3\\cdot\\log_3 5\\cdot\\log_5 8=\\log_2 8=3$ (the chain telescopes by the change-of-base rule).",
    hint: "Use the change-of-base chain $\\log_2 3\\cdot\\log_3 5\\cdot\\log_5 8=\\log_2 8$.",
  },
  {
    id: "esat-hard-006",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math1",
    difficulty: 3,
    marks: 2,
    question:
      "Find the constant term in the expansion of $\\left(2x-\\dfrac{1}{x}\\right)^6$.",
    options: [
      { key: "A", text: "$-160$" },
      { key: "B", text: "$160$" },
      { key: "C", text: "$-60$" },
      { key: "D", text: "$60$" },
    ],
    answer: "A",
    solution:
      "The general term is $\\binom{6}{k}(2x)^{6-k}\\left(-\\tfrac{1}{x}\\right)^k=\\binom{6}{k}2^{6-k}(-1)^k x^{6-2k}$. The constant term needs $6-2k=0\\Rightarrow k=3$: $\\binom{6}{3}2^{3}(-1)^3=20\\cdot 8\\cdot(-1)=-160$.",
    hint: "Find $k$ making the power of $x$ zero in the general binomial term.",
  },
  {
    id: "esat-hard-007",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math1",
    difficulty: 3,
    marks: 2,
    question:
      "The equation $x^2-(k+1)x+(k+6)=0$ has two positive integer roots. Find the sum of all possible values of $k$.",
    options: [
      { key: "A", text: "$12$" },
      { key: "B", text: "$14$" },
      { key: "C", text: "$16$" },
      { key: "D", text: "$8$" },
    ],
    answer: "B",
    solution:
      "Let the roots be $p,q$. Then $p+q=k+1$ and $pq=k+6$, so $pq-(p+q)=5$, i.e. $(p-1)(q-1)=6$. Positive-integer factor pairs give $\\{p,q\\}=\\{2,7\\}$ (then $k=8$) or $\\{3,4\\}$ (then $k=6$). Sum $=8+6=14$.",
    hint: "Compute $pq-(p+q)$ and factor $(p-1)(q-1)$.",
  },
  {
    id: "esat-hard-008",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math3",
    difficulty: 3,
    marks: 2,
    question:
      "The circle $x^2+y^2-6x-4y+9=0$ is tangent to the line $y=x+k$. Find the positive value of $k$.",
    options: [
      { key: "A", text: "$2\\sqrt{2}-1$" },
      { key: "B", text: "$2\\sqrt{2}+1$" },
      { key: "C", text: "$\\sqrt{2}-1$" },
      { key: "D", text: "$3$" },
    ],
    answer: "A",
    solution:
      "The circle has centre $(3,2)$ and radius $r=\\sqrt{3^2+2^2-9}=2$. Distance from $(3,2)$ to $x-y+k=0$ is $\\dfrac{|3-2+k|}{\\sqrt2}=\\dfrac{|1+k|}{\\sqrt2}$. Tangency requires this $=2$, so $|1+k|=2\\sqrt2$, giving $k=2\\sqrt2-1$ (positive value).",
    hint: "Set the distance from the centre to the line equal to the radius.",
  },
  {
    id: "esat-hard-009",
    type: "mcq",
    testId: "esat",
    topicId: "esat-math3",
    difficulty: 3,
    marks: 2,
    question:
      "A right circular cylinder is inscribed in a sphere of radius $R$. What is the maximum possible volume of the cylinder?",
    options: [
      { key: "A", text: "$\\dfrac{4\\pi R^3}{3\\sqrt{3}}$" },
      { key: "B", text: "$\\dfrac{4\\pi R^3}{3}$" },
      { key: "C", text: "$\\dfrac{2\\pi R^3}{3\\sqrt{3}}$" },
      { key: "D", text: "$\\dfrac{\\pi R^3}{3}$" },
    ],
    answer: "A",
    solution:
      "Let the cylinder have radius $r$ and half-height $h$, so $r^2+h^2=R^2$. Volume $V=\\pi r^2(2h)=2\\pi h(R^2-h^2)$. Then $\\dfrac{dV}{dh}=2\\pi(R^2-3h^2)=0\\Rightarrow h=\\dfrac{R}{\\sqrt3}$. Substituting, $V=2\\pi\\cdot\\dfrac{R}{\\sqrt3}\\cdot\\dfrac{2R^2}{3}=\\dfrac{4\\pi R^3}{3\\sqrt3}$.",
    hint: "Use $r^2+h^2=R^2$ to write $V$ in one variable, then differentiate.",
  },
  {
    id: "esat-hard-010",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 3,
    marks: 2,
    question:
      "A ball is thrown vertically upward at $20\\,\\text{m s}^{-1}$ from the top of a cliff and lands at the base of the cliff $5\\,\\text{s}$ later. Taking $g=10\\,\\text{m s}^{-2}$, find the height of the cliff.",
    options: [
      { key: "A", text: "$25\\,\\text{m}$" },
      { key: "B", text: "$50\\,\\text{m}$" },
      { key: "C", text: "$75\\,\\text{m}$" },
      { key: "D", text: "$125\\,\\text{m}$" },
    ],
    answer: "A",
    solution:
      "Taking upward as positive, the displacement after $5\\,\\text{s}$ is $s=ut-\\tfrac12 g t^2=20(5)-\\tfrac12(10)(5)^2=100-125=-25\\,\\text{m}$. The negative sign means it lands $25\\,\\text{m}$ below the launch point, so the cliff is $25\\,\\text{m}$ high.",
    hint: "Use $s=ut-\\tfrac12 gt^2$; a negative $s$ means below the start.",
  },
  {
    id: "esat-hard-011",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 3,
    marks: 2,
    question:
      "A projectile is launched so that its horizontal range equals its maximum height. Find $\\tan\\theta$, where $\\theta$ is the launch angle above the horizontal.",
    options: [
      { key: "A", text: "$2$" },
      { key: "B", text: "$4$" },
      { key: "C", text: "$\\tfrac12$" },
      { key: "D", text: "$\\tfrac14$" },
    ],
    answer: "B",
    solution:
      "Range $R=\\dfrac{u^2\\sin 2\\theta}{g}$ and maximum height $H=\\dfrac{u^2\\sin^2\\theta}{2g}$. Setting $R=H$: $\\sin 2\\theta=\\tfrac12\\sin^2\\theta\\Rightarrow 2\\sin\\theta\\cos\\theta=\\tfrac12\\sin^2\\theta\\Rightarrow 4\\cos\\theta=\\sin\\theta$, so $\\tan\\theta=4$.",
    hint: "Write $R$ and $H$ in terms of $u,\\theta,g$ and set them equal.",
  },
  {
    id: "esat-hard-012",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 2,
    question:
      "A block of mass $2\\,\\text{kg}$ moving at $6\\,\\text{m s}^{-1}$ collides with and sticks to a stationary $4\\,\\text{kg}$ block. What fraction of the initial kinetic energy is lost in the collision?",
    options: [
      { key: "A", text: "$\\tfrac13$" },
      { key: "B", text: "$\\tfrac12$" },
      { key: "C", text: "$\\tfrac23$" },
      { key: "D", text: "$\\tfrac34$" },
    ],
    answer: "C",
    solution:
      "Momentum: $2(6)=(2+4)v\\Rightarrow v=2\\,\\text{m s}^{-1}$. Initial KE $=\\tfrac12(2)(6^2)=36\\,\\text{J}$; final KE $=\\tfrac12(6)(2^2)=12\\,\\text{J}$. Lost $=24\\,\\text{J}$, a fraction $\\dfrac{24}{36}=\\dfrac23$.",
    hint: "Use conservation of momentum to find $v$, then compare kinetic energies.",
  },
  {
    id: "esat-hard-013",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 2,
    question:
      "A $6\\,\\Omega$ and a $3\\,\\Omega$ resistor are connected in parallel, and this combination is in series with a $4\\,\\Omega$ resistor across a $12\\,\\text{V}$ battery of negligible internal resistance. Find the power dissipated in the $6\\,\\Omega$ resistor.",
    options: [
      { key: "A", text: "$\\dfrac{8}{3}\\,\\text{W}$" },
      { key: "B", text: "$\\dfrac{16}{3}\\,\\text{W}$" },
      { key: "C", text: "$4\\,\\text{W}$" },
      { key: "D", text: "$8\\,\\text{W}$" },
    ],
    answer: "A",
    solution:
      "Parallel pair: $\\left(\\tfrac16+\\tfrac13\\right)^{-1}=2\\,\\Omega$. Total resistance $=2+4=6\\,\\Omega$, so the current from the battery is $\\tfrac{12}{6}=2\\,\\text{A}$. Voltage across the parallel section $=2\\,\\text{A}\\times 2\\,\\Omega=4\\,\\text{V}$. Power in the $6\\,\\Omega$ resistor $=\\dfrac{V^2}{R}=\\dfrac{4^2}{6}=\\dfrac{8}{3}\\,\\text{W}$.",
    hint: "Find the total current, then the voltage across the parallel section, then $V^2/R$.",
  },
  {
    id: "esat-hard-014",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 2,
    question:
      "A particle performs simple harmonic motion with amplitude $A$ and period $T$, starting from the centre of oscillation. Find the shortest time taken to reach displacement $x=\\dfrac{A}{2}$.",
    options: [
      { key: "A", text: "$\\dfrac{T}{12}$" },
      { key: "B", text: "$\\dfrac{T}{8}$" },
      { key: "C", text: "$\\dfrac{T}{6}$" },
      { key: "D", text: "$\\dfrac{T}{4}$" },
    ],
    answer: "A",
    solution:
      "Starting at the centre, $x=A\\sin\\!\\left(\\dfrac{2\\pi t}{T}\\right)$. Setting $x=\\dfrac{A}{2}$ gives $\\sin\\!\\left(\\dfrac{2\\pi t}{T}\\right)=\\dfrac12\\Rightarrow \\dfrac{2\\pi t}{T}=\\dfrac{\\pi}{6}\\Rightarrow t=\\dfrac{T}{12}$.",
    hint: "Use $x=A\\sin(\\omega t)$ with $\\omega=\\tfrac{2\\pi}{T}$.",
  },
  {
    id: "esat-hard-015",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 3,
    marks: 2,
    question:
      "When $4.0\\,\\text{g}$ of a metal carbonate $M\\text{CO}_3$ is heated strongly, it decomposes to the oxide $M\\text{O}$, and $2.24\\,\\text{g}$ of solid remains. Find the relative atomic mass of $M$.",
    options: [
      { key: "A", text: "$24$" },
      { key: "B", text: "$40$" },
      { key: "C", text: "$56$" },
      { key: "D", text: "$88$" },
    ],
    answer: "B",
    solution:
      "Mass lost is CO$_2$: $4.0-2.24=1.76\\,\\text{g}$, i.e. $\\tfrac{1.76}{44}=0.04\\,\\text{mol}$. So $0.04\\,\\text{mol}$ of $M\\text{CO}_3$ has mass $4.0\\,\\text{g}$, giving molar mass $\\tfrac{4.0}{0.04}=100$. Then $M+60=100\\Rightarrow M=40$.",
    hint: "The mass lost on heating equals the mass of CO$_2$ released.",
  },
  {
    id: "esat-hard-016",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem2",
    difficulty: 3,
    marks: 2,
    question:
      "A hydrocarbon contains $82.8\\%$ carbon by mass and has a relative molecular mass of $58$. Find its molecular formula.",
    options: [
      { key: "A", text: "$\\text{C}_4\\text{H}_{10}$" },
      { key: "B", text: "$\\text{C}_4\\text{H}_8$" },
      { key: "C", text: "$\\text{C}_3\\text{H}_8$" },
      { key: "D", text: "$\\text{C}_5\\text{H}_{12}$" },
    ],
    answer: "A",
    solution:
      "In $100\\,\\text{g}$: C $=\\tfrac{82.8}{12}=6.9$, H $=\\tfrac{17.2}{1}=17.2$. Ratio C:H $=6.9:17.2\\approx 2:5$, so the empirical formula is $\\text{C}_2\\text{H}_5$ (mass $29$). Since $58/29=2$, the molecular formula is $\\text{C}_4\\text{H}_{10}$.",
    hint: "Find the empirical formula from mass %, then scale to the given $M_r$.",
  },
  {
    id: "esat-hard-017",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem3",
    difficulty: 3,
    marks: 2,
    question:
      "$25.0\\,\\text{cm}^3$ of $0.10\\,\\text{mol dm}^{-3}$ NaOH is exactly neutralised by $20.0\\,\\text{cm}^3$ of sulfuric acid. Find the concentration of the H$_2$SO$_4$.",
    options: [
      { key: "A", text: "$0.050\\,\\text{mol dm}^{-3}$" },
      { key: "B", text: "$0.0625\\,\\text{mol dm}^{-3}$" },
      { key: "C", text: "$0.100\\,\\text{mol dm}^{-3}$" },
      { key: "D", text: "$0.125\\,\\text{mol dm}^{-3}$" },
    ],
    answer: "B",
    solution:
      "$\\text{H}_2\\text{SO}_4+2\\text{NaOH}\\to\\text{Na}_2\\text{SO}_4+2\\text{H}_2\\text{O}$. Moles NaOH $=0.0250\\times0.10=2.5\\times10^{-3}$. Moles acid $=\\tfrac12(2.5\\times10^{-3})=1.25\\times10^{-3}$. Concentration $=\\tfrac{1.25\\times10^{-3}}{0.0200}=0.0625\\,\\text{mol dm}^{-3}$.",
    hint: "H$_2$SO$_4$ reacts with NaOH in a $1:2$ ratio.",
  },
  {
    id: "esat-hard-018",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 2,
    question:
      "In a dihybrid cross $AaBb\\times AaBb$ (genes unlinked, simple dominance), what fraction of the offspring are expected to show both recessive phenotypes?",
    options: [
      { key: "A", text: "$\\tfrac{1}{16}$" },
      { key: "B", text: "$\\tfrac{3}{16}$" },
      { key: "C", text: "$\\tfrac{9}{16}$" },
      { key: "D", text: "$\\tfrac{1}{4}$" },
    ],
    answer: "A",
    solution:
      "Each gene independently gives probability $\\tfrac14$ of the recessive phenotype ($aa$ or $bb$). As the genes are unlinked, multiply: $\\tfrac14\\times\\tfrac14=\\tfrac{1}{16}$.",
    hint: "Treat the two genes independently and multiply the probabilities.",
  },
  {
    id: "esat-hard-019",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 2,
    question:
      "A plant cell with water potential $-400\\,\\text{kPa}$ is placed in a solution of water potential $-250\\,\\text{kPa}$. Which best describes the net movement of water?",
    options: [
      { key: "A", text: "Into the cell, since the solution has the higher (less negative) water potential" },
      { key: "B", text: "Out of the cell, since the cell has the lower water potential" },
      { key: "C", text: "No net movement, since neither is zero" },
      { key: "D", text: "Cannot be determined without the solute potential" },
    ],
    answer: "A",
    solution:
      "Water moves by osmosis from higher (less negative) to lower (more negative) water potential. The solution is at $-250\\,\\text{kPa}$ and the cell at $-400\\,\\text{kPa}$, so water moves into the cell.",
    hint: "Water flows down the water-potential gradient: high $\\to$ low.",
  },
  {
    id: "esat-hard-020",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio3",
    difficulty: 3,
    marks: 2,
    question:
      "In a population at Hardy–Weinberg equilibrium, $16\\%$ of individuals show a recessive phenotype. What fraction of the population are heterozygous carriers?",
    options: [
      { key: "A", text: "$0.24$" },
      { key: "B", text: "$0.36$" },
      { key: "C", text: "$0.48$" },
      { key: "D", text: "$0.16$" },
    ],
    answer: "C",
    solution:
      "$q^2=0.16\\Rightarrow q=0.4$, so $p=0.6$. Heterozygotes $=2pq=2(0.6)(0.4)=0.48$.",
    hint: "Find $q$ from $q^2$, then compute $2pq$.",
  },
];
