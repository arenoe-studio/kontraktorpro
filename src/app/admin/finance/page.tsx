import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { AdminShell } from "../_components/admin-shell";
import {
  cancelReasons,
  financeSummary,
  financeTransactions,
  formatCurrency,
  resolveAdminRole,
  revenueBars,
} from "../_components/admin-mocks";
import { BadgeDollarSign, CircleOff, CreditCard, Landmark } from "lucide-react";

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);

  return (
    <AdminShell title="Keuangan & MRR" currentPath="/admin/finance" role={role}>
      {role !== "super_admin" ? (
        <Card>
          <CardContent className="p-8">
            <h3>Akses dibatasi</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Halaman keuangan hanya tampil untuk Super Admin. Moderator tidak melihat menu ini di sidebar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-4">
            <StatCard
              label="MRR Saat Ini"
              value={formatCurrency(financeSummary.mrr)}
              icon={BadgeDollarSign}
              helper="+8,2% vs bulan lalu"
              accent="accent"
              trend="up"
            />
            <StatCard
              label="ARR Proyeksi"
              value={formatCurrency(financeSummary.arr)}
              icon={Landmark}
              helper="MRR x 12"
              accent="primary"
              trend="up"
            />
            <StatCard
              label="Pendapatan Bulan Ini"
              value={formatCurrency(financeSummary.revenueThisMonth)}
              icon={CreditCard}
              helper="Transaksi berhasil April 2026"
              accent="success"
              trend="up"
            />
            <StatCard
              label="Transaksi Gagal"
              value={`${financeSummary.failedTransactions}`}
              icon={CircleOff}
              helper="4,1% dari total transaksi"
              accent="warning"
              trend="down"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>MRR 12 bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <Badge tone="primary">Kontribusi Pro</Badge>
                <Badge tone="warning">Kontribusi Business</Badge>
                <span>Target bulan ini Rp100.000.000</span>
              </div>
              <div className="flex h-64 items-end gap-3 rounded-xl border border-neutral-200 p-4">
                {revenueBars.map((value, index) => (
                  <div key={index} className="flex flex-1 items-end gap-1">
                    <div className="w-1/2 rounded-t-md bg-primary-800" style={{ height: `${Math.max(value - 18, 20)}%` }} />
                    <div className="w-1/2 rounded-t-md bg-accent-500" style={{ height: `${Math.max(value - 44, 14)}%` }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Transaksi terbaru</CardTitle>
                <Button variant="outline">Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Input defaultValue="Semua Status" />
                <Input defaultValue="April 2026" />
                <Input defaultValue="Semua Paket" />
                <Input placeholder="Cari pengguna / invoice" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500">
                      <th className="py-3 pr-4 font-medium">Tanggal</th>
                      <th className="py-3 pr-4 font-medium">Nama Pengguna</th>
                      <th className="py-3 pr-4 font-medium">Paket</th>
                      <th className="py-3 pr-4 font-medium">Periode</th>
                      <th className="py-3 pr-4 font-medium">Jumlah</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeTransactions.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-100">
                        <td className="py-4 pr-4">{item.date}</td>
                        <td className="py-4 pr-4">{item.user}</td>
                        <td className="py-4 pr-4 capitalize">{item.tier}</td>
                        <td className="py-4 pr-4">{item.period}</td>
                        <td className="py-4 pr-4">{formatCurrency(item.amount)}</td>
                        <td className="py-4 pr-4">
                          <Badge
                            tone={
                              item.status === "paid"
                                ? "success"
                                : item.status === "failed"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <Link href="/admin/users/user-1001" className="text-primary-800">
                              Lihat Detail
                            </Link>
                            <button className="text-primary-800">Unduh Invoice</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analisis churn</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="flex h-56 items-end gap-3 rounded-xl border border-neutral-200 p-4">
                {revenueBars.map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-md bg-danger-500/80" style={{ height: `${Math.max(value - 62, 12)}%` }} />
                    <span className="text-xs text-neutral-500">{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {cancelReasons.map((item) => (
                  <div key={item.name} className="rounded-xl border border-neutral-200 p-4">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Paket sebelumnya {item.previousTier} • {item.cancelledAt}
                    </p>
                    <p className="mt-2 text-sm text-neutral-700">{item.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AdminShell>
  );
}
