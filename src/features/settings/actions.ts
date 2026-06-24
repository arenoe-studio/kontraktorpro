"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { updatePassword, updateContractorProfile, type ProfileData } from "./settings-service";

export async function changePasswordAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Semua field harus diisi." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Konfirmasi password tidak cocok." };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "Password baru minimal 8 karakter." };
  }

  const result = await updatePassword(user.id, currentPassword, newPassword);
  return result;
}

export async function saveProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const fullName = formData.get("fullName") as string;
  const businessName = formData.get("businessName") as string;
  const headline = formData.get("headline") as string;
  const about = formData.get("about") as string;

  try {
    await updateContractorProfile(user.id, { fullName, businessName, headline, about });
    revalidatePath("/settings/profile");
    return { success: true, message: "Profil berhasil disimpan." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menyimpan profil." };
  }
}
