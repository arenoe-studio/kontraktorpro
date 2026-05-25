# Blueprint 4.8 — Log Aktivitas Admin
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin (Super Admin atau Moderator)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Audit trail lengkap semua aksi yang dilakukan oleh admin — siapa, melakukan apa, kapan, dan terhadap siapa. Log ini tidak bisa dihapus atau diubah oleh siapapun.

---

## Layout
Sidebar Admin + Topbar Admin. Area konten: full width.

---

## Konten Halaman

### Header & Filter
- Judul: "Log Aktivitas Admin"
- Teks kecil: *"Log ini tidak dapat dihapus atau diubah."*

**Filter bar:**
- Dropdown: filter by nama admin
- Dropdown: filter by tipe aksi (Manajemen Pengguna / Moderasi Konten / Keuangan / Pengaturan Sistem / Login)
- Date range picker: rentang tanggal
- Button `ghost` "Reset Filter"

---

### Tabel Log
**Komponen:** Tabel, Badge

**Kolom:**
| Kolom | Keterangan |
|---|---|
| Timestamp | Tanggal + jam lengkap |
| Admin | Nama admin + badge level |
| Tipe Aksi | Badge warna per kategori |
| Deskripsi | Teks aksi lengkap — contoh: *"Suspend akun pengguna: Budi Santoso (alasan: melanggar ketentuan)"* |
| Target | Nama pengguna / konten yang terdampak + link ke halaman terkait |
| IP Address | IP admin saat aksi dilakukan |

**Warna Badge tipe aksi:**
- Manajemen Pengguna → `badge-info`
- Moderasi Konten → `badge-primary`
- Keuangan → `badge-accent`
- Pengaturan Sistem → `badge-warning`
- Login / Logout → `badge-neutral`
- Aksi Destruktif (hapus, suspend) → `badge-danger`

**Pagination:** 50 baris per halaman.

---

### Export
Button `outline-primary` "Export CSV" di atas tabel — mengekspor log sesuai filter aktif.

---

## Catatan
- Moderator hanya bisa melihat log aksi mereka sendiri — tidak bisa melihat log Super Admin
- Super Admin bisa melihat semua log termasuk log Moderator
- Log disimpan permanen — tidak ada fitur hapus atau arsip
