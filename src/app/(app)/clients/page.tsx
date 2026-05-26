import { ClientList } from "@/features/clients/client-list";
import { fetchClients } from "@/features/clients/client.queries";

export default async function ClientsPage() {
  const clients = await fetchClients();

  return (
    <div>
      <h1>Clients</h1>
      <ClientList clients={clients} />
    </div>
  );
}
