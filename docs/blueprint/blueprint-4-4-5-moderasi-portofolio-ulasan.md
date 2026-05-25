# Blueprint 4.4 — Moderasi Portofolio
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin (Super Admin atau Moderator)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Review dan keputusan approve/tolak portofolio yang dikirim kontraktor sebelum tampil publik di direktori dan profil.

---

## Layout
Sidebar Admin + Topbar Admin. Area konten: full width.

---

## Konten Halaman

### Header & Filter
- Judul: "Moderasi Portofolio"
- Tab filter: **Menunggu Review / Approved / Ditolak / Semua**
- Badge angka di tab "Menunggu Review" jika ada antrian
- Dropdown sort: Terlama Menunggu (default) / Terbaru

---

### Grid Portofolio
**Komponen:** Card portofolio per item, Grid 3 kolom

**Setiap card:**
- Foto cover (thumbnail besar)
- Nama kontraktor + kota
- Nama proyek + tipe proyek + durasi pengerjaan
- Waktu submit: *"Dikirim 2 jam lalu"*
- Badge status moderasi saat ini
- Button `outline-primary` "Preview Publik" — buka modal preview tampilan halaman publik yang akan muncul jika di-approve
- Button `success` "Approve" + Button `outline-danger` "Tolak"

**Jika klik "Tolak":** Modal muncul dengan:
- Textarea: alasan penolakan (wajib diisi, dikirim ke kontraktor)
- Pilihan alasan cepat: Foto tidak jelas / Konten tidak sesuai / Informasi tidak lengkap / Lainnya
- Button `danger` "Konfirmasi Tolak" + Button `ghost` "Batal"

---

### Empty State
Jika tab "Menunggu Review" kosong:
- Teks: *"Tidak ada portofolio yang menunggu review."*
- Ikon centang besar hijau

---

## Catatan
- Setelah approve: kontraktor mendapat notifikasi + portofolio langsung tampil publik
- Setelah tolak: kontraktor mendapat notifikasi + alasan penolakan + bisa submit ulang setelah perbaikan
- Admin tidak bisa edit konten portofolio — hanya approve atau tolak

---

---

# Blueprint 4.5 — Moderasi Ulasan
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin (Super Admin atau Moderator)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Review dan keputusan publish/hapus ulasan dari owner sebelum tampil di profil publik kontraktor.

---

## Layout
Sidebar Admin + Topbar Admin. Area konten: full width, list vertikal.

---

## Konten Halaman

### Header & Filter
- Judul: "Moderasi Ulasan"
- Tab filter: **Menunggu Review / Dipublish / Dihapus / Semua**
- Badge angka di tab "Menunggu Review"

---

### List Ulasan
**Komponen:** Card per ulasan, list vertikal

**Setiap card:**
- Rating bintang yang diberikan (1–5)
- Teks ulasan lengkap
- Nama kontraktor yang diulas + link ke profil publik (1.3)
- Nama owner pemberi ulasan (disamarkan sebagian) + nama proyek terkait + tahun — sebagai bukti verifikasi
- Waktu ulasan dikirim
- Flag otomatis `badge-danger` "Terdeteksi Kata Tidak Pantas" — jika sistem mendeteksi konten bermasalah
- Tombol aksi: Button `success` "Publish" / Button `outline-primary` "Edit" / Button `outline-danger` "Hapus"

**Jika klik "Edit":** Inline edit teks ulasan langsung di card — untuk perbaikan minor (typo, sensor kata tidak pantas) tanpa mengubah substansi ulasan. Button `primary` "Simpan" + Button `ghost` "Batal".

**Jika klik "Hapus":** Konfirmasi sederhana — *"Hapus ulasan ini? Tindakan ini tidak bisa dibatalkan."*

---

### Empty State
Jika tab "Menunggu Review" kosong:
- Teks: *"Tidak ada ulasan yang menunggu review."*

---

## Catatan
- Ulasan hanya bisa dipublish jika terhubung dengan proyek nyata di sistem (terverifikasi)
- Admin tidak boleh mengubah rating bintang — hanya teks jika ada kata tidak pantas
- Setelah publish: langsung tampil di profil publik kontraktor
