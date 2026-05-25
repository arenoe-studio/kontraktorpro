import { AppNavbar } from "@/components/layout/app-navbar";
import { BillingOverview } from "./billing-overview";

export function BillingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppNavbar
        links={[
          { href: "/billing", label: "Billing" },
          { href: "/billing/checkout", label: "Checkout" },
          { href: "/admin", label: "Admin Mock" },
        ]}
      />
      <BillingOverview />
    </div>
  );
}
