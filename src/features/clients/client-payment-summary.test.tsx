import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientPaymentSummary } from "./client-payment-summary";

const mockSummary = {
  totalRemaining: 25000,
  policies: [
    {
      policyId: "1",
      policyNumber: "POL-001",
      insuranceTypeName: "LIC",
      premiumAmount: 15000,
      totalDue: 15000,
      totalPaid: 5000,
      remaining: 10000,
      status: "active" as const,
    },
    {
      policyId: "2",
      policyNumber: "POL-042",
      insuranceTypeName: "ICICI",
      premiumAmount: 30000,
      totalDue: 30000,
      totalPaid: 15000,
      remaining: 15000,
      status: "active" as const,
    },
  ],
};

describe("ClientPaymentSummary", () => {
  it("renders policy rows and total", () => {
    render(<ClientPaymentSummary summary={mockSummary} />);
    expect(screen.getByText("POL-001")).toBeInTheDocument();
    expect(screen.getByText("LIC")).toBeInTheDocument();
    expect(screen.getByText("POL-042")).toBeInTheDocument();
    expect(screen.getByText("ICICI")).toBeInTheDocument();
    expect(screen.getByText(/25,000/)).toBeInTheDocument();
  });

  it("shows empty state when no policies", () => {
    render(<ClientPaymentSummary summary={{ totalRemaining: 0, policies: [] }} />);
    expect(screen.getByText(/no payments/i)).toBeInTheDocument();
  });
});
