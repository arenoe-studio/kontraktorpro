# Requirements Document

## Introduction

Fitur ini menggantikan semua data mock/hardcoded pada Dashboard Utama Kontraktor (`/dashboard`) dengan data riil dari database PostgreSQL (Neon) via Drizzle ORM. Setiap kontraktor yang login akan melihat data proyeknya sendiri secara real-time. Tidak ada pemisahan logika antara akun demo dan akun biasa — semua user menggunakan jalur query yang sama. Akun demo (`arenoe.studio@gmail.com`) mendapatkan tampilan yang kaya karena database-nya di-seed dengan data representatif melalui seed script, bukan karena ada cabang kode khusus.

Dashboard mencakup enam blok data: (A) Greeting dinamis, (B) Kartu Statistik KPI, (C) Notifikasi & Reminder, (D) Daftar Proyek Aktif, (E) Aktivitas Terbaru, dan (F) Shortcut Aksi Cepat.

---

## Glossary

- **Dashboard_Service**: Modul server-side yang mengambil dan mengagregasi data dashboard dari database untuk satu kontraktor.
- **Demo_Account**: Akun dengan email `arenoe.studio@gmail.com` yang database-nya di-seed dengan data representatif. Tidak ada perlakuan kode khusus — akun ini menggunakan jalur query yang sama dengan user biasa.
- **Seed_Script**: Script yang mengisi database dengan data proyek, laporan, aktivitas, dan anggota tim yang realistis untuk akun demo, dijalankan sekali saat setup atau reset environment.
- **Real_Data**: Data yang diambil langsung dari tabel `projects`, `daily_reports`, `project_members`, `activity_logs`, dan `portfolio_entries` di database PostgreSQL — berlaku untuk semua user termasuk akun demo.
- **DashboardSummary**: Tipe data agregat yang berisi semua informasi yang dibutuhkan komponen `DashboardPage` untuk dirender.
- **KPI_Card**: Kartu statistik ringkasan (Proyek Aktif, Laporan Hari Ini, Progres Rata-rata, Selesai Bulan Ini).
- **Reminder**: Item notifikasi/pengingat yang muncul di Blok C dashboard, dihasilkan dari kondisi data proyek.
- **Activity**: Item aktivitas terbaru lintas proyek yang muncul di Blok E dashboard, bersumber dari tabel `activity_logs`.
- **Contractor_Shell**: Layout wrapper `(app)/layout.tsx` yang sudah memanggil `requireRole("contractor")` dan menyediakan `DbUser` sesi.
- **Project_Status**: Enum nilai `draft | active | delayed | completed | archived` (didefinisikan di `src/lib/contracts/enums.ts`).

---

## Requirements

### Requirement 1: Sumber Data Dashboard Berdasarkan Identitas Pengguna

**User Story:** Sebagai kontraktor yang login, saya ingin dashboard menampilkan data proyek saya sendiri, sehingga informasi yang saya lihat relevan dan akurat.

#### Acceptance Criteria

1. WHEN kontraktor mengakses `/dashboard`, THE Dashboard_Service SHALL mengambil data berdasarkan `userId` dari sesi aktif yang sudah divalidasi oleh `requireRole("contractor")`.
2. THE Dashboard_Service SHALL menggunakan jalur query database yang identik untuk semua user, tanpa cabang logika berdasarkan email atau identitas akun tertentu.
3. THE Dashboard_Service SHALL mengembalikan data bertipe `DashboardSummary` yang strukturnya sama untuk semua user, sehingga komponen `DashboardPage` tidak perlu mengetahui identitas pengguna.
4. IF terjadi error saat query database, THEN THE Dashboard_Service SHALL melempar exception yang ditangkap oleh error boundary Next.js, bukan mengembalikan data kosong secara diam-diam.
5. WHEN pengguna belum memiliki proyek apapun, THE Dashboard_Service SHALL mengembalikan `DashboardSummary` yang valid dengan semua nilai numerik bernilai `0` dan semua array bernilai kosong, bukan error.

---

### Requirement 2: Greeting Dinamis (Blok A)

