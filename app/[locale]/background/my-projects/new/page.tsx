"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { PROJECT_FIELDS } from "@/lib/background/projects";
import { createStudentProject } from "@/lib/background/student-project-actions";
import { EMPTY_IDEA, type StudentIdeaInputs } from "@/lib/background/student-project-types";

export default function NewStudentProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [field, setField] = useState<string>(PROJECT_FIELDS[0]?.value ?? "OTHER");
  const [idea, setIdea] = useState<StudentIdeaInputs>(EMPTY_IDEA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof StudentIdeaInputs) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setIdea((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async () => {
    if (!title.trim()) {
      setError("请先填写课题标题");
      return;
    }
    if (!idea.question.trim()) {
      setError("请至少填写「你想研究什么问题」");
      return;
    }
    setError("");
    setSaving(true);
    const res = await createStudentProject({ title, field, idea });
    if (res.ok && res.id) {
      router.push(`/background/my-projects/${res.id}`);
    } else {
      setError(res.error || "创建失败，请重试");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/background/my-projects" className="text-sm text-[var(--indigo)] hover:underline">
        ← 返回我的课题
      </Link>

      <h1 className="text-2xl font-bold text-[var(--ink)] mt-3 mb-1">创建我的课题</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-6">
        先用几句话描述你的想法，下一步 AI 会帮你梳理成规范的课题结构（分阶段、量化指标、反思等），你可以再调整。
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">课题标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：新型尾翼铰链偏转对飞机操控性的影响（CFD 对比）"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">所属领域</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
          >
            {PROJECT_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.emoji} {f.label}
              </option>
            ))}
            <option value="OTHER">其它</option>
          </select>
        </div>

        <Field
          label="① 你想研究什么问题？"
          hint="一个具体、可探索的问题。"
          value={idea.question}
          onChange={set("question")}
          placeholder="例：把飞机尾翼升降舵的铰链沿垂直方向偏转一定角度，能否提升操控性？"
        />
        <Field
          label="② 是什么让你对它感兴趣？"
          hint="来源、动机——这也是个人陈述的好素材。"
          value={idea.motivation}
          onChange={set("motivation")}
          placeholder="例：我在玩沙盒游戏 Besiege 设计飞机时，发现这样偏转铰链后操控性变好了。"
        />
        <Field
          label="③ 你打算用什么方法 / 工具？"
          hint="软件、实验、数据分析等。"
          value={idea.method}
          onChange={set("method")}
          placeholder="例：用 CFD 软件 ANSYS Fluent 建模并仿真对比。"
        />
        <Field
          label="④ 你想比较 / 测量什么？"
          hint="变量与指标，越具体越好。"
          value={idea.variables}
          onChange={set("variables")}
          placeholder="例：不同偏转角与迎角下，新型尾翼 vs 传统尾翼的扭矩系数、阻力系数。"
        />

        {error && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={submit}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "创建中…" : "创建并继续"}
          </button>
          <Link href="/background/my-projects" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            取消
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ink)] mb-0.5">{label}</label>
      <p className="text-xs text-[var(--ink-soft)] mb-1.5">{hint}</p>
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
      />
    </div>
  );
}
