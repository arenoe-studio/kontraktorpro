# System Logic: SL-003 Verifikasi OTP

Document Version: v1.0

System Logic ID: SL-003

Related Use Case: UC-004

Use Case Name: Verifikasi OTP

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

Source: Derived from `userflow_uc_004.md` + actual `src/features/auth/actions.ts`

---

## 1. Overview

Dokumen ini mendefinisikan system logic untuk verifikasi kode OTP 6 digit yang berlaku untuk dua flow: registrasi dan login OTP. Logic ini dibagi antara verify utama dan resend OTP.

---

## 2. Sequence Diagrams

### 2.1 Verifikasi OTP Berhasil (Flow Register)

```mermaid
sequenceDiagram
    actor Kontraktor
    participant VerifyPage as VerifyOtpPage
    participant verifyAction as verifyCurrentOtpAction (Server Action)
    participant getChallengeAction as getOtpChallengeStateFromCookie
    participant auth_service as verifyChallengeCode() [auth-service]
    participant DB as Neon PostgreSQL

    Kontraktor->>VerifyPage: Akses /verify-otp
    VerifyPage->>getChallengeAction: Baca kp-auth-otp cookie
    getChallengeAction-->>VerifyPage: OtpChallengeSnapshot (maskedEmail, expiresAt)
    VerifyPage-->>Kontraktor: Tampilkan form 6 digit + masked email

    Kontraktor->>VerifyPage: Input kode OTP
    Kontraktor->>VerifyPage: Klik "Verifikasi"

    VerifyPage->>verifyAction: Call Server Action (code, challengeId dari cookie)
    verifyAction->>auth_service: verifyChallengeCode(challengeId, code)

    auth_service->>DB: SELECT otp_challenges WHERE id = challengeId
    DB-->>auth_service: OtpChallenge record

    auth_service->>auth_service: Check expires_at < now()
    auth_service->>auth_service: Check locked_until
    auth_service->>auth_service: bcrypt.compare(code, codeHash)

    alt Kode valid + flow = register
        auth_service->>DB: BEGIN TRANSACTION
        auth_service->>DB: INSERT users (dari metadata: name, phone, passwordHash)
        auth_service->>DB: DELETE otp_challenges WHERE id = challengeId
        auth_service->>DB: COMMIT
        auth_service-->>verifyAction: LoginSuccess { userId, redirectTo, firstLogin: true }
        verifyAction->>VerifyPage: Set-Cookie: kp-auth-session=userId (30 hari)
        verifyAction->>VerifyPage: Delete-Cookie: kp-auth-otp
        verifyAction-->>VerifyPage: { success: true, data: { redirectTo: "/dashboard" } }
        VerifyPage->>VerifyPage: redirect("/dashboard")
    else Kode valid + flow = login
        auth_service->>DB: UPDATE otp_challenges SET is_verified = true
        auth_service->>DB: SELECT users WHERE email = challenge.email
        auth_service-->>verifyAction: LoginSuccess { userId, redirectTo }
        verifyAction->>VerifyPage: Set-Cookie: kp-auth-session=userId (30 hari)
        verifyAction->>VerifyPage: Delete-Cookie: kp-auth-otp
        verifyAction-->>VerifyPage: { success: true, data: { redirectTo } }
    end
```

### 2.2 Kode Salah / Lockout

```mermaid
sequenceDiagram
    actor Kontraktor
    participant VerifyPage as VerifyOtpPage
    participant verifyAction as verifyCurrentOtpAction
    participant auth_service as verifyChallengeCode()
    participant DB as Neon PostgreSQL

    Kontraktor->>VerifyPage: Input kode OTP yang salah
    VerifyPage->>verifyAction: Call Server Action (code salah)
    verifyAction->>auth_service: verifyChallengeCode(challengeId, codeSalah)
    auth_service->>auth_service: bcrypt.compare → false
    auth_service->>DB: UPDATE otp_challenges SET attempts_remaining = attempts_remaining - 1

    alt attempts_remaining > 0
        DB-->>auth_service: Updated record
        auth_service-->>verifyAction: throw Error("INVALID_CODE", { attemptsRemaining })
        verifyAction-->>VerifyPage: { success: false, error: "Kode tidak valid. Sisa {n} percobaan." }
    else attempts_remaining = 0
        auth_service->>DB: UPDATE otp_challenges SET locked_until = now() + 15min
        auth_service-->>verifyAction: throw Error("MAX_ATTEMPTS_EXCEEDED")
        verifyAction-->>VerifyPage: { success: false, error: "Terlalu banyak percobaan. Minta kode baru." }
    end
```

### 2.3 Resend OTP

