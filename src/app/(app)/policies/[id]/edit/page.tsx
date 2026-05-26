"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { fetchPolicy, updatePolicyFromBrowser } from "@/features/policies/policy.queries";
import { fetchInsuranceTypes } from "@/features/insurance-types/insurance-type.queries";
import { PolicyWithDetails } from "@/features/policies/policy.types";
import { InsuranceType } from "@/features/insurance-types/insurance-type.types";

export default function EditPolicyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [policy, setPolicy] = useState<PolicyWithDetails | null>(null);
  const [insuranceTypeId, setInsuranceTypeId] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [premiumAmount, setPremiumAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [status, setStatus] = useState("active");
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      try {
        const [data, types] = await Promise.all([
          fetchPolicy(id),
          fetchInsuranceTypes()
        ]);
        setPolicy(data);
        setInsuranceTypeId(data.insurance_type_id);
        setPolicyNumber(data.policy_number || "");
        setPremiumAmount(data.premium_amount?.toString() || "");
        setDueDate(data.due_date || "");
        setFrequency(data.frequency || "monthly");
        setStatus(data.status);
        setInsuranceTypes(types);
      } catch {
        setError("Policy not found.");
      } finally {
        setLoadingData(false);
      }
    }
    load();
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
      const { id } = await params;
      await updatePolicyFromBrowser(id, {
        insurance_type_id: insuranceTypeId,
        policy_number: policyNumber.trim() || null,
        premium_amount: premiumAmount ? parseFloat(premiumAmount) : null,
        due_date: dueDate || null,
        frequency,
        status
      });
      router.push(`/clients/${policy?.client_id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (loadingData) return <p>Loading...</p>;
  if (!policy) return <p>Policy not found.</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Edit Policy</h1>
      <p>Client: {policy.clients?.name}</p>

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

      <label>
        <span>Status</span>
        <select
          name="status"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          disabled={isLoading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push(`/clients/${policy.client_id}`)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
