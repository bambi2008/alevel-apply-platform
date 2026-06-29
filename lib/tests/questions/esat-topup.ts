// ESAT 现有模块「补足到 40 题」的增量题库。
// 与 esat.ts 主文件分开维护，按模块分块导出，最终在 esat.ts 聚合。
// id 接续主文件最大编号，避免冲突（物理主文件最大 esat-p-054 → 此处从 055 起）。
//
// 进度：
//   esat-phys1 力学  +18（055–072）✓ 本批 → 达 40
//   其余模块（phys2/phys3/chem1-3/math*）待补

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ════════════════════════════════════════════════════════════════════════
//  esat-phys1 · 物理力学 补充 18 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_PHYS1_EXTRA: MCQQuestion[] = [
  {
    id: "esat-p-055",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A car travelling at $30\\,\\text{m s}^{-1}$ brakes with a constant deceleration of $5\\,\\text{m s}^{-2}$. How far does it travel before stopping?",
    options: [
      { key: "A", text: "$45\\,\\text{m}$" },
      { key: "B", text: "$60\\,\\text{m}$" },
      { key: "C", text: "$90\\,\\text{m}$" },
      { key: "D", text: "$180\\,\\text{m}$" },
    ],
    answer: "C",
    solution:
      "Using $v^2=u^2-2as$ with $v=0$: $0=30^2-2(5)s\\Rightarrow s=\\dfrac{900}{10}=90\\,\\text{m}$.",
  },
  {
    id: "esat-p-056",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A $2\\,\\text{kg}$ trolley moving at $3\\,\\text{m s}^{-1}$ collides with a stationary $1\\,\\text{kg}$ trolley and they stick together. Their common velocity after the collision is:",
    options: [
      { key: "A", text: "$1\\,\\text{m s}^{-1}$" },
      { key: "B", text: "$2\\,\\text{m s}^{-1}$" },
      { key: "C", text: "$3\\,\\text{m s}^{-1}$" },
      { key: "D", text: "$6\\,\\text{m s}^{-1}$" },
    ],
    answer: "B",
    solution:
      "Conserving momentum: $(2)(3)+(1)(0)=(2+1)v\\Rightarrow v=\\dfrac{6}{3}=2\\,\\text{m s}^{-1}$.",
  },
  {
    id: "esat-p-057",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 1,
    marks: 1,
    question:
      "A constant force of $6\\,\\text{N}$ acts on a body for $3\\,\\text{s}$. The impulse delivered is:",
    options: [
      { key: "A", text: "$2\\,\\text{N s}$" },
      { key: "B", text: "$9\\,\\text{N s}$" },
      { key: "C", text: "$18\\,\\text{N s}$" },
      { key: "D", text: "$0.5\\,\\text{N s}$" },
    ],
    answer: "C",
    solution:
      "Impulse $=F\\,t=6\\times3=18\\,\\text{N s}$ (equal to the change in momentum).",
  },
  {
    id: "esat-p-058",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A force of $20\\,\\text{N}$ pulls a box $5\\,\\text{m}$ along the ground, the force acting at $60^\\circ$ above the horizontal. The work done by the force is:",
    options: [
      { key: "A", text: "$25\\,\\text{J}$" },
      { key: "B", text: "$50\\,\\text{J}$" },
      { key: "C", text: "$87\\,\\text{J}$" },
      { key: "D", text: "$100\\,\\text{J}$" },
    ],
    answer: "B",
    solution:
      "$W=Fd\\cos\\theta=20\\times5\\times\\cos60^\\circ=100\\times0.5=50\\,\\text{J}$.",
  },
  {
    id: "esat-p-059",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A motor raises a $50\\,\\text{kg}$ load at a steady speed of $2\\,\\text{m s}^{-1}$. Taking $g=10\\,\\text{m s}^{-2}$, the useful output power is:",
    options: [
      { key: "A", text: "$100\\,\\text{W}$" },
      { key: "B", text: "$250\\,\\text{W}$" },
      { key: "C", text: "$500\\,\\text{W}$" },
      { key: "D", text: "$1000\\,\\text{W}$" },
    ],
    answer: "D",
    solution:
      "At constant speed the lifting force equals the weight $mg=500\\,\\text{N}$. Power $=Fv=500\\times2=1000\\,\\text{W}$.",
  },
  {
    id: "esat-p-060",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 1,
    marks: 1,
    question:
      "What is the kinetic energy of a $2\\,\\text{kg}$ object moving at $10\\,\\text{m s}^{-1}$?",
    options: [
      { key: "A", text: "$20\\,\\text{J}$" },
      { key: "B", text: "$50\\,\\text{J}$" },
      { key: "C", text: "$100\\,\\text{J}$" },
      { key: "D", text: "$200\\,\\text{J}$" },
    ],
    answer: "C",
    solution:
      "$E_k=\\tfrac12 mv^2=\\tfrac12(2)(10^2)=100\\,\\text{J}$.",
  },
  {
    id: "esat-p-061",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 1,
    marks: 1,
    question:
      "A $5\\,\\text{kg}$ mass is lifted $4\\,\\text{m}$ vertically. Taking $g=10\\,\\text{m s}^{-2}$, the gain in gravitational potential energy is:",
    options: [
      { key: "A", text: "$20\\,\\text{J}$" },
      { key: "B", text: "$50\\,\\text{J}$" },
      { key: "C", text: "$200\\,\\text{J}$" },
      { key: "D", text: "$2000\\,\\text{J}$" },
    ],
    answer: "C",
    solution:
      "$\\Delta E_p=mgh=5\\times10\\times4=200\\,\\text{J}$.",
  },
  {
    id: "esat-p-062",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A ball is thrown horizontally from the top of a $20\\,\\text{m}$ cliff. Taking $g=10\\,\\text{m s}^{-2}$ and ignoring air resistance, how long does it take to reach the ground?",
    options: [
      { key: "A", text: "$1\\,\\text{s}$" },
      { key: "B", text: "$2\\,\\text{s}$" },
      { key: "C", text: "$2.8\\,\\text{s}$" },
      { key: "D", text: "$4\\,\\text{s}$" },
    ],
    answer: "B",
    solution:
      "Vertical motion is independent of the horizontal: $h=\\tfrac12 g t^2\\Rightarrow 20=5t^2\\Rightarrow t^2=4\\Rightarrow t=2\\,\\text{s}$.",
  },
  {
    id: "esat-p-063",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A $0.5\\,\\text{kg}$ ball is whirled in a horizontal circle of radius $2\\,\\text{m}$ at a constant speed of $4\\,\\text{m s}^{-1}$. The centripetal force required is:",
    options: [
      { key: "A", text: "$1\\,\\text{N}$" },
      { key: "B", text: "$2\\,\\text{N}$" },
      { key: "C", text: "$4\\,\\text{N}$" },
      { key: "D", text: "$8\\,\\text{N}$" },
    ],
    answer: "C",
    solution:
      "$F=\\dfrac{mv^2}{r}=\\dfrac{0.5\\times4^2}{2}=\\dfrac{8}{2}=4\\,\\text{N}$.",
  },
  {
    id: "esat-p-064",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A book rests on a table. Which two forces form a Newton's third-law (action–reaction) pair?",
    options: [
      { key: "A", text: "The weight of the book and the normal force of the table on the book" },
      { key: "B", text: "The Earth's gravitational pull on the book and the book's gravitational pull on the Earth" },
      { key: "C", text: "The weight of the book and the weight of the table" },
      { key: "D", text: "The normal force on the book and the book's weight, which are always equal" },
    ],
    answer: "B",
    solution:
      "Third-law pairs are equal, opposite, act on different bodies and are the same type of force. The Earth pulling the book and the book pulling the Earth (both gravitational) are such a pair. Weight and normal force act on the SAME object, so they are not a third-law pair (they balance by the first law).",
  },
  {
    id: "esat-p-065",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A $5\\,\\text{kg}$ block sits on a horizontal surface with coefficient of friction $0.4$. Taking $g=10\\,\\text{m s}^{-2}$, the maximum (limiting) friction force before it slides is:",
    options: [
      { key: "A", text: "$0.4\\,\\text{N}$" },
      { key: "B", text: "$2\\,\\text{N}$" },
      { key: "C", text: "$20\\,\\text{N}$" },
      { key: "D", text: "$50\\,\\text{N}$" },
    ],
    answer: "C",
    solution:
      "Normal force $N=mg=50\\,\\text{N}$. Limiting friction $=\\mu N=0.4\\times50=20\\,\\text{N}$.",
  },
  {
    id: "esat-p-066",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 3,
    marks: 1,
    question:
      "A $2\\,\\text{kg}$ block slides down a smooth (frictionless) incline angled at $30^\\circ$ to the horizontal. Taking $g=10\\,\\text{m s}^{-2}$, its acceleration down the slope is:",
    options: [
      { key: "A", text: "$2.5\\,\\text{m s}^{-2}$" },
      { key: "B", text: "$5\\,\\text{m s}^{-2}$" },
      { key: "C", text: "$8.7\\,\\text{m s}^{-2}$" },
      { key: "D", text: "$10\\,\\text{m s}^{-2}$" },
    ],
    answer: "B",
    solution:
      "The component of gravity along a frictionless slope gives $a=g\\sin\\theta=10\\sin30^\\circ=10\\times0.5=5\\,\\text{m s}^{-2}$ (independent of mass).",
  },
  {
    id: "esat-p-067",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "A light horizontal rod is pivoted at one end. A weight of $10\\,\\text{N}$ hangs $1\\,\\text{m}$ from the pivot. What upward force applied $4\\,\\text{m}$ from the pivot will keep the rod balanced?",
    options: [
      { key: "A", text: "$2.5\\,\\text{N}$" },
      { key: "B", text: "$5\\,\\text{N}$" },
      { key: "C", text: "$10\\,\\text{N}$" },
      { key: "D", text: "$40\\,\\text{N}$" },
    ],
    answer: "A",
    solution:
      "Principle of moments: $F\\times4=10\\times1\\Rightarrow F=\\dfrac{10}{4}=2.5\\,\\text{N}$.",
  },
  {
    id: "esat-p-068",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 1,
    marks: 1,
    question:
      "A skydiver falls at terminal velocity. Which statement is correct?",
    options: [
      { key: "A", text: "The air resistance is greater than the weight, so they slow down" },
      { key: "B", text: "The air resistance equals the weight, so the net force and acceleration are zero" },
      { key: "C", text: "The weight is zero" },
      { key: "D", text: "They are accelerating at $g$" },
    ],
    answer: "B",
    solution:
      "At terminal velocity the upward drag has risen until it balances the weight. The resultant force is zero, so by Newton's second law the acceleration is zero and the velocity is constant.",
  },
  {
    id: "esat-p-069",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 1,
    marks: 1,
    question:
      "A spring extends by $0.10\\,\\text{m}$ when a force of $5\\,\\text{N}$ is applied. Assuming it obeys Hooke's law, its spring constant is:",
    options: [
      { key: "A", text: "$0.02\\,\\text{N m}^{-1}$" },
      { key: "B", text: "$0.5\\,\\text{N m}^{-1}$" },
      { key: "C", text: "$5\\,\\text{N m}^{-1}$" },
      { key: "D", text: "$50\\,\\text{N m}^{-1}$" },
    ],
    answer: "D",
    solution:
      "$k=\\dfrac{F}{x}=\\dfrac{5}{0.10}=50\\,\\text{N m}^{-1}$.",
  },
  {
    id: "esat-p-070",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "An object is dropped from rest from a height of $5\\,\\text{m}$. Using energy conservation with $g=10\\,\\text{m s}^{-2}$ (no air resistance), its speed just before landing is:",
    options: [
      { key: "A", text: "$5\\,\\text{m s}^{-1}$" },
      { key: "B", text: "$10\\,\\text{m s}^{-1}$" },
      { key: "C", text: "$50\\,\\text{m s}^{-1}$" },
      { key: "D", text: "$100\\,\\text{m s}^{-1}$" },
    ],
    answer: "B",
    solution:
      "$mgh=\\tfrac12 mv^2\\Rightarrow v=\\sqrt{2gh}=\\sqrt{2\\times10\\times5}=\\sqrt{100}=10\\,\\text{m s}^{-1}$.",
  },
  {
    id: "esat-p-071",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 2,
    marks: 1,
    question:
      "Two perpendicular forces of $3\\,\\text{N}$ and $4\\,\\text{N}$ act on a point. The magnitude of their resultant is:",
    options: [
      { key: "A", text: "$1\\,\\text{N}$" },
      { key: "B", text: "$5\\,\\text{N}$" },
      { key: "C", text: "$7\\,\\text{N}$" },
      { key: "D", text: "$12\\,\\text{N}$" },
    ],
    answer: "B",
    solution:
      "For perpendicular vectors the resultant is $\\sqrt{3^2+4^2}=\\sqrt{25}=5\\,\\text{N}$.",
  },
  {
    id: "esat-p-072",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys1",
    difficulty: 3,
    marks: 1,
    question:
      "A person of mass $60\\,\\text{kg}$ stands on a bathroom scale inside a lift that accelerates upward at $2\\,\\text{m s}^{-2}$. Taking $g=10\\,\\text{m s}^{-2}$, the reading on the scale (the normal force) is:",
    options: [
      { key: "A", text: "$480\\,\\text{N}$" },
      { key: "B", text: "$600\\,\\text{N}$" },
      { key: "C", text: "$720\\,\\text{N}$" },
      { key: "D", text: "$120\\,\\text{N}$" },
    ],
    answer: "C",
    solution:
      "Newton's second law upward: $N-mg=ma\\Rightarrow N=m(g+a)=60\\times(10+2)=720\\,\\text{N}$ (apparent weight increases when accelerating up).",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-phys2 · 物理电磁学 补充 23 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_PHYS2_EXTRA: MCQQuestion[] = [
  {
    id: "esat-p-073",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "A potential difference of $12\\,\\text{V}$ is applied across a $4\\,\\Omega$ resistor. The current through it is:",
    options: [
      { key: "A", text: "$3\\,\\text{A}$" },
      { key: "B", text: "$48\\,\\text{A}$" },
      { key: "C", text: "$0.33\\,\\text{A}$" },
      { key: "D", text: "$8\\,\\text{A}$" },
    ],
    answer: "A",
    solution: "Ohm's law: $I=\\dfrac{V}{R}=\\dfrac{12}{4}=3\\,\\text{A}$.",
  },
  {
    id: "esat-p-074",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "Two resistors of $3\\,\\Omega$ and $6\\,\\Omega$ are connected in series. The total resistance is:",
    options: [
      { key: "A", text: "$2\\,\\Omega$" },
      { key: "B", text: "$4.5\\,\\Omega$" },
      { key: "C", text: "$9\\,\\Omega$" },
      { key: "D", text: "$18\\,\\Omega$" },
    ],
    answer: "C",
    solution: "In series resistances add: $R=3+6=9\\,\\Omega$.",
  },
  {
    id: "esat-p-075",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "Two resistors of $3\\,\\Omega$ and $6\\,\\Omega$ are connected in parallel. The combined resistance is:",
    options: [
      { key: "A", text: "$2\\,\\Omega$" },
      { key: "B", text: "$4.5\\,\\Omega$" },
      { key: "C", text: "$9\\,\\Omega$" },
      { key: "D", text: "$18\\,\\Omega$" },
    ],
    answer: "A",
    solution:
      "$\\dfrac{1}{R}=\\dfrac{1}{3}+\\dfrac{1}{6}=\\dfrac{2+1}{6}=\\dfrac{1}{2}$, so $R=2\\,\\Omega$ (parallel combination is always less than the smallest resistor).",
  },
  {
    id: "esat-p-076",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "A device operates at $12\\,\\text{V}$ and draws a current of $2\\,\\text{A}$. The power it dissipates is:",
    options: [
      { key: "A", text: "$6\\,\\text{W}$" },
      { key: "B", text: "$14\\,\\text{W}$" },
      { key: "C", text: "$24\\,\\text{W}$" },
      { key: "D", text: "$10\\,\\text{W}$" },
    ],
    answer: "C",
    solution: "$P=VI=12\\times2=24\\,\\text{W}$.",
  },
  {
    id: "esat-p-077",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A current of $2\\,\\text{A}$ flows through a $5\\,\\Omega$ resistor. The power dissipated is:",
    options: [
      { key: "A", text: "$2.5\\,\\text{W}$" },
      { key: "B", text: "$10\\,\\text{W}$" },
      { key: "C", text: "$20\\,\\text{W}$" },
      { key: "D", text: "$50\\,\\text{W}$" },
    ],
    answer: "C",
    solution: "$P=I^2R=2^2\\times5=4\\times5=20\\,\\text{W}$.",
  },
  {
    id: "esat-p-078",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A $6\\,\\Omega$ resistor has a potential difference of $12\\,\\text{V}$ across it. The power dissipated is:",
    options: [
      { key: "A", text: "$2\\,\\text{W}$" },
      { key: "B", text: "$24\\,\\text{W}$" },
      { key: "C", text: "$72\\,\\text{W}$" },
      { key: "D", text: "$144\\,\\text{W}$" },
    ],
    answer: "B",
    solution: "$P=\\dfrac{V^2}{R}=\\dfrac{12^2}{6}=\\dfrac{144}{6}=24\\,\\text{W}$.",
  },
  {
    id: "esat-p-079",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 1,
    question:
      "A cell of EMF $6\\,\\text{V}$ and internal resistance $0.5\\,\\Omega$ delivers a current of $2\\,\\text{A}$. The terminal potential difference (voltage available to the external circuit) is:",
    options: [
      { key: "A", text: "$5\\,\\text{V}$" },
      { key: "B", text: "$6\\,\\text{V}$" },
      { key: "C", text: "$7\\,\\text{V}$" },
      { key: "D", text: "$3\\,\\text{V}$" },
    ],
    answer: "A",
    solution:
      "Terminal p.d. $=\\varepsilon - Ir = 6 - (2)(0.5) = 6 - 1 = 5\\,\\text{V}$. The 'lost volts' $Ir$ are dropped across the internal resistance.",
  },
  {
    id: "esat-p-080",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "A current of $3\\,\\text{A}$ flows for $4\\,\\text{s}$. The charge that passes is:",
    options: [
      { key: "A", text: "$0.75\\,\\text{C}$" },
      { key: "B", text: "$7\\,\\text{C}$" },
      { key: "C", text: "$12\\,\\text{C}$" },
      { key: "D", text: "$1.33\\,\\text{C}$" },
    ],
    answer: "C",
    solution: "$Q=It=3\\times4=12\\,\\text{C}$.",
  },
  {
    id: "esat-p-081",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A $2\\,\\mu\\text{F}$ capacitor is charged to $10\\,\\text{V}$. The charge stored is:",
    options: [
      { key: "A", text: "$5\\,\\mu\\text{C}$" },
      { key: "B", text: "$20\\,\\mu\\text{C}$" },
      { key: "C", text: "$0.2\\,\\mu\\text{C}$" },
      { key: "D", text: "$12\\,\\mu\\text{C}$" },
    ],
    answer: "B",
    solution: "$Q=CV=2\\,\\mu\\text{F}\\times10\\,\\text{V}=20\\,\\mu\\text{C}$.",
  },
  {
    id: "esat-p-082",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 1,
    question:
      "A $2\\,\\mu\\text{F}$ capacitor is charged to $10\\,\\text{V}$. The energy stored is:",
    options: [
      { key: "A", text: "$1\\times10^{-4}\\,\\text{J}$" },
      { key: "B", text: "$2\\times10^{-4}\\,\\text{J}$" },
      { key: "C", text: "$1\\times10^{-2}\\,\\text{J}$" },
      { key: "D", text: "$2\\times10^{-5}\\,\\text{J}$" },
    ],
    answer: "A",
    solution:
      "$E=\\tfrac12 CV^2=\\tfrac12 (2\\times10^{-6})(10^2)=\\tfrac12(2\\times10^{-6})(100)=1\\times10^{-4}\\,\\text{J}$.",
  },
  {
    id: "esat-p-083",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "Two capacitors of $2\\,\\mu\\text{F}$ and $3\\,\\mu\\text{F}$ are connected in parallel. The total capacitance is:",
    options: [
      { key: "A", text: "$1.2\\,\\mu\\text{F}$" },
      { key: "B", text: "$1.5\\,\\mu\\text{F}$" },
      { key: "C", text: "$5\\,\\mu\\text{F}$" },
      { key: "D", text: "$6\\,\\mu\\text{F}$" },
    ],
    answer: "C",
    solution:
      "Capacitors in parallel add: $C=2+3=5\\,\\mu\\text{F}$ (note this is the opposite rule to resistors).",
  },
  {
    id: "esat-p-084",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 1,
    question:
      "Two $2\\,\\mu\\text{F}$ capacitors are connected in series. The combined capacitance is:",
    options: [
      { key: "A", text: "$1\\,\\mu\\text{F}$" },
      { key: "B", text: "$2\\,\\mu\\text{F}$" },
      { key: "C", text: "$4\\,\\mu\\text{F}$" },
      { key: "D", text: "$0.5\\,\\mu\\text{F}$" },
    ],
    answer: "A",
    solution:
      "$\\dfrac{1}{C}=\\dfrac{1}{2}+\\dfrac{1}{2}=1\\Rightarrow C=1\\,\\mu\\text{F}$ (series capacitors combine like parallel resistors).",
  },
  {
    id: "esat-p-085",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "Two parallel plates are $0.02\\,\\text{m}$ apart with a potential difference of $100\\,\\text{V}$ between them. The electric field strength between the plates is:",
    options: [
      { key: "A", text: "$2\\,\\text{V m}^{-1}$" },
      { key: "B", text: "$50\\,\\text{V m}^{-1}$" },
      { key: "C", text: "$5000\\,\\text{V m}^{-1}$" },
      { key: "D", text: "$0.0002\\,\\text{V m}^{-1}$" },
    ],
    answer: "C",
    solution:
      "For a uniform field between parallel plates $E=\\dfrac{V}{d}=\\dfrac{100}{0.02}=5000\\,\\text{V m}^{-1}$.",
  },
  {
    id: "esat-p-086",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A charge of $0.5\\,\\text{C}$ experiences a force of $10\\,\\text{N}$ in a uniform electric field. The electric field strength is:",
    options: [
      { key: "A", text: "$5\\,\\text{N C}^{-1}$" },
      { key: "B", text: "$10\\,\\text{N C}^{-1}$" },
      { key: "C", text: "$20\\,\\text{N C}^{-1}$" },
      { key: "D", text: "$0.05\\,\\text{N C}^{-1}$" },
    ],
    answer: "C",
    solution:
      "$E=\\dfrac{F}{Q}=\\dfrac{10}{0.5}=20\\,\\text{N C}^{-1}$.",
  },
  {
    id: "esat-p-087",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A straight wire of length $0.3\\,\\text{m}$ carries a current of $2\\,\\text{A}$ at right angles to a magnetic field of flux density $0.5\\,\\text{T}$. The force on the wire is:",
    options: [
      { key: "A", text: "$0.3\\,\\text{N}$" },
      { key: "B", text: "$0.83\\,\\text{N}$" },
      { key: "C", text: "$1.2\\,\\text{N}$" },
      { key: "D", text: "$3.3\\,\\text{N}$" },
    ],
    answer: "A",
    solution:
      "$F=BIL=0.5\\times2\\times0.3=0.3\\,\\text{N}$ (force is maximum when the wire is perpendicular to the field).",
  },
  {
    id: "esat-p-088",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A charge of $0.5\\,\\text{C}$ moves at $4\\,\\text{m s}^{-1}$ perpendicular to a magnetic field of $2\\,\\text{T}$. The magnetic force on the charge is:",
    options: [
      { key: "A", text: "$1\\,\\text{N}$" },
      { key: "B", text: "$4\\,\\text{N}$" },
      { key: "C", text: "$8\\,\\text{N}$" },
      { key: "D", text: "$16\\,\\text{N}$" },
    ],
    answer: "B",
    solution:
      "$F=BQv=2\\times0.5\\times4=4\\,\\text{N}$.",
  },
  {
    id: "esat-p-089",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "Which rule gives the direction of the force on a current-carrying conductor in a magnetic field?",
    options: [
      { key: "A", text: "Fleming's left-hand rule" },
      { key: "B", text: "Fleming's right-hand rule" },
      { key: "C", text: "Lenz's law" },
      { key: "D", text: "Ohm's law" },
    ],
    answer: "A",
    solution:
      "Fleming's left-hand rule (thuMb = Motion/force, First finger = Field, seCond finger = Current) gives the force direction (the motor effect). The right-hand rule is for induced current in a generator.",
  },
  {
    id: "esat-p-090",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "Faraday's law states that the magnitude of an induced EMF is proportional to the:",
    options: [
      { key: "A", text: "Magnetic flux through the circuit" },
      { key: "B", text: "Rate of change of magnetic flux linkage" },
      { key: "C", text: "Resistance of the circuit" },
      { key: "D", text: "Current in the circuit" },
    ],
    answer: "B",
    solution:
      "$\\varepsilon = -\\dfrac{d(N\\Phi)}{dt}$: the induced EMF equals the rate of change of flux linkage. A faster-changing flux (or more turns) gives a larger EMF.",
  },
  {
    id: "esat-p-091",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "Lenz's law states that the direction of an induced current is always such that it:",
    options: [
      { key: "A", text: "Increases the change in flux that caused it" },
      { key: "B", text: "Opposes the change in flux that caused it" },
      { key: "C", text: "Is independent of the change in flux" },
      { key: "D", text: "Flows only in the primary coil" },
    ],
    answer: "B",
    solution:
      "Lenz's law (the minus sign in Faraday's law) states the induced current opposes the change producing it — a consequence of conservation of energy.",
  },
  {
    id: "esat-p-092",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "An ideal transformer has 100 turns on its primary coil and 50 turns on its secondary. If the primary voltage is $240\\,\\text{V}$, the secondary voltage is:",
    options: [
      { key: "A", text: "$60\\,\\text{V}$" },
      { key: "B", text: "$120\\,\\text{V}$" },
      { key: "C", text: "$240\\,\\text{V}$" },
      { key: "D", text: "$480\\,\\text{V}$" },
    ],
    answer: "B",
    solution:
      "$\\dfrac{V_s}{V_p}=\\dfrac{N_s}{N_p}\\Rightarrow V_s=240\\times\\dfrac{50}{100}=120\\,\\text{V}$ (a step-down transformer).",
  },
  {
    id: "esat-p-093",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 1,
    marks: 1,
    question:
      "A transformer that has more turns on the secondary coil than on the primary is a:",
    options: [
      { key: "A", text: "Step-down transformer (decreases voltage)" },
      { key: "B", text: "Step-up transformer (increases voltage)" },
      { key: "C", text: "Transformer that changes the frequency" },
      { key: "D", text: "Transformer that works with direct current" },
    ],
    answer: "B",
    solution:
      "More secondary turns than primary gives $V_s>V_p$ — a step-up transformer. Transformers work only with alternating current and do not change the frequency.",
  },
  {
    id: "esat-p-094",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 3,
    marks: 1,
    question:
      "An ideal (100% efficient) transformer supplies $12\\,\\text{V}$ at $2\\,\\text{A}$ from its secondary. If the primary voltage is $240\\,\\text{V}$, the primary current is:",
    options: [
      { key: "A", text: "$0.1\\,\\text{A}$" },
      { key: "B", text: "$2\\,\\text{A}$" },
      { key: "C", text: "$40\\,\\text{A}$" },
      { key: "D", text: "$24\\,\\text{A}$" },
    ],
    answer: "A",
    solution:
      "For an ideal transformer input power = output power: $V_pI_p=V_sI_s$. So $I_p=\\dfrac{V_sI_s}{V_p}=\\dfrac{12\\times2}{240}=\\dfrac{24}{240}=0.1\\,\\text{A}$.",
  },
  {
    id: "esat-p-095",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys2",
    difficulty: 2,
    marks: 1,
    question:
      "A potential divider is made of two equal $1\\,\\text{k}\\Omega$ resistors in series across a $12\\,\\text{V}$ supply. The output voltage taken across one resistor is:",
    options: [
      { key: "A", text: "$3\\,\\text{V}$" },
      { key: "B", text: "$6\\,\\text{V}$" },
      { key: "C", text: "$12\\,\\text{V}$" },
      { key: "D", text: "$24\\,\\text{V}$" },
    ],
    answer: "B",
    solution:
      "$V_{out}=V_{in}\\times\\dfrac{R_2}{R_1+R_2}=12\\times\\dfrac{1}{1+1}=6\\,\\text{V}$ — the supply divides equally between equal resistors.",
  },
];

// 聚合（后续模块在此累加）
export const ESAT_TOPUP_QUESTIONS = [...ESAT_PHYS1_EXTRA, ...ESAT_PHYS2_EXTRA];
