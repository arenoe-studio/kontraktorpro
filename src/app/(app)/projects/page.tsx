import { requireRole } from "@/lib/auth/session";
import { getProjectCounts, getProjectsList } from "@/features/projects/projects-service";
import { ProjectsPage } from "../_components/ProjectsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string }>;
}) {
  const user = await requireRole("contractor");
  const query = await searchParams;
  
  const selectedStatus = query.status || "semua";
  const searchQuery = query.q?.trim().toLowerCase() || "";
  const sortQuery = query.sort || "latest";

  const counts = await getProjectCounts(user.id);
  const projects = await getProjectsList(user.id, {
    status: selectedStatus,
    q: searchQuery,
    sort: sortQuery,
  });

  return (
    <ProjectsPage
      searchParams={query}
      projects={projects}
      counts={counts}
    />
  );
}
