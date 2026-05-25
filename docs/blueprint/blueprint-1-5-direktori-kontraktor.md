# Blueprint 1.5 — Direktori Kontraktor
**Proyek:** KontraktorPro  
**Grup:** 1 — Halaman Publik  
**Akses:** Tanpa login  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman pencarian kontraktor untuk owner yang ingin membangun atau merenovasi. Owner dapat menemukan kontraktor berdasarkan lokasi, spesialisasi, dan rating — lalu langsung menghubungi atau melihat profil lengkapnya.

---

## Struktur Halaman

### Section 1 — Navbar
Sama dengan Landing Page (1.1).

---

### Section 2 — Header & Search
**Komponen:** Search bar besar, Dropdown filter

**Isi:**
- Heading `h2`: *"Temukan Kontraktor Terpercaya di Kotamu"*
- Subheading: *"Semua kontraktor di direktori ini memiliki rekam jejak proyek nyata yang terverifikasi."*
- Search bar besar: placeholder *"Cari nama kontraktor atau nama usaha..."*
- 3 filter sejajar di bawah search bar:
  - Dropdown Kota
  - Dropdown Spesialisasi (Rumah Tinggal, Renovasi, Ruko, Gedung, dll.)
  - Dropdown Urutkan (Rating Tertinggi / Proyek Terbanyak / Terbaru Bergabung)

---

### Section 3 — Hasil Pencarian
**Layout:** Grid 3 kolom (2 kolom tablet, 1 kolom mobile)  
**Komponen:** Card kontraktor, Badge paket, Badge spesialisasi, Badge rating

**Setiap card kontraktor:**
- Avatar + nama usaha (heading `h4`)
- Nama pemilik (body-sm, abu-abu)
- Badge paket: `badge-primary` "Pro" atau `badge-accent` "Bisnis" — tidak tampil untuk Gratis
- Baris info: ikon lokasi + kota | ikon proyek + jumlah proyek selesai
- Rating: bintang + angka rata-rata + jumlah ulasan
- Row badge spesialisasi (maks 3 tampil, sisanya "+N lagi")
- Button `outline-primary` full-width: "Lihat Profil"

**Perilaku:**
- Kontraktor paket Pro dan Bisnis tampil lebih atas dari kontraktor Gratis
- Klik card atau button → mengarah ke Profil Publik Kontraktor (1.3)

**Pagination:** Tampilkan 12 card per halaman, navigasi halaman di bawah grid.

---

### Section 4 — Empty State Pencarian
**Komponen:** Empty state (ikon + heading + teks)

Tampil jika tidak ada hasil yang cocok dengan filter:
- Ikon ilustrasi sederhana
- Heading: *"Kontraktor tidak ditemukan"*
- Teks: *"Coba ubah filter atau kata kunci pencarian."*
- Button `ghost`: "Reset Filter"

---

### Section 5 — CTA Untuk Kontraktor
**Layout:** Banner full width, background `primary-50`  
**Komponen:** Button `primary`

**Isi:**
- Heading `h3`: *"Anda seorang kontraktor?"*
- Teks: *"Daftarkan usaha Anda dan mulai terima klien dari direktori ini secara gratis."*
- Button `primary`: "Daftar Sekarang"

---

### Section 6 — Footer
Sama dengan Landing Page (1.1).

---

## State Khusus

**Hasil pencarian kosong (belum ada kontraktor di kota tertentu):** Tampilkan empty state dengan saran kota terdekat jika memungkinkan.

**Halaman pertama kali dibuka (tanpa filter):** Tampilkan semua kontraktor, diurutkan berdasarkan rating tertinggi.

---

## Catatan
- Direktori ini bukan marketplace — tidak ada fitur bidding atau transaksi
- Kontraktor hanya bisa muncul di direktori jika profil publiknya aktif
- Kontraktor paket Gratis tetap bisa muncul, tapi tanpa badge dan prioritas lebih rendah
- Jumlah kontraktor yang tampil per halaman: 12
