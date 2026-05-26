import { createServerSupabaseClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalClients: number;
  totalPolicies: number;
  pendingPayments: number;
  overduePayments: number;
  paidPayments: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalClients },
    { count: totalPolicies },
    { count: pendingPayments },
    { count: paidPayments },
    { count: overduePayments }
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("policies").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "overdue")
  ]);

  return {
    totalClients: totalClients || 0,
    totalPolicies: totalPolicies || 0,
    pendingPayments: pendingPayments || 0,
    overduePayments: overduePayments || 0,
    paidPayments: paidPayments || 0
  };
}
