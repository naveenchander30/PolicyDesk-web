"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { fetchInsuranceType, updateInsuranceTypeFromBrowser } from "@/features/insurance-types/insurance-type.queries";
import { InsuranceType } from "@/features/insurance-types/insurance-type.types";

export default function EditInsuranceTypePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [type, setType] = useState<InsuranceType | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      try {
        const data = await fetchInsuranceType(id);
        setType(data);
        setName(data.name);
      } catch {
        setError("Insurance type not found.");
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

    if (!name.trim()) {
      setError("Name is required.");
      setIsLoading(false);
      return;
    }

    try {
      const { id } = await params;
      await updateInsuranceTypeFromBrowser(id, { name: name.trim() });
      router.push("/insurance-types");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (loadingData) return <p>Loading...</p>;
  if (!type) return <p>Insurance type not found.</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Edit {type.name}</h1>

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
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push("/insurance-types")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
