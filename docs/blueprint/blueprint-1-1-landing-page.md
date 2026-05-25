# Blueprint 1.1 — Landing Page
**Proyek:** KontraktorPro  
**Grup:** 1 — Halaman Publik  
**Akses:** Tanpa login  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Titik kontak pertama calon pengguna. Mendorong satu aksi utama: **Daftar Gratis**.

---

## Struktur Halaman

### Section 1 — Navbar
**Komponen:** Navbar (fixed)  
**Isi:**
- Kiri: Logo
- Tengah: Link navigasi — Fitur, Harga, Tentang
- Kanan: Button `outline-primary` "Masuk" + Button `primary` "Daftar Gratis"

**Perilaku:** Navbar mendapat `shadow-navbar` saat halaman di-scroll ke bawah. Di mobile, link tengah disembunyikan dan diganti hamburger menu — Button "Daftar Gratis" tetap tampil.

---

### Section 2 — Hero
**Layout:** 2 kolom (60% teks / 40% visual). Di mobile: 1 kolom, visual di bawah teks.  
**Komponen:** Button `primary` ukuran `xl`, Button `ghost`

**Isi kolom kiri:**
- Label kecil: *"Platform Manajemen Proyek untuk Kontraktor Indonesia"*
- Heading `h1`: *"Kelola Proyek Lebih Rapi. Bangun Reputasi Otomatis."*
- Subheading `body-lg`: deskripsi singkat produk (1–2 kalimat)
- Button `primary xl`: "Coba Gratis Sekarang"
- Button `ghost` di bawahnya: "Lihat cara kerjanya ↓"
- Teks mikro: *"Gratis selamanya untuk 1 proyek aktif. Tidak perlu kartu kredit."*

**Isi kolom kanan:**
- Mockup dashboard kontraktor (gambar/ilustrasi)
- 2 floating badge kecil mengambang di atas mockup: contoh *"Laporan PDF Terkirim ✓"* dan *"Progres 78%"* — gunakan Card kecil dengan shadow

**Background:** Subtle gradient atau texture sangat tipis dari pojok kiri atas.

---

### Section 3 — Pain Point
**Layout:** Heading tengah + Grid 3 kolom (2 kolom di mobile)  
**Komponen:** Card (tanpa border, background `neutral-50`), Icon 32px

**Isi:**
- Heading `h2` tengah: *"Kalau ini terasa familiar, kamu tidak sendirian."*
- 6 card pain point, masing-masing berisi: ikon + judul singkat + 1 kalimat deskripsi
- Teks penutup di bawah grid: 1 kalimat transisi ke section solusi

**6 item pain point:** koordinasi via WhatsApp, laporan manual di buku, foto tersebar di galeri, tidak ada bukti sengketa, kewalahan kelola banyak proyek, portofolio hanya foto acak.

---

### Section 4 — Fitur Unggulan
**Layout:** Alternating kiri-kanan per fitur (teks + visual bergantian sisi). Di mobile: 1 kolom, visual di bawah teks.  
**Komponen:** Badge `info` sebagai label fitur, ilustrasi/mockup per fitur

**Isi:**
- Heading `h2`: *"Satu platform untuk semua kebutuhan proyek Anda"*
- 4 blok fitur: Laporan Harian Terstruktur, Laporan PDF ke Owner, Link Pantau Real-Time, Portofolio Publik Terverifikasi
- Setiap blok: label badge + heading `h3` + deskripsi 2–3 kalimat + mockup visual
- Button `outline-primary` di akhir section: "Lihat Semua Fitur"

---

### Section 5 — Perbandingan
**Layout:** Full width, background `primary-800`  
**Komponen:** Tabel 3 kolom

**Isi:**
- Heading `h2` (teks putih): *"Apa bedanya sama WhatsApp dan Excel?"*
- Tabel: kolom WhatsApp+Excel / KontraktorPro — 5 baris aspek perbandingan
- Kolom KontraktorPro diberi highlight border/background `accent-500`
- Teks kecil di bawah tabel (teks putih): *"Tidak harus tinggalkan WhatsApp."*

---

### Section 6 — Testimoni
**Layout:** Grid 3 kartu (carousel di mobile)  
**Komponen:** Card, Avatar, Badge rating bintang

**Isi:**
- 3 card testimoni: avatar ilustrasi + nama + kota + kutipan 2–3 kalimat + rating bintang
- Statistik kecil di bawah kartu: *"Dipercaya 500+ kontraktor di 12 kota"*

---

### Section 7 — Pricing Preview
**Layout:** Grid 3 kartu  
**Komponen:** Card Pricing (lihat design system), Button sesuai level kartu

**Isi:**
- Heading `h2`: *"Mulai gratis. Upgrade kalau sudah yakin."*
- 3 kartu paket: Gratis / Pro (highlight `accent`) / Bisnis
- Setiap kartu: nama paket + harga + 4–5 fitur highlight + CTA button
- Link teks di bawah: *"Bandingkan semua fitur →"* mengarah ke halaman Pricing (1.2)

---

### Section 8 — CTA Final
**Layout:** Full width, background `primary-800` atau `accent-500`  
**Komponen:** Button `primary xl`

**Isi:**
- Heading `h1`: *"Mulai kelola proyek pertama Anda hari ini."*
- Subheading: *"Setup 3 menit. Tidak perlu pelatihan. Gratis untuk memulai."*
- Button `primary xl`: "Daftar Gratis Sekarang"
- Link teks di bawah button: *"Sudah punya akun? Masuk di sini."*

---

### Section 9 — Footer
**Layout:** 4 kolom. Di mobile: 2 kolom, kemudian 1 kolom.  
**Komponen:** —

**Isi kolom:**
1. Brand: logo + tagline + ikon sosial media
2. Produk: Fitur, Harga, Roadmap, Changelog
3. Perusahaan: Tentang, Blog, Karir, Kontak
4. Dukungan: Pusat Bantuan, Tutorial, Syarat & Ketentuan, Kebijakan Privasi

**Bawah footer:** Copyright + *"Dibuat dengan ❤️ untuk kontraktor Indonesia"*

---

## Hierarki CTA
| Level | Teks | Posisi |
|---|---|---|
| Primary | Daftar Gratis Sekarang | Navbar, Hero, CTA Final |
| Secondary | Lihat Semua Fitur | Akhir section fitur |
| Tertiary | Masuk | Navbar |
| Informational | Bandingkan semua fitur | Bawah pricing preview |

---

## Catatan
- Tidak ada form di halaman ini — form hanya di halaman Register (2.1)
- Tidak ada chatbot popup
- Tidak ada countdown timer atau FOMO buatan
- Tidak ada jargon teknologi ("SaaS", "cloud", "scalable")
