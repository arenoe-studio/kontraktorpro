import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminShell } from "./admin-shell";
import { resolveAdminRole, userRows } from "./admin-mocks";

export async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);

  return (
    <AdminShell title="Semua Pengguna" currentPath="/admin/users" role={role}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Manajemen pengguna</CardTitle>
            <Button variant="outline">Export Data CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <Input placeholder="Cari nama, nomor HP, nama usaha..." />
            <Input defaultValue="Semua Paket" />
            <Input defaultValue="Semua Kota" />
            <Input defaultValue="Semua Status" />
            <Input defaultValue="01 Apr 2026 - 23 Apr 2026" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-3 pr-4 font-medium">Avatar + Nama</th>
                  <th className="py-3 pr-4 font-medium">Nama Usaha</th>
                  <th className="py-3 pr-4 font-medium">Kota</th>
                  <th className="py-3 pr-4 font-medium">Paket</th>
                  <th className="py-3 pr-4 font-medium">Proyek Aktif</th>
                  <th className="py-3 pr-4 font-medium">Tanggal Daftar</th>
                  <th className="py-3 pr-4 font-medium">Terakhir Aktif</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userRows.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="md" />
                        <div>
                          <p className="font-medium text-neutral-900">{user.name}</p>
                          <p className="font-mono-ui text-xs text-neutral-500">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{user.businessName}</td>
                    <td className="py-4 pr-4">{user.city}</td>
                    <td className="py-4 pr-4">
                      <Badge
                        tone={
                          user.tier === "business"
                            ? "warning"
                            : user.tier === "pro"
                              ? "primary"
                              : "neutral"
                        }
                        size="sm"
                      >
                        {user.tier}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4">{user.activeProjects}</td>
                    <td className="py-4 pr-4">{user.registeredAt}</td>
                    <td className="py-4 pr-4">{user.lastActive}</td>
                    <td className="py-4 pr-4">
                      <Badge
                        tone={
                          user.status === "Aktif"
                            ? "success"
                            : user.status === "Suspend"
                              ? "danger"
                              : "warning"
                        }
                        dot
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/users/${user.id}${role === "moderator" ? "?role=moderator" : ""}`}
                          className="text-sm font-medium text-primary-800"
                        >
                          Lihat
                        </Link>
                        <button className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                          ...
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <p>Menampilkan 4 dari 20 pengguna pada halaman ini.</p>
            <div className="flex gap-2">
              <button className="rounded-md border border-neutral-200 px-3 py-2">Sebelumnya</button>
              <button className="rounded-md bg-primary-800 px-3 py-2 text-white">1</button>
              <button className="rounded-md border border-neutral-200 px-3 py-2">2</button>
              <button className="rounded-md border border-neutral-200 px-3 py-2">Berikutnya</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
