# Blueprint 5.4 — 404 Not Found
**Proyek:** KontraktorPro  
**Grup:** 5 — Halaman Utilitas  
**Akses:** Muncul otomatis saat URL tidak ditemukan  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Menangani URL yang tidak valid atau konten yang sudah tidak ada — mencegah pengguna terjebak di jalan buntu dengan menawarkan jalur keluar yang jelas.

---

## Layout
Halaman penuh, konten terpusat secara vertikal dan horizontal.  
Navbar ditampilkan jika pengguna sedang login. Jika tidak login, hanya logo saja.

---

## Konten

**Elemen visual:**
- Angka besar "404" — tipografi display, warna `primary-100` (sangat tipis, sebagai background dekoratif)
- Ikon ilustrasi di atasnya: helm konstruksi dengan tanda tanya — line art style, 80px

**Teks:**
- Heading `h2`: *"Halaman Tidak Ditemukan"*
- Body: *"Halaman yang Anda cari tidak ada atau sudah dipindahkan."*

**Aksi — kondisional berdasarkan status login:**

Jika sudah login:
- Button `primary`: "Kembali ke Dashboard"
- Button `ghost`: "Ke Halaman Sebelumnya"

Jika belum login:
- Button `primary`: "Ke Halaman Utama"
- Button `ghost`: "Cari Kontraktor" → Direktori (1.5)

---

## Catatan
- Tidak ada form pencarian di halaman ini — cukup berikan jalur keluar yang jelas
- Tidak ada pesan teknis atau stack trace yang ditampilkan ke pengguna

---

---

# Blueprint 5.5 — Halaman Offline / Error
**Proyek:** KontraktorPro  
**Grup:** 5 — Halaman Utilitas  
**Akses:** Muncul otomatis saat koneksi terputus atau server error  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Fallback yang informatif saat platform tidak dapat dijangkau — karena koneksi pengguna terputus atau karena server sedang bermasalah. Dua kondisi ini ditangani secara berbeda.

---

## Layout
Halaman penuh, konten terpusat secara vertikal dan horizontal.  
Tanpa navbar — fokus pada pesan dan aksi pemulihan.

---

## Kondisi A — Offline (Koneksi Pengguna Terputus)

**Deteksi:** Browser mendeteksi tidak ada koneksi internet.

**Konten:**
- Ikon ilustrasi: sinyal WiFi dengan tanda silang — line art, 64px, warna `neutral-400`
- Heading `h2`: *"Tidak Ada Koneksi Internet"*
- Body: *"Periksa koneksi Anda dan coba lagi."*
- Button `primary`: "Coba Lagi" — reload halaman saat diklik
- Teks mikro: *"Laporan harian yang sedang Anda isi sudah tersimpan sebagai draft."* — hanya tampil jika pengguna sebelumnya sedang mengisi Form Laporan Harian (3.6)

**Perilaku:** Halaman otomatis reload dan hilang sendiri saat koneksi kembali tanpa perlu klik apapun.

---

## Kondisi B — Server Error (5xx)

**Deteksi:** Server merespons dengan kode 500, 502, 503, atau 504.

**Konten:**
- Ikon ilustrasi: bangunan dengan tanda peringatan — line art, 64px, warna `warning-500`
- Heading `h2`: *"Ada Gangguan Sementara"*
- Body: *"Platform sedang mengalami gangguan. Tim kami sedang menanganinya."*
- Estimasi waktu (jika tersedia dari sistem): *"Estimasi pemulihan: 15 menit"*
- Button `primary`: "Coba Lagi"
- Link teks kecil: "Status platform" → halaman status eksternal (jika tersedia)

**Perilaku:** Button "Coba Lagi" melakukan retry request. Jika berhasil, pengguna kembali ke halaman yang dituju sebelumnya.

---

## Catatan
- Kedua kondisi menggunakan layout yang sama — hanya ikon, teks, dan warna aksen yang berbeda
- Tidak ada kode error teknis yang ditampilkan (tidak ada "Error 503", dll.) — bahasa tetap ramah pengguna
- Halaman ini tidak memiliki navbar atau footer — tidak ada navigasi lain yang perlu
