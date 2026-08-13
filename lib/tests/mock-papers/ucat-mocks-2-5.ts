import type { MCQOption, MCQOptionKey, MCQQuestion } from "../questions/types";

export interface UcatGeneratedMock {
  number: number;
  vr: MCQQuestion[];
  dm: MCQQuestion[];
  qr: MCQQuestion[];
  sjt: MCQQuestion[];
}

const truth: MCQOption[] = [
  { key: "A", text: "True" },
  { key: "B", text: "False" },
  { key: "C", text: "Can't Tell" },
];
const appropriate: MCQOption[] = [
  { key: "A", text: "A very appropriate thing to do" },
  { key: "B", text: "Appropriate, but not ideal" },
  { key: "C", text: "Inappropriate, but not awful" },
  { key: "D", text: "A very inappropriate thing to do" },
];
const important: MCQOption[] = [
  { key: "A", text: "Very important" },
  { key: "B", text: "Important" },
  { key: "C", text: "Of minor importance" },
  { key: "D", text: "Not important at all" },
];

function options(items: string[]): MCQOption[] {
  return items.map((text, index) => ({ key: "ABCD"[index] as MCQOptionKey, text }));
}

function mcq(args: Omit<MCQQuestion, "type" | "testId" | "marks"> & { marks?: number }): MCQQuestion {
  return { ...args, type: "mcq", testId: "ucat", marks: args.marks ?? 1 };
}

const vrSubjects = [
  ["library", "extended evening opening", "weekly visits", "noise complaints", "student satisfaction", "maintenance costs"],
  ["bus network", "express morning service", "passenger numbers", "average delays", "commuter approval", "weekend demand"],
  ["community garden", "shared tool scheme", "active members", "tool losses", "member approval", "soil quality"],
  ["museum", "late-night programme", "adult attendance", "queue times", "visitor support", "gift-shop sales"],
  ["sports centre", "online booking system", "completed bookings", "missed sessions", "user approval", "staff workload"],
  ["recycling service", "food-waste collection", "participating homes", "general waste", "resident support", "collection emissions"],
  ["rail station", "platform information screens", "reported confusion", "boarding delays", "passenger approval", "installation cost"],
  ["school", "phone-free lunch period", "club participation", "playground incidents", "pupil support", "academic attainment"],
  ["market", "cashless payment trial", "completed purchases", "checkout time", "trader support", "customer privacy"],
  ["park", "new lighting route", "evening users", "reported falls", "local support", "wildlife effects"],
  ["clinic", "online check-in pilot", "check-in completion", "desk queues", "patient support", "clinical outcomes"],
] as const;

function buildVr(mock: number): MCQQuestion[] {
  return vrSubjects.flatMap((subject, index) => {
    const [place, initiative, mainMetric, secondMetric, , omitted] = subject;
    const before = 70 + mock * 7 + index * 5;
    const after = before + 18 + (index % 4) * 3;
    const reduction = 4 + ((mock + index) % 7);
    const support = 61 + ((mock * 3 + index * 2) % 24);
    const code = `${place}-${mock}-${index + 1}`;
    const context = `A ${place} tested a ${initiative} at ${3 + (index % 4)} volunteer sites. ${mainMetric} rose from ${before} to ${after} per week, while ${secondMetric} fell by ${reduction}%. A survey found ${support}% support for continuing the pilot. The evaluation did not measure ${omitted}, and its authors warned that volunteer sites may not represent every location.`;
    return [
      mcq({ id: `ucat-m${mock}-vr-${index + 1}-1`, topicId: "ucat-vr", difficulty: 1, question: `In the ${code} evaluation, ${mainMetric} increased.`, options: truth, answer: "A", solution: `${mainMetric} rose from ${before} to ${after}, so the statement is directly supported.`, context }),
      mcq({ id: `ucat-m${mock}-vr-${index + 1}-2`, topicId: "ucat-vr", difficulty: 2, question: `The ${code} evaluation proves that the initiative alone caused every reported change.`, options: truth, answer: "C", solution: "The report describes a pilot but does not establish exclusive causation or rule out other influences.", context }),
      mcq({ id: `ucat-m${mock}-vr-${index + 1}-3`, topicId: "ucat-vr", difficulty: 2, question: `In the ${code} survey, fewer than half supported continuing the pilot.`, options: truth, answer: "B", solution: `${support}% is greater than half, so the statement contradicts the passage.`, context }),
      mcq({ id: `ucat-m${mock}-vr-${index + 1}-4`, topicId: "ucat-vr", difficulty: 3, question: `The ${code} report did not assess ${omitted}.`, options: truth, answer: "A", solution: `The passage explicitly identifies ${omitted} as an unmeasured outcome.`, context }),
    ];
  });
}

