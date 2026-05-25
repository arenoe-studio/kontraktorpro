# CHANGELOG

> Reverse-chronological log of all working sessions. Most recent entry first.
> Format follows AGENTS.md changelog rules.

## 2026-05-25 — Feature: Real Authentication (DB + bcrypt + Resend Email OTP)

### Modified
- `src/lib/db/schema.ts` — Added `email`, `suspended`, `first_login` to users; added `otpChallenges` table; added `authIntentEnum`
- `src/features/auth/types.ts` — `MockUser` → `DbUser`; `OtpChallengeSnapshot`: `maskedPhone`→`maskedEmail`, removed `debugCode`; `PasswordResetState`: `phone`→`email`
- `src/features/auth/schemas.ts` — `phoneSchema` → `emailSchema`; `forgotPasswordPhoneSchema` → `forgotPasswordEmailSchema`
- `src/features/auth/actions.ts` — All imports from `auth-service`; `phone`→`email`; `secure: true` on all cookies
- `src/lib/auth/session.ts` — `getUserById` from `auth-service`; `MockUser` → `DbUser`
- `src/lib/contracts/types.ts` — `User`: added `email`, `phone` optional
- `src/lib/services/contracts.ts` — `AuthOtpService`: `sendOtp(email, code)` signature
- `src/lib/services/mock-services.ts` — Updated `mockOtpService` to match new interface
- `src/lib/contracts/mock-data.ts` — Added `email` to `mockCurrentUser`
- `src/features/auth/components/register-form.tsx` — `phone` → `email` field
- `src/features/auth/components/login-form.tsx` — `phone` → `email` field
- `src/features/auth/components/otp-verification-form.tsx` — `maskedPhone`→`maskedEmail`, removed `debugCode` display
- `src/features/auth/components/forgot-password-flow.tsx` — `phone` → `email`, removed `debugCode` display
- `src/app/(auth)/login/page.tsx` — searchParams `phone` → `email`
- `src/app/(auth)/_components/LoginPage.tsx` — `defaultPhone` → `defaultEmail`
- `docs/Project_Codebase.md` — Updated sections 1, 2, 4, 5, 6, 7, 8, 9, 10

### Added
- `src/features/auth/auth-service.ts` — Real DB auth service (9 functions)
- `src/lib/db/index.ts` — Drizzle db instance (Neon HTTP driver)
- `src/lib/db/queries/users.ts` — User DB query helpers
- `src/lib/services/email-otp-service.ts` — Resend email OTP implementation
- `src/features/auth/__tests__/auth-service.property.test.ts` — Property tests (Properties 1, 3, 7)
- `drizzle/0001_spotty_roland_deschain.sql` — Migration: email, suspended, first_login, otp_challenges

### Deleted
- `src/features/auth/mock-auth-service.ts` — Replaced by `auth-service.ts`

### Changes
- Auth identifier changed from phone to email
- Passwords hashed with bcryptjs (cost 12)
- OTP stored as bcryptjs hash (cost 10) in `otp_challenges` table
- OTP delivered via Resend email (not SMS/WhatsApp)
- `debugCode` removed from all responses
- `secure: true` on all auth cookies
- DB migration applied to Neon

### Risks
- Medium — Core auth flow changed; requires `RESEND_API_KEY` in production
- `secure: true` cookies require HTTPS — local dev may need adjustment

### Dependencies
- Added: `bcryptjs@^3.0.3`, `resend@^6.12.3`, `@types/bcryptjs@^2.4.6`, `fast-check@^4.8.0`, `postgres` (dev, for migrations)

---

## 2025-01-27 — Task 10.1: Cleanup — Hapus mock-auth-service

### Deleted
- `src/features/auth/mock-auth-service.ts` — mock in-memory auth service dihapus setelah semua import dimigrasikan ke `auth-service.ts`

