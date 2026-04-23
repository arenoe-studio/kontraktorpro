import Link from "next/link";
import { CheckCircle2, Clock3, Copy, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSubscriptions } from "@/lib/contracts/mock-data";
import { billingContact, formatCurrency } from "./billing-data";

type PaymentStatusProps = {
  tier?: string;
  method?: string;
  status?: string;
};

export function PaymentStatus({
  tier,
  method,
  status,
}: PaymentStatusProps) {
  const selectedTier =
    mockSubscriptions.find((item) => item.tier === tier) ?? mockSubscriptions[1];
  const isPending = status === "pending" || method === "bank-transfer";

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] space-y-6">
        <div className="text-center">
          <div
            className={`mx-auto flex size-20 items-center justify-center rounded-full ${
              isPending ? "bg-warning-100 text-warning-700" : "bg-success-100 text-success-700"
            }`}
          >
            {isPending ? <Clock3 className="size-10" /> : <CheckCircle2 className="size-10" />}
          </div>
          <h1 className="mt-6">
            {isPending ? "Menunggu Konfirmasi Pembayaran" : "Pembayaran Berhasil!"}
          </h1>
          <p className="mt-3 text-base text-neutral-500">
            {isPending
              ? "Selesaikan transfer dalam 24 jam. Paket akan aktif otomatis setelah pembayaran dikonfirmasi."
              : `Konfirmasi telah dikirim ke ${billingContact.maskedPhone}.`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan transaksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 capitalize">{selectedTier.tier}</p>
                <p className="text-sm text-neutral-500">Paket aktif mulai 23 Apr 2026</p>
              </div>
              <Badge tone={isPending ? "warning" : "success"}>
                {isPending ? "Pending" : "Aktif"}
              </Badge>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Biaya paket</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(selectedTier.price)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-neutral-500">Perpanjangan berikutnya</span>
                <span className="font-medium text-neutral-900">23 Mei 2026</span>
              </div>
            </div>

            {isPending ? (
              <div className="rounded-xl border border-warning-100 bg-warning-100/50 p-4">
                <p className="text-sm font-medium text-warning-700">Instruksi transfer</p>
                <div className="mt-3 space-y-2 text-sm text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span>Bank</span>
                    <span className="font-medium">BCA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>No. rekening</span>
                    <span className="font-mono-ui font-medium">1234567890</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Penerima</span>
                    <span className="font-medium">PT KontraktorPro Indonesia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nominal</span>
                    <span className="font-mono-ui font-medium">
                      {formatCurrency(selectedTier.price + 123)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {isPending ? (
            <>
              <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary-800 px-5 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-primary-50">
                <Copy className="size-4" />
                Salin Nomor Rekening
              </button>
              <Link
                href="/billing"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-neutral-100"
              >
                Kembali ke Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/billing"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent-500 px-5 py-3 text-base font-semibold text-white shadow-xs transition hover:bg-accent-600"
              >
                Masuk ke Dashboard
              </Link>
              <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-neutral-100">
                <Download className="size-4" />
                Unduh Invoice
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
