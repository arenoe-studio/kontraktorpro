import {
  Activity,
  BadgeDollarSign,
  FileWarning,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { AdminShell } from "./admin-shell";
import {
  dashboardKpis,
  moderationPortfolioRows,
  moderationReviewRows,
  platformActivity,
  resolveAdminRole,
  revenueBars,
  systemHealth,
  userRows,
} from "./admin-mocks";

const icons = [
  Users,
  Activity,
  TrendingUp,
  FileWarning,
  BadgeDollarSign,
  FolderKanban,
  Activity,
  FileWarning,
];

export async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = resolveAdminRole(params.role);
  const showFinance = role === "super_admin";

  return (
    <AdminShell title="Dashboard Admin" currentPath="/admin" role={role}>
      <div className="rounded-xl border border-success-100 bg-success-100/60 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Badge tone="success">Server normal</Badge>
          <p className="text-sm text-neutral-700">Uptime bulan ini {systemHealth.uptime}</p>
          <p className="text-sm text-neutral-700">
            Antrian moderasi {systemHealth.moderationQueue}
          </p>
          <p className="text-sm text-neutral-700">
            Pengguna aktif sekarang {systemHealth.activeUsers}
          </p>
        </div>
        <p className="mt-2 text-sm text-neutral-600">{systemHealth.incident}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {dashboardKpis
          .filter((_, index) => showFinance || index !== 4)
          .map((item, index) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              icon={icons[index]}
              helper={item.helper}
              accent={item.accent}
              trend={index === 3 ? "down" : "up"}
            />
          ))}
      </div>

      <div className={`grid gap-6 ${showFinance ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
        <Card>
          <CardHeader>
            <CardTitle>Pertumbuhan pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              {["7 hari", "30 hari", "3 bulan", "12 bulan"].map((period, index) => (
                <button
                  key={period}
                  className={`rounded-full px-3 py-1 text-sm ${
                    index === 1
                      ? "bg-primary-800 text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="flex h-56 items-end gap-3 rounded-xl border border-neutral-200 p-4">
              {revenueBars.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary-800/85"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-neutral-500">{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showFinance ? (
          <Card>
            <CardHeader>
              <CardTitle>MRR 12 bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-3 text-sm text-neutral-500">
                <Badge tone="primary">Pro</Badge>
                <Badge tone="warning">Business</Badge>
                <span>Target bulan ini Rp100 jt</span>
              </div>
              <div className="flex h-56 items-end gap-3 rounded-xl border border-neutral-200 p-4">
                {revenueBars.map((value, index) => (
                  <div key={index} className="flex flex-1 items-end gap-1">
                    <div
                      className="w-1/2 rounded-t-md bg-primary-800"
                      style={{ height: `${Math.max(value - 18, 24)}%` }}
                    />
                    <div
                      className="w-1/2 rounded-t-md bg-accent-500"
                      style={{ height: `${Math.max(value - 42, 16)}%` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Menunggu Moderasi</CardTitle>
              <Badge tone="warning">{systemHealth.moderationQueue} item</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {moderationPortfolioRows.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-neutral-900">{item.project}</p>
                    <p className="text-sm text-neutral-500">
                      {item.contractor} • {item.city} • {item.submittedAt}
                    </p>
                  </div>
                  <Badge tone="warning">Menunggu review</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button>Approve</Button>
                  <Button variant="outline-danger">Tolak</Button>
                  <a
                    href="/admin/moderation/portfolio"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-primary-800"
                  >
                    Lihat detail lengkap
                  </a>
                </div>
              </div>
            ))}
            {moderationReviewRows.slice(0, 1).map((item) => (
              <div key={item.id} className="rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-neutral-900">{item.contractor}</p>
                    <p className="text-sm text-neutral-500">
                      {item.rating}/5 • {item.owner} • {item.submittedAt}
                    </p>
                  </div>
                  <Badge tone={item.flagged ? "danger" : "warning"}>
                    {item.flagged ? "Butuh sensor" : "Review"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-neutral-700">{item.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengguna baru & aktivitas platform</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              {userRows.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <Avatar name={user.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900">{user.name}</p>
                    <p className="text-sm text-neutral-500">
                      {user.city} • {user.registeredAt}
                    </p>
                  </div>
                  <Badge
                    tone={
                      user.status === "Aktif"
                        ? "success"
                        : user.status === "Suspend"
                          ? "danger"
                          : "warning"
                    }
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {platformActivity.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-accent-500" />
                  <p className="text-sm text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
