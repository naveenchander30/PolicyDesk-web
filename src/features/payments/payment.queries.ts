import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Payment, PaymentInput } from "./payment.types";

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

export async function updatePaymentStatus(id: string, status: string, amountPaid?: number): Promise<Payment> {
  const supabase = createBrowserSupabaseClient();
  const updates: Record<string, unknown> = { status };

  if (status === "paid") {
    updates.paid_on = new Date().toISOString().split("T")[0];
  }

  if (amountPaid !== undefined) {
    updates.amount_paid = amountPaid;
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
