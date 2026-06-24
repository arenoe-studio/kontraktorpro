# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project: KontraktorPro

Construction project management SaaS for Indonesian contractors. Next.js 16.2.4 (App Router), TypeScript 5, Tailwind CSS v4, PostgreSQL via Neon + Drizzle ORM, custom cookie-based auth. All UI strings are in Bahasa Indonesia (`id-ID` locale).

**Current state:** Auth layer is real (PostgreSQL + bcryptjs + Resend email OTP). Projects, WBS, team members, materials, photos, daily reports, and settings features have real DB-backed services and Server Actions. No real payment, file storage, or notification integrations.

---

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # Type-check without emitting (tsc --noEmit)
npm run lint         # ESLint
npm run test         # Run all tests once (vitest run)
npm run test:watch   # Vitest in watch mode
npm run db:generate  # Generate Drizzle migration files
npm run seed:demo    # Seed demo data (tsx scripts/seed-demo.ts)
```

Run a single test file:
```bash
npx vitest run src/features/auth/__tests__/auth-service.property.test.ts
```

---

## Mandatory Reference Files

**ALWAYS read before performing any task:**

1. `docs/Project_Codebase.md` — full function reference, API flow maps, data layer, dependency map, sensitive areas
2. `docs/blueprint/` — per-feature design blueprints (source of truth for planned behavior)
3. `docs/chain-of-truth/srs.md` — SRS v1.0, root source of truth (SoT-1), feature scope and business rules
4. `docs/chain-of-truth/information_architecture.md` — route map and auth guard reference (SoT-2)

These files supersede any assumptions about architecture, routes, or data flow.

---

## Architecture

### App Router Structure

```
src/app/
  layout.tsx                    ← Root layout: Toaster + QueryProvider
  (marketing)/                  ← Public pages — no auth guard
  (auth)/                       ← redirectIfAuthenticated() guard
  (app)/                        ← requireRole("contractor") guard
  billing/                      ← requireAuth() guard (any role)
  admin/                        ← requireRole(["moderator", "super_admin"]) guard
```

Route groups use `layout.tsx` for auth guards. **No `route.ts` API handlers exist anywhere.**

### page.tsx Pattern

All `page.tsx` files are thin entry points — they call session guards and pass data to `_components/`. Each route group has a shared `_components/` folder:

- `src/app/(auth)/_components/` — auth form components
- `src/app/(app)/_components/` — contractor app components + `mock-data.ts` + form modals
- `src/app/(app)/settings/_components/` — settings form components (profile, account)
- `src/app/(marketing)/_components/` — marketing content + `content.ts`
- `src/app/billing/_components/` — billing UI + `billing-data.ts`
- `src/app/admin/_components/` — admin UI + `admin-mocks.ts`

Modal components in `(app)/_components/` follow a `*-form-modal.tsx` naming convention (e.g., `team-form-modal.tsx`, `wbs-form-modal.tsx`, `photo-form-modal.tsx`).

### Feature Services Pattern

Every non-auth feature follows this structure under `src/features/<feature>/`:

| File | Purpose |
|---|---|
| `schemas.ts` | Zod validation schemas for forms and mutations |
| `*-service.ts` | DB query functions (`server-only`) — returns typed data |
| `actions.ts` | Server Actions — validates with Zod, calls service, returns `{ success, error }` |

Active features with real DB services: `projects`, `wbs`, `team`, `materials`, `photos`, `reports`, `settings`, `dashboard`.

Calling pattern: UI form → Server Action (`actions.ts`) → service (`*-service.ts`) → Drizzle query.

### Auth System

Custom cookie-based session (`kp-auth-session`). **`next-auth` is installed but NOT used — do not activate it.**

Key files:
- `src/lib/auth/session.ts` — `getCurrentUser`, `requireAuth`, `requireRole`, `redirectIfAuthenticated`
- `src/features/auth/actions.ts` — all auth Server Actions
- `src/features/auth/auth-service.ts` — real DB auth logic (bcryptjs, Resend)
- `src/lib/db/index.ts` — Drizzle DB instance (lazy-initialized Proxy, Neon serverless)
- `src/lib/db/queries/users.ts` — user query helpers
- `src/lib/services/email-otp-service.ts` — Resend email OTP
- `src/features/settings/settings-service.ts` — profile + password update (real DB)

Cookies: `kp-auth-session` (30d), `kp-auth-otp` (15min), `kp-auth-reset` (15min). All `secure: true`.

### Data Layer

Schema at `src/lib/db/schema.ts`. One migration applied to Neon (`0001_spotty_roland_deschain.sql`). **Schema changes require `npm run db:generate` + applying migration to Neon — never edit schema without running migrations.**

No FK constraints declared in Drizzle schema. All enum values are canonical in `src/lib/contracts/enums.ts` — do not redefine them elsewhere.

Active schema tables: `users`, `contractorProfiles`, `projects`, `wbsItems`, `projectMembers`, `materials`, `materialUsages`, `projectPhotos`, `dailyReports`. Enums: `role`, `authIntent`, `subscriptionTier`, `projectStatus`, `reportStatus`, `moderationStatus`.

### Shared Utilities

| Path | Purpose |
|---|---|
| `src/lib/utils.ts` | `cn()`, `formatCurrency()`, `formatDate()` |
| `src/lib/ui/cn.ts` | Re-export of `cn` — backward compat only |
| `src/lib/ui/tokens.ts` | Progress/status tone maps |
| `src/lib/contracts/enums.ts` | Canonical enum definitions |
| `src/lib/contracts/types.ts` | Canonical entity types |
| `src/lib/contracts/mock-data.ts` | Shared mock entities (billing, admin) |
| `src/lib/navigation.ts` | Nav links per role |
| `src/lib/site.ts` | Site config + default metadata |
| `src/lib/services/contracts.ts` | Service interfaces (FileStorage, PDF, Payment, Notification — all PLANNED) |

### State Management

- **Zustand** at `src/lib/store/` (`ui-store.ts` + `index.ts`) — created but not yet consumed by any component
- **React Query** wired via `src/components/providers/query-provider.tsx` in root layout — no `useQuery` calls yet; all data is fetched server-side via services called in `page.tsx`

### Testing

Vitest (`node` environment). Test files live in `__tests__/` subfolders next to their feature. `fast-check` used for property-based tests in auth and dashboard.

---

## AI Agent Operation Rules

### Primary Objective

Act as a careful senior engineer maintaining a production-grade application. Prioritize stability and consistency over speed.

### Mandatory Workflow

**STEP 0 — STOP & STUDY**: Upon receiving ANY prompt, do NOT execute immediately. First study the request, the relevant codebase, and the required Chain of Truth documents, then present a Confirmation Plan to the user. Wait for explicit approval before proceeding. **The only exception: the user explicitly writes "langsung eksekusi" or an equivalent direct-execute instruction.**

**STEP 1 — ANALYZE**: affected modules, dependencies, side effects, existing patterns.

**STEP 2 — CONFIRM**: present the Confirmation Plan (see format below). Do NOT write code before user approval.

**STEP 3 — IMPLEMENT**: edit conservatively, preserve existing architecture, avoid changing unrelated logic.

**STEP 4 — VERIFY**: imports, dependency consistency, no duplicated logic, no broken references.

**STEP 5 — DOCUMENT**: update `docs/CHANGELOG.md` after every session. Update context documents (see Context Sync Rule below) immediately after any change.

---

### Confirmation Plan Format

Before executing any task, present a plan in this exact structure:

```
## Konfirmasi Rencana — [Nama Tugas]