### Modified
- `src/lib/services/mock-services.ts` — update `mockOtpService.sendOtp` signature dari `(phone)` ke `(email, code)` sesuai interface `AuthOtpService` yang baru; hapus method `verifyOtp` yang sudah tidak ada di interface
- `src/lib/contracts/mock-data.ts` — tambah field `email: string` ke `mockCurrentUser` sesuai tipe `User` yang sudah diupdate (email required, phone optional)

### Changes
- Verifikasi tidak ada import tersisa ke `mock-auth-service` di seluruh codebase (grep clean)
- Konfirmasi `actions.ts` sudah import dari `auth-service`
- Konfirmasi `session.ts` sudah import dari `auth-service`
- `npx tsc --noEmit` → 0 errors

### Risks
- Low — cleanup only, tidak ada logika baru

### Dependencies
- None

---

## 2026-07-14 — real-auth spec: Task 9.1 (Apply migration to Neon database)

### Modified
- `drizzle.config.ts` — temporarily added `postgres` driver for CLI migration, restored to original after migration

### Changes
- Applied `drizzle/0001_spotty_roland_deschain.sql` to Neon database via `postgres` npm package (direct TCP)
- Note: `npx drizzle-kit migrate` fails with `@neondatabase/serverless` driver in CLI context (WebSocket-only); workaround was to use `postgres` npm package for the migration run
- `postgres` package added as devDependency for migration tooling

### Migration Results (verified)
- `auth_intent` enum created: values `['register', 'login', 'forgot-password']`
- `otp_challenges` table created with all 12 columns
- `users.phone` column: changed from NOT NULL → nullable (YES)
- `users.email` column: added as `varchar(255) NOT NULL` with UNIQUE constraint
- `users.suspended` column: added as `boolean DEFAULT false NOT NULL`
- `users.first_login` column: added as `boolean DEFAULT true NOT NULL`
- No data loss — `users` table had 0 rows at time of migration

### Risks
- Low — migration applied cleanly, no existing data affected
- `drizzle-kit migrate` native command does not work with `@neondatabase/serverless` from local CLI; future migrations should use `postgres` package or `psql` directly

### Dependencies
- Added: `postgres` (devDependency) — used for CLI migration execution

---

## 2026-07-14 — real-auth spec: Tasks 8.1–8.5 (UI Updates — phone → email, remove debugCode)

### Modified
- `src/features/auth/components/register-form.tsx` — field "Nomor HP" → "Email", id/inputMode/placeholder/register/errors updated, helper text updated, FormCard description updated
- `src/features/auth/components/login-form.tsx` — prop `defaultPhone` → `defaultEmail`, field "Nomor HP" → "Email", id/type/inputMode/placeholder/register/errors/defaultValues updated, FormCard description updated, OTP mode InlineAlert updated
- `src/features/auth/components/otp-verification-form.tsx` — `maskedPhone` → `maskedEmail`, subtitle "ke nomor HP Anda" → "ke email Anda", footer replaced (removed debugCode display, now shows informational text)
- `src/features/auth/components/forgot-password-flow.tsx` — import `forgotPasswordPhoneSchema`/`ForgotPasswordPhoneValues` → `forgotPasswordEmailSchema`/`ForgotPasswordEmailValues`, useForm type updated, defaultValues `phone` → `email`, field "Nomor HP" → "Email", register/errors/setError updated, debugCode `<p>` removed from step 2, steps array updated, step 1 description updated
- `src/app/(auth)/login/page.tsx` — searchParams type `{ phone?: string }` → `{ email?: string }`
- `src/app/(auth)/_components/LoginPage.tsx` — searchParams type updated, `params.phone` → `params.email`, prop `defaultPhone` → `defaultEmail`

### Changes
- All auth UI forms migrated from phone-based to email-based identifier
- Removed all `debugCode` display from OTP verification UI (otp-verification-form.tsx and forgot-password-flow.tsx)
- Login page search param changed from `?phone=` to `?email=` for pre-filling login form after password reset

