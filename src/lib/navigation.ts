import type { Role } from "@/lib/contracts";
import {
  ClipboardList,
  CreditCard,
  FolderKanban,
  Globe,
  Home,
  Layers3,
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
  { href: "/projects", label: "Proyek Saya", icon: FolderKanban },
  { href: "/billing", label: "Langganan", icon: CreditCard },
];

export const adminSidebarNavigation = {
  overview: [
    { href: "/admin", label: "Dashboard", icon: Home },
  ],
  users: [
    { href: "/admin/users", label: "Semua Pengguna", icon: Users },
  ],
  content: [
    { href: "/admin/moderation/portfolio", label: "Moderasi Portofolio", icon: Globe },
    { href: "/admin/moderation/reviews", label: "Moderasi Ulasan", icon: ClipboardList },
  ],
  business: [
    { href: "/admin/packages", label: "Paket & Harga", icon: CreditCard },
    { href: "/admin/finance", label: "Keuangan & MRR", icon: Layers3 },
  ],
  system: [
    { href: "/admin/logs", label: "Log Aktivitas", icon: ClipboardList },
  ],
};

export function getDefaultRedirectByRole(role: Role) {
  if (role === "contractor") {
    return "/dashboard";
  }

  return "/admin";
}
