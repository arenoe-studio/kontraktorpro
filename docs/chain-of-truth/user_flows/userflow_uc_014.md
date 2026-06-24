# User Flow: UC-014 Profil Publik & Portofolio

Document Version: 1.0
Project: KontraktorPro
Status: IMPLEMENTED

---

## 1. DESKRIPSI SINGKAT
Alur bagi kontraktor untuk melengkapi informasi profil publik mereka yang akan ditampilkan pada direktori pencarian kontraktor atau halaman portofolio mandiri.

## 2. AKTOR
- Kontraktor (Pengguna terautentikasi)

## 3. PRE-CONDITIONS
- Pengguna telah login dan memiliki sesi yang valid (`kp-auth-session`).
- Entri awal pada tabel `contractor_profiles` sudah dibuat saat proses registrasi.
- Pengguna menavigasi ke halaman profil (`/settings/profile`).

## 4. POST-CONDITIONS
- Data profil publik pengguna (`contractor_profiles`) berhasil diperbarui di database.

## 5. ALUR UTAMA (MAIN FLOW)

### Skenario 1: Memperbarui Profil Publik
1. Pengguna memilih menu **Pengaturan** > **Profil Publik** dari navigasi.
2. Sistem merender halaman form profil dengan data dari tabel `contractor_profiles` (Slug, Headline, Deskripsi Singkat/About).
3. Pengguna mengubah field yang diinginkan.
4. Pengguna menekan tombol **Simpan Perubahan**.
5. Sistem mengirimkan data via Server Action.
6. Sistem memvalidasi input menggunakan Zod schema (termasuk format slug URL-friendly).
7. Sistem memverifikasi bahwa slug yang dimasukkan unik dan tidak dipakai pengguna lain.
8. Sistem melakukan operasi `UPDATE` pada tabel `contractor_profiles` berdasarkan `user_id`.
9. Sistem merevalidasi path terkait dan mengembalikan respons sukses.
10. UI menampilkan pesan toast "Profil publik berhasil diperbarui".

## 6. ALUR ALTERNATIF (ALTERNATE FLOWS)

**A1: Validasi Slug Gagal (Format)**
1. Pada langkah ke-6, pengguna memasukkan slug dengan karakter khusus ilegal (misal spasi atau simbol).
2. Validasi Zod menolak input.
3. UI menampilkan pesan error di bawah field Slug.

**A2: Slug Sudah Digunakan (Conflict)**
1. Pada langkah ke-7, query database menemukan bahwa slug sudah digunakan oleh `contractor_profiles` milik pengguna lain.
2. Server Action mengembalikan respons `{ success: false, error: "Slug sudah digunakan" }`.
3. UI menampilkan pesan error validasi kepada pengguna.
