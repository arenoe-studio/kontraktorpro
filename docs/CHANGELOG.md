# CHANGELOG

> Reverse-chronological log of all working sessions. Most recent entry first.
> Format follows AGENTS.md changelog rules.
> Timestamps use local time (WIB, UTC+7).

---

## 2026-05-27 — Chore: Checkpoint — Verifikasi type check dan build (Task 13)

### Modified
- `src/__tests__/preservation.test.ts` — ganti inline `require("child_process")` dengan ES import di top-level untuk menghilangkan ESLint error `@typescript-eslint/no-require-imports`
- `src/app/(marketing)/_components/LandingPage.tsx` — escape karakter `"` di JSX text content menjadi `&ldquo;` dan `&rdquo;` untuk menghilangkan ESLint error `react/no-unescaped-entities`

### Changes
- `npm run typecheck` — lulus tanpa error (exit code 0)
- `npm run lint` — lulus tanpa error setelah fix (exit code 0, 13 warnings pre-existing)
- `npm test` — 108 tests lulus di 6 test files (exit code 0)
- `mock-data.ts` masih intact dan digunakan oleh `/projects`, `/projects/[id]`, dan komponen terkait
- `DashboardPage.tsx` tidak mengimpor `getDashboardSummary` atau `getProjects` dari `mock-data.ts`
- `page.tsx` memanggil `getDashboardData` dan meneruskan `data` ke `DashboardPage`

### Risks
- Low — hanya perbaikan lint, tidak ada perubahan logika atau behavior

### Dependencies
- None

---

## 2026-05-27 — Chore: DB Migration — tambah kolom `target_date` dan `completed_at` ke tabel `projects` (Task 1)

### Modified
- `drizzle/meta/_journal.json` — tambah entry idx 2 untuk `0002_dashboard_columns`
- `drizzle/meta/0002_snapshot.json` — buat snapshot baru yang mencerminkan schema setelah migration

### Added
- `drizzle/meta/0002_snapshot.json` — snapshot schema setelah penambahan kolom `target_date` dan `completed_at`

### Changes
- Kolom `target_date date` (nullable) dan `completed_at timestamp` (nullable) ditambahkan ke tabel `projects` di Neon database via `npx drizzle-kit push`
- Journal Drizzle diperbarui untuk mencatat migration `0002_dashboard_columns` sebagai entry idx 2
- Snapshot `0002_snapshot.json` dibuat untuk melengkapi tracking migration

### Risks
- Low — penambahan kolom nullable tidak mempengaruhi data atau query yang sudah ada

### Dependencies
- None

---

## 2026-05-27 — Feature: Modifikasi dashboard page.tsx untuk memanggil getDashboardData (Task 10.1)

### Modified
- `src/app/(app)/dashboard/page.tsx` — Diubah menjadi async Server Component; memanggil `requireRole("contractor")` dan `getDashboardData(user.id)`, lalu meneruskan hasilnya sebagai props ke `DashboardPage`

### Changes
- Page component sekarang async dan mengambil data riil dari database via `getDashboardData`
- `requireRole("contractor")` memastikan hanya kontraktor yang bisa mengakses halaman ini; redirect otomatis jika tidak terautentikasi
- Exception dibiarkan propagate ke Next.js error boundary (`error.tsx`) — tidak ada try-catch di page level

### Risks
- Low — perubahan minimal, hanya mengganti stub 3-baris dengan pola async server component yang sudah dirancang di design.md

### Dependencies
- None

---

## 2026-05-27 — Feature: Buat seed script idempoten untuk akun demo (Task 12.1, 12.2)

### Added
- `scripts/seed-demo.ts` — Seed script idempoten untuk akun demo `arenoe.studio@gmail.com`. Menyeed 3 proyek (active/delayed/completed), 16 daily_reports, 10 activity_logs, dan 5 project_members. Tidak menyeed portfolio_entries untuk proyek completed (memicu success reminder). Semua insert menggunakan cek eksplisit sebelum insert untuk idempotency.

### Modified
- `package.json` — Tambah script `"seed:demo": "tsx scripts/seed-demo.ts"`

