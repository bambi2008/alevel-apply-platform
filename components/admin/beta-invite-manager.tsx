"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBetaInvitesAction,
  revokeBetaInviteAction,
  type BetaInviteRow,
} from "@/lib/admin/beta-invite-actions";

type Props = {
  rows: BetaInviteRow[];
  limit: number;
  used: number;
  reserved: number;
};

const reasonLabel = {
  INVALID_EMAIL: "邮箱格式错误",
  ALREADY_INVITED: "已有未使用邀请码",
  ALREADY_USED: "该邮箱已完成注册",
  LIMIT_REACHED: "20 人名额已分配完",
};

export function BetaInviteManager({ rows, limit, used, reserved }: Props) {
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<Array<{ email: string; code: string }>>([]);
  const [skipped, setSkipped] = useState<Array<{ email: string; reason: keyof typeof reasonLabel }>>([]);

  const create = async () => {
    setBusy(true);
    const result = await createBetaInvitesAction(emails);
    setBusy(false);
    setCreated(result.created);
    setSkipped(result.skipped);
    if (result.created.length) setEmails("");
    router.refresh();
  };

  const copyCreated = async () => {
    await navigator.clipboard.writeText(created.map((item) => `${item.email}\t${item.code}`).join("\n"));
  };

  const revoke = async (id: string) => {
    if (!confirm("撤销后该邀请码将立即失效，确定继续？")) return;
    await revokeBetaInviteAction(id);
    router.refresh();
  };

  return (
    <section className="border-y border-neutral-200 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold text-neutral-950">首批 Beta 邀请码</h2>
          <p className="mt-1 text-xs text-neutral-500">邮箱绑定、一次性使用；总量硬限制 {limit} 人。</p>
        </div>
        <div className="flex gap-4 text-sm tabular-nums">
          <span>已注册 <strong>{used}</strong></span>
          <span>待使用 <strong>{reserved}</strong></span>
          <span>可分配 <strong>{Math.max(0, limit - used - reserved)}</strong></span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <textarea
          value={emails}
          onChange={(event) => setEmails(event.target.value)}
          rows={3}
          placeholder="粘贴学生邮箱，每行一个；也支持逗号或分号分隔"
          className="w-full resize-y border border-neutral-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={create}
          disabled={busy || !emails.trim() || used + reserved >= limit}
          className="h-10 bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "生成中..." : "生成邀请码"}
        </button>
      </div>

      {created.length > 0 && (
        <div className="mt-4 border border-emerald-300 bg-emerald-50 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <strong>邀请码已生成，请现在保存。页面刷新后无法再次查看明文。</strong>
            <button type="button" onClick={copyCreated} className="text-blue-700 hover:underline">复制全部</button>
          </div>
          <div className="mt-2 space-y-1 font-mono">
            {created.map((item) => <p key={item.email}>{item.email}　{item.code}</p>)}
          </div>
        </div>
      )}
      {skipped.length > 0 && (
        <div className="mt-3 text-xs text-amber-800">
          {skipped.map((item) => <p key={`${item.email}:${item.reason}`}>{item.email}：{reasonLabel[item.reason]}</p>)}
        </div>
      )}

      <div className="mt-4 overflow-x-auto border border-neutral-200">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-3 py-2">绑定邮箱</th><th className="px-3 py-2">状态</th><th className="px-3 py-2">生成时间</th><th className="px-3 py-2">使用时间</th><th className="px-3 py-2">操作</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 text-neutral-900">{row.email}</td>
                <td className="px-3 py-2">{row.status === "AVAILABLE" ? "待使用" : row.status === "USED" ? "已注册" : "已撤销"}</td>
                <td className="px-3 py-2">{new Date(row.createdAt).toLocaleString("zh-CN")}</td>
                <td className="px-3 py-2">{row.usedAt ? new Date(row.usedAt).toLocaleString("zh-CN") : "-"}</td>
                <td className="px-3 py-2">{row.status === "AVAILABLE" ? <button type="button" onClick={() => revoke(row.id)} className="text-red-600 hover:underline">撤销</button> : "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-neutral-400">尚未生成邀请码</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
