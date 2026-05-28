# Phase 3 — Client Payment Summary & WhatsApp Reminders

**Date:** 2026-05-27  
**Status:** Approved for implementation  
**Applies to:** PolicyDesk-web (Next.js) + PolicyDesk-app (Expo/React Native)

---

## 1. Overview

Two related features that complete the payment tracking loop:

1. **Client Payment Summary** — aggregate view of what each client owes across all their policies, showing premium, paid, and remaining per policy
2. **WhatsApp Reminders** — automated monthly messages via Meta's WhatsApp Cloud API to clients with outstanding balances, with a manual trigger button on both platforms

---

## 2. Client Payment Summary

### What it shows

On the **client detail page** (both web and mobile), after the existing policies list, add a "Payment Summary" section per policy:

| Policy # | Company | Premium | Paid | Remaining | Status |
|----------|---------|---------|------|-----------|--------|
| POL-001 | LIC | ₹15,000 | ₹5,000 | ₹10,000 | Overdue |
| POL-042 | ICICI | ₹30,000 | ₹30,000 | ₹0 | Active |

Plus a **total row** at the bottom showing aggregate remaining across all policies.

### Data flow

New query: `fetchClientPaymentSummary(clientId)` — server-side only (web uses `.server.ts`, mobile queries the same pattern).

Query logic:
1. Fetch all policies for the client (with insurance type name)
2. For each policy, fetch sum of `amount_due` vs `amount_paid` from payments table
3. Compute remaining per policy + total

### Web UI changes

- **`/clients/[id]/page.tsx`** — add a "Payment Summary" section below policies
- New component: `PaymentSummaryCard` showing the table
- Use existing `detail-list` CSS pattern

### Mobile UI changes

- **`client-detail-screen.tsx`** — add a summary card below the policies list
- Use React Native Paper `Card` + `DataTable` or styled `View` rows
- Show per-policy breakdown + total at bottom

---

## 3. WhatsApp Reminder System

### Configuration

Add to `.env.local` (web) / `.env` (mobile — only web sends, mobile just triggers):

```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_long_lived_token
```

### Template

Meta-approved template: `payment_reminder_detail`

```
Hi {{1}}, your outstanding premiums:

{{2}}

Please arrange payment to keep your coverage active.
- PolicyDesk
```

Where `{{1}}` = client name, `{{2}}` = multi-line string of policies.

Format for `{{2}}`:
```
Policy #POL-001
LIC — ₹15,000 due Jun 15

Policy #POL-042
ICICI — ₹30,000 due Jul 1
```

### Backend

New file: `src/lib/reminders/send-reminders.ts`

```typescript
async function sendReminders(): Promise<SendResult[]>
```

Logic:
1. Query all clients who have at least one payment with status `pending` or `overdue`
2. For each client, group pending payments by policy
3. Format the detail string
4. Skip clients without a phone number
5. POST to Meta API for each client
6. Log result in `reminder_logs` table
7. Return array of `{ clientId, success, error? }`

### Trigger mechanisms

**A. Manual button** — on web dashboard + mobile dashboard:
- Button: "Send Reminders"
- On press: calls a Next.js API route `/api/reminders/send` that runs `sendReminders()`
- Shows brief loading state, then result summary ("Sent to N clients, X failed")

**B. Automatic cron** (future, not part of this phase):
- Can be added later via Vercel Cron Jobs or GitHub Actions hitting the same API route

### API route

New file: `src/app/api/reminders/send/route.ts`

- `POST` handler
- No auth required beyond existing session (caller must be logged in)
- Calls `sendReminders()`
- Returns JSON `{ sent, failed, results }`

### Error handling

- Retry failed sends up to 3 times (exponential backoff: 1s, 3s, 9s)
- Each attempt logged in `reminder_logs` with status, error message, full API response
- App shows count of failed sends so admin can investigate

### Mobile trigger

- Add "Send Reminders" button to mobile dashboard screen
- Calls the web API route (mobile hits `https://yourdomain.com/api/reminders/send`)
- Shows Snackbar with result
- Note: mobile triggers the web API — it does not send WhatsApp messages directly

---

## 4. Reminder Logs Table

Already exists in schema. Verification query:
```sql
SELECT * FROM reminder_logs;
```

Columns used:
- `payment_id` — the specific payment that triggered this reminder
- `destination_phone` — client phone number
- `template_name` — always "payment_reminder_detail"
- `status` — "sent" or "failed"
- `provider_message_id` — Meta's message ID on success
- `provider_response` — full JSON response body
- `sent_at` — auto-set timestamp

---

## 5. Future (Not In This Phase)

- **Cron-based auto-reminder** on last day of each month
- **Interactive dashboard** with agent workflow metrics (collection rates, top overdue clients, monthly trends)
- **Dashboard drill-down** — click a stat to see the underlying list
- **UI design pass** — custom theme following templates the user shares later
