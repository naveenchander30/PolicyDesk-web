import { InsuranceTypeList } from "@/features/insurance-types/insurance-type-list";
import { fetchInsuranceTypes } from "@/features/insurance-types/insurance-type.queries.server";

export default async function InsuranceTypesPage() {
  const types = await fetchInsuranceTypes();

  return (
    <div>
      <h1>Insurance Types</h1>
      <InsuranceTypeList types={types} />
    </div>
  );
}
