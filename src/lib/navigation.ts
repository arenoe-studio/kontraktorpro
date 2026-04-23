import type { Role } from "@/lib/contracts";
import {
  ClipboardList,
  CreditCard,
  FolderKanban,
  Globe,
  Home,
  Layers3,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export const marketingNavigation = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/harga", label: "Harga" },
  { href: "/direktori", label: "Direktori" },
  { href: "/#tentang", label: "Tentang" },
];

export const contractorSidebarNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/proyek", label: "Proyek Saya", icon: FolderKanban },
  { href: "/portofolio", label: "Portofolio", icon: Globe },
  { href: "/langganan", label: "Langganan", icon: CreditCard },
  { href: "/pengaturan-akun", label: "Pengaturan", icon: Settings },
];

export const adminSidebarNavigation = {
  overview: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/aktivitas", label: "Aktivitas Real-time", icon: Layers3 },
  ],
  users: [
    { href: "/admin/pengguna", label: "Semua Pengguna", icon: Users },
    { href: "/admin/verifikasi", label: "Verifikasi Akun", icon: Shield },
    { href: "/admin/laporan", label: "Laporan Pengguna", icon: ClipboardList },
  ],
  content: [
    {
      href: "/admin/moderasi-portofolio",
      label: "Moderasi Portofolio",
      icon: Globe,
    },
    {
      href: "/admin/moderasi-ulasan",
      label: "Moderasi Ulasan",
      icon: ClipboardList,
    },
  ],
  business: [
    { href: "/admin/paket", label: "Paket & Harga", icon: CreditCard },
    { href: "/admin/keuangan", label: "Keuangan & MRR", icon: Layers3 },
  ],
  system: [
    { href: "/admin/log-aktivitas", label: "Log Aktivitas", icon: ClipboardList },
    { href: "/admin/notifikasi", label: "Notifikasi Sistem", icon: Shield },
  ],
};

export function getDefaultRedirectByRole(role: Role) {
  if (role === "contractor") {
    return "/dashboard";
  }

  return "/admin";
}
