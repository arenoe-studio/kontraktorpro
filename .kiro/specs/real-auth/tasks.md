# Implementation Plan: Real Authentication

## Overview

Menggantikan sistem autentikasi mock (in-memory) dengan implementasi nyata berbasis PostgreSQL (Neon + Drizzle ORM), `bcryptjs` untuk password hashing, dan `resend` untuk pengiriman OTP via email. Identifier login berubah dari `phone` ke `email`. Semua route, cookie name, Server Actions, dan arsitektur session tetap tidak berubah.

## Tasks

- [x] 1. Foundation — Install dependencies dan setup database
  - [x] 1.1 Install dependencies baru ke package.json
    - Jalankan: `npm install bcryptjs resend`
    - Jalankan: `npm install --save-dev @types/bcryptjs`
    - Jalankan: `npm install --save-dev fast-check`
    - Verifikasi semua package masuk ke `package.json` dengan versi yang di-pin
    - _Requirements: 7.5, 7.6_

  - [x] 1.2 Update file `.env.example` dengan variabel baru
    - Tambahkan `RESEND_API_KEY=re_xxxxxxxxxxxx` ke `.env.example`
    - Tambahkan `RESEND_FROM_EMAIL=noreply@kontraktorpro.id` ke `.env.example`
    - Pastikan `.env` lokal juga sudah diisi dengan nilai nyata (tidak di-commit)
    - _Requirements: 7.7_


- [x] 2. Schema Update — Perbarui Drizzle schema dan generate migrasi
  - [x] 2.1 Update `src/lib/db/schema.ts` — perbarui tabel `users` dan tambah tabel `otp_challenges`
    - Tambah kolom `email: varchar("email", { length: 255 }).notNull().unique()` ke tabel `users`
    - Ubah kolom `phone` dari `.notNull().unique()` menjadi nullable (hapus `.notNull()`, pertahankan `.unique()` atau hapus sesuai design)
    - Tambah kolom `suspended: boolean("suspended").default(false).notNull()` ke tabel `users`
    - Tambah kolom `firstLogin: boolean("first_login").default(true).notNull()` ke tabel `users`
    - Tambah `authIntentEnum` pgEnum dengan values `["register", "login", "forgot-password"]`
    - Tambah tabel `otpChallenges` dengan semua kolom sesuai design: `id`, `flow`, `email`, `codeHash`, `expiresAt`, `resendAvailableAt`, `resendCount`, `attemptsRemaining`, `lockedUntil`, `isVerified`, `metadata`, `createdAt`
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.10_

  - [x] 2.2 Generate migrasi Drizzle baru
    - Jalankan: `npm run db:generate`
    - Review file `drizzle/0001_real_auth.sql` yang dihasilkan — pastikan mencakup: ADD COLUMN email, ALTER phone nullable, ADD TABLE otp_challenges, CREATE TYPE auth_intent
    - Pastikan migrasi menggunakan strategi nullable-first untuk kolom `email` agar aman untuk data existing (lihat Migration Strategy di design.md)
    - Jangan ubah `drizzle/0000_tiny_guardian.sql` yang sudah ada
    - _Requirements: 1.3, 3.10_


