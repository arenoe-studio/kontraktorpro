import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Nama proyek minimal 3 karakter.").max(180, "Nama proyek terlalu panjang."),
  type: z.string().min(1, "Tipe proyek harus dipilih."),
  ownerName: z.string().min(2, "Nama owner minimal 2 karakter.").max(180, "Nama owner terlalu panjang."),
  location: z.string().min(5, "Alamat minimal 5 karakter.").max(180, "Alamat terlalu panjang."),
  contractValue: z.number().min(0, "Nilai kontrak tidak boleh negatif."),
  targetDate: z.string().optional().or(z.literal("")),
});
