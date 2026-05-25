import { AdminPackagesPage } from "../_components/AdminPackagesPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminPackagesPage searchParams={searchParams} />;
}
