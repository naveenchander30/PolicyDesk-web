import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InsuranceType, InsuranceTypeInput } from "./insurance-type.types";

export async function fetchInsuranceTypes(): Promise<InsuranceType[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchInsuranceType(id: string): Promise<InsuranceType> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createInsuranceType(input: InsuranceTypeInput): Promise<InsuranceType> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInsuranceType(id: string, input: InsuranceTypeInput): Promise<InsuranceType> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("insurance_types")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInsuranceType(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("insurance_types")
    .delete()
    .eq("id", id);

  if (error) throw error;
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
