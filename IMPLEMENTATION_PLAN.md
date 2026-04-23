# KontraktorPro — Implementation Plan

## Summary
- Prioritas delivery dimulai dari foundation, public/auth, contractor core, project operations, lalu sharing, billing, dan admin.
- Arsitektur mengikuti `design-reference/markdown/design-system-kontraktorpro.md` dan `techstack/kontraktorpro-tech-stack.md`.
- Implementasi awal menggunakan shared contracts dan mock services agar UI dan alur domain bisa dibangun paralel.

## Phases
### Phase 1 — Foundation & Architecture
- Scaffold Next.js App Router, TypeScript, Tailwind, shared contracts, Drizzle schema, service abstractions, dan root metadata.
- Bentuk route groups untuk public, auth, contractor app, dan admin.

### Phase 2 — Public + Auth
- Bangun landing, pricing, directory, public profile, owner tracking.
- Bangun register, login, verify OTP, forgot password, dan onboarding redirect.

### Phase 3 — Contractor Core
- Bangun dashboard, daftar proyek, buat/edit proyek, dan detail proyek shell.
- Tambahkan state proyek, notifikasi, KPI, dan batas paket dasar.

### Phase 4 — Project Operations
- Lengkapi WBS, laporan harian, foto, tim, material, dan pengaturan proyek.
- Sinkronkan activity log, reminder, dan interaksi lintas tab.

### Phase 5 — Sharing & Portfolio
- Tambahkan publish portfolio, owner tracking, dan service contract untuk PDF/report.

### Phase 6 — Billing
- Tambahkan subscription UI, checkout, konfirmasi pembayaran, dan enforcement feature tier.

### Phase 7 — Admin
- Tambahkan admin dashboard, moderation, manajemen pengguna, metrik bisnis, dan audit log.

## Shared Interfaces
- Roles: `contractor`, `moderator`, `super_admin`
- Tiers: `free`, `pro`, `business`
- Services: `AuthOtpService`, `FileStorageService`, `PdfReportService`, `PaymentGatewayService`, `NotificationService`
- Entities: `User`, `ContractorProfile`, `Project`, `WbsItem`, `DailyReport`, `ProjectPhoto`, `ProjectMember`, `MaterialEntry`, `Subscription`, `PaymentTransaction`, `PortfolioEntry`, `Review`, `AdminActivityLog`

## Acceptance Gates
- Public CTA dan auth flow berjalan end-to-end.
- Contractor dapat membuat dan mengelola proyek dengan laporan operasional dasar.
- Billing mengubah tier langganan dengan benar.
- Admin action tercatat di audit log dan dibatasi oleh RBAC.