### Changes
- Seed script menggunakan relative import `../src/lib/db` dan `../src/lib/db/schema` (bukan path alias `@/`) karena dijalankan via `tsx` di luar konteks Next.js
- Idempotency strategy: projects (name + ownerId), daily_reports (projectId + DATE(createdAt)), activity_logs (actorId + action + targetId + DATE(createdAt)), project_members (projectId + name)
- Data dirancang untuk memicu semua tipe reminder: danger (project1 tanpa laporan hari ini), warning (project1 deadline 5 hari, project2 deadline sudah lewat), success (project3 completed tanpa portfolio)

### Risks
- Low — script hanya dijalankan secara manual, tidak ada perubahan pada kode aplikasi

### Dependencies
- None (tsx sudah tersedia sebagai transitive dependency via drizzle-kit)

---

## 2026-05-27 — Feature: Modifikasi DashboardPage.tsx untuk menerima DashboardSummary sebagai props (Task 9.1)

### Modified
- `src/app/(app)/_components/DashboardPage.tsx` — refactor dari komponen tanpa props menjadi presentational component yang menerima `DashboardSummary`

### Changes
- Ubah signature: `DashboardPage()` → `DashboardPage({ data }: { data: DashboardSummary })`
- Import `DashboardSummary` dari `@/features/dashboard/types`
- Hapus import `getDashboardSummary` dan `getProjects` dari `./mock-data`
- Pertahankan import `getStatusBadgeVariant` dan `getStatusLabel` dari `./mock-data` (masih dibutuhkan untuk render badge)
- Tambah import `EmptyState` dari `./ui`
- Ganti semua referensi `summary.*` dan `activeProjects` dengan field dari `data.*`
- Blok A: tanggal dinamis via `new Date().toLocaleDateString("id-ID", ...)`, greeting dari `data.greetingLabel`, nama dari `data.fullName`
- Blok B: KPI helper texts dinamis berdasarkan `data.nearDeadlineProjects.length` dan `data.pendingReportCount`
- Blok C: empty state jika `data.reminders.length === 0`
- Blok D: ganti `project.owner` → `project.ownerName`, handle nullable `daysRemaining` (null/negatif/0/positif)
- Blok E: empty state jika `data.activities.length === 0`, tampilkan banner jika `data.activityLoadError`
- Blok F (Shortcuts): ganti hardcoded project-specific URLs dengan generic links (`/projects`, `/projects/new`)
- Baris bawah: ganti hardcoded values dengan `data.nearestDeadlineDays`, `data.photosToday`, `data.materialsRecordedTotal`, `data.activeMemberCount`
- Req 10.1: full onboarding empty state jika `activeProjectCount === 0 && finishedThisMonth === 0`
- Req 10.3: project limit banner + disabled "Buat Proyek Baru" button jika `data.isProjectLimitReached`
- Req 10.5: Blok D empty state jika `data.activeProjects.length === 0` (tapi user punya proyek lain)

### Risks
- Low — perubahan terisolasi pada satu komponen presentational; `page.tsx` akan menghasilkan TS error sementara sampai task 10.1 diimplementasikan

### Dependencies
- None

---

## 2026-05-27 — Feature: Buat error.tsx untuk dashboard route (Task 11.1)

### Added
- `src/app/(app)/dashboard/error.tsx` — error boundary client component untuk route `/dashboard`

### Changes
- Menggunakan `"use client"` directive sesuai persyaratan Next.js App Router untuk error boundaries
- Menerima props `{ error: Error & { digest?: string }, reset: () => void }` sesuai Next.js API
- Menampilkan pesan error user-friendly dalam Bahasa Indonesia dengan ikon `AlertTriangle`
- Tombol "Coba Lagi" memanggil `reset()` untuk retry render
- Menampilkan `error.digest` jika tersedia untuk memudahkan debugging
- Menggunakan `SurfaceCard` dari `../_components/ui` untuk konsistensi visual
- Tombol menggunakan styling inline yang konsisten dengan design system (accent orange `#F97316`)
- `useEffect` untuk log error ke console tanpa mengekspos ke user

### Risks
- Low — file baru, tidak mengubah kode produksi yang ada

### Dependencies
- None

## 2026-05-27 — Feature: Buat dashboard-service.test.ts dengan integration tests (Task 7.2)

### Added
- `src/features/dashboard/__tests__/dashboard-service.test.ts` — integration tests untuk `getDashboardData` dengan mock Drizzle db

