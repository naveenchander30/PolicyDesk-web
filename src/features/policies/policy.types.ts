export type Policy = {
  id: string;
  client_id: string;
  insurance_type_id: string;
  policy_number?: string | null;
  signed_on?: string | null;
  expires_on?: string | null;
  premium_amount?: number | null;
  due_date?: string | null;
  frequency?: string | null;
  status: string;
  created_at: string;
};

export type PolicyInput = {
  client_id: string;
  insurance_type_id: string;
  policy_number?: string | null;
  signed_on?: string | null;
  expires_on?: string | null;
  premium_amount?: number | null;
  due_date?: string | null;
  frequency?: string | null;
  status?: string;
};

export type PolicyWithDetails = Policy & {
  insurance_types?: { name: string };
  clients?: { name: string };
};
