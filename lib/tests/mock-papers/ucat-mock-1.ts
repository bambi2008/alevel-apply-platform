import type { MCQOption, MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";

const truthOptions: MCQOption[] = [
  { key: "A", text: "True" }, { key: "B", text: "False" }, { key: "C", text: "Can't Tell" },
];
const sjtAppropriate: MCQOption[] = [
  { key: "A", text: "A very appropriate thing to do" },
  { key: "B", text: "Appropriate, but not ideal" },
  { key: "C", text: "Inappropriate, but not awful" },
  { key: "D", text: "A very inappropriate thing to do" },
];
const sjtImportant: MCQOption[] = [
  { key: "A", text: "Very important" }, { key: "B", text: "Important" },
  { key: "C", text: "Of minor importance" }, { key: "D", text: "Not important at all" },
];

function mcq(id: string, topicId: string, question: string, options: MCQOption[], answer: MCQOptionKey, solution: string, context?: string, difficulty: 1 | 2 | 3 = 2): MCQQuestion {
  return { id, type: "mcq", testId: "ucat", topicId, difficulty, marks: 1, question, options, answer, solution, context };
}

const vrPassages = [
  {
    text: "A city introduced low-traffic neighbourhoods in three districts. Traffic counts fell inside the zones, while several boundary roads became busier during the first six months. Bus journey times improved slightly, but the evaluation did not measure retail sales. A resident survey found that supporters valued quieter streets; opponents were chiefly concerned about displaced traffic. The council will review the scheme after collecting a full year of data.",
    items: [
      ["Traffic decreased on every road measured.", "B", "Boundary roads became busier."],
      ["The evaluation established that retail sales increased.", "C", "Retail sales were not measured."],
      ["Some supporters mentioned quieter streets.", "A", "This is stated directly."],
      ["The council has permanently adopted the scheme.", "B", "A later review is still planned."],
    ],
  },
  {
    text: "Researchers compared two methods of storing donated blood. The newer method preserved a higher proportion of red cells after four weeks, but it cost more and required equipment unavailable in many small hospitals. The study used laboratory measures rather than patient outcomes. Its authors recommended a clinical trial before widespread adoption.",
    items: [
      ["The newer method was cheaper than the existing method.", "B", "It cost more."],
      ["Patient recovery was better with the newer method.", "C", "Patient outcomes were not measured."],
      ["Small hospitals may face practical barriers to using the newer method.", "A", "Required equipment is not widely available there."],
      ["The authors opposed any further research.", "B", "They recommended a clinical trial."],
    ],
  },
  {
    text: "An archive digitised 40,000 letters written between 1880 and 1920. Optical character recognition worked well on typed pages but poorly on unusual handwriting, so volunteers corrected many transcripts. Search statistics show that family historians are the largest user group. Scholars have warned that letters from wealthy households are overrepresented because they were more likely to be preserved.",
    items: [
      ["Every digitised letter was typed.", "B", "Many letters were handwritten."],
      ["Volunteers helped improve transcript accuracy.", "A", "They corrected transcripts."],
      ["Most surviving letters were written by wealthy people.", "C", "Overrepresentation does not establish an absolute majority."],
      ["The archive gives a perfectly representative picture of the period.", "B", "The preservation bias prevents that conclusion."],
    ],
  },
  {
    text: "A school replaced one weekly assembly with mixed-age tutoring. Older pupils received brief training before helping younger pupils with reading. After one term, younger pupils read more fluently on average, although there was no comparison school. Older pupils reported greater confidence in explaining ideas. Teachers noted that attendance varied between groups.",
    items: [
      ["Older pupils received no preparation.", "B", "They received brief training."],
      ["The programme definitely caused the improvement in reading.", "C", "Without a comparison group, causation is not established."],
      ["Older pupils reported a benefit of participating.", "A", "They reported greater explanatory confidence."],
      ["Attendance was identical in all groups.", "B", "Teachers observed variation."],
    ],
  },
  {
    text: "Marine biologists attached temporary sensors to 18 seals. During storms, the seals generally dived deeper and stayed underwater longer. Water temperature also changed, making it difficult to isolate the effect of wave conditions. The tags detached as designed after two months; data from two tags were not recovered.",
    items: [
      ["Data were recovered from all 18 sensors.", "B", "Two tags were not recovered."],
      ["Storms were associated with changes in diving behaviour.", "A", "The observed dives were deeper and longer."],
      ["Water temperature had no possible influence on the results.", "B", "It was a confounding change."],
      ["The sensors harmed the seals.", "C", "No effect on animal welfare is reported."],
    ],
  },
  {
    text: "A rural library began lending tools as well as books. Members can borrow drills, sewing machines and gardening equipment after completing a short safety induction. Most tools were donated, but electrical items are inspected annually by a contractor. Demand is highest in spring. The library has not yet calculated whether the scheme saves members money.",
    items: [
      ["Members may borrow electrical tools without any induction.", "B", "A safety induction is required."],
      ["Every tool was donated.", "B", "Most, not all, were donated."],
      ["Spring is the busiest season for tool borrowing.", "A", "Demand is highest then."],
      ["The scheme has been proven to save members money.", "C", "That calculation has not been made."],
    ],
  },
  {
    text: "A museum tested labels written at two reading levels. Visitors spent longer at exhibits with the simpler labels and were more likely to answer factual questions correctly. However, the trial took place only in the natural history gallery and lasted three weekends. Some specialists worried that simplifying language could remove useful nuance.",
    items: [
      ["Simpler labels were associated with longer viewing times.", "A", "This was observed."],
      ["The trial covered every museum gallery.", "B", "It covered one gallery."],
      ["All specialists supported simpler labels.", "B", "Some expressed concern."],
      ["The findings will certainly be identical on weekdays.", "C", "Only weekends were studied."],
    ],
  },
  {
    text: "Farmers in one region planted flower strips beside cereal fields. Fields with strips contained more species of wild bee, but cereal yield did not differ significantly from neighbouring fields without strips. The researchers recorded insects for one summer. They cautioned that unusually dry weather may have affected both flowering and bee activity.",
    items: [
      ["Flower strips were linked to greater bee diversity.", "A", "More wild bee species were recorded."],
      ["Cereal yield was significantly higher beside flower strips.", "B", "No significant difference was found."],
      ["The research covered several consecutive summers.", "B", "It covered one summer."],
      ["Normal rainfall would have produced the same result.", "C", "The study cannot establish that."],
    ],
  },
  {
    text: "A software company trialled a four-day week without reducing salaries. Output per employee remained similar, and reported stress declined. The trial coincided with the cancellation of one large project, so workloads were lower than usual in two teams. Staff turnover was not assessed because the six-month period was considered too short.",
    items: [
      ["Employees received lower salaries during the trial.", "B", "Salaries were unchanged."],
      ["Reported stress fell.", "A", "This is stated."],
      ["The four-day week alone caused every observed change.", "C", "Workload changes complicate causal attribution."],
      ["The study demonstrated a reduction in staff turnover.", "C", "Turnover was not assessed."],
    ],
  },
  {
    text: "Astronomers detected a periodic dimming of a nearby star. One explanation is an orbiting planet, but rotating starspots can produce a similar signal. Follow-up measurements found no clear change in the star's motion. The team therefore described the object as a candidate rather than a confirmed planet and scheduled further observations.",
    items: [
      ["An orbiting planet is the only possible explanation.", "B", "Starspots are an alternative."],
      ["The object's status remains uncertain.", "A", "It is described as a candidate."],
      ["Follow-up measurements clearly confirmed stellar motion.", "B", "No clear change was found."],
      ["Further observations have already been completed.", "C", "They are scheduled, not reported as completed."],
    ],
  },
  {
    text: "A hospital introduced text reminders for outpatient appointments. Missed appointments fell from 11% to 8% over the next quarter. During the same period, the booking team began calling patients with appointments requiring special preparation. The hospital did not record how many patients read the texts. Managers plan to compare different reminder timings.",
    items: [
      ["The missed-appointment rate fell by three percentage points.", "A", "It fell from 11% to 8%."],
      ["All patients read their reminder texts.", "C", "Reading was not recorded."],
      ["No other booking process changed during the quarter.", "B", "The team also began making calls."],
      ["Managers intend to test reminder timing.", "A", "A comparison is planned."],
    ],
  },
] as const;

export const UCAT_M1_VR: MCQQuestion[] = vrPassages.flatMap((passage, passageIndex) => passage.items.map((item, index) =>
  mcq(`ucat-m1-vr-${passageIndex + 1}-${index + 1}`, "ucat-vr", item[0], truthOptions, item[1] as MCQOptionKey, item[2], passage.text, index === 3 ? 3 : index === 0 ? 1 : 2),
));

const matrixOptions: MCQOption[] = [{ key: "A", text: "Yes" }, { key: "B", text: "No" }];
const dmMatrices = [
  { stem: "All kelps are algae. No fungi are algae. Some reef organisms are fungi.", rows: [["No kelp is a fungus", "yes"], ["Some reef organisms are not algae", "yes"], ["All algae are kelps", "no"], ["Some fungi are kelps", "no"], ["No reef organism is algae", "no"]] },
  { stem: "Every red token is wooden. Some wooden tokens are square. No square token is metal.", rows: [["Some wooden tokens are not metal", "yes"], ["Every square token is wooden", "no"], ["No red token is metal", "no"], ["Some square tokens are wooden", "yes"], ["Some metal tokens are red", "no"]] },
  { stem: "All consultants are graduates. Some graduates are musicians. No musician is silent.", rows: [["Some graduates are not silent", "yes"], ["All consultants are musicians", "no"], ["No silent person is a musician", "yes"], ["Some consultants are not silent", "no"], ["Every musician is a graduate", "no"]] },
  { stem: "No winter bus is electric. Every route 8 bus is electric. Some depot buses are winter buses.", rows: [["No route 8 bus is a winter bus", "yes"], ["Some depot buses are not electric", "yes"], ["Every electric bus is route 8", "no"], ["No depot bus is route 8", "no"], ["Some winter buses are route 8", "no"]] },
  { stem: "All verified samples are labelled. Some labelled samples are frozen. No damaged sample is verified.", rows: [["No verified sample is damaged", "yes"], ["Some frozen samples are labelled", "yes"], ["All labelled samples are verified", "no"], ["Some damaged samples are unlabelled", "no"], ["No frozen sample is damaged", "no"]] },
  { stem: "Every cedar is a tree. No tree is a mineral. Some exhibits are minerals.", rows: [["No cedar is a mineral", "yes"], ["Some exhibits are not trees", "yes"], ["All trees are cedars", "no"], ["Some exhibits are cedars", "no"], ["No exhibit is a tree", "no"]] },
  { stem: "All priority calls are reviewed. Some reviewed calls are escalated. No routine call is escalated.", rows: [["Some reviewed calls are not routine", "yes"], ["All escalated calls are reviewed", "no"], ["No priority call is routine", "no"], ["Some escalated calls are reviewed", "yes"], ["Some routine calls are priority calls", "no"]] },
];

const matrixQuestions: MCQQuestion[] = dmMatrices.map((item, index) => ({
  ...mcq(`ucat-m1-dm-matrix-${index + 1}`, "ucat-dm", "For each conclusion, decide whether it follows from the information.", matrixOptions, "A", "A conclusion receives Yes only when it must follow from the stated relationships.", item.stem, 3),
  responseMode: "matrix",
  statements: item.rows.map((row, rowIndex) => ({ id: `s${rowIndex + 1}`, text: row[0] })),
  matrixAnswer: item.rows.map((row) => row[1] as "yes" | "no"),
  marks: 2,
}));

const dmArguments = [
  ["Should hospitals provide free parking to all visitors?", "Yes, because parking charges may deter low-income relatives from supporting patients.", "This directly addresses access and patient support."],
  ["Should schools ban all smartphones during lessons?", "Yes, because restricting a common source of distraction can protect teaching time.", "This is relevant and weighs a plausible educational effect."],
  ["Should cities publish restaurant hygiene scores online?", "Yes, because accessible scores help consumers make informed safety choices.", "This directly links publication to informed choice."],
  ["Should organ donation use an opt-out system?", "Yes, if clear safeguards preserve informed refusal while increasing the donor pool.", "The argument addresses both benefit and autonomy."],
  ["Should medical appointments offer video consultations?", "Yes, where clinically suitable, because they can reduce travel barriers without replacing necessary examinations.", "The qualification handles the principal risk."],
  ["Should sugary drinks carry a health levy?", "Yes, if evidence shows price changes reduce consumption and revenue supports prevention.", "It states a relevant mechanism and condition."],
  ["Should universities record large lectures?", "Yes, because recordings can support revision and students who miss class, provided attendance is still encouraged.", "It balances access with a likely objection."],
] as const;

const argumentQuestions = dmArguments.map((item, index) => mcq(
  `ucat-m1-dm-arg-${index + 1}`, "ucat-dm", `${item[0]} Which is the strongest argument?`,
  [
    { key: "A", text: item[1] },
    { key: "B", text: "No, because some people dislike the proposal." },
    { key: "C", text: "Yes, because change is usually exciting." },
    { key: "D", text: "No, because a different policy was unpopular in another country." },
  ], "A", item[2], undefined, 2,
));

const dmNumerics = [
  ["A disease affects 2% of a population. A test detects 90% of cases and gives a false positive to 5% of unaffected people. In 10,000 people, how many positive tests are expected?", ["670", "690", "700", "850"], "A", "True positives = 180; false positives = 490; total = 670."],
  ["A bag has 4 blue, 3 green and 3 red counters. Two are drawn without replacement. What is the probability both are blue?", ["2/15", "4/25", "1/5", "4/15"], "A", "(4/10)(3/9)=12/90=2/15."],
  ["The chance that device A fails is 0.1 and device B fails is 0.2, independently. What is the chance at least one fails?", ["0.02", "0.28", "0.30", "0.32"], "B", "1-(0.9)(0.8)=0.28."],
  ["Three fair coins are tossed. What is the probability of exactly two heads?", ["1/8", "1/4", "3/8", "1/2"], "C", "There are three favourable outcomes among eight."],
  ["A treatment helps 60% of group X and 40% of group Y. A trial has equal numbers from each group. What proportion is expected to benefit?", ["40%", "48%", "50%", "60%"], "C", "The equal-weight average is 50%."],
  ["A spinner has sectors with probabilities 0.2, 0.3 and 0.5. It is spun twice. What is the probability the 0.5 sector appears at least once?", ["0.25", "0.5", "0.75", "1.0"], "C", "1-(0.5)^2=0.75."],
  ["In a survey, 70% use service A, 45% use B and 30% use both. What percentage uses neither?", ["5%", "15%", "25%", "45%"], "B", "A or B = 70+45-30=85%, so neither=15%."],
] as const;
const numericQuestions = dmNumerics.map((item, index) => mcq(`ucat-m1-dm-num-${index + 1}`, "ucat-dm", item[0], (item[1] as readonly string[]).map((text, optionIndex) => ({ key: "ABCD"[optionIndex] as MCQOptionKey, text })), item[2] as MCQOptionKey, item[3], undefined, index > 4 ? 3 : 2));

const dmLogic = [
  ["Five talks P, Q, R, S and T occur once each. P is before Q; R is immediately after S; T is last. Which order is possible?", ["P,S,R,Q,T", "S,P,Q,R,T", "Q,P,S,R,T", "P,R,S,Q,T"], "A", "Only P,S,R,Q,T satisfies all constraints."],
  ["Four samples W, X, Y and Z are tested. X is before Y; W is not first; Z is after Y. Which must be true?", ["X is first", "Z is last", "W is third", "Y is second"], "B", "Since X precedes Y and Z follows Y, Z must be last in a four-item order."],
  ["A clinic opens Mon-Fri. Ali attends before Bea. Chen attends Wednesday. Bea does not attend Friday. Which could be Ali's day?", ["Wednesday", "Thursday", "Friday", "No day"], "A", "Ali may attend Wednesday only if Chen and Ali can share a day; the rules do not prohibit this."],
  ["Six seats are in a row. J sits next to K. L sits at an end. M is not next to J. Which arrangement is possible?", ["L J M K N P", "L J K N M P", "J K M N P L", "L K M J N P"], "B", "Only the second keeps J-K adjacent and M away from J."],
  ["A code contains one vowel followed by two different digits. Digits are chosen from 1, 2, 3. How many codes are possible if the vowel is A or E?", ["6", "9", "12", "18"], "C", "2 vowel choices × 3 × 2 ordered digit choices = 12."],
  ["Exactly one of statements X and Y is true. Y and Z are both true or both false. If X is true, what follows?", ["Y true, Z true", "Y false, Z false", "Y true, Z false", "Cannot tell"], "B", "X true forces Y false; Y and Z match, so Z is false."],
  ["A rota assigns N, O and P to three shifts. N cannot do shift 1 and must be earlier than P; O must be earlier than P. Which assignment is valid?", ["N,O,P", "O,N,P", "P,O,N", "O,P,N"], "B", "Only O,N,P puts both O and N before P while keeping N out of shift 1."],
] as const;
const logicQuestions = dmLogic.map((item, index) => mcq(`ucat-m1-dm-logic-${index + 1}`, "ucat-dm", item[0], item[1].map((text, optionIndex) => ({ key: "ABCD"[optionIndex] as MCQOptionKey, text })), item[2] as MCQOptionKey, item[3], undefined, 3));

const dmData = [
  ["Of 120 volunteers, 70 speak French, 55 speak Spanish and 25 speak both. How many speak neither?", ["15", "20", "25", "30"], "B", "At least one = 70+55-25=100; neither=20."],
  ["In a group of 80, 48 cycle, 36 swim and 20 do both. How many do exactly one activity?", ["24", "40", "44", "64"], "C", "Exactly one=(48-20)+(36-20)=44."],
  ["A survey has 200 responses: 120 prefer tea, 95 coffee and 40 both. How many prefer at least one?", ["135", "160", "175", "215"], "C", "120+95-40=175."],
  ["Among 150 files, 90 are encrypted, 70 compressed and 50 both. How many are encrypted only?", ["20", "40", "50", "90"], "B", "Encrypted only = all encrypted minus both categories: 90-50=40."],
  ["Of 60 patients, 35 received A, 30 received B and 10 received neither. How many received both?", ["5", "10", "15", "25"], "C", "At least one=50, so both=35+30-50=15."],
  ["A cohort has 100 students: 62 study Biology, 51 Chemistry and 28 both. How many study exactly one?", ["29", "57", "85", "113"], "B", "(62-28)+(51-28)=57."],
  ["Of 240 appointments, 150 were in person, 110 by video and 30 used neither category due to cancellation. How many were recorded in both categories?", ["20", "30", "50", "80"], "C", "At least one=210; both=150+110-210=50."],
] as const;
const dataQuestions = dmData.map((item, index) => mcq(`ucat-m1-dm-data-${index + 1}`, "ucat-dm", item[0], (item[1] as readonly string[]).map((text, optionIndex) => ({ key: "ABCD"[optionIndex] as MCQOptionKey, text })), item[2] as MCQOptionKey, item[3], undefined, 2));

export const UCAT_M1_DM: MCQQuestion[] = [...matrixQuestions, ...argumentQuestions, ...numericQuestions, ...logicQuestions, ...dataQuestions];

const qrDatasets = [
  { name: "Clinic appointments", labels: ["Mon", "Tue", "Wed", "Thu"], values: [48, 60, 54, 66], unit: "appointments" },
  { name: "Laboratory samples", labels: ["A", "B", "C", "D"], values: [120, 150, 135, 195], unit: "samples" },
  { name: "Bus passengers", labels: ["07:00", "08:00", "09:00", "10:00"], values: [84, 126, 105, 63], unit: "passengers" },
  { name: "Energy use", labels: ["Ward 1", "Ward 2", "Ward 3", "Ward 4"], values: [320, 280, 360, 240], unit: "kWh" },
  { name: "Medicine stock", labels: ["P", "Q", "R", "S"], values: [75, 90, 60, 105], unit: "packs" },
  { name: "Study participants", labels: ["North", "South", "East", "West"], values: [144, 108, 132, 96], unit: "people" },
  { name: "Water consumption", labels: ["Jan", "Feb", "Mar", "Apr"], values: [210, 180, 240, 270], unit: "litres" },
  { name: "Screening calls", labels: ["Team A", "Team B", "Team C", "Team D"], values: [96, 120, 72, 144], unit: "calls" },
  { name: "Pharmacy orders", labels: ["Site 1", "Site 2", "Site 3", "Site 4"], values: [250, 175, 225, 300], unit: "orders" },
] as const;

function numberOptions(correct: number, slot: number, suffix = ""): MCQOption[] {
  const offsets = [-0.2, -0.1, 0.1, 0.25];
  const wrong = offsets.map((offset) => Math.max(0, correct * (1 + offset)));
  const values = wrong.slice(0, 3);
  values.splice(slot, 0, correct);
  return values.map((value, index) => ({ key: "ABCD"[index] as MCQOptionKey, text: `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}` }));
}

export const UCAT_M1_QR: MCQQuestion[] = qrDatasets.flatMap((dataset, datasetIndex) => {
  const total = (dataset.values as readonly number[]).reduce((sum, value) => sum + value, 0);
  const average = total / dataset.values.length;
  const difference = Math.abs(dataset.values[3] - dataset.values[0]);
  const percentage = dataset.values[1] / total * 100;
  const context = `${dataset.name}: ${dataset.labels.map((label, index) => `${label} = ${dataset.values[index]} ${dataset.unit}`).join("; ")}.`;
  const rows = [
    [`What is the total across all four categories?`, total, "", `Add the four values to obtain ${total}.`],
    [`What is the mean per category?`, average, "", `Divide the total ${total} by 4.`],
    [`What is the difference between ${dataset.labels[3]} and ${dataset.labels[0]}?`, difference, "", `Calculate the absolute difference |${dataset.values[3]}-${dataset.values[0]}|=${difference}.`],
    [`Approximately what percentage of the total is ${dataset.labels[1]}?`, percentage, "%", `${dataset.values[1]}/${total}×100≈${percentage.toFixed(1)}%.`],
  ] as const;
  return rows.map((row, index) => mcq(`ucat-m1-qr-${datasetIndex + 1}-${index + 1}`, "ucat-qr", row[0], numberOptions(row[1], (datasetIndex + index) % 4, row[2]), "ABCD"[(datasetIndex + index) % 4] as MCQOptionKey, row[3], context, index >= 2 ? 2 : 1));
});

type SjtScenario = { context: string; mode: "appropriate" | "important"; items: Array<[string, MCQOptionKey, string]> };
const sjtScenarios: SjtScenario[] = [
  { context: "You are a medical student on placement. You notice that a fellow student has posted a photograph from a ward corridor; a patient name is visible on a board in the background.", mode: "appropriate", items: [
    ["Privately ask the student to remove the post immediately.", "A", "Prompt removal protects confidentiality."],
    ["Ignore it because the patient's face is not shown.", "D", "Identifiable information is still visible."],
    ["Share the post with classmates to ask whether it is acceptable.", "D", "This spreads the breach."],
    ["Inform an appropriate supervisor if the student refuses to remove it.", "A", "Escalation is justified if the risk persists."],
    ["Publicly criticise the student in the comments.", "C", "The concern is valid but public confrontation is disproportionate."],
    ["Check whether the image contains any other identifying details.", "A", "Assessing the extent of the breach is sensible."],
  ]},
  { context: "During a group project, one member has missed two meetings and has not completed an assigned section. They tell you privately that a close relative is seriously ill.", mode: "appropriate", items: [
    ["Listen and ask what support or adjustment would help.", "A", "This is compassionate and constructive."],
    ["Tell the whole group the details without permission.", "D", "Private information should not be disclosed unnecessarily."],
    ["Agree a realistic revised task and deadline with them.", "A", "This balances support and team responsibility."],
    ["Complete all their work indefinitely without discussion.", "C", "Short-term help may be kind, but an open plan is needed."],
    ["Suggest they contact the university support service.", "A", "Signposting is appropriate."],
    ["Remove their name from the project immediately.", "D", "This is punitive and ignores the disclosed circumstances."],
  ]},
  { context: "A patient asks you, as a student, to explain whether a new medicine will interact with several tablets they take. You are unsure.", mode: "appropriate", items: [
    ["Explain that you are unsure and will ask the supervising clinician.", "A", "Recognising limits and seeking help is safe."],
    ["Give your best guess so the patient is not worried.", "D", "Guessing creates avoidable clinical risk."],
    ["Check an approved medicines resource with supervision.", "A", "Using reliable information appropriately is sensible."],
    ["Tell the patient to search social media for experiences.", "D", "This is not a reliable source for interaction advice."],
    ["Avoid answering and leave without telling anyone.", "D", "The concern must be handed over."],
    ["Thank the patient for raising the question.", "B", "This is respectful, though it does not itself resolve the issue."],
  ]},
  { context: "You arrive for a teaching session and smell alcohol on a student who is about to assist with a patient examination. Their speech appears normal.", mode: "important", items: [
    ["The potential risk to the patient.", "A", "Patient safety is the primary concern."],
    ["Whether the student is popular with the group.", "D", "Popularity is irrelevant to safety."],
    ["Whether there may be a non-alcohol explanation for the smell.", "B", "Alternative explanations matter, but do not remove the need to act safely."],
    ["The need to raise the concern discreetly with a supervisor.", "A", "Discreet escalation is important."],
    ["Whether reporting the concern could make the session start late.", "D", "Delay is minor compared with safety."],
    ["Avoiding an unsupported public accusation.", "B", "The concern should be handled fairly and privately."],
  ]},
  { context: "A clinic is running late. An older patient appears confused about where to wait, while staff are occupied with urgent tasks.", mode: "appropriate", items: [
    ["Introduce yourself and check what assistance the patient needs.", "A", "This is respectful and proportionate."],
    ["Guide them to the correct area after confirming with staff.", "A", "This provides practical help safely."],
    ["Assume confusion is normal for their age and walk away.", "D", "This is discriminatory and unsafe."],
    ["Promise they will be seen next.", "D", "You cannot make that promise."],
    ["Alert a staff member if the confusion seems new or concerning.", "A", "A change in cognition may require assessment."],
    ["Ask loudly in the waiting room about their medical history.", "D", "This compromises privacy."],
  ]},
  { context: "You discover that you entered one value incorrectly in a research spreadsheet. Correcting it changes a graph slightly but not the overall conclusion. The report has been sent to your supervisor but not submitted.", mode: "appropriate", items: [
    ["Correct the value and tell the supervisor what changed.", "A", "Transparent correction protects research integrity."],
    ["Leave it because the conclusion is unchanged.", "D", "Accuracy still matters."],
    ["Delete the whole spreadsheet to hide the mistake.", "D", "This destroys the audit trail."],
    ["Check nearby entries for similar errors.", "A", "A targeted quality check is sensible."],
    ["Blame another team member before checking who entered it.", "D", "Unsupported blame is unfair."],
    ["Document the correction in the project record.", "A", "A clear audit trail is good practice."],
  ]},
  { context: "A friend asks you to use your placement login to look up the test results of their relative, who has not given consent.", mode: "appropriate", items: [
    ["Refuse and explain that access is limited to legitimate care purposes.", "A", "This protects confidentiality and system rules."],
    ["Look only at the headline result and tell nobody else.", "D", "Unauthorised access remains a breach."],
    ["Offer to help the relative contact their clinical team instead.", "A", "This provides a legitimate route."],
    ["Ask another student to check using their login.", "D", "This attempts to involve another person in a breach."],
    ["Warn your friend not to make such requests again.", "B", "Boundary-setting is reasonable, though explanation and support are preferable."],
    ["Post the request anonymously online for advice, including the relative's details.", "D", "This further compromises privacy."],
  ]},
  { context: "In a simulated consultation, your partner repeatedly interrupts the simulated patient. Afterwards, they ask for honest feedback.", mode: "appropriate", items: [
    ["Describe a specific interruption and its effect on the conversation.", "A", "Specific, behavioural feedback is useful."],
    ["Say they have no empathy and will be a bad doctor.", "D", "This is personal and unsupported."],
    ["Mention something they did well before discussing improvement.", "A", "Balanced feedback supports learning."],
    ["Tell them everything was fine to avoid discomfort.", "C", "This misses a requested learning opportunity."],
    ["Suggest practising pauses and open questions next time.", "A", "This offers an actionable strategy."],
    ["Discuss their performance loudly where others can hear.", "C", "Feedback should be delivered privately."],
  ]},
  { context: "You are tired after several late nights of revision and are due to drive to an early placement. You notice difficulty concentrating.", mode: "important", items: [
    ["The risk your fatigue poses while driving.", "A", "Immediate safety is critical."],
    ["Whether alternative transport is available.", "A", "A safer practical option matters."],
    ["Whether classmates might think you are disorganised.", "D", "Image should not outweigh safety."],
    ["Informing the placement promptly if you may be delayed.", "B", "Clear communication is important."],
    ["The amount already spent on fuel.", "D", "Sunk cost is irrelevant to current risk."],
    ["Planning sleep and workload differently for future placements.", "B", "Prevention matters after immediate safety is addressed."],
  ]},
  { context: "A patient with limited English nods during an explanation but gives answers suggesting they have not understood a consent form. A relative offers to translate.", mode: "important", items: [
    ["Whether a professional interpreter can be arranged.", "A", "Accurate, impartial communication is central to valid consent."],
    ["Whether the patient can explain the decision back in their own words.", "A", "Checking understanding is essential."],
    ["Finishing quickly because the clinic is busy.", "D", "Time pressure does not justify invalid consent."],
    ["The patient's preference about the relative's involvement.", "A", "Autonomy and privacy matter."],
    ["Whether the form has already been printed.", "D", "Printing is irrelevant."],
    ["Avoiding technical language.", "B", "Clear language supports understanding."],
  ]},
  { context: "A team member makes a dismissive joke about a patient's cultural practice during a private handover. Others look uncomfortable.", mode: "appropriate", items: [
    ["State calmly that the comment is disrespectful and inappropriate.", "A", "Addressing it protects professional standards."],
    ["Laugh so the team member does not feel embarrassed.", "D", "This reinforces the behaviour."],
    ["Refocus the handover on clinically relevant information.", "B", "This helps immediately but may not fully address the conduct."],
    ["Check in with colleagues affected by the comment.", "B", "Support is appropriate."],
    ["Post the person's name and comment on social media.", "D", "Public exposure breaches professionalism."],
    ["Escalate through an appropriate route if the behaviour persists or is serious.", "A", "Proportionate escalation may be necessary."],
  ]},
  { context: "A classmate sends you answers to an online assessment that you have not yet completed.", mode: "appropriate", items: [
    ["Do not use the answers and tell the classmate to stop sharing them.", "A", "This protects academic integrity."],
    ["Use only one answer because the assessment is low stakes.", "D", "The principle does not depend on stakes."],
    ["Delete the message after preserving any evidence required for reporting.", "B", "Avoid retaining or spreading answers while following policy."],
  ]},
];

export const UCAT_M1_SJT: MCQQuestion[] = sjtScenarios.flatMap((scenario, scenarioIndex) => scenario.items.map((item, index) => ({
  ...mcq(`ucat-m1-sjt-${scenarioIndex + 1}-${index + 1}`, "ucat-sjt", scenario.mode === "appropriate" ? `How appropriate is this action? ${item[0]}` : `How important is this consideration? ${item[0]}`, scenario.mode === "appropriate" ? sjtAppropriate : sjtImportant, item[1], item[2], scenario.context, index < 2 ? 1 : index < 5 ? 2 : 3),
  scoringMode: "adjacent" as const,
})));
