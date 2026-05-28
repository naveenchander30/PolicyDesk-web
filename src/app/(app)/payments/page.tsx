import { fetchAllPayments } from "@/features/payments/payment.queries.server";

export default async function PaymentsPage() {
  const payments = await fetchAllPayments();

  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>
        <p>Track all premium payments across your book of business.</p>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <p>No payments recorded yet.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Insurance Type</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.policies?.clients?.name || "—"}</td>
                <td>{payment.policies?.insurance_types?.name || "—"}</td>
                <td>{payment.amount_due ? `$${payment.amount_due}` : "—"}</td>
                <td>{payment.amount_paid ? `$${payment.amount_paid}` : "—"}</td>
                <td>{payment.due_date ? new Date(payment.due_date).toLocaleDateString() : "—"}</td>
                <td>
                  <span className={`payment-status status-${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
