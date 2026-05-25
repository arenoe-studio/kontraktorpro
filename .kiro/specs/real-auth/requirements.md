# Requirements Document

## Introduction

Fitur **Real Authentication** menggantikan seluruh sistem autentikasi mock (in-memory) pada KontraktorPro dengan implementasi nyata berbasis database PostgreSQL (Neon + Drizzle ORM), password hashing via `bcryptjs`, dan pengiriman OTP via email menggunakan layanan Resend.

Perubahan utama mencakup:
- Penggantian identifier login dari nomor HP (`phone`) ke alamat email (`email`)
- Penggantian `mock-auth-service.ts` dengan `auth-service.ts` yang melakukan query ke DB
- Penyimpanan OTP challenge di tabel `otp_challenges` (bukan in-memory)
- Pengiriman OTP 6 digit via email (Resend), bukan SMS/WhatsApp
- Penghapusan `debugCode` dari semua response publik
- Security hardening: `secure: true` pada semua cookies

Semua alur autentikasi yang ada (register → OTP → dashboard, login password, login OTP, lupa password) tetap dipertahankan strukturnya. Tidak ada perubahan pada route, cookie name, atau arsitektur Server Actions.

---

## Glossary

- **Auth_Service**: Modul server-only `src/features/auth/auth-service.ts` yang menggantikan `mock-auth-service.ts`. Bertanggung jawab atas semua operasi autentikasi terhadap database.
- **Email_OTP_Service**: Modul `src/lib/services/email-otp-service.ts` yang mengimplementasikan pengiriman OTP via Resend API.
- **OTP_Challenge**: Record di tabel `otp_challenges` yang menyimpan kode OTP, status, dan metadata sesi verifikasi.
- **Session_Cookie**: Cookie HTTP-only bernama `kp-auth-session` yang menyimpan UUID user dari database.
- **OTP_Cookie**: Cookie HTTP-only bernama `kp-auth-otp` yang menyimpan UUID dari `otp_challenges`.
- **Reset_Cookie**: Cookie HTTP-only bernama `kp-auth-reset` yang menyimpan UUID dari `otp_challenges` untuk alur reset password.
- **Password_Hash**: Nilai hasil `bcryptjs.hash()` dengan cost factor 12, disimpan di kolom `password_hash` tabel `users`.
- **Resend**: Layanan pengiriman email transaksional yang diakses via `RESEND_API_KEY`.
- **DB_User**: Record di tabel `users` dengan kolom `email` sebagai identifier unik utama.
- **Pending_Registration**: Data registrasi sementara yang disimpan di tabel `otp_challenges` (kolom `metadata`) sebelum OTP diverifikasi.
- **AuthIntent**: Enum string `"register" | "login" | "forgot-password"` yang menentukan tujuan OTP Challenge.
- **OtpChallengeSnapshot**: Representasi publik dari OTP_Challenge yang dikembalikan ke client — tidak mengandung kode OTP plaintext.

---

## Requirements

### Requirement 1: Migrasi Identifier Login dari Phone ke Email

**User Story:** Sebagai kontraktor, saya ingin mendaftar dan login menggunakan alamat email, sehingga saya dapat menggunakan identitas digital yang lebih umum dan mudah diingat.

#### Acceptance Criteria

