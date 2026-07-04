import { notFound } from "next/navigation";
import { getStudentProjectById } from "@/lib/background/student-project-actions";
import { StudentProjectDetail } from "@/components/background/student-project-detail";

export default async function StudentProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getStudentProjectById(id);
  if (!project) notFound();
  return <StudentProjectDetail project={project} />;
}