### Risks
- Low — UI-only changes, no logic or server action changes
- Pre-existing TypeScript errors remain in mock files (mock-auth-service.ts, mock-data.ts, mock-services.ts) — these are carry-over from Tasks 3.1/3.3/3.4 and will be resolved in Task 10.1 (mock cleanup)

### Dependencies
- None added

---

## 2026-07-14 — real-auth spec: Tasks 7.1 & 7.2 (Integration — actions.ts + session.ts)

### Modified
- `src/features/auth/actions.ts`
- `src/lib/auth/session.ts`
- `src/features/auth/components/forgot-password-flow.tsx` (incidental fix: fallback literal `phone: null` → `email: null`)

### Changes
**actions.ts (Task 7.1)**
- Changed import source `./mock-auth-service` → `./auth-service`
- Changed import `forgotPasswordPhoneSchema` → `forgotPasswordEmailSchema` from `./schemas`
- `registerAction`: `phone: parsed.data.phone` → `email: parsed.data.email`; success message updated to "Kode OTP dikirim ke email Anda."
- `loginWithPasswordAction`: `parsed.data.phone` → `parsed.data.email`
- `requestLoginOtpAction`: `parsed.data.phone` → `parsed.data.email`
- `requestPasswordResetAction`: schema changed to `forgotPasswordEmailSchema`; `parsed.data.phone` → `parsed.data.email`; return data `phone: result.phone` → `email: result.email`
- `verifyPasswordResetOtpAction`: `phone: null` → `email: null`; `maskedPhone` → `maskedEmail`
- `resendPasswordResetOtpAction`: `phone: null` → `email: null` (both failure and success branches)
- `resetPasswordAction`: return type `{ phone: string; redirectTo: string }` → `{ email: string; redirectTo: string }`; `phone: result.phone` → `email: result.email`; redirect query param `?phone=` → `?email=`
- `getPasswordResetStateFromCookie`: all three `phone: null` → `email: null`
- `setSessionCookie`, `setOtpCookie`, `setResetCookie`: `secure: false` → `secure: true`

**session.ts (Task 7.2)**
- Import `getUserById` from `./auth-service` (was `./mock-auth-service`)
- Import type `DbUser` instead of `MockUser` from `@/features/auth/types`
- `getCurrentUser()` return type: `Promise<MockUser | null>` → `Promise<DbUser | null>`
- `requireAuth()` and `requireRole()` return types inferred as `Promise<DbUser>` via TypeScript inference

### Risks
- Low — mechanical substitution; no logic changed
- 6 pre-existing TS errors remain in mock files (`mock-auth-service.ts`, `mock-data.ts`, `mock-services.ts`) — these are scheduled for cleanup in task 10.1 and are not caused by these changes

### Dependencies
- None added

---

## 2026-07-14 — real-auth spec: Task 6.5 (resendChallenge, startPasswordReset, resetPassword)

### Modified
- `src/features/auth/auth-service.ts`

### Changes
- Implemented `resendChallenge(challengeId)`: validates challenge exists, not verified/expired, resend limit not reached, cooldown elapsed; generates new OTP, hashes it, UPDATEs otp_challenges (codeHash, expiresAt, resendAvailableAt, resendCount+1, reset attemptsRemaining, clear lockedUntil), sends email via emailOtpService, returns updated snapshot
- Implemented `startPasswordReset(email)`: normalizes email, finds user (fieldError if not found), checks suspended, generates OTP, INSERTs otp_challenges (flow: "forgot-password"), sends email (DELETEs challenge on failure), returns snapshot + email
- Implemented `resetPassword(challengeId, nextPassword)`: validates challenge exists, flow === "forgot-password", isVerified, not expired; finds user, hashes new password with bcrypt cost 12, calls updateUserPassword, DELETEs challenge, returns email
- `getUserById` and `getChallengeSnapshot` were already implemented — not changed

