import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Payment, PaymentInput } from "./payment.types";

export async function fetchPaymentsByPolicy(policyId: string): Promise<Payment[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("policy_id", policyId)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPaymentFromBrowser(input: PaymentInput): Promise<Payment> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(id: string, status: string, amount_paid?: number): Promise<Payment> {
  const supabase = createBrowserSupabaseClient();
  const updates: Record<string, unknown> = { status };

  if (status === "paid") {
    updates.paid_on = new Date().toISOString().split("T")[0];
  }

  if (amount_paid !== undefined) {
    updates.amount_paid = amount_paid;
  }

  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
