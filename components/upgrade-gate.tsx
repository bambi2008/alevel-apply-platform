"use client";
import Link from "next/link";

/** 软付费墙卡片：免费额度用满时展示，引导升级；不阻断已看内容。
 *  付费墙上线后，在练习完成页 / 撞上限处渲染它即可。 */
export function UpgradeGate({ locale = "zh-CN" }: { locale?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--indigo)]/30 bg-[var(--indigo)]/5 p-6 text-center">
      <div className="text-2xl mb-2">🔓</div>
      <h3 className="text-lg font-bold text-[var(--ink)]">
        {locale === "en" ? "Plan information" : "套餐说明"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        {locale === "en" ? "Purchases are not yet available. See the approved plans and service limitations." : "支付尚未开通，暂不可购买。请查看已公布的套餐与服务边界。"}
      </p>
      <Link href={`/${locale}/pricing`} className="mt-4 inline-flex min-h-11 items-center border border-black/20 px-4 py-2">
        {locale === "en" ? "View plans" : "查看套餐"} <span className="notion-arrow">→</span>
      </Link>
    </div>
  );
}
