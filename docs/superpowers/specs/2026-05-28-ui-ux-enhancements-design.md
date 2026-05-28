# PolicyDesk UI/UX Enhancement Design

Date: 2026-05-28
Status: Draft

## Overview

Full visual and interaction overhaul of PolicyDesk web and mobile apps. Six sections covering landing page, auth, dashboard, tables, mobile-specific upgrades, and animations/micro-interactions.

### Constraints
- Web: Next.js 16 App Router, plain CSS (no Tailwind), dark theme with Stitch tokens
- Mobile: Expo 56, React Native Paper MD3 with custom dark theme
- Both apps already have Stitch-based dark theme applied — this work layers on top

---

## Section 1: Landing Page Redesign

**File:** `PolicyDesk-web/src/app/page.tsx` + `globals.css`

- Full viewport hero with gradient background (`linear-gradient(135deg, #0b1326 0%, #060e20 50%, #0a0e1a 100%)`)
- Left side: brand wordmark + shield icon, tagline H1, supporting text, two CTAs
- Right side: CSS-drawn abstract illustration — stacked rounded rectangles in varying opacities (hinting at stat cards) + a grid pattern (hinting at tables) + a curved line (hinting at a chart). Fixed position, non-interactive.
- Bottom: subtle gradient fade to surface color, scroll-down indicator
- Footer: minimal line "Built for independent insurance agents"

---

## Section 2: Login & Auth Improvements

**File:** `PolicyDesk-web/src/features/auth/auth-form.tsx` + `globals.css`

- Add "Forgot password?" link below password field (right-aligned, primary color)
- Add "Don't have an account? Contact your agency admin" note below form
- Real-time field validation on blur (red border if empty after touch, green if valid)
- Loading spinner inside button + disabled state during submit
- Success: brief checkmark animation on button before redirect
- Error: inline message above form fields + field-level highlighting
- URL-based redirect: after login, go to the original requested page

---

## Section 3: Dashboard & Data Visualization

**File:** `PolicyDesk-web/src/features/dashboard/dashboard-widgets.tsx` + `globals.css`
**Mobile:** `PolicyDesk-app/src/features/dashboard/dashboard-screen.tsx`

- Each stat card gets an icon (people/document/clock/dollar), subtle background gradient, value in bold, label
- Tiny green delta indicator on each card: "↑ 12% since last month"
- Cards animate in with staggered fade-up on mount (100ms delay between each, 600ms total)
- "Recent Activity" section: 5 most recent payments fetched from existing payment queries (server component), showing client name, policy type, amount, status badge, relative time
- "Quick Actions" row: horizontal chips with icons: "Add Client", "Record Payment", "View All Policies"
- Reminder card shrinks and moves inline with quick actions

---

## Section 4: Tables & Lists

**Files:** `PolicyDesk-web/src/features/clients/client-list.tsx`, `PolicyDesk-web/src/features/policies/policy-list.tsx`, `PolicyDesk-web/src/features/payments/payment-list.tsx` + `globals.css`

- Column sorting: clickable headers with ▲/▼ sort indicator, toggle asc/desc
- Row hover: add subtle left-border highlight matching row status color
- Inline overflow menu (⋯) with "View", "Edit", "Delete" actions
- Debounced search (300ms) with clear button, "Showing X of Y" count
- Pagination bar: rows-per-page dropdown + page numbers + prev/next
- Empty states: illustration + descriptive text + CTA button
- Status badges: add small left color dot before text

---

## Section 5: Mobile-Specific Upgrades

**Files:** Multiple mobile screen files

- Remove old unused `src/screens/dashboard-screen.tsx`
- Pull-to-refresh (`RefreshControl`) on all FlatLists
- Swipe-to-delete/edit on client list items (react-native-gesture-handler Swipeable)
- Date picker (`@react-native-community/datetimepicker`) on Policy and Payment forms
- Debounced search on client list (300ms)
- Replace hardcoded `http://localhost:3000` with config value
- Empty state illustrations (MaterialCommunityIcons + message + CTA)
- Skeleton loading placeholders instead of bare ActivityIndicator
- Dashboard stat card icons + delta indicators

---

## Section 6: Animations, Transitions & Micro-interactions

- Page fade-in on mount (CSS `@keyframes fadeIn`)
- Button active state: scale(0.98) on press
- Stat card staggered entrance animation
- List item sequential fade-in (50ms stagger)
- Toast notification system: fixed-position slide-down bar at top of viewport, auto-dismiss 4s, green/amber/red variants, close button, CSS animation for slide-in/slide-out. Implemented as a standalone component with imperative `showToast()` API.
- Button spinner inside existing button components
- CSS shimmer effect on skeleton cards
- Mobile: opacity cross-fade on tab switches
- "Pending" status badge pulse animation
- All animations respect `prefers-reduced-motion` / `useReducedMotion()`

---

## Files Changed

### Web App
| File | Change |
|------|--------|
| `src/app/page.tsx` | Landing page hero redesign |
| `src/app/globals.css` | New animations, hero, toast, skeleton, sort styles |
| `src/features/auth/auth-form.tsx` | Forgot password, validation UX, redirect |
| `src/features/dashboard/dashboard-widgets.tsx` | Icons, deltas, recent activity, quick actions |
| `src/features/clients/client-list.tsx` | Sorting, search, pagination |
| `src/features/policies/policy-list.tsx` | Sorting, pagination |
| `src/features/payments/payment-list.tsx` | Sorting, pagination |

### Mobile App
| File | Change |
|------|--------|
| `src/screens/dashboard-screen.tsx` | **Remove** (unused old file) |
| `src/features/dashboard/dashboard-screen.tsx` | Icons, deltas, pull-to-refresh |
| `src/features/clients/client-list-screen.tsx` | Swipe, debounce, pull-to-refresh, empty state |
| `src/features/policies/policy-form-screen.tsx` | Date picker |
| `src/features/payments/payment-list-screen.tsx` | Pull-to-refresh, empty state |
| `src/features/payments/payment-form-screen.tsx` | Date picker |

### Both
- Config constants for API URLs (mobile): add `src/lib/config.ts` with `export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "/api"`
- Toast notification component (`src/components/toast.tsx` for web, Snackbar already exists for mobile)
