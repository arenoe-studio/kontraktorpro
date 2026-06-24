import { CheckoutForm } from "./checkout-form";

export async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string }>;
}) {
  const params = await searchParams;

  return <CheckoutForm tier={params.tier} method={params.method} />;
}
