"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FolderKanban,
  Home,
  Menu,
  Settings,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { cn } from "./ui";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Proyek Saya", icon: FolderKanban },
  {
    href: "/projects/renovasi-rumah-pak-hasan?tab=reports",
    label: "Laporan",
    icon: ClipboardList,
  },
  {
    href: "/projects/renovasi-rumah-pak-hasan?tab=settings",
    label: "Pengaturan",
    icon: Settings,
  },
];

const mobileNavigation = navigation.slice(0, 4);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageMeta = getPageMeta(pathname);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-slate-900 px-4 py-6 text-white lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-2xl bg-orange-500 p-2 text-white">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-lg font-bold">KontraktorPro</p>
            <p className="text-xs text-white/70">Workspace Kontraktor</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href.split("?")[0]);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Paket Aktif
          </p>
          <p className="mt-2 text-lg font-semibold">Pro Annual</p>
          <p className="mt-1 text-sm leading-6 text-white/75">
            5 proyek aktif, laporan PDF, dan link pantau owner aktif.
          </p>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-15 items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-600 lg:hidden"
                aria-label="Buka menu"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="text-lg font-bold tracking-tight text-zinc-900">
                  {pageMeta.title}
                </p>
                <p className="text-sm text-zinc-500">
                  {pageMeta.description}
                </p>
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 xl:block">
              <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                Cari proyek, owner, atau item pekerjaan...
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600"
                aria-label="Notifikasi"
              >
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
                <UserCircle2 className="size-8 text-slate-900" />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-zinc-900">
                    Budi Santoso
                  </p>
                  <p className="text-xs text-zinc-500">Kontraktor Utama</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 lg:px-6 lg:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white px-2 py-2 shadow-[0_-6px_16px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {mobileNavigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href.split("?")[0]);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium",
                  isActive ? "text-slate-900" : "text-zinc-500",
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/projects/new")) {
    return {
      title: "Buat Proyek Baru",
      description: "Shell form proyek baru untuk KontraktorPro",
    };
  }

  if (pathname.startsWith("/projects/") && pathname.endsWith("/edit")) {
    return {
      title: "Edit Proyek",
      description: "Perbarui informasi inti proyek",
    };
  }

  if (pathname.startsWith("/projects/")) {
    return {
      title: "Workspace Proyek",
      description: "Pusat kendali proyek kontraktor",
    };
  }

  if (pathname.startsWith("/projects")) {
    return {
      title: "Proyek Saya",
      description: "Semua proyek aktif, selesai, dan arsip",
    };
  }

  return {
    title: "Dashboard",
    description: "Ringkasan operasional kontraktor hari ini",
  };
}
