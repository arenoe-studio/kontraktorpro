import { z } from "zod";

export const addMaterialSchema = z.object({
  projectId: z.string().uuid("Project ID tidak valid."),
  name: z.string().min(1, "Nama material wajib diisi."),
  quantity: z.string().min(1, "Jumlah wajib diisi."),
  supplier: z.string().optional(),
  recordedBy: z.string().optional(),
  date: z.string().min(1, "Tanggal wajib diisi."),
});

export const useMaterialSchema = z.object({
  projectId: z.string().uuid("Project ID tidak valid."),
  wbsItemId: z.string().uuid().optional().or(z.literal("")),
  wbsItemName: z.string().optional(),
  materialName: z.string().min(1, "Nama material wajib diisi."),
  quantity: z.string().min(1, "Jumlah wajib diisi."),
  note: z.string().optional(),
  date: z.string().min(1, "Tanggal wajib diisi."),
});
