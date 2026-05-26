"use client";

import Link from "next/link";
import { PolicyWithDetails } from "./policy.types";

export interface PolicyListProps {
  policies: PolicyWithDetails[];
  clientId?: string;
}

export function PolicyList({ policies, clientId }: PolicyListProps) {
  if (policies.length === 0) {
    return (
      <div>
        <p>No policies yet.</p>
        {clientId && (
          <Link href={`/clients/${clientId}/policies/new`} className="button">
            Add Policy
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {clientId && (
        <div className="list-header">
          <Link href={`/clients/${clientId}/policies/new`} className="button">
            Add Policy
          </Link>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Type</th>
            <th>Premium</th>
            <th>Due Date</th>
            <th>Frequency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id}>
              <td>{policy.policy_number || "-"}</td>
              <td>{policy.insurance_types?.name || "-"}</td>
              <td>{policy.premium_amount ? `$${policy.premium_amount}` : "-"}</td>
              <td>{policy.due_date ? new Date(policy.due_date).toLocaleDateString() : "-"}</td>
              <td>{policy.frequency || "-"}</td>
              <td>{policy.status}</td>
              <td className="actions">
                <Link href={`/policies/${policy.id}`}>View</Link>
                <Link href={`/policies/${policy.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
