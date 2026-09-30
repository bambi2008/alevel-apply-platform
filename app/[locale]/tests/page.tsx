"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  CoreList,
  CorePageHeader,
  CorePageShell,
  CoreSectionHeader,
  CoreTabBar,
  coreTabClass,
} from "@/components/core-page-layout";
import {
  ADMISSIONS_TESTS,
  getTestPurpose,
  type AdmissionsTest,
  type TestCategory,
  type TestPurpose,
} from "@/lib/tests";
import { filterTestsForIntent, hasTestIntent } from "@/lib/tests/intent-filter";
import { loadProfile, type UserProfile } from "@/lib/profile/store";

const CATEGORY_TABS: { id: TestCategory | "all"; label: string; labelEn: string }[] = [
  { id: "all", label: "全部", labelEn: "All" },
  { id: "mathematics", label: "数学", labelEn: "Mathematics" },
  { id: "science", label: "理科", labelEn: "Science" },
  { id: "thinking", label: "思维", labelEn: "Thinking" },
  { id: "law", label: "法学", labelEn: "Law" },
  { id: "english", label: "英语", labelEn: "English" },
];

const PURPOSES: Array<{
  id: TestPurpose;
  label: string;
  labelEn: string;
  note: string;
}> = [
  { id: "admissions", label: "现行入学考试", labelEn: "Current admissions tests", note: "用于当前申请周期的统一或课程指定测试。" },
  { id: "college-assessment", label: "学院附加评估", labelEn: "College assessments", note: "只适用于指定学院或入围申请者，以学院通知为准。" },
  { id: "curriculum", label: "A-Level 学科考试", labelEn: "A-Level subject exams", note: "用于课程成绩、预测分与 Offer 条件，不是大学统一入学考试。" },
  { id: "language", label: "英语要求", labelEn: "English requirements", note: "用于满足课程、Offer 或签证相关语言条件。" },
  { id: "offer-condition", label: "Offer 条件考试", labelEn: "Offer conditions", note: "通常在申请后作为录取条件，而非所有人申请前统一参加。" },
  { id: "legacy", label: "历史训练", labelEn: "Legacy training", note: "考试已停用，保留题目用于深度推理和面试训练。" },
];

const PURPOSE_BADGES: Record<TestPurpose, string> = {
  admissions: "现行入学考试",
  "college-assessment": "学院附加评估",
  curriculum: "A-Level 学科考试",
  language: "英语要求",
  "offer-condition": "Offer 条件",
  legacy: "历史训练",
  competition: "竞赛提升",
};

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState<TestCategory | "all">("all");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    loadProfile()
      .then(setProfile)
      .finally(() => setProfileLoaded(true));
  }, []);

  const examTests = profileLoaded
    ? filterTestsForIntent(
        ADMISSIONS_TESTS.filter((test) => getTestPurpose(test) !== "competition"),
        profile,
      )
    : [];
  const availableCategories = new Set(examTests.map((test) => test.category));
  const filtered = activeCategory === "all"
    ? examTests
    : examTests.filter((test) => test.category === activeCategory);

  return (
    <CorePageShell>
      <CorePageHeader
        step="1 / 4"
        title="考试训练"
        description="按申请方向选择入学考试与 A-Level 学科考试，进入专项练习、完整模考、知识复习与学习分析。"
        meta={profileLoaded ? `${examTests.length} 个相关考试` : "正在读取训练档案"}
      />

      <div className="mt-8 grid gap-2 border-b border-black/15 pb-6 md:grid-cols-[7rem_minmax(0,1fr)]">
        <p className="text-xs font-semibold tracking-[0.18em] text-black/35">USE NOTE</p>
        <p className="max-w-4xl text-sm leading-6 text-black/55">
          <span className="font-semibold text-[#101817]">用途提示：</span>
          MAT / PAT 已停用，标为“历史训练”；BMO / BPhO 已移至“竞赛与专业实践”；STEP 通常属于 Offer 条件。
          当前考试要求会随申请周期和课程变化，请同时核对院校与考试机构官网。
        </p>
      </div>

      {profileLoaded && hasTestIntent(profile) && (
        <p className="mt-5 text-sm text-black/55">
          已根据你的意向院校、意向专业和在读科目筛选当前相关考试。
        </p>
      )}

      <div className="mt-7">
        <CoreTabBar label="按学科筛选">
          {CATEGORY_TABS.filter((tab) => tab.id === "all" || availableCategories.has(tab.id)).map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={coreTabClass(activeCategory === tab.id)}
            >
              {tab.label}<span className="ml-1 text-xs opacity-70">{tab.labelEn}</span>
            </button>
          ))}
        </CoreTabBar>
      </div>

      {!profileLoaded ? (
        <p className="py-12 text-center text-sm text-[var(--ink-faint)]">正在读取你的训练档案…</p>
      ) : <div className="space-y-12 pt-10">
        {PURPOSES.map((purpose) => {
          const tests = filtered.filter((test) => getTestPurpose(test) === purpose.id);
          if (tests.length === 0) return null;
          return (
            <section key={purpose.id}>
              <CoreSectionHeader title={purpose.label} meta={`${tests.length} 个考试`} />
              <p className="mt-1 text-sm leading-6 text-black/45">{purpose.labelEn} · {purpose.note}</p>
              <CoreList>
                {tests.map((test, index) => <TestRow key={test.id} test={test} index={index + 1} />)}
              </CoreList>
            </section>
          );
        })}
      </div>}

      <p className="mt-12 border-t border-black/15 pt-5 text-center text-xs leading-5 text-black/35">
        考试用途、学院安排和英语门槛以当前申请周期的院校官网、考试机构官网及个人 Offer 为准。
      </p>
    </CorePageShell>
  );
}

function TestRow({ test, index }: { test: AdmissionsTest; index: number }) {
  const purpose = getTestPurpose(test);
  return (
    <Link
      href={`/tests/${test.id}`}
      className="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-4 px-3 py-6 transition-colors hover:bg-white/60 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#101817] sm:grid-cols-[3rem_minmax(160px,0.75fr)_minmax(0,1.7fr)_auto] sm:items-center sm:gap-x-5 sm:px-5"
    >
      <span className="pt-1 text-xs font-semibold tracking-[0.16em] text-black/30">{String(index).padStart(2, "0")}</span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#101817]">{test.abbr}</h3>
        <p className="mt-1 truncate text-xs text-black/40">{test.nameZh}</p>
      </div>
      <div className="col-start-2 min-w-0 sm:col-start-auto">
        <p className="line-clamp-2 text-sm leading-6 text-black/55">{test.overview}</p>
        <p className="mt-1 text-xs leading-5 text-black/35">
          {test.duration} · {test.topics.length} 个知识点 · {test.programs.slice(0, 2).join(" / ")}
        </p>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:justify-end">
        <span className={`text-xs ${purpose === "legacy" ? "text-[var(--warning)]" : "text-black/35"}`}>
          {PURPOSE_BADGES[purpose]}
        </span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/45 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-black/35 group-hover:text-black">
          <span className="sr-only">{test.hasQuestionBank ? "进入" : "查看"}</span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
