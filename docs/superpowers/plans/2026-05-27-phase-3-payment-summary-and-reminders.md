# Phase 3 — Payment Summary & WhatsApp Reminders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-client payment aggregation view and WhatsApp reminder system to both web and mobile apps.

**Architecture:** Server-side Supabase queries aggregate premium/paid/remaining per policy. A new `send-reminders.ts` module calls Meta's WhatsApp Cloud API. A Next.js API route triggers sending. Both platforms show the summary view and have a "Send Reminders" button.

**Tech Stack:** Next.js 16, Expo 56, Meta WhatsApp Cloud API, Supabase

---

### Task 1: Web — Payment summary query and type

**Files:**
- Create: `src/features/clients/client-payment.types.ts`
- Modify: `src/features/clients/client.queries.server.ts`

- [ ] **Step 1: Create payment summary types**

```typescript
// src/features/clients/client-payment.types.ts
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
```

- [ ] **Step 2: Add `fetchClientPaymentSummary` to server queries**

Add to `src/features/clients/client.queries.server.ts`:

```typescript
import { ClientPaymentSummary, PolicyPaymentSummary } from "./client-payment.types";

export async function fetchClientPaymentSummary(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  clientId: string
): Promise<ClientPaymentSummary> {
  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, policy_number, premium_amount, status, insurance_types(name)")
    .eq("client_id", clientId);

  if (error) throw error;
  if (!policies || policies.length === 0) return { totalRemaining: 0, policies: [] };

  const policyPaymentSummaries: PolicyPaymentSummary[] = [];

  for (const policy of policies) {
    const { data: payments } = await supabase
      .from("payments")
      .select("amount_due, amount_paid")
      .eq("policy_id", policy.id);

    const totalDue = (payments || []).reduce((s, p) => s + Number(p.amount_due || 0), 0);
    const totalPaid = (payments || []).reduce((s, p) => s + Number(p.amount_paid || 0), 0);

    policyPaymentSummaries.push({
      policyId: policy.id,
      policyNumber: policy.policy_number,
      insuranceTypeName: (policy.insurance_types as { name: string })?.name || "Unknown",
      premiumAmount: policy.premium_amount ? Number(policy.premium_amount) : null,
      totalDue,
      totalPaid,
      remaining: totalDue - totalPaid,
      status: policy.status,
    });
  }

  return {
    totalRemaining: policyPaymentSummaries.reduce((s, p) => s + p.remaining, 0),
    policies: policyPaymentSummaries,
  };
}
```

- [ ] **Step 3: Run tests to verify nothing broken**

```bash
npm test
```

Expected: 19 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/features/clients/client-payment.types.ts src/features/clients/client.queries.server.ts
git commit -m "feat: add payment summary query and types"
```

---

### Task 2: Web — Payment summary component

**Files:**
- Create: `src/features/clients/client-payment-summary.tsx`
- Modify: `src/app/(app)/clients/[id]/page.tsx`

- [ ] **Step 1: Write failing test for the component**

Create `src/features/clients/client-payment-summary.test.tsx`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/features/clients/client-payment-summary.test.tsx
```

Expected: FAIL with "module not found" or similar.

- [ ] **Step 3: Create the component**

```typescript
// src/features/clients/client-payment-summary.tsx
"use client";

import { ClientPaymentSummary as Summary } from "./client-payment.types";

type Props = {
  summary: Summary;
};

export function ClientPaymentSummary({ summary }: Props) {
  if (summary.policies.length === 0) {
    return <p>No payments recorded yet.</p>;
  }

  return (
    <div>
      <h2>Payment Summary</h2>
      <table className="detail-list">
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Company</th>
            <th>Premium</th>
            <th>Total Due</th>
            <th>Paid</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {summary.policies.map((p) => (
            <tr key={p.policyId}>
              <td>{p.policyNumber || "—"}</td>
              <td>{p.insuranceTypeName}</td>
              <td>${p.premiumAmount?.toFixed(2) || "—"}</td>
              <td>${p.totalDue.toFixed(2)}</td>
              <td>${p.totalPaid.toFixed(2)}</td>
              <td>${p.remaining.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total Remaining: ${summary.totalRemaining.toFixed(2)}</strong></p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/features/clients/client-payment-summary.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Wire into client detail page**

Read `src/app/(app)/clients/[id]/page.tsx` to understand the current structure, then add the payment summary section.

After the policies list and before the closing section, add:

```typescript
import { fetchClientPaymentSummary } from "@/features/clients/client.queries.server";
import { ClientPaymentSummary } from "@/features/clients/client-payment-summary";

