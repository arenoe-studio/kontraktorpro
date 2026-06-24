import { z } from "zod";

export const wbsItemSchema = z.object({
  projectId: z.string().uuid("ID Proyek tidak valid."),
  parentId: z.string().uuid().optional().nullable(),
  name: z.string().min(2, "Nama item minimal 2 karakter.").max(255),
  category: z.string().min(2, "Kategori harus diisi."),
  weight: z.number().min(0).max(100, "Bobot maksimum adalah 100%."),
  volume: z.string().optional().nullable(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(["Belum Dimulai", "Dalam Pengerjaan", "Tertunda", "Selesai"]).default("Belum Dimulai"),
  assignee: z.string().optional().nullable(),
});

export const updateWbsItemSchema = wbsItemSchema.partial().extend({
  id: z.string().uuid("ID WBS tidak valid."),
});