### Changes
- Menggunakan `vi.hoisted()` untuk membuat `mockDb` dan `mockReturnQueue` yang tersedia di factory `vi.mock`
- Queue-based mock: setiap call ke `db.select()` mengambil data dari antrian, memungkinkan kontrol per-query
- 3 unit integration tests: user dengan proyek, user tanpa proyek, activity_logs query gagal
- 3 property-based tests (Properties 2, 3, 4): activeProjectCount, reportCompletionToday format, averageProgress
- Semua 108 tests lulus (6 tests baru + 102 existing)

### Risks
- Low — file baru, tidak mengubah kode produksi

### Dependencies
- None

## 2026-05-27 — Feature: Buat dashboard-service.ts dengan getDashboardData (Task 7.1)

### Added
- `src/features/dashboard/dashboard-service.ts` — fungsi utama `getDashboardData(userId: string): Promise<DashboardSummary>`

### Changes
- Mengimplementasikan 3-step aggregation: query users + projects (sequential) → 4 paralel queries (daily_reports, activity_logs, project_members, portfolio_entries) → agregasi ke DashboardSummary
- Early return dengan semua nilai 0 jika user belum punya proyek (Req 1.5)
- Partial failure pattern untuk activity_logs: try-catch internal, return `activityLoadError: true` jika gagal (Req 6.6)
- Graceful degradation untuk photosToday dan materialsRecordedTotal (return 0, tabel belum ada) (Req 7.2, 7.3)
- Success reminders untuk completed projects tanpa portfolio entry ditangani di service (bukan di buildReminders) karena buildReminders hanya menerima active/delayed projects
- subscriptionTier diambil dari query users table karena DbUser dari session tidak menyertakannya
- `npx tsc --noEmit` lulus tanpa error

### Risks
- Medium — fungsi utama service layer; belum diintegrasikan ke page.tsx (Task 10.1) dan DashboardPage.tsx (Task 9.1)

### Dependencies
- None

---

## 2026-05-27 — Feature: Buat helpers.unit.test.ts untuk fitur dashboard (Task 5.1)

### Added
- `src/features/dashboard/__tests__/helpers.unit.test.ts` — unit tests edge cases untuk semua 7 helper functions

### Changes
- 54 test cases mencakup boundary values untuk `getGreetingLabel`, `formatRelativeTime`, `calcDaysRemaining`, `buildReminders`, `sortActiveProjects`, `mapActionLabel`, dan `isAtProjectLimit`
- Semua 54 tests lulus (vitest run)

### Risks
- Low — hanya menambah file test baru, tidak mengubah kode produksi

### Dependencies
- None

---

## 2026-05-27 — Feature: Buat helpers.ts untuk fitur dashboard (Task 4.1)

### Added
- `src/features/dashboard/helpers.ts` — semua pure helper functions untuk dashboard service

### Changes
- Implementasi 8 pure functions: `toWIB`, `getGreetingLabel`, `formatRelativeTime`, `calcDaysRemaining`, `buildReminders`, `sortActiveProjects`, `mapActionLabel`, `isAtProjectLimit`
- Definisi tipe internal `RawProject` dan `BuildReminderParams` di file yang sama
- Tidak ada dependency eksternal — konversi WIB dilakukan manual dengan offset +7 jam
- `buildReminders` menghasilkan reminder danger/warning, diurutkan berdasarkan prioritas, dibatasi 5 item
- `sortActiveProjects` menempatkan delayed sebelum active, null targetDate di akhir
- `isAtProjectLimit` mendukung tier free (1), pro (3), business (unlimited)

### Risks
- Low — file baru, tidak mengubah file yang sudah ada

### Dependencies
- None

---

## 2026-05-26 — Feature: Buat types.ts untuk fitur dashboard (Task 3.1)

### Added
- `src/features/dashboard/types.ts` — Definisi semua tipe TypeScript untuk fitur dashboard real data

### Changes
- Mendefinisikan `ReminderType` union type: `"danger" | "warning" | "success" | "info"`
- Mendefinisikan `DashboardReminder` untuk item reminder Blok C
- Mendefinisikan `DashboardActivity` untuk item aktivitas Blok E (termasuk field `time` string dan `createdAt` Date)
- Mendefinisikan `ActiveProjectItem` untuk item proyek aktif Blok D (progress 0–100, targetDate nullable, daysRemaining nullable)
- Mendefinisikan `NearDeadlineProject` untuk KPI near-deadline Blok B
- Mendefinisikan `DashboardSummary` agregat lengkap: Blok A (greeting), Blok B (KPI), Blok C (reminders), Blok D (activeProjects), Blok E (activities + activityLoadError), secondary stats, dan state flags

