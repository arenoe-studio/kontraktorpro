import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/session";
import { AppShell } from "./_components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireRole("contractor");
  return <AppShell>{children}</AppShell>;
}