- [x] 3. Core Types — Update types, schemas, dan contracts
  - [x] 3.1 Update `src/features/auth/types.ts`
    - Hapus tipe `MockUser` (seluruhnya)
    - Tambah tipe `DbUser` dengan field: `id`, `fullName`, `businessName`, `email`, `phone?`, `city`, `role: AuthRole`, `suspended: boolean`, `firstLogin: boolean`
    - Update tipe `OtpChallengeSnapshot`: ganti field `maskedPhone` → `maskedEmail`, hapus field `debugCode`
    - Update tipe `PasswordResetState`: ganti field `phone` → `email` (nullable)
    - Pertahankan tipe `AuthIntent`, `ActionResult`, `LoginSuccess` tanpa perubahan
    - _Requirements: 5.1, 5.8, 9.10_

  - [x] 3.2 Update `src/features/auth/schemas.ts` — ganti phone schema ke email schema
    - Hapus `phoneSchema` dan semua referensinya
    - Tambah `emailSchema: z.string().trim().email("Format email tidak valid.")`
    - Update `registerSchema`: ganti field `phone` → `email` menggunakan `emailSchema`
    - Update `loginSchema`: ganti field `phone` → `email` menggunakan `emailSchema`, hapus `mode` superRefine yang cek phone, sesuaikan untuk email
    - Ganti nama `forgotPasswordPhoneSchema` → `forgotPasswordEmailSchema` dengan field `email`
    - Update semua exported types: `RegisterFormValues`, `LoginFormValues`, `ForgotPasswordEmailValues`
    - _Requirements: 1.7, 1.8, 1.9_

  - [x] 3.3 Update `src/lib/contracts/types.ts` — tambah `email` ke tipe `User`
    - Tambah field `email: string` ke tipe `User`
    - Ubah field `phone: string` menjadi `phone?: string` (opsional)
    - _Requirements: 7.8_

  - [x] 3.4 Update `src/lib/services/contracts.ts` — update interface `AuthOtpService`
    - Ubah signature `sendOtp`: ganti parameter `phone: string` → `email: string`, tambah parameter `code: string`
    - Signature baru: `sendOtp(email: string, code: string): Promise<ActionResult<{ challengeId: string }>>`
    - _Requirements: 4.1_


- [x] 4. DB Layer — Buat Drizzle db instance dan query helpers
  - [x] 4.1 Buat `src/lib/db/index.ts` — Drizzle db instance dengan Neon driver
    - Import `neon` dari `@neondatabase/serverless`
    - Import `drizzle` dari `drizzle-orm/neon-http`
    - Import `* as schema` dari `./schema`
    - Buat `const sql = neon(process.env.DATABASE_URL!)`
    - Export `export const db = drizzle(sql, { schema })`
    - _Requirements: 2.10, 7.4_

  - [x] 4.2 Buat `src/lib/db/queries/users.ts` — query helpers untuk tabel `users`
    - Import `db` dari `../index`, import `users` table dari `../schema`
    - Implementasikan `findUserByEmail(email: string): Promise<DbUser | null>` — SELECT WHERE `lower(email) = lower($email)` menggunakan `sql` template atau normalisasi di aplikasi
    - Implementasikan `findUserById(id: string): Promise<DbUser | null>` — SELECT WHERE `id = $id` LIMIT 1
    - Implementasikan `createUser(data: NewUser): Promise<DbUser>` — INSERT returning
    - Implementasikan `updateUserPassword(userId: string, passwordHash: string): Promise<void>` — UPDATE SET password_hash
    - Tambah fungsi internal `mapDbRowToDbUser(row)` yang mengkonversi Drizzle row ke `DbUser` — pastikan `passwordHash` tidak pernah terekspos
    - _Requirements: 2.1, 2.8, 7.3_


- [x] 5. Email OTP Service — Implementasi Resend
  - [x] 5.1 Buat `src/lib/services/email-otp-service.ts`
    - Tambah `import "server-only"` di baris pertama
    - Import `Resend` dari `resend`
    - Import `AuthOtpService` dari `./contracts`
    - Buat instance `const resend = new Resend(process.env.RESEND_API_KEY)`
    - Buat konstanta `FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@kontraktorpro.id"`
    - Implementasikan `emailOtpService: AuthOtpService` dengan method `sendOtp(email, code)`
    - Method `sendOtp` memanggil `resend.emails.send()` dengan: `from: FROM_EMAIL`, `to: email`, `subject: "Kode Verifikasi KontraktorPro"`, `html: buildEmailHtml(code)`
    - Implementasikan `buildEmailHtml(code: string): string` — template HTML yang memuat kode OTP dan informasi "berlaku 15 menit"
    - Jika Resend API error: return `{ success: false, message: "Gagal mengirim email OTP. Coba lagi." }`
    - Jika berhasil: return `{ success: true, data: { challengeId: "" } }` (challengeId kosong — sudah dibuat oleh auth-service)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.9_


