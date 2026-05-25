import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema";
import type { AuthRole, DbUser } from "@/features/auth/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NewUser = {
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  city: string;
  role?: "contractor" | "moderator" | "super_admin";
  passwordHash: string;
};

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Converts a Drizzle row to DbUser.
 * passwordHash is intentionally excluded — never exposed above the DB layer.
 */
function mapDbRowToDbUser(row: typeof users.$inferSelect): DbUser {
  return {
    id: row.id,
    fullName: row.fullName,
    businessName: row.businessName,
    email: row.email,
    phone: row.phone ?? undefined,
    city: row.city,
    role: row.role as AuthRole,
    suspended: row.suspended,
    firstLogin: row.firstLogin,
  };
}

// ─── Query Functions ──────────────────────────────────────────────────────────

/**
 * Finds a user by email (case-insensitive via normalization).
 * Does NOT return passwordHash.
 */
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const normalized = email.trim().toLowerCase();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (!result[0]) return null;

  return mapDbRowToDbUser(result[0]);
}

/**
 * Finds a user by ID.
 * Does NOT return passwordHash.
 */
export async function findUserById(id: string): Promise<DbUser | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!result[0]) return null;

  return mapDbRowToDbUser(result[0]);
}

/**
 * Finds a user by email and includes passwordHash.
 * Only used for login credential verification — never pass the result up beyond auth-service.
 */
export async function findUserByEmailWithHash(
  email: string
): Promise<(DbUser & { passwordHash: string }) | null> {
  const normalized = email.trim().toLowerCase();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (!result[0]) return null;

  return {
    ...mapDbRowToDbUser(result[0]),
    passwordHash: result[0].passwordHash,
  };
}

/**
 * Inserts a new user and returns the created DbUser (without passwordHash).
 */
export async function createUser(data: NewUser): Promise<DbUser> {
  const result = await db
    .insert(users)
    .values({
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email.trim().toLowerCase(),
      phone: data.phone ?? null,
      city: data.city,
      role: data.role ?? "contractor",
      passwordHash: data.passwordHash,
    })
    .returning();

  if (!result[0]) {
    throw new Error("createUser: INSERT did not return a row.");
  }

  return mapDbRowToDbUser(result[0]);
}

/**
 * Updates the passwordHash for a given user ID.
 */
export async function updateUserPassword(
  userId: string,
  passwordHash: string
): Promise<void> {
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, userId));
}
