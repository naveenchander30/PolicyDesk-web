import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { getDashboardStats } from "@/features/dashboard/dashboard-queries";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardWidgets stats={stats} />
    </div>
  );
}
