"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

/** Closing the dialog never mounts a protected runner or enables its actions. */
export function MembershipRequired({ expiredTrial = false, offer, overlayKey }: {
  expiredTrial?: boolean; offer: { priceFen: number; months: number }; overlayKey?: string;
}) {
  const en = useLocale() === "en";
  const dialog = useRef<HTMLDialogElement>(null);
  const message = expiredTrial
    ? (en ? `Your 7-day trial has ended. Purchase an Exam Season Pass (${offer.months} months, ¥${offer.priceFen / 100}) to continue practising.` : `7 天体验已结束。购买考季卡（${offer.months} 个月 ¥${offer.priceFen / 100}）后可继续练习。`)
    : (en ? "An active trial or Exam Season Pass is required to start new practice." : "开始新练习需要有效体验或考季卡。");
  useEffect(() => {
    if (dialog.current?.open) return;
    if (overlayKey) {
      try {
        if (window.sessionStorage.getItem(overlayKey)) return;
        window.sessionStorage.setItem(overlayKey, "shown");
      } catch { /* The dialog still works when session storage is unavailable. */ }
    }
    dialog.current?.showModal();
  }, [overlayKey]);
  return <section className={overlayKey ? undefined : "mx-auto max-w-3xl px-5 py-16"}>
    {!overlayKey && <>
      <h1 className="text-2xl font-semibold">{en ? "Practice access" : "练习权限"}</h1>
      <p className="mt-4 leading-relaxed">{message}</p>
      <div className="mt-6 flex flex-wrap gap-5"><Link href="/pricing" className="underline">{en ? "View Exam Season Pass" : "查看考季卡"}</Link><Link href="/account" className="underline">{en ? "Account and records" : "账号与历史记录"}</Link></div>
    </>}
    <dialog ref={dialog} aria-labelledby="membership-required-title" className="m-auto max-w-lg border border-black/20 bg-[#f7f6f2] p-7 text-[#101817] backdrop:bg-black/40">
      <h2 id="membership-required-title" className="text-xl font-semibold">{en ? "Continue practising" : "继续练习"}</h2>
      <p className="mt-4 leading-relaxed">{message}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/purchase" className="inline-flex min-h-11 items-center bg-[#101817] px-5 text-white">{en ? "Buy Exam Season Pass" : "购买考季卡"}</Link><button type="button" className="min-h-11 border border-black/20 px-5" onClick={() => dialog.current?.close()}>{en ? "Not now" : "暂不购买"}</button></div>
    </dialog>
  </section>;
}
