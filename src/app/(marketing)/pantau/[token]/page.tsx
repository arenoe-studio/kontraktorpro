import type { Metadata } from "next";
import { getOwnerTrackingData } from "@/features/marketing/tracking-service";
import { PantauPage } from "../../_components/PantauPage";

type Params = Promise<{ token: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  
  // Basic validation that token is a valid UUID to prevent query errors
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  if (!isUuid) {
    return { title: "Link pantau tidak valid", robots: { index: false, follow: false } };
  }

  const record = await getOwnerTrackingData(token);
  if (!record || !record.active) {
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
