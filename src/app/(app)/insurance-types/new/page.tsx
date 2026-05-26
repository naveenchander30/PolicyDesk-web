"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createInsuranceTypeFromBrowser } from "@/features/insurance-types/insurance-type.queries";

export default function NewInsuranceTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      setIsLoading(false);
      return;
    }

    try {
      await createInsuranceTypeFromBrowser({ name: name.trim() });
      router.push("/insurance-types");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Add Insurance Type</h1>

      {error && <p className="field-error">{error}</p>}

      <label>
        <span>Name</span>
        <input
          name="name"
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          disabled={isLoading}
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Create Insurance Type"}
        </button>
        <button type="button" onClick={() => router.push("/insurance-types")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
