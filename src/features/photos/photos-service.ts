import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectPhotos } from "@/lib/db/schema";
import { z } from "zod";
import { addPhotoSchema } from "./schemas";

export async function addPhoto(data: z.infer<typeof addPhotoSchema>, uploaderName: string) {
  const [photo] = await db
    .insert(projectPhotos)
    .values({
      projectId: data.projectId,
      wbsItemName: data.wbsItemName || null,
      angle: data.angle,
      url: data.url,
      uploaderName,
    })
    .returning();
  return photo;
}

export async function getPhotosByProjectId(projectId: string) {
  return await db
    .select()
    .from(projectPhotos)
    .where(eq(projectPhotos.projectId, projectId))
    .orderBy(projectPhotos.createdAt);
}
