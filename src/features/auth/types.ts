export type AuthIntent = "register" | "login" | "forgot-password";

export type AuthRole = "contractor" | "moderator" | "super_admin";

export type MockUser = {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  city: string;
  password: string;
  role: AuthRole;
  suspended?: boolean;
  firstLogin?: boolean;
};

export type OtpChallengeSnapshot = {
  id: string;
  flow: AuthIntent;
  maskedPhone: string;
  resendAvailableIn: number;
  resendsRemaining: number;
  attemptsRemaining: number;
  expiresIn: number;
  isLocked: boolean;
  lockRemainingIn: number;
  isVerified: boolean;
  debugCode: string;
};

export type ActionResult<T> = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
};

export type LoginSuccess = {
  redirectTo: string;
  firstLogin: boolean;
};

export type PasswordResetState = {
  challenge: OtpChallengeSnapshot | null;
  phone: string | null;
  step: 1 | 2 | 3;
};
