# System Logic: SL-004 Reset Password

Document Version: v1.0

System Logic ID: SL-004

Related Use Case: UC-005

Use Case Name: Reset Password (Lupa Password)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

Source: Derived from `userflow_uc_005.md` + actual `src/features/auth/actions.ts`

---

## 1. Overview

Dokumen ini mendefinisikan system logic untuk alur reset password 3-step di halaman `/forgot-password`. Tiga Server Actions berbeda menangani masing-masing step. Cookie `kp-auth-reset` menjadi penghubung antar step.

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    actor Kontraktor
    participant ForgotPage as ForgotPasswordPage
    participant step1Action as requestPasswordResetAction
    participant step2Action as verifyPasswordResetOtpAction
    participant step3Action as resetPasswordAction
    participant auth_service as [auth-service]
    participant DB as Neon PostgreSQL
    participant Resend as Resend Email API

    Note over Kontraktor,Resend: STEP 1 — Input Email
    Kontraktor->>ForgotPage: Akses /forgot-password, isi email
    Kontraktor->>ForgotPage: Klik "Kirim Kode Reset"
    ForgotPage->>step1Action: requestPasswordResetAction(email)
    step1Action->>auth_service: startPasswordReset({ email })
    auth_service->>DB: SELECT users WHERE email = ?
    alt User tidak ditemukan
        DB-->>auth_service: null
        auth_service-->>step1Action: throw Error("USER_NOT_FOUND")
        step1Action-->>ForgotPage: { success: false, error: "Email tidak terdaftar" }
    else User ditemukan
        auth_service->>auth_service: generateOtpCode() [6 digit]
        auth_service->>auth_service: bcrypt.hash(code, 10)
        auth_service->>DB: INSERT otp_challenges (flow=forgot-password)
        auth_service->>Resend: sendOtp(email, code)
        auth_service-->>step1Action: OtpChallengeSnapshot
        step1Action->>ForgotPage: Set-Cookie: kp-auth-reset=challengeId (15 menit)
        step1Action-->>ForgotPage: { success: true, data: PasswordResetState{step:'otp'} }
        ForgotPage-->>Kontraktor: Tampilkan Step 2 (input OTP)
    end

    Note over Kontraktor,DB: STEP 2 — Verifikasi OTP
    Kontraktor->>ForgotPage: Input kode OTP 6 digit
    Kontraktor->>ForgotPage: Klik "Verifikasi Kode"
    ForgotPage->>step2Action: verifyPasswordResetOtpAction(code)
    step2Action->>auth_service: verifyChallengeCode(challengeId, code)
    auth_service->>DB: SELECT otp_challenges WHERE id = challengeId
    auth_service->>auth_service: bcrypt.compare(code, codeHash)
    alt Kode valid
        auth_service->>DB: UPDATE otp_challenges SET is_verified = true
        auth_service-->>step2Action: OtpVerified
        step2Action-->>ForgotPage: { success: true, data: PasswordResetState{step:'password'} }
        ForgotPage-->>Kontraktor: Tampilkan Step 3 (input password baru)
    else Kode salah
        auth_service->>DB: UPDATE attempts_remaining - 1
        auth_service-->>step2Action: throw Error("INVALID_CODE")
        step2Action-->>ForgotPage: { success: false, error: "Kode tidak valid. Sisa {n} percobaan." }
    end

    Note over Kontraktor,DB: STEP 3 — Buat Password Baru
    Kontraktor->>ForgotPage: Input password baru + konfirmasi
    Kontraktor->>ForgotPage: Klik "Simpan Password Baru"
    ForgotPage->>step3Action: resetPasswordAction(newPassword)
    step3Action->>auth_service: resetPassword(challengeId, newPassword)
    auth_service->>DB: SELECT otp_challenges WHERE id = challengeId
    auth_service->>auth_service: Verify is_verified = true
    auth_service->>auth_service: bcrypt.hash(newPassword, 12)
    auth_service->>DB: UPDATE users SET password_hash = newHash WHERE email = challenge.email
    auth_service->>DB: DELETE otp_challenges WHERE id = challengeId
    auth_service-->>step3Action: { phone, redirectTo: '/login?email=...' }
    step3Action->>ForgotPage: Delete-Cookie: kp-auth-reset
    step3Action-->>ForgotPage: { success: true, data: { redirectTo } }
    ForgotPage->>ForgotPage: redirect('/login?email=...')
    ForgotPage-->>Kontraktor: Halaman login dengan notifikasi sukses
