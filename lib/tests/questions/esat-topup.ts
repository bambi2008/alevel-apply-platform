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

// ════════════════════════════════════════════════════════════════════════
//  esat-chem1 · 化学原子结构与化学键 补充 20 题（达到 40）—— 5 选项
// ════════════════════════════════════════════════════════════════════════
export const ESAT_CHEM1_EXTRA: MCQQuestion[] = [
  {
    id: "esat-c-061",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question: "Which subatomic particle has no electric charge?",
    options: [
      { key: "A", text: "Proton" },
      { key: "B", text: "Neutron" },
      { key: "C", text: "Electron" },
      { key: "D", text: "Positron" },
      { key: "E", text: "Ion" },
    ],
    answer: "B",
    solution:
      "The neutron is electrically neutral. The proton carries +1 and the electron −1 (relative charges).",
  },
  {
    id: "esat-c-062",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question:
      "The atomic (proton) number of an element is equal to the number of:",
    options: [
      { key: "A", text: "Neutrons in the nucleus" },
      { key: "B", text: "Protons in the nucleus" },
      { key: "C", text: "Protons plus neutrons" },
      { key: "D", text: "Electron shells" },
      { key: "E", text: "Neutrons minus protons" },
    ],
    answer: "B",
    solution:
      "Atomic number = number of protons, which defines the element. Mass number = protons + neutrons.",
  },
  {
    id: "esat-c-063",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question: "Isotopes of an element have:",
    options: [
      { key: "A", text: "The same number of protons but different numbers of neutrons" },
      { key: "B", text: "The same number of neutrons but different numbers of protons" },
      { key: "C", text: "Different numbers of electrons and protons" },
      { key: "D", text: "Different atomic numbers" },
      { key: "E", text: "Different chemical symbols" },
    ],
    answer: "A",
    solution:
      "Isotopes have the same proton number (same element) but different numbers of neutrons, so different mass numbers. They have identical chemical properties.",
  },
  {
    id: "esat-c-064",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question:
      "How many neutrons are in an atom of sodium-23 (atomic number 11)?",
    options: [
      { key: "A", text: "11" },
      { key: "B", text: "12" },
      { key: "C", text: "23" },
      { key: "D", text: "34" },
      { key: "E", text: "1" },
    ],
    answer: "B",
    solution:
      "Neutrons = mass number − atomic number = 23 − 11 = 12.",
  },
  {
    id: "esat-c-065",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "The full electron configuration of a magnesium atom (atomic number 12) is:",
    options: [
      { key: "A", text: "1s² 2s² 2p⁶ 3s²" },
      { key: "B", text: "1s² 2s² 2p⁸" },
      { key: "C", text: "1s² 2s² 2p⁶ 3p²" },
      { key: "D", text: "1s² 2s² 2p⁶ 3s¹ 3p¹" },
      { key: "E", text: "1s² 2s² 2p⁶ 3s² 3p²" },
    ],
    answer: "A",
    solution:
      "Twelve electrons fill: 1s² (2), 2s² (2), 2p⁶ (6), 3s² (2) = 12. The 2p subshell holds a maximum of 6, so option B is impossible.",
  },
  {
    id: "esat-c-066",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "How many electrons does a sodium ion (Na⁺, atomic number 11) contain?",
    options: [
      { key: "A", text: "9" },
      { key: "B", text: "10" },
      { key: "C", text: "11" },
      { key: "D", text: "12" },
      { key: "E", text: "23" },
    ],
    answer: "B",
    solution:
      "A neutral Na atom has 11 electrons; losing one to form Na⁺ leaves 10 electrons (the same configuration as neon).",
  },
  {
    id: "esat-c-067",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "Which element would most readily form an ion with a 2+ charge?",
    options: [
      { key: "A", text: "Sodium (Group 1)" },
      { key: "B", text: "Magnesium (Group 2)" },
      { key: "C", text: "Chlorine (Group 17)" },
      { key: "D", text: "Argon (Group 18)" },
      { key: "E", text: "Fluorine (Group 17)" },
    ],
    answer: "B",
    solution:
      "Group 2 elements have two outer electrons and lose both to reach a noble-gas configuration, forming 2+ ions (e.g. Mg²⁺). Group 1 forms 1+; Groups 17 form 1− ions; argon is unreactive.",
  },
  {
    id: "esat-c-068",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question: "An ionic bond is best described as:",
    options: [
      { key: "A", text: "A shared pair of electrons between two atoms" },
      { key: "B", text: "The electrostatic attraction between oppositely charged ions" },
      { key: "C", text: "A sea of delocalised electrons around metal ions" },
      { key: "D", text: "A weak force between molecules" },
      { key: "E", text: "The attraction between two nuclei" },
    ],
    answer: "B",
    solution:
      "Ionic bonding is the strong electrostatic attraction between oppositely charged ions, formed by transfer of electrons (typically metal → non-metal).",
  },
  {
    id: "esat-c-069",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "Which property is characteristic of a typical ionic compound such as sodium chloride?",
    options: [
      { key: "A", text: "Low melting point" },
      { key: "B", text: "Conducts electricity when solid" },
      { key: "C", text: "High melting point and conducts when molten or dissolved" },
      { key: "D", text: "Is a gas at room temperature" },
      { key: "E", text: "Does not dissolve in any solvent" },
    ],
    answer: "C",
    solution:
      "Strong ionic attractions in a giant lattice give high melting points. Solids do not conduct (ions fixed), but when molten or dissolved the ions are free to move and carry charge.",
  },
  {
    id: "esat-c-070",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 1,
    marks: 1,
    question: "A covalent bond is formed by:",
    options: [
      { key: "A", text: "Transfer of electrons from one atom to another" },
      { key: "B", text: "Sharing of a pair of electrons between two atoms" },
      { key: "C", text: "Attraction between ions and delocalised electrons" },
      { key: "D", text: "Loss of electrons by both atoms" },
      { key: "E", text: "Attraction between two cations" },
    ],
    answer: "B",
    solution:
      "A covalent bond is a shared pair of electrons between two atoms (typically between non-metals), held by attraction of both nuclei to the shared pair.",
  },
  {
    id: "esat-c-071",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question: "Which substance contains covalent bonds?",
    options: [
      { key: "A", text: "Sodium chloride (NaCl)" },
      { key: "B", text: "Magnesium oxide (MgO)" },
      { key: "C", text: "Carbon dioxide (CO₂)" },
      { key: "D", text: "Potassium fluoride (KF)" },
      { key: "E", text: "Calcium chloride (CaCl₂)" },
    ],
    answer: "C",
    solution:
      "CO₂ is a molecule of two non-metals sharing electrons — covalent. The others are metal + non-metal combinations, which are ionic.",
  },
  {
    id: "esat-c-072",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question: "Metallic bonding is best described as:",
    options: [
      { key: "A", text: "Shared pairs of electrons between metal atoms" },
      { key: "B", text: "A lattice of positive metal ions in a 'sea' of delocalised electrons" },
      { key: "C", text: "Transfer of electrons forming a giant ionic lattice" },
      { key: "D", text: "Weak intermolecular forces between metal molecules" },
      { key: "E", text: "Attraction between neutral metal atoms only" },
    ],
    answer: "B",
    solution:
      "In a metal, atoms release their outer electrons to form a lattice of positive ions surrounded by a sea of delocalised electrons; the attraction between the ions and these electrons is the metallic bond.",
  },
  {
    id: "esat-c-073",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question: "Metals conduct electricity well because:",
    options: [
      { key: "A", text: "They contain ions that are free to move in the solid" },
      { key: "B", text: "They have delocalised electrons that are free to move and carry charge" },
      { key: "C", text: "Their covalent bonds break easily" },
      { key: "D", text: "They are made of molecules" },
      { key: "E", text: "They have a low density" },
    ],
    answer: "B",
    solution:
      "The delocalised (free) electrons in the metallic lattice can move through the structure when a voltage is applied, carrying an electric current. (Ionic solids do NOT conduct because their ions are fixed.)",
  },
  {
    id: "esat-c-074",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "What is the shape of a methane (CH₄) molecule, which has four bonding pairs and no lone pairs around the carbon?",
    options: [
      { key: "A", text: "Linear" },
      { key: "B", text: "Trigonal planar" },
      { key: "C", text: "Tetrahedral" },
      { key: "D", text: "Bent (V-shaped)" },
      { key: "E", text: "Trigonal pyramidal" },
    ],
    answer: "C",
    solution:
      "Four bonding pairs and no lone pairs arrange themselves as far apart as possible — a tetrahedron with bond angles of 109.5°.",
  },
  {
    id: "esat-c-075",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question: "What is the bond angle in a methane (CH₄) molecule?",
    options: [
      { key: "A", text: "90°" },
      { key: "B", text: "104.5°" },
      { key: "C", text: "107°" },
      { key: "D", text: "109.5°" },
      { key: "E", text: "120°" },
    ],
    answer: "D",
    solution:
      "A regular tetrahedral arrangement of four identical bonding pairs gives bond angles of 109.5°.",
  },
  {
    id: "esat-c-076",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question:
      "Carbon dioxide (O=C=O) has two double bonds and no lone pairs on the central carbon. Its shape is:",
    options: [
      { key: "A", text: "Bent, 104.5°" },
      { key: "B", text: "Linear, 180°" },
      { key: "C", text: "Tetrahedral, 109.5°" },
      { key: "D", text: "Trigonal pyramidal, 107°" },
      { key: "E", text: "Trigonal planar, 120°" },
    ],
    answer: "B",
    solution:
      "Two electron regions around the central carbon repel to point in opposite directions, giving a linear molecule with a bond angle of 180°.",
  },
  {
    id: "esat-c-077",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 3,
    marks: 1,
    question:
      "An ammonia molecule (NH₃) has three bonding pairs and one lone pair on nitrogen. Its shape and approximate bond angle are:",
    options: [
      { key: "A", text: "Trigonal planar, 120°" },
      { key: "B", text: "Tetrahedral, 109.5°" },
      { key: "C", text: "Trigonal pyramidal, 107°" },
      { key: "D", text: "Linear, 180°" },
      { key: "E", text: "Bent, 104.5°" },
    ],
    answer: "C",
    solution:
      "Four electron regions (3 bonding + 1 lone pair) are arranged tetrahedrally, but only the three bonded atoms define the shape — trigonal pyramidal. The lone pair repels slightly more, compressing the angle to about 107°.",
  },
  {
    id: "esat-c-078",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 3,
    marks: 1,
    question:
      "A water molecule (H₂O) has two bonding pairs and two lone pairs on oxygen. Its shape and approximate bond angle are:",
    options: [
      { key: "A", text: "Linear, 180°" },
      { key: "B", text: "Bent (V-shaped), 104.5°" },
      { key: "C", text: "Trigonal pyramidal, 107°" },
      { key: "D", text: "Tetrahedral, 109.5°" },
      { key: "E", text: "Trigonal planar, 120°" },
    ],
    answer: "B",
    solution:
      "Four electron regions (2 bonding + 2 lone pairs) are tetrahedrally arranged, but only the two O–H bonds define the visible shape — bent. The two lone pairs repel strongly, reducing the angle to about 104.5°.",
  },
  {
    id: "esat-c-079",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 3,
    marks: 1,
    question:
      "In VSEPR theory, the order of repulsion strength between electron pairs is:",
    options: [
      { key: "A", text: "bonding–bonding > lone–bonding > lone–lone" },
      { key: "B", text: "lone–lone > lone–bonding > bonding–bonding" },
      { key: "C", text: "all repulsions are equal" },
      { key: "D", text: "lone–bonding > lone–lone > bonding–bonding" },
      { key: "E", text: "bonding–bonding > lone–lone > lone–bonding" },
    ],
    answer: "B",
    solution:
      "Lone pairs are held closer to the central atom and are more diffuse, so lone-pair–lone-pair repulsion is greatest, then lone-pair–bonding-pair, then bonding-pair–bonding-pair. This is why lone pairs compress bond angles (e.g. NH₃ 107°, H₂O 104.5°).",
  },
  {
    id: "esat-c-080",
    type: "mcq",
    testId: "esat",
    topicId: "esat-chem1",
    difficulty: 2,
    marks: 1,
    question: "Which element is the most electronegative?",
    options: [
      { key: "A", text: "Fluorine" },
      { key: "B", text: "Oxygen" },
      { key: "C", text: "Chlorine" },
      { key: "D", text: "Carbon" },
      { key: "E", text: "Sodium" },
    ],
    answer: "A",
    solution:
      "Electronegativity increases across a period and up a group, peaking at fluorine (top right, excluding the noble gases) — the most electronegative element.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-chem2 · 化学有机化学 补充 20 题（达到 40）—— 5 选项
// ════════════════════════════════════════════════════════════════════════
export const ESAT_CHEM2_EXTRA: MCQQuestion[] = [
  {
    id: "esat-c-081", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "What is the general formula of the alkanes?",
    options: [
      { key: "A", text: "CₙH₂ₙ" }, { key: "B", text: "CₙH₂ₙ₊₂" }, { key: "C", text: "CₙH₂ₙ₋₂" },
      { key: "D", text: "CₙHₙ" }, { key: "E", text: "CₙH₂ₙ₊₁" },
    ],
    answer: "B",
    solution: "Alkanes are saturated hydrocarbons with the general formula CₙH₂ₙ₊₂ (e.g. methane CH₄, ethane C₂H₆).",
  },
  {
    id: "esat-c-082", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "What is the general formula of the alkenes?",
    options: [
      { key: "A", text: "CₙH₂ₙ₊₂" }, { key: "B", text: "CₙH₂ₙ" }, { key: "C", text: "CₙHₙ" },
      { key: "D", text: "CₙH₂ₙ₊₁" }, { key: "E", text: "CₙH₂ₙ₋₂" },
    ],
    answer: "B",
    solution: "Alkenes contain one C=C double bond and have the general formula CₙH₂ₙ (e.g. ethene C₂H₄).",
  },
  {
    id: "esat-c-083", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Which reagent is used to distinguish an alkene from an alkane, and what is the observation with the alkene?",
    options: [
      { key: "A", text: "Bromine water — stays orange" }, { key: "B", text: "Bromine water — decolourised (orange to colourless)" },
      { key: "C", text: "Limewater — turns milky" }, { key: "D", text: "Universal indicator — turns red" },
      { key: "E", text: "Sodium hydroxide — turns blue" },
    ],
    answer: "B",
    solution: "Alkenes undergo addition with bromine, decolourising orange bromine water to colourless. Alkanes (saturated) do not react, so the colour remains.",
  },
  {
    id: "esat-c-084", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "Which functional group is present in all alcohols?",
    options: [
      { key: "A", text: "−COOH" }, { key: "B", text: "−OH (hydroxyl)" }, { key: "C", text: "C=C" },
      { key: "D", text: "−CHO" }, { key: "E", text: "−NH₂" },
    ],
    answer: "B",
    solution: "Alcohols contain the hydroxyl group −OH (e.g. ethanol CH₃CH₂OH).",
  },
  {
    id: "esat-c-085", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "Which functional group characterises a carboxylic acid?",
    options: [
      { key: "A", text: "−OH" }, { key: "B", text: "−CHO" }, { key: "C", text: "−COOH (carboxyl)" },
      { key: "D", text: "C=C" }, { key: "E", text: "−O− (ether)" },
    ],
    answer: "C",
    solution: "Carboxylic acids contain the carboxyl group −COOH (e.g. ethanoic acid CH₃COOH).",
  },
  {
    id: "esat-c-086", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Reacting an alkene with hydrogen (in the presence of a nickel catalyst) to form an alkane is an example of:",
    options: [
      { key: "A", text: "Substitution" }, { key: "B", text: "Addition (hydrogenation)" }, { key: "C", text: "Elimination" },
      { key: "D", text: "Combustion" }, { key: "E", text: "Neutralisation" },
    ],
    answer: "B",
    solution: "The C=C double bond opens and a hydrogen atom adds to each carbon — an addition reaction (specifically hydrogenation).",
  },
  {
    id: "esat-c-087", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Alkanes react with chlorine in the presence of ultraviolet light. The type of reaction is:",
    options: [
      { key: "A", text: "Addition" }, { key: "B", text: "Free-radical substitution" }, { key: "C", text: "Oxidation" },
      { key: "D", text: "Polymerisation" }, { key: "E", text: "Hydration" },
    ],
    answer: "B",
    solution: "Saturated alkanes cannot add; UV light initiates a free-radical chain in which a hydrogen atom is substituted by a chlorine atom (e.g. CH₄ + Cl₂ → CH₃Cl + HCl).",
  },
  {
    id: "esat-c-088", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "The complete combustion of a hydrocarbon produces:",
    options: [
      { key: "A", text: "Carbon monoxide and hydrogen" }, { key: "B", text: "Carbon dioxide and water" },
      { key: "C", text: "Carbon and water" }, { key: "D", text: "Hydrogen and oxygen" }, { key: "E", text: "Carbon dioxide only" },
    ],
    answer: "B",
    solution: "Complete combustion (plenty of oxygen) oxidises all carbon to CO₂ and all hydrogen to H₂O.",
  },
  {
    id: "esat-c-089", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "How many structural isomers have the molecular formula C₄H₁₀?",
    options: [
      { key: "A", text: "1" }, { key: "B", text: "2" }, { key: "C", text: "3" }, { key: "D", text: "4" }, { key: "E", text: "5" },
    ],
    answer: "B",
    solution: "C₄H₁₀ has two isomers: butane (a straight chain) and methylpropane (2-methylpropane, a branched chain).",
  },
  {
    id: "esat-c-090", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "Which statement about an alkene is correct?",
    options: [
      { key: "A", text: "It is saturated and contains only single bonds" }, { key: "B", text: "It is unsaturated and contains a C=C double bond" },
      { key: "C", text: "It contains a triple bond" }, { key: "D", text: "It contains an −OH group" }, { key: "E", text: "It is an aromatic ring" },
    ],
    answer: "B",
    solution: "Alkenes are unsaturated hydrocarbons containing at least one carbon–carbon double bond (C=C).",
  },
  {
    id: "esat-c-091", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Members of a homologous series:",
    options: [
      { key: "A", text: "Have completely different chemical properties" }, { key: "B", text: "Differ from the next member by CH₂ and share similar chemical properties" },
      { key: "C", text: "All have the same molecular formula" }, { key: "D", text: "Always contain nitrogen" }, { key: "E", text: "Are all gases" },
    ],
    answer: "B",
    solution: "A homologous series has the same general formula and functional group; consecutive members differ by a CH₂ unit and show a gradual trend in physical properties but similar chemical reactions.",
  },
  {
    id: "esat-c-092", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "What is the name of the compound CH₃CH₂OH?",
    options: [
      { key: "A", text: "Methanol" }, { key: "B", text: "Ethanol" }, { key: "C", text: "Ethanoic acid" },
      { key: "D", text: "Ethane" }, { key: "E", text: "Propanol" },
    ],
    answer: "B",
    solution: "Two carbons (eth-) with an −OH group (-anol) gives ethanol.",
  },
  {
    id: "esat-c-093", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "A carboxylic acid reacts with an alcohol (with an acid catalyst) to form:",
    options: [
      { key: "A", text: "An ester and water" }, { key: "B", text: "An alkane and hydrogen" }, { key: "C", text: "A salt and water" },
      { key: "D", text: "An aldehyde only" }, { key: "E", text: "A polymer" },
    ],
    answer: "A",
    solution: "Esterification: carboxylic acid + alcohol ⇌ ester + water (e.g. ethanoic acid + ethanol → ethyl ethanoate + water).",
  },
  {
    id: "esat-c-094", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "Oxidising a primary alcohol with acidified potassium dichromate first produces an aldehyde, and on further oxidation gives:",
    options: [
      { key: "A", text: "A ketone" }, { key: "B", text: "A carboxylic acid" }, { key: "C", text: "An alkene" },
      { key: "D", text: "An ester" }, { key: "E", text: "An alkane" },
    ],
    answer: "B",
    solution: "Primary alcohol → aldehyde → carboxylic acid on continued oxidation. (Secondary alcohols oxidise to ketones, which resist further oxidation.)",
  },
  {
    id: "esat-c-095", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Many ethene molecules join together to form poly(ethene). This process is called:",
    options: [
      { key: "A", text: "Condensation polymerisation" }, { key: "B", text: "Addition polymerisation" }, { key: "C", text: "Cracking" },
      { key: "D", text: "Fractional distillation" }, { key: "E", text: "Hydrolysis" },
    ],
    answer: "B",
    solution: "Unsaturated monomers (alkenes) add together with no other product — addition polymerisation. The C=C bonds open to form the long saturated polymer chain.",
  },
  {
    id: "esat-c-096", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "Ethene reacts with steam in the presence of a phosphoric acid catalyst to form:",
    options: [
      { key: "A", text: "Ethane" }, { key: "B", text: "Ethanol" }, { key: "C", text: "Ethanoic acid" },
      { key: "D", text: "Poly(ethene)" }, { key: "E", text: "Chloroethane" },
    ],
    answer: "B",
    solution: "Hydration of ethene: CH₂=CH₂ + H₂O → CH₃CH₂OH (ethanol) — an industrial addition reaction.",
  },
  {
    id: "esat-c-097", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 3, marks: 1,
    question: "Large hydrocarbon molecules from crude oil are broken into smaller, more useful ones (including alkenes) by:",
    options: [
      { key: "A", text: "Fractional distillation" }, { key: "B", text: "Cracking" }, { key: "C", text: "Polymerisation" },
      { key: "D", text: "Esterification" }, { key: "E", text: "Neutralisation" },
    ],
    answer: "B",
    solution: "Cracking uses heat and a catalyst to split long-chain alkanes into shorter alkanes and alkenes, meeting demand for smaller fuels and reactive alkenes.",
  },
  {
    id: "esat-c-098", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "Crude oil is separated into useful fractions based on differences in boiling point by:",
    options: [
      { key: "A", text: "Filtration" }, { key: "B", text: "Fractional distillation" }, { key: "C", text: "Crystallisation" },
      { key: "D", text: "Chromatography" }, { key: "E", text: "Electrolysis" },
    ],
    answer: "B",
    solution: "Fractional distillation separates the hydrocarbons by boiling point in a fractionating column: smaller molecules with lower boiling points rise higher.",
  },
  {
    id: "esat-c-099", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 2, marks: 1,
    question: "The double bond in an alkene consists of:",
    options: [
      { key: "A", text: "Two sigma (σ) bonds" }, { key: "B", text: "One sigma (σ) bond and one pi (π) bond" }, { key: "C", text: "Two pi (π) bonds" },
      { key: "D", text: "One ionic and one covalent bond" }, { key: "E", text: "Three sigma bonds" },
    ],
    answer: "B",
    solution: "A C=C double bond is made of one σ bond (head-on overlap) and one π bond (sideways overlap of p-orbitals). The π bond makes alkenes reactive toward addition.",
  },
  {
    id: "esat-c-100", type: "mcq", testId: "esat", topicId: "esat-chem2", difficulty: 1, marks: 1,
    question: "What is the molecular formula of propane?",
    options: [
      { key: "A", text: "C₃H₆" }, { key: "B", text: "C₃H₈" }, { key: "C", text: "C₂H₆" },
      { key: "D", text: "C₃H₄" }, { key: "E", text: "C₄H₁₀" },
    ],
    answer: "B",
    solution: "Propane is an alkane with 3 carbons: CₙH₂ₙ₊₂ with n = 3 gives C₃H₈.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-chem3 · 化学物理化学 补充 20 题（达到 40）—— 5 选项
// ════════════════════════════════════════════════════════════════════════
export const ESAT_CHEM3_EXTRA: MCQQuestion[] = [
  {
    id: "esat-c-101", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "An exothermic reaction is one that:",
    options: [
      { key: "A", text: "Absorbs heat; ΔH is positive" }, { key: "B", text: "Releases heat; ΔH is negative" },
      { key: "C", text: "Neither absorbs nor releases heat" }, { key: "D", text: "Always produces a gas" }, { key: "E", text: "Has ΔH = 0" },
    ],
    answer: "B",
    solution: "Exothermic reactions transfer heat to the surroundings, so the products have lower enthalpy than the reactants and ΔH is negative.",
  },
  {
    id: "esat-c-102", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "An endothermic reaction has an enthalpy change ΔH that is:",
    options: [
      { key: "A", text: "Negative" }, { key: "B", text: "Positive" }, { key: "C", text: "Zero" },
      { key: "D", text: "Always 100 kJ" }, { key: "E", text: "Imaginary" },
    ],
    answer: "B",
    solution: "Endothermic reactions absorb heat from the surroundings; the products have higher enthalpy than the reactants, so ΔH is positive.",
  },
  {
    id: "esat-c-103", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "The pH of a solution with hydrogen-ion concentration $[\\text{H}^+] = 1\\times10^{-2}\\,\\text{mol dm}^{-3}$ is:",
    options: [
      { key: "A", text: "1" }, { key: "B", text: "2" }, { key: "C", text: "7" }, { key: "D", text: "12" }, { key: "E", text: "0.01" },
    ],
    answer: "B",
    solution: "$\\text{pH}=-\\log_{10}[\\text{H}^+]=-\\log_{10}(10^{-2})=2$.",
  },
  {
    id: "esat-c-104", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "A solution has pH 3. Its hydrogen-ion concentration is:",
    options: [
      { key: "A", text: "$3\\,\\text{mol dm}^{-3}$" }, { key: "B", text: "$1\\times10^{-3}\\,\\text{mol dm}^{-3}$" },
      { key: "C", text: "$1\\times10^{3}\\,\\text{mol dm}^{-3}$" }, { key: "D", text: "$30\\,\\text{mol dm}^{-3}$" }, { key: "E", text: "$1\\times10^{-11}\\,\\text{mol dm}^{-3}$" },
    ],
    answer: "B",
    solution: "$[\\text{H}^+]=10^{-\\text{pH}}=10^{-3}\\,\\text{mol dm}^{-3}$.",
  },
  {
    id: "esat-c-105", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "At 25 °C, a neutral aqueous solution has a pH of:",
    options: [
      { key: "A", text: "0" }, { key: "B", text: "1" }, { key: "C", text: "7" }, { key: "D", text: "14" }, { key: "E", text: "10" },
    ],
    answer: "C",
    solution: "In pure water at 25 °C, $[\\text{H}^+]=[\\text{OH}^-]=10^{-7}\\,\\text{mol dm}^{-3}$, giving pH 7 (neutral).",
  },
  {
    id: "esat-c-106", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "A strong acid differs from a weak acid in that a strong acid:",
    options: [
      { key: "A", text: "Is always more concentrated" }, { key: "B", text: "Fully dissociates (ionises) in water" },
      { key: "C", text: "Does not contain hydrogen" }, { key: "D", text: "Has a higher pH" }, { key: "E", text: "Cannot be neutralised" },
    ],
    answer: "B",
    solution: "A strong acid ionises completely in water (e.g. HCl), giving a high [H⁺]. A weak acid only partially ionises (e.g. ethanoic acid). Strength is about degree of dissociation, not concentration.",
  },
  {
    id: "esat-c-107", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "Neutralisation of an acid by an alkali produces:",
    options: [
      { key: "A", text: "A salt and water" }, { key: "B", text: "A salt and hydrogen" }, { key: "C", text: "Carbon dioxide only" },
      { key: "D", text: "An acid and a base" }, { key: "E", text: "Hydrogen and oxygen" },
    ],
    answer: "A",
    solution: "Acid + alkali → salt + water (e.g. HCl + NaOH → NaCl + H₂O); the essential reaction is H⁺ + OH⁻ → H₂O.",
  },
  {
    id: "esat-c-108", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "For an equilibrium of gases, increasing the total pressure shifts the position of equilibrium toward the side with:",
    options: [
      { key: "A", text: "More moles of gas" }, { key: "B", text: "Fewer moles of gas" }, { key: "C", text: "More solid" },
      { key: "D", text: "Higher temperature" }, { key: "E", text: "No change ever" },
    ],
    answer: "B",
    solution: "By Le Chatelier's principle, raising the pressure favours the side with fewer gas molecules, reducing the pressure to oppose the change.",
  },
  {
    id: "esat-c-109", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 3, marks: 1,
    question: "For the exothermic equilibrium N₂ + 3H₂ ⇌ 2NH₃ (ΔH negative), increasing the temperature will:",
    options: [
      { key: "A", text: "Shift equilibrium to the right, increasing yield of NH₃" }, { key: "B", text: "Shift equilibrium to the left, decreasing yield of NH₃" },
      { key: "C", text: "Have no effect on the position" }, { key: "D", text: "Stop the reaction entirely" }, { key: "E", text: "Convert NH₃ to a solid" },
    ],
    answer: "B",
    solution: "Raising the temperature favours the endothermic direction (the reverse here), so the equilibrium shifts left and the yield of ammonia falls — though the rate increases.",
  },
  {
    id: "esat-c-110", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Adding a catalyst to a reaction at equilibrium:",
    options: [
      { key: "A", text: "Shifts the equilibrium to the right" }, { key: "B", text: "Shifts the equilibrium to the left" },
      { key: "C", text: "Speeds up the forward and reverse reactions equally, so the position is unchanged" }, { key: "D", text: "Increases the yield of product" }, { key: "E", text: "Changes the value of the equilibrium constant" },
    ],
    answer: "C",
    solution: "A catalyst lowers the activation energy for both directions equally, so equilibrium is reached faster but the position (and Kc) is unchanged.",
  },
  {
    id: "esat-c-111", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "In terms of electrons, oxidation is defined as:",
    options: [
      { key: "A", text: "Gain of electrons" }, { key: "B", text: "Loss of electrons" }, { key: "C", text: "Gain of protons" },
      { key: "D", text: "Loss of neutrons" }, { key: "E", text: "Gain of hydrogen" },
    ],
    answer: "B",
    solution: "OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain. Oxidation increases the oxidation number.",
  },
  {
    id: "esat-c-112", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 1, marks: 1,
    question: "Reduction is defined as the:",
    options: [
      { key: "A", text: "Loss of electrons" }, { key: "B", text: "Gain of electrons" }, { key: "C", text: "Loss of protons" },
      { key: "D", text: "Gain of oxygen" }, { key: "E", text: "Loss of mass" },
    ],
    answer: "B",
    solution: "Reduction Is Gain of electrons (RIG), which decreases the oxidation number of the species.",
  },
  {
    id: "esat-c-113", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 3, marks: 1,
    question: "An oxidising agent is a species that:",
    options: [
      { key: "A", text: "Loses electrons and is oxidised" }, { key: "B", text: "Gains electrons and is itself reduced" },
      { key: "C", text: "Is always an acid" }, { key: "D", text: "Cannot take part in redox reactions" }, { key: "E", text: "Always contains oxygen" },
    ],
    answer: "B",
    solution: "An oxidising agent oxidises something else by removing its electrons; in doing so it gains those electrons and is itself reduced.",
  },
  {
    id: "esat-c-114", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "What is the oxidation number of sulfur in the sulfate ion, SO₄²⁻? (oxygen = −2)",
    options: [
      { key: "A", text: "+2" }, { key: "B", text: "+4" }, { key: "C", text: "+6" }, { key: "D", text: "−2" }, { key: "E", text: "0" },
    ],
    answer: "C",
    solution: "Let S = x. Four oxygens contribute 4(−2) = −8, and the overall charge is −2: x + (−8) = −2 ⇒ x = +6.",
  },
  {
    id: "esat-c-115", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Which change would NOT increase the rate of a reaction between a solid and a solution?",
    options: [
      { key: "A", text: "Increasing the temperature" }, { key: "B", text: "Increasing the concentration of the solution" },
      { key: "C", text: "Grinding the solid into a powder" }, { key: "D", text: "Adding a catalyst" }, { key: "E", text: "Cooling the mixture down" },
    ],
    answer: "E",
    solution: "Higher temperature, higher concentration, larger surface area and a catalyst all increase the rate. Cooling reduces the frequency and energy of collisions, slowing the reaction.",
  },
  {
    id: "esat-c-116", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "Activation energy is best described as the:",
    options: [
      { key: "A", text: "Energy released by a reaction" }, { key: "B", text: "Minimum energy colliding particles need to react" },
      { key: "C", text: "Total energy of the products" }, { key: "D", text: "Energy of the catalyst" }, { key: "E", text: "Energy stored in the products" },
    ],
    answer: "B",
    solution: "Activation energy is the minimum energy that colliding particles must possess for a successful reaction. A catalyst provides an alternative pathway with a lower activation energy.",
  },
  {
    id: "esat-c-117", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "For a reversible reaction at dynamic equilibrium in a closed system:",
    options: [
      { key: "A", text: "The forward and reverse reactions have stopped" }, { key: "B", text: "The forward and reverse reactions occur at equal rates, so concentrations stay constant" },
      { key: "C", text: "All reactants have been used up" }, { key: "D", text: "Only the forward reaction occurs" }, { key: "E", text: "The temperature must be 0 °C" },
    ],
    answer: "B",
    solution: "At dynamic equilibrium both reactions continue, but at equal rates, so the concentrations of reactants and products remain constant (not necessarily equal).",
  },
  {
    id: "esat-c-118", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 3, marks: 1,
    question: "For the equilibrium A + B ⇌ C + D, adding more A (at constant temperature) will:",
    options: [
      { key: "A", text: "Shift the equilibrium to the left" }, { key: "B", text: "Shift the equilibrium to the right, making more C and D" },
      { key: "C", text: "Have no effect" }, { key: "D", text: "Decrease the amount of C" }, { key: "E", text: "Change the temperature" },
    ],
    answer: "B",
    solution: "By Le Chatelier's principle, increasing a reactant's concentration drives the equilibrium toward the products to oppose the change, forming more C and D.",
  },
  {
    id: "esat-c-119", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 3, marks: 1,
    question: "Using bond energies, the enthalpy change of a reaction is calculated as:",
    options: [
      { key: "A", text: "(bonds formed) − (bonds broken)" }, { key: "B", text: "(bonds broken) − (bonds formed)" },
      { key: "C", text: "(bonds broken) + (bonds formed)" }, { key: "D", text: "(bonds broken) × (bonds formed)" }, { key: "E", text: "always zero" },
    ],
    answer: "B",
    solution: "ΔH = energy to break bonds (endothermic, +) − energy released forming bonds (exothermic, −). If more energy is released than absorbed, ΔH is negative (exothermic).",
  },
  {
    id: "esat-c-120", type: "mcq", testId: "esat", topicId: "esat-chem3", difficulty: 2, marks: 1,
    question: "During electrolysis of molten sodium chloride, sodium metal is produced at the cathode because sodium ions:",
    options: [
      { key: "A", text: "Lose electrons (are oxidised)" }, { key: "B", text: "Gain electrons (are reduced)" },
      { key: "C", text: "Are attracted to the anode" }, { key: "D", text: "Form chlorine gas" }, { key: "E", text: "Do not move" },
    ],
    answer: "B",
    solution: "Positive Na⁺ ions migrate to the negative cathode, where they gain electrons (reduction): Na⁺ + e⁻ → Na. Chloride ions are oxidised at the anode to form chlorine.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-math1 · 数学1 代数与函数 补充 15 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_MATH1_EXTRA: MCQQuestion[] = [
  {
    id: "esat-m-076", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "If $x+y=5$ and $x-y=1$, find the value of $xy$.",
    options: [ { key: "A", text: "$4$" }, { key: "B", text: "$5$" }, { key: "C", text: "$6$" }, { key: "D", text: "$8$" } ],
    answer: "C",
    solution: "Adding: $2x=6\\Rightarrow x=3$; then $y=2$. So $xy=3\\times2=6$.",
  },
  {
    id: "esat-m-077", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "How many real roots does $2x^2-4x+5=0$ have?",
    options: [ { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" }, { key: "D", text: "infinitely many" } ],
    answer: "A",
    solution: "Discriminant $b^2-4ac=(-4)^2-4(2)(5)=16-40=-24<0$, so there are no real roots.",
  },
  {
    id: "esat-m-078", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "The larger root of $x^2-5x+6=0$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$2$" }, { key: "C", text: "$3$" }, { key: "D", text: "$6$" } ],
    answer: "C",
    solution: "$x^2-5x+6=(x-2)(x-3)=0$, so $x=2$ or $x=3$. The larger root is $3$.",
  },
  {
    id: "esat-m-079", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "What is the coefficient of $x^2$ in the expansion of $(1+x)^5$?",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$10$" }, { key: "C", text: "$15$" }, { key: "D", text: "$20$" } ],
    answer: "B",
    solution: "The coefficient is $\\binom{5}{2}=\\dfrac{5\\times4}{2}=10$.",
  },
  {
    id: "esat-m-080", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "By completing the square, the minimum value of $x^2+6x+5$ is:",
    options: [ { key: "A", text: "$-9$" }, { key: "B", text: "$-4$" }, { key: "C", text: "$5$" }, { key: "D", text: "$-13$" } ],
    answer: "B",
    solution: "$x^2+6x+5=(x+3)^2-9+5=(x+3)^2-4$. The minimum value is $-4$ (at $x=-3$).",
  },
  {
    id: "esat-m-081", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The solution of the inequality $x^2-9>0$ is:",
    options: [ { key: "A", text: "$-3<x<3$" }, { key: "B", text: "$x>3$ only" }, { key: "C", text: "$x<-3$ or $x>3$" }, { key: "D", text: "$x>9$" } ],
    answer: "C",
    solution: "$x^2>9\\Rightarrow|x|>3$, i.e. $x<-3$ or $x>3$.",
  },
  {
    id: "esat-m-082", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The graph of $y=f(x)$ is transformed to $y=f(x-2)$. This is a translation of:",
    options: [ { key: "A", text: "$2$ units to the right" }, { key: "B", text: "$2$ units to the left" }, { key: "C", text: "$2$ units up" }, { key: "D", text: "$2$ units down" } ],
    answer: "A",
    solution: "Replacing $x$ with $x-2$ shifts the graph $2$ units in the positive $x$-direction (to the right).",
  },
  {
    id: "esat-m-083", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $f(x)=2x+1$ and $g(x)=x^2$, what is $f(g(3))$?",
    options: [ { key: "A", text: "$7$" }, { key: "B", text: "$19$" }, { key: "C", text: "$37$" }, { key: "D", text: "$49$" } ],
    answer: "B",
    solution: "$g(3)=9$, then $f(9)=2(9)+1=19$.",
  },
  {
    id: "esat-m-084", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Using the remainder theorem, the remainder when $x^3-2x+1$ is divided by $(x-2)$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$5$" }, { key: "C", text: "$9$" }, { key: "D", text: "$13$" } ],
    answer: "B",
    solution: "Substitute $x=2$: $2^3-2(2)+1=8-4+1=5$.",
  },
  {
    id: "esat-m-085", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The roots of $x^2-px+q=0$ are $2$ and $3$. The value of $p+q$ is:",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$6$" }, { key: "C", text: "$11$" }, { key: "D", text: "$1$" } ],
    answer: "C",
    solution: "By Vieta's formulae $p=$ sum $=2+3=5$ and $q=$ product $=2\\times3=6$, so $p+q=11$.",
  },
  {
    id: "esat-m-086", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Simplify $x^5\\times x^3 \\div x^2$.",
    options: [ { key: "A", text: "$x^{5}$" }, { key: "B", text: "$x^{6}$" }, { key: "C", text: "$x^{7}$" }, { key: "D", text: "$x^{10}$" } ],
    answer: "B",
    solution: "Add and subtract indices: $x^{5+3-2}=x^{6}$.",
  },
  {
    id: "esat-m-087", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Simplify $\\sqrt{50}$.",
    options: [ { key: "A", text: "$2\\sqrt{5}$" }, { key: "B", text: "$5\\sqrt{2}$" }, { key: "C", text: "$25\\sqrt{2}$" }, { key: "D", text: "$10\\sqrt{5}$" } ],
    answer: "B",
    solution: "$\\sqrt{50}=\\sqrt{25\\times2}=5\\sqrt{2}$.",
  },
  {
    id: "esat-m-088", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The sum of the solutions of $|2x-1|=5$ is:",
    options: [ { key: "A", text: "$-2$" }, { key: "B", text: "$1$" }, { key: "C", text: "$3$" }, { key: "D", text: "$5$" } ],
    answer: "B",
    solution: "$2x-1=5\\Rightarrow x=3$; $2x-1=-5\\Rightarrow x=-2$. Sum $=3+(-2)=1$.",
  },
  {
    id: "esat-m-089", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "The coefficient of $x^3$ in the expansion of $(1+x)^4$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$4$" }, { key: "C", text: "$6$" }, { key: "D", text: "$12$" } ],
    answer: "B",
    solution: "The coefficient is $\\binom{4}{3}=4$.",
  },
  {
    id: "esat-m-090", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Which of the following is a factor of $x^2-5x+6$?",
    options: [ { key: "A", text: "$(x-1)$" }, { key: "B", text: "$(x+2)$" }, { key: "C", text: "$(x-3)$" }, { key: "D", text: "$(x-6)$" } ],
    answer: "C",
    solution: "$x^2-5x+6=(x-2)(x-3)$, so $(x-3)$ is a factor.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-math2 · 数学1 微积分 补充 16 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_MATH2_EXTRA: MCQQuestion[] = [
  {
    id: "esat-m-091", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "What is $\\dfrac{d}{dx}(x^3)$?",
    options: [ { key: "A", text: "$x^2$" }, { key: "B", text: "$3x^2$" }, { key: "C", text: "$3x$" }, { key: "D", text: "$\\tfrac{1}{4}x^4$" } ],
    answer: "B",
    solution: "By the power rule, $\\dfrac{d}{dx}(x^n)=nx^{n-1}$, so $\\dfrac{d}{dx}(x^3)=3x^2$.",
  },
  {
    id: "esat-m-092", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "If $y=x^4$, the value of $\\dfrac{dy}{dx}$ at $x=2$ is:",
    options: [ { key: "A", text: "$8$" }, { key: "B", text: "$16$" }, { key: "C", text: "$32$" }, { key: "D", text: "$64$" } ],
    answer: "C",
    solution: "$\\dfrac{dy}{dx}=4x^3$. At $x=2$: $4(2)^3=4\\times8=32$.",
  },
  {
    id: "esat-m-093", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "Differentiate $3x^2+2x$ with respect to $x$.",
    options: [ { key: "A", text: "$6x+2$" }, { key: "B", text: "$3x+2$" }, { key: "C", text: "$6x$" }, { key: "D", text: "$5x$" } ],
    answer: "A",
    solution: "$\\dfrac{d}{dx}(3x^2+2x)=6x+2$.",
  },
  {
    id: "esat-m-094", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "What is $\\displaystyle\\int x^2\\,dx$?",
    options: [ { key: "A", text: "$2x+c$" }, { key: "B", text: "$\\tfrac{1}{3}x^3+c$" }, { key: "C", text: "$x^3+c$" }, { key: "D", text: "$3x^3+c$" } ],
    answer: "B",
    solution: "$\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+c$, so $\\int x^2\\,dx=\\dfrac{x^3}{3}+c$.",
  },
  {
    id: "esat-m-095", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Evaluate $\\displaystyle\\int_0^3 2x\\,dx$.",
    options: [ { key: "A", text: "$6$" }, { key: "B", text: "$9$" }, { key: "C", text: "$12$" }, { key: "D", text: "$18$" } ],
    answer: "B",
    solution: "$\\int 2x\\,dx=x^2$. Evaluating from $0$ to $3$: $3^2-0^2=9$.",
  },
  {
    id: "esat-m-096", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "The gradient of the curve $y=x^2$ at the point where $x=3$ is:",
    options: [ { key: "A", text: "$3$" }, { key: "B", text: "$6$" }, { key: "C", text: "$9$" }, { key: "D", text: "$2$" } ],
    answer: "B",
    solution: "$\\dfrac{dy}{dx}=2x$; at $x=3$ the gradient is $2(3)=6$.",
  },
  {
    id: "esat-m-097", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The curve $y=x^2-4x$ has a stationary point at $x=$ :",
    options: [ { key: "A", text: "$0$" }, { key: "B", text: "$2$" }, { key: "C", text: "$4$" }, { key: "D", text: "$-2$" } ],
    answer: "B",
    solution: "$\\dfrac{dy}{dx}=2x-4=0\\Rightarrow x=2$.",
  },
  {
    id: "esat-m-098", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "For $y=x^2-4x$, the stationary point at $x=2$ is a:",
    options: [ { key: "A", text: "Maximum" }, { key: "B", text: "Minimum" }, { key: "C", text: "Point of inflection" }, { key: "D", text: "Discontinuity" } ],
    answer: "B",
    solution: "$\\dfrac{d^2y}{dx^2}=2>0$, so the curve is concave up and the stationary point is a minimum.",
  },
  {
    id: "esat-m-099", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "What is $\\displaystyle\\int 3x^2\\,dx$?",
    options: [ { key: "A", text: "$6x+c$" }, { key: "B", text: "$x^3+c$" }, { key: "C", text: "$3x^3+c$" }, { key: "D", text: "$\\tfrac{1}{3}x^3+c$" } ],
    answer: "B",
    solution: "$\\int 3x^2\\,dx=3\\cdot\\dfrac{x^3}{3}+c=x^3+c$.",
  },
  {
    id: "esat-m-100", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "The area under the curve $y=x^2$ between $x=0$ and $x=2$ is:",
    options: [ { key: "A", text: "$\\tfrac{4}{3}$" }, { key: "B", text: "$\\tfrac{8}{3}$" }, { key: "C", text: "$4$" }, { key: "D", text: "$8$" } ],
    answer: "B",
    solution: "$\\displaystyle\\int_0^2 x^2\\,dx=\\left[\\dfrac{x^3}{3}\\right]_0^2=\\dfrac{8}{3}$.",
  },
  {
    id: "esat-m-101", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "Differentiate $x^5-x$ with respect to $x$.",
    options: [ { key: "A", text: "$5x^4-1$" }, { key: "B", text: "$5x^4$" }, { key: "C", text: "$x^4-1$" }, { key: "D", text: "$5x^4-x$" } ],
    answer: "A",
    solution: "$\\dfrac{d}{dx}(x^5-x)=5x^4-1$.",
  },
  {
    id: "esat-m-102", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Differentiate $2x^3-3x^2+x$ with respect to $x$.",
    options: [ { key: "A", text: "$6x^2-6x+1$" }, { key: "B", text: "$6x^2-3x+1$" }, { key: "C", text: "$2x^2-6x$" }, { key: "D", text: "$6x^2-6x$" } ],
    answer: "A",
    solution: "Term by term: $\\dfrac{d}{dx}(2x^3-3x^2+x)=6x^2-6x+1$.",
  },
  {
    id: "esat-m-103", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "A particle has displacement $s=t^3$ metres at time $t$ seconds. Its velocity at $t=2\\,\\text{s}$ is:",
    options: [ { key: "A", text: "$6\\,\\text{m s}^{-1}$" }, { key: "B", text: "$8\\,\\text{m s}^{-1}$" }, { key: "C", text: "$12\\,\\text{m s}^{-1}$" }, { key: "D", text: "$3\\,\\text{m s}^{-1}$" } ],
    answer: "C",
    solution: "Velocity $v=\\dfrac{ds}{dt}=3t^2$. At $t=2$: $3(2)^2=12\\,\\text{m s}^{-1}$.",
  },
  {
    id: "esat-m-104", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "A particle has velocity $v=t^2+2t$ ms⁻¹ at time $t$ seconds. Its acceleration at $t=3\\,\\text{s}$ is:",
    options: [ { key: "A", text: "$6\\,\\text{m s}^{-2}$" }, { key: "B", text: "$8\\,\\text{m s}^{-2}$" }, { key: "C", text: "$15\\,\\text{m s}^{-2}$" }, { key: "D", text: "$11\\,\\text{m s}^{-2}$" } ],
    answer: "B",
    solution: "Acceleration $a=\\dfrac{dv}{dt}=2t+2$. At $t=3$: $2(3)+2=8\\,\\text{m s}^{-2}$.",
  },
  {
    id: "esat-m-105", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 1, marks: 1,
    question: "What is $\\displaystyle\\int 4x^3\\,dx$?",
    options: [ { key: "A", text: "$12x^2+c$" }, { key: "B", text: "$x^4+c$" }, { key: "C", text: "$4x^4+c$" }, { key: "D", text: "$x^4$" } ],
    answer: "B",
    solution: "$\\int 4x^3\\,dx=4\\cdot\\dfrac{x^4}{4}+c=x^4+c$.",
  },
  {
    id: "esat-m-106", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "Evaluate $\\displaystyle\\int_1^2 x^2\\,dx$.",
    options: [ { key: "A", text: "$\\tfrac{7}{3}$" }, { key: "B", text: "$\\tfrac{8}{3}$" }, { key: "C", text: "$3$" }, { key: "D", text: "$\\tfrac{1}{3}$" } ],
    answer: "A",
    solution: "$\\left[\\dfrac{x^3}{3}\\right]_1^2=\\dfrac{8}{3}-\\dfrac{1}{3}=\\dfrac{7}{3}$.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-math3 · 数学1 几何与数列 补充 14 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_MATH3_EXTRA: MCQQuestion[] = [
  {
    id: "esat-m-107", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The distance between the points $(0,0)$ and $(3,4)$ is:",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$7$" }, { key: "C", text: "$12$" }, { key: "D", text: "$25$" } ],
    answer: "A",
    solution: "Distance $=\\sqrt{3^2+4^2}=\\sqrt{25}=5$.",
  },
  {
    id: "esat-m-108", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The midpoint of the line segment joining $(2,4)$ and $(6,8)$ is:",
    options: [ { key: "A", text: "$(4,6)$" }, { key: "B", text: "$(8,12)$" }, { key: "C", text: "$(2,2)$" }, { key: "D", text: "$(3,6)$" } ],
    answer: "A",
    solution: "Midpoint $=\\left(\\dfrac{2+6}{2},\\dfrac{4+8}{2}\\right)=(4,6)$.",
  },
  {
    id: "esat-m-109", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The gradient of the line through $(1,2)$ and $(3,6)$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$2$" }, { key: "C", text: "$3$" }, { key: "D", text: "$\\tfrac{1}{2}$" } ],
    answer: "B",
    solution: "Gradient $=\\dfrac{6-2}{3-1}=\\dfrac{4}{2}=2$.",
  },
  {
    id: "esat-m-110", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The equation of a circle centred at the origin with radius $5$ is:",
    options: [ { key: "A", text: "$x^2+y^2=5$" }, { key: "B", text: "$x^2+y^2=25$" }, { key: "C", text: "$x+y=5$" }, { key: "D", text: "$x^2+y^2=10$" } ],
    answer: "B",
    solution: "A circle centred at the origin of radius $r$ is $x^2+y^2=r^2$, so $x^2+y^2=25$.",
  },
  {
    id: "esat-m-111", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The circle $(x-2)^2+(y+1)^2=9$ has centre and radius:",
    options: [ { key: "A", text: "centre $(2,-1)$, radius $3$" }, { key: "B", text: "centre $(-2,1)$, radius $3$" }, { key: "C", text: "centre $(2,-1)$, radius $9$" }, { key: "D", text: "centre $(2,1)$, radius $9$" } ],
    answer: "A",
    solution: "Comparing with $(x-a)^2+(y-b)^2=r^2$ gives centre $(2,-1)$ and radius $\\sqrt{9}=3$.",
  },
  {
    id: "esat-m-112", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The line $y=2x+1$ has a perpendicular line with gradient:",
    options: [ { key: "A", text: "$2$" }, { key: "B", text: "$-2$" }, { key: "C", text: "$\\tfrac{1}{2}$" }, { key: "D", text: "$-\\tfrac{1}{2}$" } ],
    answer: "D",
    solution: "The product of perpendicular gradients is $-1$, so the perpendicular gradient is $-\\dfrac{1}{2}$.",
  },
  {
    id: "esat-m-113", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "In an arithmetic progression with first term $3$ and common difference $4$, the 5th term is:",
    options: [ { key: "A", text: "$15$" }, { key: "B", text: "$19$" }, { key: "C", text: "$23$" }, { key: "D", text: "$20$" } ],
    answer: "B",
    solution: "$a_n=a+(n-1)d=3+(5-1)(4)=3+16=19$.",
  },
  {
    id: "esat-m-114", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The sum of the first 10 terms of an arithmetic progression with $a=2$ and $d=3$ is:",
    options: [ { key: "A", text: "$145$" }, { key: "B", text: "$155$" }, { key: "C", text: "$165$" }, { key: "D", text: "$175$" } ],
    answer: "B",
    solution: "$S_n=\\dfrac{n}{2}[2a+(n-1)d]=\\dfrac{10}{2}[2(2)+9(3)]=5[4+27]=5\\times31=155$.",
  },
  {
    id: "esat-m-115", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "In a geometric progression with first term $2$ and common ratio $3$, the 4th term is:",
    options: [ { key: "A", text: "$18$" }, { key: "B", text: "$24$" }, { key: "C", text: "$54$" }, { key: "D", text: "$162$" } ],
    answer: "C",
    solution: "$a_n=ar^{n-1}=2\\times3^{3}=2\\times27=54$.",
  },
  {
    id: "esat-m-116", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "The sum to infinity of a geometric series with first term $8$ and common ratio $\\tfrac{1}{2}$ is:",
    options: [ { key: "A", text: "$12$" }, { key: "B", text: "$16$" }, { key: "C", text: "$8$" }, { key: "D", text: "$\\infty$" } ],
    answer: "B",
    solution: "For $|r|<1$, $S_\\infty=\\dfrac{a}{1-r}=\\dfrac{8}{1-\\tfrac12}=\\dfrac{8}{0.5}=16$.",
  },
  {
    id: "esat-m-117", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The sum $1+2+3+\\cdots+100$ equals:",
    options: [ { key: "A", text: "$5000$" }, { key: "B", text: "$5050$" }, { key: "C", text: "$10000$" }, { key: "D", text: "$100$" } ],
    answer: "B",
    solution: "$\\sum_{k=1}^{100}k=\\dfrac{100\\times101}{2}=5050$.",
  },
  {
    id: "esat-m-118", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 1, marks: 1,
    question: "The exact value of $\\sin 30^\\circ$ is:",
    options: [ { key: "A", text: "$\\tfrac{1}{2}$" }, { key: "B", text: "$\\tfrac{\\sqrt{3}}{2}$" }, { key: "C", text: "$1$" }, { key: "D", text: "$\\tfrac{\\sqrt{2}}{2}$" } ],
    answer: "A",
    solution: "$\\sin 30^\\circ=\\dfrac{1}{2}$ (a standard exact value).",
  },
  {
    id: "esat-m-119", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "In the interval $0^\\circ \\le x \\le 360^\\circ$, the solutions of $\\sin x = \\tfrac{1}{2}$ are:",
    options: [ { key: "A", text: "$30^\\circ$ and $150^\\circ$" }, { key: "B", text: "$30^\\circ$ and $330^\\circ$" }, { key: "C", text: "$60^\\circ$ and $120^\\circ$" }, { key: "D", text: "$30^\\circ$ only" } ],
    answer: "A",
    solution: "$\\sin$ is positive in the first and second quadrants: $x=30^\\circ$ and $x=180^\\circ-30^\\circ=150^\\circ$.",
  },
  {
    id: "esat-m-120", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "If $x$ is acute and $\\sin x = 0.6$, then $\\cos x$ equals:",
    options: [ { key: "A", text: "$0.4$" }, { key: "B", text: "$0.6$" }, { key: "C", text: "$0.8$" }, { key: "D", text: "$1.0$" } ],
    answer: "C",
    solution: "Using $\\sin^2 x+\\cos^2 x=1$: $\\cos x=\\sqrt{1-0.36}=\\sqrt{0.64}=0.8$ (positive since $x$ is acute).",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-math2a · 数学2 复数与进阶代数 补充 15 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_MATH2A_EXTRA: MCQQuestion[] = [
  {
    id: "esat-m2-051", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 1, marks: 1,
    question: "The value of $i^2$ (where $i$ is the imaginary unit) is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$-1$" }, { key: "C", text: "$i$" }, { key: "D", text: "$-i$" } ],
    answer: "B",
    solution: "By definition $i=\\sqrt{-1}$, so $i^2=-1$.",
  },
  {
    id: "esat-m2-052", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 1, marks: 1,
    question: "Evaluate $(2+3i)+(1-i)$.",
    options: [ { key: "A", text: "$3+2i$" }, { key: "B", text: "$3+4i$" }, { key: "C", text: "$1+2i$" }, { key: "D", text: "$3-2i$" } ],
    answer: "A",
    solution: "Add real and imaginary parts separately: $(2+1)+(3-1)i=3+2i$.",
  },
  {
    id: "esat-m2-053", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "Evaluate $(1+i)(1-i)$.",
    options: [ { key: "A", text: "$0$" }, { key: "B", text: "$2$" }, { key: "C", text: "$2i$" }, { key: "D", text: "$1+i^2$" } ],
    answer: "B",
    solution: "$(1+i)(1-i)=1-i^2=1-(-1)=2$ (difference of two squares).",
  },
  {
    id: "esat-m2-054", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "The modulus of the complex number $3+4i$ is:",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$7$" }, { key: "C", text: "$12$" }, { key: "D", text: "$25$" } ],
    answer: "A",
    solution: "$|3+4i|=\\sqrt{3^2+4^2}=\\sqrt{25}=5$.",
  },
  {
    id: "esat-m2-055", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 1, marks: 1,
    question: "The complex conjugate of $2-5i$ is:",
    options: [ { key: "A", text: "$2+5i$" }, { key: "B", text: "$-2-5i$" }, { key: "C", text: "$-2+5i$" }, { key: "D", text: "$5-2i$" } ],
    answer: "A",
    solution: "The conjugate changes the sign of the imaginary part: $\\overline{2-5i}=2+5i$.",
  },
  {
    id: "esat-m2-056", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "The value of $i^3$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$-1$" }, { key: "C", text: "$i$" }, { key: "D", text: "$-i$" } ],
    answer: "D",
    solution: "$i^3=i^2\\cdot i=(-1)(i)=-i$.",
  },
  {
    id: "esat-m2-057", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "The value of $i^4$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$-1$" }, { key: "C", text: "$i$" }, { key: "D", text: "$-i$" } ],
    answer: "A",
    solution: "$i^4=(i^2)^2=(-1)^2=1$.",
  },
  {
    id: "esat-m2-058", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "Evaluate $(2+i)^2$.",
    options: [ { key: "A", text: "$3+4i$" }, { key: "B", text: "$5+4i$" }, { key: "C", text: "$4+4i$" }, { key: "D", text: "$3+2i$" } ],
    answer: "A",
    solution: "$(2+i)^2=4+4i+i^2=4+4i-1=3+4i$.",
  },
  {
    id: "esat-m2-059", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 3, marks: 1,
    question: "The solutions of $z^2=-9$ are:",
    options: [ { key: "A", text: "$z=\\pm 3$" }, { key: "B", text: "$z=\\pm 3i$" }, { key: "C", text: "$z=\\pm 9i$" }, { key: "D", text: "$z=3i$ only" } ],
    answer: "B",
    solution: "$z^2=-9\\Rightarrow z=\\pm\\sqrt{-9}=\\pm 3i$.",
  },
  {
    id: "esat-m2-060", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 1, marks: 1,
    question: "The real part of the complex number $3-2i$ is:",
    options: [ { key: "A", text: "$3$" }, { key: "B", text: "$-2$" }, { key: "C", text: "$2$" }, { key: "D", text: "$-3$" } ],
    answer: "A",
    solution: "For $a+bi$, the real part is $a$. Here $a=3$.",
  },
  {
    id: "esat-m2-061", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "The scalar (dot) product of the vectors $(1,2,3)$ and $(4,0,-1)$ is:",
    options: [ { key: "A", text: "$1$" }, { key: "B", text: "$7$" }, { key: "C", text: "$0$" }, { key: "D", text: "$-1$" } ],
    answer: "A",
    solution: "$(1)(4)+(2)(0)+(3)(-1)=4+0-3=1$.",
  },
  {
    id: "esat-m2-062", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "The magnitude of the vector $(2,3,6)$ is:",
    options: [ { key: "A", text: "$7$" }, { key: "B", text: "$11$" }, { key: "C", text: "$\\sqrt{11}$" }, { key: "D", text: "$49$" } ],
    answer: "A",
    solution: "$|(2,3,6)|=\\sqrt{2^2+3^2+6^2}=\\sqrt{4+9+36}=\\sqrt{49}=7$.",
  },
  {
    id: "esat-m2-063", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 3, marks: 1,
    question: "The cross product of two non-parallel vectors gives a vector that is:",
    options: [ { key: "A", text: "Parallel to both vectors" }, { key: "B", text: "Perpendicular to both vectors" }, { key: "C", text: "Of zero magnitude" }, { key: "D", text: "Equal to their dot product" } ],
    answer: "B",
    solution: "The cross product $\\mathbf{a}\\times\\mathbf{b}$ is perpendicular to the plane containing $\\mathbf{a}$ and $\\mathbf{b}$ — i.e. perpendicular to both.",
  },
  {
    id: "esat-m2-064", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 2, marks: 1,
    question: "Two non-zero vectors are parallel if:",
    options: [ { key: "A", text: "Their dot product is zero" }, { key: "B", text: "One is a scalar multiple of the other" }, { key: "C", text: "Their magnitudes are equal" }, { key: "D", text: "Their cross product is non-zero" } ],
    answer: "B",
    solution: "Parallel vectors point along the same line, so one is a scalar multiple of the other (and their cross product is the zero vector).",
  },
  {
    id: "esat-m2-065", type: "mcq", testId: "esat", topicId: "esat-math2a", difficulty: 3, marks: 1,
    question: "The cross product $(1,0,0)\\times(0,1,0)$ equals:",
    options: [ { key: "A", text: "$(0,0,1)$" }, { key: "B", text: "$(0,0,-1)$" }, { key: "C", text: "$(1,1,0)$" }, { key: "D", text: "$(0,0,0)$" } ],
    answer: "A",
    solution: "Using the right-hand rule, $\\mathbf{i}\\times\\mathbf{j}=\\mathbf{k}$, i.e. $(1,0,0)\\times(0,1,0)=(0,0,1)$.",
  },
];

