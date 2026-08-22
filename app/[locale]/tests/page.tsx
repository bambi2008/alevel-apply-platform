"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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

      <div className="mt-5 border-l-2 border-[var(--indigo)] pl-4 text-sm leading-6 text-[var(--ink-soft)]">
        <span className="font-semibold text-[var(--indigo)]">用途提示：</span>
        MAT / PAT 已停用，标为“历史训练”；BMO / BPhO 已移至“竞赛与专业实践”；STEP 通常属于 Offer 条件。
        当前考试要求会随申请周期和课程变化，请同时核对院校与考试机构官网。
      </div>

      {profileLoaded && hasTestIntent(profile) && (
        <p className="mb-5 text-sm text-[var(--ink-soft)]">
          已根据你的意向院校、意向专业和在读科目筛选当前相关考试。
        </p>
      )}

      <CoreTabBar label="按学科筛选">
        {CATEGORY_TABS.filter((tab) => tab.id === "all" || availableCategories.has(tab.id)).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={coreTabClass(activeCategory === tab.id)}
          >
            {tab.label}<span className="ml-1 text-xs opacity-70">{tab.labelEn}</span>
          </button>
        ))}
      </CoreTabBar>

      {!profileLoaded ? (
        <p className="py-12 text-center text-sm text-[var(--ink-faint)]">正在读取你的训练档案…</p>
      ) : <div className="space-y-9 pt-7">
        {PURPOSES.map((purpose) => {
          const tests = filtered.filter((test) => getTestPurpose(test) === purpose.id);
          if (tests.length === 0) return null;
          return (
            <section key={purpose.id}>
              <CoreSectionHeader title={purpose.label} meta={`${tests.length} 个考试`} />
              <p className="mt-1 text-xs leading-5 text-[var(--ink-faint)]">{purpose.labelEn} · {purpose.note}</p>
              <CoreList>
                {tests.map((test) => <TestRow key={test.id} test={test} />)}
              </CoreList>
            </section>
          );
        })}
      </div>}

      <p className="mt-10 text-xs text-[var(--ink-faint)] text-center">
        考试用途、学院安排和英语门槛以当前申请周期的院校官网、考试机构官网及个人 Offer 为准。
      </p>
    </CorePageShell>
  );
}

function TestRow({ test }: { test: AdmissionsTest }) {
  const purpose = getTestPurpose(test);
  return (
    <Link
      href={`/tests/${test.id}`}
      className="group grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(160px,0.75fr)_minmax(0,1.7fr)_auto] sm:items-center sm:gap-5"
    >
      <div className="min-w-0">
        <h3 className="font-medium text-[var(--ink)] group-hover:text-[var(--indigo)]">{test.abbr}</h3>
        <p className="truncate text-xs text-[var(--ink-faint)]">{test.nameZh}</p>
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm leading-6 text-[var(--ink-soft)]">{test.overview}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-faint)]">
          {test.duration} · {test.topics.length} 个知识点 · {test.programs.slice(0, 2).join(" / ")}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className={`text-xs ${purpose === "legacy" ? "text-[var(--warning)]" : "text-[var(--ink-faint)]"}`}>
          {PURPOSE_BADGES[purpose]}
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">
          {test.hasQuestionBank ? "进入" : "查看"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