**User Story:** Sebagai kontraktor, saya ingin sapaan di dashboard menampilkan nama saya yang sebenarnya dan ringkasan situasi yang akurat, sehingga saya langsung tahu kondisi proyek hari ini.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL menyertakan `fullName` pengguna dari tabel `users` dalam `DashboardSummary` untuk digunakan pada teks sapaan.
2. WHEN waktu server dikonversi ke WIB (UTC+7) adalah antara 05:00–11:59, THE Dashboard_Service SHALL menyertakan label sapaan `"Selamat pagi"` dalam `DashboardSummary`.
3. WHEN waktu server dikonversi ke WIB (UTC+7) adalah antara 12:00–14:59, THE Dashboard_Service SHALL menyertakan label sapaan `"Selamat siang"` dalam `DashboardSummary`.
4. WHEN waktu server dikonversi ke WIB (UTC+7) adalah antara 15:00–17:59, THE Dashboard_Service SHALL menyertakan label sapaan `"Selamat sore"` dalam `DashboardSummary`.
5. WHEN waktu server dikonversi ke WIB (UTC+7) adalah antara 18:00–04:59, THE Dashboard_Service SHALL menyertakan label sapaan `"Selamat malam"` dalam `DashboardSummary`.
6. THE Dashboard_Service SHALL menghitung jumlah proyek dengan `projects.owner_id = userId` dan status `active` atau `delayed`, dan menyertakannya dalam `DashboardSummary` sebagai `activeProjectCount`.
7. THE Dashboard_Service SHALL menghitung jumlah proyek berstatus `active` atau `delayed` milik pengguna yang belum memiliki `daily_reports` dengan status `submitted` dan `createdAt` pada tanggal kalender hari ini (UTC+7), dan menyertakannya sebagai `pendingReportCount`.

---

### Requirement 3: Kartu Statistik KPI (Blok B)

**User Story:** Sebagai kontraktor, saya ingin melihat empat KPI utama yang dihitung dari data riil, sehingga saya bisa memantau kesehatan semua proyek dalam satu pandangan.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL menghitung `activeProjectCount` sebagai jumlah proyek milik pengguna dengan status `active` atau `delayed`.
2. THE Dashboard_Service SHALL menghitung `reportCompletionToday` sebagai rasio `{jumlah proyek aktif yang memiliki minimal satu daily_report berstatus submitted dengan createdAt pada tanggal hari ini (UTC+7)}/{total proyek aktif}` dalam format string `"X/Y"`; WHEN total proyek aktif adalah `0`, THE Dashboard_Service SHALL mengembalikan `"0/0"`.
3. THE Dashboard_Service SHALL menghitung `averageProgress` sebagai rata-rata integer dari kolom `progress` seluruh proyek berstatus `active` atau `delayed` milik pengguna; WHEN tidak ada proyek aktif, THE Dashboard_Service SHALL mengembalikan nilai `0`.
4. THE Dashboard_Service SHALL menghitung `finishedThisMonth` sebagai jumlah proyek milik pengguna dengan status `completed` dan `completedAt` dalam bulan kalender yang sama dengan tanggal hari ini (UTC+7); kolom `completedAt` SHALL diisi saat status proyek bertransisi ke `completed`.
5. WHEN ada proyek aktif yang `targetDate`-nya kurang dari atau sama dengan 7 hari dari sekarang (dihitung dalam UTC+7), THE Dashboard_Service SHALL menyertakan array `nearDeadlineProjects` dalam `DashboardSummary`, di mana setiap item berisi `id`, `name`, `targetDate`, dan `daysRemaining`.
6. THE `projects` table SHALL memiliki kolom `targetDate` (date, nullable) dan `completedAt` (timestamp, nullable) sebagai prasyarat untuk kriteria 4 dan 5; jika kolom belum ada, migration database harus dilakukan sebelum implementasi Dashboard_Service.

---

### Requirement 4: Notifikasi & Reminder (Blok C)

