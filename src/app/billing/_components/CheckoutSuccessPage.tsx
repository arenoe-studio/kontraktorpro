import { PaymentStatus } from "./payment-status";

export async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string; status?: string }>;
}) {
  const params = await searchParams;

  return (
    <PaymentStatus
      tier={params.tier}
      method={params.method}
      status={params.status}
    />
  );
}
