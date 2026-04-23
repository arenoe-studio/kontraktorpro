import {
  mockCurrentUser,
  mockPayments,
  mockSubscriptions,
} from "@/lib/contracts/mock-data";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const billingContact = {
  phone: mockCurrentUser.phone,
  maskedPhone: "0812****890",
  emailHint: "Invoice & konfirmasi dikirim via WhatsApp",
};

export const planHighlights = {
  free: [
    "1 proyek aktif",
    "Portofolio publik",
    "Dashboard proyek dasar",
  ],
  pro: [
    "5 proyek aktif",
    "Laporan PDF & link owner",
    "Notifikasi prioritas",
  ],
  business: [
    "Proyek tak terbatas",
    "Multi-admin & branding",
    "Support onboarding tim",
  ],
};

export const activePlan =
  mockSubscriptions.find((item) => item.tier === mockCurrentUser.subscriptionTier) ??
  mockSubscriptions[0];

export const usageSummary = {
  activeProjects: 3,
  remainingSlots: Math.max(activePlan.activeProjectLimit - 3, 0),
  renewalDate: "23 Mei 2026",
  nextInvoiceDate: "20 Mei 2026",
};

export const paymentMethods = [
  {
    id: "bank-transfer",
    label: "Transfer Bank",
    helper: "Konfirmasi 1x24 jam",
    details: ["BCA", "Mandiri", "BNI", "BRI"],
  },
  {
    id: "qris",
    label: "QRIS",
    helper: "Konfirmasi otomatis",
    details: ["QR code ditampilkan setelah submit"],
  },
  {
    id: "credit-card",
    label: "Kartu Kredit / Debit",
    helper: "SSL secured",
    details: ["Nomor kartu, expiry, CVV diproses gateway"],
  },
  {
    id: "gopay",
    label: "GoPay",
    helper: "Konfirmasi otomatis",
    details: ["Gunakan nomor HP terdaftar"],
  },
  {
    id: "ovo",
    label: "OVO",
    helper: "Konfirmasi otomatis",
    details: ["Gunakan nomor HP terdaftar"],
  },
];

export const promoSamples = [
  {
    code: "PROHEMAT",
    description: "Diskon 20% untuk upgrade pertama",
  },
  {
    code: "BISNIS2026",
    description: "Diskon Rp100.000 untuk paket Business",
  },
];

export const paymentHistory = [
  ...mockPayments,
  {
    id: "pay-2",
    tier: "business" as const,
    method: "Transfer Bank",
    amount: 399000,
    status: "pending" as const,
  },
  {
    id: "pay-3",
    tier: "pro" as const,
    method: "OVO",
    amount: 149000,
    status: "failed" as const,
  },
];

export const invoices = [
  {
    id: "INV-KP-240423-001",
    issuedAt: "23 Apr 2026",
    tier: "Pro Bulanan",
    amount: 149000,
    status: "paid",
  },
  {
    id: "INV-KP-240320-014",
    issuedAt: "20 Mar 2026",
    tier: "Pro Bulanan",
    amount: 149000,
    status: "paid",
  },
  {
    id: "INV-KP-240220-009",
    issuedAt: "20 Feb 2026",
    tier: "Pro Bulanan",
    amount: 149000,
    status: "paid",
  },
];
