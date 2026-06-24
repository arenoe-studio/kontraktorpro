import { z } from "zod";

export const addTeamMemberSchema = z.object({
  projectId: z.string().uuid("Project ID tidak valid."),
  name: z.string().min(1, "Nama wajib diisi."),
  role: z.string().min(1, "Peran wajib diisi."),
  phone: z.string().optional(),
});
