import { OperationsDashboard } from "@/components/admin/operations-dashboard";
import { getOperationsDashboardData } from "@/lib/operations/dashboard";

export default async function OperationsPage() {
  return <OperationsDashboard initialData={await getOperationsDashboardData()} />;
}
