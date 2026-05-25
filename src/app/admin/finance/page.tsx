import { AdminFinancePage } from "../_components/AdminFinancePage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminFinancePage searchParams={searchParams} />;
}