1. THE Auth_Service SHALL menggunakan kolom `email` (varchar 255, unique, not null) sebagai identifier utama pada tabel `users`.
2. WHEN skema database diperbarui, THE Auth_Service SHALL mempertahankan kolom `phone` sebagai nullable (opsional) untuk kompatibilitas data yang sudah ada.
3. THE Auth_Service SHALL menambahkan kolom `email` ke tabel `users` melalui migrasi Drizzle baru (bukan mengubah migrasi `0000_tiny_guardian.sql` yang sudah ada).
4. WHEN pengguna mengisi form registrasi, THE Register_Form SHALL menampilkan field input "Email" menggantikan field "Nomor HP".
5. WHEN pengguna mengisi form login, THE Login_Form SHALL menampilkan field input "Email" menggantikan field "Nomor HP".
6. WHEN pengguna mengisi form lupa password, THE Forgot_Password_Flow SHALL menampilkan field input "Email" menggantikan field "Nomor HP".
7. THE Auth_Service SHALL memvalidasi format email menggunakan `z.string().email()` dari Zod pada semua schema yang relevan (`registerSchema`, `loginSchema`, `forgotPasswordEmailSchema`).
8. WHEN email yang dimasukkan tidak memiliki format valid, THE Register_Form SHALL menampilkan pesan error "Format email tidak valid."
9. WHEN email yang dimasukkan tidak memiliki format valid, THE Login_Form SHALL menampilkan pesan error "Format email tidak valid."
10. THE Auth_Service SHALL melakukan lookup user berdasarkan kolom `email` (case-insensitive) pada semua operasi autentikasi.

---

### Requirement 2: Implementasi Auth Service Berbasis Database

**User Story:** Sebagai sistem, saya ingin semua operasi autentikasi dilakukan terhadap database PostgreSQL nyata, sehingga data pengguna persisten dan tidak hilang saat server restart.

#### Acceptance Criteria

1. THE Auth_Service SHALL mengimplementasikan fungsi `startRegistration`, `loginWithPassword`, `startLoginOtp`, `startPasswordReset`, `verifyChallengeCode`, `resendChallenge`, `resetPassword`, `getUserById`, dan `getChallengeSnapshot` dengan query ke Neon via Drizzle ORM.
2. WHEN `startRegistration` dipanggil dengan email yang sudah terdaftar di tabel `users`, THE Auth_Service SHALL mengembalikan `{ success: false, fieldErrors: { email: "Email sudah terdaftar. Silakan masuk." } }`.
3. WHEN `loginWithPassword` dipanggil, THE Auth_Service SHALL memverifikasi password menggunakan `bcryptjs.compare()` terhadap nilai `password_hash` di database.
4. WHEN `startRegistration` berhasil, THE Auth_Service SHALL menyimpan data pendaftaran sementara (fullName, businessName, email, city, passwordHash) di kolom `metadata` pada record `otp_challenges` baru.
5. WHEN `verifyChallengeCode` berhasil pada flow `"register"`, THE Auth_Service SHALL membuat record baru di tabel `users` dengan data dari `metadata` OTP_Challenge menggunakan satu database transaction.
6. WHEN `verifyChallengeCode` berhasil pada flow `"register"`, THE Auth_Service SHALL menghapus record `otp_challenges` yang sudah digunakan dalam transaction yang sama.
7. THE Auth_Service SHALL menggunakan `bcryptjs.hash(password, 12)` untuk menghasilkan Password_Hash sebelum menyimpan ke database.
8. WHEN `getUserById` dipanggil, THE Auth_Service SHALL melakukan query `SELECT` ke tabel `users` berdasarkan kolom `id` (UUID).
9. THE Auth_Service SHALL menghapus semua referensi ke `globalThis` mock store dan in-memory persistence.
10. THE Auth_Service SHALL menggunakan `db` instance dari `src/lib/db/index.ts` (atau path yang setara) untuk semua query Drizzle.
11. WHEN operasi database gagal karena koneksi error, THE Auth_Service SHALL mengembalikan `{ success: false, message: "Terjadi kesalahan sistem. Coba lagi." }`.

---

### Requirement 3: Tabel `otp_challenges` di Database

**User Story:** Sebagai sistem, saya ingin menyimpan OTP challenge di database, sehingga challenge tetap valid lintas request dan tidak bergantung pada in-memory state.

#### Acceptance Criteria

