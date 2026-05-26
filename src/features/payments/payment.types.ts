export type Payment = {
  id: string;
  policy_id: string;
  amount_due?: number | null;
  amount_paid?: number | null;
  paid_on?: string | null;
  due_date?: string | null;
  status: string;
  created_at: string;
};

export type PaymentInput = {
  policy_id: string;
  amount_due?: number | null;
  amount_paid?: number | null;
  paid_on?: string | null;
  due_date?: string | null;
  status?: string;
};
