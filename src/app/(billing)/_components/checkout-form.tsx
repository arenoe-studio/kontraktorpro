import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { mockCurrentUser, mockSubscriptions } from "@/lib/contracts/mock-data";
import { billingContact, formatCurrency, paymentMethods, promoSamples } from "./billing-data";

type CheckoutFormProps = {
  tier?: string;
  method?: string;
};

const tierTone = {
  free: "neutral",
  pro: "primary",
  business: "warning",
} as const;

export function CheckoutForm({ tier, method }: CheckoutFormProps) {
  const selectedTier =
    mockSubscriptions.find((item) => item.tier === tier) ?? mockSubscriptions[1];
  const selectedMethod =
    paymentMethods.find((item) => item.id === method) ?? paymentMethods[1];
  const total = selectedTier.price;

  return (
    <div className="app-container py-8 md:py-10">
      <div className="mb-8">
        <SectionHeader
          eyebrow="Checkout"
          title="Upgrade paket tanpa ribet"
          description="Pilih metode pembayaran, cek ringkasan order, dan lanjutkan pembayaran dengan aman."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-label text-neutral-500">Nomor HP</label>
                <Input defaultValue={billingContact.phone} />
                <p className="text-sm text-neutral-500">
                  Invoice dan konfirmasi akan dikirim ke nomor ini.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-label text-neutral-500">Nama usaha</label>
                <Input defaultValue={mockCurrentUser.businessName} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metode pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 ${
                    item.id === selectedMethod.id
                      ? "border-primary-800 bg-primary-50"
                      : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-500">{item.helper}</p>
                    </div>
                    {item.id === selectedMethod.id ? (
                      <Badge tone="success" size="sm">
                        Dipilih
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.details.map((detail) => (
                      <span
                        key={detail}
                        className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600 shadow-xs ring-1 ring-neutral-200"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {selectedMethod.id === "credit-card" ? (
                <div className="grid gap-4 rounded-xl border border-neutral-200 p-4 md:grid-cols-2">
                  <Input placeholder="Nomor kartu" defaultValue="4111 1111 1111 1111" />
                  <Input placeholder="Nama di kartu" defaultValue="Budi Santoso" />
                  <Input placeholder="MM/YY" defaultValue="12/28" />
                  <Input placeholder="CVV" defaultValue="123" />
                </div>
              ) : selectedMethod.id === "bank-transfer" ? (
                <div className="rounded-xl border border-warning-100 bg-warning-100/50 p-4">
                  <p className="text-sm font-medium text-warning-700">
                    Nomor rekening akan ditampilkan setelah submit checkout.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-neutral-200 p-4">
                  <p className="text-sm text-neutral-600">
                    Jika metode ini dipilih, nomor {billingContact.maskedPhone} akan dipakai sebagai nomor konfirmasi.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-warning-100 bg-warning-100/50 p-4">
                <p className="text-sm font-medium text-warning-700">
                  Sesi Anda hampir habis. Simpan progres?
                </p>
                <Button variant="ghost" className="mt-3">
                  Lanjutkan Sesi
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <LockKeyhole className="size-4 text-success-500" />
                <span>Checkout ini diamankan dengan HTTPS dan gateway payment partner.</span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/checkout/success?tier=${selectedTier.tier}&method=${selectedMethod.id}${
                    selectedMethod.id === "bank-transfer" ? "&status=pending" : ""
                  }`}
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent-500 px-5 py-3 text-base font-semibold text-white shadow-xs transition hover:bg-accent-600"
                >
                  Lanjutkan Pembayaran
                </Link>
                <p className="text-sm text-neutral-500">
                  Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900 capitalize">{selectedTier.tier}</p>
                  <p className="text-sm text-neutral-500">Periode bulanan</p>
                </div>
                <Badge tone={tierTone[selectedTier.tier]}>{selectedTier.tier.toUpperCase()}</Badge>
              </div>

              <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Harga dasar</span>
                  <span className="font-medium text-neutral-900">{formatCurrency(selectedTier.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-success-700">
                  <span>Diskon promo</span>
                  <span>- Rp0</span>
                </div>
                <div className="h-px bg-neutral-200" />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">Total</span>
                  <span className="font-mono-ui text-2xl font-bold text-neutral-900">
                    {total === 0 ? "Gratis" : formatCurrency(total)}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">Termasuk PPN jika berlaku.</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="Masukkan kode promo" defaultValue="PROHEMAT" />
                  <Button variant="ghost">Pakai</Button>
                </div>
                <p className="text-sm text-danger-700">
                  Kode promo tidak ditemukan atau sudah kadaluarsa.
                </p>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium text-neutral-900">Contoh promo aktif</p>
                  <div className="mt-3 space-y-2">
                    {promoSamples.map((promo) => (
                      <div key={promo.code} className="text-sm text-neutral-600">
                        <span className="font-mono-ui font-semibold text-primary-800">{promo.code}</span>
                        {" — "}
                        {promo.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-success-100 bg-success-100/50 p-4">
                <div className="flex items-center gap-2 text-success-700">
                  <ShieldCheck className="size-4" />
                  <p className="text-sm font-medium">Pembayaran aman</p>
                </div>
                <p className="mt-2 text-sm text-neutral-700">
                  Nomor kartu tidak disimpan di server KontraktorPro dan renewal bisa dibatalkan kapan saja.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
