import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPolicy } from "@/features/policies/policy.queries";
import { fetchPaymentsByPolicy } from "@/features/payments/payment.queries";
import { PaymentList } from "@/features/payments/payment-list";

export default async function PolicyDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let policy;
  try {
    policy = await fetchPolicy(id);
  } catch {
    notFound();
  }

  const payments = await fetchPaymentsByPolicy(id);

  return (
    <div>
      <Link href={`/clients/${policy.client_id}`} className="back-link">
        &larr; Back to Client
      </Link>
      <h1>Policy {policy.policy_number || "Details"}</h1>

      <dl className="detail-list">
        <dt>Client</dt>
        <dd>{policy.clients?.name || "-"}</dd>

        <dt>Type</dt>
        <dd>{policy.insurance_types?.name || "-"}</dd>

        <dt>Premium</dt>
        <dd>{policy.premium_amount ? `$${policy.premium_amount}` : "-"}</dd>

        <dt>Frequency</dt>
        <dd>{policy.frequency || "-"}</dd>

        <dt>Status</dt>
        <dd>{policy.status}</dd>
      </dl>

      <h2>Payments</h2>
      <PaymentList payments={payments} policyId={id} />
    </div>
  );
}
