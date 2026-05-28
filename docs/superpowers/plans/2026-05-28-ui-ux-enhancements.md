# UI/UX Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full visual and interaction overhaul of PolicyDesk web (Next.js) and mobile (Expo) apps — landing page, auth, dashboard, tables, mobile-specific upgrades, animations.

**Architecture:** Web changes are CSS + React component updates in a single Next.js app. Mobile changes are React Native Paper screen updates in an Expo app. Changes are layered: visual polish first, then interaction upgrades, then micro-animations.

**Tech Stack:** Web: Next.js 16, plain CSS, Stitch dark theme tokens. Mobile: Expo 56, RN Paper MD3, Stitch dark theme. Animations: CSS `@keyframes` + React Native `Animated`.

---

## Task 1: Landing Page Hero Redesign (Web)

**Files:**
- Modify: `PolicyDesk-web/src/app/page.tsx`
- Modify: `PolicyDesk-web/src/app/globals.css` (add landing page section)

- [ ] **Step 1: Update landing page content**

Edit `src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="public-page">
      <section className="public-panel">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-brand">
              <svg className="hero-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M16 4L8 8h16L16 4z" fill="currentColor" opacity="0.3"/>
                <rect x="12" y="14" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="12" y="18" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="12" y="22" width="5" height="2" rx="1" fill="currentColor" opacity="0.5"/>
              </svg>
              <p className="eyebrow">PolicyDesk</p>
            </div>
            <h1>Track premium payments without losing the client context.</h1>
            <p className="hero-subtitle">
              Sign in to manage clients, policies, due dates, and payment follow-up.
            </p>
            <div className="public-actions">
              <Link href="/login">Log in</Link>
              <Link href="/login" className="button-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-card" style={{width:"160px", height:"90px", top:"10%", left:"15%"}}>
              <div className="hv-line" style={{width:"60%", height:"8px", background:"var(--primary)", opacity:0.6, borderRadius:"4px"}}></div>
              <div className="hv-line" style={{width:"40%", height:"6px", marginTop:"8px", background:"var(--outline)", opacity:0.4, borderRadius:"3px"}}></div>
            </div>
            <div className="hero-visual-card" style={{width:"130px", height:"70px", top:"45%", right:"10%"}}>
              <div className="hv-line" style={{width:"50%", height:"8px", background:"var(--secondary)", opacity:0.5, borderRadius:"4px"}}></div>
              <div className="hv-line" style={{width:"70%", height:"6px", marginTop:"8px", background:"var(--outline)", opacity:0.3, borderRadius:"3px"}}></div>
            </div>
            <svg className="hero-curve" viewBox="0 0 200 100" style={{position:"absolute", bottom:"20%", left:"5%", width:"180px", opacity:0.15}}>
              <path d="M0 80 Q50 20 100 60 T200 40" stroke="var(--primary)" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>
        <footer className="hero-footer">
          <p>Built for independent insurance agents</p>
        </footer>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Add landing page CSS**

Add to the landing section in `globals.css` (after existing `.public-actions a:first-child` block):

```css
.public-page {
  background: linear-gradient(135deg, #0b1326 0%, #060e20 50%, #0a0e1a 100%);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  min-height: 70vh;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-brand .eyebrow {
  margin: 0;
}

.hero-icon {
  color: var(--primary);
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--on-surface-variant);
}

.hero-visual {
  position: relative;
  height: 300px;
}

.hero-visual-card {
  position: absolute;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.7;
  animation: float 6s ease-in-out infinite;
}

.hero-visual-card:nth-child(2) {
  animation-delay: -3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.hv-line {
  display: block;
}

.hero-curve {
  display: block;
}

.hero-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid rgba(66, 71, 84, 0.15);
  text-align: center;
}

.hero-footer p {
  margin: 0;
  color: var(--outline);
  font-size: 0.8rem;
}

.button-secondary {
  border: 1px solid var(--outline-variant) !important;
  background: transparent !important;
  color: var(--on-surface) !important;
  font-weight: 500 !important;
}

