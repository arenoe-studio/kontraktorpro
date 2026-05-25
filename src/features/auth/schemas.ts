import { z } from "zod";

export const cityOptions = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Surabaya",
  "Semarang",
  "Yogyakarta",
  "Denpasar",
] as const;

const emailSchema = z.string().trim().email("Format email tidak valid.");

const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter.");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Nama lengkap wajib diisi."),
    businessName: z.string().trim().min(1, "Nama usaha wajib diisi."),
    email: emailSchema,
    city: z.enum(cityOptions, {
      error: "Pilih kota operasional.",
    }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
    agreeToTerms: z.literal(true, {
      error: "Anda harus menyetujui syarat & ketentuan.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password harus sama.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().optional(),
  mode: z.enum(["password", "otp"]),
}).superRefine((data, ctx) => {
  if (data.mode === "password" && (!data.password || data.password.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["password"],
      message: "Password wajib diisi.",
    });
  }
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Masukkan 6 digit kode OTP.")
    .regex(/^\d{6}$/, "Kode OTP harus berupa 6 digit angka."),
});

export const forgotPasswordEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password harus sama.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type ForgotPasswordEmailValues = z.infer<
  typeof forgotPasswordEmailSchema
>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
