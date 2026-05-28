import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { getDashboardStats } from "@/features/dashboard/dashboard-queries.server";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Real-time agency metrics and payment actions.</p>
      </div>
      <DashboardWidgets stats={stats} />
    </div>
  );
}
