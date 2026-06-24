import Link from "next/link";
import { getPublicContractors } from "@/features/marketing/marketing-service";
import {
  Container,
  ContractorDirectoryCard,
  DirectoryFilters,
  EmptyState,
  MarketingFooter,
  MarketingNavbar,
  Pagination,
  Section,
} from "./marketing-ui";
import { buttonClasses } from "./button-classes";

type SearchParams = Promise<{
  q?: string;
  city?: string;
  specialty?: string;
  sort?: string;
  page?: string;
}>;

export async function DirectoriPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? "1") || 1;

  const city = params.city ?? "";
  const specialty = params.specialty ?? "";
  const sort = params.sort ?? "Rating Tertinggi";

  const filtered = await getPublicContractors({
    query: params.q,
    city: params.city,
    specialty: params.specialty,
    sort: params.sort,
  });

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <>
      <MarketingNavbar />
      <main>
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Temukan Kontraktor Terpercaya di Kotamu
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
                Semua kontraktor di direktori ini memiliki rekam jejak proyek nyata yang terverifikasi.
              </p>
            </div>
            <div className="mt-10">
              <DirectoryFilters city={city} specialty={specialty} query={params.q ?? ""} sort={sort} />
            </div>
          </Container>
        </Section>

        <Section className="bg-slate-50">
          <Container>
            {paginated.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">{filtered.length} kontraktor ditemukan</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((contractor) => (
                    <ContractorDirectoryCard key={contractor.slug} contractor={contractor} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination page={currentPage} totalPages={totalPages} basePath="/direktori" />
                </div>
              </>
            ) : (
              <EmptyState
                title="Kontraktor tidak ditemukan"
                description="Coba ubah filter atau kata kunci pencarian."
                actionHref="/direktori"
                actionLabel="Reset Filter"
              />
            )}
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="rounded-[28px] bg-slate-100 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-slate-900">Anda seorang kontraktor?</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                Daftarkan usaha Anda dan mulai terima klien dari direktori ini secara gratis.
              </p>
              <Link href="/register" className={buttonClasses("primary", "lg") + " mt-6"}>
                Daftar Sekarang
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <MarketingFooter />
    </>
  );
}