- [x] 6. Auth Service — Implementasi penuh auth-service.ts
  - [x] 6.1 Buat `src/features/auth/auth-service.ts` — struktur dasar dan konstanta
    - Tambah `import "server-only"` di baris pertama
    - Import `db` dari `@/lib/db/index`, import `otpChallenges`, `users` dari `@/lib/db/schema`
    - Import `bcryptjs` dari `bcryptjs`
    - Import `emailOtpService` dari `@/lib/services/email-otp-service`
    - Import tipe `DbUser`, `OtpChallengeSnapshot`, `AuthIntent`, `LoginSuccess` dari `./types`
    - Definisikan konstanta: `OTP_EXPIRY_MS = 15 * 60 * 1000`, `RESEND_COOLDOWN_MS = 60 * 1000`, `RESEND_LIMIT = 3`, `ATTEMPT_LIMIT = 5`, `LOCK_DURATION_MS = 10 * 60 * 1000`, `BCRYPT_COST_PASSWORD = 12`, `BCRYPT_COST_OTP = 10`
    - Implementasikan fungsi internal: `normalizeEmail(email)`, `maskEmail(email)` → format `b***@gmail.com`, `generateOtpCode()`, `mapChallengeToSnapshot(challenge)` → `OtpChallengeSnapshot` tanpa debugCode
    - _Requirements: 2.1, 5.3, 7.1_

  - [x] 6.2 Implementasikan `startRegistration` di `auth-service.ts`
    - Normalize email, query `findUserByEmail` — jika ada return `{ success: false, fieldErrors: { email: "Email sudah terdaftar. Silakan masuk." } }`
    - Generate OTP code, hash code dengan `bcryptjs.hash(code, BCRYPT_COST_OTP)`, hash password dengan `bcryptjs.hash(password, BCRYPT_COST_PASSWORD)`
    - Serialize `{ fullName, businessName, email, city, passwordHash }` ke JSON → `metadata`
    - INSERT ke `otp_challenges` dengan semua kolom termasuk `expiresAt = now + 15min`, `resendAvailableAt = now + 60s`
    - Panggil `emailOtpService.sendOtp(email, code)` — jika gagal, DELETE challenge yang baru dibuat dan return error
    - Return `{ success: true, challenge: mapChallengeToSnapshot(record) }`
    - Bungkus seluruh logika dalam try/catch — catch return `{ success: false, message: "Terjadi kesalahan sistem. Coba lagi." }`
    - _Requirements: 2.2, 2.4, 2.7, 2.11, 3.4, 3.5, 4.7_

  - [x] 6.3 Implementasikan `loginWithPassword` dan `startLoginOtp` di `auth-service.ts`
    - `loginWithPassword(email, password)`: normalize email → `findUserByEmail` → jika tidak ada return `fieldErrors.email` → cek `suspended` → `bcryptjs.compare(password, user.passwordHash)` → jika salah return `fieldErrors.password` → return `{ success: true, user, result: LoginSuccess }`
    - `startLoginOtp(email)`: normalize email → `findUserByEmail` → cek suspended → INSERT `otp_challenges` (flow: "login") → `emailOtpService.sendOtp(email, code)` → return snapshot
    - Kedua fungsi dibungkus try/catch
    - _Requirements: 2.1, 2.3, 2.11, 8.2, 8.3, 8.4_

  - [x] 6.4 Implementasikan `verifyChallengeCode` di `auth-service.ts`
    - SELECT `otp_challenges` WHERE id = challengeId
    - Validasi: tidak ada → error, `isVerified = true` atau `expiresAt < now` → error "Sesi OTP tidak valid atau sudah kedaluwarsa.", `lockedUntil > now` → error dengan sisa menit
    - `bcryptjs.compare(inputCode, codeHash)` — jika false: decrement `attemptsRemaining`, jika 0 set `lockedUntil`, UPDATE DB, return error dengan sisa percobaan
    - Jika kode benar — flow `"register"`: parse metadata, BEGIN TRANSACTION, INSERT users, DELETE otp_challenges, COMMIT, return `{ success: true, challenge, user: newUser }`
    - Jika kode benar — flow `"login"`: UPDATE `is_verified = true`, SELECT user by email, return `{ success: true, challenge, user }`
    - Jika kode benar — flow `"forgot-password"`: UPDATE `is_verified = true`, return `{ success: true, challenge, user: null }`
    - _Requirements: 2.5, 2.6, 3.3, 3.7, 3.8, 3.9, 8.5, 8.6, 8.7_

  - [x] 6.5 Implementasikan `resendChallenge`, `startPasswordReset`, `resetPassword`, `getUserById`, `getChallengeSnapshot` di `auth-service.ts`
    - `resendChallenge(challengeId)`: SELECT challenge → cek locked → cek resend limit (return "Batas pengiriman ulang tercapai.") → cek cooldown (return "Kirim ulang dalam N detik.") → generate kode baru, hash, UPDATE DB (`codeHash`, `expiresAt`, `resendAvailableAt`, `resendCount += 1`, reset `attemptsRemaining`, clear `lockedUntil`) → `emailOtpService.sendOtp()` → return snapshot
    - `startPasswordReset(email)`: normalize → `findUserByEmail` → jika tidak ada return `fieldErrors.email: "Email ini tidak terdaftar."` → INSERT otp_challenges (flow: "forgot-password") → sendOtp → return `{ success: true, challenge, email }`
    - `resetPassword(challengeId, nextPassword)`: SELECT challenge → validasi flow = "forgot-password" dan `isVerified = true` → `findUserByEmail(challenge.email)` → `bcryptjs.hash(nextPassword, BCRYPT_COST_PASSWORD)` → `updateUserPassword()` → DELETE otp_challenges → return `{ success: true, email }`
    - `getUserById(userId)`: SELECT users WHERE id = userId LIMIT 1 → return `mapDbRowToDbUser(row)` atau null
    - `getChallengeSnapshot(challengeId)`: SELECT otp_challenges WHERE id → return `mapChallengeToSnapshot(row)` atau null — pastikan tidak ada debugCode di output
    - _Requirements: 2.1, 2.8, 2.9, 3.5, 3.6, 4.8, 5.3, 8.8, 8.9, 8.10_


