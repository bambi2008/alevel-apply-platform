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
  const variant = Math.floor((index % 22) / 7);

  switch (skill) {
    case "main-conclusion":
      if (variant === 1) return mcq(id,
        `${label} installed self-service kiosks to shorten queues. Average transaction time fell, but visitors who need assistance now wait much longer because fewer staff are available. Faster average service has not improved the experience for every visitor.\n\nWhich statement is the main conclusion?`,
        ["The kiosks have not improved service for every visitor.", "Average transaction time fell.", "Some visitors need assistance.", "The kiosks were installed to shorten queues.", "Fewer staff now operate the desks."],
        "The final claim evaluates the overall effect; the changes in waiting time and staffing are evidence supporting it.");
      if (variant === 2) return mcq(id,
        `${label} proposes collecting recycling monthly instead of weekly to reduce fuel use. Trial streets produced overflowing bins, extra clean-up journeys and more contaminated recycling. The proposed schedule is therefore unlikely to deliver the promised environmental saving.\n\nWhich statement is the main conclusion?`,
        ["The monthly schedule is unlikely to deliver the promised environmental saving.", "Weekly collections use fuel.", "Some trial bins overflowed.", "Contaminated recycling requires sorting.", "The proposal changes the collection schedule."],
        "The conclusion follows the word 'therefore'; the trial outcomes are the supporting reasons.");
      if (variant === 3) return mcq(id,
        `${label} moved all bookings online, expecting this to widen access. Residents without reliable internet can no longer book independently, although the old telephone line was inexpensive to run. A telephone option should therefore be restored.\n\nWhich statement is the main conclusion?`,
        ["A telephone booking option should be restored.", "Online booking was expected to widen access.", "Some residents lack reliable internet.", "The former telephone line was inexpensive.", "Online systems can process bookings."],
        "The recommendation to restore telephone booking is supported by the access problem and low cost of the former service.");
      return mcq(id,
        `${label} extended its opening hours to improve access. Visitor numbers in the added hours are low, while staffing and security costs have risen sharply. The extension is therefore using resources that would serve visitors better elsewhere.\n\nWhich statement is the main conclusion?`,
        ["The extension is a poor use of resources.", "The opening hours were extended.", "Some visitors attend late.", "Security has a cost.", "Access matters to visitors."],
        "The final evaluative claim is supported by the low attendance and increased costs; those facts are premises, not the conclusion.");
    case "drawing-conclusion":
      if (variant === 1) return mcq(id,
        `Every ${label} item stored outdoors becomes damp. None of the returned items was damp. Which conclusion follows?`,
        ["No returned item was stored outdoors.", "Every indoor item was returned.", "Only returned items remain dry.", "Some outdoor items were returned dry.", "All items were returned."],
        "If outdoor storage always makes an item damp, a returned item that is not damp cannot have been stored outdoors.");
      if (variant === 2) return mcq(id,
        `Only staff trained by ${label} may authorise a release. Noor authorised a release yesterday. Which conclusion follows?`,
        ["Noor was trained by the organisation.", "Every trained member of staff authorised a release.", "Noor trained the other staff.", "No releases occurred before yesterday.", "Only Noor may authorise releases."],
        "'Only trained staff may authorise' means authorising a release requires that training, so Noor must have received it.");
      return mcq(id,
        `Every ${label} record that passes the independent check receives a blue stamp. Some records completed this month passed the independent check. Which conclusion follows?`,
        ["Some records completed this month received a blue stamp.", "Every record with a blue stamp was completed this month.", "All records completed this month passed the check.", "No unchecked record has a blue stamp.", "Most records completed this month have a blue stamp."],
        "At least one record completed this month passed the check, and every checked record receives a blue stamp, so at least one such record is stamped.");
    case "assumption":
      if (variant === 1) return mcq(id,
        `${label} plans to charge more at its busiest times, arguing that this will shorten queues. Which assumption is required?`,
        ["Enough visitors will change when they attend or decide not to attend because of the higher charge.", "Every visitor dislikes waiting more than paying.", "The busiest period currently makes a profit.", "Queues are always caused by low prices.", "No visitor will attend at a busy time."],
        "The price change can shorten queues only if it changes enough visitors' behaviour; the stronger universal claims are unnecessary.");
      if (variant === 2) return mcq(id,
        `${label} surveyed users through its mobile app. Most respondents preferred app-only updates, so the director concludes that users generally prefer them. Which assumption is required?`,
        ["App respondents are sufficiently representative of users as a whole.", "Every respondent answered every question.", "Printed updates cost more than app updates.", "All users own the same type of phone.", "No respondent has used a printed update."],
        "Generalising from the app survey requires its respondents to represent the wider user population.");
      return mcq(id,
        `${label} introduced a reminder message in April. Missed appointments then fell, so its director concludes that the reminder caused the fall. Which assumption is required?`,
        ["No other change in April adequately explains the fall in missed appointments.", "Every user read the reminder.", "Missed appointments can never be eliminated.", "The reminder cost nothing to send.", "April had more appointments than March."],
        "The causal conclusion requires competing explanations to be ruled out; it does not require universal exposure, zero cost, or a particular appointment total.");
    case "additional-evidence":
      if (variant === 1) return mcq(id,
        `${label} advertised locally in May and sales then increased. Which additional evidence would most weaken the claim that the advertisement caused the increase?`,
        ["Its nearest competitor closed at the start of May.", "The advertisement used a new typeface.", "Some existing customers saw the advertisement.", "May has thirty-one days.", "The advertising invoice was paid in June."],
        "A competitor's closure supplies a strong alternative cause for the sales increase.");
      if (variant === 2) return mcq(id,
        `${label} added brighter lighting to a crossing and reported fewer night-time accidents. Which additional evidence would most strengthen the claim that the lighting caused the reduction?`,
        ["Accidents did not fall at similar nearby crossings whose lighting was unchanged.", "The new lamps consume less electricity.", "Several residents like the lamp design.", "Daytime traffic also uses the crossing.", "The installation took two evenings."],
        "The unchanged comparison crossings make a general regional decline less plausible and strengthen the causal explanation.");
      return mcq(id,
        `${label} replaced paper instructions with illustrated ones, after which task errors fell. Which additional evidence would most strengthen the claim that the illustrated instructions caused the improvement?`,
        ["A comparable site retaining paper instructions showed no fall in errors over the same period.", "The illustrations used several colours.", "Managers preferred the new pages.", "Printing the old instructions was inexpensive.", "Some experienced staff made no errors before the change."],
        "A comparable control site helps isolate the changed instructions as the cause. The other facts do not test that causal link.");
    case "reasoning-error":
      if (variant === 1) return mcq(id,
        `Whenever ${label} closes early, a notice appears at the entrance. A notice is at the entrance today, so the manager concludes that it must be closing early. Which option identifies the main flaw?`,
        ["It treats a necessary consequence of early closing as proof that early closing occurred.", "It assumes notices can be read.", "It attacks the manager personally.", "It draws no conclusion from the notice.", "It proves that the organisation never closes early."],
        "The argument affirms the consequent: other circumstances could also cause a notice to appear.");
      if (variant === 2) return mcq(id,
        `${label} argues: either we cancel every public event or noise complaints will continue forever. Complaints cannot continue forever, so every event must be cancelled. Which option identifies the main flaw?`,
        ["It ignores intermediate measures that might reduce complaints without cancelling every event.", "It relies on too much numerical evidence.", "It attacks people who make complaints.", "It assumes all events are profitable.", "It concludes that noise does not exist."],
        "The argument presents a false dilemma, excluding quieter events, limits and other possible remedies.");
      return mcq(id,
        `${label} asked people attending its weekend event whether the event should receive more funding. Most agreed, so the organiser claims that all local residents support more funding. Which option identifies the main flaw?`,
        ["The sample is biased towards people already interested in the event.", "The survey asked too many people.", "The conclusion merely restates a premise.", "The organiser proves that funding has no benefits.", "The argument relies on a mathematical contradiction."],
        "Event attendees are not representative of all local residents, so their views cannot justify the population-wide conclusion.");
    case "matching-arguments":
      if (variant === 1) return mcq(id,
        `Whenever ${label} runs a late session, the side gate is unlocked. The side gate is unlocked tonight, so a late session must be running. Which argument has the same pattern of reasoning?`,
        ["If the boiler is operating, the pipe is warm. The pipe is warm, so the boiler must be operating.", "If the boiler is operating, the pipe is warm. The pipe is cold, so the boiler is not operating.", "The boiler is operating, so the pipe is warm.", "The pipe is warm because the room is warm.", "Either the boiler operates or the pipe is replaced."],
        "Both arguments affirm the consequent: if P then Q; Q; therefore P.");
      if (variant === 2) return mcq(id,
        `The ${label} delivery is arriving by rail or by road. It is not arriving by rail, so it is arriving by road. Which argument has the same logical structure?`,
        ["The appointment is on Monday or Wednesday. It is not on Monday, so it is on Wednesday.", "If the appointment is Monday, Kim attends. Kim attends, so it is Monday.", "The appointment is Monday and Wednesday, so it is Monday.", "The appointment is not Monday because Monday is busy.", "If Monday is unavailable, the appointment is cancelled."],
        "Both eliminate one of two stated alternatives and infer the remaining alternative.");
      return mcq(id,
        `If a parcel processed by ${label} has cleared inspection, its code appears on the release list. Parcel K's code is not on the list, so Parcel K has not cleared inspection. Which argument has the same logical structure?`,
        ["If a room is booked, it appears on the timetable. Room J is absent from the timetable, so it is not booked.", "If a room is booked, it appears on the timetable. It appears there, so it is booked.", "Room J is booked and therefore has a door.", "If a room is booked, it appears on the timetable. Room J is booked, so it appears there.", "Room J is absent because the timetable is printed weekly."],
        "Both use modus tollens: if P then Q; not Q; therefore not P.");
    case "applying-principles":
      if (variant === 1) return mcq(id,
        `Principle: a person should not be blamed for harm that they could neither reasonably foresee nor prevent. Which judgement by ${label} best conforms to this principle?`,
        ["Do not blame a careful driver who could not avoid debris that fell without warning.", "Blame a technician who knowingly disabled a safety alarm.", "Blame a seller who concealed a known defect.", "Blame a cyclist who ignored a closed-road sign.", "Blame a manager who refused to repair a reported hazard."],
        "Only the first person could neither reasonably foresee nor prevent the harm; the others ignored known or signalled risks.");
      if (variant === 2) return mcq(id,
        `Principle: a rule is fair only if it applies equally to those who create it and those affected by it. Which decision by ${label} best conforms to this principle?`,
        ["Require managers and visitors alike to follow the same booking deadline.", "Allow managers to ignore the deadline they imposed on visitors.", "Fine visitors but exempt staff for identical conduct.", "Change the rule whenever a director is inconvenienced.", "Apply the rule only to people unable to appeal."],
        "Applying the same deadline to decision-makers and other users satisfies the stated consistency requirement.");
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
