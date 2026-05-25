import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/session";
import { ContractorShell } from "./_components/contractor-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireRole("contractor");
  return <ContractorShell>{children}</ContractorShell>;
}
