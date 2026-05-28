import { ClientList } from "@/features/clients/client-list";
import { fetchClients } from "@/features/clients/client.queries.server";

export default async function ClientsPage() {
  const clients = await fetchClients();

  return (
    <div>
      <div className="page-header">
        <h1>Clients</h1>
        <p>Manage your agency&apos;s client database and relationships.</p>
      </div>
      <ClientList clients={clients} />
    </div>
  );
}
