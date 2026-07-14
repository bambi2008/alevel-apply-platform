"use client";
import Link from "next/link";
import { FREE_LIMITS } from "@/lib/entitlements";

/** 软付费墙卡片：免费额度用满时展示，引导升级；不阻断已看内容。
 *  付费墙上线后，在练习完成页 / 撞上限处渲染它即可。 */
export function UpgradeGate({ locale = "zh-CN" }: { locale?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--indigo)]/30 bg-[var(--indigo)]/5 p-6 text-center">
      <div className="text-2xl mb-2">🔓</div>
      <h3 className="text-lg font-bold text-[var(--ink)]">
        免费额度已用完（每科 {FREE_LIMITS.questionsPerTest} 题）
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        升级会员，解锁该科<strong>全部题库</strong>、<strong>全真模考</strong>与<strong>智能错题本</strong>。
        年付低至约 ¥33/月，随时可取消。
      </p>
      <Link href={`/${locale}#pricing`} className="btn btn-primary mt-4 inline-flex items-center">
        升级解锁全部 <span className="notion-arrow">→</span>
      </Link>
    </div>
  );
}
