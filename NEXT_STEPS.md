# What You Need To Do Next — Phase 1.1 Web CRUD Implementation

**Status:** Ready to begin  
**Estimated Duration:** 3-5 days of focused development  
**Current Phase:** 1.0 Stable Base (✅ COMPLETE) → 1.1 CRUD (🔄 STARTING NOW)

---

## The Immediate Next Steps (In Order)

You have just one comprehensive implementation plan: **`docs/superpowers/plans/2026-05-26-phase-1-1-crud.md`**

This plan is ready to execute right now. It has 10 major tasks, each with step-by-step instructions.

---

## Task 1: Supabase Migrations ← **START HERE**

### What This Does
Creates the actual database tables in Supabase. Without this, login/signup will fail because there's nowhere for CRUD to write data.

### Exact Steps (Copy-Paste Ready)

**Step 1.1: Set up Supabase Project**

If you don't have a Supabase account:
1. Go to https://supabase.com
2. Click "Sign up"
3. Create new project (any region, any name)
4. Wait for project to be ready

**Step 1.2: Get Credentials**

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy `Project URL` and `anon public key`
4. Create `.env.local` in `PolicyDesk-web/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (long string)
```

5. Save and verify:
```bash
cd PolicyDesk-web
npm run typecheck
# Should pass without errors about missing env
```

**Step 1.3: Create Database Schema**

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste this entire SQL block:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- insurance_types table
CREATE TABLE IF NOT EXISTS insurance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- policies table
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  insurance_type_id UUID NOT NULL REFERENCES insurance_types(id),
  policy_number TEXT,
  signed_on DATE,
  expires_on DATE,
  premium_amount DECIMAL(10,2),
  due_date DATE,
  frequency TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now()
);

-- payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  amount_due DECIMAL(10,2),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  paid_on DATE,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- reminder_logs table (for Phase 3)
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  destination_phone TEXT,
  template_name TEXT,
  status TEXT,
  provider_message_id TEXT,
  provider_response TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_clients_created ON clients(created_at);
CREATE INDEX idx_policies_client ON policies(client_id);
CREATE INDEX idx_policies_type ON policies(insurance_type_id);
CREATE INDEX idx_payments_policy ON payments(policy_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reminder_logs_payment ON reminder_logs(payment_id);
```

4. Click "Run"
5. You should see success message

**Step 1.4: Verify Tables Exist**

1. In SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

2. You should see listed:
   - clients
   - insurance_types
   - payments
   - policies
   - reminder_logs

**Step 1.5: Commit**

```bash
cd PolicyDesk-web
git add .env.example
git commit -m "chore: setup supabase environment variables"
```

### Expected Result
- ✅ `.env.local` file exists with valid Supabase credentials
- ✅ All 5 tables created in Supabase
- ✅ All indexes created
- ✅ `npm run typecheck` still passes
- ✅ Commit is clean

### What To Do If Something Goes Wrong

**Problem:** "Error: permission denied"
**Solution:** Make sure you're logged into Supabase with correct project selected

**Problem:** "Error: relation already exists"
**Solution:** Tables already exist (from a previous run). That's fine, skip this step and move to Task 2.

**Problem:** `npm run typecheck` fails after adding `.env.local`
**Solution:** Check that env variable names are exactly correct:
- `NEXT_PUBLIC_SUPABASE_URL` (not `URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `ANON_KEY`)

---

## Task 2: Supabase Auth Integration

### What This Does
Wires the login/signup forms to actually call Supabase auth. Right now the forms just validate locally; this makes them actually create accounts.

### How It Works
1. User fills email + password in form
2. Form validates locally (email format, password length)
3. Form calls `supabase.auth.signUp()` or `supabase.auth.signInWithPassword()`
4. If success → redirects to `/dashboard`
5. If error → shows error message

### Exact Next Action
Open the plan file and follow **Task 2: Supabase Auth Integration**:

```bash
cd PolicyDesk-web
cat docs/superpowers/plans/2026-05-26-phase-1-1-crud.md | grep -A 200 "## Task 2"
```

The plan has 8 exact steps with code to copy-paste.

### Expected Result After Task 2
- ✅ You can sign up a new account at `/signup`
- ✅ You can log in at `/login`
- ✅ After login, you're redirected to `/dashboard`
- ✅ Account is created in Supabase Auth
- ✅ All tests still pass

---

## Task 3: Auth Middleware & Protected Routes

### What This Does
Automatically redirects unauthenticated users to login. Without this, you could type `/dashboard` and see the dashboard even without logging in.

### Expected Result
- ✅ Unauthenticated users cannot access `/dashboard`
- ✅ Unauthenticated users are redirected to `/login`
- ✅ Authenticated users can access protected routes

---

## Task 4-8: CRUD Operations (Clients, Insurance Types, Policies, Payments, Dashboard)

### Overview
These 5 tasks follow the same pattern:

1. **Define types** — TypeScript interfaces for the data
2. **Write tests** — Tests for database queries
3. **Implement queries** — Functions to fetch/create/update/delete from Supabase
4. **Create components** — React components to display data
5. **Create pages** — Next.js routes to render components
6. **Test in browser** — Verify end-to-end functionality
7. **Commit** — Git commit with clear message

### Order (Do Them In This Sequence)

**Task 4: Clients**
- List all clients
- View single client
- Create client
- Edit client
- Delete client

**Task 5: Insurance Types**
- Same CRUD pattern
- Smaller scope (only name field)

**Task 6: Policies**
- Create policy (links client + insurance type)
- View policies for client
- Edit policy details