### a. Interpretasi
- [Apa yang saya pahami dari permintaan ini]
- [Asumsi yang saya buat, jika ada]

### b. Rencana Implementasi
1. [Langkah pertama]
2. [Langkah kedua]
...

### c. File yang Akan Diubah
- `path/to/file.ts` — [alasan]
- `path/to/new-file.ts` — [dibuat baru / dimodifikasi]

### d. Rencana Changelog
- Tipe: [Feature / Fix / Refactor / Docs]
- Judul: [Judul singkat entry changelog]
- Risiko: [Low / Medium / High — area yang terdampak]

### e. Dampak ke Chain of Truth / Dokumen Konteks
- [Dokumen CoT mana yang perlu diperbarui, atau "Tidak ada perubahan dokumen konteks"]

---
Setuju untuk lanjut?
```

---

### Chain of Truth Integration

KontraktorPro menggunakan metodologi **Chain of Truth** sebagai acuan pengembangan. Hierarki dokumen:

```
SRS (SoT-1) → docs/chain-of-truth/srs.md
  └── Information Architecture (SoT-2) → docs/chain-of-truth/information_architecture.md
        └── Design System (SoT-3) → docs/chain-of-truth/design_system.md
              └── User Flows (SoT-4) → docs/chain-of-truth/user_flows/
                    └── System Logics (SoT-5) → docs/chain-of-truth/system_logics/
                          └── Test Cases → docs/chain-of-truth/test_cases.md
                                └── Test Plan → docs/chain-of-truth/test_plan.md
                                      └── Execution Sheet → docs/chain-of-truth/test_execution_sheet.md