- [x] 7. Integration — Update actions.ts dan session.ts
  - [x] 7.1 Update `src/features/auth/actions.ts` — ganti import dan update cookie security
    - Ganti semua import dari `./mock-auth-service` → import dari `./auth-service`
    - Ganti import `forgotPasswordPhoneSchema` → `forgotPasswordEmailSchema` dari `./schemas`
    - Update `registerAction`: ganti `phone` → `email` di destructuring `parsed.data`, update pesan sukses "Kode OTP dikirim ke email Anda."
    - Update `loginWithPasswordAction`: ganti `parsed.data.phone` → `parsed.data.email`
    - Update `requestLoginOtpAction`: ganti `parsed.data.phone` → `parsed.data.email`
    - Update `requestPasswordResetAction`: ganti `parsed.data.phone` → `parsed.data.email`
    - Update `resetPasswordAction`: ganti return `redirectTo: /login?phone=...` → `/login?email=...`, ganti field `phone` → `email` di return data
    - Update `verifyPasswordResetOtpAction`: ganti `maskedPhone` → `maskedEmail` di state
    - Update `resendPasswordResetOtpAction`: sesuaikan tipe `PasswordResetState` (phone → email)
    - Set `secure: true` pada SEMUA tiga helper cookie: `setSessionCookie`, `setOtpCookie`, `setResetCookie`
    - _Requirements: 5.4, 5.5, 6.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 7.2 Update `src/lib/auth/session.ts` — ganti import dari mock ke auth-service
    - Ganti `import { getUserById } from "@/features/auth/mock-auth-service"` → `import { getUserById } from "@/features/auth/auth-service"`
    - Ganti `import type { AuthRole, MockUser }` → `import type { AuthRole, DbUser }` dari `@/features/auth/types`
    - Update return type `getCurrentUser(): Promise<DbUser | null>`
    - Update return type `requireAuth(): Promise<DbUser>`
    - Update return type `requireRole(): Promise<DbUser>`
    - Pertahankan semua logika redirect dan guard tanpa perubahan
    - _Requirements: 5.7, 6.1, 6.2, 6.3, 6.4, 6.5_


