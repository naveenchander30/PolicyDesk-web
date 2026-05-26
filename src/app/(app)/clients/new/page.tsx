"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClientFromBrowser } from "@/features/clients/client.queries";

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
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

    if (!phone.trim()) {
      setError("Phone number is required.");
      setIsLoading(false);
      return;
    }

    try {
      await createClientFromBrowser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null
      });
      router.push("/clients");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Add Client</h1>

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
          {isLoading ? "Saving..." : "Create Client"}
        </button>
        <button type="button" onClick={() => router.push("/clients")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
