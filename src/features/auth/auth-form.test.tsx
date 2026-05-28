import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "./auth-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => null
}));

vi.mock("@/lib/supabase/browser", () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session: {} }, error: null })
    }
  })
}));

describe("AuthForm", () => {
  it("renders login controls and forgot password link", () => {
    render(<AuthForm />);

    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Contact your agency admin.")).toBeInTheDocument();
  });

  it("shows validation messages when submitted empty", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });
});
