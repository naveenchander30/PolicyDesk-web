import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Payment } from "./payment.types";

export type PaymentWithPolicy = Payment & {
  policies: {
    id: string;
    policy_number?: string | null;
    premium_amount: number;
    clients: { name: string };
    insurance_types: { name: string };
  } | null;
};

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

export async function fetchAllPayments(): Promise<PaymentWithPolicy[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, policies(id, policy_number, premium_amount, clients(name), insurance_types(name))")
    .order("due_date", { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as PaymentWithPolicy[];
}
