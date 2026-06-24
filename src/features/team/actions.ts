"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { addTeamMemberSchema } from "./schemas";
import { addTeamMember } from "./team-service";

export async function addTeamMemberAction(data: z.infer<typeof addTeamMemberSchema>) {
  await requireRole("contractor");
  const parsed = addTeamMemberSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Input tidak valid." };
  }

  try {
    await addTeamMember(parsed.data);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Add team member error:", error);
    return { success: false, error: "Gagal menambahkan anggota tim." };
  }
}
