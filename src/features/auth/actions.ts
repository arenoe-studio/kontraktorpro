"use server";

import { cookies } from "next/headers";

import {
  forgotPasswordEmailSchema,
  loginSchema,
  otpSchema,
  registerSchema,
  resetPasswordSchema,
} from "./schemas";
import {
  getChallengeSnapshot,
  loginWithPassword,
  resendChallenge,
  resetPassword,
  startLoginOtp,
  startPasswordReset,
  startRegistration,
  verifyChallengeCode,
} from "./auth-service";
import type {
  ActionResult,
  LoginSuccess,
  OtpChallengeSnapshot,
  PasswordResetState,
} from "./types";

const OTP_CHALLENGE_COOKIE = "kp-auth-otp";
const RESET_CHALLENGE_COOKIE = "kp-auth-reset";
const SESSION_COOKIE = "kp-auth-session";

function flattenFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      messages?.[0] ?? "",
    ]),
  );
}

function normalizeFieldErrors(
  fieldErrors?: Record<string, string | undefined>,
) {
  if (!fieldErrors) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, message]) => [field, message ?? ""]),
  );
}

async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
}

async function setOtpCookie(challengeId: string) {
  const cookieStore = await cookies();
  cookieStore.set(OTP_CHALLENGE_COOKIE, challengeId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 15 * 60,
    });
}

async function setResetCookie(challengeId: string) {
  const cookieStore = await cookies();
  cookieStore.set(RESET_CHALLENGE_COOKIE, challengeId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/forgot-password",
      maxAge: 15 * 60,
    });
}

async function clearOtpCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(OTP_CHALLENGE_COOKIE);
}

async function clearResetCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(RESET_CHALLENGE_COOKIE);
}

export async function registerAction(
  input: unknown,
): Promise<ActionResult<OtpChallengeSnapshot>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const result = await startRegistration({
    fullName: parsed.data.fullName,
    businessName: parsed.data.businessName,
    email: parsed.data.email,
    city: parsed.data.city,
    password: parsed.data.password,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: normalizeFieldErrors(result.fieldErrors),
      message: result.message ?? "Pendaftaran belum bisa diproses.",
    };
  }

  await setOtpCookie(result.challenge.id);

  return {
    success: true,
    message: "Kode OTP dikirim ke email Anda.",
    data: result.challenge,
  };
}

export async function loginWithPasswordAction(
  input: unknown,
): Promise<ActionResult<LoginSuccess>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const password = parsed.data.password ?? "";
  if (parsed.data.mode === "otp") {
    return {
      success: false,
      message: "Mode OTP harus menggunakan aksi terpisah.",
    };
  }

  const result = await loginWithPassword(parsed.data.email, password);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: normalizeFieldErrors(result.fieldErrors),
      message: result.message ?? "Login gagal diproses.",
    };
  }

  await setSessionCookie(result.user.id);

  return {
    success: true,
    message: "Login berhasil.",
    data: result.result,
  };
}

export async function requestLoginOtpAction(
  input: unknown,
): Promise<ActionResult<OtpChallengeSnapshot>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const result = await startLoginOtp(parsed.data.email);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: normalizeFieldErrors(result.fieldErrors),
      message: result.message ?? "Permintaan OTP belum bisa diproses.",
    };
  }

  await setOtpCookie(result.challenge.id);

  return {
    success: true,
    message: "Kode OTP berhasil dikirim.",
    data: result.challenge,
  };
}

export async function verifyCurrentOtpAction(
  input: unknown,
): Promise<ActionResult<LoginSuccess>> {
  const parsed = otpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const challengeId = (await cookies()).get(OTP_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      success: false,
      message: "Sesi OTP tidak ditemukan. Silakan ulangi dari login atau daftar.",
    };
  }

  const result = await verifyChallengeCode(challengeId, parsed.data.code);
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: result.challenge
        ? {
            redirectTo: "/verify-otp",
            firstLogin: false,
          }
        : undefined,
    };
  }

  await clearOtpCookie();
  if (result.user) {
    await setSessionCookie(result.user.id);
  }

  return {
    success: true,
    message:
      result.challenge.flow === "register"
        ? "Verifikasi berhasil. Akun Anda siap digunakan."
        : "Login OTP berhasil.",
    data: {
      redirectTo:
        result.user?.role === "contractor"
          ? "/dashboard"
          : result.user
            ? "/admin"
            : "/dashboard",
      firstLogin: Boolean(result.user?.firstLogin),
    },
  };
}

