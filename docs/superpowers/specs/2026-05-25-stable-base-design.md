# PolicyDesk Web Stable Base Design

## Goal

Build a stable, testable foundation for the PolicyDesk web app before any client,
policy, payment, or WhatsApp reminder workflows are implemented.

## Repository Boundary

`PolicyDesk-web` is an independent git repository. It must not import files from
`PolicyDesk-app` or from the parent `policydesk` directory. Any shared product
contracts, such as database table names or environment variable names, are
documented locally in this repository.

Commits for web work are made from this folder only.

## Scope

Included in the stable base:

- Next.js app scaffold with TypeScript.
- Auth-facing routes for login and signup using Supabase email/password auth.
- Protected application shell with a dashboard placeholder.
- Supabase client setup for browser and server usage.
- Environment variable example for Supabase configuration.
- Unit/component test setup.
- Lint and typecheck scripts.
- Local documentation for database contracts and phase boundaries.

Not included in the stable base:

- Client CRUD.
- Insurance type CRUD.
- Policy CRUD.
- Payment status workflows.
- WhatsApp reminder sending.
- Cron jobs.
- Multi-agent support.
- Payment gateway integration.

## Architecture

The web app uses Next.js as the frontend and server boundary. Supabase provides
auth and database access. The stable base will prepare the route structure,
configuration, and tests needed for Phase 1, without implementing the Phase 1
business workflows yet.

Expected route groups:

- Public auth routes for login and signup.
- Protected app routes for authenticated agent workflows.
- A dashboard placeholder that confirms the protected shell works.

Supabase secrets remain server-side where needed. Public browser configuration
uses the Supabase project URL and anon key only.

## Data Contract

The first implementation will document, but not yet migrate, the high-level
tables from the PRD:

- `clients`
- `insurance_types`
- `policies`
- `payments`

The eventual Phase 3 WhatsApp work will add reminder logging. The design should
leave room for a future `reminder_logs` table linked to payment records.

## WhatsApp Reminder Direction

WhatsApp premium reminders are Phase 3 work. They should be implemented from a
backend boundary, not from the browser or mobile app.

Recommended future flow:

1. Vercel Cron triggers a Next.js API route or route handler.
2. The backend queries Supabase for pending or overdue premiums.
3. The backend sends approved WhatsApp Cloud API template messages.
4. Each attempt is written to reminder logs.

The WhatsApp Cloud API token must never be exposed to either frontend.

## Testing

The base should include tests for:

- Auth form rendering and validation behavior.
- Protected shell behavior at the component or route-helper level.
- Supabase environment/configuration helper behavior where practical.

No production behavior should be added without a failing test first.

## Review Checkpoint

After this base is implemented and verified, development pauses before adding
Phase 1 CRUD and payment tracking workflows.
