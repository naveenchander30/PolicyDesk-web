"use client";

import { useState } from "react";
import { DashboardStats } from "./dashboard-queries";

export interface DashboardWidgetsProps {
  stats: DashboardStats;
}

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSendReminders() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/reminders/send", { method: "POST" });
      const data = await res.json();
      setResult(`Sent to ${data.sent} clients, ${data.failed} failed`);
    } catch {
      setResult("Failed to send reminders");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <p className="stat-label">Clients</p>
        <p className="stat-value">{stats.totalClients}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Policies</p>
        <p className="stat-value">{stats.totalPolicies}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Pending Payments</p>
        <p className="stat-value warning">{stats.pendingPayments}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Overdue Payments</p>
        <p className="stat-value danger">{stats.overduePayments}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Paid Payments</p>
        <p className="stat-value success">{stats.paidPayments}</p>
      </div>
      <div className="reminder-card">
        <div className="reminder-icon">&#9993;</div>
        <h3>Payment Reminders</h3>
        <p>Notify clients with pending balances via WhatsApp.</p>
        <button onClick={handleSendReminders} disabled={sending}>
          {sending ? "Sending..." : "Send Reminders"}
        </button>
        {result && <p className="reminder-result">{result}</p>}
      </div>
    </div>
  );
}
