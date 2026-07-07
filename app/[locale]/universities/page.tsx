import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Link } from "@/i18n/navigation";
import { SceneCompass } from "@/components/illustrations";

// 「择校信息源」——不再自建院校库/假数据，诚实地把院校与专业信息导流到官方与权威平台。
// 具体学校信息交给做得最好的平台（Cialfo / explore.study / UCAS / 官方榜单 / 港校官网）。

interface Source {
  name: string;
  url: string;
  descZh: string;
  descEn: string;
  tag?: string;
}

const GROUPS: { titleZh: string; titleEn: string; note?: string; sources: Source[] }[] = [
  {
    titleZh: "综合升学平台（推荐先看）",
    titleEn: "All-in-one platforms (start here)",
    sources: [
      { name: "Cialfo", url: "https://www.cialfo.co", tag: "学校账号",
        descZh: "国际学校广泛采用的升学平台，覆盖 15,000+ 所大学、可一站直申。若你所在学校（如深国交等）已接入，用学校发的账号登录 app.cialfo.co 查院校与专业最全。",
        descEn: "Widely used by international schools; 15,000+ universities and direct apply. If your school (e.g. SCIE) uses it, log in with your school account for the fullest data." },
      { name: "Explore by Cialfo", url: "https://www.explore.study", tag: "面向学生",
        descZh: "Cialfo 面向学生/家庭开放的院校探索产品，没有学校账号也能浏览专业与院校信息。",
        descEn: "Cialfo's student-facing discovery product — browse universities and programmes without a school account." },
    ],
  },
  {
    titleZh: "英国官方申请与要求",
    titleEn: "UK official applications & requirements",
    sources: [
      { name: "UCAS", url: "https://www.ucas.com", tag: "官方",
        descZh: "英国本科统一申请官方网站，专业搜索、入学要求、截止日期以此为准。",
        descEn: "The official UK undergraduate application service — course search, entry requirements, deadlines." },
      { name: "各大学官网 Course pages", url: "https://www.ucas.com/explore/search/providers",
        descZh: "任何专业的最终入学要求（选科、成绩、笔试、面试）一律以目标院校官网课程页为准。",
        descEn: "Final entry requirements (subjects, grades, tests, interviews) must always be checked on each university's own course page." },
    ],
  },
  {
    titleZh: "权威排名与榜单（多个对照看）",
    titleEn: "Rankings (cross-check several)",
    note: "排名只是参考维度之一，建议结合专业实力、地理位置、费用综合判断。",
    sources: [
      { name: "QS World University Rankings", url: "https://www.topuniversities.com",
        descZh: "全球综合与学科排名，国际认可度高。", descEn: "Global and subject rankings." },
      { name: "Times Higher Education", url: "https://www.timeshighereducation.com",
        descZh: "THE 世界大学排名，偏重研究与教学声誉。", descEn: "THE world rankings; research/teaching focus." },
      { name: "Complete University Guide", url: "https://www.thecompleteuniversityguide.co.uk",
        descZh: "英国本土视角的大学与专业排名，含就业与学生满意度。", descEn: "UK-focused league tables with employability & satisfaction." },
      { name: "The Guardian University Guide", url: "https://www.theguardian.com/education/universityguide",
        descZh: "卫报英国大学指南，侧重本科教学体验。", descEn: "The Guardian's UK undergraduate teaching-focused guide." },
    ],
  },
  {
    titleZh: "香港本科",
    titleEn: "Hong Kong undergraduate",
    note: "非本地生（含内地）多走各校国际生／非 JUPAS 通道，直接在目标院校官网申请；JUPAS 主要面向香港本地文凭考生。",
    sources: [
      { name: "香港大学 HKU", url: "https://www.hku.hk", descZh: "港大官网及本科招生页。", descEn: "HKU official & admissions." },
      { name: "香港中文大学 CUHK", url: "https://www.cuhk.edu.hk", descZh: "中大官网及本科招生页。", descEn: "CUHK official & admissions." },
      { name: "香港科技大学 HKUST", url: "https://www.hkust.edu.hk", descZh: "科大官网及本科招生页。", descEn: "HKUST official & admissions." },
      { name: "香港城市大学 CityU", url: "https://www.cityu.edu.hk", descZh: "城大官网及本科招生页。", descEn: "CityU official & admissions." },
      { name: "香港理工大学 PolyU", url: "https://www.polyu.edu.hk", descZh: "理大官网及本科招生页。", descEn: "PolyU official & admissions." },
      { name: "JUPAS", url: "https://www.jupas.edu.hk", tag: "本地生", descZh: "香港本地大学联合招生，供 HKDSE 本地考生。", descEn: "Joint admissions for local HKDSE students." },
    ],
  },
];

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: qParam } = await searchParams;
  const q = (qParam ?? "").trim();
  const locale = await getLocale();
  const isEn = locale === "en";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center [&>div]:mb-0">
        <PageHeader
          title={isEn ? "Where to research universities" : "择校信息源"}
          subtitle={
            isEn
              ? "We don't maintain our own university list — instead we point you to the platforms that do it best, with official sources for final requirements."
              : "我们不再自建院校库，而是把院校与专业信息，指向做得最专业的平台与官方来源。看具体学校，用下面这些最靠谱。"
          }
          icon="🧭"
        />
        <SceneCompass className="hidden lg:block w-[260px] h-auto rounded-2xl" />
      </div>

      {q && (
        <div className="mb-6 rounded-xl border border-[color:var(--indigo)]/15 bg-[var(--info-bg)] px-4 py-3 text-sm text-[var(--ink-soft)]">
          {isEn ? (
            <>Looking for <b>“{q}”</b>? Search it directly in the official sources below for the most accurate info.</>
          ) : (
            <>想查 <b>「{q}」</b>？直接在下面这些官方来源里搜索最准确。</>
          )}
        </div>
      )}

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.titleZh}>
            <h2 className="text-lg font-semibold text-[var(--ink)] mb-1">
              {isEn ? group.titleEn : group.titleZh}
            </h2>
            {group.note && (
              <p className="text-sm text-[var(--ink-soft)] mb-4 leading-relaxed">{group.note}</p>
            )}
            <div className={group.note ? "" : "mt-4"}>
              <div className="grid sm:grid-cols-2 gap-3">
                {group.sources.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block notion-lift rounded-2xl border border-[var(--border)] p-5 bg-white group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-[var(--ink)] group-hover:text-[var(--indigo)]">{s.name}</span>
                      {s.tag && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)]">
                          {s.tag}
                        </span>
                      )}
                      <span className="ml-auto text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">↗</span>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      {isEn ? s.descEn : s.descZh}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 引导到差异化工具 */}
      <div className="mt-12 rounded-2xl border border-[color:var(--indigo)]/20 bg-[var(--info-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-1.5">
          {isEn ? "Not sure what to apply for?" : "还没想好申什么方向？"}
        </h2>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">
          {isEn
            ? "These sources show you the schools. Our Decision Assistant helps you decide: what your A-Level choices qualify for, and which admission tests to prepare."
            : "这些来源帮你看学校；我们的「选校决策助手」帮你做决定——你的选科能申什么、该准备哪些笔试，一步连到题库。"}
        </p>
        <Link href="/match" className="btn btn-primary text-sm">
          {isEn ? "Open Decision Assistant →" : "打开选校决策助手 →"}
        </Link>
      </div>

      <p className="mt-8 text-xs text-[var(--ink-faint)] leading-relaxed">
        {isEn
          ? "External links are provided for convenience; we are not affiliated with these platforms. Always verify entry requirements on each university's official website."
          : "以上为外部链接，仅供参考，我们与这些平台无隶属关系。入学要求请以各院校官网为准。"}
      </p>
    </div>
  );
}
