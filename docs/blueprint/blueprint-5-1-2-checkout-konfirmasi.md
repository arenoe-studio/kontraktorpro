# Blueprint 5.1 — Checkout & Pembayaran
**Proyek:** KontraktorPro  
**Grup:** 5 — Halaman Utilitas  
**Akses:** Login sebagai Kontraktor (atau tanpa login jika dari Landing Page)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Proses upgrade paket — dari pilihan metode pembayaran hingga konfirmasi. Harus terasa aman, sederhana, dan tidak ada kebingungan di tengah jalan.

---

## Catatan Arsitektur
Halaman ini sudah didefinisikan sebagai sub-halaman di Blueprint 1.2 (Pricing). Blueprint ini mendokumentasikannya secara lebih lengkap sebagai halaman mandiri karena checkout bisa diakses dari dua titik: dari Pricing (1.2) dan dari Langganan & Billing dalam dashboard (3.13).

---

## Layout
Halaman penuh dengan navbar minimal (logo saja). Konten: 2 kolom desktop (ringkasan order kanan, form pembayaran kiri). Single column di mobile.

---

## Kolom Kiri — Form Pembayaran

### Bagian 1 — Informasi Kontak
**Komponen:** Input text

- Nomor HP — pre-filled jika sudah login, wajib
- Label kecil: *"Invoice dan konfirmasi akan dikirim ke nomor ini"*

---

### Bagian 2 — Metode Pembayaran
**Komponen:** Radio card per metode

5 metode sebagai radio card dengan logo masing-masing:
- Transfer Bank (BCA, Mandiri, BNI, BRI)
- QRIS
- Kartu Kredit / Debit
- GoPay
- OVO

Setiap card: logo + nama metode + estimasi konfirmasi (contoh: *"Konfirmasi otomatis"* untuk QRIS/e-wallet, *"1x24 jam"* untuk transfer bank)

**Konten dinamis setelah pilih metode:**

Jika Transfer Bank → tampilkan pilihan bank (radio button) + instruksi ringkas bahwa nomor rekening akan ditampilkan setelah submit

Jika QRIS → tampilkan info bahwa QR code muncul setelah submit

Jika Kartu Kredit → tampilkan field: Nomor Kartu / Nama di Kartu / Tanggal Kadaluarsa / CVV + ikon keamanan SSL

Jika GoPay / OVO → tampilkan field nomor HP yang terdaftar di e-wallet

---

### Tombol Aksi
- Button `primary` full-width: "Lanjutkan Pembayaran"
- Teks mikro di bawah: *"Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami."*

---

## Kolom Kanan — Ringkasan Order
**Komponen:** Card sticky (mengikuti scroll di desktop)

**Isi:**
- Heading: *"Ringkasan Pesanan"*
- Nama paket yang dipilih + Badge paket
- Periode: Bulanan / Tahunan
- Harga dasar
- Diskon (jika ada kode promo dipakai) — baris hijau dengan nilai diskon
- Field kode promo: input text kecil + Button `ghost` "Pakai"
- Garis pemisah
- Total: angka besar + label *"termasuk PPN jika berlaku"*
- Teks: *"Perpanjangan otomatis setiap [periode]. Batalkan kapan saja."*

---

## State Khusus

**Kode promo tidak valid:** Teks error merah di bawah field promo: *"Kode promo tidak ditemukan atau sudah kadaluarsa."*

**Pembayaran gagal (kartu ditolak, dll.):** Toast `danger` + pesan spesifik sesuai jenis kegagalan. Form tetap terbuka — pengguna bisa coba metode lain tanpa mengulang dari awal.

**Session timeout saat mengisi:** Banner `warning`: *"Sesi Anda hampir habis. Simpan progres?"* — Button "Lanjutkan Sesi".

---

## Catatan
- Nomor kartu kredit tidak disimpan di server KontraktorPro — diproses langsung oleh payment gateway
- Halaman ini menggunakan HTTPS — tampilkan ikon kunci SSL di dekat tombol bayar
- Jika pengguna belum login dan checkout dari Landing Page: akun dibuat otomatis setelah pembayaran berhasil menggunakan nomor HP yang diisi

---

---

# Blueprint 5.2 — Konfirmasi Pembayaran
**Proyek:** KontraktorPro  
**Grup:** 5 — Halaman Utilitas  
**Akses:** Redirect otomatis setelah pembayaran berhasil  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman sukses setelah pembayaran dikonfirmasi. Memberikan ketenangan kepada pengguna bahwa transaksi berhasil dan paket sudah aktif.

---

## Layout
Halaman penuh, konten terpusat secara vertikal dan horizontal, max-width 480px.

---

## Konten

**Atas:**
- Ikon centang besar animasi (muncul dengan efek pop) — warna `success-500`
- Heading `h1`: *"Pembayaran Berhasil!"*

**Ringkasan transaksi:**
- Card berisi: nama paket + periode aktif + tanggal mulai + tanggal perpanjangan berikutnya
- Teks: *"Konfirmasi telah dikirim ke [nomor HP disamarkan]"*

**Aksi:**
- Button `primary` full-width: "Masuk ke Dashboard" → Dashboard Utama (3.1)
- Link teks kecil di bawah: "Unduh Invoice" → generate dan download PDF invoice

---

## State Khusus

**Pembayaran pending (Transfer Bank):**
- Ikon jam besar `warning-500` — bukan centang
- Heading `h1`: *"Menunggu Konfirmasi Pembayaran"*
- Teks: *"Selesaikan transfer dalam 24 jam. Paket akan aktif otomatis setelah pembayaran dikonfirmasi."*
- Card berisi instruksi transfer: nama bank + nomor rekening + nama penerima + nominal yang harus ditransfer (termasuk kode unik 3 digit terakhir untuk identifikasi)
- Button `outline-primary` "Salin Nomor Rekening"
- Button `ghost` "Kembali ke Dashboard" — paket belum aktif tapi pengguna bisa tetap pakai platform dengan paket lama

---

## Catatan
- Halaman ini tidak bisa diakses ulang via URL setelah sesi berakhir — hanya muncul sekali setelah redirect dari payment gateway
- Jika pengguna refresh halaman, redirect ke Dashboard
