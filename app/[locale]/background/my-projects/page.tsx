import { Link } from "@/i18n/navigation";
import { listMyStudentProjects } from "@/lib/background/student-project-actions";
import { PROJECT_FIELDS } from "@/lib/background/projects";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "草稿",
  ACTIVE: "进行中",
  COMPLETE: "已完成",
};
const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  ACTIVE: "bg-indigo-50 text-[var(--indigo)]",
  COMPLETE: "bg-green-50 text-green-700",
};

function fieldLabel(v: string): string {
  return PROJECT_FIELDS.find((f) => f.value === v)?.label ?? "其它";
}

export default async function MyProjectsPage() {
  const projects = await listMyStudentProjects();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">我的自提课题</h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            有自己的研究想法？把它交给平台——AI 帮你梳理成规范课题，记录过程、产出个人陈述素材。
          </p>
        </div>
        <Link
          href="/background/my-projects/new"
          className="shrink-0 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          ＋ 创建我的课题
        </Link>
      </div>

      <div className="mb-6">
        <Link href="/background/projects" className="text-sm text-[var(--indigo)] hover:underline">
          ← 也看看平台预设的课题库
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
          <p className="text-4xl mb-3">💡</p>
          <p className="text-[var(--ink)] font-medium mb-1">还没有自提课题</p>
          <p className="text-sm text-[var(--ink-soft)] mb-4">
            比如：你在游戏里发现了一个有趣的现象，想用专业工具验证它——那就是一个好课题。
          </p>
          <Link
            href="/background/my-projects/new"
            className="inline-block px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            创建我的第一个课题
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/background/my-projects/${p.id}`}
              className="block rounded-2xl border border-[var(--border)] p-5 card-hover"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--surface)] text-[var(--ink-soft)]">
                  {fieldLabel(p.field)}
                </span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS_STYLE[p.status]}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--ink)] leading-snug">{p.title}</h3>
              {p.summary && (
                <p className="text-sm text-[var(--ink-soft)] mt-1 line-clamp-2">{p.summary}</p>
              )}
              {!p.structure && (
                <p className="text-xs text-amber-700 mt-2">尚未生成结构 —— 点进去让 AI 帮你梳理</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
