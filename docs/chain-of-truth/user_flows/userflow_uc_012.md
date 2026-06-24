# User Flow Specification

Document Version: v1.0

Use Case ID: UC-012
Use Case Name: Billing & Checkout Langganan

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **MOCK** — checkout mock redirect langsung ke success page

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor dapat melihat paket langganan aktif, membandingkan tier, melihat riwayat invoice, dan melakukan upgrade paket melalui proses checkout.

## 1.2 Goal

Kontraktor ingin meng-upgrade paket langganan untuk mendapatkan akses ke fitur premium.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F011 | Billing & Manajemen Langganan |

## 1.4 Primary Actor

Kontraktor / Semua role terautentikasi

---

# 2. TRIGGER

Kontraktor klik menu "Billing" di sidebar atau redirect dari fitur yang memerlukan tier lebih tinggi.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Pengguna memiliki sesi aktif (semua role boleh akses billing) |

---

# 4. MAIN FLOW — Melihat Billing

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/billing` | `requireAuth()` memverifikasi sesi |
| 2 | — | Sistem menampilkan halaman billing dari `billing-data.ts` |
| 3 | — | Tampil: paket aktif saat ini, perbandingan fitur tiga tier, riwayat invoice |
| 4 | Kontraktor membaca informasi paket | — |
| 5 | Kontraktor klik "Upgrade ke Pro/Business" | Sistem redirect ke `/billing/checkout` |

---

# 5. MAIN FLOW — Checkout

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/billing/checkout` | Sistem menampilkan halaman checkout |
| 2 | — | Tampil: paket yang dipilih, harga, metode pembayaran |
| 3 | Kontraktor memilih metode pembayaran | — |
| 4 | Kontraktor klik "Bayar Sekarang" | _(Planned)_ `PaymentGatewayService.startCheckout()` dipanggil |
| 5 | _(Mock)_ | Sistem redirect langsung ke `/billing/checkout/success` |
| 6 | — | Halaman konfirmasi sukses ditampilkan |

---

# 6. ALTERNATIVE FLOWS

## AF-001: Klik "Batal" saat Checkout

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Batal" | Sistem kembali ke `/billing` |

---

# 7. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Billing dapat diakses oleh semua role (`requireAuth()` — bukan hanya contractor) |
| BR-002 | Tier: `free` → `pro` → `business` (upgrade path) |
| BR-003 | **Mock:** Checkout tidak memanggil payment gateway nyata |
| BR-004 | **Planned:** Integrasi Midtrans atau payment gateway lokal di fase berikutnya |

---

# 8. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Halaman billing menampilkan paket aktif saat ini |
| AC-002 | Perbandingan fitur tiga tier ditampilkan |
| AC-003 | Riwayat invoice tersedia |
| AC-004 | Tombol upgrade tersedia untuk paket yang lebih tinggi |
| AC-005 | _(Planned)_ Checkout terintegrasi dengan payment gateway nyata |
| AC-006 | Halaman konfirmasi sukses tampil setelah pembayaran berhasil |

---

# 9. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F011 | PAGE-M04-001, PAGE-M04-002, PAGE-M04-003 |

---

# 10. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
