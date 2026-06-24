import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/projects-service";
import { requireRole } from "@/lib/auth/session";
import { ProjectFormShell } from "./project-form-shell";

export async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("contractor");
  const { id } = await params;
  
  const project = await getProjectById(id, user.id);

  if (!project) {
    notFound();
  }

  const projectData = {
    id: project.id,
    name: project.name,
    type: project.type,
    owner: project.ownerName,
    location: project.location,
    status: project.status,
    targetDate: project.targetDate || undefined,
    contractValue: project.contractValue,
  };

  return <ProjectFormShell mode="edit" project={projectData} />;
}
