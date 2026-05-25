import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, PhoneCall, Star } from "lucide-react";
import { getContractorBySlug } from "./content";
import {
  Badge,
  Container,
  MarketingNavbar,
  MinimalFooter,
  Section,
} from "./marketing-ui";
import { buttonClasses } from "./button-classes";

type Params = Promise<{ slug: string }>;

export async function KontraktorProfilePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const contractor = getContractorBySlug(slug);

  if (!contractor) {
    notFound();
  }

  return (
    <>
      <MarketingNavbar minimal />
      <main>
        {!contractor.active ? (
          <Section className="bg-white">
            <Container>
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-20 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Profil ini tidak tersedia saat ini.</h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
                  Kontraktor menonaktifkan profil publiknya untuk sementara. Anda masih dapat mencari kontraktor lain lewat direktori.
                </p>
                <Link href="/direktori" className={buttonClasses("outline", "lg") + " mt-6"}>
                  Buka Direktori Kontraktor
                </Link>
              </div>
            </Container>
          </Section>
        ) : (
          <>
            <Section className="bg-white">
              <Container className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-800">
                      {contractor.businessName
                        .split(" ")
                        .slice(0, 2)
                        .map((item) => item[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{contractor.businessName}</h1>
                        {contractor.packageTier !== "Gratis" ? (
                          <Badge tone={contractor.packageTier === "Bisnis" ? "accent" : "primary"}>{contractor.packageTier}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 text-base text-slate-500">{contractor.ownerName}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {contractor.city}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {contractor.experienceYears} tahun pengalaman
                        </span>
                        <span>{contractor.completedProjects} proyek selesai</span>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {contractor.specialties.map((specialty) => (
                          <Badge key={specialty}>{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Kontak & reputasi</p>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="font-mono text-5xl font-bold text-slate-900">{contractor.rating.toFixed(1)}</span>
                    <div className="pb-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{contractor.reviewCount} ulasan</p>
                    </div>
                  </div>
                  {contractor.phoneVisible ? (
                    <a href={`https://wa.me/${contractor.whatsappNumber.replace(/\D/g, "")}`} className={buttonClasses("primary", "lg") + " mt-6 w-full"}>
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Hubungi Kontraktor
                    </a>
                  ) : (
                    <button type="button" className={buttonClasses("outline", "lg") + " mt-6 w-full"} disabled>
                      Kontak tersedia atas izin kontraktor
                    </button>
                  )}
                  <p className="mt-3 text-xs text-slate-500">Profil terverifikasi oleh KontraktorPro</p>
                </aside>
              </Container>
            </Section>

            {contractor.about ? (
              <Section className="pt-0">
                <Container>
                  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">Tentang</h2>
                    <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{contractor.about}</p>
                  </article>
                </Container>
              </Section>
            ) : null}

            {contractor.portfolio.length > 0 ? (
              <Section className="pt-0">
                <Container>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Portofolio Proyek</h2>
                      <p className="mt-2 text-sm text-slate-500">Contoh proyek selesai yang dipilih langsung oleh kontraktor.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Semua Tipe</Badge>
                      <Badge>Terbaru</Badge>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {contractor.portfolio.map((item) => (
                      <article key={item.title} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                        <div className="flex min-h-48 items-end bg-gradient-to-br from-slate-200 via-slate-100 to-white p-5">
                          <div>
                            <Badge>{item.type}</Badge>
                            <p className="mt-4 text-sm font-medium text-slate-500">{item.coverLabel}</p>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                            <Badge tone="success">Selesai</Badge>
                          </div>
                          <p className="mt-3 text-sm text-slate-500">
                            {item.location} • {item.duration}
                          </p>
                          {item.rating ? (
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                              <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                              <span>{item.rating.toFixed(1)} dari owner</span>
                            </div>
                          ) : null}
                          <p className="mt-4 text-sm leading-7 text-slate-600">{item.summary}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </Container>
              </Section>
            ) : null}

            <Section className="pt-0">
              <Container>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ulasan dari Owner</h2>
                <div className="mt-8 space-y-4">
                  {contractor.reviews.length > 0 ? (
                    contractor.reviews.map((review) => (
                      <article key={`${review.projectName}-${review.ownerMasked}`} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{review.ownerMasked}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {review.projectName} • {review.year}
                            </p>
                          </div>
                          <Badge tone="info">Ulasan terverifikasi</Badge>
                        </div>
                        <div className="mt-4 flex gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < Math.round(review.rating) ? "fill-orange-400 text-orange-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-600">{review.body}</p>
                      </article>
                    ))
                  ) : (
                    <article className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                      Belum ada ulasan.
                    </article>
                  )}
                </div>
              </Container>
            </Section>
          </>
        )}
      </main>
      <MinimalFooter />
    </>
  );
}