1. THE Auth_Service SHALL membuat tabel `otp_challenges` dengan kolom: `id` (uuid, PK), `flow` (varchar, enum: register/login/forgot-password), `email` (varchar 255, not null), `code_hash` (text, not null), `expires_at` (timestamp, not null), `resend_available_at` (timestamp, not null), `resend_count` (integer, default 0), `attempts_remaining` (integer, default 5), `locked_until` (timestamp, nullable), `is_verified` (boolean, default false), `metadata` (text, nullable), `created_at` (timestamp, default now).
2. THE Auth_Service SHALL menyimpan kode OTP sebagai hash (`bcryptjs.hash(code, 10)`) di kolom `code_hash`, bukan plaintext.
3. WHEN `verifyChallengeCode` dipanggil, THE Auth_Service SHALL memverifikasi kode menggunakan `bcryptjs.compare(inputCode, challenge.codeHash)`.
4. THE Auth_Service SHALL menetapkan `expires_at` sebesar 15 menit dari waktu pembuatan challenge.
5. THE Auth_Service SHALL menetapkan `resend_available_at` sebesar 60 detik dari waktu pembuatan atau resend terakhir.
6. THE Auth_Service SHALL membatasi `resend_count` maksimal 3 kali per challenge.
7. WHEN `attempts_remaining` mencapai 0, THE Auth_Service SHALL mengisi `locked_until` dengan timestamp 10 menit ke depan.
8. THE Auth_Service SHALL menetapkan `attempts_remaining` awal sebesar 5 percobaan per challenge.
9. WHEN challenge sudah `is_verified = true` atau `expires_at` sudah lewat, THE Auth_Service SHALL menolak verifikasi ulang dengan pesan "Sesi OTP tidak valid atau sudah kedaluwarsa."
10. THE Auth_Service SHALL membuat migrasi Drizzle baru untuk tabel `otp_challenges` (terpisah dari migrasi yang sudah ada).

---

### Requirement 4: Pengiriman OTP via Email (Resend)

**User Story:** Sebagai kontraktor, saya ingin menerima kode OTP di email saya, sehingga saya dapat memverifikasi identitas tanpa bergantung pada SMS.

#### Acceptance Criteria

1. THE Email_OTP_Service SHALL mengimplementasikan interface `AuthOtpService` dari `src/lib/services/contracts.ts` dengan signature yang diperbarui menggunakan `email` sebagai parameter (menggantikan `phone`).
2. WHEN `sendOtp` dipanggil, THE Email_OTP_Service SHALL mengirim email transaksional via Resend API menggunakan `RESEND_API_KEY` dari environment variable.
3. WHEN email OTP berhasil dikirim, THE Email_OTP_Service SHALL mengembalikan `{ success: true, data: { challengeId: string } }`.
4. WHEN Resend API mengembalikan error, THE Email_OTP_Service SHALL mengembalikan `{ success: false, message: "Gagal mengirim email OTP. Coba lagi." }`.
5. THE Email_OTP_Service SHALL mengirim email dengan subject "Kode Verifikasi KontraktorPro" dan body yang memuat kode OTP 6 digit plaintext (hanya di email, tidak di response API).
6. THE Email_OTP_Service SHALL menggunakan alamat pengirim yang dikonfigurasi via environment variable `RESEND_FROM_EMAIL` (default: `noreply@kontraktorpro.id`).
7. THE Auth_Service SHALL memanggil `Email_OTP_Service.sendOtp()` setelah berhasil membuat record `otp_challenges` baru di database.
8. WHEN `resendChallenge` dipanggil dan cooldown sudah lewat, THE Auth_Service SHALL membuat kode OTP baru, memperbarui `code_hash` di database, dan memanggil `Email_OTP_Service.sendOtp()` ulang.
9. THE Email_OTP_Service SHALL menyertakan informasi waktu kedaluwarsa (15 menit) dalam body email.

---

### Requirement 5: Penghapusan `debugCode` dan Security Hardening

**User Story:** Sebagai tim keamanan, saya ingin memastikan kode OTP tidak pernah terekspos di response API dan semua cookies menggunakan flag secure, sehingga sistem aman untuk production.

#### Acceptance Criteria

