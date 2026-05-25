import type { Metadata } from "next";
import { getOwnerTrackingByToken } from "../../_components/content";
import { PantauPage } from "../../_components/PantauPage";

type Params = Promise<{ token: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  const record = getOwnerTrackingByToken(token);
  if (!record) {
    return { title: "Link pantau tidak ditemukan", robots: { index: false, follow: false } };
  }
  return {
    title: `${record.projectName || "Link Pantau Owner"} — KontraktorPro`,
    robots: { index: false, follow: false },
  };
}

export default function Page({ params }: { params: Params }) {
  return <PantauPage params={params} />;
}