```

---

## 3. Server Action Contracts

### 3.1 `requestPasswordResetAction` (Step 1)

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function requestPasswordResetAction(
  _prevState: ActionResult<PasswordResetState> | null,
  formData: FormData
): Promise<ActionResult<PasswordResetState>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `email` | string | Required, format email, harus terdaftar |

**Success Response:**
```typescript
{
  success: true,
  data: PasswordResetState  // { step: 'otp', maskedEmail, ... }
}
```

**Side Effects:**
- Set cookie `kp-auth-reset` (15 menit)
- INSERT `otp_challenges` (flow: 'forgot-password')
- Kirim email OTP via Resend

---

### 3.2 `verifyPasswordResetOtpAction` (Step 2)

**Signature:**
```typescript
async function verifyPasswordResetOtpAction(
  _prevState: ActionResult<PasswordResetState> | null,
  formData: FormData
): Promise<ActionResult<PasswordResetState>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `code` | string | Required, 6 digit numerik |

**Cookie dibaca:** `kp-auth-reset`

**Success Response:**
```typescript
{
  success: true,
  data: PasswordResetState  // { step: 'password', ... }
}
```

**Side Effects:**
- UPDATE `otp_challenges.is_verified = true`

---

### 3.3 `resetPasswordAction` (Step 3)

**Signature:**
```typescript
async function resetPasswordAction(
  _prevState: ActionResult<{ phone: string | null; redirectTo: string }> | null,
  formData: FormData
): Promise<ActionResult<{ phone: string | null; redirectTo: string }>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `password` | string | Required, min 8 karakter |
| `confirmPassword` | string | Required, harus sama dengan password |

**Cookie dibaca:** `kp-auth-reset`

**Success Response:**
```typescript
{
  success: true,
  data: {
    phone: string | null,
    redirectTo: "/login?email=..."
  }
}
```

**Side Effects:**
- UPDATE `users.password_hash` (bcrypt hash cost 12)
- DELETE `otp_challenges` WHERE id
- Delete cookie `kp-auth-reset`

---

### 3.4 `resendPasswordResetOtpAction`

**Signature:**
```typescript
async function resendPasswordResetOtpAction(
  _prevState: ActionResult<PasswordResetState> | null,
  formData: FormData
): Promise<ActionResult<PasswordResetState>>
```

**Cookie dibaca:** `kp-auth-reset`

**Side Effects:**
- UPDATE `otp_challenges` (kode baru, resend_count+1)
- Kirim email OTP baru via Resend

---

### 3.5 `getPasswordResetStateFromCookie`

**Signature:**
```typescript
async function getPasswordResetStateFromCookie(): Promise<PasswordResetState>
```

**Cookie dibaca:** `kp-auth-reset`

**Returns:** `PasswordResetState` — state saat ini dari alur reset (step 1/2/3, maskedEmail, dll.)

---

## 4. resetPassword() — Logic Detail

**File:** `src/features/auth/auth-service.ts`

```typescript
async function resetPassword(
  challengeId: string,
  newPassword: string
): Promise<{ phone: string | null; redirectTo: string }>
```

**Step by step:**
1. SELECT `otp_challenges` WHERE `id = challengeId`
2. Throw jika tidak ditemukan
3. Verify `is_verified = true` → throw jika false (langkah 2 belum selesai)
4. `bcrypt.hash(newPassword, 12)`
5. `updateUserPassword(challenge.email, newHash)` → UPDATE `users`
6. DELETE `otp_challenges` WHERE id
7. Return `{ phone: user.phone, redirectTo: '/login?email=...' }`

---

## 5. PasswordResetState Type

```typescript
type PasswordResetState = {
  step: 'email' | 'otp' | 'password' | 'done'
  challengeId?: string
  maskedEmail?: string
  expiresAt?: Date
  resendAvailableAt?: Date
  resendCount?: number
  phone?: string | null
  redirectTo?: string
}
```

---

## 6. Security Rules

| Rule | Detail |
| --- | --- |
| Step order enforced | Step 3 hanya diizinkan jika `is_verified = true` di DB |
| Password hashing | bcrypt cost 12 untuk password baru |
| Cookie cleanup | `kp-auth-reset` dihapus setelah reset berhasil |
| No password in plaintext | Hash langsung sebelum UPDATE |
| Challenge cleanup | DELETE setelah reset — tidak bisa digunakan ulang |

---

## 7. Traceability

| User Flow | Requirement | Server Actions |
| --- | --- | --- |
| `userflow_uc_005.md` | F001 | `requestPasswordResetAction` → `startPasswordReset()` |
| `userflow_uc_005.md` | F001 | `verifyPasswordResetOtpAction` → `verifyChallengeCode()` |
| `userflow_uc_005.md` | F001 | `resetPasswordAction` → `resetPassword()` |
