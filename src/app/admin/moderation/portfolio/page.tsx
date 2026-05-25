import { CheckCircle2, Eye, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminShell } from "../../_components/admin-shell";
import {
  moderationPortfolioRows,
  resolveAdminRole,
} from "../../_components/admin-mocks";

export default async function AdminModerationPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);
  const pendingItems = moderationPortfolioRows.filter((item) => item.status === "pending");

  return (
    <AdminShell
      title="Moderasi Portofolio"
      currentPath="/admin/moderation/portfolio"
      role={role}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Moderasi Portofolio</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {["Menunggu Review", "Approved", "Ditolak", "Semua"].map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-3 py-1 text-sm ${
                    index === 0
                      ? "bg-primary-800 text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <EmptyState
              title="Tidak ada portofolio yang menunggu review."
              description="Antrian moderasi bersih. Portofolio baru akan muncul di sini."
              icon={CheckCircle2}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-3">
              {moderationPortfolioRows.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.coverImage})` }}
                  />
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-neutral-900">{item.project}</p>
                        <p className="text-sm text-neutral-500">
                          {item.contractor} • {item.city}
                        </p>
                      </div>
                      <Badge
                        tone={
                          item.status === "pending"
                            ? "warning"
                            : item.status === "approved"
                              ? "success"
                              : "danger"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-neutral-600">
                      {item.projectType} • Durasi {item.duration} • {item.submittedAt}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline">
                        <Eye className="size-4" />
                        Preview Publik
                      </Button>
                      <Button>Approve</Button>
                      <Button variant="outline-danger">
                        <XCircle className="size-4" />
                        Tolak
                      </Button>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-sm font-medium text-neutral-900">Alasan cepat penolakan</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "Foto tidak jelas",
                          "Konten tidak sesuai",
                          "Informasi tidak lengkap",
                          "Lainnya",
                        ].map((reason) => (
                          <span
                            key={reason}
                            className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600 ring-1 ring-neutral-200"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
