# Blueprint 2.1 — Register
**Proyek:** KontraktorPro  
**Grup:** 2 — Autentikasi  
**Akses:** Tanpa login  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Pendaftaran akun kontraktor baru. Proses harus selesai dalam waktu singkat — minimal field, maksimal kejelasan.

---

## Struktur Halaman

### Layout Utama
**Desktop:** 2 kolom — kolom kiri branding/benefit, kolom kanan form  
**Mobile:** 1 kolom — form saja, branding diciutkan ke header kecil di atas form

---

### Kolom Kiri — Branding (Desktop Only)
**Background:** `primary-800`  
**Komponen:** List item dengan ikon centang

**Isi:**
- Logo KontraktorPro (putih)
- Heading `h2` (putih): *"Mulai kelola proyek lebih profesional hari ini."*
- List 4 benefit singkat dengan ikon centang `accent-500`:
  - Gratis selamanya untuk 1 proyek aktif
  - Laporan harian terstruktur dari HP
  - Portofolio otomatis dari setiap proyek selesai
  - Setup dalam 3 menit, tidak perlu pelatihan
- Teks mikro di bawah (putih, opacity 60%): *"Sudah digunakan 500+ kontraktor di Indonesia"*

---

### Kolom Kanan — Form Register
**Komponen:** Input text, Dropdown, Button `primary`, Checkbox

**Header form:**
- Heading `h2`: *"Buat Akun Gratis"*
- Teks: *"Sudah punya akun?"* + Link "Masuk di sini" → halaman Login (2.2)

**Field form (urutan atas ke bawah):**
1. **Nama Lengkap** — input text, placeholder: *"Budi Santoso"*, wajib
2. **Nama Usaha / Perusahaan** — input text, placeholder: *"CV Maju Jaya Konstruksi"*, wajib
3. **Nomor HP** — input number, placeholder: *"08123456789"*, wajib — digunakan untuk login dan OTP
4. **Kota Operasional** — dropdown dengan autocomplete, wajib
5. **Password** — input password dengan toggle show/hide, wajib
6. **Konfirmasi Password** — input password dengan toggle show/hide, wajib

**Di bawah field:**
- Checkbox wajib: *"Saya setuju dengan"* + link "Syarat & Ketentuan" + *"dan"* + link "Kebijakan Privasi"
- Button `primary` full-width: "Buat Akun Gratis"

**Validasi inline (tampil saat field kehilangan fokus):**
- Nomor HP: format harus diawali 08, minimal 10 digit
- Password: minimal 8 karakter
- Konfirmasi password: harus sama dengan password
- Semua field wajib: error jika kosong saat submit

---

## Alur Setelah Submit
1. Sistem kirim OTP 6 digit ke nomor HP
2. Redirect otomatis ke halaman Verifikasi OTP (2.3)
3. Setelah OTP valid → masuk ke Dashboard dengan onboarding card aktif

---

## Catatan
- Tidak ada opsi daftar via Google/email — nomor HP adalah identitas utama
- Tidak ada field email — komunikasi via WhatsApp/SMS
- Halaman ini tidak memerlukan navbar penuh — cukup logo di pojok kiri atas sebagai link ke Landing Page
