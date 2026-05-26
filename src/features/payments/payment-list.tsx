"use client";

import { useRouter } from "next/navigation";
import { Payment } from "./payment.types";
import { updatePaymentStatus } from "./payment.queries";

export interface PaymentListProps {
  payments: Payment[];
  policyId: string;
}

export function PaymentList({ payments, policyId }: PaymentListProps) {
  const router = useRouter();

  async function handleMarkPaid(payment: Payment) {
    try {
      await updatePaymentStatus(payment.id, "paid", payment.amount_due || undefined);
      router.refresh();
    } catch (err) {
      console.error("Failed to mark payment as paid:", err);
    }
  }

  if (payments.length === 0) {
    return (
      <div>
        <p>No payments recorded yet.</p>
        <div className="form-actions">
          <a href={`/policies/${policyId}/payments/new`} className="button">
            Add Payment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <a href={`/policies/${policyId}/payments/new`} className="button">
          Add Payment
        </a>
      </div>
      <table>
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Amount Due</th>
            <th>Amount Paid</th>
            <th>Paid On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.due_date ? new Date(payment.due_date).toLocaleDateString() : "-"}</td>
              <td>{payment.amount_due ? `$${payment.amount_due}` : "-"}</td>
              <td>{payment.amount_paid ? `$${payment.amount_paid}` : "-"}</td>
              <td>{payment.paid_on ? new Date(payment.paid_on).toLocaleDateString() : "-"}</td>
              <td>
                <span className={`payment-status status-${payment.status}`}>
                  {payment.status}
                </span>
              </td>
              <td className="actions">
                {payment.status !== "paid" && (
                  <button onClick={() => handleMarkPaid(payment)}>
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
