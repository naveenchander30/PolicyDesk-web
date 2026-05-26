import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { InsuranceType, InsuranceTypeInput } from "./insurance-type.types";

export async function fetchInsuranceTypeFromBrowser(id: string): Promise<InsuranceType> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchInsuranceTypesFromBrowser(): Promise<InsuranceType[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createInsuranceTypeFromBrowser(input: InsuranceTypeInput): Promise<InsuranceType> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInsuranceTypeFromBrowser(id: string, input: InsuranceTypeInput): Promise<InsuranceType> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
