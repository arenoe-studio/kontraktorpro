"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { contractorSidebarNavigation } from "@/lib/navigation";

export function ContractorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const sidebarSections = [
    {
      items: contractorSidebarNavigation.map((item) => ({
        ...item,
        active:
          pathname === item.href || pathname.startsWith(item.href + "/"),
      })),
    },
  ];

  const bottomNavItems = contractorSidebarNavigation.slice(0, 4).map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + "/"),
  }));

  return (
    <AppShell
      sidebar={<AppSidebar sections={sidebarSections} variant="contractor" />}
      topbar={<AppTopbar title={getPageTitle(pathname)} subtitle={getPageSubtitle(pathname)} />}
      bottomNav={<BottomNav items={bottomNavItems} />}
    >
      {children}
    </AppShell>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/projects/new")) return "Buat Proyek Baru";
  if (pathname.startsWith("/projects/") && pathname.endsWith("/edit")) return "Edit Proyek";
  if (pathname.startsWith("/projects/")) return "Workspace Proyek";
  if (pathname.startsWith("/projects")) return "Proyek Saya";
  if (pathname.startsWith("/billing")) return "Langganan";
  return "Dashboard";
}

function getPageSubtitle(pathname: string): string | undefined {
  if (pathname.startsWith("/projects/new")) return "Shell form proyek baru untuk KontraktorPro";
  if (pathname.startsWith("/projects/") && pathname.endsWith("/edit")) return "Perbarui informasi inti proyek";
  if (pathname.startsWith("/projects/")) return "Pusat kendali proyek kontraktor";
  if (pathname.startsWith("/projects")) return "Semua proyek aktif, selesai, dan arsip";
  if (pathname.startsWith("/billing")) return "Kelola paket dan pembayaran";
  return "Ringkasan operasional kontraktor hari ini";
}
