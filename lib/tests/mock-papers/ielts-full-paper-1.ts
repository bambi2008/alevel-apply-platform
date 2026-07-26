import type { EssayRubricDimension, LongQuestion, MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";
import type { MockPaper } from "./index";

type Item = [question: string, options: [string, string, string, string], answerIndex: 0 | 1 | 2 | 3, explanation: string];

const keys: MCQOptionKey[] = ["A", "B", "C", "D"];

function objectiveSection(
  prefix: string,
  topicId: string,
  items: Item[],
  context?: string,
  audio?: { id: string; title: string; script: string },
): MCQQuestion[] {
  return items.map(([question, options, answerIndex, explanation], index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    type: "mcq",
    testId: "ielts",
    topicId,
    difficulty: index < 3 ? 1 : index < 8 ? 2 : 3,
    marks: 1,
    question,
    options: options.map((text, optionIndex) => ({ key: keys[optionIndex], text })),
    answer: keys[answerIndex],
    solution: explanation,
    context,
    audioSectionId: audio?.id,
    audioTitle: audio?.title,
    audioScript: audio?.script,
  }));
}

const LISTENING_SECTIONS = [
  {
    id: "ielts-l1-s1",
    title: "Section 1 · Community course booking",
    script: `Receptionist: Westbrook Learning Centre, how can I help? Caller: I'd like to book the weekend photography course. Receptionist: The beginner course starts on Saturday the eighteenth of October, not the eleventh as printed in the old leaflet. It runs from nine thirty until four. The tutor is Maya Singh, that's S I N G H. The standard fee is eighty-four pounds, but full-time students pay sixty-eight. Lunch is not included, though tea and coffee are free. Bring a camera if you have one. We can lend cameras for twelve pounds, but memory cards must be bought separately. The class was going to use Studio Two; it has moved to Room B fourteen because the studio lights are being repaired. Caller: Can I pay on the day? Receptionist: We need a twenty-pound deposit by Friday. The balance is due when you arrive. Caller: And parking? Receptionist: The front car park is closed. Use the Riverside entrance on Mill Lane. Bus number forty-two stops opposite. Please arrive fifteen minutes early for registration.`,
    items: [
      ["On which date does the course begin?", ["11 October", "18 October", "20 October", "28 October"], 1, "The receptionist corrects the old leaflet and gives 18 October."],
      ["What time does teaching begin?", ["09:00", "09:15", "09:30", "10:00"], 2, "The course runs from 9:30 until 4:00."],
      ["How is the tutor's surname spelt?", ["S-I-N-G", "S-I-N-G-H", "S-E-N-G-H", "S-I-M-G-H"], 1, "The recording spells Singh as S-I-N-G-H."],
      ["What is the full-time student fee?", ["£20", "£68", "£84", "£96"], 1, "The reduced student fee is £68."],
      ["What is provided without extra charge?", ["Lunch", "A camera", "Tea and coffee", "A memory card"], 2, "Tea and coffee are free; lunch and equipment are not."],
      ["How much does camera hire cost?", ["£8", "£10", "£12", "£20"], 2, "Camera lending costs £12."],
      ["Where will the class meet?", ["Studio Two", "Room B14", "Room B40", "Riverside Hall"], 1, "The venue changed from Studio Two to Room B14."],
      ["What must be paid by Friday?", ["The full fee", "A £12 hire charge", "A £20 deposit", "The remaining balance"], 2, "A £20 deposit is required by Friday."],
      ["Which entrance should drivers use?", ["Front entrance", "Riverside entrance", "Studio entrance", "Market entrance"], 1, "Drivers are directed to the Riverside entrance."],
      ["When should the caller arrive?", ["At 09:00", "At 09:15", "At 09:30", "At 09:45"], 1, "Fifteen minutes before the 9:30 start is 9:15."],
    ] as Item[],
  },
  {
    id: "ielts-l1-s2",
    title: "Section 2 · Museum visitor briefing",
    script: `Welcome to the Harbour Museum. The ground floor explores the fishing port, while the first floor covers shipbuilding. The temporary exhibition on coastal maps is in the east gallery, beside the lift. Please note that the west staircase is closed today, so use the central stairs. Guided tours leave the information desk at eleven and two thirty. The morning tour is already full, but places remain in the afternoon. Each tour lasts fifty minutes. Large bags must be left in the free lockers; you need a one-pound coin, which is returned. Photography is allowed except in the map exhibition, where several drawings are on loan. Families should visit the discovery room after twelve because a school group has it this morning. The café serves hot food until three, then drinks and cakes until five. If the fire alarm sounds, do not return to the entrance. Leave through the nearest marked exit and meet beside the blue warehouse across Dock Street.`,
    items: [
      ["What is displayed on the ground floor?", ["Shipbuilding", "Fishing-port history", "Coastal maps", "Modern art"], 1, "The ground floor covers the fishing port."],
      ["Where is the temporary exhibition?", ["West gallery", "Discovery room", "East gallery", "Ground-floor café"], 2, "The coastal maps are in the east gallery."],
      ["Which route is unavailable today?", ["The lift", "Central stairs", "West staircase", "Main entrance"], 2, "The west staircase is closed."],
      ["Which guided tour still has places?", ["11:00", "12:00", "14:00", "14:30"], 3, "The 11:00 tour is full; places remain at 14:30."],
      ["How long is a guided tour?", ["40 minutes", "45 minutes", "50 minutes", "60 minutes"], 2, "Each tour lasts fifty minutes."],
      ["What is true of the locker coin?", ["It is not returned", "It is returned", "It costs two pounds", "It is optional for large bags"], 1, "The £1 coin is returned."],
      ["Where is photography prohibited?", ["Fishing-port gallery", "Shipbuilding floor", "Map exhibition", "Discovery room"], 2, "Photography is not allowed in the map exhibition."],
      ["When should families use the discovery room?", ["Before 10:00", "After 12:00", "After 15:00", "Only at 17:00"], 1, "A school group uses it during the morning."],
      ["Until when does the café serve hot food?", ["14:30", "15:00", "16:00", "17:00"], 1, "Hot food is served until three."],
      ["Where is the emergency meeting point?", ["At the entrance", "Inside the east gallery", "Beside the blue warehouse", "At the information desk"], 2, "Visitors should meet beside the blue warehouse."],
    ] as Item[],
  },
  {
    id: "ielts-l1-s3",
    title: "Section 3 · Student project meeting",
    script: `Tutor: Let's review your project on food waste in student housing. Ana: We planned to survey five hundred residents, but only three hundred and twenty completed the form. Leo: Still better than the pilot, which had forty replies. Tutor: Your sample is large enough, but it over-represents first-year students. Ana: We can weight the results by year group. Tutor: Good. What surprised you? Leo: People estimated they threw away two meals a week, while the bin audit suggested nearly four. Ana: Fruit and salad were the most common waste, not bread as we expected. Tutor: Be careful: the audit covered only two weeks in March. Seasonal habits may differ. For the next stage, compare one catered residence with one self-catered building. Keep kitchen size similar, or it will confuse the comparison. Leo: Should we interview catering staff? Tutor: Yes, but first revise the consent form. It currently says responses are anonymous, yet you collect room numbers. Remove those numbers and use random codes. Ana: Our presentation is on the twenty-sixth? Tutor: It has moved to the twenty-ninth, at ten in Seminar Room Six. Send me the revised charts by Monday noon.`,
    items: [
      ["How many residents completed the main survey?", ["40", "320", "500", "820"], 1, "The completed response count was 320."],
      ["Which group is over-represented?", ["Catering staff", "Final-year students", "First-year students", "Self-catered residents"], 2, "The tutor identifies too many first-year respondents."],
      ["How will the students correct the sample imbalance?", ["Repeat the pilot", "Weight by year group", "Exclude all first years", "Survey only one residence"], 1, "Ana proposes weighting results by year group."],
      ["How many meals did residents estimate they wasted weekly?", ["One", "Two", "Three", "Four"], 1, "Self-reports averaged two meals."],
      ["What did the bin audit suggest?", ["Nearly two meals", "Nearly three meals", "Nearly four meals", "Nearly five meals"], 2, "The audit indicated almost four meals."],
      ["Which food appeared most often in waste?", ["Bread", "Rice", "Fruit and salad", "Cooked meat"], 2, "Fruit and salad were most common."],
      ["What limitation does the tutor identify?", ["The audit was too expensive", "It covered only two March weeks", "No residents were surveyed", "Kitchen size was recorded"], 1, "The short March period may not represent other seasons."],
      ["What should be kept similar in the comparison?", ["Resident age", "Meal price", "Kitchen size", "Building colour"], 2, "Kitchen size is a potential confounder."],
      ["Why must room numbers be removed?", ["They are inaccurate", "They prevent anonymity", "They are too costly to process", "They identify year groups poorly"], 1, "Room numbers conflict with the promise of anonymity."],
      ["When is the presentation?", ["26th at noon", "29th at 10:00", "Monday at noon", "29th at 12:00"], 1, "It moved to the 29th at 10:00."],
    ] as Item[],
  },
  {
    id: "ielts-l1-s4",
    title: "Section 4 · Lecture on flexible electricity grids",
    script: `Today's lecture considers flexible electricity grids. Traditional systems matched supply to demand by increasing output from large power stations. Wind and solar change that relationship because their output varies with weather. Flexibility can come from four sources. First, storage: batteries respond within seconds, while pumped hydro can supply power for longer periods. Second, interconnectors move electricity between regions whose weather and demand differ. Third, flexible demand shifts consumption in time. A supermarket, for example, may cool freezers slightly more before the evening peak, then reduce power briefly without affecting food safety. Finally, generators such as hydroelectric plants can adjust output. Flexibility is not the same as maximum capacity. A battery may have high power but little stored energy, so both measures matter. Digital control improves coordination, but creates cyber-security risks and may disadvantage households without smart devices. Trials should therefore measure not only cost and carbon savings, but also who receives rewards and who carries risk. The key conclusion is that no single technology solves variability; resilient systems combine resources across different timescales.`,
    items: [
      ["How did traditional systems mainly respond to higher demand?", ["By importing batteries", "By increasing large-station output", "By reducing all consumption", "By closing interconnectors"], 1, "Traditional systems raised output from large power stations."],
      ["Why do wind and solar require more flexibility?", ["Their output varies with weather", "They cannot connect to grids", "They always produce at night", "Their fuel is expensive"], 0, "Weather makes renewable output variable."],
      ["Which storage responds within seconds?", ["Pumped hydro", "Thermal storage", "Batteries", "Hydrogen shipping"], 2, "The lecture contrasts fast batteries with longer-duration pumped hydro."],
      ["What do interconnectors exploit?", ["Identical regional weather", "Differences between regions", "Only household batteries", "Higher food prices"], 1, "Regions have different weather and demand patterns."],
      ["What is the supermarket example intended to show?", ["Flexible demand", "Pumped storage", "Generator failure", "Electricity theft"], 0, "Cooling is shifted in time to reduce peak demand."],
      ["Which generator is described as adjustable?", ["Solar panels", "Wind turbines", "Hydroelectric plant", "Rooftop battery"], 2, "Hydroelectric generation can adjust output."],
      ["Why are power and stored energy both important?", ["They measure identical things", "High power may last only briefly", "Energy determines cyber-security", "Power measures carbon only"], 1, "A high-power battery can still have limited duration."],
      ["What risk accompanies digital control?", ["More rainfall", "Cyber-security threats", "Lower freezer temperatures", "Loss of all interconnectors"], 1, "Digital coordination creates cyber-security exposure."],
      ["What equity concern is raised?", ["Some households lack smart devices", "All rewards go to generators", "Hydro is always rural", "Batteries cannot be recycled"], 0, "Households without smart technology may be disadvantaged."],
      ["What is the lecturer's main conclusion?", ["Only batteries are needed", "Maximum capacity is enough", "A mix across timescales is required", "Renewables should be avoided"], 2, "Resilience comes from combining multiple flexible resources."],
    ] as Item[],
  },
];