// ════════════════════════════════════════════════════════════════════════
//  esat-math2b · 数学2 微分方程与矩阵 补充 15 题（达到 40）
// ════════════════════════════════════════════════════════════════════════
export const ESAT_MATH2B_EXTRA: MCQQuestion[] = [
  {
    id: "esat-m2-066", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 1, marks: 1,
    question: "The determinant of the matrix $\\begin{pmatrix}2 & 1\\\\3 & 4\\end{pmatrix}$ is:",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$8$" }, { key: "C", text: "$11$" }, { key: "D", text: "$-5$" } ],
    answer: "A",
    solution: "For $\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$, $\\det=ad-bc=(2)(4)-(1)(3)=8-3=5$.",
  },
  {
    id: "esat-m2-067", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "The determinant of $\\begin{pmatrix}1 & 2\\\\2 & 4\\end{pmatrix}$ is:",
    options: [ { key: "A", text: "$0$" }, { key: "B", text: "$8$" }, { key: "C", text: "$4$" }, { key: "D", text: "$-4$" } ],
    answer: "A",
    solution: "$\\det=(1)(4)-(2)(2)=4-4=0$. (The matrix is singular — its rows are proportional.)",
  },
  {
    id: "esat-m2-068", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "A square matrix whose determinant is zero is described as:",
    options: [ { key: "A", text: "Singular (has no inverse)" }, { key: "B", text: "Orthogonal" }, { key: "C", text: "The identity matrix" }, { key: "D", text: "Symmetric" } ],
    answer: "A",
    solution: "A matrix with zero determinant is singular and cannot be inverted (the inverse requires dividing by the determinant).",
  },
  {
    id: "esat-m2-069", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 1, marks: 1,
    question: "The trace of the matrix $\\begin{pmatrix}1 & 2\\\\3 & 4\\end{pmatrix}$ (the sum of the leading-diagonal entries) is:",
    options: [ { key: "A", text: "$5$" }, { key: "B", text: "$10$" }, { key: "C", text: "$4$" }, { key: "D", text: "$3$" } ],
    answer: "A",
    solution: "Trace $=1+4=5$ (sum of the main-diagonal elements).",
  },
  {
    id: "esat-m2-070", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "What is the determinant of the $2\\times 2$ identity matrix $\\begin{pmatrix}1 & 0\\\\0 & 1\\end{pmatrix}$?",
    options: [ { key: "A", text: "$0$" }, { key: "B", text: "$1$" }, { key: "C", text: "$2$" }, { key: "D", text: "$-1$" } ],
    answer: "B",
    solution: "$\\det=(1)(1)-(0)(0)=1$.",
  },
  {
    id: "esat-m2-071", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 3, marks: 1,
    question: "The eigenvalues of the diagonal matrix $\\begin{pmatrix}2 & 0\\\\0 & 3\\end{pmatrix}$ are:",
    options: [ { key: "A", text: "$2$ and $3$" }, { key: "B", text: "$0$ and $5$" }, { key: "C", text: "$6$ and $1$" }, { key: "D", text: "$5$ and $6$" } ],
    answer: "A",
    solution: "For a diagonal (or triangular) matrix the eigenvalues are simply the diagonal entries: $2$ and $3$.",
  },
  {
    id: "esat-m2-072", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 3, marks: 1,
    question: "If $\\mathbf{A}\\mathbf{v}=\\lambda\\mathbf{v}$ for a non-zero vector $\\mathbf{v}$, then $\\lambda$ is called:",
    options: [ { key: "A", text: "An eigenvalue of $\\mathbf{A}$" }, { key: "B", text: "The determinant of $\\mathbf{A}$" }, { key: "C", text: "The trace of $\\mathbf{A}$" }, { key: "D", text: "The inverse of $\\mathbf{A}$" } ],
    answer: "A",
    solution: "By definition, a scalar $\\lambda$ satisfying $\\mathbf{A}\\mathbf{v}=\\lambda\\mathbf{v}$ (with $\\mathbf{v}\\neq\\mathbf{0}$) is an eigenvalue, and $\\mathbf{v}$ is the corresponding eigenvector.",
  },
  {
    id: "esat-m2-073", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 1, marks: 1,
    question: "The general solution of $\\dfrac{dy}{dx}=2x$ is:",
    options: [ { key: "A", text: "$y=x^2+c$" }, { key: "B", text: "$y=2x^2+c$" }, { key: "C", text: "$y=2+c$" }, { key: "D", text: "$y=x^2$" } ],
    answer: "A",
    solution: "Integrating both sides: $y=\\int 2x\\,dx=x^2+c$.",
  },
  {
    id: "esat-m2-074", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "The general solution of $\\dfrac{dy}{dx}=3x^2$ is:",
    options: [ { key: "A", text: "$y=6x+c$" }, { key: "B", text: "$y=x^3+c$" }, { key: "C", text: "$y=3x^3+c$" }, { key: "D", text: "$y=x^3$" } ],
    answer: "B",
    solution: "$y=\\int 3x^2\\,dx=x^3+c$.",
  },
  {
    id: "esat-m2-075", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 3, marks: 1,
    question: "The general solution of the differential equation $\\dfrac{dy}{dx}=ky$ (with $k$ constant) is:",
    options: [ { key: "A", text: "$y=kx+c$" }, { key: "B", text: "$y=Ae^{kx}$" }, { key: "C", text: "$y=A\\sin(kx)$" }, { key: "D", text: "$y=kx^2+c$" } ],
    answer: "B",
    solution: "$\\dfrac{dy}{dx}=ky$ describes exponential growth/decay; separating variables gives $y=Ae^{kx}$.",
  },
  {
    id: "esat-m2-076", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "The equation $\\dfrac{d^2y}{dx^2}+y=0$ is a differential equation of:",
    options: [ { key: "A", text: "First order" }, { key: "B", text: "Second order" }, { key: "C", text: "Third order" }, { key: "D", text: "Zeroth order" } ],
    answer: "B",
    solution: "The order is the highest derivative present; here the highest is $\\dfrac{d^2y}{dx^2}$, so it is second order.",
  },
  {
    id: "esat-m2-077", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 3, marks: 1,
    question: "The general solution of $\\dfrac{d^2y}{dx^2}=0$ is:",
    options: [ { key: "A", text: "$y=Ax+B$" }, { key: "B", text: "$y=Ae^{x}$" }, { key: "C", text: "$y=A\\cos x$" }, { key: "D", text: "$y=x^2+c$" } ],
    answer: "A",
    solution: "Integrating twice: $\\dfrac{dy}{dx}=A$ (constant), then $y=Ax+B$ — a straight line.",
  },
  {
    id: "esat-m2-078", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "The general solution of $\\dfrac{dy}{dx}=y$ is:",
    options: [ { key: "A", text: "$y=Ae^{x}$" }, { key: "B", text: "$y=x+c$" }, { key: "C", text: "$y=\\ln x+c$" }, { key: "D", text: "$y=Ax$" } ],
    answer: "A",
    solution: "This is the $k=1$ case of $\\dfrac{dy}{dx}=ky$, giving $y=Ae^{x}$.",
  },
  {
    id: "esat-m2-079", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 2, marks: 1,
    question: "Multiplying the identity matrix $\\mathbf{I}$ by any conformable matrix $\\mathbf{A}$ gives:",
    options: [ { key: "A", text: "$\\mathbf{A}$" }, { key: "B", text: "$\\mathbf{0}$ (the zero matrix)" }, { key: "C", text: "$\\mathbf{I}$" }, { key: "D", text: "$\\mathbf{A}^2$" } ],
    answer: "A",
    solution: "The identity matrix leaves any matrix unchanged under multiplication: $\\mathbf{I}\\mathbf{A}=\\mathbf{A}\\mathbf{I}=\\mathbf{A}$.",
  },
  {
    id: "esat-m2-080", type: "mcq", testId: "esat", topicId: "esat-math2b", difficulty: 3, marks: 1,
    question: "The determinant of $\\begin{pmatrix}3 & 2\\\\4 & 5\\end{pmatrix}$ is:",
    options: [ { key: "A", text: "$7$" }, { key: "B", text: "$23$" }, { key: "C", text: "$-7$" }, { key: "D", text: "$8$" } ],
    answer: "A",
    solution: "$\\det=(3)(5)-(2)(4)=15-8=7$.",
  },
];

// 聚合（ESAT 全部 14 模块的增量补足）
export const ESAT_TOPUP_QUESTIONS = [
  ...ESAT_PHYS1_EXTRA, ...ESAT_PHYS2_EXTRA, ...ESAT_PHYS3_EXTRA,
  ...ESAT_CHEM1_EXTRA, ...ESAT_CHEM2_EXTRA, ...ESAT_CHEM3_EXTRA,
  ...ESAT_MATH1_EXTRA, ...ESAT_MATH2_EXTRA, ...ESAT_MATH3_EXTRA,
  ...ESAT_MATH2A_EXTRA, ...ESAT_MATH2B_EXTRA,
];
