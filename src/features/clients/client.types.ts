export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  created_at: string;
};

export type ClientInput = {
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
};
