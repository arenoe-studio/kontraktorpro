# Blueprint 1.3 — Profil Publik Kontraktor
**Proyek:** KontraktorPro  
**Grup:** 1 — Halaman Publik  
**Akses:** Tanpa login, dapat ditemukan via direktori atau link langsung  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman profil kontraktor yang dapat ditemukan owner. Menampilkan identitas usaha, spesialisasi, rating, dan portofolio proyek selesai untuk membangun kepercayaan calon klien.

---

## Struktur Halaman

### Section 1 — Navbar
Navbar publik minimal: Logo kiri + Button `primary` "Daftar Gratis" kanan. Tidak ada menu navigasi lengkap.

---

### Section 2 — Header Profil
**Layout:** 2 kolom (info kontraktor kiri, kontak & CTA kanan). Di mobile: 1 kolom.  
**Komponen:** Avatar `64px`, Badge paket (Pro/Bisnis), Badge rating bintang, Button

**Isi kolom kiri:**
- Avatar kontraktor + nama usaha (heading `h1`)
- Nama pemilik (body, abu-abu)
- Badge paket: `badge-primary` "Pro" atau `badge-accent` "Bisnis" — tidak tampil untuk paket Gratis
- Baris info: ikon lokasi + kota | ikon kalender + tahun pengalaman | ikon proyek + jumlah proyek selesai
- Spesialisasi: row Badge `neutral` — contoh "Rumah Tinggal", "Renovasi", "Ruko"

**Isi kolom kanan:**
- Kartu kontak kecil berisi:
  - Rating rata-rata: angka besar `font-mono` + bintang + jumlah ulasan
  - Button `primary`: "Hubungi Kontraktor" — membuka modal dengan nomor WA (jika kontraktor izinkan)
  - Teks mikro: *"Profil terverifikasi oleh KontraktorPro"*

---

### Section 3 — Tentang
**Komponen:** Card

**Isi:**
- Heading `h3`: "Tentang"
- Paragraf deskripsi usaha (diisi kontraktor di pengaturan profil)
- Jika kosong: section ini tidak ditampilkan

---

### Section 4 — Portofolio Proyek
**Layout:** Grid 3 kolom (2 kolom tablet, 1 kolom mobile)  
**Komponen:** Card portofolio, Badge tipe proyek, Badge status "Selesai"

**Setiap card portofolio:**
- Foto cover proyek (thumbnail)
- Nama proyek
- Badge tipe proyek (Renovasi, Rumah Baru, dll.)
- Lokasi + durasi pengerjaan
- Rating dari owner (bintang) — jika ada ulasan

**Filter di atas grid:**
- Filter by tipe proyek (chip/tab)
- Urutan: Terbaru / Rating Tertinggi

**Perilaku klik card:** Buka modal detail portofolio — foto lebih banyak + deskripsi proyek + ulasan owner jika ada.

**Empty state:** Jika belum ada portofolio yang dipublish — section tidak ditampilkan.

---

### Section 5 — Ulasan dari Owner
**Layout:** List vertikal  
**Komponen:** Card, Avatar, Badge rating bintang

**Setiap card ulasan:**
- Avatar inisial owner + nama owner (disamarkan sebagian — privasi)
- Rating bintang
- Teks ulasan
- Nama proyek terkait + tahun
- Label kecil: *"Ulasan terverifikasi"*

**Jika belum ada ulasan:** Teks placeholder *"Belum ada ulasan."* — section tetap tampil.

---

### Section 6 — Footer
Footer minimal: Logo + link Syarat & Ketentuan + Kebijakan Privasi + *"Powered by KontraktorPro"*

---

## State Khusus

**Profil tidak ditemukan:** Tampilkan halaman 404 dengan link ke Direktori Kontraktor (1.5).

**Profil kontraktor paket Gratis:** Badge paket tidak ditampilkan. Prioritas muncul di direktori lebih rendah.

**Kontraktor menonaktifkan profil publik:** Halaman menampilkan pesan *"Profil ini tidak tersedia saat ini."*

---

## Catatan
- Nilai kontrak proyek tidak pernah ditampilkan di halaman ini
- Nomor HP kontraktor hanya tampil jika kontraktor mengizinkan di pengaturan profil
- Owner tidak perlu akun untuk melihat halaman ini atau mengirim ulasan
