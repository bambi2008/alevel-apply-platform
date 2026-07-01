"use client";

import { useState, useTransition } from "react";
import { setUserRoleAction } from "@/lib/admin/actions";

const ROLES = [
  { value: "STUDENT", label: "学生" },
  { value: "MENTOR", label: "导师" },
  { value: "ADMIN", label: "管理员" },
];

export function RoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const [current, setCurrent] = useState(role);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onChange = (next: string) => {
    const prev = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      const res = await setUserRoleAction(userId, next);
      if (!res.ok) {
        setCurrent(prev); // 回滚
        setError(
          res.error === "cannot_demote_self"
            ? "不能降级自己"
            : "修改失败"
        );
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
