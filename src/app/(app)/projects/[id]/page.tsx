import { ProjectDetailPage } from "../../_components/ProjectDetailPage";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; modal?: string }>;
}) {
  return <ProjectDetailPage params={params} searchParams={searchParams} />;
}
