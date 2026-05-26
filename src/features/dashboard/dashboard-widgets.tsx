"use client";

import { DashboardStats } from "./dashboard-queries";

export interface DashboardWidgetsProps {
  stats: DashboardStats;
}

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  return (
    <div className="dashboard-widgets">
      <div className="dashboard-widget">
        <h3>Clients</h3>
        <p className="widget-stat">{stats.totalClients}</p>
      </div>
      <div className="dashboard-widget">
        <h3>Policies</h3>
        <p className="widget-stat">{stats.totalPolicies}</p>
      </div>
      <div className="dashboard-widget">
        <h3>Pending Payments</h3>
        <p className="widget-stat warning">{stats.pendingPayments}</p>
      </div>
      <div className="dashboard-widget">
        <h3>Overdue Payments</h3>
        <p className="widget-stat danger">{stats.overduePayments}</p>
      </div>
      <div className="dashboard-widget">
        <h3>Paid Payments</h3>
        <p className="widget-stat success">{stats.paidPayments}</p>
      </div>
    </div>
  );
}
