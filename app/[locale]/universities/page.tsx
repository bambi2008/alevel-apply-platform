import { Link } from "@/i18n/navigation";
import { getPrograms, getUniversities } from "@/lib/data";
import type { Region } from "@/lib/data/types";
import { AddToApplication } from "@/components/add-to-application";

export const metadata = { title: "院校库 · 桥申" };

const REGION_TABS: { key: Region | "ALL"; label: string }[] = [
  { key: "ALL", label: "全部" },
  { key: "UK", label: "英国" },
  { key: "HK", label: "香港" },
];

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region: regionParam } = await searchParams;
  const region = regionParam === "UK" || regionParam === "HK" ? (regionParam as Region) : undefined;

  const universities = await getUniversities(region);
  const programs = await getPrograms({ region });
  const programsByUni = new Map<string, typeof programs>();
  for (const p of programs) {
    const arr = programsByUni.get(p.universityId) ?? [];
    arr.push(p);
    programsByUni.set(p.universityId, arr);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">院校库</h1>
      <p className="mt-2 text-neutral-600">
        英国（UCAS）与香港本科院校及专业的入学要求、学费、排名（当前为样例数据，需人工核验官方来源）。
      </p>

      {/* Region tabs */}
      <div className="mt-6 flex gap-2">
        {REGION_TABS.map((t) => {
          const active = (t.key === "ALL" && !region) || t.key === region;
          const href = t.key === "ALL" ? "/universities" : `/universities?region=${t.key}`;
          return (
            <Link
              key={t.key}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                active ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
        <span className="ml-auto self-center text-sm text-neutral-400">
          {universities.length} 所院校 · {programs.length} 个专业
        </span>
      </div>

      {/* University list */}
      <div className="mt-6 space-y-4">
        {universities.map((u) => {
          const ps = programsByUni.get(u.id) ?? [];
          return (
            <div key={u.id} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-semibold text-lg">
                    {u.nameZh}
                    <span className="ml-2 text-sm font-normal text-neutral-500">{u.name}</span>
                  </h2>
                  <div className="text-sm text-neutral-500 mt-0.5">
                    {u.region === "UK" ? "英国" : "香港"} · {u.city}
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
                      <div className="font-medium">{p.nameZh}</div>
                      <div className="text-neutral-500 flex flex-wrap gap-x-3">
                        <span>典型 {p.alevelOfferTypical ?? "—"}</span>
                        <span>雅思 {p.ielts ?? "—"}</span>
                        {p.interviewRequired && <span className="text-amber-600">需面试</span>}
                        {p.admissionsTest && <span>笔试 {p.admissionsTest}</span>}
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
          → 用我的成绩做选校匹配
        </Link>
      </div>
    </div>
  );
}
