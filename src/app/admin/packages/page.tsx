import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminShell } from "../_components/admin-shell";
import {
  formatCurrency,
  packageRows,
  promoRows,
  resolveAdminRole,
} from "../_components/admin-mocks";

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);

  return (
    <AdminShell title="Paket & Harga" currentPath="/admin/packages" role={role}>
      {role !== "super_admin" ? (
        <Card>
          <CardContent className="p-8">
            <h3>Akses dibatasi</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Hanya Super Admin yang dapat mengelola harga, promo, dan konfigurasi paket.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kartu paket aktif</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-3">
              {packageRows.map((item) => (
                <div key={item.tier} className="rounded-xl border border-neutral-200 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-xl font-semibold capitalize">{item.tier}</p>
                      <p className="mt-2 font-mono-ui text-2xl font-bold text-neutral-900">
                        {item.monthlyPrice === 0 ? "Gratis" : formatCurrency(item.monthlyPrice)}
                      </p>
                    </div>
                    <Badge tone={item.tier === "business" ? "warning" : item.tier === "pro" ? "primary" : "neutral"}>
                      {item.customers} pelanggan
                    </Badge>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    {item.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-5 w-full">
                    Edit Paket
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview modal edit paket</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input defaultValue="149000" />
              <Input defaultValue="1490000" />
              <Input defaultValue="5" />
              <Input defaultValue="8" />
              <Textarea
                className="md:col-span-2"
                defaultValue={"Laporan PDF\nLink pantau owner\nReminder deadline"}
              />
              <div className="md:col-span-2 rounded-xl border border-warning-100 bg-warning-100/50 p-4">
                <div className="flex items-start gap-2 text-warning-700">
                  <AlertTriangle className="mt-0.5 size-4" />
                  <p className="text-sm font-medium">
                    Perubahan harga hanya berlaku untuk pelanggan baru sampai siklus perpanjangan berikutnya.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Promo & diskon aktif</CardTitle>
                <Button>+ Buat Promo Baru</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500">
                      <th className="py-3 pr-4 font-medium">Kode Promo</th>
                      <th className="py-3 pr-4 font-medium">Diskon</th>
                      <th className="py-3 pr-4 font-medium">Berlaku Untuk</th>
                      <th className="py-3 pr-4 font-medium">Batas</th>
                      <th className="py-3 pr-4 font-medium">Terpakai</th>
                      <th className="py-3 pr-4 font-medium">Berlaku Sampai</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoRows.map((promo) => (
                      <tr key={promo.code} className="border-b border-neutral-100">
                        <td className="py-4 pr-4 font-mono-ui">{promo.code}</td>
                        <td className="py-4 pr-4">{promo.discount}</td>
                        <td className="py-4 pr-4">{promo.appliesTo}</td>
                        <td className="py-4 pr-4">{promo.limit}</td>
                        <td className="py-4 pr-4">{promo.used}</td>
                        <td className="py-4 pr-4">{promo.expiresAt}</td>
                        <td className="py-4 pr-4">
                          <Badge tone="success">{promo.status}</Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <button className="text-primary-800">Edit</button>
                            <button className="text-danger-700">Nonaktifkan</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input defaultValue="PROHEMAT" />
                <Input defaultValue="20" />
                <Input defaultValue="Pro / Business" />
                <Input defaultValue="150" />
                <Input defaultValue="1" />
                <Input defaultValue="30 Apr 2026" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminShell>
  );
}
