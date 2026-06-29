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

// ════════════════════════════════════════════════════════════════════════
//  esat-phys3 · 物理波与现代物理 补充 25 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_PHYS3_EXTRA: MCQQuestion[] = [
  {
    id: "esat-p-096",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "A wave has a frequency of $50\\,\\text{Hz}$ and a wavelength of $4\\,\\text{m}$. Its speed is:",
    options: [
      { key: "A", text: "$12.5\\,\\text{m s}^{-1}$" },
      { key: "B", text: "$54\\,\\text{m s}^{-1}$" },
      { key: "C", text: "$200\\,\\text{m s}^{-1}$" },
      { key: "D", text: "$0.08\\,\\text{m s}^{-1}$" },
    ],
    answer: "C",
    solution: "$v=f\\lambda=50\\times4=200\\,\\text{m s}^{-1}$.",
  },
  {
    id: "esat-p-097",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "A wave has a frequency of $200\\,\\text{Hz}$. Its period is:",
    options: [
      { key: "A", text: "$200\\,\\text{s}$" },
      { key: "B", text: "$0.005\\,\\text{s}$" },
      { key: "C", text: "$0.05\\,\\text{s}$" },
      { key: "D", text: "$5\\,\\text{s}$" },
    ],
    answer: "B",
    solution: "$T=\\dfrac{1}{f}=\\dfrac{1}{200}=0.005\\,\\text{s}$.",
  },
  {
    id: "esat-p-098",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "Sound travels at $340\\,\\text{m s}^{-1}$ in air. The wavelength of a $170\\,\\text{Hz}$ sound wave is:",
    options: [
      { key: "A", text: "$0.5\\,\\text{m}$" },
      { key: "B", text: "$2\\,\\text{m}$" },
      { key: "C", text: "$510\\,\\text{m}$" },
      { key: "D", text: "$57\\,800\\,\\text{m}$" },
    ],
    answer: "B",
    solution: "$\\lambda=\\dfrac{v}{f}=\\dfrac{340}{170}=2\\,\\text{m}$.",
  },
  {
    id: "esat-p-099",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "Which of the following is a longitudinal wave?",
    options: [
      { key: "A", text: "A sound wave in air" },
      { key: "B", text: "A wave on a vibrating string" },
      { key: "C", text: "A light wave" },
      { key: "D", text: "A water surface ripple" },
    ],
    answer: "A",
    solution:
      "In a longitudinal wave the oscillations are parallel to the direction of travel (compressions and rarefactions) — this describes sound. The others are transverse.",
  },
  {
    id: "esat-p-100",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "Which part of the electromagnetic spectrum has the SHORTEST wavelength?",
    options: [
      { key: "A", text: "Radio waves" },
      { key: "B", text: "Visible light" },
      { key: "C", text: "Microwaves" },
      { key: "D", text: "Gamma rays" },
    ],
    answer: "D",
    solution:
      "The EM spectrum from longest to shortest wavelength: radio → microwave → infrared → visible → ultraviolet → X-ray → gamma. Gamma rays have the shortest wavelength (and highest frequency/energy).",
  },
  {
    id: "esat-p-101",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "All electromagnetic waves travel through a vacuum at the same speed, approximately:",
    options: [
      { key: "A", text: "$340\\,\\text{m s}^{-1}$" },
      { key: "B", text: "$1500\\,\\text{m s}^{-1}$" },
      { key: "C", text: "$3\\times10^{8}\\,\\text{m s}^{-1}$" },
      { key: "D", text: "$3\\times10^{6}\\,\\text{m s}^{-1}$" },
    ],
    answer: "C",
    solution:
      "All EM waves travel at the speed of light $c\\approx3\\times10^{8}\\,\\text{m s}^{-1}$ in a vacuum.",
  },
  {
    id: "esat-p-102",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "Diffraction of a wave through a gap is most pronounced when the gap width is:",
    options: [
      { key: "A", text: "Much larger than the wavelength" },
      { key: "B", text: "Approximately equal to the wavelength" },
      { key: "C", text: "Exactly zero" },
      { key: "D", text: "Much smaller than one wavelength" },
    ],
    answer: "B",
    solution:
      "The spreading (diffraction) is greatest when the gap is comparable in size to the wavelength. A very wide gap causes little spreading.",
  },
  {
    id: "esat-p-103",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "Two coherent sources emit waves in phase. Constructive interference (a maximum) occurs at a point where the path difference is:",
    options: [
      { key: "A", text: "A whole number of wavelengths ($n\\lambda$)" },
      { key: "B", text: "An odd number of half-wavelengths ($(n+\\tfrac12)\\lambda$)" },
      { key: "C", text: "Always zero" },
      { key: "D", text: "One quarter of a wavelength" },
    ],
    answer: "A",
    solution:
      "Waves arrive in phase and reinforce when the path difference is a whole number of wavelengths, $n\\lambda$, giving constructive interference.",
  },
  {
    id: "esat-p-104",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "For two in-phase coherent sources, destructive interference (a minimum) occurs where the path difference equals:",
    options: [
      { key: "A", text: "$n\\lambda$" },
      { key: "B", text: "$(n+\\tfrac12)\\lambda$" },
      { key: "C", text: "$2n\\lambda$" },
      { key: "D", text: "Zero only" },
    ],
    answer: "B",
    solution:
      "A path difference of an odd number of half-wavelengths, $(n+\\tfrac12)\\lambda$, makes the waves arrive exactly out of phase, cancelling — destructive interference.",
  },
  {
    id: "esat-p-105",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "A string of length $0.5\\,\\text{m}$ fixed at both ends vibrates in its fundamental (first harmonic) mode. The wavelength of the standing wave is:",
    options: [
      { key: "A", text: "$0.25\\,\\text{m}$" },
      { key: "B", text: "$0.5\\,\\text{m}$" },
      { key: "C", text: "$1\\,\\text{m}$" },
      { key: "D", text: "$2\\,\\text{m}$" },
    ],
    answer: "C",
    solution:
      "The fundamental has a node at each end and one antinode in the middle, so the string holds half a wavelength: $L=\\tfrac{\\lambda}{2}\\Rightarrow\\lambda=2L=2\\times0.5=1\\,\\text{m}$.",
  },
  {
    id: "esat-p-106",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "Taking the Planck constant $h=6.6\\times10^{-34}\\,\\text{J s}$, the energy of a photon of frequency $5\\times10^{14}\\,\\text{Hz}$ is:",
    options: [
      { key: "A", text: "$3.3\\times10^{-19}\\,\\text{J}$" },
      { key: "B", text: "$3.3\\times10^{-20}\\,\\text{J}$" },
      { key: "C", text: "$6.6\\times10^{-19}\\,\\text{J}$" },
      { key: "D", text: "$1.3\\times10^{-48}\\,\\text{J}$" },
    ],
    answer: "A",
    solution:
      "$E=hf=(6.6\\times10^{-34})(5\\times10^{14})=33\\times10^{-20}=3.3\\times10^{-19}\\,\\text{J}$.",
  },
  {
    id: "esat-p-107",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "For a photon, energy is related to wavelength by which expression ($h$ = Planck constant, $c$ = speed of light)?",
    options: [
      { key: "A", text: "$E=\\dfrac{hc}{\\lambda}$" },
      { key: "B", text: "$E=hc\\lambda$" },
      { key: "C", text: "$E=\\dfrac{\\lambda}{hc}$" },
      { key: "D", text: "$E=\\dfrac{h}{c\\lambda}$" },
    ],
    answer: "A",
    solution:
      "$E=hf$ and $c=f\\lambda$, so $f=\\dfrac{c}{\\lambda}$ and $E=\\dfrac{hc}{\\lambda}$ — shorter wavelength means higher photon energy.",
  },
  {
    id: "esat-p-108",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "In the photoelectric effect, increasing the INTENSITY of the incident light (keeping its frequency the same) increases:",
    options: [
      { key: "A", text: "The maximum kinetic energy of each emitted electron" },
      { key: "B", text: "The number of electrons emitted per second" },
      { key: "C", text: "The threshold frequency" },
      { key: "D", text: "The work function of the metal" },
    ],
    answer: "B",
    solution:
      "Higher intensity means more photons per second, so more electrons are released per second. The maximum KE of each electron depends only on the photon frequency (energy), not on intensity.",
  },
  {
    id: "esat-p-109",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "No electrons are emitted from a metal surface, however bright the light, unless the light's frequency exceeds a certain value. This value is the:",
    options: [
      { key: "A", text: "Threshold frequency" },
      { key: "B", text: "Resonant frequency" },
      { key: "C", text: "Fundamental frequency" },
      { key: "D", text: "Larmor frequency" },
    ],
    answer: "A",
    solution:
      "Each photon must carry at least the work function energy ($hf \\geq \\phi$) to free an electron. Below the threshold frequency, no single photon has enough energy, so no emission occurs no matter how intense the light — strong evidence for the particle (photon) model.",
  },
  {
    id: "esat-p-110",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "The photoelectric effect provides evidence that light behaves as:",
    options: [
      { key: "A", text: "A continuous wave only" },
      { key: "B", text: "A stream of particles (photons)" },
      { key: "C", text: "A sound wave" },
      { key: "D", text: "A magnetic field only" },
    ],
    answer: "B",
    solution:
      "The instantaneous emission and the existence of a threshold frequency cannot be explained by the wave model; they require light to come in discrete quanta (photons) — demonstrating wave–particle duality.",
  },
  {
    id: "esat-p-111",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "A hot gas emits a line spectrum (specific colours only) rather than a continuous spectrum because:",
    options: [
      { key: "A", text: "Electrons can have any energy in an atom" },
      { key: "B", text: "Electrons drop between discrete energy levels, emitting photons of specific energies" },
      { key: "C", text: "The gas is too cold" },
      { key: "D", text: "Photons have no energy" },
    ],
    answer: "B",
    solution:
      "Atomic electrons occupy discrete energy levels. When an electron falls from a higher to a lower level it emits a photon of energy $hf=E_2-E_1$. Only certain transitions are possible, so only certain frequencies (lines) appear.",
  },
  {
    id: "esat-p-112",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "An alpha particle is identical to:",
    options: [
      { key: "A", text: "An electron" },
      { key: "B", text: "A helium nucleus (2 protons + 2 neutrons)" },
      { key: "C", text: "A high-energy photon" },
      { key: "D", text: "A single proton" },
    ],
    answer: "B",
    solution:
      "An alpha particle is a helium-4 nucleus: 2 protons and 2 neutrons, charge $+2$, relatively massive and only weakly penetrating.",
  },
  {
    id: "esat-p-113",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "In beta-minus ($\\beta^-$) decay, what happens inside the nucleus?",
    options: [
      { key: "A", text: "A proton changes into a neutron, emitting a positron" },
      { key: "B", text: "A neutron changes into a proton, emitting an electron" },
      { key: "C", text: "Two protons and two neutrons are emitted together" },
      { key: "D", text: "A photon is emitted with no change in the nucleus" },
    ],
    answer: "B",
    solution:
      "In $\\beta^-$ decay a neutron becomes a proton, emitting a fast electron (the beta particle) and an antineutrino. The nucleon number is unchanged but the proton number increases by 1.",
  },
  {
    id: "esat-p-114",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "When a nucleus emits a gamma ray, its mass number and atomic number:",
    options: [
      { key: "A", text: "Both decrease by 2" },
      { key: "B", text: "Stay the same" },
      { key: "C", text: "Both increase by 1" },
      { key: "D", text: "The atomic number increases by 1" },
    ],
    answer: "B",
    solution:
      "A gamma ray is a high-energy photon carrying away energy but no mass or charge. The nucleus simply loses energy (de-excites); its mass number and atomic number are unchanged.",
  },
  {
    id: "esat-p-115",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "A radioactive source has an activity of $80\\,\\text{Bq}$. After 3 half-lives, its activity is:",
    options: [
      { key: "A", text: "$40\\,\\text{Bq}$" },
      { key: "B", text: "$27\\,\\text{Bq}$" },
      { key: "C", text: "$10\\,\\text{Bq}$" },
      { key: "D", text: "$0\\,\\text{Bq}$" },
    ],
    answer: "C",
    solution:
      "Each half-life halves the activity: $80\\to40\\to20\\to10\\,\\text{Bq}$ after three half-lives.",
  },
  {
    id: "esat-p-116",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "The activity of a sample falls from $800\\,\\text{Bq}$ to $100\\,\\text{Bq}$ in $30\\,\\text{minutes}$. The half-life of the source is:",
    options: [
      { key: "A", text: "$5\\,\\text{min}$" },
      { key: "B", text: "$10\\,\\text{min}$" },
      { key: "C", text: "$15\\,\\text{min}$" },
      { key: "D", text: "$30\\,\\text{min}$" },
    ],
    answer: "B",
    solution:
      "$800\\to400\\to200\\to100$ is 3 halvings. So 3 half-lives = 30 min, giving a half-life of $\\dfrac{30}{3}=10\\,\\text{min}$.",
  },
  {
    id: "esat-p-117",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 2,
    marks: 1,
    question:
      "Uranium-238 ($^{238}_{\\,92}\\text{U}$) decays by emitting an alpha particle. The resulting nucleus has:",
    options: [
      { key: "A", text: "Mass number 234, atomic number 90" },
      { key: "B", text: "Mass number 236, atomic number 91" },
      { key: "C", text: "Mass number 238, atomic number 90" },
      { key: "D", text: "Mass number 234, atomic number 92" },
    ],
    answer: "A",
    solution:
      "Alpha emission removes 2 protons and 2 neutrons: mass number $238-4=234$, atomic number $92-2=90$ (this is thorium-234).",
  },
  {
    id: "esat-p-118",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "In the nuclear equation $^{14}_{\\,6}\\text{C}\\rightarrow{}^{14}_{\\,7}\\text{N}+X$, the particle $X$ is:",
    options: [
      { key: "A", text: "An alpha particle" },
      { key: "B", text: "A beta-minus particle (electron)" },
      { key: "C", text: "A neutron" },
      { key: "D", text: "A gamma photon" },
    ],
    answer: "B",
    solution:
      "Mass number is unchanged (14 = 14) but the atomic number rises from 6 to 7. This is characteristic of $\\beta^-$ decay, in which a neutron converts to a proton and an electron is emitted.",
  },
  {
    id: "esat-p-119",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 1,
    marks: 1,
    question:
      "Which statement correctly describes nuclear fusion?",
    options: [
      { key: "A", text: "A heavy nucleus splits into smaller nuclei" },
      { key: "B", text: "Two light nuclei join to form a heavier nucleus, releasing energy" },
      { key: "C", text: "An electron is captured by a nucleus" },
      { key: "D", text: "A nucleus emits a gamma ray only" },
    ],
    answer: "B",
    solution:
      "Fusion joins light nuclei (e.g. hydrogen isotopes) into a heavier one, releasing energy — the process that powers stars such as the Sun. Splitting a heavy nucleus is fission.",
  },
  {
    id: "esat-p-120",
    type: "mcq",
    testId: "esat",
    topicId: "esat-phys3",
    difficulty: 3,
    marks: 1,
    question:
      "In a nuclear reaction a mass of $1\\times10^{-3}\\,\\text{kg}$ is converted entirely to energy. Using $E=mc^2$ with $c=3\\times10^{8}\\,\\text{m s}^{-1}$, the energy released is:",
    options: [
      { key: "A", text: "$3\\times10^{5}\\,\\text{J}$" },
      { key: "B", text: "$9\\times10^{13}\\,\\text{J}$" },
      { key: "C", text: "$9\\times10^{16}\\,\\text{J}$" },
      { key: "D", text: "$3\\times10^{8}\\,\\text{J}$" },
    ],
    answer: "B",
    solution:
      "$E=mc^2=(1\\times10^{-3})(3\\times10^{8})^2=(1\\times10^{-3})(9\\times10^{16})=9\\times10^{13}\\,\\text{J}$.",
  },
];

// 聚合（后续模块在此累加）
export const ESAT_TOPUP_QUESTIONS = [...ESAT_PHYS1_EXTRA, ...ESAT_PHYS2_EXTRA, ...ESAT_PHYS3_EXTRA];
