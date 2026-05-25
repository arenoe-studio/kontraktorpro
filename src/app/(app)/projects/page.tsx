import { ProjectsPage } from "../_components/ProjectsPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string }>;
}) {
  return <ProjectsPage searchParams={searchParams} />;
}
