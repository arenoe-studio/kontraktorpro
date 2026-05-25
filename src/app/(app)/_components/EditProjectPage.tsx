import { notFound } from "next/navigation";
import { getProjectById } from "./mock-data";
import { ProjectFormShell } from "./project-form-shell";

export async function EditProjectPage({
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