### Risks
- Low — file baru, tidak mengubah file yang sudah ada

### Dependencies
- None

---

## 2026-05-26 — Feature: Tambah kolom targetDate dan completedAt ke tabel projects (Task 2.1)

### Modified
- `src/lib/db/schema.ts` — Tambah `date` ke import list; tambah `targetDate: date("target_date")` dan `completedAt: timestamp("completed_at")` (keduanya nullable) ke definisi tabel `projects`

### Added
- `drizzle/0002_dashboard_columns.sql` — Migration file: `ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "target_date" date, ADD COLUMN IF NOT EXISTS "completed_at" timestamp`

### Changes
- Kolom `target_date` (date, nullable) dibutuhkan untuk fitur near-deadline detection dan sorting proyek aktif berdasarkan urgensi
- Kolom `completed_at` (timestamp, nullable) dibutuhkan untuk menghitung `finishedThisMonth` (proyek selesai bulan ini)
- Tidak ada perubahan pada kolom yang sudah ada; semua kolom existing tetap utuh

### Risks
- Low — penambahan kolom nullable tidak mempengaruhi query atau kode yang sudah ada; migration menggunakan `IF NOT EXISTS` sehingga aman dijalankan ulang

### Dependencies
- None

---

## 2026-05-26 04:19 — Chore: Perbaikan AGENTS.md dan koreksi tanggal CHANGELOG

### Modified
- `AGENTS.md` — Restrukturisasi penuh: format markdown proper, section bernomor, tabel, contoh format changelog yang benar
- `docs/CHANGELOG.md` — Koreksi tanggal yang salah (2026-07-14 → 2026-05-25, 2025-01-27 → 2026-05-25); tambah jam ke semua entry

### Changes
- AGENTS.md sekarang menggunakan markdown headers, tabel, dan code block yang proper
- Semua section diberi nomor untuk referensi yang mudah
- Changelog entry format diperbarui dengan contoh yang mencakup jam
- Tanggal `2026-07-14` (masa depan) dan `2025-01-27` (tidak konsisten) dikoreksi ke `2026-05-25` sesuai urutan kerja aktual

### Risks
- Low — dokumentasi only, tidak ada perubahan kode

### Dependencies
- None

---

## 2026-05-26 03:45 — Bugfix: Marketing links, DB connection, Resend lazy init, UI text color

### Modified
- `src/app/(marketing)/_components/LandingPage.tsx` — `/daftar` → `/register`, `/masuk` → `/login`
- `src/app/(marketing)/_components/marketing-ui.tsx` — `/daftar` → `/register`, `/masuk` → `/login`
- `src/app/(marketing)/_components/HargaPage.tsx` — `/daftar` → `/register`
- `src/app/(marketing)/_components/DirectoriPage.tsx` — `/daftar` → `/register`
- `src/lib/db/index.ts` — Ganti `neon()` HTTP driver ke `Pool` WebSocket mode; lazy init via Proxy; ws adapter untuk Node.js lokal
- `src/lib/services/email-otp-service.ts` — Lazy init Resend client (fix build error saat env var belum tersedia); tambah error logging
- `src/features/auth/actions.ts` — Teruskan `result.message` asli dari service ke UI (sebelumnya selalu override dengan pesan generik)
- `src/features/auth/components/auth-shell.tsx` — Tambah `text-white` eksplisit pada `h2` brand panel

### Changes
- Semua tombol "Masuk" dan "Daftar" di halaman marketing sekarang mengarah ke route yang benar (`/login`, `/register`)
- Koneksi DB beralih dari HTTP fetch (gagal di Windows/Node.js) ke WebSocket Pool — lebih reliable di local dev
- Resend dan DB tidak lagi diinisialisasi saat module load (fix build error di Vercel tanpa env vars)
- Error message dari auth service sekarang diteruskan ke UI untuk debugging yang lebih baik
- Teks heading brand panel di halaman auth sekarang putih eksplisit

### Risks
- Low — semua perubahan adalah bugfix dan UI fix
- `ws` package ditambahkan sebagai devDependency untuk WebSocket adapter di Node.js

### Dependencies
- Added: `ws`, `@types/ws` (devDependencies)

---

## 2026-05-25 23:30 — Feature: Real Authentication (DB + bcrypt + Resend Email OTP)

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

