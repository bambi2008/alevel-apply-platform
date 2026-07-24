"use client";

import { CloudOff } from "lucide-react";

export function ExamReliabilityStatus({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-[80] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-xs font-semibold text-amber-950">
      <CloudOff className="size-4" />
      当前离线，作答仍会保存在本机；恢复网络后再交卷。
    </div>
  );
}
