# System Logic: SL-002 Login (Password + OTP)

Document Version: v1.0

System Logic ID: SL-002

Related Use Cases: UC-002, UC-003

Use Case Names: Login dengan Password, Login dengan OTP Email

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

Source: Derived from `userflow_uc_002.md`, `userflow_uc_003.md` + actual `src/features/auth/actions.ts`

---

## 1. Overview

Dokumen ini mendefinisikan dua jalur login yang tersedia: (1) login dengan password, dan (2) login dengan OTP email. Keduanya berujung pada `kp-auth-session` cookie jika berhasil — melalui path yang berbeda.

---

## 2. Sequence Diagrams

### 2.1 Login dengan Password (UC-002)

```mermaid
sequenceDiagram
    actor Pengguna
    participant LoginPage as LoginPage (Server Component)
    participant loginAction as loginWithPasswordAction (Server Action)
    participant auth_service as loginWithPassword() [auth-service]
    participant DB as Neon PostgreSQL

    Pengguna->>LoginPage: Akses /login, isi email + password
    Pengguna->>LoginPage: Klik "Masuk dengan Password"

    LoginPage->>loginAction: Call Server Action (formData)
    loginAction->>loginAction: loginSchema.safeParse(formData)

    alt Input tidak valid
        loginAction-->>LoginPage: { success: false, error: "..." }
        LoginPage-->>Pengguna: Inline validation error
    else Input valid
        loginAction->>auth_service: loginWithPassword({ email, password })
        auth_service->>auth_service: normalize email (lowercase)
        auth_service->>DB: SELECT users WHERE email = ?

        alt User tidak ditemukan
            DB-->>auth_service: null
            auth_service-->>loginAction: throw Error("INVALID_CREDENTIALS")
            loginAction-->>LoginPage: { success: false, error: "Email atau password tidak sesuai" }
        else User ditemukan
            auth_service->>auth_service: Check suspended = true
            alt Akun suspended
                auth_service-->>loginAction: throw Error("ACCOUNT_SUSPENDED")
                loginAction-->>LoginPage: { success: false, error: "Akun Anda telah disuspend" }
            else Akun aktif
                auth_service->>auth_service: bcrypt.compare(password, user.passwordHash)
                alt Password tidak cocok
                    auth_service-->>loginAction: throw Error("INVALID_CREDENTIALS")
                    loginAction-->>LoginPage: { success: false, error: "Email atau password tidak sesuai" }
                else Password cocok
                    loginAction->>LoginPage: Set-Cookie: kp-auth-session=userId (HttpOnly, 30 hari)
                    loginAction-->>LoginPage: { success: true, data: { redirectTo, firstLogin } }
                    LoginPage->>LoginPage: redirect(redirectTo)
                end
            end
        end
    end
```

### 2.2 Login dengan OTP Email (UC-003)

```mermaid
sequenceDiagram
    actor Pengguna
    participant LoginPage as LoginPage
    participant otpAction as requestLoginOtpAction (Server Action)
    participant auth_service as startLoginOtp() [auth-service]
    participant DB as Neon PostgreSQL
    participant Resend as Resend Email API

    Pengguna->>LoginPage: Isi email, pilih mode OTP
    Pengguna->>LoginPage: Klik "Kirim Kode OTP"

    LoginPage->>otpAction: Call Server Action (email)
    otpAction->>auth_service: startLoginOtp({ email })
    auth_service->>auth_service: normalize email
    auth_service->>DB: SELECT users WHERE email = ?

    alt User tidak ditemukan
        auth_service-->>otpAction: throw Error("USER_NOT_FOUND")
        otpAction-->>LoginPage: { success: false, error: "Email tidak terdaftar" }
    else User ditemukan
        auth_service->>auth_service: Check suspended
        alt Akun suspended
            auth_service-->>otpAction: throw Error("ACCOUNT_SUSPENDED")
        else Akun aktif
            auth_service->>auth_service: generateOtpCode() [6 digit]
            auth_service->>auth_service: bcrypt.hash(otpCode, 10)
            auth_service->>DB: INSERT otp_challenges (flow=login, email)
            auth_service->>Resend: sendOtp(email, otpCode)
            Resend-->>auth_service: Email terkirim
            auth_service-->>otpAction: OtpChallengeSnapshot
            otpAction->>LoginPage: Set-Cookie: kp-auth-otp=challengeId (15 menit)
            otpAction-->>LoginPage: { success: true, data: OtpChallengeSnapshot }
            LoginPage->>LoginPage: redirect("/verify-otp")
        end
    end
```