**User Story:** Sebagai kontraktor, saya ingin melihat reminder yang dihasilkan dari kondisi data riil proyek saya, sehingga saya tahu tindakan apa yang perlu diambil hari ini.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL menghasilkan item Reminder bertipe `danger` untuk setiap proyek milik pengguna berstatus `active` atau `delayed` yang belum memiliki `daily_reports` berstatus `submitted` pada tanggal hari ini (UTC+7).
2. THE Dashboard_Service SHALL menghasilkan item Reminder bertipe `warning` untuk setiap proyek milik pengguna yang `targetDate`-nya kurang dari atau sama dengan 7 hari dari sekarang (termasuk tanggal yang sudah lewat) dan statusnya masih `active` atau `delayed`.
3. THE Dashboard_Service SHALL menghasilkan item Reminder bertipe `success` untuk setiap proyek milik pengguna berstatus `completed` yang belum memiliki entri di tabel `portfolio_entries` dengan status `published` atau `draft` yang terkait dengan proyek tersebut.
4. THE Dashboard_Service SHALL mengurutkan daftar Reminder dengan prioritas: `danger` → `warning` → `success` → `info`.
5. THE Dashboard_Service SHALL membatasi jumlah Reminder yang dikembalikan maksimal 5 item, diambil dari urutan prioritas tertinggi; IF satu proyek memenuhi lebih dari satu kondisi Reminder, THEN setiap kondisi menghasilkan item Reminder terpisah dan keduanya dihitung dalam batas 5.
6. IF tidak ada kondisi yang memicu Reminder, THEN THE Dashboard_Service SHALL mengembalikan array Reminder kosong.

---

### Requirement 5: Daftar Proyek Aktif (Blok D)

**User Story:** Sebagai kontraktor, saya ingin melihat daftar proyek aktif saya yang diurutkan berdasarkan urgensi, sehingga saya bisa fokus pada proyek yang paling membutuhkan perhatian.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL mengambil proyek milik pengguna dengan status `active` atau `delayed` dari tabel `projects`.
2. THE Dashboard_Service SHALL mengurutkan proyek berdasarkan urgensi: proyek `delayed` muncul lebih dulu, kemudian proyek `active` diurutkan berdasarkan `targetDate` terdekat (ascending); proyek tanpa `targetDate` ditempatkan di akhir urutan.
3. THE Dashboard_Service SHALL membatasi daftar proyek yang dikembalikan maksimal 5 item.
4. THE Dashboard_Service SHALL menyertakan untuk setiap proyek: `id`, `name`, `type`, `location`, `ownerName`, `status`, `progress` (integer 0–100), `targetDate` (nullable), `daysRemaining` (integer nullable, dihitung sebagai `targetDate - today` dalam UTC+7), `reportCount` (jumlah daily_reports terkait), dan `photoCount` (bernilai `0` hingga tabel photos tersedia).
5. IF kolom `targetDate` bernilai `null` untuk sebuah proyek, THEN `daysRemaining` untuk proyek tersebut SHALL bernilai `null`.
6. WHEN tidak ada proyek berstatus `active` atau `delayed` milik pengguna, THE Dashboard_Service SHALL mengembalikan array kosong untuk field `activeProjects` dalam `DashboardSummary`.

---

### Requirement 6: Aktivitas Terbaru (Blok E)

**User Story:** Sebagai kontraktor, saya ingin melihat aktivitas terbaru lintas proyek dari data riil, sehingga saya bisa memantau apa yang terjadi tanpa harus membuka setiap proyek satu per satu.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL mengambil maksimal 10 entri terbaru dari tabel `activity_logs` di mana `actorId` adalah `userId` pengguna ATAU (`targetType = 'project'` DAN `targetId` adalah salah satu `projectId` milik pengguna); project ID list SHALL diambil terlebih dahulu sebelum query activity_logs.
2. THE Dashboard_Service SHALL mengurutkan aktivitas berdasarkan `createdAt` secara descending (terbaru di atas).
3. THE Dashboard_Service SHALL memetakan kolom `action` dari `activity_logs` ke label deskripsi dalam Bahasa Indonesia; mapping minimal yang harus didukung: `project_created` → "Proyek baru dibuat", `report_submitted` → "Laporan harian dikirim", `photo_uploaded` → "Foto ditambahkan ke galeri", `member_added` → "Anggota tim ditambahkan", `status_changed` → "Status proyek diperbarui", `material_recorded` → "Material dicatat"; action yang tidak dikenali SHALL ditampilkan sebagai `action` aslinya.
4. WHEN tabel `activity_logs` tidak memiliki entri yang relevan untuk pengguna, THE Dashboard_Service SHALL mengembalikan array aktivitas kosong.
5. THE Dashboard_Service SHALL menyertakan `createdAt` setiap aktivitas dalam format waktu relatif (WIB/UTC+7) dengan breakpoint: < 1 menit → "baru saja", 1–59 menit → "X menit lalu", 1–23 jam → "X jam lalu", 1 hari → "kemarin", 2–6 hari → "X hari lalu", ≥ 7 hari → format tanggal `DD MMM YYYY`.
6. IF query `activity_logs` gagal, THEN THE Dashboard_Service SHALL mengembalikan array aktivitas kosong dan menyertakan flag `activityLoadError: true` dalam `DashboardSummary` agar UI dapat menampilkan indikator error parsial.

