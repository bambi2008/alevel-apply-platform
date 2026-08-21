"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { Photo } from "@/components/photo";
import { SceneGrowth } from "@/components/illustrations";
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 items-center mb-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 [&>div]:mb-0">
          <PageHeader
            title="考试训练中心"
            subtitle="入学考试与 A-Level 学科考试：专项练习、完整模考、知识复习与学习分析。"
            icon="A+"
          />
        </div>
        <Photo
          src="/images/hero.jpg"
          alt="学生进行考试训练"
          className="hidden h-[200px] w-full rounded-lg object-cover lg:block"
          fallback={<SceneGrowth className="h-auto w-full rounded-lg" />}
        />
      </div>

      <div className="mb-8 border-l-4 border-[var(--indigo)] bg-[var(--info-bg)] px-4 py-3 text-sm text-[var(--ink-soft)]">
        <span className="font-semibold text-[var(--indigo)]">用途提示：</span>
        MAT / PAT 已停用，标为“历史训练”；BMO / BPhO 已移至“竞赛与专业实践”；STEP 通常属于 Offer 条件。
        当前考试要求会随申请周期和课程变化，请同时核对院校与考试机构官网。
      </div>

      {profileLoaded && hasTestIntent(profile) && (
        <p className="mb-5 text-sm text-[var(--ink-soft)]">
          已根据你的意向院校、意向专业和在读科目筛选当前相关考试。
        </p>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-1" aria-label="按学科筛选">
        {CATEGORY_TABS.filter((tab) => tab.id === "all" || availableCategories.has(tab.id)).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === tab.id
                ? "bg-[var(--indigo)] text-white"
                : "bg-[var(--surface-2)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}<span className="ml-1 text-xs opacity-70">{tab.labelEn}</span>
          </button>
        ))}
      </div>

      {!profileLoaded ? (
        <p className="py-12 text-center text-sm text-[var(--ink-faint)]">正在读取你的训练档案…</p>
      ) : <div className="space-y-10">
        {PURPOSES.map((purpose) => {
          const tests = filtered.filter((test) => getTestPurpose(test) === purpose.id);
          if (tests.length === 0) return null;
          return (
            <section key={purpose.id}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold text-[var(--ink)]">{purpose.label}</h2>
                <span className="text-xs text-[var(--ink-faint)]">{purpose.labelEn} · {purpose.note}</span>
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tests.map((test) => <TestCard key={test.id} test={test} />)}
              </div>
            </section>
          );
        })}
      </div>}

      <p className="mt-10 text-xs text-[var(--ink-faint)] text-center">
        考试用途、学院安排和英语门槛以当前申请周期的院校官网、考试机构官网及个人 Offer 为准。
      </p>
    </div>
  );
}

function TestCard({ test }: { test: AdmissionsTest }) {
  const purpose = getTestPurpose(test);
  return (
    <Link
      href={`/tests/${test.id}`}
      className="group block min-w-0 rounded-lg border border-[var(--border)] bg-white p-5 transition hover:border-[color:var(--indigo)]/35 hover:shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 min-w-9 items-center justify-center text-lg font-bold text-[var(--indigo)]">{test.icon}</span>
          <div className="min-w-0">
            <div className="text-lg font-bold leading-tight">{test.abbr}</div>
            <div className="truncate text-xs text-[var(--ink-faint)]">{test.nameZh}</div>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          purpose === "legacy" || purpose === "competition"
            ? "bg-[var(--warning-bg)] text-[var(--warning)]"
            : "bg-[var(--info-bg)] text-[var(--indigo)]"
        }`}>
          {PURPOSE_BADGES[purpose]}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--ink-soft)]">{test.overview}</p>
      <div className="space-y-1.5 text-xs text-[var(--ink-soft)]">
        <p className="line-clamp-1"><span className="font-medium text-[var(--ink)]">适用：</span>{test.programs.slice(0, 3).join(" · ")}</p>
        <p className="break-words"><span className="font-medium text-[var(--ink)]">时长：</span>{test.duration}</p>
        <p><span className="font-medium text-[var(--ink)]">模块：</span>{test.topics.length} 个知识点</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className={test.hasQuestionBank ? "text-[var(--success)]" : "text-[var(--ink-faint)]"}>
          {test.hasQuestionBank ? "题库与模考已接入" : "备考指南"}
        </span>
        <span className="font-medium text-[var(--indigo)] group-hover:underline">进入中心 →</span>
      </div>
    </Link>
  );
}
