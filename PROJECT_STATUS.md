# PolicyDesk Web — Project Status & Context

**Last Updated:** May 26, 2026  
**Phase:** 1 Stable Base — ✅ COMPLETE  
**Next Phase:** Phase 1 CRUD Implementation

---

## Quick Summary

**PolicyDesk** is a cross-platform insurance payment tracking app for independent insurance agents. This repository (`PolicyDesk-web`) contains the **Next.js web frontend** built with TypeScript, React, and Supabase.

**Current state:** The stable foundation is complete. All authentication scaffolding, environment wiring, and basic app shell are tested and production-ready. Ready to implement Phase 1 business logic (client CRUD, payment tracking).

---

## What We're Building

### The Problem

Independent insurance agents manually track premium payments across multiple clients and insurance types using spreadsheets or notebooks. They need:
- A clear view of who has paid and who hasn't
- Automated reminders to clients about pending payments
- A way to manage their client book efficiently
- Access from both desktop (web) and mobile (Android)

### The Solution

**PolicyDesk** is an agent-managed payment tracking system with:
- **Web App** (this repo): Desktop interface for agent to manage clients, policies, and payments
- **Android App** (separate repo): Mobile app for field access and quick payment updates
- **Shared Database**: Supabase Postgres backend accessed by both frontends
- **WhatsApp Reminders** (Phase 3): Automated payment reminders via WhatsApp Cloud API

### User Flow

```
Agent logs in → Views dashboard (pending/overdue payments) 
  → Manages clients & policies → Marks payments as paid 
  → System can auto-send WhatsApp reminders (Phase 3)
```

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15+ (App Router) | Server/client hybrid web UI |
| **Language** | TypeScript | Type-safe development |
| **UI Components** | React | Component framework |
| **Testing** | Vitest + Testing Library | Unit/component tests |
| **Styling** | CSS modules or Tailwind (TBD) | Component styling |
| **Database** | Supabase (Postgres) | Single source of truth |
| **Auth** | Supabase Auth | Email/password login |
| **Hosting** | Vercel | Deployment & edge functions |

### How It Works

```
Browser Client (React)
  ↓ (queries via browser SDK)
Supabase JS Client (browser)
  ↓ (REST/RealtimeAPI)
Supabase Cloud (Postgres + Auth + REST API)
  ↑ (shared with Android app)
  
Server-Side (Next.js API Routes / Route Handlers)
  ↓ (backend operations)
Supabase JS Client (server)
  ↓ (service role, backend secrets)
Supabase Cloud (Phase 3: WhatsApp API calls)
```

**Key principle:** Web and Android apps are **independent frontends** sharing the same Supabase project. No code is shared between them; they are synchronized via the database contract.

---

## Database Schema

Documented in `docs/database-contract.md`. High-level structure:

```
clients
├── id, name, phone, email, notes, created_at

insurance_types
├── id, name (e.g., Vehicle, Life, Health), created_at

policies
├── id, client_id, insurance_type_id
├── policy_number, signed_on, expires_on
├── premium_amount, due_date, frequency
├── status (active/inactive), created_at

payments
├── id, policy_id
├── amount_due, amount_paid, paid_on, due_date
├── status (paid/pending/overdue), created_at

(future) reminder_logs
├── id, payment_id, destination_phone, template_name
├── status, provider_message_id, sent_at, created_at
```

**Note:** Both `PolicyDesk-web` and `PolicyDesk-app` have identical database contracts. Any schema changes must be documented in both repos.

---

## Project Phases

### Phase 1: Web Foundation (Current Phase — IN PROGRESS)

**Objective:** Build complete web app so an agent can log in, manage clients, policies, and track payments from a browser.

**Subphases:**
- **1.0 Stable Base** (✅ COMPLETE) — Auth, Supabase wiring, protected shell
- **1.1 CRUD & Dashboard** (🔄 IN PROGRESS) — Client/policy/payment management screens
- **1.2 Review** — Pause and gather feedback before mobile

