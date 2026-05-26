import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchClient } from "@/features/clients/client.queries";

export default async function ClientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let client;
  try {
    client = await fetchClient(id);
  } catch {
    notFound();
  }

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
    </div>
  );
}
