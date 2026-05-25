# Blueprint 1.2 — Halaman Pricing
**Proyek:** KontraktorPro  
**Grup:** 1 — Halaman Publik  
**Akses:** Tanpa login  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman keputusan pembelian. Pengunjung mengevaluasi paket dan memutuskan untuk upgrade atau mulai gratis.

---

## Struktur Halaman

### Section 1 — Navbar
Sama dengan Landing Page (1.1). Komponen Navbar yang identik.

---

### Section 2 — Header
**Komponen:** Toggle switch bulanan/tahunan, Badge `accent`

**Isi:**
- Heading `h1`: *"Harga yang Tumbuh Bersama Bisnis Anda"*
- Subheading: *"Mulai gratis tanpa kartu kredit. Upgrade kapan saja, cancel kapan saja."*
- Toggle: **Bulanan / Tahunan** — saat tahunan aktif, tampilkan Badge `accent` "Hemat 20%" di kartu Pro dan Bisnis

---

### Section 3 — Tiga Kartu Paket
**Layout:** Grid 3 kolom. Di mobile: 1 kolom, kartu Pro tampil paling atas.  
**Komponen:** Card Pricing (lihat design system)

**Kartu Gratis:**
- Harga: Rp 0 / selamanya
- 5 fitur highlight dengan ikon centang
- Button `outline-primary`: "Mulai Gratis"

**Kartu Pro (highlight):**
- Badge `accent` di atas: "Paling Populer"
- Harga: Rp 129.000/bulan (Rp 103.200 jika tahunan)
- 7 fitur highlight dengan ikon centang
- Button `primary`: "Coba Pro"
- Teks mikro: *"Coba 14 hari gratis, batalkan kapan saja"*
- Card mendapat border `accent-500`, shadow lebih tebal

**Kartu Bisnis:**
- Harga: Rp 249.000/bulan
- 6 fitur highlight dengan ikon centang
- Button `outline-primary`: "Mulai Bisnis"

---

### Section 4 — Tabel Fitur Lengkap
**Komponen:** Tabel dengan header sticky saat scroll

**Struktur tabel:**
- Kolom: Fitur / Gratis / Pro / Bisnis
- Sel berisi: ikon centang hijau / ikon silang abu / teks spesifik (angka/label)
- Baris dikelompokkan dengan sub-heading: Manajemen Proyek, Laporan & Dokumentasi, Tim, Portofolio & Direktori, Data & Analitik, Dukungan

**Perilaku:** Header kolom paket sticky saat tabel di-scroll vertikal di mobile.

---

### Section 5 — FAQ
**Komponen:** Accordion (expand/collapse per item)

**6 pertanyaan:**
1. Apakah benar-benar gratis selamanya?
2. Bagaimana cara membayar?
3. Bisa cancel kapan saja?
4. Apa yang terjadi jika downgrade ke Gratis?
5. Apakah ada diskon untuk asosiasi kontraktor?
6. Apakah data aman jika berhenti berlangganan?

---

### Section 6 — CTA Final
**Komponen:** Button `primary xl`

**Isi:**
- Heading `h2`: *"Mulai gratis hari ini."*
- Button `primary xl`: "Daftar Gratis Sekarang"
- Teks mikro: *"Tidak perlu kartu kredit."*

---

### Section 7 — Footer
Sama dengan Landing Page (1.1).

---

## Halaman Checkout (Sub-halaman)
**Akses:** Dari kartu paket → klik CTA  
**Layout:** Single column, max-width 500px, tengah halaman  
**Komponen:** Card, Radio button metode pembayaran, Button `primary`

**Isi:**
- Ringkasan paket yang dipilih: nama + harga + periode
- Pilihan metode pembayaran: Transfer Bank / QRIS / Kartu Kredit / GoPay / OVO — tampil sebagai radio button dengan logo
- Field nomor HP untuk invoice
- Ringkasan total: subtotal + pajak + total
- Button `primary` full-width: "Bayar Sekarang"
- Teks mikro: *"Pembayaran diproses dengan aman."*

---

## Halaman Konfirmasi Pembayaran (Sub-halaman)
**Akses:** Setelah pembayaran berhasil  
**Layout:** Single column, centered, max-width 480px  
**Komponen:** Empty state layout (ikon besar + heading + teks + button)

**Isi:**
- Ikon centang besar `success-500`
- Heading `h2`: *"Pembayaran Berhasil!"*
- Detail: nama paket + periode aktif
- Informasi: konfirmasi dikirim via WhatsApp/email
- Button `primary`: "Masuk ke Dashboard"

---

## Catatan
- Toggle tahunan/bulanan hanya mengubah tampilan harga — tidak ada halaman terpisah
- Checkout tidak memerlukan login jika pengguna belum punya akun — akun dibuat otomatis setelah bayar