1. THE Auth_Service SHALL menghapus field `debugCode` dari tipe `OtpChallengeSnapshot` di `src/features/auth/types.ts`.
2. THE Auth_Service SHALL menghapus semua referensi ke `debugCode` dari semua komponen UI (`otp-verification-form.tsx`, `forgot-password-flow.tsx`).
3. WHEN `getChallengeSnapshot` dipanggil, THE Auth_Service SHALL mengembalikan `OtpChallengeSnapshot` tanpa field `debugCode` atau kode OTP dalam bentuk apapun.
4. THE Auth_Service SHALL menggunakan `secure: true` pada semua cookie yang di-set di `src/features/auth/actions.ts` (Session_Cookie, OTP_Cookie, Reset_Cookie).
5. THE Auth_Service SHALL mempertahankan `httpOnly: true` dan `sameSite: "lax"` pada semua cookies.
6. THE Auth_Service SHALL menghapus file `src/features/auth/mock-auth-service.ts` setelah `auth-service.ts` selesai diimplementasikan dan semua import diperbarui.
7. WHEN `src/lib/auth/session.ts` memanggil `getUserById`, THE Auth_Service SHALL menggunakan fungsi dari `auth-service.ts` (bukan `mock-auth-service.ts`).
8. THE Auth_Service SHALL menghapus field `password` (plaintext) dari tipe `MockUser` dan mengganti tipe tersebut dengan `DbUser` yang tidak mengandung password.

---

### Requirement 6: Pembaruan Session Service

**User Story:** Sebagai sistem, saya ingin `getCurrentUser` membaca data user dari database, sehingga session selalu mencerminkan state terbaru dari DB.

#### Acceptance Criteria

1. WHEN `getCurrentUser` dipanggil, THE Session_Service SHALL membaca nilai cookie `kp-auth-session` dan melakukan query `SELECT` ke tabel `users` berdasarkan UUID tersebut.
2. WHEN user dengan UUID tersebut tidak ditemukan di database, THE Session_Service SHALL mengembalikan `null`.
3. WHEN user ditemukan di database, THE Session_Service SHALL mengembalikan objek user yang kompatibel dengan tipe yang digunakan oleh `requireAuth()` dan `requireRole()`.
4. THE Session_Service SHALL mempertahankan fungsi `requireAuth()`, `requireRole()`, dan `redirectIfAuthenticated()` dengan signature yang tidak berubah.
5. THE Session_Service SHALL menghapus import dari `mock-auth-service.ts` dan menggantinya dengan import dari `auth-service.ts`.
6. WHEN `resetPasswordAction` berhasil, THE Auth_Service SHALL mengembalikan `{ redirectTo: "/login?email=..." }` (menggantikan `?phone=...`).

---

### Requirement 7: Struktur File dan Dependencies Baru

**User Story:** Sebagai developer, saya ingin semua file baru mengikuti konvensi proyek yang ada, sehingga codebase tetap konsisten dan mudah dipelihara.

#### Acceptance Criteria

1. THE Auth_Service SHALL dibuat di path `src/features/auth/auth-service.ts` dengan directive `"use server"` atau `import "server-only"` di baris pertama.
2. THE Email_OTP_Service SHALL dibuat di path `src/lib/services/email-otp-service.ts`.
3. THE Auth_Service SHALL membuat file `src/lib/db/queries/users.ts` untuk query-query terkait tabel `users`.
4. THE Auth_Service SHALL membuat file `src/lib/db/index.ts` (jika belum ada) yang mengekspor instance `db` dari Drizzle dengan Neon driver.
5. THE Auth_Service SHALL menambahkan dependency `bcryptjs` dan `@types/bcryptjs` ke `package.json`.
6. THE Auth_Service SHALL menambahkan dependency `resend` ke `package.json`.
7. THE Auth_Service SHALL menambahkan `RESEND_API_KEY` dan `RESEND_FROM_EMAIL` ke file `.env.example`.
8. WHEN `src/lib/contracts/types.ts` diperbarui, THE Auth_Service SHALL menambahkan field `email` ke tipe `User` dan menandai `phone` sebagai opsional (`phone?: string`).
9. THE Auth_Service SHALL mempertahankan semua nama cookie yang ada (`kp-auth-session`, `kp-auth-otp`, `kp-auth-reset`) tanpa perubahan.
10. THE Auth_Service SHALL mempertahankan semua route yang ada tanpa perubahan.
11. THE Auth_Service SHALL mempertahankan penggunaan `react-hook-form` + `zod` di semua form component tanpa perubahan arsitektur.

