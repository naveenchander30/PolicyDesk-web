import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Client, ClientInput } from "./client.types";

export async function fetchClients(): Promise<Client[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchClient(id: string): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
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
