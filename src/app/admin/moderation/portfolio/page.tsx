import { AdminModerationPortfolioPage } from "../../_components/AdminModerationPortfolioPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminModerationPortfolioPage searchParams={searchParams} />;
}
