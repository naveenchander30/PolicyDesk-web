"use client";

import { ClientPaymentSummary as Summary } from "./client-payment.types";

type Props = {
  summary: Summary;
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ClientPaymentSummary({ summary }: Props) {
  if (summary.policies.length === 0) {
    return <p>No payments recorded yet.</p>;
  }

  return (
    <div>
      <h2>Payment Summary</h2>
      <table className="detail-list">
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Company</th>
            <th>Premium</th>
            <th>Total Due</th>
            <th>Paid</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {summary.policies.map((p) => (
            <tr key={p.policyId}>
              <td>{p.policyNumber || "—"}</td>
              <td>{p.insuranceTypeName}</td>
              <td>{p.premiumAmount != null ? `$${fmt(p.premiumAmount)}` : "—"}</td>
              <td>${fmt(p.totalDue)}</td>
              <td>${fmt(p.totalPaid)}</td>
              <td>${fmt(p.remaining)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total Remaining: ${fmt(summary.totalRemaining)}</strong></p>
    </div>
  );
}
