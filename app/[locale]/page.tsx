import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { CoreDashboard } from "@/components/core-dashboard";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  return <CoreDashboard email={session?.user?.email} />;
}
