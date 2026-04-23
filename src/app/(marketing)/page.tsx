import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  FileText,
  PlayCircle,
  Star,
} from "lucide-react";
import {
  comparisonRows,
  featureHighlights,
  marketingHighlights,
  painPoints,
  pricingPlans,
  testimonials,
} from "./_components/content";
import {
  Badge,
  Container,
  MarketingFooter,
  MarketingNavbar,
  Section,
} from "./_components/marketing-ui";
import { buttonClasses } from "./_components/button-classes";

export const metadata: Metadata = {
  title: "KontraktorPro — Kelola Proyek Lebih Rapi",
  description: "Platform manajemen proyek untuk kontraktor Indonesia dengan laporan harian, link pantau owner, dan profil publik terverifikasi.",
};

export default function LandingPage() {
  return (
    <>
      <MarketingNavbar />
      <main>
        <Section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] pt-14">
          <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <Badge tone="info">Platform Manajemen Proyek untuk Kontraktor Indonesia</Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Kelola Proyek Lebih Rapi. Bangun Reputasi Otomatis.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  KontraktorPro membantu Anda mencatat progres proyek, mengirim laporan ke owner, dan menunjukkan hasil kerja dalam profil publik yang profesional.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/daftar" className={buttonClasses("primary", "xl")}>
                  Coba Gratis Sekarang
                </Link>
                <Link href="/#fitur" className={buttonClasses("ghost", "lg")}>
                  Lihat cara kerjanya <ArrowDown className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <p className="text-xs text-slate-500">Gratis selamanya untuk 1 proyek aktif. Tidak perlu kartu kredit.</p>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                {marketingHighlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <item.icon className="h-5 w-5 text-slate-700" />
                    <p className="mt-3 text-2xl font-bold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Dashboard Kontraktor</p>
                    <p className="text-xs text-slate-500">Ringkasan proyek aktif dan progres owner</p>
                  </div>
                  <Badge tone="success">Live Update</Badge>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Renovasi Rumah Keluarga Wijaya</p>
                        <p className="text-sm text-slate-500">Bandung Timur • Deadline 16 hari lagi</p>
                      </div>
                      <span className="font-mono text-2xl font-bold text-slate-900">78%</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-slate-200">
                      <div className="h-3 rounded-full bg-slate-800" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Laporan hari ini</p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">4</p>
                      <p className="mt-2 text-sm text-slate-500">Mandor sudah mengisi progres lapangan.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Foto terbaru</p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">23</p>
                      <p className="mt-2 text-sm text-slate-500">Dokumentasi terhubung ke item pekerjaan.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">Siap kirim ke owner</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Badge tone="accent">Laporan PDF Terkirim ✓</Badge>
                      <Badge tone="primary">Link Pantau Real-Time</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-8 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Laporan PDF Terkirim ✓
                </div>
              </div>
              <div className="absolute -right-4 bottom-8 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Progres 78%
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Kalau ini terasa familiar, kamu tidak sendirian.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Banyak kontraktor masih mengandalkan chat, catatan manual, dan galeri foto. Akibatnya, progres proyek sulit dilihat dengan cepat.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {painPoints.map((item) => (
                <article key={item.title} className="rounded-[24px] bg-slate-100 p-6">
                  <item.icon className="h-8 w-8 text-slate-700" />
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
              KontraktorPro merapikan semuanya dalam satu alur kerja yang tetap cocok dipakai di lapangan.
            </p>
          </Container>
        </Section>

        <Section id="fitur" className="bg-white">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Satu platform untuk semua kebutuhan proyek Anda
              </h2>
            </div>
            <div className="mt-12 space-y-8">
              {featureHighlights.map((feature, index) => (
                <div
                  key={feature.title}
                  className="grid gap-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6 lg:grid-cols-2 lg:items-center lg:p-8"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                    <Badge tone="info">{feature.label}</Badge>
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-4 text-base leading-8 text-slate-600">{feature.description}</p>
                    <ul className="mt-5 space-y-3 text-sm text-slate-700">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`rounded-[28px] border border-slate-200 bg-gradient-to-br ${feature.accent} p-6 shadow-sm ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-sm">
                      <feature.icon className="h-10 w-10 text-slate-800" />
                      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Preview</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{feature.visualLabel}</p>
                      <div className="mt-6 space-y-3">
                        <div className="h-3 rounded-full bg-slate-200" />
                        <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="h-24 rounded-2xl bg-slate-100" />
                          <div className="h-24 rounded-2xl bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/harga" className={buttonClasses("outline", "lg")}>
                Lihat Semua Fitur
              </Link>
            </div>
          </Container>
        </Section>

        <Section className="bg-slate-800 text-white">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Apa bedanya sama WhatsApp dan Excel?
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">Tidak harus tinggalkan WhatsApp. KontraktorPro justru merapikan apa yang selama ini tercecer.</p>
            </div>
            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-slate-900/60 text-sm font-semibold">
                <div className="px-4 py-4 text-slate-300">Aspek</div>
                <div className="px-4 py-4 text-slate-300">WhatsApp + Excel</div>
                <div className="bg-orange-500/20 px-4 py-4 text-orange-100">KontraktorPro</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.aspect} className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-white/10 text-sm">
                  <div className="px-4 py-4 text-white">{row.aspect}</div>
                  <div className="px-4 py-4 text-slate-300">{row.legacy}</div>
                  <div className="bg-orange-500/10 px-4 py-4 text-orange-50">{row.modern}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section id="tentang">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Dipercaya kontraktor yang butuh alat kerja nyata</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-800">
                      {testimonial.name
                        .split(" ")
                        .map((item) => item[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">“{testimonial.quote}”</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">Dipercaya 500+ kontraktor di 12 kota</p>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Mulai gratis. Upgrade kalau sudah yakin.</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`rounded-[24px] border bg-white p-6 shadow-sm ${plan.featured ? "border-orange-500 shadow-lg" : "border-slate-200"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                    </div>
                    {plan.featured ? <Badge tone="accent">Paling Populer</Badge> : null}
                  </div>
                  <p className="mt-6 font-mono text-4xl font-bold text-slate-900">{plan.monthlyPrice}</p>
                  <p className="text-sm text-slate-500">{plan.name === "Gratis" ? "/ selamanya" : "/ bulan"}</p>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    {plan.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/daftar" className={buttonClasses(plan.featured ? "primary" : "outline", "lg") + " mt-6 w-full"}>
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/harga" className="inline-flex items-center text-sm font-semibold text-slate-800 hover:text-orange-600">
                Bandingkan semua fitur <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </Container>
        </Section>

        <Section className="bg-slate-800 text-white">
          <Container className="text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Mulai kelola proyek pertama Anda hari ini.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Setup 3 menit. Tidak perlu pelatihan. Gratis untuk memulai.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <Link href="/daftar" className={buttonClasses("primary", "xl")}>
                Daftar Gratis Sekarang
              </Link>
              <Link href="/masuk" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                Sudah punya akun? Masuk di sini.
                <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <MarketingFooter />
    </>
  );
}