---

### Requirement 8: Validasi dan Error Handling

**User Story:** Sebagai kontraktor, saya ingin mendapatkan pesan error yang jelas dan spesifik saat terjadi kesalahan input atau sistem, sehingga saya tahu apa yang harus diperbaiki.

#### Acceptance Criteria

1. WHEN email yang dimasukkan sudah terdaftar saat registrasi, THE Auth_Service SHALL mengembalikan field error `{ email: "Email sudah terdaftar. Silakan masuk." }`.
2. WHEN email yang dimasukkan tidak ditemukan saat login, THE Auth_Service SHALL mengembalikan field error `{ email: "Email tidak ditemukan. Daftar dulu?" }`.
3. WHEN password yang dimasukkan salah saat login, THE Auth_Service SHALL mengembalikan field error `{ password: "Password salah." }`.
4. WHEN akun user memiliki status suspended, THE Auth_Service SHALL mengembalikan `{ success: false, message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro." }`.
5. WHEN kode OTP yang dimasukkan salah, THE Auth_Service SHALL mengembalikan pesan "Kode salah. Sisa N percobaan." dengan nilai N yang akurat.
6. WHEN OTP challenge sudah expired, THE Auth_Service SHALL mengembalikan pesan "Kode sudah kedaluwarsa. Minta kode baru."
7. WHEN OTP challenge dalam status locked, THE Auth_Service SHALL mengembalikan pesan "Terlalu banyak percobaan. Coba lagi dalam N menit."
8. WHEN resend diminta sebelum cooldown selesai, THE Auth_Service SHALL mengembalikan pesan "Kirim ulang dalam N detik."
9. WHEN resend_count sudah mencapai batas maksimal (3), THE Auth_Service SHALL mengembalikan pesan "Batas pengiriman ulang tercapai. Mulai proses dari awal."
10. IF email yang dimasukkan pada form lupa password tidak terdaftar, THEN THE Auth_Service SHALL mengembalikan field error `{ email: "Email ini tidak terdaftar." }`.

---

### Requirement 9: Kompatibilitas Alur Autentikasi yang Ada

**User Story:** Sebagai kontraktor, saya ingin semua alur autentikasi (register, login password, login OTP, lupa password) tetap berfungsi seperti sebelumnya, sehingga pengalaman saya tidak terganggu oleh perubahan teknis di balik layar.

#### Acceptance Criteria

1. WHEN registrasi berhasil, THE Auth_Service SHALL mengarahkan pengguna ke `/verify-otp` (tidak berubah).
2. WHEN verifikasi OTP registrasi berhasil, THE Auth_Service SHALL membuat session cookie dan mengarahkan ke `/dashboard` (tidak berubah).
3. WHEN login dengan password berhasil, THE Auth_Service SHALL membuat session cookie dan mengarahkan ke `/dashboard` atau `/admin` sesuai role (tidak berubah).
4. WHEN login OTP berhasil, THE Auth_Service SHALL membuat session cookie dan mengarahkan ke `/dashboard` atau `/admin` sesuai role (tidak berubah).
5. WHEN reset password berhasil, THE Auth_Service SHALL mengarahkan ke `/login?email=<email>` (menggantikan `?phone=`).
6. THE Auth_Service SHALL mempertahankan penggunaan Server Actions (`"use server"`) untuk semua auth mutations di `src/features/auth/actions.ts`.
7. THE Auth_Service SHALL mempertahankan cookie-based session (bukan JWT, bukan next-auth).
8. THE Auth_Service SHALL mempertahankan guard functions `requireRole()` dan `requireAuth()` di semua layout yang sudah menggunakannya.
9. WHILE pengguna memiliki session cookie yang valid, THE Session_Service SHALL mengembalikan data user tanpa redirect.
10. THE Auth_Service SHALL mempertahankan field `firstLogin` pada data user untuk keperluan onboarding redirect di masa depan.
