"use client";

import { useEffect, useState } from "react";

interface Step {
  num: number;
  timing: string;      // e.g. "入学前 2 年 · 全年"
  zhTitle: string;
  enTerm: string;
  desc: string;
  tip?: string;
  regionNote?: string;
  highlight?: boolean; // 重点步骤
}

const STEPS: Step[] = [
  {
    num: 1,
    timing: "入学前 3 年 · Year 11 全年",
    zhTitle: "GCSE 阶段 · 提前规划",
    enTerm: "GCSE / Pre-A-Level Planning",
    desc: "Year 11 是 GCSE/IGCSE 考试年，也是为 A-Level 和大学申请打基础的关键时机。这一年要做的事：确认是否走 A-Level 路线、了解目标大学对 A-Level 科目的硬性要求，并据此规划 Year 12 选科。选错科目将直接导致无法申请目标专业，代价极高。",
    tip: "家长须知：A-Level 科目一旦在 Year 12 开始就很难更换。Year 11 阶段就要和孩子认真讨论专业方向，对照目标院校的科目要求来确定选科，不要等到 Year 12 才考虑。",
  },
  {
    num: 3,
    timing: "入学前 2 年 · Year 12 全年",
    zhTitle: "确定方向 · 深度调研",
    enTerm: "Research",
    desc: "在 A-Level 第一年（Year 12）就要开始确定专业大方向——理工、商科、法律、人文等。收集目标院校的入学要求：需要哪几门 A-Level 科目、典型成绩要求是多少、雅思最低分、是否需要笔试或面试。越早调研，后面选择余地越大。",
    tip: "重点：不同专业对 A-Level 科目组合有硬性要求。医学要化学+生物，工程要数学+物理，经济学通常要数学。Year 12 开学前就要确定，否则选错科目无法申请。",
  },
  {
    num: 4,
    timing: "入学前 2 年 · Year 12 全年",
    zhTitle: "背景包装 · 课外经历积累",
    enTerm: "Profile Building",
    highlight: true,
    desc: "英国顶尖院校非常看重学生在学术之外的「超课程」经历，用来证明你对所申专业的真实热情与独立思考能力。这包括：学科竞赛、科研项目、学术阅读、相关实习或志愿服务、暑期课程等。这些经历将直接写进个人陈述，是拉开差距的关键。",
    tip: "家长须知：「背景包装」不是造假，而是真实参与有意义的活动。牛剑等顶校能从个人陈述判断经历的真实深度。建议从 Year 12 开始系统规划：选 1–2 个与目标专业强相关的方向深入，比参加 10 个浅层活动更有效。",
  },
  {
    num: 5,
    timing: "入学前 2 年 · Year 12 暑假",
    zhTitle: "暑期项目 · 科研 / 实习",
    enTerm: "Summer Program / Internship",
    desc: "Year 12 暑假是积累背景的黄金时间窗口。可以参加英国大学暑期学校（如牛津/LSE/UCL 的 Summer School）、国内顶校科研项目、相关行业实习或志愿活动。这些经历既能检验兴趣方向，也是个人陈述的一手素材。",
    tip: "策略建议：英国大学 Summer School 申请一般在当年 2–4 月开放，Year 12 春季就要留意。部分项目提供奖学金，费用并非障碍。",
  },
  {
    num: 6,
    timing: "入学前 1 年 · Year 13 · 9 月",
    zhTitle: "注册 UCAS · 创建账号",
    enTerm: "UCAS Registration",
    regionNote: "仅英国",
    desc: "UCAS 是英国所有本科申请的统一平台，相当于英国版的「高考志愿系统」。最多可填 5 所院校、5 个专业（牛津剑桥只能选其中一所）。注册后需要填写个人基本信息、成绩记录，并绑定学校——老师需要通过 UCAS 系统提交推荐信。",
    tip: "家长须知：UCAS 账号必须由学生本人注册。推荐信由学校老师直接在系统提交，不经过学生之手，家长也无法查看内容。",
  },
  {
    num: 7,
    timing: "入学前 1 年 · Year 13 · 10–11 月",
    zhTitle: "撰写个人陈述",
    enTerm: "Personal Statement",
    highlight: true,
    desc: "个人陈述（Personal Statement）是申请中最重要的文书，向院校解释「你为什么想学这个专业、你做了哪些准备、你能为院校带来什么」。2026 年入学起改为三个结构化问题，总字数约 4000 字符。需要学生本人原创，UCAS 内置查重系统。",
    tip: "家长须知：个人陈述必须是学生本人写的，代写有被取消资格的风险。家长可以帮助孩子整理思路、梳理经历素材，但不能代劳文字。这份文书要靠 Year 12 积累的真实经历来支撑——这正是「背景包装」提前规划的意义。",
  },
  {
    num: 8,
    timing: "入学前 1 年 · 10 月 15 日（牛剑）\n入学当年 · 1 月 15 日（其余英国）",
    zhTitle: "提交 UCAS 申请",
    enTerm: "UCAS Submission",
    regionNote: "仅英国",
    desc: "申请牛津、剑桥及大部分医学专业的截止日是 10 月 15 日；其余英国院校统一截止 1 月 15 日。香港院校通常通过各校官网直申，截止日多在入学当年 3–4 月。截止后不能修改志愿。",
    tip: "重点：建议在截止日前 2–4 周提交！部分院校先到先审，越早越有优势。推荐信一旦老师提交即锁定，无法再修改。",
  },
  {
    num: 9,
    timing: "入学当年 · 2–4 月",
    zhTitle: "等待院校决定",
    enTerm: "Decisions via UCAS Track",
    desc: "提交后通过 UCAS Track 系统查看结果，院校给出三种回复：有条件录取（Conditional Offer，A-Level 达到指定成绩才正式录取）、无条件录取（Unconditional Offer）、拒绝（Rejection）。有条件录取是绝大多数学生的结果，不是坏事。",
    tip: "家长须知：收到 Conditional Offer 不等于已经录取，仍需 8 月 A-Level 放榜达标后才能最终确认。在此期间继续专心备考，而不是放松。",
  },
  {
    num: 10,
    timing: "入学当年 · 5 月初",
    zhTitle: "选择第一志愿和保底",
    enTerm: "Firm & Insurance Choice",
    desc: "收到所有院校回复后，在 UCAS 规定日期前从已获 Offer 的院校里选一所作为「第一志愿（Firm）」，再选一所成绩要求稍低的作为「保底（Insurance）」。其余志愿自动放弃。",
    tip: "策略建议：Insurance 院校的 A-Level 成绩要求应比 Firm 低 1–2 个等级，作为真正的风险对冲。不要选两所要求一样高的院校。",
  },
  {
    num: 11,
    timing: "入学当年 · 5–6 月",
    zhTitle: "参加 A-Level 正式考试",
    enTerm: "A-Level Exams",
    highlight: true,
    desc: "这是整个申请链条的核心关卡。A-Level 考试成绩直接决定有条件 Offer 是否兑现。考试由考试局（AQA / Edexcel / Cambridge 等）统一组织，在学校或指定考场参加，不同科目考试时间分散在 5–6 月。",
    tip: "家长须知：A-Level 成绩不是考完立刻出分，而是约 8 周后的 8 月中旬统一公布。考完后还有漫长的等待期，保持心态平稳。",
  },
  {
    num: 12,
    timing: "入学当年 · 8 月中旬",
    zhTitle: "放榜 · 确认入学",
    enTerm: "Results Day & Confirmation",
    desc: "A-Level 成绩公布当天，UCAS 系统自动比对成绩与 Offer 条件：达到 Firm 要求则确认录取；若未达 Firm 但达 Insurance 要求，则转入 Insurance 院校；若两所都未达标，则进入 Clearing 通道（类似补录，仍有机会）。香港院校也在同期做最终确认。",
    tip: "重点：放榜当天要守在手机/电脑旁，UCAS Track 会第一时间显示结果。若成绩未达标，Clearing 通道当天即开放，要迅速行动。",
  },
];