const setWords = [
  ["orchids", "plants", "minerals", "samples"], ["surgeons", "clinicians", "visitors", "trainees"],
  ["novels", "books", "journals", "loans"], ["salmon", "fish", "mammals", "sightings"],
  ["trams", "vehicles", "bicycles", "journeys"], ["enzymes", "proteins", "lipids", "molecules"],
  ["judges", "lawyers", "witnesses", "volunteers"],
] as const;

function rotateAnswer(correct: string, slot: number): { list: string[]; answer: MCQOptionKey } {
  const wrong = [String(Number(correct) + 3), String(Math.max(0, Number(correct) - 2)), String(Number(correct) + 7)];
  const list = wrong.slice();
  list.splice(slot, 0, correct);
  return { list, answer: "ABCD"[slot] as MCQOptionKey };
}

function buildDm(mock: number): MCQQuestion[] {
  const matrix = setWords.map(([a, b, c, d], index) => mcq({
    id: `ucat-m${mock}-dm-matrix-${index + 1}`, topicId: "ucat-dm", difficulty: 3, marks: 2,
    question: `For classification study ${mock}-${index + 1} on ${a} and ${c}, decide whether each conclusion follows.`,
    context: `Study ${mock}-${index + 1} states: all ${a} are ${b}; no ${c} are ${b}; some ${d} are ${c}.`,
    options: [{ key: "A", text: "Yes" }, { key: "B", text: "No" }], answer: "A",
    responseMode: "matrix",
    statements: [
      { id: "1", text: `No ${a} are ${c}` }, { id: "2", text: `Some ${d} are not ${b}` },
      { id: "3", text: `All ${b} are ${a}` }, { id: "4", text: `Some ${c} are ${a}` },
      { id: "5", text: `No ${d} are ${b}` },
    ],
    matrixAnswer: ["yes", "yes", "no", "no", "no"],
    solution: `Use the two disjoint sets ${b} and ${c}; only the stated existence claim about some ${d} can be carried through.`,
  }));

  const issues = ["vaccination reminders", "protected cycle lanes", "library fines", "school breakfast clubs", "remote consultations", "reusable packaging", "later bus services"];
  const argumentQuestions = issues.map((issue, index) => {
    const slot = (mock + index) % 4;
    const good = `Yes, because evidence about ${issue} indicates a direct, relevant benefit that can be measured.`;
    const distractors = ["Yes, because change is always popular.", "No, because the proposal has a long name.", "No, because a different policy existed years ago."];
    const list = distractors.slice(); list.splice(slot, 0, good);
    return mcq({ id: `ucat-m${mock}-dm-arg-${index + 1}`, topicId: "ucat-dm", difficulty: index > 3 ? 3 : 2, question: `For proposal ${mock}-${index + 1}, should the council support ${issue}? Which is the strongest argument?`, options: options(list), answer: "ABCD"[slot] as MCQOptionKey, solution: "The strongest argument directly addresses the proposal and identifies a relevant, testable consequence." });
  });

  const numerics = Array.from({ length: 7 }, (_, index) => {
    const red = 2 + ((mock + index) % 5);
    const blue = 3 + ((mock * 2 + index) % 5);
    const total = red + blue + 3;
    const numerator = red * (red - 1);
    const denominator = total * (total - 1);
    const value = Math.round((numerator / denominator) * 1000) / 1000;
    const slot = (mock + index * 2) % 4;
    const wrong = [Math.max(0.001, value + 0.05), Math.max(0.001, value - 0.04), Math.min(0.999, value + 0.12)].map((item) => item.toFixed(3));
    const list = wrong.slice(); list.splice(slot, 0, value.toFixed(3));
    return mcq({ id: `ucat-m${mock}-dm-prob-${index + 1}`, topicId: "ucat-dm", difficulty: index < 2 ? 1 : 2, question: `Box ${mock}${index + 1} contains ${red} red, ${blue} blue and 3 green tokens. Two are drawn without replacement. What is the probability both are red?`, options: options(list), answer: "ABCD"[slot] as MCQOptionKey, solution: `Multiply ${red}/${total} by ${red - 1}/${total - 1}; this gives ${numerator}/${denominator}, approximately ${value.toFixed(3)}.` });
  });

  const logic = Array.from({ length: 7 }, (_, index) => {
    const names = ["J", "K", "L", "M", "N"].map((letter) => `${letter}${mock}${index + 1}`);
    const [j, k, l, m, n] = names;
    const valid = `${j},${l},${m},${k},${n}`;
    const slot = (mock + index) % 4;
    const list = [`${k},${j},${l},${m},${n}`, `${j},${m},${l},${k},${n}`, `${l},${m},${j},${n},${k}`];
    list.splice(slot, 0, valid);
    return mcq({ id: `ucat-m${mock}-dm-logic-${index + 1}`, topicId: "ucat-dm", difficulty: 3, question: `Five tasks ${names.join(", ")} are ordered. ${j} is before ${k}; ${m} is immediately after ${l}; ${n} is last. Which order is possible?`, options: options(list), answer: "ABCD"[slot] as MCQOptionKey, solution: `${valid} is the only option satisfying the precedence pair, the adjacent pair and the final-position rule.` });
  });

  const data = Array.from({ length: 7 }, (_, index) => {
    const total = 100 + mock * 10 + index * 5;
    const first = 55 + mock + index * 2;
    const second = 42 + mock + index;
    const both = 18 + (index % 5);
    const neither = total - (first + second - both);
    const slot = (mock * 2 + index) % 4;
    const answerSet = rotateAnswer(String(neither), slot);
    return mcq({ id: `ucat-m${mock}-dm-data-${index + 1}`, topicId: "ucat-dm", difficulty: 2, question: `In survey ${mock}-${index + 1}, ${total} people were asked: ${first} chose A, ${second} chose B and ${both} chose both. How many chose neither?`, options: options(answerSet.list), answer: answerSet.answer, solution: `At least one = ${first}+${second}-${both}=${total - neither}; subtracting from ${total} gives ${neither}.` });
  });
  return [...matrix, ...argumentQuestions, ...numerics, ...logic, ...data];
}

