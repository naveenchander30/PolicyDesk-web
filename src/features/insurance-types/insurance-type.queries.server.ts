import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InsuranceType } from "./insurance-type.types";

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
