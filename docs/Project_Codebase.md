# Project_Codebase.md

> **Operational reference for AI agents only.**
> Rules: NEVER assume behavior. NEVER infer hidden logic. ONLY document what is explicitly found in source code.
> Planned integrations are flagged with `[PLANNED]` — not yet implemented.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Feature Map](#2-feature-map)
- [3. Route Map](#3-route-map)
- [4. Function Reference](#4-function-reference)
- [5. API Flow Map](#5-api-flow-map)
- [6. Dependency Map](#6-dependency-map)
- [7. Data Layer](#7-data-layer)
- [8. Sensitive Areas](#8-sensitive-areas)
- [9. Unknown / Unclear Areas](#9-unknown--unclear-areas)
- [10. Planned But Not Yet Built](#10-planned-but-not-yet-built)

---

## 1. Project Overview

| Property | Value |
|---|---|
| **App name** | KontraktorPro |
| **Domain** | Construction project management for Indonesian contractors |
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL via Neon (`@neondatabase/serverless`) + Drizzle ORM |
| **Auth** | Custom cookie-based session (`kp-auth-session`). Backed by PostgreSQL (Neon) via Drizzle ORM. bcryptjs password hashing. OTP via Resend email. `next-auth` is installed but NOT used. |
| **State management** | Zustand (store at `src/lib/store/`; not yet consumed by components) |
| **Server actions** | Used for all auth mutations (`src/features/auth/actions.ts`) |
| **File uploads** | `uploadthing` (installed, mock URL only) |
| **Notifications** | `sonner` (toast, wired in root layout) |
| **Forms** | `react-hook-form` + `@hookform/resolvers` + `zod` |
| **Data fetching** | `@tanstack/react-query` (wired via `QueryProvider` in root layout; no `useQuery` calls yet) |
| **Locale** | Indonesian (`id-ID`). All UI strings are in Bahasa Indonesia. |
| **Current state** | Auth layer is real (PostgreSQL + bcryptjs + Resend email OTP). All other features remain mock-first. No real payment/file integrations. |

---

## 2. Feature Map

| Feature | Route Group | Status | Risk |
|---|---|---|---|
| Landing page | `(marketing)` | BUILT — static content | LOW |
| Pricing page | `(marketing)/harga` | BUILT — static content | LOW |
| Contractor directory | `(marketing)/direktori` | BUILT — static mock data | LOW |
| Public contractor profile | `(marketing)/kontraktor/[slug]` | BUILT — reads from `content.ts` static array | LOW |
| Owner tracking link | `(marketing)/pantau/[token]` | BUILT — reads from `content.ts` static array | LOW |
| Register | `(auth)/register` | BUILT — Server Action + PostgreSQL + Resend email OTP | MEDIUM |
| Login (password + OTP) | `(auth)/login` | BUILT — Server Action + PostgreSQL + Resend email OTP | MEDIUM |
| OTP verification | `(auth)/verify-otp` | BUILT — Server Action + PostgreSQL + Resend email OTP | MEDIUM |
| Forgot password | `(auth)/forgot-password` | BUILT — Server Action + PostgreSQL + Resend email OTP | MEDIUM |
| Contractor dashboard | `(app)/dashboard` | BUILT — static mock data | MEDIUM |
| Project list | `(app)/projects` | BUILT — static mock data, filter/sort UI only | MEDIUM |
| Project detail (tabs) | `(app)/projects/[id]` | BUILT — static mock data, 6 tabs | MEDIUM |
| Create project | `(app)/projects/new` | BUILT — form shell, no persistence | HIGH |
| Edit project | `(app)/projects/[id]/edit` | BUILT — form shell, no persistence | HIGH |
| Billing / subscription | `billing/` | BUILT — static mock data | HIGH |
| Checkout | `billing/checkout` | BUILT — mock payment flow | HIGH |
| Checkout success | `billing/checkout/success` | BUILT — static confirmation | MEDIUM |
| Admin dashboard | `admin/` | BUILT — static mock data | HIGH |
| Admin user list | `admin/users` | BUILT — static mock data | HIGH |
| Admin user detail | `admin/users/[id]` | BUILT — static mock data | HIGH |
| Admin portfolio moderation | `admin/moderation/portfolio` | BUILT — static mock data | HIGH |
| Admin review moderation | `admin/moderation/reviews` | BUILT — static mock data | HIGH |
| Admin finance | `admin/finance` | BUILT — static mock data | HIGH |
| Admin packages | `admin/packages` | BUILT — static mock data | HIGH |
| Admin activity logs | `admin/logs` | BUILT — static mock data | HIGH |
| WBS management | `(app)/projects/[id]?tab=wbs` | BUILT — CRUD + Template apply (4 pre-defined templates) | CRITICAL |
| Daily reports | `(app)/projects/[id]?tab=reports` | BUILT — read-only mock | CRITICAL |
| Photo gallery | `(app)/projects/[id]?tab=photos` | BUILT — read-only mock | CRITICAL |
| Team management | `(app)/projects/[id]?tab=team` | BUILT — read-only mock | CRITICAL |
| Material tracking | `(app)/projects/[id]?tab=materials` | BUILT — read-only mock | CRITICAL |
| Project settings | `(app)/projects/[id]?tab=settings` | BUILT — read-only mock | CRITICAL |
| Portfolio management | — | NOT BUILT | — |
| PDF report generation | — | NOT BUILT (`PdfReportService` contract defined) | — |
| Real payment gateway | — | NOT BUILT (`PaymentGatewayService` contract defined) | — |
| WhatsApp notifications | — | NOT BUILT (`NotificationService` contract defined) | — |

---

## 3. Route Map

### Route Groups

| Group | Path prefix | Auth guard | Guard type |
|---|---|---|---|
| `(marketing)` | `/`, `/harga`, `/direktori`, `/kontraktor/[slug]`, `/pantau/[token]` | None | Public |
| `(auth)` | `/login`, `/register`, `/verify-otp`, `/forgot-password` | `redirectIfAuthenticated()` | Redirect if already logged in |
| `(app)` | `/dashboard`, `/projects/*` | `requireRole("contractor")` | Redirect to `/login` if no session; redirect to `/admin` if wrong role |
| `admin` | `/admin/*` | `requireRole(["moderator", "super_admin"])` | Redirect to `/dashboard` if contractor |
| `billing` | `/billing/*` | `requireAuth()` | Redirect to `/login` if no session |

### All Routes

```
/                                   → LandingPage
/harga                              → HargaPage
/direktori                          → DirectoriPage
/kontraktor/[slug]                  → KontraktorProfilePage
/pantau/[token]                     → PantauPage
/login                              → LoginPage
/register                           → RegisterPage
/verify-otp                         → VerifyOtpPage
/forgot-password                    → ForgotPasswordPage
/dashboard                          → DashboardPage
/projects                           → ProjectsPage
/projects/new                       → ProjectFormShell (mode="create")
/projects/[id]                      → ProjectDetailPage
/projects/[id]/edit                 → EditProjectPage
/billing                            → BillingPage
/billing/checkout                   → CheckoutPage
/billing/checkout/success           → CheckoutSuccessPage
/admin                              → AdminDashboardPage
/admin/users                        → AdminUsersPage
/admin/users/[id]                   → AdminUserDetailPage
/admin/moderation/portfolio         → AdminModerationPortfolioPage
/admin/moderation/reviews           → AdminModerationReviewsPage
/admin/finance                      → AdminFinancePage
/admin/packages                     → AdminPackagesPage
/admin/logs                         → AdminLogsPage
```

**No API route handlers exist.** There are no `route.ts` files anywhere in the project.

---

## 4. Function Reference

### `src/lib/auth/session.ts` — Server-only session utilities

| Function | Signature | Behavior | Status |
|---|---|---|---|
| `getCurrentUser` | `() => Promise<DbUser \| null>` | Reads `kp-auth-session` cookie → calls `getUserById` from `auth-service` | VERIFIED |
| `requireAuth` | `() => Promise<DbUser>` | Calls `getCurrentUser`; redirects to `/login` if null | VERIFIED |
| `requireRole` | `(roles: AuthRole \| AuthRole[]) => Promise<DbUser>` | Calls `requireAuth`; redirects based on role mismatch | VERIFIED |
| `redirectIfAuthenticated` | `() => Promise<null>` | Calls `getCurrentUser`; redirects to `/dashboard` or `/admin` if session exists | VERIFIED |

### `src/features/auth/actions.ts` — Server Actions (all `"use server"`)

| Function | Cookie used | Returns |
|---|---|---|
| `registerAction` | Sets `kp-auth-otp` | `ActionResult<OtpChallengeSnapshot>` |
| `loginWithPasswordAction` | Sets `kp-auth-session` | `ActionResult<LoginSuccess>` |
| `requestLoginOtpAction` | Sets `kp-auth-otp` | `ActionResult<OtpChallengeSnapshot>` |
| `verifyCurrentOtpAction` | Reads `kp-auth-otp`, sets `kp-auth-session`, clears `kp-auth-otp` | `ActionResult<LoginSuccess>` |
| `resendCurrentOtpAction` | Reads `kp-auth-otp` | `ActionResult<OtpChallengeSnapshot>` |
| `requestPasswordResetAction` | Sets `kp-auth-reset` | `ActionResult<PasswordResetState>` |
| `verifyPasswordResetOtpAction` | Reads `kp-auth-reset` | `ActionResult<PasswordResetState>` |
| `resendPasswordResetOtpAction` | Reads `kp-auth-reset` | `ActionResult<PasswordResetState>` |
| `resetPasswordAction` | Reads `kp-auth-reset`, clears `kp-auth-reset` | `ActionResult<{ phone, redirectTo }>` |
| `getOtpChallengeStateFromCookie` | Reads `kp-auth-otp` | `OtpChallengeSnapshot \| null` |
| `getPasswordResetStateFromCookie` | Reads `kp-auth-reset` | `PasswordResetState` |

### `src/features/auth/auth-service.ts` — Real DB auth service (server-only)

| Function | Behavior | Status |
|---|---|---|
| `startRegistration` | Checks email uniqueness → hashes OTP + password → INSERTs `otp_challenges` → sends email via Resend | VERIFIED |
| `loginWithPassword` | Normalizes email → finds user → checks suspended → `bcryptjs.compare` password → returns `LoginSuccess` | VERIFIED |
| `startLoginOtp` | Normalizes email → finds user → checks suspended → INSERTs `otp_challenges` → sends email | VERIFIED |
| `verifyChallengeCode` | Validates challenge → `bcryptjs.compare` code → handles lockout/attempts → creates user (register) or marks verified (login/reset) | VERIFIED |
| `resendChallenge` | Validates cooldown + resend limit → generates new OTP → UPDATEs `otp_challenges` → sends email | VERIFIED |
| `startPasswordReset` | Normalizes email → finds user → INSERTs `otp_challenges` (flow: forgot-password) → sends email | VERIFIED |
| `resetPassword` | Validates verified challenge → hashes new password → `updateUserPassword` → DELETEs challenge | VERIFIED |
| `getUserById` | SELECT `users` WHERE id LIMIT 1 → returns `DbUser \| null` | VERIFIED |
| `getChallengeSnapshot` | SELECT `otp_challenges` WHERE id → returns `OtpChallengeSnapshot \| null` (no debugCode, no codeHash) | VERIFIED |

**Passwords hashed with bcryptjs cost 12. OTP codes hashed with bcryptjs cost 10. No plaintext secrets stored.**

### `src/lib/utils.ts` — Shared utilities

| Function | Behavior |
|---|---|
| `cn(...inputs)` | `clsx` + `tailwind-merge` — also duplicated in `src/lib/ui/cn.ts` |
| `formatCurrency(value)` | `Intl.NumberFormat` with `id-ID` locale, IDR, 0 decimal places |
| `formatDate(value)` | `Intl.DateTimeFormat` with `id-ID` locale, `dd MMMM yyyy` |

### `src/app/(app)/_components/mock-data.ts` — App mock data

| Function | Returns |
|---|---|
| `getProjects()` | All 4 hardcoded projects |
| `getProjectById(id)` | Single project by string ID |
| `getDashboardSummary()` | Computed KPIs from mock projects |
| `getProjectCounts()` | Count by status |
| `getStatusBadgeVariant(status)` | Badge tone string |
| `getStatusLabel(status)` | Indonesian label string |
| `getDeadlineLabel(daysRemaining)` | Indonesian deadline string |

**Note:** `formatCurrency` and `formatDate` are re-exported from `src/lib/utils.ts` — no longer defined here.

### `src/app/(marketing)/_components/content.ts` — Marketing static data

| Function | Returns |
|---|---|
| `getContractorBySlug(slug)` | `ContractorProfile \| undefined` from static array |
| `getOwnerTrackingByToken(token)` | `OwnerTrackingRecord \| undefined` from static array |
| `getTierRank(tier)` | Numeric rank (1/2/3) for sorting |

### `src/lib/ui/tokens.ts`

| Function | Returns |
|---|---|
| `getProgressTone(value)` | Tailwind bg class based on progress % thresholds (30/60/90) |

---

## 5. API Flow Map

### Auth: Register

```
Client form → registerAction (Server Action)
  → registerSchema.safeParse()
  → startRegistration() [auth-service → DB]
  → hashes OTP (bcrypt cost 10) + password (bcrypt cost 12)
  → INSERT otp_challenges
  → emailOtpService.sendOtp(email, code) [Resend]
  → setOtpCookie(challengeId, secure: true)
  → returns OtpChallengeSnapshot (maskedEmail, no debugCode)
Client redirects to /verify-otp
  → verifyCurrentOtpAction (Server Action)
  → verifyChallengeCode() [auth-service → DB]
  → bcryptjs.compare(code, codeHash)
  → TRANSACTION: INSERT users + DELETE otp_challenges
  → setSessionCookie(userId, secure: true)
  → returns { redirectTo: "/dashboard", firstLogin: true }
```

### Auth: Login (password)

```
Client form → loginWithPasswordAction (Server Action)
  → loginSchema.safeParse()
  → loginWithPassword() [auth-service → DB]
  → findUserByEmail → bcryptjs.compare(password, passwordHash)
  → setSessionCookie(userId, secure: true)
  → returns { redirectTo, firstLogin }
```

### Auth: Login (OTP)

```
Client form → requestLoginOtpAction (Server Action)
  → startLoginOtp() [auth-service → DB]
  → INSERT otp_challenges → emailOtpService.sendOtp()
  → setOtpCookie(challengeId, secure: true)
Client redirects to /verify-otp
  → verifyCurrentOtpAction (Server Action)
  → verifyChallengeCode() [auth-service → DB]
  → UPDATE otp_challenges isVerified=true → findUserByEmail
  → setSessionCookie(userId, secure: true)
```

### Auth: Forgot Password

```
Step 1: requestPasswordResetAction → startPasswordReset() [auth-service → DB]
  → INSERT otp_challenges (flow: "forgot-password") → emailOtpService.sendOtp()
  → setResetCookie(challengeId, secure: true)
Step 2: verifyPasswordResetOtpAction → verifyChallengeCode() [auth-service → DB]
  → UPDATE otp_challenges isVerified=true
Step 3: resetPasswordAction → resetPassword() [auth-service → DB]
  → bcryptjs.hash(nextPassword, 12) → updateUserPassword → DELETE otp_challenges
  → clearResetCookie() → returns { redirectTo: "/login?email=..." }
```

### Session check (every protected layout)

```
Layout (server component) → requireRole() / requireAuth()
  → getCurrentUser()
  → cookies().get("kp-auth-session")
  → getUserById() [auth-service → DB SELECT users WHERE id]
  → redirect() if null or wrong role
```

### Project data flow (contractor app)

```
Page (server component) → imports from mock-data.ts
  → getProjects() / getProjectById() / getDashboardSummary()
  → passes data as props to client components
No server actions, no DB queries.
```

### Marketing data flow

```
Page (server component) → imports from content.ts
  → getContractorBySlug(slug) / getOwnerTrackingByToken(token)
  → renders directly, calls notFound() if undefined
No server actions, no DB queries.
```

### Billing flow

```
BillingPage → reads billing-data.ts (static)
CheckoutPage → [PLANNED] PaymentGatewayService.startCheckout()
  → currently mock: redirects to /billing/checkout/success
```

---

## 6. Dependency Map

### Critical Dependencies

| Package | Version | Role | Notes |
|---|---|---|---|
| `next` | 16.2.4 | Framework | App Router. See AGENTS.md — breaking changes vs training data. |
| `react` | 19.2.4 | UI runtime | — |
| `drizzle-orm` | 0.45.2 | ORM | Schema + queries active for auth layer |
| `@neondatabase/serverless` | 1.1.0 | DB driver | Used in `src/lib/db/index.ts` |
| `bcryptjs` | ^3.0.3 | Password hashing | Used in `auth-service.ts` — cost 12 for passwords, cost 10 for OTP |
| `resend` | ^6.12.3 | Email OTP delivery | Used in `email-otp-service.ts` — requires `RESEND_API_KEY` env var |
| `next-auth` | 4.24.14 | Auth library | Installed but NOT used. Custom cookie auth is used instead. |
| `zod` | 4.3.6 | Validation | Used in all auth schemas |
| `react-hook-form` | 7.73.1 | Forms | Used in auth forms |
| `@hookform/resolvers` | 5.2.2 | Zod adapter for RHF | Used in auth forms |
| `sonner` | 2.0.7 | Toast notifications | Wired in root layout |
| `uploadthing` | 7.7.4 | File uploads | Installed, mock URL only |
| `zustand` | 5.0.12 | Client state | Store at `src/lib/store/` (`ui-store.ts` + `index.ts`). Not yet consumed by components. |
| `@tanstack/react-query` | 5.99.2 | Server state / caching | Wired via `QueryProvider` in root layout. No `useQuery` calls yet. |
| `fast-check` | ^4.8.0 | Property-based testing | Used in `auth-service.property.test.ts` |

### Shared Utilities

| Path | Used by | Purpose |
|---|---|---|
| `src/lib/utils.ts` | App-wide | `cn`, `formatCurrency`, `formatDate` |
| `src/lib/ui/cn.ts` | Components | Re-export of `cn` from `src/lib/utils.ts` — backward compatible |
| `src/lib/ui/tokens.ts` | UI components | Status tone map, progress tone |
| `src/lib/store/index.ts` | Components | Barrel export for Zustand stores |
| `src/components/providers/query-provider.tsx` | Root layout | QueryClientProvider wrapper |
| `src/lib/contracts/enums.ts` | DB schema, types, mock data | Canonical enum definitions |
| `src/lib/contracts/types.ts` | Services, mock data | Canonical entity types |
| `src/lib/contracts/mock-data.ts` | Billing, admin, services | Shared mock entities |
| `src/lib/auth/session.ts` | All protected layouts | Session read/guard functions |
| `src/lib/navigation.ts` | Layout components | Nav link arrays per role |
| `src/lib/site.ts` | Root layout, sitemap | Site config + default metadata |
| `src/lib/db/index.ts` | `auth-service.ts`, `users.ts` | Drizzle db instance — Pool WebSocket mode (Neon). Lazy-initialized via Proxy. Uses `ws` adapter in Node.js, native WebSocket on Vercel. |
| `src/lib/db/queries/users.ts` | `auth-service.ts` | User DB query helpers (findByEmail, findById, createUser, updatePassword) |
| `src/lib/services/email-otp-service.ts` | `auth-service.ts` | Resend email OTP implementation |

### Service Contracts (interfaces only — no real implementations)

| Interface | File | Real provider |
|---|---|---|
| `AuthOtpService` | `src/lib/services/contracts.ts` | `emailOtpService` in `src/lib/services/email-otp-service.ts` (Resend) — BUILT |
| `FileStorageService` | `src/lib/services/contracts.ts` | UploadThing — [PLANNED] |
| `PdfReportService` | `src/lib/services/contracts.ts` | Unknown — [PLANNED] |
| `PaymentGatewayService` | `src/lib/services/contracts.ts` | Midtrans (inferred from mock reference string) — [PLANNED] |
| `NotificationService` | `src/lib/services/contracts.ts` | WhatsApp — [PLANNED] |
| `SessionService` | `src/lib/services/contracts.ts` | Currently backed by mock |

---

## 7. Data Layer

### Database Schema (`src/lib/db/schema.ts`)

| Table | Primary key | Notable columns | FK relationships |
|---|---|---|---|
| `users` | `uuid` | `email` (unique, NOT NULL), `phone` (unique, nullable), `role` enum, `subscription_tier` enum, `password_hash`, `suspended` boolean, `first_login` boolean | — |
| `contractor_profiles` | `uuid` | `user_id`, `slug` (unique), `verified_projects`, `rating` | `user_id` → `users.id` (no FK constraint in schema) |
| `projects` | `uuid` | `owner_id`, `status` enum, `progress`, `is_owner_tracking_enabled` | `owner_id` → `users.id` (no FK constraint) |
| `project_members` | `uuid` | `project_id`, `role` varchar, `is_active` | `project_id` → `projects.id` (no FK constraint) |
| `subscriptions` | `uuid` | `user_id`, `tier` enum, `is_active`, `renews_at` | `user_id` → `users.id` (no FK constraint) |
| `activity_logs` | `uuid` | `actor_id`, `action`, `target_type`, `target_id`, `metadata` | `actor_id` → `users.id` (no FK constraint) |
| `daily_reports` | `uuid` | `project_id`, `author_id`, `status` enum, `weather`, `notes` | `project_id` → `projects.id` (no FK constraint) |
| `portfolio_entries` | `uuid` | `project_id`, `user_id`, `title`, `status` enum | `project_id`, `user_id` (no FK constraints) |
| `otp_challenges` | `uuid` | `flow` (auth_intent enum), `email`, `code_hash`, `expires_at`, `resend_available_at`, `resend_count`, `attempts_remaining`, `locked_until`, `is_verified`, `metadata` (JSON), `created_at` | — |

**No foreign key constraints are declared in the Drizzle schema. Migration `0001_spotty_roland_deschain.sql` has been applied to Neon (adds email, suspended, first_login to users; adds otp_challenges table; adds auth_intent enum).**

### Enums (canonical — defined in `src/lib/contracts/enums.ts` and mirrored in DB schema)

| Enum | Values |
|---|---|
| `Role` | `contractor`, `moderator`, `super_admin` |
| `SubscriptionTier` | `free`, `pro`, `business` |
| `ProjectStatus` | `draft`, `active`, `delayed`, `completed`, `archived` |
| `ReportStatus` | `draft`, `submitted`, `flagged` |
| `ModerationStatus` | `pending`, `approved`, `rejected` |
| `TeamRole` | `mandor`, `pekerja`, `spesialis` |
| `authIntentEnum` (DB only) | `register`, `login`, `forgot-password` — used as `flow` column in `otp_challenges` |

**Note:** `src/app/(app)/_components/mock-data.ts` previously defined a parallel `ProjectStatus` type in Indonesian. This has been resolved — `mock-data.ts` now imports `ProjectStatus` from `src/lib/contracts/enums.ts` (canonical English values).

### Mock Data Sources

| Source | Used by | Contains |
|---|---|---|
| `src/app/(app)/_components/mock-data.ts` | Contractor app pages | 4 projects with full WBS/reports/photos/team/materials |
| `src/lib/contracts/mock-data.ts` | Billing, admin, services | Users, subscriptions, projects, WBS, reports, photos, members, materials, portfolio, reviews, payments, admin logs |
| `src/app/(marketing)/_components/content.ts` | Marketing pages | 4 contractor profiles, 4 owner tracking records, pricing plans, FAQ |
| `src/app/billing/_components/billing-data.ts` | Billing pages | Active plan, payment history, invoices, promo codes |
| `src/app/admin/_components/admin-mocks.ts` | Admin pages | KPIs, user rows, moderation queues, finance data, logs |

---

## 8. Sensitive Areas

| Area | Risk | Notes |
|---|---|---|
| `src/lib/auth/session.ts` | CRITICAL | Session cookie name `kp-auth-session` is hardcoded. `secure: true` on all cookies — requires HTTPS in production (local dev may need adjustment). |
| `src/features/auth/actions.ts` | CRITICAL | All auth mutations. Cookie lifetimes: session = 30 days, OTP = 15 min, reset = 15 min. |
| `src/features/auth/auth-service.ts` | CRITICAL | Real DB auth service. Passwords hashed dengan bcryptjs cost 12. OTP codes hashed dengan bcryptjs cost 10. Tidak ada plaintext secrets yang disimpan atau dikembalikan. Resend client lazy-initialized. |
| `src/lib/db/schema.ts` | HIGH | Schema is live — changes require Drizzle migrations applied to Neon. |
| `src/app/admin/layout.tsx` | HIGH | RBAC guard for admin. Only `requireRole(["moderator", "super_admin"])` — do not weaken. |
| `src/app/(app)/layout.tsx` | HIGH | RBAC guard for contractor app. Only `requireRole("contractor")`. |
| `src/app/billing/layout.tsx` | MEDIUM | Only `requireAuth()` — any authenticated role can access billing. |
| `.env` | CRITICAL | Contains `DATABASE_URL` and `RESEND_API_KEY`. Do not read or echo this file. |
| `next-auth` | MEDIUM | Package is installed but unused. If activated, it will conflict with the custom cookie session. |

---

## 9. Unknown / Unclear Areas

| Area | What is unclear |
|---|---|
| `next-auth` installation | Package is installed but no `[...nextauth]` route or `NextAuth()` config exists. Not used — custom cookie auth is the canonical auth system. No plans to activate it. |
| `zustand` usage | Store created at `src/lib/store/` (`ui-store.ts` + `index.ts`). Not yet consumed by any component. |
| `@tanstack/react-query` | `QueryClientProvider` wired in root layout via `src/components/providers/query-provider.tsx`. No `useQuery` calls yet. |
| DB foreign keys | No FK constraints in Drizzle schema. Unclear if this is intentional or an oversight. |
| `uploadthing` integration | Package installed, `FileStorageService` contract defined, but no UploadThing route handler (`/api/uploadthing`) exists. |

---

## 10. Planned But Not Yet Built

Based on `IMPLEMENTATION_PLAN.md` and `design-reference/markdown/` blueprints.

| Feature | Phase | Blueprint file | Notes |
|---|---|---|---|
| WBS create/edit | Phase 4 | `blueprint-3-5-wbs-proyek.md` | IMPLEMENTED — create item + apply template |
| Daily report form | Phase 4 | `blueprint-3-6-form-laporan-harian.md` | Currently read-only mock |
| Daily report list | Phase 4 | `blueprint-3-7-daftar-laporan-harian.md` | Currently read-only mock |
| Daily report detail | Phase 4 | `blueprint-3-8-detail-laporan-harian.md` | Currently read-only mock |
| Photo gallery upload | Phase 4 | `blueprint-3-9-10-11-galeri-tim-material.md` | Requires UploadThing route |
| Team management CRUD | Phase 4 | `blueprint-3-9-10-11-galeri-tim-material.md` | Currently read-only mock |
| Material tracking CRUD | Phase 4 | `blueprint-3-9-10-11-galeri-tim-material.md` | Currently read-only mock |
| Portfolio publish flow | Phase 5 | `blueprint-3-12-portofolio-profil.md` | Not started |
| Real owner tracking | Phase 5 | `blueprint-1-4-link-pantau-owner.md` | Currently static mock |
| PDF report generation | Phase 5 | — | `PdfReportService` contract defined |
| Real subscription checkout | Phase 6 | `blueprint-5-1-2-checkout-konfirmasi.md` | Mock redirects to success |
| Subscription enforcement (tier limits) | Phase 6 | `blueprint-3-13-14-langganan-pengaturan.md` | Not enforced anywhere |
| Account settings page | Phase 6 | `blueprint-5-3-pengaturan-akun.md` | Route does not exist |
| Admin user management actions | Phase 7 | `blueprint-4-2-3-manajemen-detail-pengguna.md` | UI exists, no actions |
| Admin moderation actions | Phase 7 | `blueprint-4-4-5-moderasi-portofolio-ulasan.md` | UI exists, no actions |
| Real payment gateway | Phase 6 | — | `PaymentGatewayService` contract defined, Midtrans referenced in mock |
| WhatsApp notifications | Phase 4+ | — | `NotificationService` contract defined |
| Onboarding redirect (firstLogin) | Phase 3 | — | `firstLogin` flag exists in mock user, no onboarding page |
| 404 and offline pages | — | `blueprint-5-4-5-404-offline.md` | `not-found.tsx` exists at root, offline page not built |
