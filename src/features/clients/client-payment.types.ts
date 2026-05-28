export type PolicyPaymentSummary = {
  policyId: string;
  policyNumber: string | null;
  insuranceTypeName: string;
  premiumAmount: number | null;
  totalDue: number;
  totalPaid: number;
  remaining: number;
  status: "active" | "inactive";
};

export type ClientPaymentSummary = {
  totalRemaining: number;
  policies: PolicyPaymentSummary[];
};
