import type { Metadata } from "next";
import { contractors, getContractorBySlug } from "../../_components/content";
import { KontraktorProfilePage } from "../../_components/KontraktorProfilePage";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return contractors.map((contractor) => ({ slug: contractor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const contractor = getContractorBySlug(slug);
  if (!contractor) {
    return { title: "Profil kontraktor tidak ditemukan" };
  }
  return {
    title: `${contractor.businessName} — Profil Publik`,
    description: `${contractor.businessName} di ${contractor.city} dengan ${contractor.completedProjects} proyek selesai.`,
  };
}

export default function Page({ params }: { params: Params }) {
  return <KontraktorProfilePage params={params} />;
}
