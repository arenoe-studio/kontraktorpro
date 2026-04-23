import type { ReactNode } from "react";
import { requireAuth } from "@/lib/auth/session";

export default async function BillingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();
  return children;
}
