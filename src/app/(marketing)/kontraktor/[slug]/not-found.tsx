import Link from "next/link";
import { Container, MarketingNavbar, MinimalFooter, Section } from "../../_components/marketing-ui";
import { buttonClasses } from "../../_components/button-classes";

export default function ContractorNotFound() {
  return (
    <>
      <MarketingNavbar minimal />
      <main>
        <Section className="bg-white">
          <Container>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-20 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Profil kontraktor tidak ditemukan</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
                Link yang Anda buka sudah tidak tersedia atau profil tersebut belum aktif di direktori.
              </p>
              <Link href="/direktori" className={buttonClasses("outline", "lg") + " mt-6"}>
                Buka Direktori Kontraktor
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <MinimalFooter />
    </>
  );
}
