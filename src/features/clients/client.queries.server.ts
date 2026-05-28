import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Client, ClientInput } from "./client.types";
import { ClientPaymentSummary, PolicyPaymentSummary } from "./client-payment.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchClients(): Promise<Client[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchClient(id: string): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function fetchClientPaymentSummary(
  supabase: SupabaseClient,
  clientId: string
): Promise<ClientPaymentSummary> {
  const { data: policies, error: policiesError } = await supabase
    .from("policies")
    .select("*, insurance_types(name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (policiesError) throw policiesError;
  if (!policies || policies.length === 0) {
    return { totalRemaining: 0, policies: [] };
  }

  const policySummaries: PolicyPaymentSummary[] = [];

  for (const policy of policies) {
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("amount_due, amount_paid")
      .eq("policy_id", policy.id);

    if (paymentsError) throw paymentsError;

    const totalDue = (payments || []).reduce(
      (sum, p) => sum + (p.amount_due || 0),
      0
    );
    const totalPaid = (payments || []).reduce(
      (sum, p) => sum + (p.amount_paid || 0),
      0
    );
    const remaining = totalDue - totalPaid;

    const insuranceTypeName =
      (policy.insurance_types as { name?: string } | null)?.name || "Unknown";

    policySummaries.push({
      policyId: policy.id,
      policyNumber: policy.policy_number || null,
      insuranceTypeName,
      premiumAmount: policy.premium_amount || null,
      totalDue,
      totalPaid,
      remaining,
      status: policy.status === "active" ? "active" : "inactive",
    });
  }

  const totalRemaining = policySummaries.reduce(
    (sum, p) => sum + p.remaining,
    0
  );

  return { totalRemaining, policies: policySummaries };
}
