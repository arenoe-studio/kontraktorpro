import { AppNavbar } from "@/components/layout/app-navbar";
import { CheckoutForm } from "./checkout-form";

export async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; method?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppNavbar />
      <CheckoutForm tier={params.tier} method={params.method} />
    </div>
  );
}