## 2026-05-25 22:50 — Cleanup: Hapus mock-auth-service (Task 10.1)

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

## 2026-05-25 22:10 — real-auth spec: Task 9.1 — Apply migration to Neon database

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

## 2026-05-25 21:20 — real-auth spec: Tasks 8.1–8.5 — UI Updates (phone → email, remove debugCode)

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
- Pre-existing TypeScript errors remain in mock files (mock-auth-service.ts, mock-data.ts, mock-services.ts) — carry-over from Tasks 3.x, resolved in Task 10.1

### Dependencies
- None

---

## 2026-05-25 20:30 — real-auth spec: Tasks 7.1 & 7.2 — Integration (actions.ts + session.ts)

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
- 6 pre-existing TS errors remain in mock files — scheduled for cleanup in task 10.1

### Dependencies
- None

---

## 2026-05-25 19:40 — real-auth spec: Task 6.5 — resendChallenge, startPasswordReset, resetPassword

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
- None

---

## 2026-05-25 18:50 — real-auth spec: Task 6.4 — verifyChallengeCode

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
  - Code correct, flow `"register"`: parse metadata JSON, Drizzle transaction (INSERT users + DELETE otp_challenges), inline `DbUser` mapping, return `{ success: true, challenge, user: newUser }`
  - Code correct, flow `"login"`: UPDATE `isVerified = true`, `findUserByEmail(challenge.email)`, return `{ success: true, challenge, user }`
  - Code correct, flow `"forgot-password"`: UPDATE `isVerified = true`, return `{ success: true, challenge, user: null }`
  - Entire function wrapped in try/catch

### Risks
- Low — only auth-service.ts modified
- 33 pre-existing TSC errors remain in other files — unrelated to task 6.4; will be resolved by tasks 7.x, 8.x, 10.x
- Zero diagnostics in auth-service.ts itself

### Dependencies
- None

---

## 2026-05-25 17:50 — real-auth spec: Tasks 6.2, 6.3 — startRegistration, loginWithPassword, startLoginOtp

### Modified
- `src/features/auth/auth-service.ts` — replaced three `throw new Error("Not implemented")` stubs with real implementations

### Changes
- Task 6.2: `startRegistration` — normalizes email, checks for duplicate via `findUserByEmail`, hashes OTP code (cost 10) and password (cost 12) in parallel, serializes metadata JSON (includes passwordHash, not plaintext password), INSERTs `otp_challenges` with `flow: "register"`, calls `emailOtpService.sendOtp` and rolls back (DELETE challenge) on send failure, returns `OtpChallengeSnapshot`
- Task 6.3a: `loginWithPassword` — normalizes email, fetches user+hash via `findUserByEmailWithHash`, checks suspended flag, verifies password with `bcryptjs.compare`, strips `passwordHash` from returned user via destructuring, determines `redirectTo` based on role (`/dashboard` for contractor, `/admin` for others), returns `{ success: true, user, result: LoginSuccess }`
- Task 6.3b: `startLoginOtp` — normalizes email, verifies user exists via `findUserByEmail`, checks suspended flag, generates+hashes OTP, INSERTs `otp_challenges` with `flow: "login"`, calls `emailOtpService.sendOtp` with rollback on failure, returns `OtpChallengeSnapshot`
- All three functions wrapped in try/catch returning `{ success: false, message: "Terjadi kesalahan sistem. Coba lagi." }`

### Risks
- Low — only auth-service.ts modified; no new files, no imports changed
- 33 pre-existing TSC errors remain in other files — unrelated to tasks 6.2/6.3; will be resolved by tasks 7.x, 8.x, 10.x
- Zero diagnostics in auth-service.ts itself

### Dependencies
- None

---

## 2026-05-25 16:50 — real-auth spec: Tasks 4.1, 5.1 — DB instance + Email OTP Service

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

## 2026-05-25 15:40 — real-auth spec: Tasks 3.1, 3.3, 3.4 — Core Types (auth types, contracts)

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

## 2026-05-25 14:30 — real-auth spec: Task 1.1 + 1.2 — Foundation (Dependencies & Env)

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
- Added: `bcryptjs@^3.0.3` (production)
- Added: `resend@^6.12.3` (production)
- Added: `@types/bcryptjs@^2.4.6` (dev)
- Added: `fast-check@^4.8.0` (dev)

---

## 2026-05-25 10:00 — Technical Debt Cleanup + Small Improvements

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