const SEEN_KEY = "alevel:guide:seen";

export function ProcessOverview({ forceExpand = false }: { forceExpand?: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!forceExpand) return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      setShowAll(true);
      localStorage.setItem(SEEN_KEY, "1");
    }
  }, [forceExpand]);

  const toggle = (num: number) => {
    if (showAll) { setShowAll(false); setExpanded(num); }
    else setExpanded((e) => (e === num ? null : num));
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">英国 / 香港本科申请全流程</h2>
          <p className="text-sm text-neutral-500 mt-0.5">UK & HK Undergraduate Application — Complete Guide</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-blue-600 hover:underline shrink-0 mt-1"
        >
          {showAll ? "收起全部" : "展开全部"}
        </button>
      </div>

      <div>
        {STEPS.map((step, idx) => {
          const isExpanded = showAll || expanded === step.num;
          return (
            <div key={step.num} className="relative flex gap-4">
              {/* connector line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0 z-10 ${step.highlight ? "bg-blue-600 ring-2 ring-blue-200" : "bg-neutral-400"}`}>
                  {step.num}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-neutral-200 mt-1" />
                )}
              </div>

              {/* content */}
              <div className="pb-7 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggle(step.num)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className={`font-semibold ${step.highlight ? "text-blue-700" : "text-neutral-900"}`}>
                          {step.zhTitle}
                        </span>
                        <span className="text-xs text-neutral-400">{step.enTerm}</span>
                        {step.highlight && (
                          <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">重点</span>
                        )}
                        {step.regionNote && (
                          <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">{step.regionNote}</span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5 whitespace-pre-line">{step.timing}</div>
                    </div>
                    <span className="text-neutral-300 text-sm shrink-0 mt-0.5">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-neutral-700 leading-relaxed">{step.desc}</p>
                    {step.tip && (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-800 leading-relaxed">
                        <span className="font-semibold">📌 </span>{step.tip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 mt-1">
        ※ 香港院校通过各校官网直申，时间节点略有差异，具体以各校官网为准。所有时间以「入学年份」为基准推算。
      </p>
    </div>
  );
}
