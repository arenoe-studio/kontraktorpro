"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { addMaterialSchema, useMaterialSchema } from "./schemas";
import { addMaterialIn, addMaterialUsage } from "./materials-service";

export async function addMaterialInAction(data: z.infer<typeof addMaterialSchema>) {
  const user = await requireRole("contractor");
  data.recordedBy = user.fullName; // automatically record who added it
  
  const parsed = addMaterialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Input tidak valid." };
  }

  try {
    await addMaterialIn(parsed.data);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Add material error:", error);
    return { success: false, error: "Gagal mencatat material masuk." };
  }
}

export async function addMaterialUsageAction(data: z.infer<typeof useMaterialSchema>) {
  await requireRole("contractor");
  const parsed = useMaterialSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: "Input tidak valid." };
  }

  try {
    await addMaterialUsage(parsed.data);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Add material usage error:", error);
    return { success: false, error: "Gagal mencatat pemakaian material." };
  }
}
