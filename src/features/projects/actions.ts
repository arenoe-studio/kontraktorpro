"use server";

import { requireRole } from "@/lib/auth/session";
import { projectSchema } from "./schemas";
import { createProject, updateProject, deleteProject } from "./projects-service";

export type ProjectActionResult = 
  | { success: true; projectId: string }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

function flattenFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      messages?.[0] ?? "",
    ])
  );
}

export async function createProjectAction(
  input: unknown
): Promise<ProjectActionResult> {
  const user = await requireRole("contractor");

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    const newProject = await createProject(user.id, parsed.data);
    return { success: true, projectId: newProject.id };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, message: "Gagal membuat proyek. Silakan coba lagi." };
  }
}

export async function updateProjectAction(
  projectId: string,
  input: unknown
): Promise<ProjectActionResult> {
  const user = await requireRole("contractor");

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    const updated = await updateProject(projectId, user.id, parsed.data);
    if (!updated) {
      return { success: false, message: "Proyek tidak ditemukan atau Anda tidak memiliki akses." };
    }
    return { success: true, projectId: updated.id };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, message: "Gagal memperbarui proyek. Silakan coba lagi." };
  }
}

export async function deleteProjectAction(projectId: string): Promise<{ success: boolean; message?: string }> {
  const user = await requireRole("contractor");

  try {
    await deleteProject(projectId, user.id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete project:", error);
    return { success: false, message: error.message || "Gagal menghapus proyek." };
  }
}
