"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
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
}> = [
  { id: "admissions", label: "现行入学考试" },
  { id: "college-assessment", label: "学院附加评估" },
  { id: "curriculum", label: "A-Level 学科考试" },
  { id: "language", label: "英语要求" },
  { id: "offer-condition", label: "Offer 条件考试" },
  { id: "legacy", label: "历史训练" },
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
        description="选一门考试，直接开始。"
        meta={profileLoaded ? `${examTests.length} 个相关考试` : "正在读取训练档案"}
      />

      {profileLoaded && hasTestIntent(profile) && (
        <p className="mt-5 inline-flex rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-xs text-black/55">已按你的档案筛选</p>
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
      ) : <div className="space-y-10 pt-9">
        {PURPOSES.map((purpose) => {
          const tests = filtered.filter((test) => getTestPurpose(test) === purpose.id);
          if (tests.length === 0) return null;
          return (
            <section key={purpose.id}>
              <CoreSectionHeader title={purpose.label} meta={`${tests.length} 个考试`} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tests.map((test, index) => <TestRow key={test.id} test={test} index={index + 1} />)}
              </div>
            </section>
          );
        })}
      </div>}

      <p className="mt-12 border-t border-black/15 pt-5 text-center text-xs text-black/35">具体要求以院校与考试机构官网为准。</p>
    </CorePageShell>
  );
}

function TestRow({ test, index }: { test: AdmissionsTest; index: number }) {
  const purpose = getTestPurpose(test);
  return (
    <Link
      href={`/tests/${test.id}`}
      className="group relative flex min-h-44 min-w-0 flex-col rounded-2xl border border-black/15 bg-white/35 p-5 transition hover:-translate-y-1 hover:border-black/30 hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-semibold tracking-[0.16em] text-black/30">{String(index).padStart(2, "0")}</span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/45 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-black/35 group-hover:text-black">
          <span className="sr-only">{test.hasQuestionBank ? "进入" : "查看"}</span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-6 min-w-0">
        <h3 className="text-2xl font-semibold tracking-[-0.035em] text-[#101817]">{test.abbr}</h3>
        <p className="mt-1 truncate text-sm text-black/45">{test.nameZh}</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <p className="text-xs text-black/35">{test.duration} · {test.topics.length} 个知识点</p>
        <span className={`text-xs ${purpose === "legacy" ? "text-[var(--warning)]" : "text-black/35"}`}>
          {PURPOSE_BADGES[purpose]}
        </span>
      </div>
    </Link>
  );
}
