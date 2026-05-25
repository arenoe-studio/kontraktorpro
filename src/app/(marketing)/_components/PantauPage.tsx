import Link from "next/link";
import { notFound } from "next/navigation";
import { getOwnerTrackingByToken } from "./content";
import { Badge, Container, MinimalFooter, Section } from "./marketing-ui";

type Params = Promise<{ token: string }>;

function statusTone(status: "Sedang Berjalan" | "Selesai" | "Ditunda") {
  if (status === "Sedang Berjalan") return "success";
  if (status === "Selesai") return "neutral";
  return "warning";
}

function progressTone(value: number) {
  if (value <= 30) return "bg-red-500";
  if (value <= 60) return "bg-amber-500";
  if (value <= 90) return "bg-slate-800";
  return "bg-emerald-500";
}

function itemTone(status: "Selesai" | "Berjalan" | "Belum Mulai") {
  if (status === "Selesai") return "success";
  if (status === "Berjalan") return "info";
  return "neutral";
}

export async function PantauPage({
  params,
}: {
  params: Params;
}) {
  const { token } = await params;
  const record = getOwnerTrackingByToken(token);

  if (!record) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        {!record.active ? (
          <Section className="bg-white">
            <Container>
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-20 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Link pantau ini tidak aktif.</h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
                  Hubungi kontraktor Anda untuk informasi lebih lanjut.
                </p>
              </div>
            </Container>
          </Section>
        ) : (
          <>
            <Section className="bg-white">
              <Container>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{record.projectName}</h1>
                      <p className="mt-3 text-base text-slate-500">{record.location}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <Badge tone={statusTone(record.status) as "success" | "neutral" | "warning"}>{record.status}</Badge>
                        <Link href={`/kontraktor/${record.contractorSlug}`} className="font-semibold text-slate-800 underline-offset-4 hover:underline">
                          {record.contractorBusiness}
                        </Link>
                        <span>oleh {record.contractorName}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Diperbarui {record.updatedAt}</p>
                  </div>
                </div>
              </Container>
            </Section>

            <Section className="pt-0">
              <Container>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Progres keseluruhan</p>
                  <p className="mt-4 font-mono text-6xl font-bold text-slate-900">{record.overallProgress}%</p>
                  <div className="mx-auto mt-6 h-4 max-w-3xl rounded-full bg-slate-200">
                    <div className={`h-4 rounded-full ${progressTone(record.overallProgress)}`} style={{ width: `${record.overallProgress}%` }} />
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-emerald-50 p-5">
                      <p className="text-sm text-emerald-700">Selesai</p>
                      <p className="mt-3 font-mono text-3xl font-bold text-emerald-800">{record.stats.completed}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-5">
                      <p className="text-sm text-slate-700">Dalam Pengerjaan</p>
                      <p className="mt-3 font-mono text-3xl font-bold text-slate-900">{record.stats.inProgress}</p>
                    </div>
                    <div className="rounded-2xl bg-neutral-100 p-5">
                      <p className="text-sm text-neutral-700">Belum Dimulai</p>
                      <p className="mt-3 font-mono text-3xl font-bold text-neutral-900">{record.stats.notStarted}</p>
                    </div>
                  </div>
                </div>
              </Container>
            </Section>

            {record.visibleItems.length > 0 ? (
              <Section className="pt-0">
                <Container>
                  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">Pekerjaan</h2>
                    <div className="mt-8 space-y-4">
                      {record.visibleItems.map((item) => (
                        <div key={item.name} className="rounded-2xl border border-slate-200 p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <div className="mt-2 flex items-center gap-3">
                                <Badge tone={itemTone(item.status) as "success" | "info" | "neutral"}>{item.status}</Badge>
                                <span className="font-mono text-sm text-slate-500">{item.progress}%</span>
                              </div>
                            </div>
                            <div className="h-3 w-full rounded-full bg-slate-200 sm:max-w-md">
                              <div className={`h-3 rounded-full ${progressTone(item.progress)}`} style={{ width: `${item.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Container>
              </Section>
            ) : null}

            {record.photos.length > 0 ? (
              <Section className="pt-0">
                <Container>
                  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">Dokumentasi Terbaru</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {record.photos.map((photo) => (
                        <article key={`${photo.label}-${photo.date}`} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                          <div className="flex min-h-44 items-end bg-gradient-to-br from-slate-200 to-white p-4">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">Watermark {record.contractorBusiness}</span>
                          </div>
                          <div className="p-5">
                            <p className="font-semibold text-slate-900">{photo.label}</p>
                            <p className="mt-2 text-sm text-slate-500">{photo.date}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">Tanggal foto terakhir diupload: {record.photos[0]?.date}</p>
                  </div>
                </Container>
              </Section>
            ) : null}

            <Section className="pt-0">
              <Container>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-900">Update Terakhir</h2>
                  {record.updates.length > 0 ? (
                    <div className="mt-8 space-y-4">
                      {record.updates.map((update) => (
                        <article key={`${update.date}-${update.title}`} className="rounded-2xl border border-slate-200 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{update.date}</p>
                          <p className="mt-3 font-semibold text-slate-900">{update.title}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{update.note}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-base leading-8 text-slate-500">Kontraktor belum menambahkan data proyek.</p>
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
