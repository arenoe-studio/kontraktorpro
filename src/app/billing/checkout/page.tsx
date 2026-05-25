import { CheckoutPage } from "../_components/CheckoutPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string }>;
}) {
  return <CheckoutPage searchParams={searchParams} />;
}
