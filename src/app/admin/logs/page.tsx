import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminShell } from "../_components/admin-shell";
import { adminLogs, resolveAdminRole } from "../_components/admin-mocks";

const actionTone = {
  "Manajemen Pengguna": "info",
  "Moderasi Konten": "primary",
  Keuangan: "warning",
  "Pengaturan Sistem": "warning",
  Login: "neutral",
} as const;

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);
  const visibleLogs =
    role === "moderator"
      ? adminLogs.filter((item) => item.level === "moderator")
      : adminLogs;

  return (
    <AdminShell title="Log Aktivitas Admin" currentPath="/admin/logs" role={role}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Audit trail admin</CardTitle>
              <p className="mt-2 text-sm text-neutral-500">
                Log ini tidak dapat dihapus atau diubah.
              </p>
            </div>
            <Button variant="outline">Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            <Input defaultValue={role === "moderator" ? "Sinta Moderator" : "Semua Admin"} />
            <Input defaultValue="Semua Tipe Aksi" />
            <Input defaultValue="20 Apr 2026 - 23 Apr 2026" />
            <Button variant="ghost">Reset Filter</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-3 pr-4 font-medium">Timestamp</th>
                  <th className="py-3 pr-4 font-medium">Admin</th>
                  <th className="py-3 pr-4 font-medium">Tipe Aksi</th>
                  <th className="py-3 pr-4 font-medium">Deskripsi</th>
                  <th className="py-3 pr-4 font-medium">Target</th>
                  <th className="py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-100 align-top">
                    <td className="py-4 pr-4 font-mono-ui text-xs text-neutral-700">
                      {log.timestamp}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-2">
                        <p className="font-medium text-neutral-900">{log.admin}</p>
                        <Badge
                          tone={log.level === "super_admin" ? "danger" : "neutral"}
                          size="sm"
                        >
                          {log.level}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge tone={actionTone[log.actionType as keyof typeof actionTone] ?? "danger"}>
                        {log.actionType}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-neutral-700">{log.description}</td>
                    <td className="py-4 pr-4 text-primary-800">{log.target}</td>
                    <td className="py-4 font-mono-ui text-xs text-neutral-700">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <p>
              {role === "moderator"
                ? "Moderator hanya melihat log aksi mereka sendiri."
                : "Super Admin melihat seluruh log moderator dan super admin."}
            </p>
            <div className="flex gap-2">
              <button className="rounded-md border border-neutral-200 px-3 py-2">1</button>
              <button className="rounded-md border border-neutral-200 px-3 py-2">2</button>
              <button className="rounded-md border border-neutral-200 px-3 py-2">Berikutnya</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
