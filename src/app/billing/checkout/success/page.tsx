import { CheckoutSuccessPage } from "../../_components/CheckoutSuccessPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string; status?: string }>;
}) {
  return <CheckoutSuccessPage searchParams={searchParams} />;
}
