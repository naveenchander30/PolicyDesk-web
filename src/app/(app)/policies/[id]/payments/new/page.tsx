"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createPaymentFromBrowser } from "@/features/payments/payment.queries";

export default function NewPaymentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [policyId, setPolicyId] = useState<string>("");
  const [amountDue, setAmountDue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    params.then(({ id }) => setPolicyId(id));
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createPaymentFromBrowser({
        policy_id: policyId,
        amount_due: amountDue ? parseFloat(amountDue) : null,
        due_date: dueDate || null,
        status: "pending"
      });
      router.push(`/policies/${policyId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Add Payment</h1>

      {error && <p className="field-error">{error}</p>}

      <label>
        <span>Amount Due ($)</span>
        <input
          name="amount_due"
          onChange={(e) => setAmountDue(e.target.value)}
          type="number"
          step="0.01"
          value={amountDue}
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

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Add Payment"}
        </button>
        <button type="button" onClick={() => router.push(`/policies/${policyId}`)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