---

### Requirement 7: Statistik Sekunder (Baris Bawah Dashboard)

**User Story:** Sebagai kontraktor, saya ingin melihat statistik sekunder (deadline terdekat, foto hari ini, material tercatat, anggota aktif) dari data riil, sehingga gambaran operasional harian saya lengkap.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL menghitung `nearestDeadlineDays` sebagai jumlah hari menuju `targetDate` proyek aktif (`active` atau `delayed`) milik pengguna yang paling dekat deadlinenya (nilai terkecil dari `targetDate - today` dalam UTC+7); IF tidak ada proyek aktif dengan `targetDate`, THEN `nearestDeadlineDays` SHALL bernilai `0`.
2. THE Dashboard_Service SHALL menghitung `photosToday` sebagai jumlah entri di tabel `project_photos` (atau tabel foto yang relevan) yang `createdAt`-nya pada tanggal hari ini (UTC+7) dan terkait dengan proyek milik pengguna; IF tabel foto belum ada, THEN `photosToday` SHALL bernilai `0`.
3. THE Dashboard_Service SHALL menghitung `materialsRecordedTotal` sebagai jumlah total entri di tabel `material_entries` (baik tipe `incoming` maupun `usage`) yang terkait dengan proyek aktif milik pengguna; IF tabel material belum ada, THEN `materialsRecordedTotal` SHALL bernilai `0`.
4. THE Dashboard_Service SHALL menghitung `activeMemberCount` sebagai jumlah entri di tabel `project_members` dengan `isActive = true` yang terkait dengan proyek milik pengguna (lintas semua status proyek); IF tabel belum ada data, THEN `activeMemberCount` SHALL bernilai `0`.
5. IF data untuk statistik sekunder tidak tersedia (tabel belum ada atau query gagal), THEN THE Dashboard_Service SHALL mengembalikan nilai `0` untuk setiap metrik yang bersangkutan tanpa melempar exception.

---

### Requirement 8: Seed Script untuk Akun Demo

**User Story:** Sebagai tim produk, saya ingin akun demo (`arenoe.studio@gmail.com`) memiliki data yang kaya dan representatif di database, sehingga calon pengguna mendapatkan pengalaman showcase yang optimal tanpa ada perbedaan perilaku kode antara akun demo dan akun biasa.

#### Acceptance Criteria

1. THE project SHALL menyediakan Seed_Script (`scripts/seed-demo.ts` atau sejenisnya) yang mengisi database dengan data proyek, laporan harian, aktivitas, anggota tim, dan entri material untuk akun `arenoe.studio@gmail.com`; data yang di-seed SHALL mencakup: minimal 3 proyek (1 `active`, 1 `delayed`, 1 `completed`), minimal 5 kondisi yang memicu Reminder (mencakup tipe `danger`, `warning`, `success`), minimal 8 entri `activity_logs`, dan semua KPI terisi dengan nilai yang bermakna.
2. THE Seed_Script SHALL menggunakan nama pengguna `"Budi Santoso"` dan nama bisnis `"CV Maju Jaya Konstruksi"` sebagai identitas akun demo di tabel `users`.
3. THE Seed_Script SHALL mencerminkan skenario realistis kontraktor Indonesia: nilai kontrak proyek antara IDR 100.000.000–2.000.000.000, progress proyek `active` antara 10–90%, progress proyek `completed` = 100%, dan `reportCount` ≥ 5 per proyek aktif.
4. THE Seed_Script SHALL bersifat idempoten — menjalankannya lebih dari sekali tidak menghasilkan data duplikat; script SHALL memeriksa keberadaan data sebelum insert atau menggunakan upsert.
5. WHEN Seed_Script dijalankan, THE Dashboard_Service SHALL mengembalikan `DashboardSummary` yang kaya untuk akun demo melalui jalur query database yang sama dengan user biasa, tanpa memerlukan perubahan pada kode Dashboard_Service.
6. THE Seed_Script SHALL dapat dijalankan secara mandiri via `npm run seed:demo` dan terdokumentasi di README atau CHANGELOG.

