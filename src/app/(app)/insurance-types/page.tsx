import { InsuranceTypeList } from "@/features/insurance-types/insurance-type-list";
import { fetchInsuranceTypes } from "@/features/insurance-types/insurance-type.queries.server";

export default async function InsuranceTypesPage() {
  const types = await fetchInsuranceTypes();

  return (
    <div>
      <div className="page-header">
        <h1>Insurance Types</h1>
        <p>Configure and categorize insurance product offerings.</p>
      </div>
      <InsuranceTypeList types={types} />
    </div>
  );
}