### Risks
- Low — all three functions are isolated; no shared state modified
- Pre-existing TS errors in actions.ts, UI components, mock files remain (belong to tasks 7, 8, 10)

### Dependencies
- None added

---

## 2026-07-14 — real-auth spec: Task 6.4 (verifyChallengeCode)

### Modified
- `src/features/auth/auth-service.ts` — replaced `verifyChallengeCode` stub with full implementation

### Changes
- Task 6.4: `verifyChallengeCode(challengeId, code)` — full OTP verification logic:
  - SELECT `otp_challenges` WHERE id = challengeId LIMIT 1
  - Not found → error "Sesi OTP tidak ditemukan. Silakan ulangi dari login atau daftar."
  - `isVerified = true` OR `expiresAt < now` → error "Sesi OTP tidak valid atau sudah kedaluwarsa." (with snapshot)
  - `lockedUntil > now` → error with `Math.ceil` remaining minutes (with snapshot)
  - `bcryptjs.compare(code, codeHash)` false:
    - `newAttempts = attemptsRemaining - 1`
    - If `newAttempts <= 0`: UPDATE SET `attemptsRemaining = 0, lockedUntil = now + 10min`, return "Terlalu banyak percobaan. Coba lagi dalam 10 menit."
    - Else: UPDATE SET `attemptsRemaining = newAttempts`, return "Kode salah. Sisa N percobaan."
    - Both branches use `.returning()` for updated snapshot; fallback to spread if no row returned
  - Code correct, flow `"register"`: parse metadata JSON, Drizzle transaction (INSERT users + DELETE otp_challenges), inline `DbUser` mapping (avoids private `mapDbRowToDbUser` in users.ts), return `{ success: true, challenge, user: newUser }`
  - Code correct, flow `"login"`: UPDATE `isVerified = true`, `findUserByEmail(challenge.email)`, return `{ success: true, challenge, user }`
  - Code correct, flow `"forgot-password"`: UPDATE `isVerified = true`, return `{ success: true, challenge, user: null }`
  - Entire function wrapped in try/catch

### Risks
- Low — only auth-service.ts modified
- 33 pre-existing TSC errors remain in other files (actions.ts, form components, mock files, session.ts) — unrelated to task 6.4; will be resolved by tasks 7.x, 8.x, 10.x
- Zero diagnostics in auth-service.ts itself

### Dependencies
- None added

---

## 2026-07-14 — real-auth spec: Tasks 6.2, 6.3 (startRegistration, loginWithPassword, startLoginOtp)

### Modified
- `src/features/auth/auth-service.ts` — replaced three `throw new Error("Not implemented")` stubs with real implementations

### Changes
- Task 6.2: `startRegistration` — normalizes email, checks for duplicate via `findUserByEmail`, hashes OTP code (cost 10) and password (cost 12) in parallel, serializes metadata JSON (includes passwordHash, not plaintext password), INSERTs `otp_challenges` with `flow: "register"`, calls `emailOtpService.sendOtp` and rolls back (DELETE challenge) on send failure, returns `OtpChallengeSnapshot`
- Task 6.3a: `loginWithPassword` — normalizes email, fetches user+hash via `findUserByEmailWithHash`, checks suspended flag, verifies password with `bcryptjs.compare`, strips `passwordHash` from returned user via destructuring, determines `redirectTo` based on role (`/dashboard` for contractor, `/admin` for others), returns `{ success: true, user, result: LoginSuccess }`
- Task 6.3b: `startLoginOtp` — normalizes email, verifies user exists via `findUserByEmail`, checks suspended flag, generates+hashes OTP, INSERTs `otp_challenges` with `flow: "login"`, calls `emailOtpService.sendOtp` with rollback on failure, returns `OtpChallengeSnapshot`
- All three functions wrapped in try/catch returning `{ success: false, message: "Terjadi kesalahan sistem. Coba lagi." }`