export async function resendCurrentOtpAction(): Promise<
  ActionResult<OtpChallengeSnapshot>
> {
  const challengeId = (await cookies()).get(OTP_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      success: false,
      message: "Sesi OTP tidak ditemukan.",
    };
  }

  const result = await resendChallenge(challengeId);
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: result.challenge,
    };
  }

  return {
    success: true,
    message: "Kode baru berhasil dikirim.",
    data: result.challenge,
  };
}

export async function requestPasswordResetAction(
  input: unknown,
): Promise<ActionResult<PasswordResetState>> {
  const parsed = forgotPasswordEmailSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const result = await startPasswordReset(parsed.data.email);
  if (!result.success) {
    const errorMessage =
      "message" in result && typeof result.message === "string"
        ? result.message
        : "Permintaan reset password belum bisa diproses.";

    return {
      success: false,
      fieldErrors: normalizeFieldErrors(result.fieldErrors),
      message: errorMessage,
    };
  }

  await setResetCookie(result.challenge.id);

  return {
    success: true,
    message: "Kode OTP reset password berhasil dikirim.",
    data: {
      challenge: result.challenge,
      email: result.email,
      step: 2,
    },
  };
}

export async function verifyPasswordResetOtpAction(
  input: unknown,
): Promise<ActionResult<PasswordResetState>> {
  const parsed = otpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const challengeId = (await cookies()).get(RESET_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      success: false,
      message: "Sesi reset password tidak ditemukan.",
    };
  }

  const result = await verifyChallengeCode(challengeId, parsed.data.code);
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: {
        challenge: result.challenge ?? null,
        email: null,
        step: 2,
      },
    };
  }

  return {
    success: true,
    message: "Kode OTP berhasil diverifikasi.",
    data: {
      challenge: result.challenge,
      email: result.challenge.maskedEmail,
      step: 3,
    },
  };
}

export async function resendPasswordResetOtpAction(): Promise<
  ActionResult<PasswordResetState>
> {
  const challengeId = (await cookies()).get(RESET_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      success: false,
      message: "Sesi reset password tidak ditemukan.",
    };
  }

  const result = await resendChallenge(challengeId);
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: {
        challenge: result.challenge ?? null,
        email: null,
        step: 2,
      },
    };
  }

  return {
    success: true,
    message: "Kode OTP baru berhasil dikirim.",
    data: {
      challenge: result.challenge,
      email: null,
      step: 2,
    },
  };
}

export async function resetPasswordAction(
  input: unknown,
): Promise<ActionResult<{ email: string; redirectTo: string }>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const challengeId = (await cookies()).get(RESET_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      success: false,
      message: "Sesi reset password tidak ditemukan.",
    };
  }

  const result = await resetPassword(challengeId, parsed.data.password);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: normalizeFieldErrors(result.fieldErrors),
      message: result.message ?? "Reset password belum bisa diproses.",
    };
  }

  await clearResetCookie();

  return {
    success: true,
    message: "Password berhasil diubah.",
    data: {
      email: result.email,
      redirectTo: `/login?email=${encodeURIComponent(result.email)}`,
    },
  };
}

export async function getOtpChallengeStateFromCookie() {
  const challengeId = (await cookies()).get(OTP_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return null;
  }

  return getChallengeSnapshot(challengeId);
}

export async function getPasswordResetStateFromCookie(): Promise<PasswordResetState> {
  const challengeId = (await cookies()).get(RESET_CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    return {
      challenge: null,
      email: null,
      step: 1,
    };
  }

  const challenge = await getChallengeSnapshot(challengeId);
  if (!challenge) {
    await clearResetCookie();
    return {
      challenge: null,
      email: null,
      step: 1,
    };
  }

  return {
    challenge,
    email: null,
    step: challenge.isVerified ? 3 : 2,
  };
}
