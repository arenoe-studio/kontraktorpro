import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AdminShell } from "./admin-shell";
import {
  financeTransactions,
  resolveAdminRole,
  userRows,
} from "./admin-mocks";

export async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const route = await params;
  const query = await searchParams;
  const role = resolveAdminRole(query.role);
  const user = userRows.find((item) => item.id === route.id);

  if (!user) {
    notFound();
  }

  const payments = financeTransactions.filter((item) =>
    item.user.toLowerCase().includes(user.name.split(" ")[0].toLowerCase()),
  );

  return (
    <AdminShell title="Detail Pengguna" currentPath="/admin/users" role={role}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-wrap items-start gap-4 p-6">
              <Avatar name={user.name} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2>{user.name}</h2>
                  <Badge
                    tone={
                      user.tier === "business"
                        ? "warning"
                        : user.tier === "pro"
                          ? "primary"
                          : "neutral"
                    }
                  >
                    {user.tier}
                  </Badge>
                  <Badge
                    tone={
                      user.status === "Aktif"
                        ? "success"
                        : user.status === "Suspend"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
                <p className="mt-2 text-base text-neutral-600">{user.businessName}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="text-sm text-neutral-500">HP: {user.phone}</p>
                  <p className="text-sm text-neutral-500">Kota: {user.city}</p>
                  <p className="text-sm text-neutral-500">Daftar: {user.registeredAt}</p>
                  <p className="text-sm text-neutral-500">Aktif terakhir: {user.lastActive}</p>
                </div>
                <Link href="/profil/cv-maju-jaya-konstruksi" className="mt-4 inline-flex text-sm font-medium text-primary-800">
                  Lihat profil publik
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total proyek", value: "14" },
              { label: "Laporan dikirim", value: "128" },
              { label: "Foto diupload", value: "486" },
              { label: "Portofolio publish", value: "5" },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <p className="text-label text-neutral-500">{item.label}</p>
                  <p className="mt-2 font-mono-ui text-3xl font-bold text-neutral-900">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Proyek terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Renovasi Ruko Setiabudi • Aktif • 78%",
                "Gudang Distribusi Cikarang • Selesai • 100%",
                "Pembangunan Rumah Aruna • Delayed • 41%",
              ].map((project) => (
                <div key={project} className="rounded-xl border border-neutral-200 p-4 text-sm text-neutral-700">
                  {project}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log aktivitas pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Login dari Bandung • 23 Apr 2026 08:10",
                "Buat proyek baru Renovasi Kafe Braga • 22 Apr 2026 14:22",
                "Upgrade paket ke Pro • 20 Apr 2026 11:45",
                "Submit portofolio publik • 18 Apr 2026 16:05",
              ].map((log) => (
                <div key={log} className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-accent-500" />
                  <p className="text-sm text-neutral-700">{log}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paket & billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-neutral-200 p-4">
                <p className="font-medium text-neutral-900">Paket aktif: {user.tier}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Renewal berikutnya 23 Mei 2026
                </p>
              </div>
              <div className="space-y-3">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <div key={payment.id} className="rounded-xl border border-neutral-200 p-4">
                      <p className="font-mono-ui text-xs text-neutral-500">{payment.id}</p>
                      <p className="mt-1 text-sm text-neutral-700">
                        {payment.date} • {payment.period} • Rp{payment.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">Belum ada pembayaran tercatat.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aksi admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-center">
                Kirim Notifikasi
              </Button>
              {role === "super_admin" ? (
                <Button variant="outline" className="w-full justify-center">
                  Login sebagai Pengguna Ini
                </Button>
              ) : null}
              <Button variant="outline-danger" className="w-full justify-center">
                Suspend Akun
              </Button>
              <Button className="w-full justify-center">Aktifkan Akun</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catatan internal admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Tambahkan catatan internal..." />
              <Button className="w-full">Simpan Catatan</Button>
              <div className="space-y-3">
                {user.notes.length > 0 ? (
                  user.notes.map((note) => (
                    <div key={`${note.author}-${note.timestamp}`} className="rounded-xl border border-neutral-200 p-4">
                      <p className="text-sm font-medium text-neutral-900">
                        {note.author}
                      </p>
                      <p className="text-xs text-neutral-500">{note.timestamp}</p>
                      <p className="mt-2 text-sm text-neutral-700">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">Belum ada catatan internal.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
