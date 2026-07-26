import type { LongQuestion, QuestionDifficulty } from "./types";

type Seed = {
  id: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  context?: string;
  parts: LongQuestion["parts"];
  fullSolution: string;
};

const seeds: Seed[] = [
  {
    id: "csat-01", topicId: "csat-algorithms", difficulty: 2,
    context: "A robot starts at 1. At each step it may double its current number or add 3.",
    parts: [
      { label: "(i)", marks: 6, question: "Find a shortest sequence of operations that reaches 29.", solutionOutline: "Work backwards: inverse moves are subtract 3 and, for even values, halve." },
      { label: "(ii)", marks: 9, question: "Describe an algorithm that finds a shortest sequence to any reachable target n, and justify why it is shortest.", solutionOutline: "Use breadth-first search on states; the first visit occurs at minimum number of edges." },
      { label: "(iii)", marks: 5, question: "Give a target that is not reachable and prove it.", solutionOutline: "Track residues or parity from the start and establish an invariant." },
    ],
    fullSolution: "A breadth-first search explores all values at distance 0, then 1, then 2. Keeping predecessors reconstructs a shortest path. Reachability claims must be established with an invariant, not a failed search alone.",
  },
  {
    id: "csat-02", topicId: "csat-algorithms", difficulty: 3,
    parts: [
      { label: "(i)", marks: 6, question: "A list of n distinct numbers is repeatedly split in half until singletons remain, then merged in sorted order. How many comparison levels are used when n=2^k?", solutionOutline: "There are k splitting/merging levels." },
      { label: "(ii)", marks: 8, question: "Show that each level uses at most n comparisons.", solutionOutline: "The merged sublists have total length n; each merge uses fewer comparisons than its total length." },
      { label: "(iii)", marks: 6, question: "Deduce an upper bound and compare it with checking every pair.", solutionOutline: "At most nk = n log2 n versus n(n-1)/2." },
    ],
    fullSolution: "For n=2^k there are k merge levels. Each handles every element once and uses fewer than n comparisons, giving fewer than n log2 n comparisons overall.",
  },
  {
    id: "csat-03", topicId: "csat-logic", difficulty: 2,
    parts: [
      { label: "(i)", marks: 7, question: "Prove that if n^2 is even then n is even.", solutionOutline: "Use the contrapositive: an odd n=2k+1 has odd square." },
      { label: "(ii)", marks: 7, question: "Explain why checking many examples is not a proof.", solutionOutline: "Finite checks do not cover an unbounded domain; distinguish evidence from deduction." },
      { label: "(iii)", marks: 6, question: "State and prove the corresponding claim for divisibility by 3.", solutionOutline: "Use residues 0,1,2 modulo 3; squares are 0 or 1." },
    ],
    fullSolution: "The contrapositive of the first claim follows from (2k+1)^2=4k(k+1)+1. Modulo 3, only residue 0 has square divisible by 3.",
  },
  {
    id: "csat-04", topicId: "csat-logic", difficulty: 3,
    context: "One of three programs A, B and C contains a fault. Tests report: T1 says A or B is faulty; T2 says B is not faulty; T3 says C is faulty. Exactly one test report is false.",
    parts: [
      { label: "(i)", marks: 8, question: "Determine the faulty program, or show that the information is insufficient.", solutionOutline: "Evaluate each single-fault case against all three reports." },
      { label: "(ii)", marks: 6, question: "Write the condition using Boolean variables.", solutionOutline: "Use exactly-one constraints and truth values for T1-T3." },
      { label: "(iii)", marks: 6, question: "Change one report so the fault is uniquely determined, and justify your change.", solutionOutline: "Propose a predicate and verify all cases." },
    ],
    fullSolution: "A complete answer tabulates A-only, B-only and C-only. The second part should distinguish the world variables from whether a report is true.",
  },
  {
    id: "csat-05", topicId: "csat-combinatorics", difficulty: 2,
    parts: [
      { label: "(i)", marks: 6, question: "How many binary strings of length 8 contain exactly three 1s?", solutionOutline: "Choose the three positions: C(8,3)." },
      { label: "(ii)", marks: 8, question: "How many contain no adjacent 1s?", solutionOutline: "Shift selected positions or use gaps; choose 3 positions from 6 adjusted slots." },
      { label: "(iii)", marks: 6, question: "Generalise to length n with exactly k non-adjacent 1s.", solutionOutline: "Map positions i_j to i_j-(j-1), giving C(n-k+1,k)." },
    ],
    fullSolution: "There are C(8,3)=56 unrestricted strings. Non-adjacent choices correspond bijectively to choosing k positions among n-k+1, hence C(n-k+1,k).",
  },
  {
    id: "csat-06", topicId: "csat-combinatorics", difficulty: 3,
    context: "A password is a string over {A,B,C} in which no two adjacent symbols are equal.",
    parts: [
      { label: "(i)", marks: 5, question: "Count passwords of length n.", solutionOutline: "Three choices initially and two thereafter." },
      { label: "(ii)", marks: 8, question: "Count those of length n that start and end with A.", solutionOutline: "Set up two states: ends in A versus ends outside A, then solve the recurrence." },
      { label: "(iii)", marks: 7, question: "Explain how the method changes for an alphabet of q symbols.", solutionOutline: "Use the same state recurrence with q-1 and q-2 transitions." },
    ],
    fullSolution: "The unrestricted count is 3·2^(n-1). For fixed endpoints, a two-state recurrence or a 2x2 transition matrix gives a closed form; the reasoning matters more than memorising it.",
  },
  {
    id: "csat-07", topicId: "csat-graphs", difficulty: 2,
    parts: [
      { label: "(i)", marks: 7, question: "Prove that every finite tree with at least two vertices has at least two leaves.", solutionOutline: "Take a longest simple path; neither endpoint can have another neighbour." },
      { label: "(ii)", marks: 7, question: "Show that deleting a leaf from a tree leaves a tree.", solutionOutline: "Connectivity remains and no cycle is created." },
      { label: "(iii)", marks: 6, question: "Use induction to show a tree with n vertices has n-1 edges.", solutionOutline: "Delete a leaf and apply the induction hypothesis." },
    ],
    fullSolution: "Endpoints of a longest path must have degree one. Leaf deletion preserves connectedness and acyclicity, enabling induction on the vertex count.",
  },
  {
    id: "csat-08", topicId: "csat-graphs", difficulty: 3,
    context: "Six computers are connected so that each computer is directly linked to exactly two others.",
    parts: [
      { label: "(i)", marks: 6, question: "List the possible shapes if the network is connected.", solutionOutline: "A finite connected 2-regular graph is a cycle." },
      { label: "(ii)", marks: 8, question: "Remove the connected assumption. Classify all possible networks.", solutionOutline: "Every component is a cycle of length at least 3; partition 6 accordingly." },
      { label: "(iii)", marks: 6, question: "Give an O(n) procedure to determine the components.", solutionOutline: "Depth-first or breadth-first traversal visits each vertex and edge once." },
    ],
    fullSolution: "Every component of a finite 2-regular simple graph is a cycle. With six vertices, the possibilities are C6 or two disjoint triangles.",
  },
  {
    id: "csat-09", topicId: "csat-modelling", difficulty: 2,
    context: "A lift serves floors 0 to 20. Moving one floor costs one unit of time; opening and closing doors costs four units per stop.",
    parts: [
      { label: "(i)", marks: 6, question: "Compare serving requests 3, 7 and 12 in ascending order with returning to floor 0 after every request.", solutionOutline: "Calculate travel plus stop costs under both policies." },
      { label: "(ii)", marks: 8, question: "State two assumptions hidden in this model and explain their effect.", solutionOutline: "Examples: equal travel time, no capacity, all requests known, no boarding time." },
      { label: "(iii)", marks: 6, question: "Propose a better objective than total time when passengers wait unequally.", solutionOutline: "Consider average wait, maximum wait or weighted delay and discuss trade-offs." },
    ],
    fullSolution: "A good model answer computes consistently, exposes assumptions and recognises that optimisation depends on the chosen fairness objective.",
  },
  {
    id: "csat-10", topicId: "csat-modelling", difficulty: 3,
    context: "Messages spread through a network. In each round, every informed user sends the message to two previously uninformed users if possible.",
    parts: [
      { label: "(i)", marks: 5, question: "Give an upper bound on the number informed after r rounds.", solutionOutline: "At most 3^r if each informed user recruits two new users each round, with the initial user at r=0." },
      { label: "(ii)", marks: 8, question: "Explain why real networks may grow much more slowly.", solutionOutline: "Overlapping contacts, degree limits, repeated targets and disconnected regions." },
      { label: "(iii)", marks: 7, question: "Define a graph model and an algorithm to simulate one round.", solutionOutline: "Specify vertices, edges, informed set and update simultaneously; discuss order effects." },
    ],
    fullSolution: "The idealised recurrence I_(r+1)<=3I_r gives I_r<=3^r, capped by population. A robust simulation separates the current informed set from next-round additions.",
  },
];

export const CSAT_QUESTIONS: LongQuestion[] = seeds.map((seed) => ({
  ...seed,
  type: "long",
  testId: "csat",
  totalMarks: 20,
}));
