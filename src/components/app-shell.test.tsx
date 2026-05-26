import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders navigation and page content", () => {
    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>
    );

    expect(screen.getByText("PolicyDesk")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
