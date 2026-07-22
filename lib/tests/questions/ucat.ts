import type { MCQOption, MCQOptionKey, MCQQuestion } from "./types";

const truth: MCQOption[] = [{ key: "A", text: "True" }, { key: "B", text: "False" }, { key: "C", text: "Can't Tell" }];
const four = (items: string[]): MCQOption[] => items.map((text, index) => ({ key: "ABCD"[index] as MCQOptionKey, text }));
const question = (id: string, topicId: string, prompt: string, options: MCQOption[], answer: MCQOptionKey, solution: string, context?: string, difficulty: 1 | 2 | 3 = 2): MCQQuestion => ({ id, type: "mcq", testId: "ucat", topicId, difficulty, marks: 1, question: prompt, options, answer, solution, context });

const vrContexts = [
  {
    text: "A university café replaced disposable cups with a deposit scheme. Customers pay £2 extra and recover it when returning the cup. In the first month, 82% of cups were returned. The café used more staff time washing cups but purchased fewer disposables. The trial did not compare the total carbon emissions of the two systems.",
    items: [
      ["More than four-fifths of cups were returned.", "A", "82% is more than four-fifths."],
      ["The scheme reduced every operating cost.", "B", "Washing required more staff time."],
      ["The reusable system definitely produced fewer carbon emissions.", "C", "Total emissions were not compared."],
      ["Customers could recover the deposit by returning a cup.", "A", "This is stated directly."],
    ],
  },
  {
    text: "A wetland restoration project blocked old drainage channels. Water levels rose and two bird species returned to breed. Nearby farmers reported that one access track flooded more often, although rainfall that year was above average. Ecologists plan to monitor the site for five years before judging its long-term success.",
    items: [
      ["Two bird species resumed breeding at the site.", "A", "The passage states this."],
      ["Rainfall was below average.", "B", "It was above average."],
      ["The restoration alone caused the track flooding.", "C", "High rainfall is a possible additional cause."],
      ["A final long-term judgement has already been made.", "B", "Five years of monitoring are planned first."],
    ],
  },
] as const;

const vr = vrContexts.flatMap((context, contextIndex) => context.items.map((item, index) => question(`ucat-pr-vr-${contextIndex + 1}-${index + 1}`, "ucat-vr", item[0], truth, item[1] as MCQOptionKey, item[2], context.text, index === 2 ? 3 : 1)));

const dm: MCQQuestion[] = [
  question("ucat-pr-dm-1", "ucat-dm", "All mentors are trained, and some volunteers are mentors. Which conclusion must follow?", four(["Some volunteers are trained", "All trained people are mentors", "All volunteers are trained", "No volunteer is trained"]), "A", "The volunteers who are mentors must also be trained.", undefined, 3),
  question("ucat-pr-dm-2", "ucat-dm", "A fair die is rolled twice. What is the probability that both results exceed 4?", four(["1/9", "1/6", "1/3", "4/9"]), "A", "There are two favourable faces per roll: (2/6)^2=1/9."),
  question("ucat-pr-dm-3", "ucat-dm", "Should clinics send appointment reminders? Which is the strongest argument?", four(["Yes, reminders can reduce missed appointments and wasted capacity.", "Yes, because phones are modern.", "No, because some messages are short.", "No, because clinics existed before texting."]), "A", "Option A is relevant and gives a plausible practical consequence."),
  question("ucat-pr-dm-4", "ucat-dm", "Four jobs J, K, L and M are scheduled. J is before K; L is last; M is not first. Which order is possible?", four(["J,M,K,L", "M,J,L,K", "K,J,M,L", "J,L,M,K"]), "A", "Only J,M,K,L satisfies all constraints."),
  question("ucat-pr-dm-5", "ucat-dm", "Of 90 people, 50 use app A, 45 use app B and 20 use both. How many use neither?", four(["5", "15", "20", "25"]), "B", "At least one=50+45-20=75; neither=15."),
  question("ucat-pr-dm-6", "ucat-dm", "A treatment succeeds with probability 0.7. What is the probability it fails in two independent patients?", four(["0.09", "0.21", "0.30", "0.49"]), "A", "Failure probability is 0.3, so 0.3×0.3=0.09."),
  question("ucat-pr-dm-7", "ucat-dm", "A code has one of 3 letters followed by two different digits chosen from 1–4. How many codes are possible?", four(["18", "24", "36", "48"]), "C", "3×4×3=36."),
  question("ucat-pr-dm-8", "ucat-dm", "Exactly one of P and Q is true. If Q is true, which must follow?", four(["P is true", "P is false", "Both are true", "Neither is true"]), "B", "Exactly one is true, so Q true forces P false."),
];