const qrNames = ["Outpatient visits", "Blood samples", "Training hours", "Supply deliveries", "Screening calls", "Ward meals", "Research forms", "Travel claims", "Pharmacy requests"];

function numericOptions(correct: number, slot: number, suffix = ""): MCQOption[] {
  const candidates = [correct * 0.8, correct * 0.9, correct * 1.1, correct * 1.25];
  const list = candidates.slice(0, 3);
  list.splice(slot, 0, correct);
  return list.map((value, index) => ({ key: "ABCD"[index] as MCQOptionKey, text: `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}` }));
}

function buildQr(mock: number): MCQQuestion[] {
  return qrNames.flatMap((name, index) => {
    const base = 60 + mock * 12 + index * 9;
    const values = [base, base + 24, base + 12, base + 36];
    const total = values.reduce((sum, value) => sum + value, 0);
    const mean = total / 4;
    const difference = values[3] - values[0];
    const percent = values[1] / total * 100;
    const labels = ["Mon", "Tue", "Wed", "Thu"];
    const context = `${name}, dataset ${mock}-${index + 1}: ${labels.map((label, valueIndex) => `${label} ${values[valueIndex]}`).join("; ")}.`;
    const rows: Array<[string, number, string, string]> = [
      [`What is the total in ${name} dataset ${mock}-${index + 1}?`, total, "", `Adding all four values gives ${total}.`],
      [`What is the mean in ${name} dataset ${mock}-${index + 1}?`, mean, "", `The total ${total} divided by four is ${mean}.`],
      [`What is the Thursday-Monday difference in ${name} dataset ${mock}-${index + 1}?`, difference, "", `Subtract Monday from Thursday: ${values[3]}-${values[0]}=${difference}.`],
      [`Approximately what percentage of ${name} dataset ${mock}-${index + 1} is Tuesday?`, percent, "%", `${values[1]}/${total} x 100 is approximately ${percent.toFixed(1)}%.`],
    ];
    return rows.map((row, rowIndex) => {
      const slot = (mock + index + rowIndex) % 4;
      return mcq({ id: `ucat-m${mock}-qr-${index + 1}-${rowIndex + 1}`, topicId: "ucat-qr", difficulty: ([1, 1, 2, 3] as const)[rowIndex], question: row[0], options: numericOptions(row[1], slot, row[2]), answer: "ABCD"[slot] as MCQOptionKey, solution: row[3], context });
    });
  });
}

