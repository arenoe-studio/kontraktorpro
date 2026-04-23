import "server-only";

import { cityOptions } from "./schemas";
import type {
  AuthIntent,
  LoginSuccess,
  MockUser,
  OtpChallengeSnapshot,
} from "./types";

type PendingRegistration = {
  fullName: string;
  businessName: string;
  phone: string;
  city: string;
  password: string;
};

type InternalOtpChallenge = {
  id: string;
  flow: AuthIntent;
  phone: string;
  code: string;
  expiresAt: number;
  resendAvailableAt: number;
  resendCount: number;
  attemptsRemaining: number;
  lockedUntil: number | null;
  isVerified: boolean;
};

type Store = {
  users: Map<string, MockUser>;
  pendingRegistrations: Map<string, PendingRegistration>;
  otpChallenges: Map<string, InternalOtpChallenge>;
};

const MOCK_DELAY = 250;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 45 * 1000;
const RESEND_LIMIT = 3;
const ATTEMPT_LIMIT = 3;
const LOCK_DURATION_MS = 10 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & {
  __kontraktorProAuthStore?: Store;
};

function createInitialStore(): Store {
  return {
    users: new Map<string, MockUser>([
      [
        "08123456789",
        {
          id: "user-demo-1",
          fullName: "Budi Santoso",
          businessName: "CV Maju Jaya Konstruksi",
          phone: "08123456789",
          city: cityOptions[0],
          password: "password123",
          role: "contractor",
          firstLogin: false,
        },
      ],
      [
        "08111111111",
        {
          id: "user-suspended-1",
          fullName: "Akun Suspended",
          businessName: "PT Contoh Suspend",
          phone: "08111111111",
          city: cityOptions[1],
          password: "password123",
          role: "contractor",
          suspended: true,
          firstLogin: false,
        },
      ],
    ]),
    pendingRegistrations: new Map(),
    otpChallenges: new Map(),
  };
}

const store = globalStore.__kontraktorProAuthStore ?? createInitialStore();
globalStore.__kontraktorProAuthStore = store;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

function maskPhone(phone: string) {
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
}

function generateCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function mapChallenge(challenge: InternalOtpChallenge): OtpChallengeSnapshot {
  const now = Date.now();

  return {
    id: challenge.id,
    flow: challenge.flow,
    maskedPhone: maskPhone(challenge.phone),
    resendAvailableIn: Math.max(
      0,
      Math.ceil((challenge.resendAvailableAt - now) / 1000),
    ),
    resendsRemaining: Math.max(0, RESEND_LIMIT - challenge.resendCount),
    attemptsRemaining: challenge.attemptsRemaining,
    expiresIn: Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000)),
    isLocked: Boolean(challenge.lockedUntil && challenge.lockedUntil > now),
    lockRemainingIn: challenge.lockedUntil
      ? Math.max(0, Math.ceil((challenge.lockedUntil - now) / 1000))
      : 0,
    isVerified: challenge.isVerified,
    debugCode: challenge.code,
  };
}

function createChallenge(flow: AuthIntent, phone: string) {
  const challenge: InternalOtpChallenge = {
    id: crypto.randomUUID(),
    flow,
    phone,
    code: generateCode(),
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS,
    resendCount: 0,
    attemptsRemaining: ATTEMPT_LIMIT,
    lockedUntil: null,
    isVerified: false,
  };

  store.otpChallenges.set(challenge.id, challenge);
  return challenge;
}

function getChallenge(challengeId: string) {
  const challenge = store.otpChallenges.get(challengeId);
  if (!challenge) return null;

  return challenge;
}

export async function startRegistration(input: PendingRegistration) {
  await wait();

  const phone = normalizePhone(input.phone);
  if (store.users.has(phone) || store.pendingRegistrations.has(phone)) {
    return {
      success: false as const,
      fieldErrors: {
        phone: "Nomor HP sudah terdaftar. Silakan masuk.",
      },
    };
  }

  store.pendingRegistrations.set(phone, { ...input, phone });
  const challenge = createChallenge("register", phone);

  return {
    success: true as const,
    challenge: mapChallenge(challenge),
  };
}

export async function loginWithPassword(phoneInput: string, password: string) {
  await wait();

  const phone = normalizePhone(phoneInput);
  const user = store.users.get(phone);

  if (!user) {
    return {
      success: false as const,
      fieldErrors: {
        phone: "Nomor HP tidak ditemukan. Daftar dulu?",
      },
    };
  }

  if (user.suspended) {
    return {
      success: false as const,
      message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro.",
    };
  }

  if (user.password !== password) {
    return {
      success: false as const,
      fieldErrors: {
        password: "Password salah.",
      },
    };
  }

  const result: LoginSuccess = {
    redirectTo: user.role === "contractor" ? "/dashboard" : "/admin",
    firstLogin: Boolean(user.firstLogin),
  };

  user.firstLogin = false;

  return {
    success: true as const,
    user,
    result,
  };
}

export async function startLoginOtp(phoneInput: string) {
  await wait();

  const phone = normalizePhone(phoneInput);
  const user = store.users.get(phone);

  if (!user) {
    return {
      success: false as const,
      fieldErrors: {
        phone: "Nomor HP tidak ditemukan. Daftar dulu?",
      },
    };
  }

  if (user.suspended) {
    return {
      success: false as const,
      message: "Akun Anda dinonaktifkan. Hubungi tim KontraktorPro.",
    };
  }

  const challenge = createChallenge("login", phone);

  return {
    success: true as const,
    challenge: mapChallenge(challenge),
  };
}

