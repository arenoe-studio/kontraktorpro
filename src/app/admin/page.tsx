import { AdminDashboardPage } from "./_components/AdminDashboardPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminDashboardPage searchParams={searchParams} />;
}
