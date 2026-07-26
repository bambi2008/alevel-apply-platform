import type { EssayRubricDimension, LongQuestion, MCQQuestion, Question } from "./types";

const option = (key: "A" | "B" | "C" | "D", text: string) => ({ key, text });

const reading: MCQQuestion[] = [
  {
    id: "ielts-r-01", type: "mcq", testId: "ielts", topicId: "ielts-reading", difficulty: 1, marks: 1,
    context: "A university library extended its weekday opening hours after a student survey. Weekend hours were unchanged because fewer than one in ten respondents requested an extension.",
    question: "Which statement is supported by the passage?",
    options: [option("A", "The library now opens longer every day."), option("B", "Most students requested longer weekend hours."), option("C", "Weekday hours changed in response to student feedback."), option("D", "Weekend use fell below ten students.")],
    answer: "C", solution: "The passage explicitly links the weekday extension to the survey. The other options add claims not stated.",
  },
  {
    id: "ielts-r-02", type: "mcq", testId: "ielts", topicId: "ielts-reading", difficulty: 2, marks: 1,
    context: "Early urban tree schemes often counted how many trees were planted. Newer programmes also measure survival after five years, canopy coverage and whether shade reaches the hottest neighbourhoods.",
    question: "What change in evaluation does the writer describe?",
    options: [option("A", "From cost to public opinion"), option("B", "From planting totals to longer-term outcomes and distribution"), option("C", "From urban trees to rural forests"), option("D", "From temperature to rainfall")],
    answer: "B", solution: "The contrast is between a simple input count and measures of survival, coverage and equitable impact.",
  },
  {
    id: "ielts-r-03", type: "mcq", testId: "ielts", topicId: "ielts-reading", difficulty: 2, marks: 1,
    context: "The study found a correlation between students' sleep duration and examination performance. Its authors warned that the design could not show that extra sleep caused higher marks.",
    question: "The statement 'Sleeping longer will improve every student's marks' is:",
    options: [option("A", "True"), option("B", "False"), option("C", "Not Given"), option("D", "A definition")],
    answer: "C", solution: "The study reports correlation and explicitly does not establish causation. It does not prove the universal claim true or false.",
  },
  {
    id: "ielts-r-04", type: "mcq", testId: "ielts", topicId: "ielts-reading", difficulty: 3, marks: 1,
    context: "Remote sensing can reveal where wetlands are shrinking, but satellite images alone rarely explain why. Local hydrology records and interviews with land users are needed to distinguish seasonal variation from lasting damage.",
    question: "What is the author's main argument?",
    options: [option("A", "Satellite data are too inaccurate to use."), option("B", "Interviews should replace scientific measurement."), option("C", "Wetland loss is always caused by land users."), option("D", "Multiple forms of evidence are needed to interpret observed change.")],
    answer: "D", solution: "The passage values remote sensing but argues it must be combined with local records and interviews.",
  },
  {
    id: "ielts-l-01", type: "mcq", testId: "ielts", topicId: "ielts-listening", difficulty: 1, marks: 1,
    context: "Transcript for strategy practice only: 'The workshop was originally listed for Tuesday the fourteenth, but it will now take place on Thursday the sixteenth in Room 204.'",
    question: "What is the revised date?",
    options: [option("A", "Tuesday 14"), option("B", "Thursday 14"), option("C", "Tuesday 16"), option("D", "Thursday 16")],
    answer: "D", solution: "The speaker corrects the original date to Thursday the sixteenth. Use official audio samples for real listening practice.",
  },
  {
    id: "ielts-l-02", type: "mcq", testId: "ielts", topicId: "ielts-listening", difficulty: 2, marks: 1,
    context: "Transcript for strategy practice only: 'The fee is eighty pounds, or sixty-five for bookings received before 3 September. Equipment hire is an additional twelve pounds.'",
    question: "A student books on 1 September and hires equipment. What is the total fee?",
    options: [option("A", "£65"), option("B", "£77"), option("C", "£80"), option("D", "£92")],
    answer: "B", solution: "The early fee is £65 and equipment adds £12, giving £77. Use official audio samples for real listening practice.",
  },
];

