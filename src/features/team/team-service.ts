import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectMembers } from "@/lib/db/schema";
import { z } from "zod";
import { addTeamMemberSchema } from "./schemas";

export async function addTeamMember(data: z.infer<typeof addTeamMemberSchema>) {
  const [member] = await db
    .insert(projectMembers)
    .values({
      projectId: data.projectId,
      name: data.name,
      role: data.role,
      phone: data.phone || null,
      isActive: true,
    })
    .returning();
  return member;
}

export async function getTeamMembersByProjectId(projectId: string) {
  return await db
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(projectMembers.name);
}
