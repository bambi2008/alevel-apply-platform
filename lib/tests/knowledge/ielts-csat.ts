import type { TopicKnowledge } from "./esat";

export const IELTS_CSAT_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "ielts-listening",
    overview: "IELTS Listening 的关键不是逐词翻译，而是先预测答案形式，再跟踪说话者的改口、同义替换和定位信号。本站文字题只训练方法，真实听辨必须使用官方音频。",
    concepts: [{ name: "预测—定位—检查", body: "看题时预测词性、数字单位和可能同义词；听到改口词（but, actually, instead）时更新答案；最后检查拼写和题目规定的词数。", keyPoints: ["答案常在改口后", "拼写和单复数会影响得分", "没听到时立即前进"] }],
    workedExamples: [{ title: "日期改口", question: "The meeting was Tuesday, but it has moved to Thursday. 应记录哪天？", solution: "记录 Thursday。旧信息是干扰项，but 后的新信息才是最终安排。", tip: "在草稿上划掉被修正的信息。" }],
  },
  {
    topicId: "ielts-reading",
    overview: "Academic Reading 同时考查快速定位和精确证据判断。先识别题型，再决定略读、扫读或精读；所有答案都必须能回到文本依据。",
    concepts: [{ name: "True / False / Not Given", body: "True 与原文一致；False 与原文矛盾；Not Given 表示原文不足以判断。不要把自己的常识当证据。", keyPoints: ["比较命题强度", "注意 all / some / may", "找不到不等于 Not Given，先确认定位段"] }],
    workedExamples: [{ title: "相关不是因果", question: "原文只说 A 与 B 相关，题目说 A 导致 B。", solution: "若原文没有否定因果，通常是 Not Given；它没有提供足够信息证明或反驳该因果命题。" }],
  },
  {
    topicId: "ielts-writing",
    overview: "IELTS Academic Writing 按任务回应、连贯衔接、词汇资源、语法范围与准确性评价。Task 1 选择并概括主要特征；Task 2 建立和发展可持续的论点。",
    concepts: [{ name: "先完成任务，再追求语言", body: "Task 1 必须有 overview，不解释图表原因；Task 2 必须回应题目每一部分并保持清楚立场。复杂词汇不能补救跑题。", keyPoints: ["Task 1 约 20 分钟", "Task 2 约 40 分钟且权重更高", "每段有明确功能"] }],
    workedExamples: [{ title: "选择主要特征", question: "四条趋势中一条显著下降、三条缓慢上升，应如何写 overview？", solution: "先概括总体对比，再指出最显著变化；具体数字放到主体段作选择性支持。" }],
  },
  {
    topicId: "ielts-speaking",
    overview: "Speaking 考查持续、清楚而自然的即时表达。高质量回答会直接回应、展开理由或例子，并能在需要时自然修正，而不是背诵一段与问题擦边的答案。",
    concepts: [{ name: "Answer—Develop—Example", body: "先直接回答，再说明原因、对比或后果，最后用简短例子落地。Part 3 需要从个人经验上升到一般分析。", keyPoints: ["保持可理解的节奏", "允许自然自我修正", "不要为追求生词牺牲准确性"] }],
    workedExamples: [{ title: "把短答展开", question: "Do you enjoy learning new skills?", solution: "先给明确答案，再说明最近学了什么、困难在哪里以及为什么仍愿意继续，形成 3–4 句自然回应。" }],
  },
  {
    topicId: "csat-algorithms",
    overview: "CSAT 风格算法题要求你给出可执行方法，并解释它为何终止、为何正确以及资源如何随输入规模增长。",
    concepts: [{ name: "算法的三层说明", body: "先定义状态和操作，再用不变量或归纳证明正确性，最后讨论步数或空间。只写伪代码而不论证通常不完整。", keyPoints: ["明确输入与输出", "证明终止和正确", "比较朴素与改进方法"] }],
    workedExamples: [{ title: "最短操作序列", question: "怎样保证第一次找到目标就是最短？", solution: "使用按距离分层的广度优先搜索；在探索距离 d+1 之前，距离不超过 d 的状态已全部访问。" }],
  },
  {
    topicId: "csat-logic",
    overview: "逻辑与证明训练把观察转化为对所有情况成立的论证。反例能推翻全称命题；证明则必须覆盖无限多个可能输入。",
    concepts: [{ name: "选择合适证明法", body: "蕴含命题可尝试直接证明或逆否；递归结构可用归纳；状态变化问题常用不变量。穷举只在情况确实有限时成立。", keyPoints: ["区分命题与逆命题", "写清归纳假设", "反例必须满足前提"] }],
    workedExamples: [{ title: "偶数平方", question: "证明 n² 偶数推出 n 偶数。", solution: "证明逆否：若 n=2k+1 为奇数，则 n²=4k(k+1)+1 仍为奇数。" }],
  },
  {
    topicId: "csat-combinatorics",
    overview: "组合题的核心是避免重复与遗漏。先定义计数对象，再用分类、双计数、递推或双射把问题转换为熟悉结构。",
    concepts: [{ name: "双射与递推", body: "双射把两个集合逐一对应，从而证明数量相等；递推按首个选择或最后一步把规模 n 的问题还原到更小规模。", keyPoints: ["分类必须互斥且完备", "说明是否考虑顺序", "检查小 n"] }],
    workedExamples: [{ title: "非相邻选择", question: "长度 n 中选 k 个不相邻位置。", solution: "把第 j 个选择位置减去 j-1，得到从 n-k+1 个位置中任取 k 个的双射，因此数量为 C(n-k+1,k)。" }],
  },
  {
    topicId: "csat-graphs",
    overview: "图把对象抽象为顶点，把关系抽象为边。先确认有向/无向、是否允许重边，再使用度数、路径、连通性、树或着色性质。",
    concepts: [{ name: "遍历与树", body: "BFS/DFS 从一个起点访问整个连通分量。树是连通无环图，删除叶子后仍是树，这常用于归纳。", keyPoints: ["区分路径与边", "树有 n-1 条边", "遍历需标记已访问节点"] }],
    workedExamples: [{ title: "树至少有两片叶", question: "为什么？", solution: "取一条最长简单路径。若任一端点还有路径外邻点，就能延长路径，矛盾；故两端都是叶子。" }],
  },
  {
    topicId: "csat-modelling",
    overview: "建模不是把现实强行塞进公式，而是明确目标、状态、约束和假设，再检查结果是否对边界情况与现实决策有意义。",
    concepts: [{ name: "模型检查清单", body: "写清优化目标和单位，列出被忽略因素，测试最小、最大与极端输入，并讨论若目标改变，最优方案是否随之改变。", keyPoints: ["目标决定最优", "假设必须可见", "用边界情况找漏洞"] }],
    workedExamples: [{ title: "平均等待与最大等待", question: "哪种电梯方案最好？", solution: "若目标是总时间，可能牺牲少数乘客；若目标是最大等待，方案会更重公平。没有目标函数就没有唯一的“最好”。" }],
  },
];
