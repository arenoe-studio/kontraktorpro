# Test Plan

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

---

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan rencana pengujian (test plan) untuk sistem KontraktorPro. Test Plan ini mencakup strategi, lingkup, sumber daya, jadwal, dan kriteria kelulusan pengujian.

## 1.2 Objectives

- Memverifikasi bahwa fitur F001 (Autentikasi) berfungsi sesuai SRS v1.0 — fitur yang sudah IMPLEMENTED.
- Memvalidasi alur UC-001 s/d UC-005 berjalan sesuai user flow specification.
- Mengidentifikasi defect sebelum fitur dirilis atau dilanjutkan ke implementasi lebih lanjut.
- Memastikan sistem memenuhi non-functional requirements keamanan (NFR-6.2).

## 1.3 References

| Document | Version | Location |
| --- | --- | --- |
| Software Requirements Specification (SRS) | v1.0 | `docs/chain-of-truth/srs.md` |
| Information Architecture | v1.0 | `docs/chain-of-truth/information_architecture.md` |
| User Flow Specifications | v1.0 | `docs/chain-of-truth/user_flows/` |
| System Logic Specifications | v1.0 | `docs/chain-of-truth/system_logics/` |
| Test Case Specification | v1.0 | `docs/chain-of-truth/test_cases.md` |

---

# 2. TEST SCOPE

## 2.1 In Scope

| Feature ID | Feature Name | Related Use Cases | Status Implementasi | Target TC |
| --- | --- | --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | UC-001 s/d UC-005 | IMPLEMENTED | 24 TC |

### 2.1.1 Test Types Included

| Test Type | Description |
| --- | --- |
| Functional Testing | Memverifikasi setiap alur auth berfungsi sesuai SRS dan user flow |
| Validation Testing | Memvalidasi input form, business rules, cookie behavior |
| Security Testing (basic) | Memverifikasi cookie attributes (HttpOnly, Secure), bcrypt usage, lockout mechanism |
| Error Handling Testing | Menguji respons sistem terhadap input salah, server error, expired OTP |
| Regression Testing | Memastikan perubahan tidak merusak fitur auth yang sudah berjalan |

## 2.2 Out of Scope (Phase ini)

- F002–F012 (masih MOCK — belum layak diuji secara fungsional)
- Performance / load testing
- Security penetration testing (terpisah)
- Payment gateway integration testing
- Real file upload testing (UploadThing belum terintegrasi)

---

# 3. TEST STRATEGY

## 3.1 Testing Levels

### Level 1: Unit Testing (Vitest)

| Aspect | Detail |
| --- | --- |
| **Target** | `auth-service.ts` functions, validation schemas (Zod) |
| **Approach** | Automated unit test + property-based test |
| **Tool** | Vitest + fast-check (sudah ada di project) |
| **Location** | `src/features/auth/__tests__/` |
| **Responsibility** | Developer |

### Level 2: Integration Testing

| Aspect | Detail |
| --- | --- |
| **Target** | Server Actions → auth-service → DB (Neon test DB) |
| **Approach** | Automated integration test |
| **Tool** | Vitest (node environment) |
| **Responsibility** | Developer |

### Level 3: System / End-to-End Testing

| Aspect | Detail |
| --- | --- |
| **Target** | Seluruh alur auth via browser |
| **Approach** | Manual test execution berdasarkan test case specification |
| **Tool** | Browser (Chrome/Edge), Email client |
| **Responsibility** | Tester |

### Level 4: User Acceptance Testing (UAT)

| Aspect | Detail |
| --- | --- |
| **Target** | Alur registrasi dan login oleh pengguna nyata (kontraktor) |
| **Approach** | Manual exploratory testing di staging environment |
| **Responsibility** | End User (Kontraktor) |

## 3.2 Testing Approach

### Prioritas Testing

1. **F001 Auth (Critical):** 100% test case dieksekusi sebelum merge ke main
2. **F002–F012 (Mock):** UI smoke test — pastikan halaman render tanpa error

### Defect Management

| Stage | Action |
| --- | --- |
| Defect Found | Catat di `docs/CHANGELOG.md` atau GitHub Issues |
| Critical Defect | Hentikan testing sampai diperbaiki |
| Major Defect | Tandai TC sebagai FAIL, lanjutkan test lain |
| Minor/Trivial | Dokumentasikan, lanjutkan testing |

---

# 4. TEST ENVIRONMENT

## 4.1 Environment Setup

| Environment | Usage |
| --- | --- |
| Local Development | `npm run dev` di localhost:3000 |
| Staging | Vercel preview URL (recommended sebelum UAT) |
| Production | Vercel production URL |

## 4.2 Software Requirements

| Software | Version |
| --- | --- |
| Node.js | ≥ 18 |
| Browser (primary) | Chrome (latest stable) |
| Browser (secondary) | Edge, Firefox (latest stable) |
| Email client | Gmail atau Outlook (untuk verifikasi OTP) |

## 4.3 Test Data Requirements

