import type { InterviewCategory, InterviewQuestion, InterviewSubject } from "./questions";

export const ASSESSMENT_CATEGORIES: { id: InterviewCategory; label: string; labelEn: string }[] = [
  { id: "CAMBRIDGE_ASSESSMENT", label: "剑桥学院 Assessment", labelEn: "Cambridge college assessments" },
  { id: "HK_INTERVIEW", label: "香港院校面试", labelEn: "Hong Kong interviews" },
  { id: "ENGLISH", label: "英语口语考试", labelEn: "English speaking" },
];

export const ASSESSMENT_SUBJECTS: InterviewSubject[] = [
  { id: "cambridge-source", name: "剑桥材料分析", nameEn: "Cambridge source analysis", category: "CAMBRIDGE_ASSESSMENT", blurb: "短时间阅读陌生材料，区分主张、证据、假设和可替代解释。" },
  { id: "cambridge-language-aptitude", name: "剑桥语言能力", nameEn: "Cambridge language aptitude", category: "CAMBRIDGE_ASSESSMENT", blurb: "从少量语言数据中发现规则，解释例外并把规则迁移到新例子。" },
  { id: "cambridge-visual", name: "剑桥视觉与作品讨论", nameEn: "Cambridge visual and portfolio discussion", category: "CAMBRIDGE_ASSESSMENT", blurb: "观察、比较、提出假设并回应导师对作品选择和设计判断的追问。" },
  { id: "hk-general", name: "港校综合面试", nameEn: "Hong Kong general interview", category: "HK_INTERVIEW", blurb: "申请动机、课程理解、学术经历与临场追问，重点检查具体性和一致性。" },
  { id: "hk-medicine-mmi", name: "港校医学 MMI", nameEn: "Hong Kong medicine MMI", category: "HK_INTERVIEW", blurb: "患者安全、伦理、沟通和团队场景；不靠背四原则，重视权衡与升级处理。" },
  { id: "hk-business-group", name: "港校商科小组讨论", nameEn: "Hong Kong business group discussion", category: "HK_INTERVIEW", blurb: "结构化表达、回应同伴、推动共同结论，而不是抢占发言时间。" },
  { id: "hk-stem", name: "港校理工面试", nameEn: "Hong Kong STEM interview", category: "HK_INTERVIEW", blurb: "项目深挖、数据判断、基础原理与陌生情境建模。" },
  { id: "ielts-speaking", name: "IELTS Speaking", nameEn: "IELTS Speaking", category: "ENGLISH", blurb: "按 Part 1–3 训练自然展开、两分钟陈述和抽象讨论，并获得追问式反馈。" },
];

type QuestionSeed = Omit<InterviewQuestion, "id">;
const q = (id: string, seed: QuestionSeed): InterviewQuestion => ({ id, ...seed });

