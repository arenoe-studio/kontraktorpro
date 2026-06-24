import { z } from "zod";

export const addPhotoSchema = z.object({
  projectId: z.string().uuid("Project ID tidak valid."),
  wbsItemName: z.string().optional(),
  angle: z.string().min(1, "Sudut/Keterangan wajib diisi."),
  url: z.string().min(1, "URL Foto wajib diisi."),
});
