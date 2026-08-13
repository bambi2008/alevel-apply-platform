import type { TopicKnowledge } from "./esat";

export const UCAT_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "ucat-vr",
    overview: "文字推理考查在极短时间内定位证据、区分文本事实与外部常识的能力。先读题干关键词，再回到对应句段，通常比从头精读全文更稳。",
    concepts: [
      { name: "True / False / Can't Tell", body: "True 必须被原文支持，False 必须被原文否定；两边都没有充分证据时选 Can't Tell。不要用常识填补文本空白。", keyPoints: ["只使用给定材料", "注意 all、some、may、must 等限定词", "找不到直接或必然证据时保持克制"] },
      { name: "证据定位", body: "用题干中的专名、数字、时间和独特名词建立定位点。先定位，再读取上下两句判断，不必为每题重读全文。", keyPoints: ["关键词优先", "结论题再看作者语气", "相似措辞不等于相同含义"] },
    ],
    workedExamples: [
      { title: "证据不足", question: "原文说某试点首月减少了用纸，但未比较总成本。能否断定试点节省了总成本？", options: [{ key: "A", text: "True" }, { key: "B", text: "False" }, { key: "C", text: "Can't Tell" }], answer: "C", solution: "减少一种投入不能推出总成本下降，原文也明确没有总成本比较。", tip: "问自己：原文是否排除了其他成本上升？" },
    ],
  },
  {
    topicId: "ucat-dm",
    overview: "决策判断混合考查形式逻辑、概率、论证评价和约束排序。关键是把自然语言迅速转成集合、条件或可检查的表格。",
    concepts: [
      { name: "三段论与集合", body: "把 All A are B 画成 A 完全位于 B 内；Some A are B 只保证至少一个交集。不能把充分条件反向使用。", keyPoints: ["All A are B 不等于 All B are A", "Some 表示存在", "逐条判断五陈述组合题"] },
      { name: "部分得分", body: "五陈述 Yes/No 组合题全部正确得 2 分，仅错一项得 1 分，其余为 0 分。每项独立核对可以显著降低连锁错误。", keyPoints: ["不要凭整体印象作答", "先确定必然项", "最后检查否定词"] },
    ],
    workedExamples: [
      { title: "单向包含", question: "所有导师都受过训练，某些志愿者是导师。哪项必然成立？", options: [{ key: "A", text: "某些志愿者受过训练" }, { key: "B", text: "所有受训者都是导师" }], answer: "A", solution: "存在既是志愿者又是导师的人，而导师集合包含于受训者集合。", tip: "沿箭头正向传递，不要反推。" },
    ],
  },
  {
    topicId: "ucat-qr",
    overview: "数量推理重在从表格或短情境中提取数据并快速完成比例、百分比、单位和速率计算。正式训练中应把估算当作错误检查，而不是额外步骤。",
    concepts: [
      { name: "百分比基数", body: "变化率 = 变化量 / 原始值。连续变化不能直接把百分比相加；先乘各自的变化因子。", keyPoints: ["确认分母是谁", "先估数量级", "留意百分数与百分点"] },
      { name: "单位与速率", body: "速率题先写单位：数量/时间、距离/时间或剂量/体重。换算完成后再代数，避免小时、分钟和毫升混用。", keyPoints: ["单位写在数旁边", "只在最后舍入", "反算检查合理性"] },
    ],
    workedExamples: [
      { title: "百分比增长", question: "费用从 £80 增至 £92，增长率是多少？", options: [{ key: "A", text: "12%" }, { key: "B", text: "15%" }, { key: "C", text: "18%" }], answer: "B", solution: "增长 £12，以原值 £80 为基数：12/80=15%。", tip: "不要把变化量 12 直接写成 12%。" },
    ],
  },
  {
    topicId: "ucat-sjt",
    overview: "情境判断不要求医学知识，而是判断行为的适当程度或因素的重要程度。稳定原则包括患者安全、诚实、保密、及时求助和在自身能力范围内行动。",
    concepts: [
      { name: "优先级框架", body: "先处理直接安全风险，再考虑诚信、保密和团队沟通。对于超出能力范围的问题，应寻求合格人员帮助，而不是猜测或隐瞒。", keyPoints: ["安全优先", "如实记录并及时升级", "尊重隐私与职业边界"] },
      { name: "相邻等级部分得分", body: "最佳等级得满分；与最佳等级相邻的选择可获部分分。训练时仍应判断行为本身，而不是利用部分分规则保守猜中间项。", keyPoints: ["区分不理想与严重不当", "看行为本身而非结果运气", "私人、适度的沟通通常优于公开指责"] },
    ],
    workedExamples: [
      { title: "承认能力边界", question: "患者询问你无法确认的用药问题，寻求合格人员帮助是否适当？", options: [{ key: "A", text: "非常适当" }, { key: "B", text: "适当但不理想" }, { key: "C", text: "不适当" }, { key: "D", text: "非常不适当" }], answer: "A", solution: "承认不确定并转向合格人员能保护患者，也符合诚实和能力边界。", tip: "不要为了显得自信而制造风险。" },
    ],
  },
];
