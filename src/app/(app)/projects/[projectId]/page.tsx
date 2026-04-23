import { notFound } from "next/navigation";
import {
  getProjectById,
  type ProjectTab,
} from "../../_components/mock-data";
import { ProjectDetailContent } from "../../_components/project-detail-content";

type ProjectPageSearchParams = Promise<{
  tab?: string;
  modal?: string;
}>;

function normalizeTab(tab?: string): ProjectTab {
  if (
    tab === "wbs" ||
    tab === "reports" ||
    tab === "photos" ||
    tab === "team" ||
    tab === "materials" ||
    tab === "settings"
  ) {
    return tab;
  }

  return "wbs";
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: ProjectPageSearchParams;
}) {
  const { projectId } = await params;
  const query = await searchParams;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailContent
      project={project}
      tab={normalizeTab(query.tab)}
      showPdfModal={query.modal === "pdf"}
    />
  );
}
