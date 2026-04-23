import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
        404
      </span>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">
          Halaman yang Anda cari tidak ditemukan.
        </h1>
        <p className="max-w-xl text-sm text-slate-600">
          Link mungkin sudah berubah atau belum tersedia pada fase implementasi
          saat ini.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
