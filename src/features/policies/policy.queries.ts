import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Policy, PolicyInput, PolicyWithDetails } from "./policy.types";

export async function fetchPolicyFromBrowser(id: string): Promise<PolicyWithDetails> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*, insurance_types(name), clients(name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPolicyFromBrowser(input: PolicyInput): Promise<Policy> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePolicyFromBrowser(id: string, input: Partial<PolicyInput>): Promise<Policy> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("policies")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