type SjtBlueprint = {
  title: string;
  context: string;
  mode: "appropriate" | "important";
  actions: Array<[string, MCQOptionKey, string]>;
};

const sjtBlueprints: SjtBlueprint[] = [
  { title: "visible patient record", context: "a patient name is visible in the background of a photograph shared by another student", mode: "appropriate", actions: [["ask privately for the image to be removed immediately", "A", "This promptly limits a confidentiality breach."], ["share the image with friends", "D", "Further sharing compounds the breach."], ["ignore it because the disclosure was accidental", "D", "Accidental disclosure still requires action."], ["inform an appropriate supervisor if it is not removed", "A", "Escalation is proportionate if the risk continues."], ["post a public accusation naming the student", "D", "Public shaming is disproportionate and creates another professionalism concern."], ["explain the confidentiality risk calmly", "A", "A private explanation supports learning and prompt correction."]] },
  { title: "unwell colleague", context: "a colleague appears dizzy before assisting with a patient procedure", mode: "important", actions: [["the immediate risk to the patient", "A", "Patient safety is the primary consideration."], ["whether the colleague may need medical help", "A", "The colleague's welfare also needs prompt attention."], ["whether raising concern feels awkward", "D", "Personal awkwardness is not material to safety."], ["whether cover can be arranged", "B", "Continuity matters after immediate safety is secured."], ["whether the colleague is usually popular", "D", "Popularity is irrelevant."], ["whether a supervisor has been informed", "A", "A responsible senior should coordinate the response."]] },
  { title: "medicine uncertainty", context: "a patient asks a medicine question that the student cannot answer confidently", mode: "appropriate", actions: [["admit uncertainty and seek a qualified clinician", "A", "Recognising limits protects the patient."], ["invent a plausible answer", "D", "Fabrication creates direct risk."], ["check an approved source with supervision", "A", "Verified information and supervision are appropriate."], ["change the subject without explanation", "C", "Avoidance is unhelpful but creates less risk than fabrication."], ["promise that there can be no side effects", "D", "An absolute unsupported assurance is unsafe."], ["thank the patient for asking and arrange an answer", "A", "This is honest and patient-centred."]] },
  { title: "assessment dishonesty", context: "a peer says they copied part of a required clinical reflection", mode: "appropriate", actions: [["encourage the peer to disclose and correct it", "A", "Prompt honest correction is proportionate."], ["copy the same text", "D", "This repeats the misconduct."], ["ignore it because no patient was harmed", "C", "Integrity remains relevant even without immediate harm."], ["seek confidential advice from the responsible tutor", "A", "Confidential guidance supports fair handling."], ["threaten the peer publicly", "D", "Threats and publicity are disproportionate."], ["offer to help them produce original work", "B", "Support is useful but does not replace disclosure."]] },
  { title: "demeaning comment", context: "a team member makes a dismissive comment about a patient's background", mode: "appropriate", actions: [["challenge the comment calmly at an appropriate moment", "A", "Respectful challenge protects dignity."], ["join in to avoid tension", "D", "Participation endorses discriminatory behaviour."], ["check whether the patient was affected", "A", "The patient's welfare and dignity matter."], ["spread the story as gossip", "D", "Gossip is unprofessional."], ["seek senior support if behaviour persists", "A", "Repeated conduct warrants escalation."], ["assume intention matters more than impact", "C", "Intent is relevant but does not erase impact."]] },
  { title: "missed handover detail", context: "a student realises that an important observation was omitted from a handover", mode: "appropriate", actions: [["contact the receiving team promptly", "A", "Timely correction protects continuity and safety."], ["wait until the next scheduled meeting", "D", "Delay may expose the patient to avoidable risk."], ["document the correction accurately", "A", "The record should show what was corrected."], ["alter the record to hide the omission", "D", "Concealment breaches honesty."], ["tell the supervisor what happened", "A", "Open reporting enables oversight."], ["blame another student without evidence", "D", "Unsupported blame is unfair and unhelpful."]] },
  { title: "consent concern", context: "a patient seems not to understand a procedure they are about to undergo", mode: "important", actions: [["whether the patient can explain the decision in their own words", "A", "Understanding is central to valid consent."], ["whether there is time pressure", "C", "Time pressure cannot override valid consent."], ["whether a qualified clinician can clarify", "A", "Appropriate clarification is needed."], ["whether the student wants the list to run on time", "D", "Personal convenience is irrelevant."], ["whether communication support is required", "A", "Language or accessibility support may be essential."], ["whether concerns are documented", "B", "Accurate documentation supports continuity."]] },
  { title: "infection-control lapse", context: "a colleague repeatedly skips a required hand-hygiene step", mode: "appropriate", actions: [["give an immediate discreet reminder", "A", "A prompt reminder addresses the safety risk."], ["say nothing because the colleague is senior", "D", "Hierarchy does not remove the duty to protect patients."], ["follow the required procedure personally", "A", "Good practice should continue."], ["report persistent unsafe behaviour through the proper route", "A", "Repeated risk may require escalation."], ["mock the colleague in front of patients", "D", "Humiliation is unprofessional."], ["assume no infection means the lapse was acceptable", "D", "A fortunate outcome does not make unsafe conduct acceptable."]] },
  { title: "overloaded teammate", context: "a teammate says their workload is becoming unsafe", mode: "appropriate", actions: [["listen and clarify the immediate risks", "A", "Understanding the risk is the first step."], ["tell them everyone is busy and walk away", "D", "Dismissal leaves a safety concern unresolved."], ["help prioritise tasks within your competence", "A", "Practical support can reduce risk."], ["alert the responsible senior", "A", "Workload safety requires coordinated action."], ["take on a task beyond your competence", "D", "Unsafe substitution creates another risk."], ["agree a follow-up after urgent work is covered", "B", "Follow-up is useful after immediate risks are managed."]] },
  { title: "documentation error", context: "a student notices that they entered an incorrect allergy status in a training record", mode: "appropriate", actions: [["correct it using the approved process", "A", "Records should be corrected transparently."], ["delete evidence that an error occurred", "D", "Concealment undermines record integrity."], ["tell the relevant supervisor promptly", "A", "Supervision helps assess any consequence."], ["wait to see whether anyone notices", "D", "Delay is unsafe and dishonest."], ["check whether the error affected care", "A", "Potential impact must be assessed."], ["change another person's entry", "D", "Unauthorised alteration is inappropriate."]] },
  { title: "private feedback", context: "two students disagree about how a team task was handled", mode: "important", actions: [["whether feedback can be given privately", "A", "Privacy supports respectful discussion."], ["whether specific examples are available", "A", "Specific evidence makes feedback fairer."], ["whether one student can embarrass the other", "D", "Embarrassment is not a legitimate aim."], ["whether both perspectives can be heard", "A", "Listening supports resolution."], ["whether the disagreement can be turned into gossip", "D", "Gossip worsens conflict."], ["whether a facilitator is needed", "B", "Support may help if direct discussion fails."]] },
  { title: "boundary request", context: "a patient asks a student to connect with them on a personal social-media account", mode: "appropriate", actions: [["decline politely and explain professional boundaries", "A", "A clear, respectful boundary is appropriate."], ["accept to avoid disappointing the patient", "C", "The intention is kind but the boundary is inappropriate."], ["share personal details in return", "D", "This deepens the boundary breach."], ["ask a supervisor for guidance if uncertain", "A", "Seeking guidance is appropriate."], ["ridicule the request", "D", "Ridicule is disrespectful."]] },
];

