"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge, appStatusMeta } from "@/components/status-badge";
import { SceneCompass } from "@/components/illustrations";
import { Photo } from "@/components/photo";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProgramWithUniversity } from "@/lib/data/types";
import {
  APP_STATUSES,
  OFFER_TYPES,
  OFFER_DECISIONS,
  listApplications,
  removeApplication,
  updateApplication,
  subscribeApps,
  type ApplicationItem,
  type AppStatus,
} from "@/lib/applications/store";

type OfferTypeVal = "CONDITIONAL" | "UNCONDITIONAL" | undefined;
type OfferDecisionVal = "FIRM" | "INSURANCE" | "DECLINE" | "ACCEPTED" | undefined;

export default function ApplicationsPage() {
  const t = useTranslations("applications");
  const tc = useTranslations("common");
  const tnav = useTranslations("nav");
  const locale = useLocale();
  const isEn = locale === "en";

  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  const programOf = (id: string) => programs.find((p) => p.id === id);

  useEffect(() => {
    const sync = () => {
      listApplications().then(setItems);
    };
    sync();
    setLoaded(true);
    fetch("/api/programs")
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => {});
    return subscribeApps(sync);
  }, []);

  const offerCount = items.filter((i) => i.status === "OFFER" || i.status === "ACCEPTED").length;

  if (!loaded) return <div className="mx-auto max-w-5xl px-4 py-10 text-neutral-400">{tc("loading")}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader title={t("title")} subtitle={t("intro")} icon="📮" />

      {/* Overview */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label={t("statTotal")} value={items.length} />
        <Stat label={t("statOffers")} value={offerCount} />
        <Stat
          label={t("statSubmitted")}
          value={items.filter((i) => ["SUBMITTED", "INTERVIEW", "OFFER", "ACCEPTED"].includes(i.status)).length}
        />
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center flex flex-col items-center">
          <Photo
          src="/images/apply-track.jpg"
          alt="申请追踪"
          className="w-48 mb-5"
          imgClassName="h-auto w-full rounded-xl object-cover aspect-square"
          fallback={<SceneCompass className="w-full h-auto rounded-xl opacity-90 doodle-idle" />}
        />
          <p className="text-[var(--ink-soft)]">{t("empty")}</p>
          <p className="mt-3 flex items-center justify-center gap-3">
            <Link href="/match" className="btn btn-primary text-sm">{tnav("match")}</Link>
            <Link href="/universities" className="btn btn-secondary text-sm">{tnav("universities")}</Link>
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const p = programOf(item.programId);
            const showOffer = item.status === "OFFER" || item.status === "ACCEPTED";
            return (
              <div key={item.programId} className="card p-5">
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-semibold text-[var(--ink)]">
                      {p ? `${p.university.nameZh} · ${p.nameZh}` : item.programId}
                    </div>
                    {p && (
                      <div className="text-xs text-[var(--ink-faint)] mt-0.5">
                        {p.university.name} — {p.name}
                        {p.alevelOfferTypical ? ` · ${p.alevelOfferTypical}` : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge {...appStatusMeta(item.status)} />
                    <button
                      type="button"
                      onClick={() => removeApplication(item.programId)}
                      className="text-[var(--ink-faint)] hover:text-[var(--danger)] text-sm"
                      aria-label="remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-neutral-600 flex items-center gap-2">
                    {t("status")}
                    <select
                      className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                      value={item.status}
                      onChange={(e) =>
                        updateApplication(item.programId, { status: e.target.value as AppStatus })
                      }
                    >
                      {APP_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label} {s.en}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {showOffer && (
                  <div className="mt-3 rounded-lg bg-neutral-50 p-3 grid sm:grid-cols-3 gap-2">
                    <label className="text-sm text-neutral-600">
                      {t("offerType")}
                      <select
                        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                        value={item.offer?.type ?? ""}
                        onChange={(e) =>
                          updateApplication(item.programId, {
                            offer: { ...item.offer, type: (e.target.value || undefined) as OfferTypeVal },
                          })
                        }
                      >
                        <option value="">—</option>
                        {OFFER_TYPES.map((o) => (
                          <option key={o.value} value={o.value}>{t(`offerTypes.${o.value}`)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-neutral-600">
                      {t("decision")}
                      <select
                        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                        value={item.offer?.decision ?? ""}
                        onChange={(e) =>
                          updateApplication(item.programId, {
                            offer: { ...item.offer, decision: (e.target.value || undefined) as OfferDecisionVal },
                          })
                        }
                      >
                        <option value="">—</option>
                        {OFFER_DECISIONS.map((d) => (
                          <option key={d.value} value={d.value}>{t(`decisions.${d.value}`)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-neutral-600">
                      {t("conditions")}
                      <input
                        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                        value={item.offer?.conditions ?? ""}
                        onChange={(e) =>
                          updateApplication(item.programId, {
                            offer: { ...item.offer, conditions: e.target.value },
                          })
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-neutral-500 mt-0.5">{label}</div>
    </div>
  );
}
