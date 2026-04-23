# Tech Stack — KontraktorPro

> Dokumen ini merangkum seluruh teknologi yang digunakan dalam pengembangan platform SaaS KontraktorPro. Stack dipilih berdasarkan kebutuhan project hobby full-stack dengan target deploy ke Vercel.

---

## 1. Framework & Runtime

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Full-stack Framework | Next.js @latest | App Router, Server Components, Server Actions |
| Runtime | Node.js @latest | Runtime default Next.js |
| Bahasa | TypeScript @latest | Type-safety di seluruh codebase |

---

## 2. Database & ORM

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Database | PostgreSQL via Neon @latest | Serverless PostgreSQL, cocok untuk Vercel |
| ORM | Drizzle ORM @latest | Type-safe, ringan, sintaks dekat dengan SQL |
| Drizzle Kit | drizzle-kit @latest | CLI untuk migrasi dan push schema |

---

## 3. Autentikasi

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Auth | NextAuth.js / Auth.js @latest | Session management, credentials & OAuth provider |

---

## 4. Styling & UI

| Kategori | Teknologi | Keterangan |
|---|---|---|
| CSS Framework | Tailwind CSS @latest | Utility-first, dasar design system KontraktorPro |
| Komponen UI | shadcn/ui @latest | Komponen siap pakai, di-copy ke project (full kontrol) |
| Ikon | Lucide React @latest | Ikon default bawaan shadcn/ui |

---

## 5. File Upload

| Kategori | Teknologi | Keterangan |
|---|---|---|
| File Upload | Uploadthing @latest | Dibuat khusus untuk Next.js + Vercel, type-safe |

---

## 6. State Management

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Client State | Zustand @latest | Ringan, simpel, cocok untuk Next.js |
| Server State & Caching | TanStack Query @latest | Data fetching, caching, loading/error state otomatis |

---

## 7. Validasi & Form

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Schema Validation | Zod @latest | Type-safe schema validation |
| Form Management | React Hook Form @latest | Performa tinggi, integrasi mulus dengan Zod |
| Resolver | @hookform/resolvers @latest | Jembatan antara React Hook Form dan Zod |

---

## 8. Deployment & Infrastruktur

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Hosting & Deploy | Vercel @latest | Platform deploy utama, native support Next.js |
| Database Hosting | Neon (serverless) | Managed PostgreSQL, terintegrasi dengan Vercel |

---

## 9. Payment *(planned — belum diimplementasi)*

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Payment Gateway | Midtrans | Akan diintegrasikan setelah proses validasi selesai |

---

## Ringkasan Dependency Utama

```
next@latest
typescript@latest
tailwindcss@latest
drizzle-orm@latest
drizzle-kit@latest
next-auth@latest
@neondatabase/serverless@latest
shadcn/ui@latest
lucide-react@latest
uploadthing@latest
zustand@latest
@tanstack/react-query@latest
zod@latest
react-hook-form@latest
@hookform/resolvers@latest
```

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan project.*
