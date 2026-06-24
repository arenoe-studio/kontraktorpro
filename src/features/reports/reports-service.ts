import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyReports } from "@/lib/db/schema";
import { z } from "zod";
import { dailyReportSchema } from "./schemas";

export async function getReportsByProjectId(projectId: string) {
  return await db.query.dailyReports.findMany({
    where: eq(dailyReports.projectId, projectId),
    orderBy: [desc(dailyReports.reportDate)],
  });
}

export async function createDailyReport(data: z.infer<typeof dailyReportSchema>, authorId: string) {
  const [newReport] = await db.insert(dailyReports).values({
    projectId: data.projectId,
    authorId: authorId,
    status: data.status,
    weather: data.weather,
    hasIssue: data.hasIssue,
    updatedItemsCount: data.updatedItemsCount,
    photosCount: data.photosCount,
    notes: data.notes,
    reportDate: data.reportDate,
  }).returning();

  return newReport;
}
