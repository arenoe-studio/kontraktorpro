import { z } from "zod";

export const dailyReportSchema = z.object({
  projectId: z.string().uuid("ID Proyek tidak valid."),
  status: z.enum(["draft", "submitted", "flagged"]).default("submitted"),
  weather: z.string().optional().nullable(),
  hasIssue: z.boolean().default(false),
  updatedItemsCount: z.number().default(0),
  photosCount: z.number().default(0),
  notes: z.string().optional().nullable(),
  reportDate: z.string(), // YYYY-MM-DD format
});