---

## 3. Server Action Contracts

### 3.1 `loginWithPasswordAction`

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function loginWithPasswordAction(
  _prevState: ActionResult<LoginSuccess> | null,
  formData: FormData
): Promise<ActionResult<LoginSuccess>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `email` | string | Required, format email |
| `password` | string | Required |

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

**Error Response:**
```typescript
{ success: false, error: string }
```

**Side Effects:**
- Set cookie `kp-auth-session` (HttpOnly, Secure, 30 hari) berisi userId

---

### 3.2 `requestLoginOtpAction`

**File:** `src/features/auth/actions.ts`

**Signature:**
```typescript
async function requestLoginOtpAction(
  _prevState: ActionResult<OtpChallengeSnapshot> | null,
  formData: FormData
): Promise<ActionResult<OtpChallengeSnapshot>>
```

**Input (FormData):**

| Field | Type | Constraint |
| --- | --- | --- |
| `email` | string | Required, format email, harus terdaftar |

**Success Response:**
```typescript
{
  success: true,
  data: {
    challengeId: string,
    maskedEmail: string,
    expiresAt: Date,
    resendAvailableAt: Date
  }
}
```

**Side Effects:**
- Set cookie `kp-auth-otp` (15 menit)
- INSERT `otp_challenges` (flow: 'login')
- Kirim email via Resend

---

### 3.3 `loginWithPassword()` — auth-service.ts

**Signature:**
```typescript
async function loginWithPassword(data: {
  email: string
  password: string
}): Promise<LoginSuccess>
```

**Process:**
1. normalize email lowercase
2. `findUserByEmail(email)` → throw `INVALID_CREDENTIALS` jika null
3. Check `user.suspended` → throw `ACCOUNT_SUSPENDED`
4. `bcrypt.compare(password, user.passwordHash)` → throw `INVALID_CREDENTIALS` jika false
5. Return `{ redirectTo, firstLogin }`

**Cookie di-set oleh caller (`loginWithPasswordAction`):**
- `kp-auth-session` = userId, 30 hari

---

### 3.4 `startLoginOtp()` — auth-service.ts

**Signature:**
```typescript
async function startLoginOtp(data: {
  email: string
}): Promise<OtpChallengeSnapshot>
```

**Process:**
1. normalize email lowercase
2. `findUserByEmail(email)` → throw `USER_NOT_FOUND` jika null
3. Check `user.suspended`
4. `generateOtpCode()` → 6 digit
5. `bcrypt.hash(code, 10)`
6. INSERT `otp_challenges` (flow: 'login')
7. `emailOtpService.sendOtp(email, code)`
8. Return `OtpChallengeSnapshot`

---

## 4. Redirect Logic

| Role | redirectTo |
| --- | --- |
| `contractor` | `/dashboard` |
| `moderator` | `/admin` |
| `super_admin` | `/admin` |

---

## 5. Security Rules

| Rule | Detail |
| --- | --- |
| Password never exposed | bcrypt.compare() — tidak ada plaintext comparison |
| Generic error message | "Email atau password tidak sesuai" (tidak mengungkap mana yang salah) |
| Session cookie | HttpOnly, Secure, SameSite=strict, MaxAge=2592000 (30 hari) |
| Suspended check | Dilakukan sebelum password verification |

---

## 6. Traceability

| User Flow | Requirement | Server Action |
| --- | --- | --- |
| `userflow_uc_002.md` | F001 | `loginWithPasswordAction` → `loginWithPassword()` |
| `userflow_uc_003.md` | F001 | `requestLoginOtpAction` → `startLoginOtp()` |
