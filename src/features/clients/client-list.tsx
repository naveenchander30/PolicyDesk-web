"use client";

import Link from "next/link";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Client } from "./client.types";

type SortKey = "name" | "created_at";
type SortDir = "asc" | "desc";

interface ClientListProps {
  clients: Client[];
}

const PAGE_SIZE = 10;

export function ClientList({ clients }: ClientListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }, [sortKey]);

  const filtered = useMemo(() => {
    let result = clients;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
      const cmp = typeof aVal === "string" ? aVal.localeCompare(String(bVal)) : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [clients, debouncedSearch, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="list-toolbar">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>&times;</button>
          )}
        </div>
        <span className="result-count">
          Showing {filtered.length} of {clients.length} clients
        </span>
      </div>

      {paged.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <p>{debouncedSearch ? "No clients match your search" : "No clients yet"}</p>
          {!debouncedSearch && (
            <Link href="/clients/new" className="button">Add Client</Link>
          )}
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th
                  className="sortable"
                  onClick={() => toggleSort("name")}
                  aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  Name
                  {sortKey === "name" && <span className="sort-arrow">{sortDir === "asc" ? " ▲" : " ▼"}</span>}
                </th>
                <th>Contact</th>
                <th
                  className="sortable"
                  onClick={() => toggleSort("created_at")}
                  aria-sort={sortKey === "created_at" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  Created
                  {sortKey === "created_at" && <span className="sort-arrow">{sortDir === "asc" ? " ▲" : " ▼"}</span>}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email || client.phone || "—"}</td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <div className="overflow-menu">
                      <button className="overflow-trigger">⋯</button>
                      <div className="overflow-items">
                        <Link href={`/clients/${client.id}`}>View</Link>
                        <Link href={`/clients/${client.id}/edit`}>Edit</Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={i === page ? "page-active" : ""}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
