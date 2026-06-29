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

// 聚合（后续模块在此累加）
export const ESAT_TOPUP_QUESTIONS = [...ESAT_PHYS1_EXTRA];
