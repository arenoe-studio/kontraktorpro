"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { dailyReportSchema } from "./schemas";
import { createDailyReport } from "./reports-service";

export async function createDailyReportAction(data: z.infer<typeof dailyReportSchema>) {
  const user = await requireRole("contractor"); 
  const parsed = dailyReportSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Input tidak valid.",
    };
  }

  try {
    await createDailyReport(parsed.data, user.id);
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Create Report error:", error);
    return { success: false, error: "Gagal membuat laporan harian." };
  }
}
