# TARA 来源与现有题库审计

审计日期：2026-07-21

## 结论

用户提供的 `TARA.zip` 是一套有价值的官方备考来源集合，但不是 TARA 历年正式卷。压缩包包含：

- 2016-2023 BMAT Section 1 题卷及答案；
- 2025 TARA Content Specification；
- 2025 TARA Question Guide；
- 一份重复的 2018 BMAT Section 1 Answer Key。

TARA 于 2025 年 10 月首次开考，因此 2016-2023 文件不可能是 TARA 真题。UAT-UK 官方备考页明确说明 TARA 的 Critical Thinking 和 Problem Solving 与 BMAT Section 1、TSA 有共同历史，并把这些旧卷列为推荐材料。因此，本项目将它们作为题型、推理深度和干扰项设计的校准来源，不会把原题标注为 TARA 真题，也不会逐字复制进公开题库。

## 文件清单

源压缩包：

- 文件：`D:/alevel/TARA.zip`
- 大小：3,819,925 bytes
- SHA-256：`94EA96CEB839981307DE8F417922CBC2B28667B17523C0D60992F938C943D30C`
- PDF 条目：19
- 去重后 PDF：18

BMAT 客观题数量：

| 年份 | Section 1 题数 | 题卷页数 |
| --- | ---: | ---: |
| 2016 | 33 | 28 |
| 2017 | 34 | 36 |
| 2018 | 34 | 32 |
| 2019 | 33 | 32 |
| 2020 | 32 | 24 |
| 2021 | 32 | 24 |
| 2022 | 32 | 24 |
| 2023 | 32 | 28 |
| 合计 | 262 | 228 |

两份 2018 Answer Key 的 SHA-256 均为 `18fbccc1e5861d2518f2c60c3e4694ed2de4ab056124f1118364752453cc716b`，确认是完全重复文件。

## 最新官方结构

截至 2026-07-21，UAT-UK 官网对 2027 入学周期仍规定：

| 模块 | 格式 | 时间 |
| --- | --- | ---: |
| Critical Thinking | 22 道五选一 | 40 分钟 |
| Problem Solving | 22 道五选一 | 40 分钟 |
| Writing Task | 三选一，最多 750 词 | 40 分钟 |

三个模块必须依次完成并独立计时；不能使用计算器或词典；客观题答错不倒扣。Critical Thinking 和 Problem Solving 分别报告 1.0-9.0 分，Writing Task 不由 UAT-UK 评分，原文发送给使用 TARA 的院校。

官方来源：

- [TARA test format](https://esat-tmua.ac.uk/about-the-tests/tara/)
- [TARA preparation materials](https://esat-tmua.ac.uk/tara-preparation-materials/)

## 官方能力模型

Critical Thinking 必须覆盖七类能力：

1. Identifying the Main Conclusion
2. Drawing a Conclusion
3. Identifying an Assumption
4. Assessing the Impact of Additional Evidence
5. Detecting Reasoning Errors
6. Matching Arguments
7. Applying Principles

Problem Solving 必须覆盖三类能力：

1. Relevant Selection
2. Finding Procedures
3. Identifying Similarity

允许的数学内容限于基础数概念、四则运算、百分比、平均数、时间和日历、金钱、常用度量换算、矩形面积与周长、长方体体积，以及图表信息提取。复杂分数、小数运算和超出清单的学校数学不应成为解题门槛。

## 当前项目基线

当前 TARA 题库共有：

- 210 道客观题；
- 3 道写作任务，每道包含三个可选命题；
- 3 套固定客观模拟卷；
- 3 套固定写作卷。

数量已经不薄，但固定客观卷尚不具备封库质量。

### 固定卷诊断

| 模块 | 主要问题 |
| --- | --- |
| Mock 1 Critical Thinking | 正确答案只出现在 A-C；B 占 13/22；全部标为难度 2 |
| Mock 2 Critical Thinking | 正确答案只出现在 A-C；A 占 16/22；全部标为难度 2 |
| Mock 3 Critical Thinking | 22/22 的正确答案都在 A；全部标为难度 2 |
| 三套 Problem Solving | 66/66 道题落入 17 个“只换数字”的重复模板组 |
| Mock 3 Problem Solving | 16 道基础题、6 道中等题、0 道挑战题 |
| 内容边界 | 出现勾股定理、三角形面积等官方知识清单之外的直接学科题 |
| 题型覆盖 | Relevant Selection 与 Identifying Similarity 明显不足，直接计算题过多 |

现有固定卷不能通过未来的 TARA 专项审计，必须先重做，不能通过继续加卷掩盖问题。

## 工程顺序

1. 重做 Mock 1-3 的 Problem Solving，共 66 道独立结构题，严格覆盖三类官方能力并移除超纲数学。
2. 校准 Mock 1-3 的 Critical Thinking，补齐七类题型、难度梯度和 A-E 答案位置。
3. 建立 `audit:tara`，检查 22 题、40 分钟、五选一、答案位置、难度、七类/三类覆盖、逐字重复和数字归一化后的模板重复。
4. 完成三套卷桌面端与手机端整卷验收。
5. 旧三套达到 `0 critical / 0 warnings` 后，再建设 Mock 4-6；不在弱卷未修复时继续堆数量。
6. 写作卷单独按官方三步要求审计：解释命题、给出有理由的反论证、讨论认同程度；坚持标明平台评分仅用于形成性反馈。

## 来源使用规则

- 官方 TARA Specification 与 Question Guide 决定结构和知识边界。
- BMAT Section 1 用于学习问题结构、信息密度和干扰项逻辑。
- 新固定卷使用原创场景、数据和表述，不逐字复制受版权保护的旧卷。
- 任何源题迁移都必须重新验算答案，并检查是否符合当前 TARA 的五选一、40 分钟模块和无计算器要求。

## Completion status (2026-07-21)

- Mock 1-3 Problem Solving rebuilt as 66 calibrated slots with a 5/12/5 skill split per paper.
- Mock 1-3 Critical Thinking calibrated to cover all seven official skills.
- Mock 4-6 added only after the original three papers passed the same audit gate.
- Every objective module has 22 five-option questions, a 40-minute timer, a 4/12/6 difficulty split, and a 5/5/4/4/4 answer-position distribution.
- `pnpm audit:tara` result: 6 objective papers, 3 writing papers, 264 objective slots, 0 critical issues, 0 warnings.
- Second-pass quality calibration requires at least three independent reasoning structures for each of the seven Critical Thinking skills across Mock 4-6.
- Semantic regression tests verify that generated service choices are eligible and cheapest, and that ranking-similarity answers preserve order without copying the source values.
- Writing-paper audit locks three unique prompts per paper, the official three-part task wording, the 750-word limit, five formative rubric dimensions, and explicit disclosure that the official task is unscored.
- Typed submission now blocks an answered essay with no selected statement and blocks manual submission above 750 words; timer expiry still auto-submits safely.