### Risks
- Low — only auth-service.ts modified; no new files, no imports changed
- 33 pre-existing TSC errors remain in other files (actions.ts, form components, mock files, session.ts) — unrelated to tasks 6.2/6.3; will be resolved by tasks 7.x, 8.x, 10.x
- Zero diagnostics in auth-service.ts itself

### Dependencies
- None added

---

## 2026-07-14 — real-auth spec: Tasks 4.1, 5.1 (DB instance + Email OTP Service)

### Added
- `src/lib/db/index.ts` — Drizzle db instance using Neon serverless driver
- `src/lib/services/email-otp-service.ts` — Resend-backed `AuthOtpService` implementation

### Changes
- Task 4.1: Created Drizzle `db` export using `neon()` + `drizzle(sql, { schema })` pattern
- Task 5.1: Implemented `emailOtpService.sendOtp(email, code)` via Resend API; includes `buildEmailHtml()` with OTP code display, 15-minute validity notice, and security warnings in Bahasa Indonesia
- Error handling: Resend API errors and thrown exceptions both return `{ success: false, message: "Gagal mengirim email OTP. Coba lagi." }`
- `challengeId` in success response is empty string — intentional per design (challengeId is created by auth-service before calling sendOtp)

### Risks
- Low — new files only, no existing files modified
- 33 pre-existing TSC errors in other files (actions.ts, form components, mock-auth-service.ts, session.ts, mock-services.ts) — all from earlier tasks (3.x) that updated types/schemas; will be resolved by tasks 7.x and 8.x

### Dependencies
- `@neondatabase/serverless` (already installed) — used in db/index.ts
- `drizzle-orm/neon-http` (already installed) — used in db/index.ts
- `resend` (already installed) — used in email-otp-service.ts

---

## 2026-07-14 — real-auth spec: Tasks 3.1, 3.3, 3.4 (Core Types — auth types, contracts)

### Modified
- `src/features/auth/types.ts` — removed `MockUser`, added `DbUser`; updated `OtpChallengeSnapshot` (maskedPhone→maskedEmail, removed debugCode); updated `PasswordResetState` (phone→email)
- `src/lib/contracts/types.ts` — added `email: string` to `User` type; changed `phone: string` → `phone?: string`
- `src/lib/services/contracts.ts` — updated `AuthOtpService.sendOtp` signature (phone→email, added code param); removed `verifyOtp` method

### Changes
- `DbUser` replaces `MockUser` as the canonical user type for auth layer
- `OtpChallengeSnapshot.maskedEmail` replaces `maskedPhone`; `debugCode` removed (security)
- `PasswordResetState.email` replaces `phone`
- `User` contract now includes `email` as required field; `phone` is optional
- `AuthOtpService` interface simplified: single `sendOtp(email, code)` method; `verifyOtp` removed (verification handled by auth-service)

### Known Downstream Errors (to be fixed in later tasks)
- `actions.ts` — 9 errors (Task 7.1)
- `forgot-password-flow.tsx` — 2 errors (Task 8.4)
- `otp-verification-form.tsx` — 2 errors (Task 8.3)
- `mock-auth-service.ts` — 2 errors (Task 10.1 — file will be deleted)
- `session.ts` — 1 error (Task 7.2)
- `mock-data.ts` — 1 error (needs email field)
- `mock-services.ts` — 3 errors (verifyOtp removed from interface)

### Risks
- Low — type-only changes; no runtime logic altered
- Downstream files will fail tsc until their respective tasks are completed

### Dependencies
- None

---

## 2026-07-14 — real-auth spec: Task 1.1 + 1.2 (Foundation — Dependencies & Env)

