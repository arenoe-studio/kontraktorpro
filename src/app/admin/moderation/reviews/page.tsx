import { AdminModerationReviewsPage } from "../../_components/AdminModerationReviewsPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return <AdminModerationReviewsPage searchParams={searchParams} />;
}
