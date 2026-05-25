import "server-only";

import { db } from "@/lib/db/index";
import { otpChallenges, users } from "@/lib/db/schema";
import { eq, and, lt, gt } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { emailOtpService } from "@/lib/services/email-otp-service";
import type {
  DbUser,
  OtpChallengeSnapshot,
  AuthIntent,
  LoginSuccess,
  ActionResult,
} from "./types";
import {
  findUserByEmail,
  findUserById,
  findUserByEmailWithHash,
  createUser,
  updateUserPassword,
  type NewUser,
} from "@/lib/db/queries/users";

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_EXPIRY_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const RESEND_LIMIT = 3;
const ATTEMPT_LIMIT = 5;
const LOCK_DURATION_MS = 10 * 60 * 1000;
const BCRYPT_COST_PASSWORD = 12;
const BCRYPT_COST_OTP = 10;

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local[0]}***@${domain}`;
}

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function mapChallengeToSnapshot(
  challenge: typeof otpChallenges.$inferSelect
): OtpChallengeSnapshot {
  const now = Date.now();
  const expiresIn = Math.max(
    0,
    Math.floor((challenge.expiresAt.getTime() - now) / 1000)
  );
  const resendAvailableIn = Math.max(
    0,
    Math.floor((challenge.resendAvailableAt.getTime() - now) / 1000)
  );
  const lockRemainingIn = challenge.lockedUntil
    ? Math.max(
        0,
        Math.floor((challenge.lockedUntil.getTime() - now) / 1000)
      )
    : 0;

  return {
    id: challenge.id,
    flow: challenge.flow as AuthIntent,
    maskedEmail: maskEmail(challenge.email),
    resendAvailableIn,
    resendsRemaining: Math.max(0, RESEND_LIMIT - challenge.resendCount),
    attemptsRemaining: challenge.attemptsRemaining,
    expiresIn,
    isLocked: challenge.lockedUntil
      ? challenge.lockedUntil.getTime() > now
      : false,
    lockRemainingIn,
    isVerified: challenge.isVerified,
  };
}

// ─── Exported Functions ───────────────────────────────────────────────────────

type PendingRegistration = {
  fullName: string;
  businessName: string;
  email: string;
  city: string;
  password: string;
};

export async function startRegistration(
  input: PendingRegistration
): Promise<
  | { success: true; challenge: OtpChallengeSnapshot }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      message?: string;
    }
> {
  try {
    const { fullName, businessName, email, city, password } = input;
    const normalizedEmail = normalizeEmail(email);

    // 1. Check if email already registered
    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return {
        success: false,
        fieldErrors: { email: "Email sudah terdaftar. Silakan masuk." },
      };
    }

    // 2. Generate OTP and hash both code and password in parallel
    const code = generateOtpCode();
    const [codeHash, passwordHash] = await Promise.all([
      bcryptjs.hash(code, BCRYPT_COST_OTP),
      bcryptjs.hash(password, BCRYPT_COST_PASSWORD),
    ]);

    // 3. Serialize registration metadata (stores passwordHash, not plaintext)
    const metadata = JSON.stringify({
      fullName,
      businessName,
      email: normalizedEmail,
      city,
      passwordHash,
    });

    // 4. INSERT otp_challenges
    const now = Date.now();
    const inserted = await db
      .insert(otpChallenges)
      .values({
        flow: "register",
        email: normalizedEmail,
        codeHash,
        expiresAt: new Date(now + OTP_EXPIRY_MS),
        resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
        metadata,
      })
      .returning();

    const record = inserted[0];
    if (!record) {
      return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
    }

    // 5. Send OTP email — if it fails, delete the challenge and return error
    const sendResult = await emailOtpService.sendOtp(normalizedEmail, code);
    if (!sendResult.success) {
      await db.delete(otpChallenges).where(eq(otpChallenges.id, record.id));
      return { success: false, message: "Gagal mengirim email OTP. Coba lagi." };
    }

    return { success: true, challenge: mapChallengeToSnapshot(record) };
  } catch (error) {
    console.error("[auth-service] startRegistration error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function loginWithPassword(
  email: string,
  password: string
): Promise<
  | { success: true; user: DbUser; result: LoginSuccess }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      message?: string;
    }
> {
  try {
    const normalizedEmail = normalizeEmail(email);

    // 1. Find user with passwordHash for comparison
    const userWithHash = await findUserByEmailWithHash(normalizedEmail);
    if (!userWithHash) {
      return {
        success: false,
        fieldErrors: { email: "Email tidak ditemukan. Daftar dulu?" },
      };
    }

    // 2. Check suspended
    if (userWithHash.suspended) {
      return {
        success: false,
        message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro.",
      };
    }

    // 3. Verify password
    const passwordMatch = await bcryptjs.compare(password, userWithHash.passwordHash);
    if (!passwordMatch) {
      return {
        success: false,
        fieldErrors: { password: "Password salah." },
      };
    }

    // 4. Build DbUser (without passwordHash) and determine redirect
    const { passwordHash: _omit, ...user } = userWithHash;
    const redirectTo = user.role === "contractor" ? "/dashboard" : "/admin";

    return {
      success: true,
      user,
      result: { redirectTo, firstLogin: user.firstLogin },
    };
  } catch (error) {
    console.error("[auth-service] loginWithPassword error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function startLoginOtp(
  email: string
): Promise<
  | { success: true; challenge: OtpChallengeSnapshot }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      message?: string;
    }
> {
  try {
    const normalizedEmail = normalizeEmail(email);

    // 1. Verify user exists
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return {
        success: false,
        fieldErrors: { email: "Email tidak ditemukan. Daftar dulu?" },
      };
    }

    // 2. Check suspended
    if (user.suspended) {
      return {
        success: false,
        message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro.",
      };
    }

    // 3. Generate OTP and hash
    const code = generateOtpCode();
    const codeHash = await bcryptjs.hash(code, BCRYPT_COST_OTP);

    // 4. INSERT otp_challenges
    const now = Date.now();
    const inserted = await db
      .insert(otpChallenges)
      .values({
        flow: "login",
        email: normalizedEmail,
        codeHash,
        expiresAt: new Date(now + OTP_EXPIRY_MS),
        resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
      })
      .returning();

    const record = inserted[0];
    if (!record) {
      return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
    }

    // 5. Send OTP email — if it fails, delete the challenge and return error
    const sendResult = await emailOtpService.sendOtp(normalizedEmail, code);
    if (!sendResult.success) {
      await db.delete(otpChallenges).where(eq(otpChallenges.id, record.id));
      return { success: false, message: "Gagal mengirim email OTP. Coba lagi." };
    }

    return { success: true, challenge: mapChallengeToSnapshot(record) };
  } catch (error) {
    console.error("[auth-service] startLoginOtp error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function startPasswordReset(
  email: string
): Promise<
  | { success: true; challenge: OtpChallengeSnapshot; email: string }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      message?: string;
    }
> {
  try {
    // 1. Normalize email
    const normalizedEmail = normalizeEmail(email);

    // 2. Find user by email
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return {
        success: false,
        fieldErrors: { email: "Email ini tidak terdaftar." },
      };
    }

    // 3. Check suspended
    if (user.suspended) {
      return {
        success: false,
        message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro.",
      };
    }

    // 4. Generate OTP code and hash it
    const code = generateOtpCode();
    const codeHash = await bcryptjs.hash(code, BCRYPT_COST_OTP);

    // 5. INSERT otp_challenges (flow: "forgot-password")
    const now = Date.now();
    const inserted = await db
      .insert(otpChallenges)
      .values({
        flow: "forgot-password",
        email: normalizedEmail,
        codeHash,
        expiresAt: new Date(now + OTP_EXPIRY_MS),
        resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
      })
      .returning();

    const record = inserted[0];
    if (!record) {
      return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
    }

    // 6. Send OTP email — if fails, DELETE challenge and return error
    const sendResult = await emailOtpService.sendOtp(normalizedEmail, code);
    if (!sendResult.success) {
      await db.delete(otpChallenges).where(eq(otpChallenges.id, record.id));
      return { success: false, message: "Gagal mengirim email OTP. Coba lagi." };
    }

    // 7. Return success
    return {
      success: true,
      challenge: mapChallengeToSnapshot(record),
      email: normalizedEmail,
    };
  } catch (error) {
    console.error("[auth-service] startPasswordReset error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function verifyChallengeCode(
  challengeId: string,
  code: string
): Promise<
  | { success: true; challenge: OtpChallengeSnapshot; user: DbUser | null }
  | { success: false; message: string; challenge?: OtpChallengeSnapshot }
> {
  try {
    // 1. SELECT challenge by id
    const rows = await db
      .select()
      .from(otpChallenges)
      .where(eq(otpChallenges.id, challengeId))
      .limit(1);

    const challenge = rows[0];

    // 2. Not found
    if (!challenge) {
      return {
        success: false,
        message: "Sesi OTP tidak ditemukan. Silakan ulangi dari login atau daftar.",
      };
    }

    const now = new Date();

    // 3. Already verified or expired
    if (challenge.isVerified || challenge.expiresAt < now) {
      return {
        success: false,
        message: "Sesi OTP tidak valid atau sudah kedaluwarsa.",
        challenge: mapChallengeToSnapshot(challenge),
      };
    }

    // 4. Locked
    if (challenge.lockedUntil && challenge.lockedUntil > now) {
      const lockRemainingMs = challenge.lockedUntil.getTime() - now.getTime();
      const lockRemainingMinutes = Math.ceil(lockRemainingMs / 60000);
      return {
        success: false,
        message: `Terlalu banyak percobaan. Coba lagi dalam ${lockRemainingMinutes} menit.`,
        challenge: mapChallengeToSnapshot(challenge),
      };
    }

    // 5. Verify code
    const codeMatch = await bcryptjs.compare(code, challenge.codeHash);

    if (!codeMatch) {
      const newAttempts = challenge.attemptsRemaining - 1;

      if (newAttempts <= 0) {
        // Lock the challenge
        const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS);
        const updated = await db
          .update(otpChallenges)
          .set({ attemptsRemaining: 0, lockedUntil })
          .where(eq(otpChallenges.id, challengeId))
          .returning();

        const updatedChallenge = updated[0];
        return {
          success: false,
          message: "Terlalu banyak percobaan. Coba lagi dalam 10 menit.",
          challenge: updatedChallenge
            ? mapChallengeToSnapshot(updatedChallenge)
            : mapChallengeToSnapshot({ ...challenge, attemptsRemaining: 0, lockedUntil }),
        };
      } else {
        // Decrement attempts
        const updated = await db
          .update(otpChallenges)
          .set({ attemptsRemaining: newAttempts })
          .where(eq(otpChallenges.id, challengeId))
          .returning();

        const updatedChallenge = updated[0];
        return {
          success: false,
          message: `Kode salah. Sisa ${newAttempts} percobaan.`,
          challenge: updatedChallenge
            ? mapChallengeToSnapshot(updatedChallenge)
            : mapChallengeToSnapshot({ ...challenge, attemptsRemaining: newAttempts }),
        };
      }
    }

    // 6. Code is correct — handle by flow
    if (challenge.flow === "register") {
      // Parse metadata
      if (!challenge.metadata) {
        return {
          success: false,
          message: "Terjadi kesalahan sistem. Coba lagi.",
        };
      }

      const meta = JSON.parse(challenge.metadata) as {
        fullName: string;
        businessName: string;
        email: string;
        city: string;
        passwordHash: string;
      };

      // Transaction: INSERT user + DELETE challenge
      const newUser = await db.transaction(async (tx) => {
        const [inserted] = await tx
          .insert(users)
          .values({
            fullName: meta.fullName,
            businessName: meta.businessName,
            email: meta.email,
            city: meta.city,
            passwordHash: meta.passwordHash,
            role: "contractor",
          })
          .returning();

        await tx
          .delete(otpChallenges)
          .where(eq(otpChallenges.id, challengeId));

        if (!inserted) {
          throw new Error("INSERT users did not return a row.");
        }

        // Map inline (mapDbRowToDbUser is private to users.ts)
        const dbUser: DbUser = {
          id: inserted.id,
          fullName: inserted.fullName,
          businessName: inserted.businessName,
          email: inserted.email,
          phone: inserted.phone ?? undefined,
          city: inserted.city,
          role: inserted.role as import("./types").AuthRole,
          suspended: inserted.suspended,
          firstLogin: inserted.firstLogin,
        };
        return dbUser;
      });

      return {
        success: true,
        challenge: mapChallengeToSnapshot(challenge),
        user: newUser,
      };
    }

    if (challenge.flow === "login") {
      // Mark challenge as verified
      const updated = await db
        .update(otpChallenges)
        .set({ isVerified: true })
        .where(eq(otpChallenges.id, challengeId))
        .returning();

      const updatedChallenge = updated[0];
      const user = await findUserByEmail(challenge.email);

      return {
        success: true,
        challenge: updatedChallenge
          ? mapChallengeToSnapshot(updatedChallenge)
          : mapChallengeToSnapshot({ ...challenge, isVerified: true }),
        user,
      };
    }

    if (challenge.flow === "forgot-password") {
      // Mark challenge as verified
      const updated = await db
        .update(otpChallenges)
        .set({ isVerified: true })
        .where(eq(otpChallenges.id, challengeId))
        .returning();

      const updatedChallenge = updated[0];

      return {
        success: true,
        challenge: updatedChallenge
          ? mapChallengeToSnapshot(updatedChallenge)
          : mapChallengeToSnapshot({ ...challenge, isVerified: true }),
        user: null,
      };
    }

    // Unreachable — exhaustive flow check
    return {
      success: false,
      message: "Terjadi kesalahan sistem. Coba lagi.",
    };
  } catch (error) {
    console.error("[auth-service] verifyChallengeCode error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem. Coba lagi.",
    };
  }
}

export async function resendChallenge(
  challengeId: string
): Promise<
  | { success: true; challenge: OtpChallengeSnapshot }
  | { success: false; message: string; challenge?: OtpChallengeSnapshot }
> {
  try {
    // 1. SELECT challenge by id
    const rows = await db
      .select()
      .from(otpChallenges)
      .where(eq(otpChallenges.id, challengeId))
      .limit(1);

    const challenge = rows[0];

    // 2. Not found
    if (!challenge) {
      return { success: false, message: "Sesi OTP tidak ditemukan." };
    }

    const now = new Date();

    // 3. Already verified or expired
    if (challenge.isVerified || challenge.expiresAt < now) {
      return {
        success: false,
        message: "Sesi OTP tidak valid atau sudah kedaluwarsa.",
        challenge: mapChallengeToSnapshot(challenge),
      };
    }

    // 4. Resend limit reached
    if (challenge.resendCount >= RESEND_LIMIT) {
      return {
        success: false,
        message: "Batas pengiriman ulang tercapai. Mulai proses dari awal.",
        challenge: mapChallengeToSnapshot(challenge),
      };
    }

    // 5. Cooldown not yet elapsed
    if (challenge.resendAvailableAt > now) {
      const secondsRemaining = Math.ceil(
        (challenge.resendAvailableAt.getTime() - now.getTime()) / 1000
      );
      return {
        success: false,
        message: `Kirim ulang dalam ${secondsRemaining} detik.`,
        challenge: mapChallengeToSnapshot(challenge),
      };
    }

    // 6. Generate new OTP code and hash it
    const newCode = generateOtpCode();
    const newCodeHash = await bcryptjs.hash(newCode, BCRYPT_COST_OTP);

    // 7. UPDATE otp_challenges
    const nowMs = now.getTime();
    const updated = await db
      .update(otpChallenges)
      .set({
        codeHash: newCodeHash,
        expiresAt: new Date(nowMs + OTP_EXPIRY_MS),
        resendAvailableAt: new Date(nowMs + RESEND_COOLDOWN_MS),
        resendCount: challenge.resendCount + 1,
        attemptsRemaining: ATTEMPT_LIMIT,
        lockedUntil: null,
      })
      .where(eq(otpChallenges.id, challengeId))
      .returning();

    const updatedRecord = updated[0];
    if (!updatedRecord) {
      return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
    }

    // 8. Send new OTP email
    const sendResult = await emailOtpService.sendOtp(challenge.email, newCode);
    if (!sendResult.success) {
      return { success: false, message: "Gagal mengirim email OTP. Coba lagi." };
    }

    // 9. Return updated snapshot
    return { success: true, challenge: mapChallengeToSnapshot(updatedRecord) };
  } catch (error) {
    console.error("[auth-service] resendChallenge error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function resetPassword(
  challengeId: string,
  nextPassword: string
): Promise<
  | { success: true; email: string }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      message?: string;
    }
> {
  try {
    // 1. SELECT challenge by id
    const rows = await db
      .select()
      .from(otpChallenges)
      .where(eq(otpChallenges.id, challengeId))
      .limit(1);

    const challenge = rows[0];

    // 2. Not found
    if (!challenge) {
      return { success: false, message: "Sesi reset tidak ditemukan." };
    }

    // 3. Validate flow
    if (challenge.flow !== "forgot-password") {
      return { success: false, message: "Sesi tidak valid." };
    }

    // 4. Must be verified
    if (!challenge.isVerified) {
      return { success: false, message: "OTP belum diverifikasi." };
    }

    // 5. Check expiry
    const now = new Date();
    if (challenge.expiresAt < now) {
      return { success: false, message: "Sesi reset sudah kedaluwarsa." };
    }

    // 6. Find user by email
    const user = await findUserByEmail(challenge.email);
    if (!user) {
      return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
    }

    // 7. Hash new password
    const newPasswordHash = await bcryptjs.hash(nextPassword, BCRYPT_COST_PASSWORD);

    // 8. Update user password
    await updateUserPassword(user.id, newPasswordHash);

    // 9. Delete the challenge
    await db.delete(otpChallenges).where(eq(otpChallenges.id, challengeId));

    // 10. Return success
    return { success: true, email: challenge.email };
  } catch (error) {
    console.error("[auth-service] resetPassword error:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Coba lagi." };
  }
}

export async function getUserById(userId: string): Promise<DbUser | null> {
  return findUserById(userId);
}

export async function getChallengeSnapshot(
  challengeId: string
): Promise<OtpChallengeSnapshot | null> {
  const result = await db
    .select()
    .from(otpChallenges)
    .where(eq(otpChallenges.id, challengeId))
    .limit(1);

  if (!result[0]) return null;

  return mapChallengeToSnapshot(result[0]);
}
