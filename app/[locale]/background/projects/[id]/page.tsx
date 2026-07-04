import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/background/projects";
import { ProjectDetail } from "@/components/background/project-detail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
