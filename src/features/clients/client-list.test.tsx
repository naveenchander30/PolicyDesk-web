import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientList } from "./client-list";

const mockClients = [
  { id: "1", name: "Alice", email: "alice@test.com", phone: "555-0101", notes: null, created_at: "2024-01-01" },
  { id: "2", name: "Bob", email: "bob@test.com", phone: "555-0102", notes: null, created_at: "2024-02-01" },
  { id: "3", name: "Charlie", email: null, phone: "555-0103", notes: null, created_at: "2024-03-01" },
];

describe("ClientList", () => {
  it("renders all clients", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("filters by search query", () => {
    render(<ClientList clients={mockClients} />);
    const search = screen.getByPlaceholderText("Search clients...");
    fireEvent.change(search, { target: { value: "alice" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("shows result count", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("Showing 3 of 3 clients")).toBeInTheDocument();
  });

  it("sorts by name on header click", () => {
    render(<ClientList clients={mockClients} />);
    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);
    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("Alice");
  });
});
