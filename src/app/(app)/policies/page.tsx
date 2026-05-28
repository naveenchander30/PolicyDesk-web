import { fetchAllPolicies } from "@/features/policies/policy.queries.server";
import { PolicyList } from "@/features/policies/policy-list";

export default async function PoliciesPage() {
  const policies = await fetchAllPolicies();

  return (
    <div>
      <div className="page-header">
        <h1>Policies</h1>
        <p>Manage and monitor active client policy records.</p>
      </div>
      <PolicyList policies={policies} />
    </div>
  );
}
