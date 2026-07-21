import type { MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";
import { calibrateTaraModule } from "./tara-calibration";

export type TaraCriticalSkill =
  | "main-conclusion"
  | "drawing-conclusion"
  | "assumption"
  | "additional-evidence"
  | "reasoning-error"
  | "matching-arguments"
  | "applying-principles";

export const TARA_CRITICAL_SKILLS: TaraCriticalSkill[] = [
  "main-conclusion", "drawing-conclusion", "assumption", "additional-evidence",
  "reasoning-error", "matching-arguments", "applying-principles",
];

const KEYS = ["A", "B", "C", "D", "E"] as const;
const SETTINGS = ["Amber", "Birch", "Cobalt", "Dahlia", "Elm", "Flint"];
const SUBJECTS = ["archive", "clinic", "college", "gallery", "harbour", "library", "museum", "orchard", "railway", "theatre", "workshop"];

export function classifyTaraCritical(question: MCQQuestion): TaraCriticalSkill {
  const text = question.question.toLowerCase();
  if (/same logical structure|same structure|same pattern of reasoning|same way|matches.*argument/.test(text)) return "matching-arguments";
  if (/principle|conforms/.test(text)) return "applying-principles";
  if (/assumption/.test(text)) return "assumption";
  if (/strengthen|weaken|additional evidence/.test(text)) return "additional-evidence";
  if (/flaw|weakness|reasoning error/.test(text)) return "reasoning-error";
  if (/main conclusion/.test(text)) return "main-conclusion";
  return "drawing-conclusion";
}

function mcq(id: string, question: string, options: string[], solution: string): MCQQuestion {
  return {
    id, type: "mcq", testId: "tara", topicId: "tara-critical", difficulty: 2, marks: 1, question,
    options: options.map((text, index) => ({ key: KEYS[index], text })),
    answer: "A" as MCQOptionKey,
    solution,
  };
}

function originalCriticalQuestion(index: number, skill: TaraCriticalSkill, labelOverride?: string): MCQQuestion {
  const setting = SETTINGS[Math.floor(index / SUBJECTS.length) % SETTINGS.length];
  const subject = SUBJECTS[index % SUBJECTS.length];
  const label = labelOverride ?? `${setting} ${subject}`;
  const id = `tara-ct-original-${index + 1}`;

  switch (skill) {
    case "main-conclusion":
      return mcq(id,
        `${label} extended its opening hours to improve access. Visitor numbers in the added hours are low, while staffing and security costs have risen sharply. The extension is therefore using resources that would serve visitors better elsewhere.\n\nWhich statement is the main conclusion?`,
        ["The extension is a poor use of resources.", "The opening hours were extended.", "Some visitors attend late.", "Security has a cost.", "Access matters to visitors."],
        "The final evaluative claim is supported by the low attendance and increased costs; those facts are premises, not the conclusion.");
    case "drawing-conclusion":
      return mcq(id,
        `Every ${label} record that passes the independent check receives a blue stamp. Some records completed this month passed the independent check. Which conclusion follows?`,
        ["Some records completed this month received a blue stamp.", "Every record with a blue stamp was completed this month.", "All records completed this month passed the check.", "No unchecked record has a blue stamp.", "Most records completed this month have a blue stamp."],
        "At least one record completed this month passed the check, and every checked record receives a blue stamp, so at least one such record is stamped.");
    case "assumption":
      return mcq(id,
        `${label} introduced a reminder message in April. Missed appointments then fell, so its director concludes that the reminder caused the fall. Which assumption is required?`,
        ["No other change in April adequately explains the fall in missed appointments.", "Every user read the reminder.", "Missed appointments can never be eliminated.", "The reminder cost nothing to send.", "April had more appointments than March."],
        "The causal conclusion requires competing explanations to be ruled out; it does not require universal exposure, zero cost, or a particular appointment total.");
    case "additional-evidence":
      return mcq(id,
        `${label} replaced paper instructions with illustrated ones, after which task errors fell. Which additional evidence would most strengthen the claim that the illustrated instructions caused the improvement?`,
        ["A comparable site retaining paper instructions showed no fall in errors over the same period.", "The illustrations used several colours.", "Managers preferred the new pages.", "Printing the old instructions was inexpensive.", "Some experienced staff made no errors before the change."],
        "A comparable control site helps isolate the changed instructions as the cause. The other facts do not test that causal link.");
    case "reasoning-error":
      return mcq(id,
        `${label} asked people attending its weekend event whether the event should receive more funding. Most agreed, so the organiser claims that all local residents support more funding. Which option identifies the main flaw?`,
        ["The sample is biased towards people already interested in the event.", "The survey asked too many people.", "The conclusion merely restates a premise.", "The organiser proves that funding has no benefits.", "The argument relies on a mathematical contradiction."],
        "Event attendees are not representative of all local residents, so their views cannot justify the population-wide conclusion.");
    case "matching-arguments":
      return mcq(id,
        `If a parcel processed by ${label} has cleared inspection, its code appears on the release list. Parcel K's code is not on the list, so Parcel K has not cleared inspection. Which argument has the same logical structure?`,
        ["If a room is booked, it appears on the timetable. Room J is absent from the timetable, so it is not booked.", "If a room is booked, it appears on the timetable. It appears there, so it is booked.", "Room J is booked and therefore has a door.", "If a room is booked, it appears on the timetable. Room J is booked, so it appears there.", "Room J is absent because the timetable is printed weekly."],
        "Both use modus tollens: if P then Q; not Q; therefore not P.");
    case "applying-principles":
      return mcq(id,
        `Principle: when a shared public resource is scarce, access should be prioritised by demonstrated need rather than influence or ability to pay. Which decision by ${label} best conforms to this principle?`,
        ["Reserve the last assisted place for the applicant whose assessment shows the greatest need.", "Give the place to the largest donor.", "Auction the place to the highest bidder.", "Give the place to the director's relative.", "Allocate the place to whoever complains most loudly."],
        "The first decision uses demonstrated need; each alternative substitutes wealth, influence, connection, or pressure.");
  }
}

const SKILL_SCHEDULE: TaraCriticalSkill[] = Array.from({ length: 22 }, (_, index) => TARA_CRITICAL_SKILLS[index % TARA_CRITICAL_SKILLS.length]);

export function calibrateTaraCriticalModule(questions: MCQQuestion[], paperId: string): MCQQuestion[] {
  const result = [...questions];
  const counts = new Map<TaraCriticalSkill, number>();
  result.forEach((question) => {
    const skill = classifyTaraCritical(question);
    counts.set(skill, (counts.get(skill) ?? 0) + 1);
  });

  for (const missing of TARA_CRITICAL_SKILLS.filter((skill) => !counts.get(skill))) {
    const replaceIndex = result.findIndex((question) => (counts.get(classifyTaraCritical(question)) ?? 0) > 1);
    const replacedSkill = classifyTaraCritical(result[replaceIndex]);
    result[replaceIndex] = originalCriticalQuestion(70 + replaceIndex, missing, `${paperId} calibration case`);
    counts.set(replacedSkill, (counts.get(replacedSkill) ?? 1) - 1);
    counts.set(missing, 1);
  }

  return calibrateTaraModule(result, paperId);
}

export const TARA_FIXED_CT_PAPERS = Array.from({ length: 3 }, (_, paperOffset) => {
  const start = paperOffset * 22;
  const questions = SKILL_SCHEDULE.map((skill, index) => originalCriticalQuestion(start + index, skill));
  return calibrateTaraCriticalModule(questions, `tara-mk${paperOffset + 4}-ct`);
});
