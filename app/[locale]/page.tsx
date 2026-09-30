import { setRequestLocale } from "next-intl/server";
import { CoreDashboard } from "@/components/core-dashboard";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CoreDashboard locale={locale} />;
}