export async function startPasswordReset(phoneInput: string) {
  await wait();

  const phone = normalizePhone(phoneInput);
  const user = store.users.get(phone);

  if (!user) {
    return {
      success: false as const,
      fieldErrors: {
        phone: "Nomor HP ini tidak terdaftar.",
      },
    };
  }

  const challenge = createChallenge("forgot-password", phone);

  return {
    success: true as const,
    challenge: mapChallenge(challenge),
    phone,
  };
}

export async function getChallengeSnapshot(challengeId: string) {
  await wait();
  const challenge = getChallenge(challengeId);
  return challenge ? mapChallenge(challenge) : null;
}

export async function resendChallenge(challengeId: string) {
  await wait();
  const challenge = getChallenge(challengeId);
  if (!challenge) {
    return {
      success: false as const,
      message: "Sesi OTP tidak ditemukan. Mulai lagi dari halaman sebelumnya.",
    };
  }

  const now = Date.now();
  if (challenge.lockedUntil && challenge.lockedUntil > now) {
    return {
      success: false as const,
      message: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.",
      challenge: mapChallenge(challenge),
    };
  }

  if (challenge.resendCount >= RESEND_LIMIT) {
    return {
      success: false as const,
      message: "Terlalu banyak percobaan. Coba lagi dalam 10 menit.",
      challenge: mapChallenge(challenge),
    };
  }

  if (challenge.resendAvailableAt > now) {
    return {
      success: false as const,
      message: `Kirim ulang dalam ${Math.ceil(
        (challenge.resendAvailableAt - now) / 1000,
      )} detik.`,
      challenge: mapChallenge(challenge),
    };
  }

  challenge.code = generateCode();
  challenge.expiresAt = Date.now() + OTP_EXPIRY_MS;
  challenge.resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
  challenge.resendCount += 1;
  challenge.attemptsRemaining = ATTEMPT_LIMIT;
  challenge.lockedUntil = null;
  challenge.isVerified = false;

  return {
    success: true as const,
    challenge: mapChallenge(challenge),
  };
}

export async function verifyChallengeCode(challengeId: string, code: string) {
  await wait();
  const challenge = getChallenge(challengeId);

  if (!challenge) {
    return {
      success: false as const,
      message: "Sesi OTP tidak ditemukan. Mulai lagi dari halaman sebelumnya.",
    };
  }

  const now = Date.now();
  if (challenge.lockedUntil && challenge.lockedUntil > now) {
    return {
      success: false as const,
      message: "Terlalu banyak percobaan.",
      challenge: mapChallenge(challenge),
    };
  }

  if (challenge.expiresAt < now) {
    return {
      success: false as const,
      message: "Kode sudah kedaluwarsa.",
      challenge: mapChallenge(challenge),
    };
  }

  if (challenge.code !== code) {
    challenge.attemptsRemaining -= 1;

    if (challenge.attemptsRemaining <= 0) {
      challenge.lockedUntil = Date.now() + LOCK_DURATION_MS;
      challenge.attemptsRemaining = 0;
      return {
        success: false as const,
        message: "Terlalu banyak percobaan.",
        challenge: mapChallenge(challenge),
      };
    }

    return {
      success: false as const,
      message: `Kode salah. Sisa ${challenge.attemptsRemaining} percobaan.`,
      challenge: mapChallenge(challenge),
    };
  }

  challenge.isVerified = true;

  if (challenge.flow === "register") {
    const pendingUser = store.pendingRegistrations.get(challenge.phone);
    if (!pendingUser) {
      return {
        success: false as const,
        message: "Data pendaftaran tidak ditemukan. Silakan daftar ulang.",
      };
    }

    store.users.set(challenge.phone, {
      id: crypto.randomUUID(),
      fullName: pendingUser.fullName,
      businessName: pendingUser.businessName,
      phone: pendingUser.phone,
      city: pendingUser.city,
      password: pendingUser.password,
      role: "contractor",
      firstLogin: true,
    });
    store.pendingRegistrations.delete(challenge.phone);
  }

  return {
    success: true as const,
    challenge: mapChallenge(challenge),
    user:
      challenge.flow !== "forgot-password"
        ? store.users.get(challenge.phone) ?? null
        : null,
  };
}

export async function getUserById(userId: string) {
  await wait();

  for (const user of store.users.values()) {
    if (user.id === userId) {
      return user;
    }
  }

  return null;
}

export async function getUserByPhone(phoneInput: string) {
  await wait();
  const phone = normalizePhone(phoneInput);
  return store.users.get(phone) ?? null;
}

export async function resetPassword(challengeId: string, nextPassword: string) {
  await wait();
  const challenge = getChallenge(challengeId);

  if (!challenge || challenge.flow !== "forgot-password") {
    return {
      success: false as const,
      message: "Sesi reset password tidak valid.",
    };
  }

  if (!challenge.isVerified) {
    return {
      success: false as const,
      message: "Kode OTP belum diverifikasi.",
    };
  }

  const user = store.users.get(challenge.phone);
  if (!user) {
    return {
      success: false as const,
      message: "Akun tidak ditemukan.",
    };
  }

  if (user.password === nextPassword) {
    return {
      success: false as const,
      fieldErrors: {
        password: "Password baru harus berbeda dari password sebelumnya.",
      },
    };
  }

  user.password = nextPassword;
  store.otpChallenges.delete(challengeId);

  return {
    success: true as const,
    phone: user.phone,
  };
}