const writingRubric: EssayRubricDimension[] = [
  { id: "task", label: "任务回应", maxMarks: 5, description: "覆盖任务要求，选择并发展相关主要信息或立场。" },
  { id: "coherence", label: "连贯与衔接", maxMarks: 5, description: "信息组织清楚，段落推进自然，衔接准确不过度。" },
  { id: "lexical", label: "词汇资源", maxMarks: 5, description: "词汇范围与准确性足以表达细微含义，搭配自然。" },
  { id: "grammar", label: "语法范围与准确性", maxMarks: 5, description: "句式有变化，错误不妨碍理解，标点使用稳定。" },
];

const long: LongQuestion[] = [
  {
    id: "ielts-w-01", type: "long", testId: "ielts", topicId: "ielts-writing", difficulty: 2, totalMarks: 20,
    responseKind: "essay", recommendedWords: [150, 190], maxWords: 240, rubricDimensions: writingRubric,
    essayPrompts: [{ id: "A", title: "Academic Writing Task 1" }],
    context: "Academic Writing Task 1 training. A town recorded the share of commuters using four modes in 2005 and 2025: car 62%→44%, bus 18%→24%, rail 12%→21%, bicycle 8%→11%.",
    parts: [{ label: "Task 1", marks: 20, question: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.", solutionOutline: "Give a clear overview: car remained largest but fell markedly; all alternatives rose, with rail showing the largest proportional gain. Support this with selective comparisons rather than listing every number." }],
    fullSolution: "A strong response paraphrases the task, gives an overview of the dominant trends, then groups and compares figures accurately. It does not speculate about causes.",
  },
  {
    id: "ielts-w-02", type: "long", testId: "ielts", topicId: "ielts-writing", difficulty: 3, totalMarks: 20,
    responseKind: "essay", recommendedWords: [250, 330], maxWords: 420, rubricDimensions: writingRubric,
    essayPrompts: [{ id: "A", title: "Academic Writing Task 2" }],
    context: "Academic Writing Task 2 training.",
    parts: [{ label: "Task 2", marks: 20, question: "Some people believe universities should prioritise courses that lead directly to employment. Others believe their purpose is broader. Discuss both views and give your own opinion. Write at least 250 words.", solutionOutline: "Define what 'prioritise' means, present the strongest case for employability and for broader education, then state a qualified position supported by reasons and examples." }],
    fullSolution: "There is no single correct view. High-band work answers every part, develops both positions fairly, maintains a clear thesis and uses examples as evidence rather than decoration.",
  },
  {
    id: "ielts-s-01", type: "long", testId: "ielts", topicId: "ielts-speaking", difficulty: 2, totalMarks: 20,
    context: "Speaking Part 2 rehearsal. Prepare for one minute, then speak for up to two minutes. Type a faithful transcript or use the AI interview room to practise aloud.",
    parts: [{ label: "Long turn", marks: 20, question: "Describe a skill you learned outside school. Say what it was, how you learned it, what was difficult, and explain why it remains useful.", solutionOutline: "Sustain a coherent two-minute account, sequence events, add specific detail and explain significance. Natural self-correction is acceptable." }],
    fullSolution: "Assessment focuses on fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation. A memorised script is not the goal.",
  },
  {
    id: "ielts-s-02", type: "long", testId: "ielts", topicId: "ielts-speaking", difficulty: 3, totalMarks: 20,
    context: "Speaking Part 3 rehearsal. Respond analytically, extending each answer with reasons, distinctions and examples.",
    parts: [
      { label: "(i)", marks: 7, question: "How has technology changed the way young people learn practical skills?", solutionOutline: "Give a balanced comparison, distinguish access from mastery, and support claims." },
      { label: "(ii)", marks: 7, question: "Which skills are difficult to teach online, and why?", solutionOutline: "Identify concrete skill properties such as tacit feedback, safety or physical coordination." },
      { label: "(iii)", marks: 6, question: "Should governments fund lifelong learning for adults?", solutionOutline: "State criteria, weigh public benefit and cost, and reach a qualified view." },
    ],
    fullSolution: "Strong responses move beyond personal anecdotes, compare alternatives and explain causal links while remaining spontaneous and intelligible.",
  },
];

export const IELTS_QUESTIONS: Question[] = [...reading, ...long];
