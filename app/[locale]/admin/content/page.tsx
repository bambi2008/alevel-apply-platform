import { listUniversitiesAdminAction } from "@/lib/admin/content-actions";
import { UniversityManager } from "@/components/admin/university-manager";

export default async function AdminContentPage() {
  const unis = await listUniversitiesAdminAction();
  return <UniversityManager initial={unis} />;
}