```mermaid
sequenceDiagram
    actor Kontraktor
    participant VerifyPage as VerifyOtpPage
    participant resendAction as resendCurrentOtpAction
    participant auth_service as resendChallenge()
    participant DB as Neon PostgreSQL
    participant Resend as Resend Email API

    Kontraktor->>VerifyPage: Klik "Kirim Ulang Kode"
    VerifyPage->>resendAction: Call Server Action (challengeId dari cookie)
    resendAction->>auth_service: resendChallenge(challengeId)

    auth_service->>DB: SELECT otp_challenges WHERE id = challengeId
    auth_service->>auth_service: Check resend_available_at (cooldown)
    auth_service->>auth_service: Check resend_count < 3

    alt Cooldown atau limit tercapai
        auth_service-->>resendAction: throw Error("RESEND_COOLDOWN" / "RESEND_LIMIT")
        resendAction-->>VerifyPage: { success: false, error: "..." }
    else Dapat resend
        auth_service->>auth_service: generateOtpCode()
        auth_service->>auth_service: bcrypt.hash(newCode, 10)
        auth_service->>DB: UPDATE otp_challenges SET code_hash, resend_count+1, resend_available_at
        auth_service->>Resend: sendOtp(email, newCode)
        auth_service-->>resendAction: OtpChallengeSnapshot (updated)
        resendAction-->>VerifyPage: { success: true, data: OtpChallengeSnapshot }
        VerifyPage-->>Kontraktor: Toast: "Kode baru telah dikirim."
    end
```

---

## 3. Server Action Contracts

### 3.1 `verifyCurrentOtpAction`

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function verifyCurrentOtpAction(
  _prevState: ActionResult<LoginSuccess> | null,
  formData: FormData
): Promise<ActionResult<LoginSuccess>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `code` | string | Required, 6 digit numerik |

**Cookie dibaca:** `kp-auth-otp` (untuk mendapatkan `challengeId`)

**Success Response:**
```typescript
{
  success: true,
  data: {
    redirectTo: "/dashboard" | "/admin",
    firstLogin: boolean
  }
}
```

**Side Effects:**
- Set cookie `kp-auth-session` (30 hari)
- Delete cookie `kp-auth-otp`
- (flow=register) INSERT `users`, DELETE `otp_challenges`
- (flow=login) UPDATE `otp_challenges.is_verified = true`

---

### 3.2 `resendCurrentOtpAction`

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function resendCurrentOtpAction(
  _prevState: ActionResult<OtpChallengeSnapshot> | null,
  formData: FormData
): Promise<ActionResult<OtpChallengeSnapshot>>
```

**Cookie dibaca:** `kp-auth-otp`

**Success Response:**
```typescript
{
  success: true,
  data: OtpChallengeSnapshot  // Updated challenge state
}
```

**Side Effects:**
- UPDATE `otp_challenges` (code_hash baru, resend_count+1, resend_available_at baru)
- Kirim email OTP baru via Resend

---

### 3.3 `getOtpChallengeStateFromCookie`

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function getOtpChallengeStateFromCookie(): Promise<OtpChallengeSnapshot | null>
```

**Cookie dibaca:** `kp-auth-otp`

**Returns:** `OtpChallengeSnapshot` (tanpa `codeHash`, tanpa `debugCode`) atau `null` jika tidak ada cookie/expired.

**Usage:** Dipanggil di `page.tsx` untuk pre-populate halaman verify-otp dengan `maskedEmail`.

---

## 4. verifyChallengeCode() — Logic Detail

**File:** `src/features/auth/auth-service.ts`

```typescript
async function verifyChallengeCode(
  challengeId: string,
  code: string
): Promise<LoginSuccess>
```

**Step by step:**
1. SELECT `otp_challenges` WHERE `id = challengeId`
2. Throw `CHALLENGE_NOT_FOUND` jika null
3. Check `expires_at < now()` → throw `CHALLENGE_EXPIRED`
4. Check `locked_until != null && locked_until > now()` → throw `ACCOUNT_LOCKED`
5. `bcrypt.compare(code, codeHash)` → false: update `attempts_remaining--`, throw `INVALID_CODE`
6. Jika `attempts_remaining` = 0: set `locked_until`, throw `MAX_ATTEMPTS_EXCEEDED`
7. **Flow `register`:**
   - BEGIN TRANSACTION
   - INSERT `users` (ambil name, phone dari `metadata`, ambil `passwordHash` dari `metadata`)
   - DELETE `otp_challenges` WHERE id
   - COMMIT
   - Return `LoginSuccess { userId: newUser.id, redirectTo: '/dashboard', firstLogin: true }`
8. **Flow `login`:**
   - UPDATE `otp_challenges` SET `is_verified = true`
   - `findUserByEmail(challenge.email)` 
   - Return `LoginSuccess { userId: user.id, redirectTo, firstLogin: user.firstLogin }`

---

## 5. Security Rules

| Rule | Detail |
| --- | --- |
| OTP never stored plaintext | bcrypt.compare() selalu digunakan |
| Max attempts | 5 percobaan sebelum lockout |
| Max resend | 3x per challenge |
| Resend cooldown | `resend_available_at` mencegah spam |
| Transaction integrity | register: INSERT+DELETE dalam satu DB transaction |
| Cookie cleanup | `kp-auth-otp` dihapus setelah berhasil |

---

## 6. Traceability

| User Flow | Requirement | Server Action |
| --- | --- | --- |
| `userflow_uc_004.md` | F001 | `verifyCurrentOtpAction` → `verifyChallengeCode()` |
| `userflow_uc_004.md` | F001 | `resendCurrentOtpAction` → `resendChallenge()` |
