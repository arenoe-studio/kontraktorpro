import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { faqItems, featureTableSections } from "../_components/content";
import {
  Badge,
  Container,
  FaqAccordion,
  MarketingFooter,
  MarketingNavbar,
  PlanComparisonBadge,
  PricingToggle,
  Section,
} from "../_components/marketing-ui";
import { buttonClasses } from "../_components/button-classes";

export const metadata: Metadata = {
  title: "Harga KontraktorPro",
  description: "Bandingkan paket Gratis, Pro, dan Bisnis untuk mengelola proyek kontraktor lebih rapi.",
};

function renderCell(value: React.ReactNode) {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-emerald-600" />;
  }

  if (value === false) {
    return <X className="mx-auto h-5 w-5 text-slate-300" />;
  }

  return <span className="text-sm text-slate-700">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <MarketingNavbar />
      <main>
        <Section className="bg-white">
          <Container className="text-center">
            <Badge tone="accent">Mulai gratis tanpa kartu kredit</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Harga yang Tumbuh Bersama Bisnis Anda
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Mulai gratis tanpa kartu kredit. Upgrade kapan saja, cancel kapan saja.
            </p>
            <div className="mt-10">
              <PricingToggle />
            </div>
          </Container>
        </Section>

        <Section className="bg-slate-50">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bandingkan fitur lengkap</h2>
                <p className="mt-2 text-sm text-slate-500">Pilih paket yang paling pas dengan jumlah proyek dan kebutuhan owner update Anda.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <PlanComparisonBadge plan="Gratis" />
                <PlanComparisonBadge plan="Pro" />
                <PlanComparisonBadge plan="Bisnis" />
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="sticky top-16 z-10 grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr] border-b border-slate-200 bg-white">
                <div className="px-4 py-4 text-sm font-semibold text-slate-500">Fitur</div>
                <div className="px-4 py-4 text-center text-sm font-semibold text-slate-700">Gratis</div>
                <div className="px-4 py-4 text-center text-sm font-semibold text-slate-700">Pro</div>
                <div className="px-4 py-4 text-center text-sm font-semibold text-slate-700">Bisnis</div>
              </div>
              {featureTableSections.map((section) => (
                <div key={section.title}>
                  <div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{section.title}</div>
                  {section.rows.map((row) => (
                    <div key={row.feature} className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr] border-t border-slate-100">
                      <div className="px-4 py-4 text-sm text-slate-700">{row.feature}</div>
                      <div className="px-4 py-4 text-center">{renderCell(row.free)}</div>
                      <div className="px-4 py-4 text-center">{renderCell(row.pro)}</div>
                      <div className="px-4 py-4 text-center">{renderCell(row.business)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="bg-white">
          <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pertanyaan yang paling sering ditanyakan</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">
                Jawaban singkat untuk membantu Anda memutuskan paket yang paling pas tanpa ribet.
              </p>
            </div>
            <FaqAccordion items={faqItems} />
          </Container>
        </Section>

        <Section className="bg-slate-800 text-white">
          <Container className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Mulai gratis hari ini.</h2>
            <Link href="/daftar" className={buttonClasses("primary", "xl") + " mt-8"}>
              Daftar Gratis Sekarang
            </Link>
            <p className="mt-4 text-xs text-slate-300">Tidak perlu kartu kredit.</p>
          </Container>
        </Section>
      </main>
      <MarketingFooter />
    </>
  );
}
