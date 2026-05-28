# PolicyDesk Documentation Map

**Last Updated:** May 26, 2026  
**Status:** All Phase 1.1 documentation complete and ready

---

## Core Documents (Read in This Order)

### 1. **START_HERE.md** ← Begin here!
- **Location:** `/home/neo/Projects/policydesk/START_HERE.md`
- **Purpose:** Quick orientation to what you'll do
- **Read Time:** 5 minutes
- **Contains:**
  - Which documents to read in order
  - Summary of 10 tasks
  - First steps
  - Troubleshooting

### 2. **NEXT_STEPS.md**
- **Location:** `/home/neo/Projects/policydesk/NEXT_STEPS.md`
- **Purpose:** Detailed breakdown of Phase 1.1
- **Read Time:** 15 minutes
- **Contains:**
  - What each task does
  - Time estimates
  - Environment setup
  - Task checklist
  - Expected results

### 3. **Implementation Plan**
- **Location:** `PolicyDesk-web/docs/superpowers/plans/2026-05-26-phase-1-1-crud.md`
- **Purpose:** Step-by-step instructions for all 10 tasks
- **Read/Use Time:** 4-5 hours (to execute)
- **Contains:**
  - 10 complete tasks
  - Code snippets to copy-paste
  - Commands to run
  - Verification steps
  - What to commit

---

## Reference Documents

### **PROJECT_STATUS.md** (in each repo)
- **Locations:**
  - `PolicyDesk-web/PROJECT_STATUS.md`
  - `PolicyDesk-app/PROJECT_STATUS.md`
- **Purpose:** Full project context and overview
- **Contains:**
  - What we're building and why
  - Architecture overview
  - Current status
  - Database schema
  - How to get started
  - Next steps

### **Stable Base Plan** (Already Executed)
- **Location:** `PolicyDesk-web/docs/superpowers/plans/2026-05-26-stable-base.md`
- **Purpose:** Reference for Phase 1.0 (foundation)
- **Status:** ✅ Completed

### **Stable Base Design** (Already Executed)
- **Location:** `PolicyDesk-web/docs/superpowers/specs/2026-05-25-stable-base-design.md`
- **Purpose:** Design decisions for Phase 1.0
- **Status:** ✅ Completed

---

## Code Examples to Reference

### **Pattern: Client-Side Component**
- **File:** `src/features/auth/auth-form.tsx` (101 lines)
- **Learn:** How to build form components with validation
- **Key Concepts:**
  - Controlled inputs
  - Form validation
  - Error display
  - Supabase integration

### **Pattern: Server-Side Query**
- **File:** `src/lib/supabase/server.ts` (26 lines)
- **Learn:** How to create Supabase clients
- **Key Concepts:**
  - Server components
  - Cookie handling
  - Auth session management

### **Pattern: Testing**
- **File:** `src/lib/env.test.ts` (32 lines)
- **Learn:** How to write tests with Vitest
- **Key Concepts:**
  - Test structure
  - Assertions
  - Error testing

---

## File Structure After Phase 1.1

You'll create/modify these files:

```
PolicyDesk-web/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  (NEW)
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── auth.ts             (NEW)
│   │   │   └── auth.test.ts        (NEW)
│   │   └── (existing Supabase clients)
│   ├── features/
│   │   ├── auth/
│   │   │   └── auth-form.tsx       (MODIFIED)
│   │   ├── clients/                (NEW)
│   │   ├── insurance-types/        (NEW)
│   │   ├── policies/               (NEW)
│   │   ├── payments/               (NEW)
│   │   └── dashboard/              (NEW)
│   └── app/
│       ├── middleware.ts           (NEW)
│       └── (app)/
│           ├── clients/            (NEW)
│           ├── policies/           (NEW)
│           ├── payments/           (NEW)
│           └── dashboard/          (MODIFIED)
├── .env.local                      (NEW - not committed)
└── (other existing files)
```

---

## Task Summary

| # | Task | Files | Time | Status |
|---|------|-------|------|--------|
| 1 | Supabase Migrations | supabase/migrations/ | 15m | [ ] |
| 2 | Auth Integration | src/lib/auth/ | 30m | [ ] |
| 3 | Auth Middleware | src/middleware.ts | 15m | [ ] |
| 4 | Client CRUD | src/features/clients/ | 90m | [ ] |
| 5 | Insurance Types | src/features/insurance-types/ | 30m | [ ] |
| 6 | Policy Management | src/features/policies/ | 60m | [ ] |
| 7 | Payment Tracking | src/features/payments/ | 60m | [ ] |
| 8 | Dashboard Widgets | src/features/dashboard/ | 30m | [ ] |
| 9 | Final Verification | (various) | 30m | [ ] |
| 10 | Code Review Prep | (documentation) | 15m | [ ] |

---

## How To Use This Map

1. **Starting Out?**
   - Read START_HERE.md
   - Then NEXT_STEPS.md
   - Then open the Implementation Plan

2. **Need Quick Reference?**
   - Check NEXT_STEPS.md for time estimates
   - Check PROJECT_STATUS.md for architecture overview

3. **Following the Plan?**
   - Open: `docs/superpowers/plans/2026-05-26-phase-1-1-crud.md`
   - Reference code examples above when you need patterns

4. **Stuck or Confused?**
   - Re-read the relevant section of the plan
   - Look at code examples listed above
   - Check PROJECT_STATUS.md for context

---

## Key Commands You'll Use

```bash
cd PolicyDesk-web

# Running tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Dev server
npm run dev

# Git
git status
git add .
git commit -m "message"
git log --oneline
```

---

## Success Criteria

When Phase 1.1 is complete, you'll have:

✅ 10 tasks completed  
✅ All tests passing  
✅ TypeScript strict mode passing  
✅ ESLint clean  
✅ Build succeeds  
✅ Full CRUD for clients, policies, payments  
✅ Authenticated routes working  
✅ Dashboard showing stats  
✅ Clean git history  
✅ Ready for code review  

---

## Next Steps After Phase 1.1

1. **Code Review** — Request review of all changes
2. **Phase 2** — Mobile app with same CRUD (mirror of Phase 1.1)
3. **Phase 3** — WhatsApp reminders
4. **Phase 4** — Enhancements and polish

---

## Questions?

- **Stuck on a task?** → Re-read that task in the Implementation Plan
- **Need context?** → Check PROJECT_STATUS.md
- **Looking for code pattern?** → See "Code Examples to Reference" above
- **Tests failing?** → Run `npm test` and read error messages
- **Type errors?** → Run `npm run typecheck`

---

**You're ready to begin. Open START_HERE.md and let's go! 🚀**
