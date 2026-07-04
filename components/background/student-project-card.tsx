"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { deleteStudentProject } from "@/lib/background/student-project-actions";
import type { StudentProjectDTO } from "@/lib/background/student-project-types";
import { PROJECT_FIELDS } from "@/lib/background/projects";

const STATUS_LABEL: Record<string, string> = { DRAFT: "草稿", ACTIVE: "进行中", COMPLETE: "已完成" };
const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  ACTIVE: "bg-indigo-50 text-[var(--indigo)]",
  COMPLETE: "bg-green-50 text-green-700",
};
function fieldLabel(v: string): string {
  return PROJECT_FIELDS.find((f) => f.value === v)?.label ?? "其它";
}

export function StudentProjectCard({ project }: { project: StudentProjectDTO }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    const res = await deleteStudentProject(project.id);
    if (res.ok) {
      router.refresh();
    } else {
      setDeleting(false);
      alert(res.error || "删除失败");
    }
  };

  return (
    <div className="relative rounded-2xl border border-[var(--border)] p-5 card-hover">
      <Link href={`/background/my-projects/${project.id}`} className="block">
        <div className="flex items-center gap-2 mb-1 pr-16">
          <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--surface)] text-[var(--ink-soft)]">
            {fieldLabel(project.field)}
          </span>
          <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS_STYLE[project.status]}`}>
            {STATUS_LABEL[project.status]}
          </span>
        </div>
        <h3 className="font-semibold text-[var(--ink)] leading-snug pr-16">{project.title}</h3>
        {project.summary && (
          <p className="text-sm text-[var(--ink-soft)] mt-1 line-clamp-2">{project.summary}</p>
        )}
        {!project.structure && (
          <p className="text-xs text-amber-700 mt-2">尚未生成结构 —— 点进去让 AI 帮你梳理</p>
        )}
      </Link>

      {/* 删除 */}
      <div className="absolute top-4 right-4">
        {confirming ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={remove}
              disabled={deleting}
              className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            >
              {deleting ? "删除中" : "确认删除"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--ink-soft)]"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-neutral-400 hover:text-red-500"
          >
            删除
          </button>
        )}
      </div>
    </div>
  );
}
