import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/session";
import { ContractorShell } from "@/app/(app)/_components/contractor-shell";

export default async function BillingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("contractor");
  return <ContractorShell>{children}</ContractorShell>;
}
