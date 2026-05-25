import { AppNavbar } from "@/components/layout/app-navbar";
import { PaymentStatus } from "../../_components/payment-status";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string; status?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppNavbar />
      <PaymentStatus
        tier={params.tier}
        method={params.method}
        status={params.status}
      />
    </div>
  );
}
