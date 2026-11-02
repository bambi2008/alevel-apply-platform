import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CoreList, CorePageHeader, CorePageShell, CoreSectionHeader } from "@/components/core-page-layout";
import { INTERVIEW_BLURBS_EN, INTERVIEW_GUIDE_EN } from "@/lib/interview/presentation";
import {
  INTERVIEW_CATEGORIES,
  getQuestionsBySubject,
  getSubjectsByCategory,
  INTERVIEW_GUIDE,
} from "@/lib/interview";

export default async function InterviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";
  const totalQuestions = INTERVIEW_CATEGORIES.reduce(
    (sum, category) =>
      sum + getSubjectsByCategory(category.id).reduce((count, subject) => count + getQuestionsBySubject(subject.id).length, 0),
    0,
  );

  return (
    <CorePageShell>
      <CorePageHeader
        step="4 / 5"
        title={en ? "Interviews" : "面试训练"}
        description={en ? "Choose a subject. Explain assumptions and methods, think aloud, check results and adapt to follow-up questions." : "选择训练方向后直接开始。说清假设与方法，边算边讲、检查结果，并根据追问修正思路。"}
        meta={en ? `${totalQuestions} original practice questions` : `${totalQuestions} 道原创训练题`}
      />

      <div className="space-y-9 pt-7">
        {INTERVIEW_CATEGORIES.map((category) => {
          const subjects = getSubjectsByCategory(category.id);
          if (subjects.length === 0) return null;
          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <CoreSectionHeader
                title={<span id={`category-${category.id}`}>{en ? category.labelEn : category.label}</span>}
                meta={en ? `${subjects.length} subjects` : `${subjects.length} 个训练方向`}
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
                        <h3 className="font-medium text-[var(--ink)] group-hover:text-[var(--indigo)]">{en ? subject.nameEn : subject.name}</h3>
                        {!en && <p className="text-xs text-[var(--ink-faint)]">{subject.nameEn}</p>}
                      </div>
                      <p className="text-sm leading-6 text-[var(--ink-soft)]">{en ? INTERVIEW_BLURBS_EN[subject.id] : subject.blurb}</p>
                      <span className="inline-flex items-center gap-2 text-sm text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">
                        {count} {en ? "questions" : "题"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
        <h2 id="interview-method" className="text-lg font-semibold text-[var(--ink)]">{en ? "How to practise" : "训练方法"}</h2>
        <div className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {(en ? INTERVIEW_GUIDE_EN : INTERVIEW_GUIDE).map((guide) => (
            <div key={guide.title}>
              <h3 className="font-medium text-[var(--ink)]">{guide.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{guide.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--ink-faint)]">
        {en ? "Original QiaoShen practice, not official interview questions. College assessments and interview arrangements vary by course, college and year; follow the institution's email." : "本模块为桥申原创训练，非官方面试题。学院 assessment 与院校面试安排会随课程、学院和年份变化，请以收到的院校邮件为准。"}
      </p>
    </CorePageShell>
  );
}
