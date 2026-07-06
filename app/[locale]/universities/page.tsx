import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { getPrograms } from "@/lib/data";
import { UniversityExplorer } from "@/components/university-explorer";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; q?: string }>;
}) {
  const { q: qParam } = await searchParams;
  const initialQ = (qParam ?? "").trim();

  const t = await getTranslations("universities");
  const locale = await getLocale();
  const isEn = locale === "en";

  // 拉取全部专业（含院校），筛选/搜索/对比全部交给客户端探索器
  const programs = await getPrograms();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title={t("title")} subtitle={t("intro")} icon="🏛️" />
      <UniversityExplorer programs={programs} isEn={isEn} initialQ={initialQ} />
    </div>
  );
}
