"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { getKnowledgeByTopicId, type TopicKnowledge } from "@/lib/tests/knowledge";
import { MathRenderer } from "@/components/math-renderer";

export default function LearnPage({
  params,
}: {
  params: Promise<{ testId: string; topicId: string }>;
}) {
  const { testId, topicId } = use(params);
  const test = getTestById(testId);
  if (!test) notFound();

  const knowledge = getKnowledgeByTopicId(topicId);
  const topic = test.topics.find((t) => t.id === topicId);
  if (!topic || !knowledge) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/tests/${testId}`}
          className="text-sm text-neutral-500 hover:text-neutral-800 inline-block mb-4"
        >
          ← {test.abbr} 备考详情
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{topic.title}</h1>
            <p className="text-sm text-neutral-500 mt-0.5">{topic.titleEn}</p>
          </div>
          <Link
            href={`/tests/${testId}/practice?topic=${topicId}`}
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            开始专项练习 →
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section className="rounded-2xl bg-blue-50 border border-blue-100 px-6 py-5">
        <h2 className="text-sm font-semibold text-blue-800 mb-2 uppercase tracking-wide">
          考点概述
        </h2>
        <p className="text-sm text-blue-900 leading-relaxed">{knowledge.overview}</p>
      </section>

      {/* Concepts */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">核心知识点</h2>
        {knowledge.concepts.map((concept, i) => (
          <ConceptCard key={i} concept={concept} index={i} />
        ))}
      </section>

      {/* Worked Examples */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">考点例题精讲</h2>
        <p className="text-xs text-neutral-400">
          以下例题重点在于理解解题思路，建议先尝试自己解，再对照讲解。
        </p>
        {knowledge.workedExamples.map((ex, i) => (
          <WorkedExampleCard key={i} example={ex} index={i} />
        ))}
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-neutral-50 border border-neutral-200 px-6 py-6 text-center space-y-3">
        <p className="text-neutral-700 font-medium">知识点已掌握？开始专项刷题！</p>
        <p className="text-sm text-neutral-500">题库根据此知识点精选，难度从基础到挑战逐步递进。</p>
        <Link
          href={`/tests/${testId}/practice?topic=${topicId}`}
          className="inline-block px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          开始 {topic.title} 专项练习 →
        </Link>
      </div>
    </main>
  );
}

function ConceptCard({
  concept,
  index,
}: {
  concept: TopicKnowledge["concepts"][number];
  index: number;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="font-semibold text-neutral-800">{concept.name}</span>
        </div>
        <span className="text-neutral-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-neutral-100">
          <div className="mt-4 text-sm text-neutral-700 leading-relaxed">
            <MathRenderer text={concept.body} block />
          </div>
          {concept.keyPoints && concept.keyPoints.length > 0 && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800 mb-2">ESAT 考试重点</p>
              <ul className="space-y-1">
                {concept.keyPoints.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-amber-900">
                    <span className="mt-0.5 text-amber-500">◆</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WorkedExampleCard({
  example,
  index,
}: {
  example: TopicKnowledge["workedExamples"][number];
  index: number;
}) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-100">
        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-neutral-700">{example.title}</span>
      </div>

      {/* Question */}
      <div className="px-5 py-4">
        <MathRenderer text={example.question} className="text-neutral-900 leading-relaxed" block />
      </div>

      {/* Toggle solution */}
      {!showSolution ? (
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={() => setShowSolution(true)}
            className="px-4 py-2 rounded-lg border border-green-300 text-green-700 text-sm font-medium hover:bg-green-50 transition"
          >
            查看解析 →
          </button>
        </div>
      ) : (
        <div className="px-5 pb-5 border-t border-neutral-100">
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">解题过程</p>
            <div className="text-sm text-neutral-700 leading-relaxed">
              <MathRenderer text={example.solution} block />
            </div>
          </div>

          {example.tip && (
            <div className="mt-4 rounded-xl bg-purple-50 border border-purple-100 px-4 py-3">
              <p className="text-xs font-semibold text-purple-800 mb-1">考场技巧</p>
              <p className="text-xs text-purple-900 leading-relaxed">{example.tip}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSolution(false)}
            className="mt-4 text-xs text-neutral-400 hover:text-neutral-600"
          >
            收起解析 ↑
          </button>
        </div>
      )}
    </div>
  );
}
