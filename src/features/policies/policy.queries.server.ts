import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PolicyWithDetails } from "./policy.types";

export async function fetchPoliciesByClient(clientId: string): Promise<PolicyWithDetails[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_types(name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAllPolicies(): Promise<PolicyWithDetails[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_types(name), clients(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchPolicy(id: string): Promise<PolicyWithDetails> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_types(name), clients(name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