| Data Item | Value | Notes |
| --- | --- | --- |
| Email test (valid) | Gunakan email real yang bisa menerima OTP | Resend harus dapat deliver |
| Email test (tidak terdaftar) | email_tidak_ada@test.com | Untuk test AF/EF |
| Password valid | Min 8 karakter | Contoh: `TestPass123!` |
| Password salah | `wrongpassword` | Untuk test EF |
| OTP valid | Ambil dari email yang diterima | — |
| OTP salah | `000000` | Kemungkinan besar salah |
| Akun suspended | Dibuat manual oleh admin di DB | Untuk test EF |

## 4.4 Environment Variables Required

```bash
DATABASE_URL=          # Neon connection string
RESEND_API_KEY=        # Resend API key untuk OTP email
NEXTAUTH_SECRET=       # Required oleh next-auth (installed, not used)
```

---

# 5. ROLES & RESPONSIBILITIES

| Role | Name / Tim | Responsibility |
| --- | --- | --- |
| Test Manager | Developer Lead | Menyusun test plan, mengawasi eksekusi |
| Tester | QA / Developer | Mengeksekusi manual test cases |
| Developer | Backend Dev | Memperbaiki defect yang ditemukan |
| End User | Kontraktor (pilot) | UAT — mencoba registrasi dan login nyata |

---

# 6. TEST SCHEDULE

| Phase | Activity | Duration | Deliverable |
| --- | --- | --- | --- |
| **P1: Test Preparation** | Siapkan environment, test data, akun test | 1 hari | Test environment ready |
| **P2: Unit Test** | Jalankan `npm run test` — verifikasi semua pass | 1 hari | Unit test report |
| **P3: Manual Test Execution** | Eksekusi test cases F001 (24 TC) | 2 hari | Test Execution Sheet |
| **P4: Defect Fixing** | Developer perbaiki defect | 1–2 hari | Fixed build |
| **P5: Re-testing** | Verifikasi perbaikan, regression test | 1 hari | Updated execution sheet |
| **P6: UAT** | Kontraktor mencoba registrasi dan login nyata | 1 hari | UAT sign-off |
| **P7: Test Closure** | Rangkum hasil, update dokumentasi | 1 hari | Test Summary |

**Total estimasi:** 8–9 hari kerja

---

# 7. ENTRY & EXIT CRITERIA

## 7.1 Entry Criteria

| No | Criteria |
| --- | --- |
| EC-01 | SRS, User Flow, dan Test Cases sudah di-review |
| EC-02 | Environment development/staging sudah running (`npm run dev`) |
| EC-03 | `DATABASE_URL` dan `RESEND_API_KEY` sudah dikonfigurasi |
| EC-04 | Akun email test sudah siap untuk menerima OTP |
| EC-05 | `npm run test` semua pass (unit test) |

## 7.2 Exit Criteria

| No | Criteria |
| --- | --- |
| XC-01 | 100% test case F001 sudah dieksekusi |
| XC-02 | Tidak ada defect Critical atau Major yang masih open |
| XC-03 | Semua defect Minor/Trivial sudah didokumentasikan |
| XC-04 | UAT selesai dengan sign-off dari end user |
| XC-05 | `npm run build` sukses tanpa error |

## 7.3 Suspension Criteria

| No | Criteria |
| --- | --- |
| SC-01 | Critical defect pada flow registrasi atau login yang menghalangi lebih dari 50% test |
| SC-02 | Resend API tidak dapat diakses / rate limited |
| SC-03 | Database Neon tidak dapat diakses |

---

# 8. TEST DELIVERABLES

| Deliverable | Description | Due |
| --- | --- | --- |
| Test Plan | Dokumen ini | P1 |
| Test Case Specification | `test_cases.md` | P1 |
| Unit Test Results | Output `npm run test` | P2 |
| Test Execution Sheet | `test_execution_sheet.md` terisi | P3 |
| Defect Log | Catatan di `docs/CHANGELOG.md` | P3 |
| Re-test Report | Execution sheet diperbarui | P5 |
| UAT Sign-off | Persetujuan tertulis end user | P6 |
| Test Summary Report | Rangkuman akhir | P7 |

---

# 9. RISK & MITIGATION

| Risk ID | Risk Description | Probability | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R-01 | Resend rate limit selama testing intensif | Medium | High | Gunakan satu email test dan kurangi frekuensi resend test |
| R-02 | Neon cold start memperlambat response | Low | Medium | Warm up DB sebelum test execution |
| R-03 | Email OTP masuk ke spam | Medium | Medium | Whitelist domain pengirim di email client |
| R-04 | Cookie Secure flag gagal di localhost | Low | Medium | Gunakan `http://localhost` atau disable Secure untuk dev |
| R-05 | Test data akun suspended sulit dibuat | Low | Low | Buat script seeder untuk akun suspended |

---

# 10. APPROVAL

| Role | Name | Date |
| --- | --- | --- |
| Test Manager | | |
| Developer Lead | | |
| Project Sponsor | | |

---

# 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
