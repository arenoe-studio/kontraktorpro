import { notFound } from "next/navigation";
import { getProjectById } from "../../../_components/mock-data";
import { ProjectFormShell } from "../../../_components/project-form-shell";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectFormShell mode="edit" project={project} />;
}
