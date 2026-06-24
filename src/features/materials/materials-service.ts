import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { materials, materialUsages } from "@/lib/db/schema";
import { z } from "zod";
import { addMaterialSchema, useMaterialSchema } from "./schemas";

export async function addMaterialIn(data: z.infer<typeof addMaterialSchema>) {
  const [material] = await db
    .insert(materials)
    .values({
      projectId: data.projectId,
      name: data.name,
      quantity: data.quantity,
      supplier: data.supplier || null,
      recordedBy: data.recordedBy || null,
      date: data.date,
    })
    .returning();
  return material;
}

export async function addMaterialUsage(data: z.infer<typeof useMaterialSchema>) {
  const [usage] = await db
    .insert(materialUsages)
    .values({
      projectId: data.projectId,
      wbsItemId: data.wbsItemId || null,
      wbsItemName: data.wbsItemName || null,
      materialName: data.materialName,
      quantity: data.quantity,
      note: data.note || null,
      date: data.date,
    })
    .returning();
  return usage;
}

export async function getMaterialsInByProjectId(projectId: string) {
  return await db
    .select()
    .from(materials)
    .where(eq(materials.projectId, projectId))
    .orderBy(materials.date);
}

export async function getMaterialUsagesByProjectId(projectId: string) {
  return await db
    .select()
    .from(materialUsages)
    .where(eq(materialUsages.projectId, projectId))
    .orderBy(materialUsages.date);
}
