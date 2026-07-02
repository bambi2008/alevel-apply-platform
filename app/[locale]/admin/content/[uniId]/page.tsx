import { notFound } from "next/navigation";
import {
  listProgramsAdminAction,
  listUniversitiesAdminAction,
} from "@/lib/admin/content-actions";
import { ProgramManager } from "@/components/admin/program-manager";

export default async function AdminProgramsPage({
  params,
}: {
  params: Promise<{ uniId: string }>;
}) {
  const { uniId } = await params;
  const unis = await listUniversitiesAdminAction();
  const uni = unis.find((u) => u.id === uniId);
  if (!uni) notFound();

  const programs = await listProgramsAdminAction(uniId);
  return (
    <ProgramManager
      universityId={uniId}
      uniName={uni.nameZh || uni.name}
      region={uni.region}
      initial={programs}
    />
  );
}
