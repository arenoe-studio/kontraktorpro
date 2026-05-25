import { AdminUsersPage } from "../_components/AdminUsersPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminUsersPage searchParams={searchParams} />;
}
