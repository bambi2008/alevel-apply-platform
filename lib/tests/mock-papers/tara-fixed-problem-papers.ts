import { TARA_PROBLEM } from "@/lib/tests/questions/tara-problem";
import { TARA_PROBLEM_2 } from "@/lib/tests/questions/tara-problem-2";
import type { MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";
import { calibrateTaraModule } from "./tara-calibration";

export type TaraProblemSkill = "relevant-selection" | "finding-procedures" | "identifying-similarity";

const KEYS = ["A", "B", "C", "D", "E"] as const;
const LABELS = ["Aster", "Birch", "Cedar", "Dahlia", "Elm"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PAPER_LABELS = ["Amber", "Bronze", "Cobalt", "Dahlia", "Emerald", "Flint"];
const OFF_SPEC_DIRECT_MATH = /right-angled triangle|hypotenuse|triangle has base|arithmetic sequence|geometric sequence|committee of|fair dice|coin is tossed|prime factor|solve the equation/i;

function mcq(id: string, question: string, options: string[], answerIndex: number, solution: string): MCQQuestion {
  const paperNumber = Number(id.match(/tara-(?:rs|is)-(\d+)/)?.[1]);
  const scopedQuestion = paperNumber ? `${PAPER_LABELS[paperNumber - 1]} case. ${question}` : question;
  return {
    id,
    type: "mcq",
    testId: "tara",
    topicId: "tara-problem",
    difficulty: 2,
    marks: 1,
    question: scopedQuestion,
    options: options.map((text, index) => ({ key: KEYS[index], text })),
    answer: KEYS[answerIndex] as MCQOptionKey,
    solution,
  };
}

function relevantSelection(paper: number): MCQQuestion[] {
  const target = (paper - 1) % 5;
  const candidateRows = LABELS.map((label, index) => {
    const maths = index === target ? 72 + paper : index % 2 ? 68 : 76;
    const interview = index === target ? 7 + (paper % 2) : index % 2 ? 8 : 5;
    const art = 55 + ((index * 7 + paper) % 30);
    return `${label}: maths ${maths}, interview ${interview}, art ${art}`;
  });

  const serviceTarget = (paper + 1) % 5;
  const services = LABELS.map((label, index) => {
    const arrives = index === serviceTarget ? 9 * 60 + 25 : index === (serviceTarget + 1) % 5 ? 9 * 60 + 15 : 9 * 60 + 40 + index * 5;
    const changes = index === serviceTarget ? 1 : index === (serviceTarget + 2) % 5 ? 2 : 0;
    const fare = index === serviceTarget ? 24 : 27 + index;
    return `${label}: arrives ${Math.floor(arrives / 60)}:${String(arrives % 60).padStart(2, "0")}, ${changes} change(s), fare £${fare}`;
  });

  const supplierTarget = (paper + 2) % 5;
  const suppliers = LABELS.map((label, index) => {
    const stock = index === supplierTarget ? 60 : index % 2 ? 35 : 55;
    const price = index === supplierTarget ? 8 : index % 2 ? 9 : 12 + index;
    const rating = 3 + ((index + paper) % 3);
    return `${label}: stock ${stock}, price £${price}, rating ${rating}/5`;
  });

  const venueTarget = (paper + 3) % 5;
  const venues = LABELS.map((label, index) => {
    const seats = index === venueTarget ? 140 : index === (venueTarget + 1) % 5 ? 110 : 150;
    const distance = index === venueTarget ? 3 : index === (venueTarget + 2) % 5 ? 8 : 5;
    const cost = index === venueTarget ? 420 : 470 + index * 20;
    return `${label}: ${seats} seats, ${distance} km away, £${cost}`;
  });

  const dayTarget = (paper + 4) % 5;
  const bookTotals = DAYS.map((day, index) => {
    const morning = index === dayTarget ? 5 : 7 + ((index + paper) % 3);
    const afternoon = 2 + ((index * 2 + paper) % 5);
    return `${day}: ${morning} books before break, ${afternoon} after lunch`;
  });

  return [
    mcq(`tara-rs-${paper}-1`, `A scholarship requires a maths score above 70 and an interview score of at least 7. Art scores are recorded but are not used.\n\n${candidateRows.join("\n")}\n\nWho qualifies?`, LABELS, target, `${LABELS[target]} is the only candidate satisfying both relevant thresholds; the art score is irrelevant.`),
    mcq(`tara-rs-${paper}-2`, `A traveller needs to arrive by 09:30, make no more than one change, and then chooses the cheapest eligible service.\n\n${services.join("\n")}\n\nWhich service should be chosen?`, LABELS, serviceTarget, `${LABELS[serviceTarget]} meets both journey constraints and is the cheapest eligible service.`),
    mcq(`tara-rs-${paper}-3`, `A club needs 50 identical folders. It can spend at most £10 per folder. Supplier ratings are not part of the decision.\n\n${suppliers.join("\n")}\n\nWhich supplier meets the requirements?`, LABELS, supplierTarget, `${LABELS[supplierTarget]} has enough stock and stays within the unit budget; the rating is irrelevant.`),
    mcq(`tara-rs-${paper}-4`, `An event expects 130 guests. The venue must be within 6 km, and the organiser chooses the cheapest venue that satisfies both conditions.\n\n${venues.join("\n")}\n\nWhich venue should be booked?`, LABELS, venueTarget, `${LABELS[venueTarget]} has enough seats, is close enough, and has the lowest cost among eligible venues.`),
    mcq(`tara-rs-${paper}-5`, `A pupil's bag holds at most 6 books. Only books needed before break matter because the pupil can visit the locker then.\n\n${bookTotals.join("\n")}\n\nOn which day is no pre-break locker visit needed?`, DAYS, dayTarget, `${DAYS[dayTarget]} is the only day with no more than 6 books needed before break; afternoon books are irrelevant.`),
  ];
}

function identifyingSimilarity(paper: number): MCQQuestion[] {
  const target = (paper * 2) % 5;
  const scale = paper + 1;
  const ratioOptions = [
    [2, 3, 5, 8], [3, 4, 6, 9], [4, 6, 10, 16], [4, 6, 9, 16], [6, 9, 15, 25],
  ];
  ratioOptions[target] = [2 * scale, 3 * scale, 5 * scale, 8 * scale];

  const routeTarget = (paper + 1) % 5;
  const rotations = ["N, E, E, S", "E, S, S, W", "S, W, W, N", "W, N, N, E"];
  const originalRoute = rotations[(paper - 1) % rotations.length];
  const routes = ["N, W, W, S", "E, N, N, W", "S, E, E, N", "W, S, S, E", "N, E, S, S"];
  routes[routeTarget] = rotations[paper % rotations.length];

  const rankingTarget = (paper + 2) % 5;
  const rankingOptions = ["9, 7, 4, 2", "4, 9, 7, 2", "9, 4, 2, 7", "7, 2, 9, 4", "5, 10, 3, 8"];
  rankingOptions[rankingTarget] = `${10 + paper}, ${4 + paper}, ${8 + paper}, ${2 + paper}`;

  const changeTarget = (paper + 3) % 5;
  const changeOptions = ["12, 15, 14, 16", "20, 18, 21, 21", "9, 12, 10, 11", "14, 11, 13, 13", "8, 10, 7, 9"];
  changeOptions[changeTarget] = `${10 + paper}, ${13 + paper}, ${11 + paper}, ${11 + paper}`;

  const shareTarget = (paper + 4) % 5;
  const shareOptions = ["20, 30, 45", "24, 36, 54", "12, 24, 36", "18, 27, 48", "30, 40, 50"];
  shareOptions[shareTarget] = `${2 * scale}, ${3 * scale}, ${5 * scale}`;

  return [
    mcq(`tara-is-${paper}-1`, `A machine records outputs in the ratio $2:3:5:8$. Which record has exactly the same relative pattern?`, ratioOptions.map((values) => values.join(", ")), target, `Multiplying every term of $2:3:5:8$ by ${scale} gives ${ratioOptions[target].join(", ")}.`),
    mcq(`tara-is-${paper}-2`, `A route follows the directions ${originalRoute}. Which route has the same shape after a rotation, without reflection?`, routes, routeTarget, `${routes[routeTarget]} preserves every turn and segment pattern under rotation.`),
    mcq(`tara-is-${paper}-3`, `Four teams have scores $${10 + paper}, ${4 + paper}, ${8 + paper}, ${2 + paper}$. Which list gives the same ranking from highest to lowest across its four positions?`, rankingOptions, rankingTarget, `The first position is highest, the third is second, the second is third, and the fourth is lowest in both lists.`),
    mcq(`tara-is-${paper}-4`, `A reading rises by 3, falls by 2, then stays unchanged. Which four-reading record has the same pattern?`, changeOptions, changeTarget, `${changeOptions[changeTarget]} changes by $+3,-2,0$ in that order.`),
    mcq(`tara-is-${paper}-5`, `Three categories occur in the ratio $2:3:5$. Which data set would produce the same sector proportions in a pie chart?`, shareOptions, shareTarget, `${shareOptions[shareTarget]} is a common multiple of $2:3:5$, so the proportions match.`),
  ];
}

const PROCEDURE_GROUPS: MCQQuestion[][] = [
  TARA_PROBLEM.slice(0, 5),
  TARA_PROBLEM.slice(5, 10),
  TARA_PROBLEM.slice(10, 13),
  TARA_PROBLEM.slice(18, 21),
  TARA_PROBLEM.slice(21, 24),
  TARA_PROBLEM.slice(24, 27),
  TARA_PROBLEM.slice(27, 30),
  TARA_PROBLEM_2.slice(0, 4),
  TARA_PROBLEM_2.slice(4, 8),
  TARA_PROBLEM_2.slice(13, 18),
  TARA_PROBLEM_2.slice(27, 30),
  TARA_PROBLEM_2.slice(30, 34),
  TARA_PROBLEM_2.slice(34, 36),
  TARA_PROBLEM_2.slice(44, 46),
  TARA_PROBLEM_2.slice(46, 50),
  TARA_PROBLEM_2.slice(50, 54),
  TARA_PROBLEM_2.slice(54, 58),
  TARA_PROBLEM_2.slice(58, 63),
  TARA_PROBLEM_2.slice(63, 67),
  TARA_PROBLEM_2.slice(67, 71),
  TARA_PROBLEM_2.slice(71, 75),
  TARA_PROBLEM_2.slice(79, 83),
  TARA_PROBLEM_2.slice(87, 90),
  TARA_PROBLEM_2.slice(90, 94),
  TARA_PROBLEM_2.slice(94, 98),
  TARA_PROBLEM_2.slice(98, 100),
  TARA_PROBLEM_2.slice(100, 104),
  TARA_PROBLEM_2.slice(104, 108),
];

const usedProcedureIds = new Set<string>();

function procedureStructure(question: MCQQuestion): string {
  return question.question.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/\s+/g, " ").trim();
}

function findingProcedures(paper: number): MCQQuestion[] {
  const selected: MCQQuestion[] = [];
  const structures = new Set<string>();
  const start = ((paper - 1) * 7) % PROCEDURE_GROUPS.length;

  for (let offset = 0; offset < PROCEDURE_GROUPS.length * 4 && selected.length < 12; offset += 1) {
    const group = PROCEDURE_GROUPS[(start + offset) % PROCEDURE_GROUPS.length];
    const candidate = group.find((question) => {
      const signature = procedureStructure(question);
      return !usedProcedureIds.has(question.id) && !structures.has(signature) && !OFF_SPEC_DIRECT_MATH.test(question.question);
    });
    if (!candidate) continue;
    selected.push(candidate);
    usedProcedureIds.add(candidate.id);
    structures.add(procedureStructure(candidate));
  }

  if (selected.length !== 12) throw new Error(`Unable to build 12 unique TARA procedure questions for paper ${paper}.`);
  return selected;
}

function buildPaper(paper: number): MCQQuestion[] {
  const raw = [
    ...relevantSelection(paper),
    ...findingProcedures(paper),
    ...identifyingSimilarity(paper),
  ];
  return calibrateTaraModule(raw, `tara-mk${paper}-ps`);
}

export const TARA_FIXED_PS_PAPERS = Array.from({ length: 6 }, (_, index) => buildPaper(index + 1));

export const TARA_FIXED_PS_SKILLS = new Map<string, TaraProblemSkill>(
  TARA_FIXED_PS_PAPERS.flatMap((questions) => questions.map((question, index) => [
    question.id,
    index < 5 ? "relevant-selection" : index < 17 ? "finding-procedures" : "identifying-similarity",
  ] as const)),
);