const qr: MCQQuestion[] = [
  question("ucat-pr-qr-1", "ucat-qr", "A clinic sees 84 patients in 7 equal sessions. What is the mean per session?", four(["10", "12", "14", "16"]), "B", "84÷7=12.", undefined, 1),
  question("ucat-pr-qr-2", "ucat-qr", "A medicine dose is 6 mg per kg. What dose is required for a 55 kg patient?", four(["300 mg", "320 mg", "330 mg", "360 mg"]), "C", "6×55=330 mg."),
  question("ucat-pr-qr-3", "ucat-qr", "A price rises from £80 to £92. What is the percentage increase?", four(["12%", "15%", "18%", "20%"]), "B", "Increase=12; 12/80=15%."),
  question("ucat-pr-qr-4", "ucat-qr", "A 500 ml infusion runs at 125 ml per hour. How long will it take?", four(["2.5 h", "3 h", "4 h", "5 h"]), "C", "500÷125=4 hours."),
  question("ucat-pr-qr-5", "ucat-qr", "Three teams process 48, 63 and 69 forms. What percentage of the total is processed by the third team?", four(["30%", "35%", "38.3%", "40%"]), "C", "Total=180; 69/180×100=38.3%."),
  question("ucat-pr-qr-6", "ucat-qr", "A solution contains drug and water in the ratio 2:7. If the total is 450 ml, how much drug is present?", four(["90 ml", "100 ml", "112.5 ml", "128.6 ml"]), "B", "Drug is 2/9 of 450=100 ml."),
  question("ucat-pr-qr-7", "ucat-qr", "A ward's weekly use falls from 240 units to 204 units. What is the percentage reduction?", four(["12%", "15%", "18%", "36%"]), "B", "Reduction=36; 36/240=15%."),
  question("ucat-pr-qr-8", "ucat-qr", "£1 exchanges for €1.16. Approximately how many pounds are needed for €290?", four(["£232", "£250", "£268", "£336"]), "B", "290÷1.16=250."),
];

const appropriate = four(["A very appropriate thing to do", "Appropriate, but not ideal", "Inappropriate, but not awful", "A very inappropriate thing to do"]);
const important = four(["Very important", "Important", "Of minor importance", "Not important at all"]);
const sjt: MCQQuestion[] = [
  { ...question("ucat-pr-sjt-1", "ucat-sjt", "How appropriate is it to tell the supervisor promptly about the error?", appropriate, "A", "Transparent reporting protects the patient.", "You realise that you wrote an incorrect allergy status on a practice handover sheet."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-2", "ucat-sjt", "How appropriate is it to alter the sheet silently and tell nobody?", appropriate, "C", "Correction is useful, but the relevant team should know an error occurred.", "You realise that you wrote an incorrect allergy status on a practice handover sheet."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-3", "ucat-sjt", "How important is immediate patient safety?", important, "A", "Safety is the primary consideration.", "A student appears unwell while preparing to assist with a clinical task."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-4", "ucat-sjt", "How important is whether reporting might feel awkward?", important, "D", "Personal discomfort is not material compared with safety.", "A student appears unwell while preparing to assist with a clinical task."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-5", "ucat-sjt", "How appropriate is it to acknowledge your uncertainty and seek qualified help?", appropriate, "A", "Recognising limits is safe and professional.", "A patient asks a medication question that you cannot answer confidently."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-6", "ucat-sjt", "How appropriate is it to invent an answer to appear knowledgeable?", appropriate, "D", "Fabrication creates risk and undermines trust.", "A patient asks a medication question that you cannot answer confidently."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-7", "ucat-sjt", "How appropriate is it to discuss the concern privately with the team member?", appropriate, "A", "A respectful private conversation is proportionate.", "A colleague repeatedly makes dismissive comments during group work."), scoringMode: "adjacent" },
  { ...question("ucat-pr-sjt-8", "ucat-sjt", "How appropriate is it to post their name publicly online?", appropriate, "D", "Public exposure is disproportionate and unprofessional.", "A colleague repeatedly makes dismissive comments during group work."), scoringMode: "adjacent" },
];

export const UCAT_QUESTIONS: MCQQuestion[] = [...vr, ...dm, ...qr, ...sjt];
