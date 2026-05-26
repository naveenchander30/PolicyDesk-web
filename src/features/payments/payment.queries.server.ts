import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Payment } from "./payment.types";

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