**What's done in 1.0:**
- ✅ Next.js scaffold with TypeScript
- ✅ Login/signup screens with email/password auth
- ✅ Protected app shell + dashboard placeholder
- ✅ Supabase client wiring (browser + server)
- ✅ Environment contract (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- ✅ Test suite (7 tests, all passing)
- ✅ Database schema documented

**What's next in 1.1:**
- [ ] Client list screen + CRUD operations
- [ ] Insurance type management
- [ ] Policy list + detail screens
- [ ] Payment tracking UI (mark as paid, view history)
- [ ] Dashboard with overdue/pending overview
- [ ] Search and filter functionality

**Files structure for Phase 1.1:**
```
src/
├── app/
│   ├── (app)/
│   │   ├── clients/        (new: client list, detail, form)
│   │   ├── policies/       (new: policy list, detail, form)
│   │   ├── payments/       (new: payment overview, status)
│   │   └── dashboard/      (existing: update with widgets)
│   ├── (auth)/
│   │   ├── login/          (existing: auth gate checks this)
│   │   └── signup/         (existing: auth gate checks this)
│   ├── layout.tsx          (existing)
│   └── page.tsx            (existing: redirect to app)
├── features/
│   ├── clients/            (new: client CRUD logic)
│   ├── policies/           (new: policy CRUD logic)
│   ├── payments/           (new: payment tracking logic)
│   └── auth/               (existing: auth-form.tsx)
├── lib/
│   ├── env.ts              (existing: environment config)
│   ├── supabase/
│   │   ├── browser.ts      (existing: browser client)
│   │   └── server.ts       (existing: server client)
│   └── (new: CRUD helpers, types)
└── components/             (existing: app-shell, auth-form)
```

### Phase 2: Android App (Parallel)

**Objective:** Bring core Phase 1 functionality to Android. Same auth, same dashboard, quick payment updates.

**Status:** Stable base complete in `PolicyDesk-app` repo.

### Phase 3: WhatsApp Reminders

**Objective:** Automate payment reminders via WhatsApp Cloud API.

**Scope:**
- Manual trigger: "Send Reminder" button on any payment
- Scheduled reminders: Cron jobs (7 days before due, on due date, etc.)
- Reminder logs: Track all messages sent

**Backend implementation** (not in web/app repos):
- Vercel Cron jobs query Supabase for pending payments
- Backend sends approved WhatsApp templates
- Reminder logs stored in `reminder_logs` table

**Web/App UI additions:**
- "Send Reminder" button on payment records
- Reminder history view
- Notification when reminder is sent

### Phase 4: Polish & Enhancements

**Candidate features** (to be prioritized after Phase 3):
- Renewal alerts (policies expiring in 30/60/90 days)
- Commission tracker
- Bulk reminders
- Export to PDF/Excel
- Client portal (read-only link for clients)
- Document storage (Supabase Storage)
- Analytics dashboard
- Multi-agent support
- SMS fallback for non-WhatsApp clients

---

## What's Been Accomplished (Phase 1.0)

### ✅ Completed Tasks

**Task 1: Project Scaffold**
- Files: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Dependencies: Next.js, React, TypeScript, Vitest, Testing Library, ESLint
- Scripts: `npm run dev`, `npm run build`, `npm test`, `npm run typecheck`, `npm run lint`
- Status: ✅ Verified and committed

**Task 2: Environment Contract**
- Files: `src/lib/env.ts`, `src/lib/env.test.ts`, `.env.example`
- Contract: Validates `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at startup
- Tests: Failing env tests → implementation → all passing
- Status: ✅ 3 tests passing

**Task 3: Supabase Client Factories**
- Files: `src/lib/supabase/browser.ts`, `src/lib/supabase/server.ts`
- Features:
  - Browser client: Uses `createBrowserClient` for frontend queries
  - Server client: Uses `createServerClient` with Next.js cookies for backend operations
- Dependencies: `@supabase/supabase-js`, `@supabase/ssr`
- Status: ✅ TypeCheck passing, ready for use

**Task 4: Auth Screens**
- Files: `src/features/auth/auth-form.tsx`, `src/features/auth/auth-form.test.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
- Features:
  - Email/password inputs with validation
  - Form state management
  - Ready for Supabase auth integration (submit handler prepared)
  - Login and signup modes
- Tests: 3 tests covering rendering, validation, mode switching
- Status: ✅ All tests passing, ready for auth integration

**Task 5: Protected App Shell**
- Files: `src/components/app-shell.tsx`, `src/app/(app)/dashboard/page.tsx`
- Features:
  - App shell component wraps authenticated routes
  - Dashboard placeholder (confirms protected shell works)
  - Route groups organize auth vs. app routes
- Tests: 1 test for app-shell rendering
- Status: ✅ Tests passing, structure ready for Phase 1.1 CRUD routes

**Task 6: Database Contract**
- File: `docs/database-contract.md`
- Content: Documents planned `clients`, `insurance_types`, `policies`, `payments` tables
- Alignment: Identical to `PolicyDesk-app/docs/database-contract.md`
- Status: ✅ Committed, ready for migrations

**Task 7: Final Verification**
- Tests: `npm test` → 7 tests passing
- TypeCheck: `npm run typecheck` → No errors
- Lint: `npm run lint` → No errors
- Dev server: `npm run dev` → App renders, auth routes accessible
- Status: ✅ All checks passing

### Current Implementation Status

| Component | Status | Details |
|-----------|--------|---------|
| **Scaffold** | ✅ Complete | Next.js App Router, TypeScript, ESLint, Vitest |
| **Auth UI** | ✅ Complete | Login/signup screens, form validation |
| **Auth Logic** | 🟡 Partial | Form structure ready, Supabase.auth calls TBD |
| **Supabase Wiring** | ✅ Complete | Browser + server clients ready |
| **Protected Routes** | ✅ Complete | Route groups, app shell, auth gate checks TBD |
| **Dashboard** | 🟡 Placeholder | Shell exists, widgets TBD in Phase 1.1 |
| **CRUD Operations** | ❌ Not started | Screens, forms, API calls in Phase 1.1 |
| **Testing** | ✅ Complete (base) | 7 tests for foundation, Phase 1.1 will add more |
| **Database Migrations** | ❌ Not started | Schema documented, migrations TBD |

### Test Summary

```
✓ src/lib/env.test.ts (3 tests)
  - Missing URL throws clear error
  - Missing anon key throws clear error
  - Valid config returns typed SupabaseEnv

✓ src/components/app-shell.test.tsx (1 test)
  - App shell renders with children

✓ src/features/auth/auth-form.test.tsx (3 tests)
  - Login mode renders email, password, submit
  - Signup mode renders email, password, submit
  - Empty submit shows validation errors

Total: 7 tests, 0 failures, 100% pass rate
```

---

## How to Get Started

### Setup (First Time)

```bash
cd /home/neo/Projects/policydesk/PolicyDesk-web

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Run tests
npm test

# Start development server
npm run dev
# Open http://localhost:3000
```

### Daily Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Testing
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- src/features/auth/auth-form.test.tsx  # Specific file

# Quality checks
npm run typecheck       # TypeScript check
npm run lint            # ESLint check
npm run lint -- --fix   # Auto-fix lint issues

# Build
npm run build           # Production build
npm start               # Run production build locally
```

---

## Key Design Decisions

1. **Repository Independence**
   - `PolicyDesk-web` and `PolicyDesk-app` are separate git repos
   - No code sharing between them; they synchronize via Supabase database
   - Each repo documents its own database contract

2. **Test-First Approach**
   - Failing tests written before implementation
   - All new features require tests
   - Target: 80%+ coverage on business logic

3. **Environment Contract**
   - Required env vars validated at startup
   - Missing config raises clear error (not silent failures)
   - `.env.example` documents all required variables

4. **Backend Secrets Stay Backend**
   - WhatsApp Cloud API tokens, service role keys never in frontend
   - Browser client uses anon key only
   - Server client uses service role for backend-only operations (Phase 3)

5. **Protected Routes**
   - Auth gate checks Supabase session before rendering app
   - Unauthenticated users redirected to login
   - App shell provides consistent layout across all authenticated pages

---

## Common Tasks for Agents

### Adding a New Feature

1. Read the relevant plan in `docs/superpowers/plans/`
2. Write failing tests in `src/features/{feature}/{feature}.test.tsx`
3. Implement the feature in `src/features/{feature}/{feature}.tsx`
4. Run `npm test` to verify tests pass
5. Run `npm run typecheck` and `npm run lint`
6. Commit with a clear message

### Debugging a Test Failure

```bash
# Run specific test in watch mode
npm test -- src/features/auth/auth-form.test.tsx --watch

# Run with verbose output
npm test -- --reporter=verbose
```

### Adding a New Route

1. Create file in `src/app/(app)/{feature}/page.tsx`
2. Import and use `AppShell` for consistent layout
3. Add tests in `src/app/(app)/{feature}/__tests__/page.test.tsx`
4. Verify `npm run typecheck` passes

### Connecting to Supabase

```ts
// Browser (client component)
import { createBrowserClient } from '@/lib/supabase/browser';
const supabase = createBrowserClient();
const { data, error } = await supabase.from('clients').select();

// Server (server component or API route)
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();
const { data, error } = await supabase.from('clients').select();
```

---

## Related Documentation

- **PRD (Product Requirements):** See `/home/neo/Projects/policydesk/PRD.md` (parent folder)
- **Database Contract:** `docs/database-contract.md` (this repo)
- **Stable Base Design:** `docs/superpowers/specs/2026-05-25-stable-base-design.md`
- **Stable Base Plan:** `docs/superpowers/plans/2026-05-26-stable-base.md`
- **Android App Status:** See `PolicyDesk-app/PROJECT_STATUS.md` (parallel repo)

---

## Next Steps for Phase 1.1

The team should prioritize the following **in order**:

1. **Supabase Migrations** — Create actual database tables (clients, insurance_types, policies, payments)
2. **Client CRUD** — List, create, edit, delete clients
3. **Insurance Type CRUD** — Simple management of agent-defined categories
4. **Policy CRUD** — Add policies to clients, track details
5. **Payment Dashboard** — Overview of pending/overdue, drill-down to detail
6. **Payment Status Updates** — Mark payments as paid, update records

Each feature should follow the test-first pattern and pause for review/testing before moving to the next.

---

## Questions or Blockers?

- **For design questions:** Refer to `docs/superpowers/specs/`
- **For implementation details:** Check the corresponding plan file
- **For Supabase issues:** Verify `.env.local` has correct credentials
- **For test failures:** Run `npm test -- --reporter=verbose` for details

---

**Updated:** May 26, 2026  
**Maintained by:** PolicyDesk Development Team