---

### Requirement 9: Integrasi dengan Komponen Dashboard yang Ada

**User Story:** Sebagai developer, saya ingin data riil diintegrasikan ke komponen `DashboardPage` yang sudah ada tanpa mengubah struktur komponen, sehingga risiko regresi visual minimal.

#### Acceptance Criteria

1. THE Dashboard_Service SHALL mengekspos satu fungsi utama `getDashboardData(userId: string): Promise<DashboardSummary>` yang dapat dipanggil dari Server Component `page.tsx`; `DashboardSummary` SHALL mencakup semua data yang saat ini diambil oleh `getDashboardSummary()` dan `getProjects()` dari `mock-data.ts`.
2. WHEN `getDashboardData` dipanggil dari `page.tsx`, THE page.tsx SHALL meneruskan `DashboardSummary` sebagai props ke komponen `DashboardPage`.
3. THE DashboardPage component SHALL menerima `DashboardSummary` sebagai props, bukan mengimpor langsung dari `mock-data.ts`.
4. THE `mock-data.ts` file SHALL tetap ada dan tidak dihapus, karena masih digunakan oleh halaman lain (`/projects`, `/projects/[id]`) yang belum dimigrasi ke data riil.
5. IF skema `DashboardSummary` perlu diubah untuk mengakomodasi data riil, THEN THE perubahan tersebut SHALL bersifat backward-compatible, didefinisikan sebagai: semua field yang ada di versi sebelumnya tetap ada dengan tipe yang sama atau lebih luas (nullable diperbolehkan), dan Seed_Data diperbarui agar tetap valid terhadap tipe baru.
6. IF `getDashboardData` melempar exception, THEN Next.js error boundary SHALL menangkapnya dan menampilkan halaman error yang sesuai, bukan halaman kosong atau crash tanpa pesan.

---

### Requirement 10: Penanganan State Kosong (Empty State)

**User Story:** Sebagai kontraktor baru yang belum memiliki proyek, saya ingin dashboard menampilkan onboarding yang jelas, sehingga saya tahu langkah pertama yang harus dilakukan.

#### Acceptance Criteria

1. WHEN `getDashboardData` mengembalikan `DashboardSummary` dengan `activeProjectCount` sama dengan `0` dan `finishedThisMonth` sama dengan `0`, THE DashboardPage SHALL menggantikan seluruh konten dashboard dengan onboarding card yang berisi tombol "Buat Proyek Pertama".
2. IF kontraktor memiliki paket `free` dan jumlah proyek berstatus `active` atau `delayed` sudah mencapai batas tier (free = 1 proyek), THEN THE Dashboard_Service SHALL menyertakan flag `isProjectLimitReached: true` dalam `DashboardSummary`.
3. IF `isProjectLimitReached` bernilai `true`, THEN THE DashboardPage SHALL menampilkan banner peringatan batas proyek dan menonaktifkan tombol "Buat Proyek Baru" dengan tooltip yang menjelaskan alasan penonaktifan.
4. THE Dashboard_Service SHALL membaca `subscriptionTier` dari tabel `users` dan menerapkan batas proyek aktif berikut: `free` = 1 proyek, `pro` = 3 proyek, `business` = tidak terbatas.
5. IF semua proyek milik pengguna berstatus `completed` atau `archived` (tidak ada yang `active` atau `delayed`), THEN THE DashboardPage SHALL menampilkan empty state pada Blok D dengan tombol "Buat Proyek Baru".
