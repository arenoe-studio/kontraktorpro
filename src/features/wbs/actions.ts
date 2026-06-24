"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { wbsItemSchema, updateWbsItemSchema } from "./schemas";
import {
  createWbsItem,
  updateWbsItem,
  deleteWbsItem,
  clearWbsItemsByProjectId,
  bulkCreateWbsItems,
} from "./wbs-service";
import { getWbsTemplateByKey } from "./wbs-templates";

export async function createWbsItemAction(data: z.infer<typeof wbsItemSchema>) {
  await requireRole("contractor"); // ensure authenticated & authorized
  const parsed = wbsItemSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Input tidak valid.",
    };
  }

  try {
    await createWbsItem(parsed.data);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Create WBS error:", error);
    return { success: false, error: "Gagal membuat item WBS." };
  }
}

export async function updateWbsItemAction(data: z.infer<typeof updateWbsItemSchema>) {
  await requireRole("contractor");
  const parsed = updateWbsItemSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Input tidak valid.",
    };
  }

  try {
    const updated = await updateWbsItem(parsed.data);
    if (updated) {
      revalidatePath(`/projects/${updated.projectId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Update WBS error:", error);
    return { success: false, error: "Gagal memperbarui item WBS." };
  }
}

export async function deleteWbsItemAction(id: string, projectId: string) {
  await requireRole("contractor");
  try {
    await deleteWbsItem(id, projectId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete WBS error:", error);
    return { success: false, error: "Gagal menghapus item WBS." };
  }
}

/**
 * Apply a pre-defined WBS template to a project.
 *
 * @param projectId - Target project UUID
 * @param templateKey - Key from WBS_TEMPLATES (e.g. "rumah-tinggal")
 * @param replace - If true, clear all existing WBS items first (replace mode).
 *                  If false, append template items to existing WBS (merge mode).
 */
export async function applyWbsTemplateAction(
  projectId: string,
  templateKey: string,
  replace: boolean,
) {
  await requireRole("contractor");

  // Validate input
  const projectIdParsed = z.string().uuid().safeParse(projectId);
  if (!projectIdParsed.success) {
    return { success: false, error: "ID Proyek tidak valid." };
  }

  const template = getWbsTemplateByKey(templateKey);
  if (!template) {
    return { success: false, error: "Template tidak ditemukan." };
  }

  try {
    if (replace) {
      await clearWbsItemsByProjectId(projectId);
    }

    await bulkCreateWbsItems(projectId, template.items);

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Apply WBS template error:", error);
    return { success: false, error: "Gagal menerapkan template WBS." };
  }
}

