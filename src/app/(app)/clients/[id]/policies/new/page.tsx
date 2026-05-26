"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { createPolicyFromBrowser } from "@/features/policies/policy.queries";
import { fetchInsuranceTypes } from "@/features/insurance-types/insurance-type.queries";
import { InsuranceType } from "@/features/insurance-types/insurance-type.types";

export default function NewPolicyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState<string>("");
  const [insuranceTypeId, setInsuranceTypeId] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [premiumAmount, setPremiumAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    async function init() {
      const { id } = await params;
      setClientId(id);
      const types = await fetchInsuranceTypes();
      setInsuranceTypes(types);
      setLoadingTypes(false);
    }
    init();
  }, [params]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!insuranceTypeId) {
      setError("Insurance type is required.");
      setIsLoading(false);
      return;
    }

    try {
      await createPolicyFromBrowser({
        client_id: clientId,
        insurance_type_id: insuranceTypeId,
        policy_number: policyNumber.trim() || null,
        premium_amount: premiumAmount ? parseFloat(premiumAmount) : null,
        due_date: dueDate || null,
        frequency
      });
      router.push(`/clients/${clientId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (loadingTypes) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Add Policy</h1>

      {error && <p className="field-error">{error}</p>}

      <label>
        <span>Insurance Type</span>
        <select
          name="insurance_type_id"
          onChange={(e) => setInsuranceTypeId(e.target.value)}
          value={insuranceTypeId}
          disabled={isLoading}
          required
        >
          <option value="">Select type...</option>
          {insuranceTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Policy Number</span>
        <input
          name="policy_number"
          onChange={(e) => setPolicyNumber(e.target.value)}
          type="text"
          value={policyNumber}
          disabled={isLoading}
        />
      </label>

      <label>
        <span>Premium Amount ($)</span>
        <input
          name="premium_amount"
          onChange={(e) => setPremiumAmount(e.target.value)}
          type="number"
          step="0.01"
          value={premiumAmount}
          disabled={isLoading}
        />
      </label>

      <label>
        <span>Due Date</span>
        <input
          name="due_date"
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          value={dueDate}
          disabled={isLoading}
        />
      </label>

      <label>
        <span>Frequency</span>
        <select
          name="frequency"
          onChange={(e) => setFrequency(e.target.value)}
          value={frequency}
          disabled={isLoading}
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Create Policy"}
        </button>
        <button type="button" onClick={() => router.push(`/clients/${clientId}`)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
