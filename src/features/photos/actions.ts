"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { addPhotoSchema } from "./schemas";
import { addPhoto } from "./photos-service";

export async function addPhotoAction(data: z.infer<typeof addPhotoSchema>) {
  const user = await requireRole("contractor");
  const parsed = addPhotoSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: "Input tidak valid." };
  }

  try {
    await addPhoto(parsed.data, user.fullName);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Add photo error:", error);
    return { success: false, error: "Gagal mengunggah foto." };
  }
}