### Modified
- `package.json` — added `bcryptjs`, `resend` (dependencies); `@types/bcryptjs`, `fast-check` (devDependencies)
- `package-lock.json` — updated by npm install
- `.env.example` — added `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

### Changes
- Installed `bcryptjs@^3.0.3` for password hashing (replaces plaintext mock store)
- Installed `resend@^6.12.3` for transactional email OTP delivery
- Installed `@types/bcryptjs@^2.4.6` for TypeScript type support
- Installed `fast-check@^4.8.0` for property-based testing (task 11.1)
- Added Resend env var placeholders to `.env.example` for developer onboarding

### Risks
- Low — no source code changed, only dependency additions and env example update

### Dependencies
- `bcryptjs` ^3.0.3 (production)
- `resend` ^6.12.3 (production)
- `@types/bcryptjs` ^2.4.6 (dev)
- `fast-check` ^4.8.0 (dev)

---

## 2026-05-25 — Technical Debt Cleanup + Small Improvements

### Modified
- `src/lib/ui/cn.ts` — Changed from independent definition to re-export from `@/lib/utils`
- `src/app/(app)/_components/ui.tsx` — Removed local `cn` definition, imports from `@/lib/utils`
- `src/components/layout/app-shell.tsx` — Updated `cn` import to `@/lib/utils`
- `src/app/(app)/_components/mock-data.ts` — Removed local `ProjectStatus` type, `formatCurrency`, `formatDate`; imports from canonical sources
- `src/app/(app)/_components/DashboardPage.tsx` — Updated status filter values to English canonical
- `src/app/(app)/_components/ProjectsPage.tsx` — Updated status filter values and `normalizeStatus` to English canonical
- `src/lib/navigation.ts` — Fixed all broken routes; removed non-existent routes
- `src/app/robots.ts` — Uses `siteConfig.url` instead of hardcoded URL
- `src/app/(app)/layout.tsx` — Now uses `ContractorShell` (generic composable) instead of hardcoded `AppShell`
- `src/app/layout.tsx` — Wrapped with `QueryProvider`
- `docs/Project_Codebase.md` — Updated sections 1, 4, 6, 7, 9

### Added
- `src/app/(app)/_components/contractor-shell.tsx` — Thin client wrapper composing generic layout components
- `src/components/providers/query-provider.tsx` — `QueryClientProvider` with `ReactQueryDevtools`
- `src/lib/store/ui-store.ts` — Zustand v5 UI store (`sidebarOpen`, `activeFilters`)
- `src/lib/store/index.ts` — Barrel export for stores
- `src/__tests__/bug-condition.test.ts` — Exploration tests for 4 bug conditions
- `src/__tests__/preservation.test.ts` — Preservation tests (16 tests, baseline behavior)
- `vitest.config.ts` — Vitest configuration with path alias
- `docs/CHANGELOG.md` — This file

### Deleted
- `src/app/(app)/_components/app-shell.tsx` — Replaced by `contractor-shell.tsx` + generic layout components

### Changes
- Consolidated `cn()` to single canonical source (`src/lib/utils.ts`)
- Fixed `ProjectStatus` enum conflict (mock-data now uses English canonical values)
- Fixed 11+ broken navigation routes in `navigation.ts`
- Fixed `robots.ts` URL mismatch with `siteConfig.url`
- Removed `formatCurrency`/`formatDate` duplication in `mock-data.ts`
- Consolidated app-shell: generic composable shell is now canonical
- Wired `@tanstack/react-query` with `QueryClientProvider` in root layout
- Set up Zustand store structure for future UI state management

### Risks
- Low — All changes are structural/consolidation, no business logic changed
- `formatDate` output changed from `"short"` month (`"Apr"`) to `"long"` month (`"April"`) — intentional visual change
- Navigation items removed: `/portofolio`, `/pengaturan-akun` (contractor), `/admin/aktivitas`, `/admin/verifikasi`, `/admin/laporan`, `/admin/notifikasi` — these routes don't exist yet

### Dependencies
- Added: `vitest@^4.x` (dev), `@vitest/coverage-v8` (dev), `@tanstack/react-query-devtools`
