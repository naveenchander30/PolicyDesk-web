import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchClient, fetchClientPaymentSummary } from "@/features/clients/client.queries.server";
import { fetchPoliciesByClient } from "@/features/policies/policy.queries.server";
import { PolicyList } from "@/features/policies/policy-list";
import { ClientPaymentSummary } from "@/features/clients/client-payment-summary";

export default async function ClientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  let client;
  try {
    client = await fetchClient(id);
  } catch {
    notFound();
  }

  const policies = await fetchPoliciesByClient(id);
  const paymentSummary = await fetchClientPaymentSummary(supabase, id);

  return (
    <div>
      <Link href="/clients" className="back-link">&larr; Back to Clients</Link>
      <h1>{client.name}</h1>

      <dl className="detail-list">
        <dt>Phone</dt>
        <dd>{client.phone}</dd>

        <dt>Email</dt>
        <dd>{client.email || "-"}</dd>

        <dt>Notes</dt>
        <dd>{client.notes || "-"}</dd>

        <dt>Added</dt>
        <dd>{new Date(client.created_at).toLocaleDateString()}</dd>
      </dl>

      <div className="form-actions">
        <Link href={`/clients/${id}/edit`} className="button">
          Edit Client
        </Link>
      </div>

      <h2>Policies</h2>
      <PolicyList policies={policies} clientId={id} />

      <ClientPaymentSummary summary={paymentSummary} />
    </div>
  );
}