- [x] 8. UI Updates — Update semua form component (phone → email, hapus debugCode)
  - [x] 8.1 Update `src/features/auth/components/register-form.tsx`
    - Ganti field "Nomor HP" → field "Email" dengan `id="email"`, `type="email"`, `inputMode="email"`, `placeholder="nama@email.com"`
    - Ganti `{...register("phone")}` → `{...register("email")}`
    - Ganti `errors.phone` → `errors.email`
    - Update helper text: hapus "Nomor ini akan digunakan untuk login dan verifikasi OTP." → "Email ini akan digunakan untuk login dan menerima kode OTP."
    - Update tipe `RegisterFormValues` yang digunakan (sudah diupdate di task 3.2)
    - _Requirements: 1.4_

  - [x] 8.2 Update `src/features/auth/components/login-form.tsx`
    - Ganti prop `defaultPhone?: string` → `defaultEmail?: string`
    - Ganti field "Nomor HP" → field "Email" dengan `id="email"`, `type="email"`, `inputMode="email"`, `placeholder="nama@email.com"`
    - Ganti `{...register("phone")}` → `{...register("email")}`
    - Ganti `errors.phone` → `errors.email`
    - Update `defaultValues`: ganti `phone: defaultPhone ?? ""` → `email: defaultEmail ?? ""`
    - Update description card: ganti "nomor HP aktif" → "email aktif"
    - _Requirements: 1.5_

  - [x] 8.3 Update `src/features/auth/components/otp-verification-form.tsx`
    - Hapus seluruh blok yang menampilkan `challengeState.debugCode` di footer FormCard
    - Ganti `challengeState.maskedPhone` → `challengeState.maskedEmail` di description
    - Update subtitle: ganti "ke nomor HP Anda" → "ke email Anda"
    - Update footer FormCard: ganti teks debug dengan teks informatif biasa (misal: "Periksa inbox email Anda. Kode berlaku 15 menit.")
    - _Requirements: 5.2_

  - [x] 8.4 Update `src/features/auth/components/forgot-password-flow.tsx`
    - Ganti field "Nomor HP" → field "Email" dengan `id="email"`, `type="email"`, `placeholder="nama@email.com"`
    - Ganti `{...phoneForm.register("phone")}` → `{...phoneForm.register("email")}`
    - Ganti `phoneForm.formState.errors.phone` → `phoneForm.formState.errors.email`
    - Hapus blok yang menampilkan `state.challenge.debugCode` di step 2
    - Update tipe form: ganti `ForgotPasswordPhoneValues` → `ForgotPasswordEmailValues`
    - Update import schema: ganti `forgotPasswordPhoneSchema` → `forgotPasswordEmailSchema`
    - Update step labels array: ganti `"Masukkan Nomor HP"` → `"Masukkan Email"`
    - Update description step 1: ganti "nomor HP terdaftar" → "email terdaftar"
    - Update state `phone` → `email` di `PasswordResetState` yang digunakan
    - _Requirements: 1.6, 5.2_

  - [x] 8.5 Update halaman login `src/app/(auth)/login/page.tsx` — sesuaikan prop
    - Cari penggunaan prop `defaultPhone` di LoginPage (kemungkinan membaca `searchParams.phone`)
    - Ganti `searchParams.phone` → `searchParams.email`
    - Ganti prop `defaultPhone` → `defaultEmail` saat merender `<LoginForm>`
    - _Requirements: 9.5_


- [x] 9. Migration — Apply migrasi ke Neon database
  - [x] 9.1 Apply migrasi `0001_real_auth.sql` ke Neon
    - Pastikan `DATABASE_URL` di `.env` sudah mengarah ke Neon database yang benar
    - Jalankan: `npx drizzle-kit migrate`
    - Verifikasi tabel `otp_challenges` berhasil dibuat di Neon
    - Verifikasi kolom `email`, `suspended`, `first_login` berhasil ditambahkan ke tabel `users`
    - Verifikasi kolom `phone` sudah nullable
    - _Requirements: 1.3, 3.10_

- [x] 10. Cleanup — Hapus mock service dan finalisasi
  - [x] 10.1 Hapus file `src/features/auth/mock-auth-service.ts`
    - Verifikasi tidak ada import yang tersisa ke `mock-auth-service` di seluruh codebase (grep untuk `mock-auth-service`)
    - Verifikasi `actions.ts` sudah import dari `auth-service`
    - Verifikasi `session.ts` sudah import dari `auth-service`
    - Hapus file setelah semua import diverifikasi bersih
    - _Requirements: 2.9, 5.6_


