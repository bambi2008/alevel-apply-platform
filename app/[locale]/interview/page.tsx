import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CoreList, CorePageHeader, CorePageShell, CoreSectionHeader } from "@/components/core-page-layout";
import {
  INTERVIEW_CATEGORIES,
  getQuestionsBySubject,
  getSubjectsByCategory,
  INTERVIEW_GUIDE,
} from "@/lib/interview";

export default function InterviewPage() {
  const totalQuestions = INTERVIEW_CATEGORIES.reduce(
    (sum, category) =>
      sum + getSubjectsByCategory(category.id).reduce((count, subject) => count + getQuestionsBySubject(subject.id).length, 0),
    0,
  );

  return (
    <CorePageShell>
      <CorePageHeader
        step="3 / 4"
        title="面试训练"
        description="选择训练方向后直接开始。每道题都要求说清变量与假设、解释方法、边算边讲、检查结果，并根据追问修正思路。"
        meta={`${totalQuestions} 道原创训练题`}
      />

      <div className="space-y-9 pt-7">
        {INTERVIEW_CATEGORIES.map((category) => {
          const subjects = getSubjectsByCategory(category.id);
          if (subjects.length === 0) return null;
          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <CoreSectionHeader
                title={<span id={`category-${category.id}`}>{category.label}</span>}
                meta={`${subjects.length} 个训练方向`}
              />
              <CoreList>
                {subjects.map((subject) => {
                  const count = getQuestionsBySubject(subject.id).length;
                  return (
                    <Link
                      key={subject.id}
                      href={`/interview/${subject.id}`}
                      className="group grid gap-2 py-4 sm:grid-cols-[minmax(170px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-5"
                    >
                      <div>
                        <h3 className="font-medium text-[var(--ink)] group-hover:text-[var(--indigo)]">{subject.name}</h3>
                        <p className="text-xs text-[var(--ink-faint)]">{subject.nameEn}</p>
                      </div>
                      <p className="text-sm leading-6 text-[var(--ink-soft)]">{subject.blurb}</p>
                      <span className="inline-flex items-center gap-2 text-sm text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">
                        {count} 题 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </CoreList>
            </section>
          );
        })}
      </div>

      <section className="mt-10 border-t border-[var(--border)] pt-7" aria-labelledby="interview-method">
        <h2 id="interview-method" className="text-lg font-semibold text-[var(--ink)]">训练方法</h2>
        <div className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {INTERVIEW_GUIDE.map((guide) => (
            <div key={guide.title}>
              <h3 className="font-medium text-[var(--ink)]">{guide.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{guide.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--ink-faint)]">
        本模块题目与讲解均为桥申原创。学院 assessment 与院校面试安排会随课程、学院和年份变化，请以收到的院校邮件为准。
      </p>
    </CorePageShell>
  );
}