// Inside the component, after fetching policies:
const paymentSummary = await fetchClientPaymentSummary(supabase, params.id);
```

And in the JSX, after the policies section:

```tsx
<ClientPaymentSummary summary={paymentSummary} />
```

- [ ] **Step 6: Verify typecheck + tests pass**

```bash
npm run typecheck && npm test
```

- [ ] **Step 7: Commit**

```bash
git add src/features/clients/client-payment-summary.tsx src/features/clients/client-payment-summary.test.tsx src/app/\(app\)/clients/\[id\]/page.tsx
git commit -m "feat: add payment summary component to client detail page"
```

---

### Task 3: Web — Dashboard "Send Reminders" button

**Files:**
- Modify: `src/features/dashboard/dashboard-widgets.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Add "Send Reminders" button to dashboard widgets**

Read `src/features/dashboard/dashboard-widgets.tsx` and add a button below the stat widgets:

```typescript
"use client";

import { useState } from "react";

// Inside the component, add state and handler:
const [sending, setSending] = useState(false);
const [result, setResult] = useState<string | null>(null);

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
```

And in the JSX, before the closing tag of the widget container:

```tsx
<button onClick={handleSendReminders} disabled={sending}>
  {sending ? "Sending..." : "Send Reminders"}
</button>
{result && <p>{result}</p>}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/dashboard-widgets.tsx
git commit -m "feat: add send reminders button to dashboard"
```

---

### Task 4: Web — WhatsApp sender module

**Files:**
- Create: `src/lib/reminders/send-reminders.ts`
- Create: `src/lib/env.ts` — update if needed (check if WhatsApp env vars validated)

- [ ] **Step 1: Write failing test**

Create `src/lib/reminders/send-reminders.test.ts`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { sendReminders, formatPolicyDetails, sendWhatsAppMessage } from "./send-reminders";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
          then: Promise.resolve({ data: [], error: null }),
        })),
        then: Promise.resolve({ data: [], error: null }),
      })),
    })),
  }),
}));

describe("formatPolicyDetails", () => {
  it("formats policy details into a string", () => {
    const policies = [
      { policyNumber: "POL-001", insuranceTypeName: "LIC", remaining: 10000, dueDate: "2026-06-15" },
    ];
    const result = formatPolicyDetails(policies as any);
    expect(result).toContain("POL-001");
    expect(result).toContain("LIC");
    expect(result).toContain("10,000");
  });
});

describe("sendWhatsAppMessage", () => {
  it("posts to Meta API", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ messages: [{ id: "msg1" }] }) });
    const result = await sendWhatsAppMessage("+1234567890", "Test Name", "Details");
    expect(result).toEqual({ success: true, messageId: "msg1" });
  });

  it("handles API errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 400 });
    const result = await sendWhatsAppMessage("+1234567890", "Test Name", "Details");
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Create the sender module**

```typescript
// src/lib/reminders/send-reminders.ts

const WHATSAPP_API_VERSION = "v22.0";
const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

type PolicyForReminder = {
  policyNumber: string | null;
  insuranceTypeName: string;
  remaining: number;
};

type SendResult = {
  clientId: string;
  success: boolean;
  messageId?: string;
  error?: string;
};

export function formatPolicyDetails(policies: PolicyForReminder[]): string {
  return policies
    .map((p) => `Policy #${p.policyNumber || "N/A"}\n${p.insuranceTypeName} — $${p.remaining.toFixed(2)}`)
    .join("\n\n");
}