- [x] 11. Tests — Property-based tests dan unit tests
  - [x] 11.1 Buat `src/features/auth/__tests__/auth-service.property.test.ts` — property tests murni (tanpa DB)
    - Setup: import `fast-check` sebagai `fc`, import `bcryptjs`, import schema dari `schemas.ts`
    - Implementasikan **Property 1**: validasi email schema — `fc.assert(fc.property(fc.string(), (s) => { ... }))` — verifikasi `emailSchema.safeParse(s).success` hanya true untuk email valid
    - Implementasikan **Property 3**: bcryptjs hash round-trip — `fc.asyncProperty(fc.string({ minLength: 1 }), async (value) => { const hash = await bcryptjs.hash(value, 10); expect(await bcryptjs.compare(value, hash)).toBe(true); })`
    - Implementasikan **Property 7**: OTP tidak pernah terekspos — mock `getChallengeSnapshot`, verifikasi return tidak mengandung `debugCode`, `codeHash`, atau kode plaintext
    - Setiap property dijalankan minimal 100 iterasi: `{ numRuns: 100 }`
    - Tag setiap test: `// Feature: real-auth, Property N: <property_text>`
    - _Requirements: 1.7, 2.3, 2.7, 3.2, 3.3, 5.1, 5.2, 5.3_

  - [ ]* 11.2 Buat `src/features/auth/__tests__/auth-service.property.test.ts` — property tests dengan DB (integration)
    - Setup test database connection, `beforeEach` cleanup `otp_challenges` dan `users` tables
    - Implementasikan **Property 2**: lookup email case-insensitive — `fc.asyncProperty(fc.emailAddress(), async (email) => { ... })` — insert user dengan email lowercase, lookup dengan uppercase/mixed-case harus return user yang sama
    - Implementasikan **Property 4**: register flow round-trip — `fc.asyncProperty(validRegistrationArb, async (data) => { ... })` — full startRegistration → verifyChallengeCode, verifikasi user ada di DB dan challenge sudah dihapus
    - Implementasikan **Property 5**: penolakan email duplikat — insert user, panggil `startRegistration` dengan email sama, verifikasi selalu return `fieldErrors.email`
    - Implementasikan **Property 6**: rate limiting invariant — verifikasi `resend_count <= 3`, `attempts_remaining` berkurang tepat 1, `locked_until` diset saat attempts = 0
    - Implementasikan **Property 8**: session round-trip — insert user, panggil `getUserById`, verifikasi data identik
    - Implementasikan **Property 9**: login credential validation — verifikasi email tidak ada → `fieldErrors.email`, password salah → `fieldErrors.password`
    - Implementasikan **Property 10**: forgot password email validation — verifikasi email tidak terdaftar → `fieldErrors.email`
    - Implementasikan **Property 11**: resend menghasilkan kode baru — verifikasi `codeHash` berubah setelah resend
    - `afterEach` cleanup semua test data
    - _Requirements: 1.10, 2.2, 2.4, 2.5, 2.6, 3.6, 3.7, 6.1, 6.3, 8.1, 8.2, 8.3, 8.5, 8.10, 4.8_

  - [ ]* 11.3 Buat `src/features/auth/__tests__/auth-service.test.ts` — unit tests spesifik
    - Test `startRegistration` dengan email yang sudah ada → return `fieldErrors.email` yang benar
    - Test `loginWithPassword` dengan akun `suspended = true` → return message error yang benar
    - Test `verifyChallengeCode` dengan challenge expired → return error "Kode sudah kedaluwarsa."
    - Test `verifyChallengeCode` dengan challenge locked → return error dengan sisa menit
    - Test `resendChallenge` sebelum cooldown selesai → return error "Kirim ulang dalam N detik."
    - Test `resendChallenge` setelah resend limit → return "Batas pengiriman ulang tercapai."
    - Test `resetPasswordAction` → `redirectTo` berisi `?email=` bukan `?phone=`
    - _Requirements: 2.2, 3.6, 3.7, 3.9, 8.4, 8.6, 8.7, 8.8, 8.9, 9.5_

  - [ ]* 11.4 Buat `src/lib/services/__tests__/email-otp-service.test.ts` — unit tests email service
    - Mock Resend client dengan `vi.mock("resend")`
    - Test `sendOtp` berhasil → return `{ success: true, data: { challengeId: "" } }`
    - Test `sendOtp` ketika Resend API error → return `{ success: false, message: "Gagal mengirim email OTP. Coba lagi." }`
    - Verifikasi `resend.emails.send` dipanggil dengan subject "Kode Verifikasi KontraktorPro"
    - Verifikasi body email mengandung kode OTP yang diberikan
    - Verifikasi `FROM_EMAIL` digunakan sebagai sender
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 12. Checkpoint — Verifikasi TypeScript dan semua tests pass
  - Jalankan TypeScript check: `npm run typecheck` — pastikan zero errors
  - Jalankan test suite: `npm test` — pastikan semua tests pass
  - Verifikasi tidak ada import ke `mock-auth-service` yang tersisa
  - Verifikasi tidak ada referensi `debugCode` yang tersisa di UI components
  - Verifikasi tidak ada referensi `maskedPhone` yang tersisa (sudah diganti `maskedEmail`)
  - Verifikasi tidak ada `secure: false` yang tersisa di cookie helpers
  - Tanyakan ke user jika ada pertanyaan sebelum melanjutkan.