@media (max-width: 760px) {
  .hero-content {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .hero-visual {
    display: none;
  }
}
```

- [ ] **Step 3: Verify landing page renders**

Run: `curl -s http://localhost:3000 | grep -c 'hero-content'`
Expected: `1` (hero content is present)

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat: redesign landing page with hero layout and decorative illustration"
```

---

## Task 2: Auth Form Improvements (Web)

**Files:**
- Modify: `PolicyDesk-web/src/features/auth/auth-form.tsx`
- Modify: `PolicyDesk-web/src/app/globals.css` (add auth validation styles)

- [ ] **Step 1: Write test for new auth form behavior**

Edit `src/features/auth/auth-form.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

// Mock next/navigation
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Mock supabase
jest.mock("@/lib/supabase/browser", () => ({
  createBrowserSupabaseClient: () => ({
    auth: { signInWithPassword: jest.fn().mockResolvedValue({ error: null }) },
  }),
}));

describe("AuthForm", () => {
  it("renders forgot password link", () => {
    render(<AuthForm />);
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("shows validation errors on blur for empty fields", async () => {
    render(<AuthForm />);
    const emailInput = screen.getByLabelText("Email");
    await userEvent.click(emailInput);
    await userEvent.tab(); // blur without typing
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  it("shows green border on valid input", async () => {
    render(<AuthForm />);
    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.tab();
    expect(emailInput).toHaveStyle("border-color: var(--tertiary)");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/auth/auth-form.test.tsx --no-coverage`
Expected: Tests fail because forgot password link and validation behavior not yet implemented

- [ ] **Step 3: Update auth form with forgot password + real-time validation**

Edit `src/features/auth/auth-form.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { getAuthErrors } from "@/lib/auth/auth";

type ValidationErrors = {
  email?: string;
  password?: string;
  submit?: string;
};

type TouchedFields = {
  email: boolean;
  password: boolean;
};

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = useCallback((field: "email" | "password", value: string) => {
    const fieldErrors = getAuthErrors(
      field === "email" ? value : email,
      field === "password" ? value : password
    );
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }, [email, password]);

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email" && !email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (field === "password" && !password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
    } else {
      validateField(field, field === "email" ? email : password);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setTouched({ email: true, password: true });

    const validationErrors = getAuthErrors(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        const redirectTo = searchParams?.get("redirect") || "/dashboard";
        router.push(redirectTo);
        router.refresh();
      }, 600);
    } catch {
      setErrors({ submit: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  }

  const emailValid = touched.email && email.trim() && !errors.email;
  const emailError = touched.email && errors.email;
  const passwordValid = touched.password && password.trim() && !errors.password;
  const passwordError = touched.password && errors.password;

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="eyebrow">PolicyDesk</p>
        <h1>Log in</h1>
        <p>Access your client book and payment dashboard.</p>
      </div>

      {errors.submit && <p className="field-error">{errors.submit}</p>}

      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => handleBlur("email")}
          type="email"
          value={email}
          disabled={isLoading}
          className={emailValid ? "field-valid" : emailError ? "field-error-border" : ""}
          aria-invalid={!!emailError}
        />
      </label>
      {emailError ? <p className="field-error">{emailError}</p> : null}

      <label>
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => handleBlur("password")}
          type="password"
          value={password}
          disabled={isLoading}
          className={passwordValid ? "field-valid" : passwordError ? "field-error-border" : ""}
          aria-invalid={!!passwordError}
        />
      </label>
      {passwordError ? <p className="field-error">{passwordError}</p> : null}

      <div className="auth-links">
        <a href="/forgot-password" className="forgot-link" tabIndex={isLoading ? -1 : 0}>
          Forgot password?
        </a>
      </div>

      <button type="submit" disabled={isLoading} className={isSuccess ? "btn-success" : ""}>
        {isLoading ? (
          <span className="btn-spinner" />
        ) : isSuccess ? (
          <span>&#10003; Logged in</span>
        ) : (
          "Log in"
        )}
      </button>

      <p className="auth-switch">
        Don&apos;t have an account? Contact your agency admin.
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Add auth CSS**

Add to `globals.css` after existing `.auth-form button:disabled` block:

```css
.auth-links {
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
}

.forgot-link {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.field-valid {
  border-color: var(--tertiary) !important;
}

.field-error-border {
  border-color: var(--error) !important;
}

.btn-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--on-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-success {
  background: var(--tertiary) !important;
  transition: background 0.3s;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/features/auth/auth-form.test.tsx --no-coverage`
Expected: All tests PASS

- [ ] **Step 6: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/features/auth/auth-form.tsx src/app/globals.css src/features/auth/auth-form.test.tsx
git commit -m "feat: add forgot password link, real-time validation, and loading spinner to auth form"
```

---

## Task 3: Add Missing `/payments` Standalone Route (Web)

**Files:**
- Create: `PolicyDesk-web/src/app/(app)/payments/page.tsx`
- Create: `PolicyDesk-web/src/app/(app)/payments/layout.tsx`

- [ ] **Step 1: Create payments list page**

Create `src/app/(app)/payments/page.tsx`:

```tsx
import { PaymentList } from "@/features/payments/payment-list";
import { fetchPayments } from "@/features/payments/payment.queries.server";
import Link from "next/link";

export default async function PaymentsPage() {
  const payments = await fetchPayments();

  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>
        <p>Track all premium payments across your book of business.</p>
      </div>
      <div className="list-header">
        <Link href="/policies" className="button-secondary">View Policies</Link>
      </div>
      <PaymentList payments={payments} />
    </div>
  );
}
```

Read `src/features/payments/payment.queries.server.ts` to check if `fetchPayments` exists. If not, the plan needs updating.

- [ ] **Step 2: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/payments/
git commit -m "feat: add standalone payments list route"
```

---

## Task 4: Dashboard Stat Cards with Icons, Deltas, and Entrance Animation (Web)

**Files:**
- Modify: `PolicyDesk-web/src/features/dashboard/dashboard-widgets.tsx`
- Modify: `PolicyDesk-web/src/app/globals.css` (add stat card animations)

- [ ] **Step 1: Update dashboard widgets with icons and trends**

Edit `src/features/dashboard/dashboard-widgets.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "./dashboard-queries";

export interface DashboardWidgetsProps {
  stats: DashboardStats;
}

const statCardConfig = [
  { key: "totalClients", label: "Clients", icon: "👥", color: "var(--primary)" },
  { key: "totalPolicies", label: "Policies", icon: "📄", color: "var(--secondary)" },
  { key: "pendingPayments", label: "Pending Payments", icon: "⏳", color: "var(--tertiary-container)" },
  { key: "overduePayments", label: "Overdue Payments", icon: "⚠️", color: "var(--error)" },
  { key: "paidPayments", label: "Paid This Month", icon: "✅", color: "var(--tertiary)" },
];

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  async function handleSendReminders() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/reminders/send", { method: "POST" });
      const data = await res.json();
      setResult(`Sent to ${data.sent} clients, ${data.failed} failed`);
    } catch {
      setResult("Failed to send reminders");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="dashboard-stats">
      {statCardConfig.map((cfg, i) => (
        <div
          key={cfg.key}
          className="stat-card"
          style={{
            animation: visible ? `statFadeUp 0.4s ease-out ${i * 0.1}s both` : "none",
            borderLeftColor: cfg.color,
          }}
        >
          <div className="stat-header">
            <span className="stat-icon">{cfg.icon}</span>
            <p className="stat-label">{cfg.label}</p>
          </div>
          <p className="stat-value" style={{ color: cfg.color }}>
            {String((stats as Record<string, number>)[cfg.key] ?? 0)}
          </p>
          <div className="stat-trend">
            <span className="trend-up">&#9650;</span>
            <span>Since last month</span>
          </div>
        </div>
      ))}

      <div className="quick-actions">
        <a href="/clients/new" className="quick-action-chip">
          <span>➕</span> Add Client
        </a>
        <a href="/payments" className="quick-action-chip">
          <span>💳</span> Record Payment
        </a>
        <a href="/policies" className="quick-action-chip">
          <span>📋</span> View All Policies
        </a>
      </div>

      <div className="reminder-card">
        <div className="reminder-icon">&#9993;</div>
        <h3>Payment Reminders</h3>
        <p>Notify clients with pending balances via WhatsApp.</p>
        <button onClick={handleSendReminders} disabled={sending}>
          {sending ? "Sending..." : "Send Reminders"}
        </button>
        {result && <p className="reminder-result">{result}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add stat card CSS animations**

Add to `globals.css`:

```css
@keyframes statFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stat-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.trend-up {
  color: var(--tertiary);
  font-size: 0.65rem;
}

.quick-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-action-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 24px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.15s, border-color 0.15s;
}

.quick-action-chip:hover {
  background: var(--surface-container-high);
  border-color: var(--primary);
}
```

- [ ] **Step 3: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/dashboard-widgets.tsx src/app/globals.css
git commit -m "feat: add stat card icons, trend indicators, quick actions, and entrance animations to dashboard"
```

---

## Task 5: Table Sorting + Search Debounce + Pagination (Web)

**Files:**
- Modify: `PolicyDesk-web/src/features/clients/client-list.tsx`
- Modify: `PolicyDesk-web/src/features/policies/policy-list.tsx`
- Modify: `PolicyDesk-web/src/app/globals.css` (add sort/pagination styles)

- [ ] **Step 1: Read current client-list.tsx to understand existing structure**

Read: `src/features/clients/client-list.tsx`

- [ ] **Step 2: Write test for sort + search + pagination**

Create `src/features/clients/client-list.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ClientList } from "./client-list";

const mockClients = [
  { id: "1", name: "Alice", email: "alice@test.com", phone: null, notes: null, created_at: "2024-01-01" },
  { id: "2", name: "Bob", email: "bob@test.com", phone: "555", notes: null, created_at: "2024-02-01" },
  { id: "3", name: "Charlie", email: null, phone: null, notes: null, created_at: "2024-03-01" },
];

describe("ClientList", () => {
  it("renders all clients", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
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
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest src/features/clients/client-list.test.tsx --no-coverage`
Expected: Tests fail - features not yet implemented

- [ ] **Step 4: Update client-list.tsx with sort, search, pagination**

```tsx
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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
    setPage(0);
  }, []);

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
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : 0;
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
          <p>No clients found</p>
          <Link href="/clients/new" className="button">Add Client</Link>
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
```

- [ ] **Step 5: Add sort/search/pagination CSS**

Add to `globals.css`:

```css
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.search-input {
  width: 100%;
  min-height: 40px;
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
  padding: 8px 36px 8px 12px;
  background: var(--surface-container-low);
  color: var(--on-surface);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--outline);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
}

.result-count {
  color: var(--outline);
  font-size: 0.8rem;
  white-space: nowrap;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  color: var(--primary);
}

.sort-arrow {
  font-size: 0.7rem;
}

.overflow-menu {
  position: relative;
  display: inline-block;
}

.overflow-trigger {
  background: none;
  border: none;
  color: var(--outline);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 2px;
}

.overflow-trigger:hover {
  background: var(--surface-container-high);
  color: var(--on-surface);
}

.overflow-items {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
  padding: 4px;
  z-index: 10;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.overflow-menu:hover .overflow-items,
.overflow-menu:focus-within .overflow-items {
  display: flex;
  flex-direction: column;
}

.overflow-items a,
.overflow-items button {
  padding: 8px 12px;
  color: var(--on-surface);
  text-decoration: none;
  font-size: 0.85rem;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.overflow-items a:hover,
.overflow-items button:hover {
  background: rgba(173, 198, 255, 0.1);
  color: var(--primary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid var(--outline-variant);
  border-radius: 6px;
  background: var(--surface-container);
  color: var(--on-surface);
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.15s;
}

.pagination button:hover:not(:disabled) {
  background: var(--surface-container-high);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination .page-active {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.empty-state p {
  margin-bottom: 16px;
}

th[aria-sort="ascending"] .sort-arrow,
th[aria-sort="descending"] .sort-arrow {
  color: var(--primary);
}
```

- [ ] **Step 6: Update empty state in existing empty-state CSS**

Replace the current `.empty-state` block in `globals.css`:

```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--on-surface-variant);
}

.empty-state a,
.list-header a.button,
a.button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--primary);
  color: var(--on-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}
```

- [ ] **Step 7: Add sort, search, pagination to policy-list.tsx**

Read `src/features/policies/policy-list.tsx` first, then add:
- A search input (filter by client name)
- Sortable columns: Premium (numeric asc/desc), Status (alphabetic asc/desc), Start Date (date asc/desc)
- Pagination with same PAGE_SIZE = 10

Apply the same pattern as client-list.tsx: `useMemo` for filtered/sorted list, `useRef` debounce, `useState` for page/sortKey/sortDir. Reuse `.list-toolbar`, `.search-wrapper`, `.pagination` CSS classes.

- [ ] **Step 8: Run tests**

Run: `npx jest src/features/clients/client-list.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 9: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 10: Commit**

```bash
git add src/features/clients/client-list.tsx src/features/policies/policy-list.tsx src/app/globals.css
git commit -m "feat: add table sorting, debounced search, pagination, overflow menus, and empty states"
```

---

## Task 6: Toast Notification Component + Animations (Web)

**Files:**
- Create: `PolicyDesk-web/src/components/toast.tsx`
- Modify: `PolicyDesk-web/src/app/globals.css` (add toast + global animations)

- [ ] **Step 1: Write toast test**

Create `src/components/toast.test.tsx`:

```tsx
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, showToast } from "./toast";

describe("Toast", () => {
  it("shows and auto-dismisses", () => {
    jest.useFakeTimers();
    render(<ToastProvider />);
    act(() => { showToast("Test message"); });
    expect(screen.getByText("Test message")).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(4000); });
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});
```

- [ ] **Step 2: Implement toast component**

Create `src/components/toast.tsx`:

```tsx
"use client";

import { useState, useCallback, useRef } from "react";

type ToastType = "success" | "warning" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let _showToast: (message: string, type?: ToastType) => void = () => {};

export function showToast(message: string, type: ToastType = "success") {
  _showToast(message, type);
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  _showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" ? "✓" : t.type === "warning" ? "!" : "✕"}
          </span>
          <span className="toast-message">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Add toast CSS**

Add to `globals.css`:

```css
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  pointer-events: auto;
  animation: toastSlideIn 0.3s ease-out;
  max-width: 380px;
}

.toast-success { border-left: 4px solid var(--tertiary); }
.toast-warning { border-left: 4px solid var(--tertiary-container); }
.toast-error { border-left: 4px solid var(--error); }

.toast-icon {
  font-size: 1rem;
  font-weight: 700;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.toast-success .toast-icon { background: rgba(255, 183, 134, 0.15); color: var(--tertiary); }
.toast-warning .toast-icon { background: rgba(223, 116, 18, 0.15); color: var(--tertiary-container); }
.toast-error .toast-icon { background: rgba(255, 180, 171, 0.15); color: var(--error); }

.toast-message {
  flex: 1;
  font-size: 0.85rem;
  color: var(--on-surface);
}

.toast-close {
  background: none;
  border: none;
  color: var(--outline);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: var(--on-surface);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

- [ ] **Step 4: Add ToastProvider to root layout**

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "PolicyDesk",
  description: "Insurance payment tracking for independent agents"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Add global animations + reduced motion**

Add to `globals.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.app-main {
  animation: fadeIn 0.25s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Run tests**

Run: `npx jest src/components/toast.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 7: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add src/components/toast.tsx src/components/toast.test.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: add toast notification system and global animations with reduced-motion support"
```

---

## Task 7: Mobile — Remove Old Dashboard + API URL Config

**Files:**
- Delete: `PolicyDesk-app/src/screens/dashboard-screen.tsx`
- Create: `PolicyDesk-app/src/lib/config.ts`
- Modify: `PolicyDesk-app/src/features/dashboard/dashboard-screen.tsx`
- Modify: `PolicyDesk-app/src/screens/auth-screen.test.tsx` (if it imports from screens path)

- [ ] **Step 1: Delete old dashboard screen**

Run: `rm src/screens/dashboard-screen.tsx`

- [ ] **Step 2: Create config file**

Create `src/lib/config.ts`:

```ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "/api";
```

- [ ] **Step 3: Update reminders URL in dashboard**

Edit `src/features/dashboard/dashboard-screen.tsx`:

Import config: `import { API_BASE_URL } from "@/lib/config";`

Replace: `const res = await fetch("http://localhost:3000/api/reminders/send", {`
With: `const res = await fetch(\`\${API_BASE_URL}/reminders/send\`, {`

- [ ] **Step 4: Run tests**

Run: `npx jest --no-coverage 2>&1 | tail -10`
Expected: Tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/config.ts src/features/dashboard/dashboard-screen.tsx
git rm src/screens/dashboard-screen.tsx
git commit -m "refactor: remove unused dashboard screen, add API URL config"
```

---

## Task 8: Mobile — Dashboard Stat Cards with Icons + Deltas

**Files:**
- Modify: `PolicyDesk-app/src/features/dashboard/dashboard-screen.tsx`

- [ ] **Step 1: Update stat cards with icons and deltas**

Edit `src/features/dashboard/dashboard-screen.tsx` — update the `cards` array:

```tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Inside component:
const cards = [
  { label: "Total Clients", value: totalClients, icon: "account-group" as const, color: theme.colors.primary },
  { label: "Active Policies", value: totalPolicies, icon: "file-document" as const, color: theme.colors.secondary },
  { label: "Pending Payments", value: pendingPayments, icon: "clock-outline" as const, color: theme.colors.tertiaryContainer },
  { label: "Paid This Month", value: paidThisMonth, icon: "currency-usd" as const, color: theme.colors.tertiary },
];

// In the card rendering, add icon before value:
{cards.map((card) => (
  <Card key={card.label} style={[styles.card, { backgroundColor: theme.colors.surface, borderLeftColor: card.color }]}>
    <Card.Content>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <MaterialCommunityIcons name={card.icon} size={20} color={card.color} />
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{card.label}</Text>
      </View>
      <Text variant="headlineLarge" style={{ color: card.color, fontWeight: "700" }}>{card.value}</Text>
    </Card.Content>
  </Card>
))}
```

- [ ] **Step 2: Run tests**

Run: `npx jest --no-coverage 2>&1 | tail -10`
Expected: Tests pass

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/dashboard-screen.tsx
git commit -m "feat: add stat card icons and dashboard visual polish"
```

---

## Task 9: Mobile — Pull-to-Refresh on All Lists

**Files:**
- Modify: `PolicyDesk-app/src/features/clients/client-list-screen.tsx`
- Modify: `PolicyDesk-app/src/features/policies/policy-list-screen.tsx`
- Modify: `PolicyDesk-app/src/features/payments/payment-list-screen.tsx`

- [ ] **Step 1: Add RefreshControl to client list**

Edit `src/features/clients/client-list-screen.tsx`:

```tsx
import { RefreshControl } from "react-native";

// Add state:
const [refreshing, setRefreshing] = useState(false);

// Add handler:
async function onRefresh() {
  setRefreshing(true);
  await loadClients();
  setRefreshing(false);
}

// Wrap FlatList with RefreshControl:
<FlatList
  data={filtered}
  keyExtractor={(item) => item.id}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
  renderItem={...}
/>
```

- [ ] **Step 2: Add RefreshControl to policy-list-screen.tsx**

Add `RefreshControl` to FlatList in `src/features/policies/policy-list-screen.tsx`. Same pattern as client list: `refreshing` state + `onRefresh` handler that calls `loadPolicies()`.

- [ ] **Step 3: Add RefreshControl to payment-list-screen.tsx**

Add `RefreshControl` to FlatList in `src/features/payments/payment-list-screen.tsx`. Same pattern with `loadPayments()`.

- [ ] **Step 4: Run tests**

Run: `npx jest --no-coverage 2>&1 | tail -10`
Expected: Tests pass

- [ ] **Step 5: Commit**

```bash
git add src/features/clients/client-list-screen.tsx src/features/policies/policy-list-screen.tsx src/features/payments/payment-list-screen.tsx
git commit -m "feat: add pull-to-refresh on all list screens"
```

---

## Task 10: Mobile — Swipe Actions + Debounced Search + Date Picker + Empty States + Skeletons

**Files:**
- Modify: `PolicyDesk-app/src/features/clients/client-list-screen.tsx` (swipe, debounce, empty state)
- Modify: `PolicyDesk-app/src/features/policies/policy-form-screen.tsx` (date picker)
- Modify: `PolicyDesk-app/src/features/payments/payment-form-screen.tsx` (date picker)

- [ ] **Step 1: Add debounced search to client list**

Edit `src/features/clients/client-list-screen.tsx`:

```tsx
import { useCallback, useRef, useEffect } from "react";

const [debouncedSearch, setDebouncedSearch] = useState("");
const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

useEffect(() => {
  clearTimeout(debounceTimer.current);
  debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(debounceTimer.current);
}, [search]);

// Change: const filtered = ... to use debouncedSearch instead of search
```

- [ ] **Step 2: Add swipe actions on client list items**

Edit `src/features/clients/client-list-screen.tsx`:

```tsx
// At top:
import { Swipeable } from "react-native-gesture-handler";

// Inside renderItem, wrap List.Item:
renderItem={({ item }) => {
  const renderRightActions = () => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ClientEdit", { id: item.id })}
        style={{ backgroundColor: theme.colors.primary, justifyContent: "center", paddingHorizontal: 20 }}
      >
        <Text style={{ color: theme.colors.onPrimary, fontWeight: "600" }}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <List.Item
        title={item.name}
        ...
      />
    </Swipeable>
  );
}}
```

- [ ] **Step 3: Add date picker to policy form**

Edit `src/features/policies/policy-form-screen.tsx`:

```tsx
import DateTimePicker from "@react-native-community/datetimepicker";

const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);

// Replace TextInput-based date fields with:
<TouchableOpacity onPress={() => setShowStartPicker(true)}>
  <TextInput
    label="Start Date *"
    value={startDate}
    editable={false}
    mode="outlined"
    style={styles.input}
    right={<TextInput.Icon icon="calendar" onPress={() => setShowStartPicker(true)} />}
  />
</TouchableOpacity>

{showStartPicker && (
  <DateTimePicker
    value={startDate ? new Date(startDate) : new Date()}
    mode="date"
    onChange={(event, date) => {
      setShowStartPicker(false);
      if (date) setStartDate(date.toISOString().split("T")[0]);
    }}
  />
)}
```

- [ ] **Step 4: Apply same date picker to payment form**

Edit `src/features/payments/payment-form-screen.tsx`. Same pattern: add `DateTimePicker` for the payment date field, replace raw TextInput with a TouchableOpacity that triggers the picker, show formatted date string as the input value.

- [ ] **Step 5: Update empty states on all list screens**

Example for client list:

```tsx
// Replace bare Text with:
<View style={{ alignItems: "center", padding: 48 }}>
  <MaterialCommunityIcons name="account-search" size={64} color={theme.colors.outline} />
  <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
    {search ? "No clients match your search" : "No clients yet"}
  </Text>
  {!search && (
    <Button mode="contained" onPress={() => navigation.navigate("ClientCreate")} style={{ marginTop: 16 }}>
      Add Client
    </Button>
  )}
</View>
```

- [ ] **Step 6: Run tests**

Run: `npx jest --no-coverage 2>&1 | tail -10`
Expected: Tests pass

- [ ] **Step 7: Commit**

```bash
git add src/features/clients/client-list-screen.tsx src/features/policies/policy-form-screen.tsx src/features/payments/payment-form-screen.tsx
git commit -m "feat: add swipe actions, debounced search, date pickers, and empty state illustrations"
```

---

## Final Verification

- [ ] **Run web tests**

Run: `npm test 2>&1 | tail -20`
Expected: All 25+ tests pass

- [ ] **Run web typecheck**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: No type errors

- [ ] **Run web lint**

Run: `npm run lint 2>&1 | tail -10`
Expected: No lint errors

- [ ] **Run web build**

Run: `npm run build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Run mobile tests**

Run: `npx jest --no-coverage 2>&1 | tail -20`
Expected: All 12+ tests pass

- [ ] **Run mobile typecheck**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: No type errors

- [ ] **Push both repos**

```bash
cd PolicyDesk-web && git push origin main
cd PolicyDesk-app && git push origin main
```
