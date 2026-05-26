import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Client, ClientInput } from "./client.types";

export async function fetchClientFromBrowser(id: string): Promise<Client> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClientFromBrowser(input: ClientInput): Promise<Client> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientFromBrowser(id: string, input: Partial<ClientInput>): Promise<Client> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
