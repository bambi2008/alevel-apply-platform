import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { getPrograms, getUniversities } from "@/lib/data";
import type { Region } from "@/lib/data/types";
import { AddToApplication } from "@/components/add-to-application";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region: regionParam } = await searchParams;
  const region = regionParam === "UK" || regionParam === "HK" ? (regionParam as Region) : undefined;

  const t = await getTranslations("universities");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const isEn = locale === "en";

  const universities = await getUniversities(region);
  const programs = await getPrograms({ region });
  const programsByUni = new Map<string, typeof programs>();
  for (const p of programs) {
    const arr = programsByUni.get(p.universityId) ?? [];
    arr.push(p);
    programsByUni.set(p.universityId, arr);
  }

  const tabs: { key: Region | "ALL"; label: string }[] = [
    { key: "ALL", label: t("tabAll") },
    { key: "UK", label: tc("uk") },
    { key: "HK", label: tc("hk") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title={t("title")} subtitle={t("intro")} icon="🏛️" />

      {/* Region tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const active = (tab.key === "ALL" && !region) || tab.key === region;
          const href = tab.key === "ALL" ? "/universities" : `/universities?region=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                active ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <span className="ml-auto self-center text-sm text-neutral-400">
          {t("summary", { unis: universities.length, programs: programs.length })}
        </span>
      </div>

      {/* University list */}
      <div className="mt-6 space-y-4">
        {universities.map((u) => {
          const ps = programsByUni.get(u.id) ?? [];
          const primary = isEn ? u.name : u.nameZh;
          const secondary = isEn ? u.nameZh : u.name;
          return (
            <div key={u.id} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-semibold text-lg">
                    {primary}
                    <span className="ml-2 text-sm font-normal text-neutral-500">{secondary}</span>
                  </h2>
                  <div className="text-sm text-neutral-500 mt-0.5">
                    {u.region === "UK" ? tc("uk") : tc("hk")} · {u.city}
                    {u.league ? ` · ${u.league}` : ""}
                  </div>
                </div>
                {u.qsRankWorld && (
                  <span className="text-sm text-neutral-600 bg-neutral-100 rounded-md px-2 py-1">
                    QS #{u.qsRankWorld}
                  </span>
                )}
              </div>

              {ps.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {ps.map((p) => (
                    <div key={p.id} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                      <div className="font-medium">
                        {p.nameZh}
                        <span className="ml-1.5 text-xs font-normal text-neutral-400">{p.name}</span>
                      </div>
                      <div className="text-neutral-500 flex flex-wrap gap-x-3">
                        <span>{t("typical")} {p.alevelOfferTypical ?? "—"}</span>
                        <span>{t("ielts")} {p.ielts ?? "—"}</span>
                        {p.interviewRequired && <span className="text-amber-600">{t("interview")}</span>}
                        {p.admissionsTest && <span>{t("test")} {p.admissionsTest}</span>}
                      </div>
                      <div className="mt-1.5">
                        <AddToApplication programId={p.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link href="/match" className="text-blue-600 hover:underline">
          {t("toMatch")}
        </Link>
      </div>
    </div>
  );
}
