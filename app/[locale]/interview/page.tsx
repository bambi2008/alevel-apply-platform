import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import {
  INTERVIEW_CATEGORIES,
  getSubjectsByCategory,
  getQuestionsBySubject,
  INTERVIEW_GUIDE,
} from "@/lib/interview";

export default function InterviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        title="面试准备"
        subtitle="牛剑及顶尖英国大学的学科面试，考的是你面对陌生问题如何思考。这里有分学科的原创练习题、思路提示，以及 AI 模拟面试——重在训练现场推理，而不是背答案。"
        icon="🎙️"
      />

      {/* 学科分类 */}
      {INTERVIEW_CATEGORIES.map((cat) => {
        const subjects = getSubjectsByCategory(cat.id);
        return (
          <section key={cat.id} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--indigo)] mb-4">
              {cat.label}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((s) => {
                const count = getQuestionsBySubject(s.id).length;
                return (
                  <Link
                    key={s.id}
                    href={`/interview/${s.id}`}
                    className="card card-interactive p-5 block"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--ink)]">{s.name}</h3>
                      <span className="badge badge-neutral">{count} 题</span>
                    </div>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">{s.nameEn}</p>
                    <p className="text-sm text-[var(--ink-soft)] mt-2 leading-relaxed">{s.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* 通用面试指导 */}
      <section className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--indigo)] mb-4">
          面试通用指导
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {INTERVIEW_GUIDE.map((g) => (
            <div key={g.title} className="card p-5">
              <h3 className="font-semibold text-[var(--ink)] mb-1.5">{g.title}</h3>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-[var(--ink-faint)] leading-relaxed">
        说明：牛津、剑桥不公开面试真题（真题会跨年重复使用，考的是现场思维）。本模块所有题目与讲解均为
        桥申原创，仅参照公开的学科分类与面试风格，不复制任何机构的题库内容。题库持续增补。
      </p>
    </div>
  );
}