export const IELTS_LISTENING_FULL_1: MCQQuestion[] = LISTENING_SECTIONS.flatMap((section) =>
  objectiveSection(`ielts-full1-${section.id}`, "ielts-listening", section.items, undefined, section)
);

const READING_PASSAGES = [
  {
    id: "urban-heat",
    passage: `Cities are often warmer than surrounding rural areas because dark surfaces absorb solar energy, buildings restrict airflow and human activity releases heat. Early responses focused on planting as many trees as possible. That remains useful, but researchers now stress that canopy location matters as much as total tree count. A mature tree shading a busy pavement can reduce people's heat exposure more than several young trees planted beside an empty road. Yet tree planting is not a universal solution. In dry climates, irrigation may compete with household water needs, and poorly chosen species can worsen allergies or damage pavements. Reflective roofs work differently: they return more sunlight to the atmosphere and can lower indoor temperatures, especially in low-rise buildings. Their benefit is smaller where towers shade one another, and glare must be considered. The strongest heat plans combine measures and use neighbourhood data. City-wide averages can conceal severe exposure in districts with little shade, older housing and residents who cannot afford air conditioning. Evaluation should therefore measure temperatures at pedestrian level, indoor conditions and the distribution of benefits, not merely the number of projects completed.`,
    items: [
      ["What causes part of the urban heat effect?", ["Dark surfaces absorbing energy", "Trees restricting all airflow", "Rural industry", "Reflective roofs"], 0, "The first sentence identifies heat-absorbing dark surfaces."],
      ["What did early responses emphasise?", ["Indoor monitoring", "Total trees planted", "Roof glare", "Water pricing"], 1, "Early policy focused on planting quantity."],
      ["Why can one mature tree outperform several young trees?", ["It needs no water", "Its location and shade affect more people", "It reflects roof light", "It removes buildings"], 1, "Useful shade in a busy place can reduce more exposure."],
      ["What concern applies in dry climates?", ["Trees produce excessive glare", "Irrigation competes for water", "Roofs become too dark", "Buildings lose shade"], 1, "Irrigation may compete with household demand."],
      ["Which problem may follow poor species choice?", ["More rural heat", "Pavement damage", "Lower allergies", "Reduced rainfall"], 1, "The passage mentions allergies and pavement damage."],
      ["How do reflective roofs work?", ["They store more heat", "They return more sunlight", "They increase tower height", "They irrigate trees"], 1, "They reflect rather than absorb more sunlight."],
      ["Where may reflective roofs offer less benefit?", ["Low-rise districts", "Areas with mature trees", "Places where towers shade each other", "Dry suburbs"], 2, "Mutual tower shading reduces additional roof benefit."],
      ["Why are city-wide averages insufficient?", ["They are always inaccurate", "They conceal unequal exposure", "They measure indoor heat only", "They exclude all roofs"], 1, "Averages can hide neighbourhood disparities."],
      ["Which residents may be especially vulnerable?", ["Those who own air conditioning", "Those in newer shaded housing", "Those unable to afford cooling", "Those living outside cities"], 2, "Affordability of air conditioning is an explicit vulnerability."],
      ["What does the writer recommend measuring?", ["Only project counts", "Only outdoor averages", "Pedestrian, indoor and distributional outcomes", "Tree height alone"], 2, "Evaluation should cover multiple environments and who benefits."],
    ] as Item[],
  },
  {
    id: "seed-banks",
    passage: `Seed banks are sometimes described as insurance policies for agriculture. They store seeds under controlled temperature and humidity so that plant varieties can be conserved for future research or breeding. The comparison with insurance is helpful but incomplete. A stored seed is not a permanent object: it remains alive, slowly loses viability and must eventually be grown to produce a fresh generation. This regeneration is technically demanding because a small sample can lose genetic diversity, and plants may cross-pollinate with nearby varieties. Nor can frozen collections replace farmers who continue cultivating crops in changing environments. On-farm diversity evolves through selection and exchange; a seed bank captures only a sample at a particular time. The two approaches are therefore complementary. Global vaults protect duplicate collections against war or disaster, while local and national banks make material available to researchers and growers. Access rules matter. A collection may be biologically secure yet socially useless if breeders cannot obtain samples or if communities that developed a crop receive no recognition. Successful conservation links safe storage, accurate records, periodic germination tests, careful regeneration and fair exchange. Its purpose is not merely to accumulate packets, but to keep genetic options usable.`,
    items: [
      ["Why are seed banks compared with insurance?", ["They guarantee crop prices", "They preserve options for future loss or need", "They eliminate farming risk", "They sell policies"], 1, "They conserve material that may be needed later."],
      ["Why is the insurance comparison incomplete?", ["Seeds are not alive", "Stored seeds require ongoing regeneration", "Banks cannot control temperature", "All crops are identical"], 1, "Seeds lose viability and need active renewal."],
      ["What may be lost during regeneration?", ["Humidity", "Genetic diversity", "Storage records", "All pollen"], 1, "A small regenerated sample can narrow diversity."],
      ["What can cause unintended mixing?", ["Cold storage", "Cross-pollination", "Germination testing", "Duplicate vaults"], 1, "Nearby varieties may cross-pollinate."],
      ["Why can banks not replace farmers?", ["Farmers own all vaults", "On-farm crops continue adapting", "Frozen seed grows faster", "Researchers reject samples"], 1, "Cultivated diversity changes with selection and exchange."],
      ["How are banked samples limited in time?", ["They capture diversity at one point", "They last only one day", "They predict future climates", "They include no history"], 0, "A bank stores a snapshot, not continuing evolution."],
      ["What is the role of global vaults?", ["Daily distribution", "Protecting duplicate collections", "Replacing national banks", "Selling new varieties"], 1, "Global vaults provide disaster backup."],
      ["What do local and national banks often provide?", ["Access for researchers and growers", "Weather insurance", "Farm machinery", "Only historical displays"], 0, "They make material available for use."],
      ["When might a secure collection still be socially useless?", ["When samples cannot be accessed fairly", "When it contains records", "When seeds germinate", "When it has duplicates"], 0, "Biological security alone does not guarantee usable access."],
      ["What is the central purpose of conservation?", ["Maximising packet numbers", "Keeping genetic options usable", "Ending crop exchange", "Freezing every plant"], 1, "The final sentence defines success as usable genetic options."],
    ] as Item[],
  },
  {
    id: "expertise",
    passage: `Automation often removes routine steps from skilled work, but its effect on expertise is ambiguous. When software performs calculations, novices can complete tasks that once required lengthy training. This broadens access and reduces certain errors. However, expertise is not simply the ability to produce an answer; it includes recognising when a method is inappropriate, diagnosing unusual cases and explaining uncertainty. If beginners see only a system's output, they may never build the mental models needed to challenge it. Aviation offers a familiar example: automatic systems improve safety, yet pilots still train for rare failures because those are precisely the moments when automation may hand control back. The solution is not to preserve every manual procedure. Requiring workers to repeat tasks that machines perform reliably can waste time and introduce new mistakes. Instead, training should be redesigned around active supervision. Learners can predict a system's result before seeing it, compare alternative methods, investigate deliberately flawed outputs and practise high-risk exceptions in simulations. Organisations also need evidence about performance over time. Short-term productivity gains can coexist with a gradual loss of diagnostic skill. Measures of success should include not only speed and accuracy during normal operation, but also recovery when conditions depart from the system's assumptions.`,
    items: [
      ["What immediate benefit can automation give novices?", ["Access to previously difficult tasks", "Guaranteed expertise", "More routine training", "No need for supervision"], 0, "Software lets novices perform tasks formerly requiring long training."],
      ["How does the writer define expertise beyond answers?", ["Fast typing", "Recognising limits and uncertainty", "Following software blindly", "Avoiding explanations"], 1, "Expertise includes method choice, diagnosis and uncertainty."],
      ["What may novices fail to develop?", ["Computer access", "Mental models for challenge", "Routine speed", "Interest in aviation"], 1, "Output-only use can prevent deeper models forming."],
      ["Why are pilots mentioned?", ["To show automation is unsafe", "To illustrate training for rare handovers", "To oppose simulation", "To explain aircraft design"], 1, "Pilots need skill when automation returns control."],
      ["What does the writer reject?", ["All automated calculation", "Preserving every manual procedure", "Training for exceptions", "Performance evidence"], 1, "The text explicitly says not every manual process should remain."],
      ["What risk comes from unnecessary manual repetition?", ["Less time and new errors", "Permanent expertise", "Better diagnostics", "Fewer assumptions"], 0, "It can waste time and create mistakes."],
      ["What should learners do before viewing system output?", ["Predict the result", "Ignore the task", "Report productivity", "Remove uncertainty"], 0, "Prediction is one proposed active-supervision exercise."],
      ["Why investigate deliberately flawed outputs?", ["To practise detecting problems", "To reduce all software use", "To increase routine speed", "To avoid explanations"], 0, "Flawed cases train challenge and diagnosis."],
      ["What may short-term productivity hide?", ["Immediate safety gains", "Gradual loss of diagnostic skill", "Higher manual workload only", "Improved mental models"], 1, "The passage warns of skill decay over time."],
      ["What should performance measures include?", ["Normal speed only", "Accuracy only", "Recovery outside assumptions", "Training cost only"], 2, "Recovery from unusual conditions is a key outcome."],
    ] as Item[],
  },
  {
    id: "tidal-wetlands",
    passage: `Restoring tidal wetlands is frequently presented as a way to reduce flood risk, store carbon and create wildlife habitat. These benefits are real, but they do not appear instantly or uniformly. A newly breached sea wall may first produce bare mud rather than dense vegetation. Sediment must accumulate at a suitable rate, and plant communities develop according to elevation, salinity and wave exposure. Monitoring only the number of hectares reconnected to the tide therefore says little about ecological function. Flood protection is also context-dependent. Wetlands can absorb wave energy and temporarily store water, yet their value declines if they are squeezed between rising seas and fixed development. Allowing the habitat to migrate inland may require buying land or changing planning rules, which can be politically difficult. Carbon accounting introduces further complexity. Wetland soils can store carbon for centuries, but construction releases emissions, and some restored sites produce methane. Researchers consequently compare net greenhouse effects over decades rather than counting carbon in vegetation alone. Restoration is most credible when planners state which benefits are priorities, establish baseline measurements and accept that some sites will require adjustment. Uncertainty is not an argument for inaction; it is a reason to design projects as long-term experiments with clear decision points.`,
    items: [
      ["Which benefit is NOT listed at the start?", ["Flood-risk reduction", "Carbon storage", "Wildlife habitat", "Urban cooling"], 3, "Urban cooling is not among the opening claims."],
      ["Why may a new site initially show bare mud?", ["Benefits develop over time", "The tide has been excluded", "Carbon prevents plants", "Monitoring stops sediment"], 0, "Vegetation and sediment processes take time."],
      ["What influences plant communities?", ["Only project cost", "Elevation, salinity and waves", "Number of visitors", "Sea-wall colour"], 1, "These three physical factors are named."],
      ["Why are reconnected hectares an inadequate measure?", ["Area is impossible to calculate", "Area does not show function", "All wetlands are identical", "Hectares measure methane only"], 1, "Extent alone says little about ecological performance."],
      ["How can wetlands reduce flooding?", ["By stopping all tides", "By absorbing waves and storing water", "By increasing fixed development", "By preventing rain"], 1, "Wave attenuation and temporary storage are cited."],
      ["What is coastal squeeze?", ["Sediment accumulation", "Habitat trapped by sea rise and development", "Land purchase", "Methane release"], 1, "The habitat lacks room to migrate inland."],
      ["Why may inland migration be difficult?", ["It needs political and planning change", "Plants reject lower salinity", "It prevents monitoring", "It eliminates carbon"], 0, "Land purchase and planning changes can be contentious."],
      ["Why is carbon accounting complex?", ["Wetlands store no carbon", "Construction and methane affect net emissions", "Vegetation cannot be measured", "Decades are too short"], 1, "Both initial emissions and methane alter the balance."],
      ["What should planners establish before restoration?", ["A guaranteed result", "Baseline measurements and priorities", "Only a hectare target", "Fixed rules with no adjustment"], 1, "Credible projects define priorities and baselines."],
      ["How does the writer view uncertainty?", ["A reason to abandon restoration", "A reason for adaptive long-term design", "Proof that benefits are false", "A reason to avoid decisions"], 1, "Uncertainty supports experimentation and decision points."],
    ] as Item[],
  },
];

