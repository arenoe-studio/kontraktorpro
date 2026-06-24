import "server-only";

import { db } from "@/lib/db/index";
import { users, contractorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { findUserById, updateUserPassword } from "@/lib/db/queries/users";

export type ProfileData = {
  fullName?: string;
  businessName?: string;
  headline?: string;
  about?: string;
};

export async function getContractorProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(contractorProfiles)
    .where(eq(contractorProfiles.userId, userId))
    .limit(1);

  return profile || null;
}

export async function updateContractorProfile(userId: string, data: ProfileData) {
  const profile = await getContractorProfile(userId);
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  // Update user base info if provided
  if (data.fullName || data.businessName) {
    await db
      .update(users)
      .set({
        fullName: data.fullName || user.fullName,
        businessName: data.businessName || user.businessName,
      })
      .where(eq(users.id, userId));
  }

  if (!profile) {
    // Generate slug from business name
    const baseSlug = (data.businessName || user.businessName).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const slug = `${baseSlug}-${randomSuffix}`;

    const [inserted] = await db
      .insert(contractorProfiles)
      .values({
        userId,
        slug,
        headline: data.headline,
        about: data.about,
      })
      .returning();
    return inserted;
  } else {
    const [updated] = await db
      .update(contractorProfiles)
      .set({
        headline: data.headline,
        about: data.about,
      })
      .where(eq(contractorProfiles.userId, userId))
      .returning();
    return updated;
  }
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  // Get full user with hash
  const [userWithHash] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userWithHash) {
    return { success: false, message: "User tidak ditemukan." };
  }

  const passwordMatch = await bcryptjs.compare(currentPassword, userWithHash.passwordHash);
  if (!passwordMatch) {
    return { success: false, message: "Password saat ini salah." };
  }

  const newPasswordHash = await bcryptjs.hash(newPassword, 12);
  await updateUserPassword(userId, newPasswordHash);

  return { success: true };
}