## Notes

- Tasks bertanda `*` adalah opsional dan bisa dilewati untuk implementasi MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceability
- **Wave 1 (Foundation)** harus selesai sebelum wave lain — dependencies npm dan env vars dibutuhkan semua task
- **Wave 2 (Schema)** harus selesai sebelum DB layer — schema.ts adalah sumber kebenaran untuk semua query
- **Wave 3 (Types)** bisa paralel dengan Wave 2 — tidak ada dependency antar keduanya
- **Wave 4 (DB Layer)** bergantung pada Wave 2 (schema) dan Wave 3 (types)
- **Wave 5 (Email OTP Service)** bergantung pada Wave 3 (contracts.ts diupdate)
- **Wave 6 (Auth Service)** bergantung pada Wave 4 dan Wave 5 — ini adalah task terbesar
- **Wave 7 (Integration)** bergantung pada Wave 6 — actions.ts dan session.ts import dari auth-service
- **Wave 8 (UI)** bergantung pada Wave 3 (types/schemas) — bisa paralel dengan Wave 6 dan 7
- **Wave 9 (Migration)** bergantung pada Wave 2 — apply SQL ke Neon
- **Wave 10 (Cleanup)** bergantung pada Wave 7 — hapus mock hanya setelah semua import diganti
- **Wave 11 (Tests)** bergantung pada semua implementasi selesai
- Property tests untuk DB (11.2) memerlukan test database — gunakan Neon branch terpisah atau local PostgreSQL
- Property tests murni (11.1) tidak memerlukan DB dan bisa dijalankan kapan saja
- `fast-check` menggunakan `fc.emailAddress()` untuk generate email valid secara otomatis
- Jangan ubah `drizzle/0000_tiny_guardian.sql` — hanya tambah migrasi baru `0001_real_auth.sql`
- Cookie names (`kp-auth-session`, `kp-auth-otp`, `kp-auth-reset`) TIDAK berubah
- Semua route TIDAK berubah
- `next-auth` yang sudah terinstall tetap tidak digunakan — jangan aktifkan

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "3.1", "3.3", "3.4"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "3.2"]
    },
    {
      "id": 3,
      "tasks": ["4.1", "5.1"]
    },
    {
      "id": 4,
      "tasks": ["4.2"]
    },
    {
      "id": 5,
      "tasks": ["6.1"]
    },
    {
      "id": 6,
      "tasks": ["6.2", "6.3"]
    },
    {
      "id": 7,
      "tasks": ["6.4"]
    },
    {
      "id": 8,
      "tasks": ["6.5"]
    },
    {
      "id": 9,
      "tasks": ["7.1", "7.2", "8.1", "8.2", "8.3", "8.4", "8.5", "9.1"]
    },
    {
      "id": 10,
      "tasks": ["10.1"]
    },
    {
      "id": 11,
      "tasks": ["11.1", "11.3", "11.4"]
    },
    {
      "id": 12,
      "tasks": ["11.2"]
    }
  ]
}
```
