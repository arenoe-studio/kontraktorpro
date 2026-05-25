import type { ReactNode } from "react";
import {
  Activity,
  BadgeDollarSign,
  BellRing,
  ClipboardList,
  LayoutDashboard,
  Logs,
  Package2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/contracts/enums";

type AdminShellProps = {
  title: string;
  currentPath: string;
  role: Role;
  children: ReactNode;
};

export function AdminShell({
  title,
  currentPath,
  role,
  children,
}: AdminShellProps) {
  const isModerator = role === "moderator";

  return (
    <AppShell
      sidebar={
        <AppSidebar
          variant="admin"
          sections={[
            {
              title: "Overview",
              items: [
                {
                  label: "Dashboard",
                  href: "/admin",
                  icon: LayoutDashboard,
                  active: currentPath === "/admin",
                },
                {
                  label: "Aktivitas Real-time",
                  href: "/admin/logs",
                  icon: Activity,
                  active: currentPath === "/admin/logs",
                },
              ],
            },
            {
              title: "Pengguna",
              items: [
                {
                  label: "Semua Pengguna",
                  href: "/admin/users",
                  icon: Users,
                  active: currentPath === "/admin/users",
                },
                {
                  label: "Moderasi Portofolio",
                  href: "/admin/moderation/portfolio",
                  icon: ClipboardList,
                  badge: "8",
                  active: currentPath === "/admin/moderation/portfolio",
                },
                {
                  label: "Moderasi Ulasan",
                  href: "/admin/moderation/reviews",
                  icon: Star,
                  badge: "4",
                  active: currentPath === "/admin/moderation/reviews",
                },
              ],
            },
            ...(!isModerator
              ? [
                  {
                    title: "Bisnis",
                    items: [
                      {
                        label: "Keuangan & MRR",
                        href: "/admin/finance",
                        icon: BadgeDollarSign,
                        active: currentPath === "/admin/finance",
                      },
                      {
                        label: "Paket & Harga",
                        href: "/admin/packages",
                        icon: Package2,
                        active: currentPath === "/admin/packages",
                      },
                    ],
                  },
                ]
              : []),
            {
              title: "Sistem",
              items: [
                {
                  label: "Log Aktivitas Admin",
                  href: "/admin/logs",
                  icon: Logs,
                  active: currentPath === "/admin/logs",
                },
              ],
            },
          ]}
          packageSlot={
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-success-500" />
                <p className="text-sm font-medium text-white">Semua sistem normal</p>
              </div>
              <p className="text-sm text-white/70">
                Role aktif: {isModerator ? "Moderator" : "Super Admin"}
              </p>
            </div>
          }
        />
      }
      topbar={
        <div className="space-y-3">
          <div className="px-4 pt-4 md:hidden">
            <div className="rounded-lg border border-warning-100 bg-warning-100/60 p-4">
              <p className="text-sm font-medium text-warning-700">
                Admin panel dioptimalkan untuk layar desktop. Beberapa fitur mungkin tidak berfungsi optimal.
              </p>
            </div>
          </div>
          <AppTopbar
            title={title}
            subtitle="Panel operasional KontraktorPro"
            searchPlaceholder="Cari pengguna, nama usaha, atau proyek..."
            notificationCount={6}
            rightSlot={
              <div className="flex items-center gap-3">
                <Badge tone="success" dot>
                  Sistem normal
                </Badge>
                <button className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-neutral-100">
                  <BellRing className="size-4" />
                  Notifikasi
                </button>
              </div>
            }
          />
        </div>
      }
      contentClassName="space-y-6 pb-10"
    >
      {children}
    </AppShell>
  );
}
