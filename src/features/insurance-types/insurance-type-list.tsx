"use client";

import Link from "next/link";
import { InsuranceType } from "./insurance-type.types";

export interface InsuranceTypeListProps {
  types: InsuranceType[];
}

export function InsuranceTypeList({ types }: InsuranceTypeListProps) {
  if (types.length === 0) {
    return (
      <div>
        <p>No insurance types yet. Add your first category.</p>
        <Link href="/insurance-types/new" className="button">
          Add Insurance Type
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <Link href="/insurance-types/new" className="button">
          Add Insurance Type
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id}>
              <td>{type.name}</td>
              <td className="actions">
                <Link href={`/insurance-types/${type.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