export const ASSESSMENT_QUESTIONS: InterviewQuestion[] = [
  q("cam-src-1", {
    subjectId: "cambridge-source", format: "15 分钟阅读 + 讨论", timebox: "准备 15 分钟", assessedSkills: ["证据判断", "替代解释", "回应提示"],
    prompt: "材料称：某城市引入拥堵费后，市中心车流下降 18%，因此拥堵费是唯一有效的交通政策。请评估这一结论。",
    approach: "先拆出数据、结论和“唯一有效”的强断言。指出同期公共交通、经济活动、统计口径等可能因素，再说明需要什么比较组或时间序列。",
    followUps: ["什么证据最能支持因果关系？", "如果外围道路更堵，政策仍算成功吗？"],
  }),
  q("cam-src-2", {
    subjectId: "cambridge-source", format: "短文细读", timebox: "准备 10 分钟", assessedSkills: ["主旨", "语气", "反驳"],
    prompt: "作者写道：‘效率并非教育的敌人；把无法量化的东西当作不存在，才是。’解释这句话的论证作用，并提出最强反驳。",
    approach: "区分作者是否反对效率本身，解释后半句对指标主义的批评。反驳应承认测量局限，同时说明没有指标也可能导致任意判断。",
    followUps: ["哪些教育结果可以合理量化？", "你的反驳会迫使作者修改哪一处表述？"],
  }),
  q("cam-src-3", {
    subjectId: "cambridge-source", format: "数据解释", timebox: "准备 12 分钟", assessedSkills: ["读表", "不确定性", "研究设计"],
    prompt: "两组各 30 名学生使用不同学习方法，平均分相差 4 分。仅凭这一结果，你会建议全校更换方法吗？",
    approach: "询问分布、基线、随机分组、误差和实际效应；提出小规模复现或更强实验，而不是直接接受或拒绝。",
    followUps: ["如果差异统计显著呢？", "什么会让 4 分具有实际意义？"],
  }),
  q("cam-lang-1", {
    subjectId: "cambridge-language-aptitude", format: "规则发现", timebox: "8 分钟", assessedSkills: ["模式识别", "验证", "迁移"],
    prompt: "某语言中 ‘mira’=我看见，‘tira’=你看见，‘miraka’=我曾看见。推测 ‘tiraka’ 的含义，并说明你用了什么假设。",
    approach: "把 mi/ti 与主语、-ka 与过去建立暂定映射，同时明确样本很少，规则仍需新例子验证。",
    followUps: ["什么新数据能推翻你的分析？", "如果 ‘miraka’ 实际表示复数，怎样重建规则？"],
  }),
  q("cam-lang-2", {
    subjectId: "cambridge-language-aptitude", format: "句法分析", timebox: "10 分钟", assessedSkills: ["结构比较", "歧义", "解释"],
    prompt: "解释 ‘Visiting relatives can be exhausting’ 的两种结构和两种含义。",
    approach: "一种把 visiting relatives 作为动名词短语，另一种把 visiting 作为修饰 relatives 的分词。用改写或重音说明差异。",
    followUps: ["中文里是否有类似结构歧义？", "机器翻译怎样识别正确含义？"],
  }),
  q("cam-lang-3", {
    subjectId: "cambridge-language-aptitude", format: "音系规则", timebox: "10 分钟", assessedSkills: ["最小对立", "规则归纳", "例外"],
    prompt: "一组新语言数据中，复数词尾在清辅音后读 /s/，在浊辅音后读 /z/。你会怎样描述规则并设计一个检验例？",
    approach: "先定义清浊与语音同化，再选择一个从未出现的清辅音词和浊辅音词预测读音。",
    followUps: ["元音后会怎样？", "若出现一个反例，你先怀疑规则还是数据？"],
  }),
  q("cam-vis-1", {
    subjectId: "cambridge-visual", format: "作品/图像讨论", timebox: "2 分钟观察", assessedSkills: ["观察", "比较", "设计判断"],
    prompt: "选择你作品集中的一个决定：你放弃了什么替代方案，依据是什么？",
    approach: "讲具体约束、证据和迭代，不把答案停留在‘更好看’。说明一次失败如何改变最终选择。",
    followUps: ["若预算减半，你保留什么？", "哪项用户反馈与你的判断冲突？"],
  }),
  q("cam-vis-2", {
    subjectId: "cambridge-visual", format: "陌生图像分析", timebox: "3 分钟观察", assessedSkills: ["空间关系", "假设", "修正"],
    prompt: "面对一张陌生建筑平面图，你会按什么顺序判断入口、动线、公共与私密空间？",
    approach: "先只描述可见证据，再提出功能假设，最后寻找支持或反驳假设的尺度、开口和连接关系。",
    followUps: ["如果方向标被移除怎么办？", "怎样判断无障碍动线是否成立？"],
  }),
  q("hk-gen-1", {
    subjectId: "hk-general", format: "个人面试", timebox: "90 秒", assessedSkills: ["课程动机", "证据", "一致性"],
    prompt: "为什么选择这个课程，而不是名称相近的另一课程？",
    approach: "从课程结构、具体模块和你的已验证兴趣作比较，避免只讲排名、城市或宽泛职业目标。",
    followUps: ["哪一门核心课最可能挑战你？", "如果未进入首选方向，你会怎样调整？"],
  }),
  q("hk-gen-2", {
    subjectId: "hk-general", format: "追问式面试", timebox: "2 分钟", assessedSkills: ["反思", "责任", "行动"],
    prompt: "讲一次你负责的学术项目没有达到目标。你如何判断问题出在哪里？",
    approach: "简述目标和证据，承担自己的决策，说明具体修正与下一次可验证的改变。",
    followUps: ["团队成员会怎样描述你的责任？", "你现在会提前监测哪个指标？"],
  }),
  q("hk-gen-3", {
    subjectId: "hk-general", format: "时事讨论", timebox: "2 分钟", assessedSkills: ["结构", "权衡", "课程关联"],
    prompt: "选一个与你申请专业有关的近期问题。哪些证据会改变你目前的看法？",
    approach: "先限定问题和暂定立场，再主动给出可推翻自己的证据标准，显示观点不是不可检验的口号。",
    followUps: ["最强反方是什么？", "这个问题在香港语境中有什么不同？"],
  }),
  q("hk-mmi-1", {
    subjectId: "hk-medicine-mmi", format: "MMI 情景站", timebox: "准备 2 分钟 / 回答 6 分钟", assessedSkills: ["患者安全", "沟通", "升级处理"],
    prompt: "你发现同组学生在临床观察记录中填入了自己没有亲眼看到的信息。你会怎么做？",
    approach: "先确保记录不会影响患者安全，私下澄清事实，明确诚信问题，并按严重性向合适导师升级；不要承诺保密或公开羞辱。",
    followUps: ["如果对方说只是为了按时交作业呢？", "何时必须立即报告？"],
  }),
  q("hk-mmi-2", {
    subjectId: "hk-medicine-mmi", format: "MMI 沟通站", timebox: "6 分钟", assessedSkills: ["同理", "界限", "共同决策"],
    prompt: "一位家长要求你不要把成年患者的诊断告诉患者本人。你如何回应？",
    approach: "承认家长担忧，探索原因，说明患者自主和保密边界；与临床团队确认能力、风险和当地规则，不单独做超出角色的决定。",
    followUps: ["如果患者明确表示不想知道呢？", "若翻译由家属担任有什么风险？"],
  }),
  q("hk-mmi-3", {
    subjectId: "hk-medicine-mmi", format: "MMI 资源分配站", timebox: "7 分钟", assessedSkills: ["伦理权衡", "公平", "不确定性"],
    prompt: "医院只有一个重症监护床位，两名患者都可能获益。你会采用哪些公平标准？",
    approach: "不替代临床决策，讨论紧迫性、获益概率、透明一致标准和复核机制；避免用社会地位或主观‘价值’排序。",
    followUps: ["先到先得公平吗？", "年龄可否成为考虑因素？"],
  }),
  q("hk-biz-1", {
    subjectId: "hk-business-group", format: "小组讨论", timebox: "准备 3 分钟 / 讨论 12 分钟", assessedSkills: ["框架", "倾听", "推进"],
    prompt: "大学有一笔固定预算，应优先用于扩大助学金、建设创业中心还是降低校园碳排？请推动小组形成建议。",
    approach: "先提共同评价标准，再邀请他人补充；定时总结分歧与共识，最后形成有条件的组合方案。",
    followUps: ["如何避免你提出的框架偏向某一方案？", "当两位同伴争执时你怎么介入？"],
  }),
  q("hk-biz-2", {
    subjectId: "hk-business-group", format: "案例讨论", timebox: "2 分钟", assessedSkills: ["利益相关者", "风险", "建议"],
    prompt: "一家平台考虑用动态定价缓解高峰需求。你会先要求哪些数据？",
    approach: "分清业务目标、需求弹性、客户分层、公平风险和竞争反应，再提出小规模实验与停止条件。",
    followUps: ["短期收入上涨就算成功吗？", "怎样保护低收入用户？"],
  }),
  q("hk-stem-1", {
    subjectId: "hk-stem", format: "项目深挖", timebox: "3 分钟", assessedSkills: ["原理", "证据", "局限"],
    prompt: "选一个你做过的理工项目：哪个结果最可能是测量误差，而不是系统真实变化？",
    approach: "说明测量链、误差来源、重复性和对照，不要只说‘数据不准’。给出一项能区分两种解释的测试。",
    followUps: ["如果没有时间重做实验怎么办？", "你会怎样报告不确定性？"],
  }),
  q("hk-stem-2", {
    subjectId: "hk-stem", format: "陌生情境估算", timebox: "4 分钟", assessedSkills: ["建模", "量纲", "合理性"],
    prompt: "估算一栋 30 层教学楼一天使用多少升饮用水。你需要哪些假设？",
    approach: "从人数、到校比例、人均饮水和开放天数分解，给出范围并做数量级检查，而不是追求假精确。",
    followUps: ["如何用一天内的观测校准？", "饮水机损耗如何进入模型？"],
  }),
  q("ielts-sp-1", {
    subjectId: "ielts-speaking", format: "Part 1", timebox: "4–5 分钟", assessedSkills: ["自然回应", "展开", "准确性"],
    prompt: "Let's talk about study spaces. Where do you usually study, and what makes a place suitable for concentration?",
    approach: "直接回答并用一个具体细节展开。避免每题都背成小演讲，也不要只回答 yes/no。",
    followUps: ["Has your preferred study place changed?", "Do young people need quiet to learn well?"],
  }),
  q("ielts-sp-2", {
    subjectId: "ielts-speaking", format: "Part 2", timebox: "准备 1 分钟 / 陈述 2 分钟", assessedSkills: ["持续表达", "叙事", "词汇范围"],
    prompt: "Describe a time when you changed your opinion after learning something new. Say what you believed, what changed your mind, and how you felt afterwards.",
    approach: "用时间顺序组织，加入转折前后的具体证据，并留出结尾说明意义。",
    followUps: ["Was it easy to admit that your earlier view was wrong?", "Who influenced the change most?"],
  }),
  q("ielts-sp-3", {
    subjectId: "ielts-speaking", format: "Part 3", timebox: "4–5 分钟", assessedSkills: ["抽象讨论", "比较", "论证"],
    prompt: "Why do people sometimes resist evidence that challenges their beliefs?",
    approach: "区分身份、利益、信息来源和认知成本，用可能性语言，给出例子后回到一般结论。",
    followUps: ["Should schools explicitly teach people how to change their minds?", "Can experts do more to earn public trust?"],
  }),
];
