# PolicyDesk Web Stable Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the stable Next.js foundation for PolicyDesk web with auth screens, Supabase wiring, tests, and documentation.

**Architecture:** Use a standalone Next.js App Router project in this repository only. Keep business workflows out of the base; create focused modules for environment parsing, Supabase clients, auth UI, and protected app shell placeholders.

**Tech Stack:** Next.js, React, TypeScript, Supabase JS/Auth Helpers, Vitest, Testing Library, ESLint, npm.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `vitest.config.ts`: unit/component test configuration.
- `src/app/layout.tsx`: root app layout.
- `src/app/page.tsx`: public landing redirect/placeholder.
- `src/app/(auth)/login/page.tsx`: login route.
- `src/app/(auth)/signup/page.tsx`: signup route.
- `src/app/(app)/dashboard/page.tsx`: protected dashboard placeholder.
- `src/app/globals.css`: base styling.
- `src/components/app-shell.tsx`: authenticated shell layout component.
- `src/features/auth/auth-form.tsx`: login/signup form component.
- `src/features/auth/auth-form.test.tsx`: auth form tests.
- `src/lib/env.ts`: Supabase environment parsing.
- `src/lib/env.test.ts`: environment tests.
- `src/lib/supabase/browser.ts`: browser Supabase client factory.
- `src/lib/supabase/server.ts`: server Supabase client factory.
- `.env.example`: required environment variables.
- `docs/database-contract.md`: local database contract copied into this repo.

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create scaffold files**

Add minimal Next.js, TypeScript, Vitest, Testing Library, and lint scripts.

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Verify scaffold**

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: scaffold web app"
```

## Task 2: Environment Contract

**Files:**
- Create: `src/lib/env.test.ts`
- Create: `src/lib/env.ts`
- Create: `.env.example`

- [ ] **Step 1: Write failing env tests**

Test that missing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
produce a clear configuration error, and valid values return a typed config.

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/lib/env.test.ts`

Expected: FAIL because `src/lib/env.ts` does not exist yet.

- [ ] **Step 3: Implement env helper**

Create `getSupabaseEnv()` returning:

```ts
type SupabaseEnv = {
  url: string;
  anonKey: string;
};
```

- [ ] **Step 4: Add `.env.example`**

Include:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Run tests**

Run: `npm test -- src/lib/env.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/lib/env.ts src/lib/env.test.ts
git commit -m "chore: add web environment contract"
```

## Task 3: Supabase Client Factories

**Files:**
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Modify: `package.json`

- [ ] **Step 1: Add Supabase dependencies**

Run: `npm install @supabase/supabase-js @supabase/ssr`

- [ ] **Step 2: Implement browser client**

Use `createBrowserClient` and the validated env helper.

- [ ] **Step 3: Implement server client**

Use `createServerClient` and Next cookies. Keep this thin so auth routing can
be refined later without touching UI code.

- [ ] **Step 4: Run verification**

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/supabase
git commit -m "chore: add web supabase clients"
```

## Task 4: Auth Screens

**Files:**
- Create: `src/features/auth/auth-form.test.tsx`
- Create: `src/features/auth/auth-form.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`

- [ ] **Step 1: Write failing auth form tests**

Cover:

- login mode renders email, password, and submit controls.
- signup mode renders email, password, and submit controls.
- empty submit shows validation errors.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/features/auth/auth-form.test.tsx`

Expected: FAIL because component does not exist yet.

- [ ] **Step 3: Implement minimal auth form**

Create a client component with controlled email/password inputs and a submit
handler prepared for Supabase auth calls. The first base version may stop at
validation and UI wiring.

- [ ] **Step 4: Add route pages**

Render `AuthForm` in login and signup routes.

- [ ] **Step 5: Run tests**

Run: `npm test -- src/features/auth/auth-form.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/auth src/app/'(auth)'
git commit -m "feat: add web auth screens"
```

## Task 5: Protected App Shell

**Files:**
- Create: `src/components/app-shell.tsx`
- Create: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write a small shell test if practical**

If Testing Library setup supports it cleanly, assert that the app shell renders
navigation and dashboard content. If not, verify through typecheck and route
rendering in the dev server.

- [ ] **Step 2: Implement shell and dashboard placeholder**

Add a quiet operational dashboard placeholder. Do not add CRUD controls yet.

- [ ] **Step 3: Run verification**

Run: `npm test`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app src/components
git commit -m "feat: add web app shell"
```

## Task 6: Database Contract Documentation

**Files:**
- Create: `docs/database-contract.md`

- [ ] **Step 1: Write local contract doc**

Document the planned tables and Excel-derived fields:

- `clients`: name, phone, email, notes.
- `insurance_types`: agent-defined policy categories.
- `policies`: client, type, policy number, signing date, expiry date, premium
  amount, due date, payment frequency, status.
- `payments`: policy, amount due, amount paid, paid date, due date, status.
- future `reminder_logs`: payment, destination phone, template, status,
  provider response, sent timestamp.

- [ ] **Step 2: Commit**

```bash
git add docs/database-contract.md
git commit -m "docs: add web database contract"
```

## Task 7: Final Verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run all checks**

Run: `npm test`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 2: Start dev server**

Run: `npm run dev`

Expected: app starts locally and routes render.

- [ ] **Step 3: Commit any fixes**

Only commit if verification required changes.

- [ ] **Step 4: Pause**

Stop before CRUD, payment tracking, WhatsApp, or cron work.
