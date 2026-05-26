"use client";

import Link from "next/link";
import { Client } from "./client.types";

export interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="client-list">
        <div className="empty-state">
          <p>No clients yet. Add your first client to get started.</p>
          <Link href="/clients/new" className="button">
            Add Client
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="client-list">
      <div className="list-header">
        <Link href="/clients/new" className="button">
          Add Client
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.phone}</td>
              <td>{client.email || "-"}</td>
              <td className="actions">
                <Link href={`/clients/${client.id}`}>View</Link>
                <Link href={`/clients/${client.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