export const IELTS_READING_FULL_1: MCQQuestion[] = READING_PASSAGES.flatMap((passage) =>
  objectiveSection(`ielts-full1-read-${passage.id}`, "ielts-reading", passage.items, passage.passage)
);

const WRITING_RUBRIC: EssayRubricDimension[] = [
  { id: "task", label: "任务回应", maxMarks: 5, description: "选择、概括和发展与任务直接相关的信息或立场。" },
  { id: "coherence", label: "连贯衔接", maxMarks: 5, description: "信息组织清楚，段落功能明确，衔接自然。" },
  { id: "lexical", label: "词汇资源", maxMarks: 5, description: "词汇范围、搭配和准确性支持清楚表达。" },
  { id: "grammar", label: "语法范围与准确性", maxMarks: 5, description: "句式有变化，错误不妨碍理解。" },
];

export const IELTS_WRITING_FULL_1: LongQuestion[] = [
  {
    id: "ielts-full1-writing-task1", type: "long", testId: "ielts", topicId: "ielts-writing", difficulty: 2, totalMarks: 20,
    responseKind: "essay", essayPrompts: [{ id: "A", title: "Academic Writing Task 1" }], recommendedWords: [150, 190], maxWords: 260, rubricDimensions: WRITING_RUBRIC,
    context: "The table shows the percentage of a university's electricity supplied by four sources in 2010 and 2025: grid fossil fuel 68%→31%, grid renewable 12%→24%, on-site solar 5%→28%, purchased wind 15%→17%.",
    parts: [{ label: "Task 1", marks: 20, question: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.", solutionOutline: "Provide an overview of the major shift away from fossil supply, identify solar as the largest increase, and support comparisons with selected accurate figures without speculating about causes." }],
    fullSolution: "A strong answer paraphrases the task, gives a clear overview, groups related changes and reports accurate comparisons. It does not explain unprovided causes.",
  },
  {
    id: "ielts-full1-writing-task2", type: "long", testId: "ielts", topicId: "ielts-writing", difficulty: 3, totalMarks: 20,
    responseKind: "essay", essayPrompts: [{ id: "A", title: "Academic Writing Task 2" }], recommendedWords: [250, 330], maxWords: 450, rubricDimensions: WRITING_RUBRIC,
    context: "Academic Writing Task 2.",
    parts: [{ label: "Task 2", marks: 20, question: "Some people think public money should be used mainly to prevent illness, while others believe treating people who are already ill should remain the priority. Discuss both views and give your own opinion. Write at least 250 words.", solutionOutline: "Discuss the strongest prevention and treatment arguments, recognise resource and ethical trade-offs, state a clear qualified position and develop it with relevant examples." }],
    fullSolution: "There is no single correct position. High-quality work answers every part, maintains a clear thesis, develops both views fairly and reaches a proportionate conclusion.",
  },
];

export const IELTS_FULL_PAPERS_1: MockPaper[] = [
  {
    id: "ielts-listening-full-1", testId: "ielts", title: "IELTS Academic Listening 全长训练卷 1", titleEn: "IELTS Academic Listening Full Training Paper 1",
    description: "桥申原创 40 题 Listening 训练卷，按四节递进结构与约 30 分钟作答节奏编排。录音由浏览器英文语音引擎生成，不是 IELTS 官方录音。",
    modules: [{ id: "listening", title: "Listening · 4 sections / 40 questions", titleEn: "Listening", durationSec: 30 * 60, questions: IELTS_LISTENING_FULL_1 }],
    instructions: ["每节录音只可启动一次，播放期间可翻题。", "选择题是平台自动判分改编，正式考试还包含填空、匹配等作答形式。", "结果页 Band 为训练估算，不是官方成绩。"],
    formatType: "extension",
  },
  {
    id: "ielts-reading-full-1", testId: "ielts", title: "IELTS Academic Reading 全长训练卷 1", titleEn: "IELTS Academic Reading Full Training Paper 1",
    description: "桥申原创 Academic Reading 全长训练：4 篇学术说明/论述文本、40 道自动判分题、60 分钟。文本与题目不复制官方或出版机构材料。",
    modules: [{ id: "reading", title: "Academic Reading · 40 questions", titleEn: "Academic Reading", durationSec: 60 * 60, questions: IELTS_READING_FULL_1 }],
    instructions: ["所有答案必须能回到文本证据。", "可前后翻题、标记复查，答错不倒扣。", "结果页 Band 为训练估算，不是官方成绩。"],
    formatType: "extension",
  },
  {
    id: "ielts-written-full-1", testId: "ielts", title: "IELTS Academic Writing 固定卷 1", titleEn: "IELTS Academic Writing Fixed Paper 1",
    description: "桥申原创 60 分钟 Academic Writing 固定卷。Task 1 建议 20 分钟、至少 150 词；Task 2 建议 40 分钟、至少 250 词且训练时应投入更多时间。",
    modules: [{ id: "writing", title: "Academic Writing · Task 1 + Task 2", titleEn: "Academic Writing", durationSec: 60 * 60, questions: IELTS_WRITING_FULL_1 }],
    instructions: ["Task 1 不解释图表未提供的原因。", "Task 2 必须回应双方观点并给出自己的立场。", "AI 量表反馈是形成性训练，不是 IELTS 官方 Band。"],
    formatType: "extension",
  },
];
