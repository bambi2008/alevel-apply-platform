// TARA 知识卡 —— 批判性思维 / 问题解决 / 写作任务。原创，按 UAT-UK 官方结构校准。
import type { TopicKnowledge } from "./esat";

export const TARA_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "tara-critical",
    overview: "批判性思维（Critical Thinking）是 TARA 第一模块：22 题、40 分钟，评估你对日常语言论证的理解与评价。官方分七类题型：找主结论、推出结论、识别假设、评估新证据的影响、找推理错误、匹配论证、应用原则。只依据文段本身作答，不引入外部知识或个人立场。",
    concepts: [
      { name: "找结论与找假设", body: "**结论**是作者最想让你接受的那句，常有 'therefore/so/thus' 引导，其余是支撑它的理由；结论可出现在任何位置，不一定在末尾。**假设**是论证成立所必需但**未明说**的前提——用「否定测试」：若否定某选项会使论证垮掉，它就是假设。", keyPoints: ["结论≠某个论据或背景事实", "结论可能在开头或中间，不一定在结尾", "否定假设→论证崩塌"] },
      { name: "评估新证据 / 找推理错误", body: "**评估新证据的影响**=判断某条新信息会削弱还是加强论证（削弱常是提供替代解释、反例、第三因素）。**找推理错误**=识别谬误：相关当因果、以偏概全、假两难、人身攻击、循环论证、唯一原因谬误等。", keyPoints: ["削弱=切断「理由→结论」之桥", "「A后B，故A致B」→相关vs因果", "「要么…要么…」→当心假两难"] },
      { name: "匹配论证与应用原则", body: "**匹配论证**：先把原论证抽象成逻辑形式（如「若P则Q；非Q；故非P」=有效的否定后件），再找形式完全相同的选项，别被话题迷惑。**应用原则**：先找出论证依赖的一般原则（如「两个错误不构成一个正确」），再看哪个选项运用了同一原则。", keyPoints: ["匹配题先写成 if-then 形式再对比", "注意区分有效（否定后件）与无效（肯定后件）", "应用原则先把原则抽象成一句话"] },
    ],
    workedExamples: [
      { title: "否定测试找假设", question: "「考试成绩逐年提高，所以学校教得更好了。」隐含假设？", solution: "假设「成绩提高反映教学变好，而非考试变简单或其他因素」。否定它（其实是考试变易），结论立刻不成立——这就是关键假设。", tip: "能让论证垮掉的隐含前提就是假设。" },
      { title: "匹配论证（否定后件）", question: "「桥若不安全早就封了；没封；故桥不是不安全。」哪个结构相同？", solution: "抽象为：若P则Q；非Q；故非P（有效）。匹配「若下雨则比赛取消；没取消；故没下雨」。注意区别于「肯定后件」（若P则Q；Q；故P）——那是无效的。", tip: "先写成 if-then，再对形式，不看话题。" },
      { title: "应用原则", question: "某段论证的原则是「两个错误不构成一个正确」（制造商卖假货有错，但不能为明知买假的消费者开脱）。哪个选项运用同一原则？", solution: "选那个把「他人之错不能为自己之错开脱」套到新情境的选项（如「女友先犯错，不能为男友撒谎开脱」）。只是单纯反对牟利、或只针对具体做法的选项都不算同一原则。", tip: "先用一句话概括原则，再逐项套用。" },
    ],
  },
  {
    topicId: "tara-problem",
    overview: "问题解决（Problem Solving）是 TARA 第二模块：22 题、40 分钟，考数值推理，**只需基础数学、不可用计算器**。官方分三类技能：相关选择（从题干挑出有用数字）、找程序（找到正确算法）、识别相似（把已解结构套到新数字上）。重逻辑与估算，不重繁复计算。",
    concepts: [
      { name: "相关选择：只取有用的数字", body: "题干常塞入无关数据干扰。先问「回答这个问题我真正需要哪几个量？」把无关的划掉，单位统一后再算。无计算器，所以要善用估算先排除明显错误的选项。", keyPoints: ["先定位问题要的量，再找数据", "单位统一（元/克、km/h）后再算", "估算 + 排除法省时间"] },
      { name: "找程序：常见套路", body: "熟练高频套路能省大量时间：\\n- **往返平均速度** $=\\frac{2v_1v_2}{v_1+v_2}$（不是算术平均！）\\n- **连续折扣/增长**：相乘不相加\\n- **比例分配**：先求总份数再按份取\\n- **合作工效**：速率相加 $t=\\frac1{1/t_1+1/t_2}$\\n- **百分比变化** $=\\frac{新-旧}{旧}\\times100$", keyPoints: ["记住往返平均速度公式", "折扣、增长是「乘」不是「加」", "工效题先转成速率再相加"] },
      { name: "识别相似与空间推理", body: "部分题给一个已解情形，要你把**相同结构**套到新数字；或考空间（立方体涂面、路径计数）。立方体涂面：$n^3$ 涂满切开后，三面 $=8$、两面 $=12(n-2)$、一面 $=6(n-2)^2$、无面 $=(n-2)^3$。", keyPoints: ["把新题映射到已解结构", "立方体：8 / 12(n-2) / 6(n-2)² / (n-2)³", "四类相加应等于 n³"] },
    ],
    workedExamples: [
      { title: "往返平均速度", question: "去程 30 km/h，原路返回 60 km/h，全程平均速度？", solution: "不是 45。设单程 d：总时间 d/30+d/60=d/20，总距离 2d，平均 =2d÷(d/20)=40 km/h。公式 $\\frac{2\\cdot30\\cdot60}{90}=40$。", tip: "往返等距用调和平均，永远小于算术平均。" },
      { title: "连续折扣", question: "£200 先降 10%，再在此价降 20%，最终价？", solution: "200×0.9×0.8=£144（不是降 30% 的 £140）。", tip: "多重百分比一律相乘。" },
    ],
  },
  {
    topicId: "tara-writing",
    overview: "写作任务（Writing Task）是 TARA 第三模块：40 分钟、≤750 词，从 3 个题目中选 1。**它不是自由议论文**——每题给一句「陈述」，要求你固定三步作答：① 解释这句话的含义；② 给出反对它的、有理有据的论证；③ 讨论你在多大程度上同意它。UAT-UK 不评分，答卷直接发给院校参考。三部分必须都充分写到，缺一不可。",
    concepts: [
      { name: "三段式结构（务必三部分都写）", body: "1. **解释含义**：用自己的话讲清这句陈述在主张什么、关键词是什么意思、它在什么条件下成立。别急着表态。\\n2. **反对论证**：无论你是否认同，都要认真构造一个反对该陈述的、最有力的论证（这是很多人漏写的一步）。\\n3. **讨论认同程度**：权衡两边，给出你「在多大程度上同意」——通常是「有条件地同意/不同意」，用「in cases where…」区分情形，而非一刀切。", keyPoints: ["三部分缺一不可，尤其别漏「反对论证」", "解释部分先厘清关键词与适用条件", "结论用「有条件」表述，避免非黑即白"] },
      { name: "时间与语言", body: "40 分钟建议：5 分钟审题+列三部分要点，30 分钟写，5 分钟检查。750 词是上限，不必写满——清晰 > 冗长。用逻辑连接词（however / consequently / nevertheless）标示论证走向；无计算器/词典，注意拼写语法。", keyPoints: ["先列「解释/反对/认同」三栏要点再动笔", "清晰准确 > 辞藻堆砌", "留时间检查语法拼写"] },
      { name: "常见失误", body: "- **漏掉「反对论证」**：只解释 + 表态，没认真构造反方——直接失分。\\n- **不解释就开吵**：跳过含义厘清，论证容易跑偏。\\n- **骑墙不表态**：第三步要给出明确的「认同程度」，不能含糊。\\n- **例证空泛**：给一个真实贴切的例子胜过十句口号。", keyPoints: ["三步都要有，且各占相当篇幅", "先解释、再反驳、后表态，顺序别乱", "用具体例子支撑，不空喊"] },
    ],
    workedExamples: [
      { title: "范文一：\"Competition always produces better results.\"", question: "约 420 词，示范「解释—反对—讨论」三段式。", solution: "**Explanation.** The statement claims that whenever people or organisations compete, the outcome is superior to what would occur without competition. 'Better results' presumably means higher quality, greater efficiency, or faster progress. Taken strictly, the word 'always' makes this a universal claim: competition is said to improve outcomes in every case, from markets to schools to scientific research.\\n\\n**An argument against.** There are clear cases where competition worsens results. When rewards go only to the winner, competitors may cut corners, conceal useful information, or take reckless risks to get ahead — behaviour that lowers overall quality. In science, excessive competition for priority can discourage the sharing of data on which collective progress depends. Cooperation, not rivalry, often produces the best results: an orchestra or a surgical team succeeds precisely because its members coordinate rather than compete. If even one important domain works better through cooperation, the universal claim 'always' is false.\\n\\n**The extent to which I agree.** I agree only in part. Competition clearly can drive improvement: it pressures firms to lower prices and rewards genuine merit, and a world with no competition at all would risk complacency. But the word 'always' cannot be defended. Whether competition helps depends on conditions: it tends to improve results when the contest is fair, when 'winning' is aligned with real quality, and when losing is not catastrophic; it tends to harm results when it rewards the wrong things, destroys cooperation, or pushes people to game the measure rather than improve the underlying good. My view, therefore, is that competition is a powerful tool that produces better results under the right conditions, but not a universal law — and treating it as one can do real damage.", tip: "注意：反对段是拿分关键，即使你总体认同也要认真写。" },
      { title: "范文二：\"People should always be free to make their own choices.\"", question: "约 400 词，示范三段式与「区分情形」。", solution: "**Explanation.** The statement asserts that individuals should have complete freedom to decide how they act, without interference from others or the state. 'Always' makes this absolute: on this view, no choice may be overridden, however unwise. The claim rests on the value of personal autonomy — the idea that a life goes better when it is directed by the person living it.\\n\\n**An argument against.** Absolute freedom of choice cannot be right, because some choices harm other people. My freedom to drive as I please ends where it endangers pedestrians; my freedom to pollute imposes costs on those downstream. A society that permitted every choice regardless of its effect on others would not be free but chaotic, since one person's unlimited freedom routinely destroys another's. Even choices that appear self-regarding — refusing a vaccine during an epidemic — can affect the wider community. So the principle, stated absolutely, collapses as soon as choices collide.\\n\\n**The extent to which I agree.** I agree with the spirit of the statement but not with the word 'always'. Autonomy is genuinely valuable, and the burden of proof should fall on anyone who wants to restrict a person's choices: freedom should be the default. But the defensible principle is narrower — people should be free to make choices that fall primarily on themselves, provided they are adequately informed and do not impose serious harm on others. Where those conditions fail, some limits are justified. So I agree that freedom of choice should be protected and expansive, but not unlimited; the value the statement points to is real, while the absolute form it takes is indefensible.", tip: "第三步用「区分情形」（只影响自己 vs 伤及他人）比笼统同意/反对更有力。" },
      { title: "陈述句题库（练习用）", question: "更多 TARA 风格的陈述句题目？", solution: "每题用「解释—反对—讨论认同度」三段式，限时 40 分钟：\\n1) \"Scientific progress always improves human life.\"\\n2) \"A good decision is one that turns out well.\"\\n3) \"We should judge people only by their actions, not their intentions.\"\\n4) \"It is always wrong to break the law.\"\\n5) \"Money is the main thing that motivates people.\"\\n6) \"Experts should be trusted more than public opinion.\"\\n7) \"History is written by the winners.\"\\n8) \"The purpose of education is to get a good job.\"", tip: "选一句你能同时想到「有力支持」和「有力反对」的陈述来练，最能锻炼反对段。" },
    ],
  },
];