function buildSjt(mock: number): MCQQuestion[] {
  return sjtBlueprints.flatMap((scenario, scenarioIndex) => {
    const variant = ["morning placement", "community clinic", "teaching ward", "outpatient session"][mock - 2];
    const context = `During a ${variant}, ${scenario.context}.`;
    const count = scenarioIndex < 9 ? 6 : 5;
    return scenario.actions.slice(0, count).map(([action, answer, solution], itemIndex) => mcq({
      id: `ucat-m${mock}-sjt-${scenarioIndex + 1}-${itemIndex + 1}`, topicId: "ucat-sjt",
      difficulty: ([1, 2, 2, 3, 2, 3] as const)[itemIndex],
      question: scenario.mode === "appropriate"
        ? `For the ${scenario.title} situation in the ${variant}, how appropriate is it to ${action}?`
        : `For the ${scenario.title} situation in the ${variant}, how important is ${action}?`,
      options: scenario.mode === "appropriate" ? appropriate : important, answer, solution, context, scoringMode: "adjacent",
    }));
  });
}

export const UCAT_GENERATED_MOCKS: UcatGeneratedMock[] = [2, 3, 4, 5].map((number) => ({
  number,
  vr: buildVr(number),
  dm: buildDm(number),
  qr: buildQr(number),
  sjt: buildSjt(number),
}));
