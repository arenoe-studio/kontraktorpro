# User Flow: UC-013 Pengaturan Akun

Document Version: 1.0
Project: KontraktorPro
Status: IMPLEMENTED

---

## 1. DESKRIPSI SINGKAT
Alur bagi pengguna (khususnya kontraktor) untuk mengubah informasi dasar akun mereka (nama, nama bisnis, kontak) serta melakukan penggantian kata sandi untuk keamanan.

## 2. AKTOR
- Kontraktor (Pengguna terautentikasi)

## 3. PRE-CONDITIONS
- Pengguna telah login dan memiliki sesi yang valid (`kp-auth-session`).
- Pengguna menavigasi ke halaman pengaturan akun (`/settings/account`).

## 4. POST-CONDITIONS
- Data akun pengguna (`users`) berhasil diperbarui di database.
- Jika mengganti kata sandi, kata sandi baru di-hash dan disimpan.

## 5. ALUR UTAMA (MAIN FLOW)

### Skenario 1: Memperbarui Profil Akun Dasar
1. Pengguna memilih menu **Pengaturan** > **Akun** dari navigasi.
2. Sistem merender halaman form akun dengan data yang sudah terisi berdasarkan sesi pengguna saat ini (Nama Lengkap, Nama Bisnis, Email, Telepon, Kota).
3. Pengguna mengubah nilai pada field yang diizinkan (kecuali Email, yang biasanya bersifat read-only atau memerlukan flow terpisah jika diizinkan).
4. Pengguna menekan tombol **Simpan Perubahan**.
5. Sistem mengirimkan data via Server Action.
6. Sistem memvalidasi data menggunakan Zod schema.
7. Sistem melakukan operasi `UPDATE` pada tabel `users`.
8. Sistem merevalidasi path `/settings/account` dan mengembalikan respons sukses.
9. UI menampilkan pesan toast "Berhasil diperbarui".

### Skenario 2: Mengganti Kata Sandi
1. Pada halaman yang sama, pengguna menggulir ke bagian **Ganti Kata Sandi**.
2. Pengguna mengisi:
   - Kata Sandi Saat Ini
   - Kata Sandi Baru
   - Konfirmasi Kata Sandi Baru
3. Pengguna menekan tombol **Update Kata Sandi**.
4. Sistem mengirimkan data via Server Action.
5. Sistem memvalidasi format input.
6. Sistem memverifikasi hash dari kata sandi saat ini dengan data di database.
7. Sistem menghash kata sandi baru (bcryptjs cost 12) dan menyimpannya.
8. UI menampilkan pesan toast "Kata sandi berhasil diperbarui".

## 6. ALUR ALTERNATIF (ALTERNATE FLOWS)

**A1: Validasi Gagal (Client/Server)**
1. Pada Skenario 1/2 langkah ke-4, data tidak sesuai dengan skema (misal: kata sandi baru kurang dari 8 karakter, atau konfirmasi tidak cocok).
2. Sistem menolak pengiriman atau mengembalikan error dari Server Action.
3. UI menampilkan pesan error di bawah field yang bermasalah.

**A2: Kata Sandi Saat Ini Salah**
1. Pada Skenario 2 langkah ke-6, verifikasi kata sandi saat ini gagal.
2. Sistem mengembalikan status error.
3. UI menampilkan pesan toast atau peringatan inline "Kata sandi saat ini tidak valid".
