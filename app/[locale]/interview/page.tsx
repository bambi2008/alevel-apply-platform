import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { SceneChat } from "@/components/illustrations";
import { Photo } from "@/components/photo";
import {
  INTERVIEW_CATEGORIES,
  getSubjectsByCategory,
  getQuestionsBySubject,
  INTERVIEW_GUIDE,
} from "@/lib/interview";

export default function InterviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center mb-8">
        <div className="[&>div]:mb-0">
          <PageHeader
            title="学院评估与英港面试"
            subtitle="覆盖牛剑学科面试、剑桥学院附加 assessment、香港院校综合/医学/商科/理工面试，以及 IELTS Speaking。训练现场推理、证据回应和追问适应，不背模板答案。"
            icon="🎙️"
          />
        </div>
        <Photo
          src="/images/interview.jpg"
          alt="面试准备"
          className="hidden lg:block w-[300px]"
          imgClassName="h-auto w-full rounded-2xl object-cover aspect-[4/3]"
          fallback={<SceneChat className="w-full h-auto rounded-2xl doodle-idle" />}
        />
      </div>

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
          学术与面试通用指导
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
        说明：本模块题目与讲解均为桥申原创，不复制学院或培训机构题库。剑桥学院 assessment 与香港院校面试会因
        课程、学院和年份变化；收到邀请后应以院校邮件为准。
      </p>
    </div>
  );
}
