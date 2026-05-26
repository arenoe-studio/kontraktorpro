import { requireRole } from "@/lib/auth/session";
import { getDashboardData } from "@/features/dashboard/dashboard-service";
import { DashboardPage } from "../_components/DashboardPage";

export default async function Page() {
  const user = await requireRole("contractor");
  const data = await getDashboardData(user.id);
  return <DashboardPage data={data} />;
}
