"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "./dashboard-queries";

export interface DashboardWidgetsProps {
  stats: DashboardStats;
}

const statCardConfig = [
  { key: "totalClients", label: "Clients", icon: "👥", color: "var(--primary)" },
  { key: "totalPolicies", label: "Policies", icon: "📄", color: "var(--secondary)" },
  { key: "pendingPayments", label: "Pending Payments", icon: "⏳", color: "var(--tertiary-container)" },
  { key: "overduePayments", label: "Overdue Payments", icon: "⚠️", color: "var(--error)" },
  { key: "paidPayments", label: "Paid This Month", icon: "✅", color: "var(--tertiary)" },
];

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
      {statCardConfig.map((cfg, i) => (
        <div
          key={cfg.key}
          className="stat-card"
          style={{
            animation: visible ? `statFadeUp 0.4s ease-out ${i * 0.1}s both` : "none",
            borderLeftColor: cfg.color,
          }}
        >
          <div className="stat-header">
            <span className="stat-icon">{cfg.icon}</span>
            <p className="stat-label">{cfg.label}</p>
          </div>
          <p className="stat-value" style={{ color: cfg.color }}>
            {String((stats as Record<string, number>)[cfg.key] ?? 0)}
          </p>
          <div className="stat-trend">
            <span className="trend-up">&#9650;</span>
            <span>Since last month</span>
          </div>
        </div>
      ))}

      <div className="quick-actions">
        <a href="/clients/new" className="quick-action-chip">
          <span>➕</span> Add Client
        </a>
        <a href="/payments" className="quick-action-chip">
          <span>💳</span> Record Payment
        </a>
        <a href="/policies" className="quick-action-chip">
          <span>📋</span> View All Policies
        </a>
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