export async function sendWhatsAppMessage(
  phone: string,
  clientName: string,
  policyDetails: string
): Promise<{ success: boolean; messageId?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return { success: false };
  }

  const res = await fetch(
    `${WHATSAPP_BASE_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "payment_reminder_detail",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: clientName },
                { type: "text", text: policyDetails },
              ],
            },
          ],
        },
      }),
    }
  );

  if (!res.ok) {
    return { success: false };
  }

  const data = await res.json();
  return { success: true, messageId: data.messages?.[0]?.id };
}

export async function sendReminders(): Promise<SendResult[]> {
  // Implemented in Task 5 (API route)
  return [];
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/reminders/send-reminders.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/reminders/send-reminders.ts src/lib/reminders/send-reminders.test.ts
git commit -m "feat: add WhatsApp message sender module"
```

---

### Task 5: Web — API route for reminders

**Files:**
- Create: `src/app/api/reminders/send/route.ts`
- Modify: `src/lib/reminders/send-reminders.ts` (complete the `sendReminders` function)

- [ ] **Step 1: Write the API route**

```typescript
// src/app/api/reminders/send/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendReminders } from "@/lib/reminders/send-reminders";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await sendReminders();
    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({ sent, failed, results });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Complete the `sendReminders` function**

Replace the stub in `src/lib/reminders/send-reminders.ts`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ... keep formatPolicyDetails and sendWhatsAppMessage as above ...

export async function sendReminders(): Promise<SendResult[]> {
  const supabase = await createServerSupabaseClient();

  // Get all clients with pending/overdue payments
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, phone");

  if (!clients) return [];

  const results: SendResult[] = [];

  for (const client of clients) {
    if (!client.phone) continue;

    // Get policies with pending payments
    const { data: policies } = await supabase
      .from("policies")
      .select("id, policy_number, insurance_types(name), premium_amount")
      .eq("client_id", client.id);

    if (!policies || policies.length === 0) continue;

    const policiesForReminder: PolicyForReminder[] = [];

    for (const policy of policies) {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount_due, amount_paid, status")
        .eq("policy_id", policy.id)
        .in("status", ["pending", "overdue"]);

      if (!payments || payments.length === 0) continue;

      const totalDue = payments.reduce((s, p) => s + Number(p.amount_due || 0), 0);
      const totalPaid = payments.reduce((s, p) => s + Number(p.amount_paid || 0), 0);
      const remaining = totalDue - totalPaid;

      if (remaining <= 0) continue;

      policiesForReminder.push({
        policyNumber: policy.policy_number,
        insuranceTypeName: (policy.insurance_types as { name: string })?.name || "Unknown",
        remaining,
      });

      // Log each payment that contributed
      for (const payment of payments) {
        await supabase.from("reminder_logs").insert({
          payment_id: payment.id,
          destination_phone: client.phone,
          template_name: "payment_reminder_detail",
          status: "pending",
        });
      }
    }

    if (policiesForReminder.length === 0) continue;

    const details = formatPolicyDetails(policiesForReminder);

    // Retry up to 3 times
    let lastError: string | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(3, attempt - 1)));
      }

      const sendResult = await sendWhatsAppMessage(client.phone, client.name, details);
      if (sendResult.success) {
        // Update reminder_logs to "sent"
        await supabase
          .from("reminder_logs")
          .update({ status: "sent", provider_message_id: sendResult.messageId, sent_at: new Date().toISOString() })
          .eq("destination_phone", client.phone)
          .eq("status", "pending");

        results.push({ clientId: client.id, success: true, messageId: sendResult.messageId });
        break;
      } else {
        lastError = "API request failed";
        if (attempt === 2) {
          // Mark as failed after last retry
          await supabase
            .from("reminder_logs")
            .update({ status: "failed", provider_response: lastError })
            .eq("destination_phone", client.phone)
            .eq("status", "pending");

          results.push({ clientId: client.id, success: false, error: lastError });
        }
      }
    }
  }

  return results;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/reminders/send/route.ts src/lib/reminders/send-reminders.ts
git commit -m "feat: add reminder API route and complete send logic"
```

---

### Task 6: Mobile — Payment summary on client detail

**Files:**
- Modify: `src/features/clients/client-detail-screen.tsx`
- Modify: `src/features/clients/client.queries.ts`
- Create: `src/features/clients/client-payment.types.ts`

- [ ] **Step 1: Add payment types to mobile**

Create `src/features/clients/client-payment.types.ts`:

```typescript
export type PolicyPaymentSummary = {
  policyNumber: string | null;
  insuranceTypeName: string;
  premiumAmount: number | null;
  totalDue: number;
  totalPaid: number;
  remaining: number;
};

export type ClientPaymentSummary = {
  totalRemaining: number;
  policies: PolicyPaymentSummary[];
};
```

- [ ] **Step 2: Add query to mobile**

Add to `src/features/clients/client.queries.ts`:

```typescript
import { createSupabaseClient } from "@/lib/supabase";
import { ClientPaymentSummary, PolicyPaymentSummary } from "./client-payment.types";

const supabase = createSupabaseClient();

export async function fetchClientPaymentSummary(clientId: string): Promise<ClientPaymentSummary> {
  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, policy_number, premium_amount, insurance_types(name)")
    .eq("client_id", clientId);

  if (error) throw error;
  if (!policies || policies.length === 0) return { totalRemaining: 0, policies: [] };

  const summaryPolicies: PolicyPaymentSummary[] = [];

  for (const policy of policies) {
    const { data: payments } = await supabase
      .from("payments")
      .select("amount_due, amount_paid")
      .eq("policy_id", policy.id);

    const totalDue = (payments || []).reduce((s, p) => s + Number(p.amount_due || 0), 0);
    const totalPaid = (payments || []).reduce((s, p) => s + Number(p.amount_paid || 0), 0);

    summaryPolicies.push({
      policyNumber: policy.policy_number,
      insuranceTypeName: (policy.insurance_types as { name: string })?.name || "Unknown",
      premiumAmount: policy.premium_amount ? Number(policy.premium_amount) : null,
      totalDue,
      totalPaid,
      remaining: totalDue - totalPaid,
    });
  }

  return {
    totalRemaining: summaryPolicies.reduce((s, p) => s + p.remaining, 0),
    policies: summaryPolicies,
  };
}
```

- [ ] **Step 3: Update client detail screen**

Read `src/features/clients/client-detail-screen.tsx` first.

Add the import:

```typescript
import { fetchClientPaymentSummary } from "./client.queries";
```

In `loadData()`, add the payment summary fetch:

```typescript
const paymentSummary = await fetchClientPaymentSummary(id);
```

Track state:

```typescript
const [paymentSummary, setPaymentSummary] = useState<ClientPaymentSummary | null>(null);
```

Add UI to render the summary after the policies section:

```tsx
{paymentSummary && paymentSummary.policies.length > 0 && (
  <>
    <Text variant="titleMedium" style={styles.sectionTitle}>Payment Summary</Text>
    {paymentSummary.policies.map((p, i) => (
      <List.Item
        key={i}
        title={`${p.insuranceTypeName} — $${p.remaining.toFixed(2)} remaining`}
        description={`Policy: ${p.policyNumber || "N/A"} | Paid: $${p.totalPaid.toFixed(2)} of $${p.totalDue.toFixed(2)}`}
      />
    ))}
    <Text style={styles.totalRemaining}>
      Total Remaining: ${paymentSummary.totalRemaining.toFixed(2)}
    </Text>
  </>
)}
```

Add to styles:

```typescript
totalRemaining: { textAlign: "center", marginTop: 16, fontWeight: "700", fontSize: 16 },
```

- [ ] **Step 4: Run mobile tests**

```bash
npm test
```

Expected: 12 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/clients/client-payment.types.ts src/features/clients/client.queries.ts src/features/clients/client-detail-screen.tsx
git commit -m "feat: add payment summary to mobile client detail"
```

---

### Task 7: Mobile — Dashboard "Send Reminders" button

**Files:**
- Modify: `src/features/dashboard/dashboard-screen.tsx`

- [ ] **Step 1: Add "Send Reminders" button to mobile dashboard**

Read `src/features/dashboard/dashboard-screen.tsx`.

Add state and handler inside the component:

```typescript
import { useState } from "react";
import { Snackbar } from "react-native-paper";

const [reminderResult, setReminderResult] = useState<string | null>(null);
const [sending, setSending] = useState(false);

async function handleSendReminders() {
  setSending(true);
  setReminderResult(null);
  try {
    const res = await fetch("http://localhost:3000/api/reminders/send", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setReminderResult(`Sent to ${data.sent}, ${data.failed} failed`);
  } catch {
    setReminderResult("Failed to send reminders");
  } finally {
    setSending(false);
  }
}
```

Add button after the sign-out button:

```tsx
<Button
  mode="contained"
  onPress={handleSendReminders}
  loading={sending}
  disabled={sending}
  style={styles.reminderBtn}
>
  Send Reminders
</Button>
<Snackbar visible={!!reminderResult} onDismiss={() => setReminderResult(null)}>
  {reminderResult}
</Snackbar>
```

Add style:

```typescript
reminderBtn: { marginTop: 16 },
```

- [ ] **Step 2: Run mobile tests + typecheck**

```bash
npm test && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/dashboard-screen.tsx
git commit -m "feat: add send reminders button to mobile dashboard"
```

---

### Task 8: Wire up env vars and final verification

**Files:**
- Modify: `.env.local` (web)

- [ ] **Step 1: Add WhatsApp env vars to web `.env.local`**

```bash
echo "" >> .env.local
echo "# WhatsApp Cloud API" >> .env.local
echo "WHATSAPP_PHONE_NUMBER_ID=" >> .env.local
echo "WHATSAPP_ACCESS_TOKEN=" >> .env.local
```

- [ ] **Step 2: Run all web checks**

```bash
npm test && npm run typecheck && npm run lint
```

Expected: 21+ tests pass, typecheck clean, lint clean.

- [ ] **Step 3: Run all mobile checks**

```bash
npm test && npm run typecheck && npm run lint
```

Expected: 12+ tests pass, typecheck clean, lint clean.

- [ ] **Step 4: Commit all remaining changes**

```bash
git add .
git commit -m "chore: add WhatsApp env vars"
```

---

## Self-Review Checklist

- **Spec coverage:** All spec requirements mapped (payment summary on both platforms ✅, WhatsApp sender ✅, API route ✅, manual trigger buttons ✅, reminder_logs ✅)
- **Placeholders:** None
- **Type consistency:** Types used consistently between web and mobile
