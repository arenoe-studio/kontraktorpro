import { AdminLogsPage } from "../_components/AdminLogsPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminLogsPage searchParams={searchParams} />;
}
