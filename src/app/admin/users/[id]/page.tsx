import { AdminUserDetailPage } from "../../_components/AdminUserDetailPage";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminUserDetailPage params={params} searchParams={searchParams} />;
}
