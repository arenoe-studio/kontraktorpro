import Link from "next/link";
import { Check, CreditCard, FileText, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Textarea } from "@/components/ui/textarea";
import { mockCurrentUser, mockSubscriptions } from "@/lib/contracts/mock-data";
import {
  activePlan,
  billingContact,
  formatCurrency,
  invoices,
  paymentHistory,
  planHighlights,
  usageSummary,
} from "./billing-data";

const statusTone = {
  paid: "success",
  pending: "warning",
  failed: "danger",
} as const;

const tierTone = {
  free: "neutral",
  pro: "primary",
  business: "warning",
} as const;

export function BillingOverview() {
  return (
    <div className="app-container space-y-8 py-8 md:py-10">
      <SectionHeader
        eyebrow="Billing"
        title="Langganan & Pengaturan Akun"
        description="Kelola paket aktif, riwayat invoice, dan preferensi kontak untuk tagihan tanpa meninggalkan dashboard."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/checkout?tier=business"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-accent-600"
            >
              Upgrade ke Business
            </Link>
            <Button variant="outline">Unduh Invoice Terakhir</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Paket Aktif"
          value={activePlan.tier.toUpperCase()}
          icon={Sparkles}
          helper={`Perpanjangan ${usageSummary.renewalDate}`}
          accent="accent"
          trend="up"
        />
        <StatCard
          label="Slot Proyek Tersisa"
          value={`${usageSummary.remainingSlots}`}
          icon={ShieldCheck}
          helper={`${usageSummary.activeProjects} proyek aktif saat ini`}
          accent="primary"
        />
        <StatCard
          label="Invoice Berikutnya"
          value={formatCurrency(activePlan.price)}
          icon={CreditCard}
          helper={`Jatuh tempo ${usageSummary.nextInvoiceDate}`}
          accent="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Paket tersedia</CardTitle>
                <CardDescription>
                  Sesuaikan kapasitas proyek, laporan PDF, dan akses owner tracking.
                </CardDescription>
              </div>
              <Badge tone={tierTone[activePlan.tier]}>{activePlan.tier.toUpperCase()} aktif</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {mockSubscriptions.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-5 ${
                  plan.tier === activePlan.tier
                    ? "border-primary-800 bg-primary-50"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-xl font-semibold capitalize">{plan.tier}</p>
                    <p className="mt-2 font-mono-ui text-2xl font-bold text-neutral-900">
                      {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
                    </p>
                  </div>
                  {plan.tier === activePlan.tier ? (
                    <Badge tone="success" dot>
                      Aktif
                    </Badge>
                  ) : null}
                </div>
                <ul className="mt-5 space-y-2">
                  {planHighlights[plan.tier].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                      <Check className="mt-0.5 size-4 text-success-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href={`/checkout?tier=${plan.tier}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-primary-800 px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary-50"
                  >
                    {plan.tier === activePlan.tier ? "Kelola Paket" : "Pilih Paket"}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontak billing</CardTitle>
            <CardDescription>
              Invoice dan konfirmasi pembayaran dikirim ke nomor ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-label text-neutral-500">Nomor HP</label>
              <Input defaultValue={billingContact.phone} />
            </div>
            <div className="space-y-2">
              <label className="text-label text-neutral-500">Nama usaha</label>
              <Input defaultValue={mockCurrentUser.businessName} />
            </div>
            <div className="rounded-lg border border-warning-100 bg-warning-100/50 p-4">
              <p className="text-sm font-medium text-warning-700">{billingContact.emailHint}</p>
              <p className="mt-1 text-sm text-neutral-700">
                Gunakan nomor yang selalu aktif agar update invoice tidak terlewat.
              </p>
            </div>
            <Button className="w-full">Simpan Pengaturan Billing</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat pembayaran</CardTitle>
            <CardDescription>
              Tracking status transaksi terbaru sebelum paket diperpanjang otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-3 pr-4 font-medium">Referensi</th>
                  <th className="py-3 pr-4 font-medium">Paket</th>
                  <th className="py-3 pr-4 font-medium">Metode</th>
                  <th className="py-3 pr-4 font-medium">Jumlah</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-neutral-100">
                    <td className="py-4 pr-4 font-mono-ui text-xs text-neutral-700">{payment.id}</td>
                    <td className="py-4 pr-4 capitalize">{payment.tier}</td>
                    <td className="py-4 pr-4">{payment.method}</td>
                    <td className="py-4 pr-4">{formatCurrency(payment.amount)}</td>
                    <td className="py-4">
                      <Badge tone={statusTone[payment.status]} dot>
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catatan akun internal</CardTitle>
            <CardDescription>
              Simpan preferensi tagihan, PO owner, atau instruksi invoice untuk tim.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              defaultValue="Invoice bulanan dikirim ke WhatsApp owner proyek utama setiap tanggal 20. Lampirkan nama proyek aktif dan status jatuh tempo."
            />
            <Button className="w-full">Simpan Catatan</Button>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">Invoice terbaru</p>
              <div className="mt-3 space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono-ui text-xs text-neutral-700">{invoice.id}</p>
                      <p className="text-sm text-neutral-500">
                        {invoice.tier} • {invoice.issuedAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <Badge tone="success" size="sm">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Keamanan & kepatuhan</CardTitle>
              <CardDescription>
                Nomor kartu tidak disimpan oleh KontraktorPro dan seluruh checkout berjalan lewat HTTPS.
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-success-100 px-3 py-1 text-sm font-medium text-success-700">
              <ShieldCheck className="size-4" />
              SSL Secure
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 p-4">
            <FileText className="size-5 text-primary-800" />
            <p className="mt-3 font-medium text-neutral-900">Invoice otomatis</p>
            <p className="mt-1 text-sm text-neutral-500">
              Invoice bulanan tersedia langsung setelah pembayaran berhasil.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4">
            <CreditCard className="size-5 text-primary-800" />
            <p className="mt-3 font-medium text-neutral-900">Metode fleksibel</p>
            <p className="mt-1 text-sm text-neutral-500">
              Transfer bank, QRIS, kartu, dan e-wallet dengan fallback metode lain saat gagal.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4">
            <ShieldCheck className="size-5 text-primary-800" />
            <p className="mt-3 font-medium text-neutral-900">Jejak audit billing</p>
            <p className="mt-1 text-sm text-neutral-500">
              Setiap upgrade, invoice, dan perubahan paket tersimpan untuk rekonsiliasi tim.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
