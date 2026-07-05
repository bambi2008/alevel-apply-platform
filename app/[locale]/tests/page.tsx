"use client";

import { PageHeader } from "@/components/page-header";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  ADMISSIONS_TESTS,
  TEST_CATEGORIES,
  type TestCategory,
  type AdmissionsTest,
} from "@/lib/tests";

const CATEGORY_TABS: { id: TestCategory | "all"; label: string; labelEn: string }[] = [
  { id: "all", label: "全部", labelEn: "All" },
  { id: "mathematics", label: "数学类", labelEn: "Mathematics" },
  { id: "science", label: "理科类", labelEn: "Science" },
  { id: "thinking", label: "思维类", labelEn: "Thinking Skills" },
  { id: "law", label: "法学类", labelEn: "Law" },
];

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState<TestCategory | "all">("all");

  const filtered = activeCategory === "all"
    ? ADMISSIONS_TESTS
    : ADMISSIONS_TESTS.filter((t) => t.category === activeCategory);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <PageHeader
        title="入学笔试备考中心"
        subtitle="9 种考试 · 结构说明 · 备考计划 · 知识点练习 · 计时模考"
        icon="📐"
      />
      <div className="mb-8">
        <div className="mt-0 rounded-xl border border-indigo-100 bg-brand-soft px-4 py-3 text-sm text-[var(--ink-soft)]">
          <span className="font-semibold text-[var(--indigo)]">📌 使用说明：</span>
          点击任一考试进入详情页，查看考试结构、完整备考计划、知识点练习和模拟考试。
          MAT、STEP、ESAT 提供 AI 题库练习（由 Claude 生成，经多 AI 审核）。
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === tab.id
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-70">{tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Test cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-xs text-neutral-400 text-center">
        ※ 考试要求以各院校官网及考试机构官网为准。部分考试（ENGAA/NSAA）已更新，请确认最新信息。
      </p>
    </div>
  );
}

function TestCard({ test }: { test: AdmissionsTest }) {
  const cat = TEST_CATEGORIES[test.category];
  return (
    <Link
      href={`/tests/${test.id}`}
      className="block rounded-2xl border border-neutral-200 p-5 hover:border-blue-300 hover:shadow-sm transition bg-white group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-mono text-blue-600 font-bold w-8 text-center">
            {test.icon}
          </span>
          <div>
            <div className="font-bold text-lg leading-tight">{test.abbr}</div>
            <div className="text-xs text-neutral-400">{test.nameZh}</div>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          test.hasQuestionBank
            ? "bg-green-100 text-green-700"
            : "bg-neutral-100 text-neutral-500"
        }`}>
          {test.hasQuestionBank ? "AI 题库" : "备考指南"}
        </span>
      </div>

      <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
        {test.overview}
      </p>

      <div className="space-y-1.5 text-xs text-neutral-500">
        <div className="flex items-start gap-1.5">
          <span className="shrink-0">🏛</span>
          <span className="line-clamp-1">{test.universities.slice(0, 2).join(" · ")}{test.universities.length > 2 ? ` 等` : ""}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="shrink-0">⏱</span>
          <span>{test.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="shrink-0">📚</span>
          <span>{test.topics.length} 个知识点模块</span>
        </div>
      </div>

      {test.statusNote && (
        <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-lg px-2 py-1 leading-snug">
          {test.statusNote.substring(0, 60)}…
        </div>
      )}

      <div className="mt-3 flex items-center text-xs text-blue-600 font-medium group-hover:underline">
        查看备考详情 →
      </div>
    </Link>
  );
}
