import { MessageSquareWarning, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { AdminShell } from "./admin-shell";
import {
  moderationReviewRows,
  resolveAdminRole,
} from "./admin-mocks";

export async function AdminModerationReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);
  const pendingItems = moderationReviewRows.filter((item) => item.status === "pending");

  return (
    <AdminShell
      title="Moderasi Ulasan"
      currentPath="/admin/moderation/reviews"
      role={role}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Moderasi Ulasan</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {["Menunggu Review", "Dipublish", "Dihapus", "Semua"].map((tab, index) => (
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
        <CardContent className="space-y-4">
          {pendingItems.length === 0 ? (
            <EmptyState
              title="Tidak ada ulasan yang menunggu review."
              description="Ulasan baru akan tampil di sini untuk dipublish atau dihapus."
            />
          ) : (
            moderationReviewRows.map((item) => (
              <div key={item.id} className="rounded-xl border border-neutral-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1 text-warning-500">
                      {Array.from({ length: item.rating }).map((_, index) => (
                        <Star key={index} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 font-medium text-neutral-900">{item.contractor}</p>
                    <p className="text-sm text-neutral-500">
                      {item.owner} • {item.project} • {item.submittedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      tone={
                        item.status === "approved"
                          ? "success"
                          : item.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {item.status}
                    </Badge>
                    {item.flagged ? (
                      <Badge tone="danger" dot>
                        Terdeteksi kata tidak pantas
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 text-sm text-neutral-700">{item.comment}</p>

                {item.flagged ? (
                  <div className="mt-4 rounded-xl border border-danger-100 bg-danger-100/40 p-4">
                    <div className="flex items-center gap-2 text-danger-700">
                      <MessageSquareWarning className="size-4" />
                      <p className="text-sm font-medium">
                        Inline edit tersedia untuk sensor kata tanpa mengubah rating.
                      </p>
                    </div>
                    <Textarea className="mt-3" defaultValue={item.comment} />
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button>Publish</Button>
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline-danger">Hapus</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
