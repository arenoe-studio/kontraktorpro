import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { wbsItems, projects } from "@/lib/db/schema";
import { z } from "zod";
import { wbsItemSchema, updateWbsItemSchema } from "./schemas";

export async function getWbsByProjectId(projectId: string) {
  return await db.query.wbsItems.findMany({
    where: eq(wbsItems.projectId, projectId),
    orderBy: (wbsItems, { asc }) => [asc(wbsItems.createdAt)],
  });
}

async function recalculateProjectProgress(projectId: string) {
  const items = await db.query.wbsItems.findMany({
    where: eq(wbsItems.projectId, projectId),
  });

  if (items.length === 0) return 0;

  let totalWeight = 0;
  let totalProgressWeighted = 0;

  for (const item of items) {
    totalWeight += item.weight;
    totalProgressWeighted += (item.progress * item.weight) / 100;
  }

  // If total weight is > 0, project progress is totalProgressWeighted / totalWeight * 100.
  // Actually, standard WBS expects sum of weights = 100%. So progress is just sum(progress * weight / 100)
  const projectProgress = totalWeight === 100 
    ? Math.round(totalProgressWeighted)
    : Math.round((totalProgressWeighted / (totalWeight || 1)) * 100);

  await db.update(projects)
    .set({ progress: projectProgress })
    .where(eq(projects.id, projectId));

  return projectProgress;
}

export async function createWbsItem(data: z.infer<typeof wbsItemSchema>) {
  const [newItem] = await db.insert(wbsItems).values({
    projectId: data.projectId,
    parentId: data.parentId,
    name: data.name,
    category: data.category,
    weight: data.weight,
    volume: data.volume,
    progress: data.progress,
    status: data.status,
    assignee: data.assignee,
  }).returning();

  await recalculateProjectProgress(data.projectId);

  return newItem;
}

export async function updateWbsItem(data: z.infer<typeof updateWbsItemSchema>) {
  const [updatedItem] = await db.update(wbsItems)
    .set({
      parentId: data.parentId,
      name: data.name,
      category: data.category,
      weight: data.weight,
      volume: data.volume,
      progress: data.progress,
      status: data.status,
      assignee: data.assignee,
      updatedAt: new Date(),
    })
    .where(eq(wbsItems.id, data.id))
    .returning();

  if (updatedItem) {
    await recalculateProjectProgress(updatedItem.projectId);
  }

  return updatedItem;
}

export async function deleteWbsItem(id: string, projectId: string) {
  await db.delete(wbsItems).where(eq(wbsItems.id, id));
  await recalculateProjectProgress(projectId);
}

/**
 * Delete ALL WBS items for a project and reset project progress to 0.
 * Destructive — caller must confirm before invoking.
 */
export async function clearWbsItemsByProjectId(projectId: string) {
  const existing = await db.query.wbsItems.findMany({
    where: eq(wbsItems.projectId, projectId),
    columns: { id: true },
  });

  if (existing.length > 0) {
    await db
      .delete(wbsItems)
      .where(
        inArray(
          wbsItems.id,
          existing.map((i) => i.id),
        ),
      );
  }

  // Reset project progress to 0 since WBS is now empty
  await db
    .update(projects)
    .set({ progress: 0 })
    .where(eq(projects.id, projectId));
}

/**
 * Bulk-insert multiple WBS items then recalculate project progress.
 * Used by the "Apply Template" action.
 */
export async function bulkCreateWbsItems(
  projectId: string,
  items: Array<{
    name: string;
    category: string;
    weight: number;
    volume: string | null;
  }>,
) {
  if (items.length === 0) return;

  await db.insert(wbsItems).values(
    items.map((item) => ({
      projectId,
      parentId: null,
      name: item.name,
      category: item.category,
      weight: item.weight,
      volume: item.volume,
      progress: 0,
      status: "Belum Dimulai" as const,
      assignee: null,
    })),
  );

  await recalculateProjectProgress(projectId);
}