```

**Aturan Chain of Truth:**

- Chain of Truth adalah acuan utama untuk memahami scope, flow, dan implikasi perubahan; jangan melompati urutan dokumen induk ke dokumen turunan.
- Sebelum mengimplementasikan fitur apapun: baca `srs.md` (fitur terkait) + `user_flows/userflow_uc_[NNN].md` + `system_logics/sys_uc_[NNN].md` terlebih dahulu.
- Implementasi WAJIB sesuai spec di dokumen CoT — jangan berasumsi atau melampaui scope yang didefinisikan di SRS.
- Ketika fitur berubah status dari MOCK → IMPLEMENTED: perbarui status di `user_flows/index.md` dan `prompts.md`.
- Ketika fitur baru diimplementasikan: buat System Logic document baru di `system_logics/`.
- Ketika route baru ditambahkan: perbarui `information_architecture.md`.
- Ketika data model berubah: perbarui `data_model.md`.
- Ketika ada use case baru: tambahkan ke `user_flows/index.md` dan buat file `userflow_uc_[NNN].md`.
- Ketika System Logic baru dibuat: tambahkan test cases ke `test_cases.md` dan baris baru ke `test_execution_sheet.md`.
- Jika perubahan menyentuh lebih dari satu artefak konteks, sinkronkan semua dokumen terkait pada sesi yang sama agar konteks tidak hilang, tidak bertabrakan, dan tidak menimbulkan interpretasi ganda.

---

### Context Sync Rule

**Setiap perubahan konteks project HARUS diikuti dengan pembaruan dokumen konteks yang relevan pada sesi yang sama.** Jangan biarkan gap antara kode aktual dan dokumentasi. Jika konteks berubah, dokumen konteks juga harus berubah pada sesi yang sama.

| Jenis Perubahan | Dokumen yang Harus Diperbarui |
|---|---|
| Fitur baru / status MOCK → IMPLEMENTED | `srs.md`, `user_flows/index.md`, `prompts.md` |
| Route / halaman baru | `information_architecture.md` |
| Schema DB berubah | `data_model.md` |
| Server Action baru | `system_logics/sys_uc_[NNN].md` (buat baru) |
| Use case baru | `user_flows/userflow_uc_[NNN].md` (buat baru), `user_flows/index.md` |
| Komponen / UI baru | `design_system.md` jika pola baru |
| Fitur selesai diimplementasikan | `test_cases.md`, `test_execution_sheet.md` |
| Dependency baru | `docs/Project_Codebase.md` |
| Perubahan konteks proyek apa pun | Dokumen konteks yang relevan harus ikut diperbarui agar tidak terjadi konflik konteks |
| Apapun yang diubah | `docs/CHANGELOG.md` — wajib setiap sesi |

Konteks yang tidak disinkronkan akan menyebabkan konflik dan hallusinasi di sesi berikutnya.

### Core Rules

1. NEVER assume undocumented behavior — if uncertain, write UNKNOWN or ask first
2. NEVER create duplicate systems or overlapping logic
3. NEVER rewrite large areas unless necessary
4. NEVER rename files unless absolutely required
5. NEVER break existing feature flows or change architecture style mid-project
6. NEVER activate `next-auth` — it will conflict with the custom cookie session
7. ALWAYS reuse existing patterns and utilities before creating new ones
8. ALWAYS trace dependencies before editing
9. ALWAYS prefer extending existing systems over creating parallel systems

### Anti-Hallucination Rules

Only use information explicitly found in the codebase or documentation. Do not fabricate APIs, services, database structures, or business logic.

### Code Modification Policy

**Allowed:** new files, new modules, add dependencies, careful structural improvements, reusable utilities, small isolated refactors.

**Avoid:** renaming files, changing public interfaces unnecessarily, changing routes unnecessarily, large uncontrolled refactors, duplicate helpers/services/hooks.

Before creating a new utility or service, check if similar logic already exists.

### Dependency Rules

New dependencies allowed only if genuinely needed, documented, lightweight, and not duplicating existing capability. Update changelog and `Project_Codebase.md` if impactful.

### Changelog Format

File: `docs/CHANGELOG.md`

```markdown
## YYYY-MM-DD — [Type]: [Title]

### Modified
- path/to/file.ts

### Added
- path/to/new-file.ts

### Changes
- Bullet summary of what changed

### Risks
- Risk level + affected area

### Dependencies
- None / package@version — reason
```

### Implementation Style Priority

1. Stability → 2. Readability → 3. Consistency → 4. Maintainability → 5. Scalability → 6. Performance

Prefer modular functions, reusable utilities, predictable structure, explicit naming, low side effects. Avoid magic values, giant functions, unnecessary abstractions.

### Sensitive Areas — Do Not Weaken

| Area | Risk |
|---|---|
| `src/lib/auth/session.ts` | CRITICAL — session cookie, HTTPS-only |
| `src/features/auth/actions.ts` | CRITICAL — all auth mutations |
| `src/features/auth/auth-service.ts` | CRITICAL — real DB auth, bcryptjs |
| `src/lib/db/schema.ts` | HIGH — live schema, requires migrations |
| `src/app/admin/layout.tsx` | HIGH — RBAC guard, do not weaken role check |
| `src/app/(app)/layout.tsx` | HIGH — contractor-only guard |
| `.env` | CRITICAL — do not read or echo |
