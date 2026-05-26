import { fetchAllPolicies } from "@/features/policies/policy.queries.server";
import { PolicyList } from "@/features/policies/policy-list";

export default async function PoliciesPage() {
  const policies = await fetchAllPolicies();

  return (
    <div>
      <h1>All Policies</h1>
      <PolicyList policies={policies} />
    </div>
  );
}
