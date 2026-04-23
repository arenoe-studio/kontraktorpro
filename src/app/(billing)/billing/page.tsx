import { AppNavbar } from "@/components/layout/app-navbar";
import { BillingOverview } from "../_components/billing-overview";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppNavbar
        links={[
          { href: "/billing", label: "Billing" },
          { href: "/checkout", label: "Checkout" },
          { href: "/admin", label: "Admin Mock" },
        ]}
      />
      <BillingOverview />
    </div>
  );
}
