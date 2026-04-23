import { notFound } from "next/navigation";
import { getProjectById } from "../../../_components/mock-data";
import { ProjectFormShell } from "../../../_components/project-form-shell";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return <ProjectFormShell mode="edit" project={project} />;
}
