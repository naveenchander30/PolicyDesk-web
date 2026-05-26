"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { fetchClientFromBrowser, updateClientFromBrowser } from "@/features/clients/client.queries";
import { Client } from "@/features/clients/client.types";

export default function EditClientPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      try {
        const data = await fetchClientFromBrowser(id);
        setClient(data);
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email || "");
        setNotes(data.notes || "");
      } catch {
        setError("Client not found.");
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

    if (!phone.trim()) {
      setError("Phone number is required.");
      setIsLoading(false);
      return;
    }

    try {
      const { id } = await params;
      await updateClientFromBrowser(id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null
      });
      router.push(`/clients/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (loadingData) return <p>Loading...</p>;
  if (!client) return <p>Client not found.</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Edit {client.name}</h1>

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

      <label>
        <span>Phone</span>
        <input
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          value={phone}
          disabled={isLoading}
          required
        />
      </label>

      <label>
        <span>Email</span>
        <input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
          disabled={isLoading}
        />
      </label>

      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
          disabled={isLoading}
          rows={3}
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push(`/clients/${client.id}`)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
