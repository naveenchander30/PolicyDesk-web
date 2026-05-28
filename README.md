# PolicyDesk Web

Insurance agency management dashboard — manage clients, policies, payments, and send WhatsApp payment reminders.

Built with **Next.js 16** (App Router), **Supabase Auth**, plain CSS, and a Stitch-generated dark theme.

## Features

- **Auth** — Supabase email/password login
- **Dashboard** — Stats overview (clients, policies, payments) + Send Reminders action
- **Clients** — CRUD with search, detail view, linked policies
- **Policies** — CRUD with client + insurance-type linking, status filter
- **Insurance Types** — Read-only reference list
- **Payments** — List with pending/paid filter, mark-as-paid
- **WhatsApp Reminders** — API endpoint for sending payment reminders (requires Meta WABA setup)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Auth | Supabase (email/password) |
| Database | Supabase (PostgreSQL) |
| Styling | Plain CSS (dark theme via Stitch tokens) |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
# Install
npm install

# Environment
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Dev
npm run dev

# Test / typecheck / lint
npm test
npm run typecheck
npm run lint

# Build
npm run build
```

## Project Structure

```
src/app/             — Next.js App Router pages
  (app)/dashboard    — Dashboard page
  (app)/clients      — Client list + detail pages
  (app)/policies     — Policy list + detail pages
  (app)/insurance-types — Insurance types page
  (auth)/login       — Login page
  api/reminders      — WhatsApp reminder API route
src/components/      — Shared components (app-shell, auth-form)
src/features/        — Feature modules (clients, policies, dashboard, auth)
src/lib/             — Supabase client, reminder logic, DB queries
docs/superpowers/    — Design specs and implementation plans
```

## Dark Theme

All tokens defined in `src/app/globals.css` as CSS custom properties. Colors from the Stitch "PolicyDesk Insurance Manager" dark variant: background `#0b1326`, surface `#171f33`, primary `#adc6ff`, tertiary `#ffb786`.