**Task 7: Payments**
- View payments for policy
- Mark payment as paid
- Track payment status

**Task 8: Dashboard**
- Show count of pending payments
- Show count of overdue payments
- Show count of paid payments
- Add quick links to clients, policies, payments

---

## Task 9: Final Verification

### What To Run
```bash
cd PolicyDesk-web

# 1. All tests pass
npm test

# 2. No TypeScript errors
npm run typecheck

# 3. No lint errors
npm run lint

# 4. Build succeeds
npm run build

# 5. Dev server starts
npm run dev
```

All should pass with no errors.

---

## Task 10: Code Review Prep

- Verify clean git history
- Write summary of all changes
- Confirm tests pass one more time
- Commit everything

---

## How To Actually Execute This

### Option 1: Follow The Plan Manually (Recommended First Time)

```bash
cd PolicyDesk-web

# Read the plan
cat docs/superpowers/plans/2026-05-26-phase-1-1-crud.md

# Follow each task in order
# Copy-paste code snippets provided
# Run tests after each task
# Commit after each task passes
```

### Option 2: Use Subagent for Parallel Tasks (Faster)

If you want faster execution with parallel work:

Use OpenCode's subagent system to have agents work on tasks 4-8 in parallel while you supervise.

---

## The Complete Checklist

Print this out or keep it open in another window:

```
Task 1: Supabase Migrations
  [ ] Create Supabase project
  [ ] Get credentials
  [ ] Create .env.local
  [ ] Run SQL migrations
  [ ] Verify tables exist
  [ ] Commit

Task 2: Supabase Auth Integration
  [ ] Create auth helper functions
  [ ] Write and run auth tests
  [ ] Update auth form with Supabase calls
  [ ] Update auth form tests
  [ ] Test signup in browser
  [ ] Test login in browser
  [ ] Commit

Task 3: Auth Middleware
  [ ] Create src/middleware.ts
  [ ] Update (app) layout.tsx
  [ ] Test that unauthenticated users redirect to login
  [ ] Commit

Task 4: Client CRUD
  [ ] Create client.types.ts
  [ ] Create client.queries.ts with CRUD functions
  [ ] Create client-list.tsx component
  [ ] Create /clients page
  [ ] Create /clients/[id] page (view)
  [ ] Create /clients/[id]/edit page
  [ ] Create /clients/new page (create)
  [ ] Test all CRUD operations in browser
  [ ] Commit

Task 5: Insurance Type Management
  [ ] (Same pattern as Task 4)
  [ ] Create, list, edit, delete insurance types
  [ ] Commit

Task 6: Policy Management
  [ ] (Same pattern as Task 4)
  [ ] Link policies to clients and insurance types
  [ ] Show policy list for each client
  [ ] Commit

Task 7: Payment Tracking
  [ ] (Same pattern as Task 4)
  [ ] List payments for each policy
  [ ] Mark payment as paid (update status)
  [ ] Track payment status (paid/pending/overdue)
  [ ] Commit

Task 8: Dashboard Widgets
  [ ] Fetch dashboard stats from Supabase
  [ ] Create dashboard widgets component
  [ ] Update dashboard page to show widgets
  [ ] Commit

Task 9: Final Verification
  [ ] npm test → all pass
  [ ] npm run typecheck → no errors
  [ ] npm run lint → no errors
  [ ] npm run build → builds successfully
  [ ] npm run dev → app works end-to-end
  [ ] Test full user flow (signup → create client → add policy → mark payment)

Task 10: Code Review Prep
  [ ] Review git log
  [ ] Verify working tree clean
  [ ] Create summary document
  [ ] Ready for code review
```

---

## Right Now: What You Should Do

1. **Open the plan file:**
   ```bash
   cd PolicyDesk-web
   cat docs/superpowers/plans/2026-05-26-phase-1-1-crud.md
   ```

2. **Start Task 1 (Supabase Migrations)** — Follow the exact steps in the plan

3. **After Task 1 is done:** Run tests to make sure nothing broke
   ```bash
   npm test
   npm run typecheck
   ```

4. **Move to Task 2:** Follow the same pattern

5. **Commit after each successful task:**
   ```bash
   git add .
   git commit -m "feat: [description of what you just did]"
   ```

---

## Time Estimate

- **Task 1 (Migrations):** 15 minutes
- **Task 2 (Auth):** 30 minutes
- **Task 3 (Middleware):** 15 minutes
- **Task 4 (Client CRUD):** 60-90 minutes
- **Task 5 (Insurance Types):** 30 minutes (similar to Task 4)
- **Task 6 (Policies):** 60 minutes
- **Task 7 (Payments):** 60 minutes
- **Task 8 (Dashboard):** 30 minutes
- **Task 9 (Verification):** 30 minutes
- **Task 10 (Code Review Prep):** 15 minutes

**Total: 4-5 hours of focused work**

Or split across 2-3 days doing 1-2 tasks per day.

---

## Questions To Ask Yourself As You Work

- [ ] Do I understand why each file is being created?
- [ ] Are my tests passing after each step?
- [ ] Can I see the changes in the browser?
- [ ] Is my code type-safe (no `any` types)?
- [ ] Have I committed after each major step?
- [ ] Would another developer understand my code from reading it?

---

## When You're Stuck

1. Check if tests are passing:
   ```bash
   npm test
   ```

2. Check TypeScript errors:
   ```bash
   npm run typecheck
   ```

3. Look at similar code in the stable base (e.g., auth-form.tsx)

4. Re-read the plan step — it might have the answer

5. Check Supabase documentation: https://supabase.com/docs

---

**You're ready to go. Start with Task 1!**
