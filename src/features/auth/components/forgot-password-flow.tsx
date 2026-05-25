"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  requestPasswordResetAction,
  resendPasswordResetOtpAction,
  resetPasswordAction,
  verifyPasswordResetOtpAction,
} from "../actions";
import {
  forgotPasswordEmailSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailValues,
  type OtpFormValues,
  type ResetPasswordValues,
} from "../schemas";
import type { PasswordResetState } from "../types";
import {
  Field,
  FormCard,
  InlineAlert,
  PrimaryButton,
  TextInput,
} from "./form-primitives";
import { OtpInput } from "./otp-input";

type ForgotPasswordFlowProps = {
  initialState: PasswordResetState;
};

const steps = [
  "Masukkan Email",
  "Verifikasi OTP",
  "Buat Password Baru",
] as const;

export function ForgotPasswordFlow({ initialState }: ForgotPasswordFlowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<PasswordResetState>(initialState);
  const [countdown, setCountdown] = useState(initialState.challenge?.resendAvailableIn ?? 0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const phoneForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const passwordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setCountdown(state.challenge?.resendAvailableIn ?? 0);
  }, [state.challenge]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const activeIndex = state.step - 1;
  const currentCode = otpForm.watch("code");
  const passwordValue = passwordForm.watch("password");

  const footer = useMemo(
    () => (
      <Link href="/login" className="font-semibold text-[var(--kp-primary-800)]">
        Kembali ke Login
      </Link>
    ),
    [],
  );

  return (
    <FormCard
      title={steps[activeIndex]}
      description={
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const isDone = index < activeIndex;

              return (
                <div key={step} className="space-y-2 text-center">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      isDone
                        ? "bg-[var(--kp-success-500)] text-white"
                        : isActive
                          ? "bg-[var(--kp-primary-800)] text-white"
                          : "bg-[var(--kp-neutral-300)] text-[var(--kp-neutral-700)]"
                    }`}
                  >
                    {isDone ? "✓" : index + 1}
                  </div>
                  <p className="text-[11px] leading-4 text-[var(--kp-neutral-500)]">
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-sm leading-6 text-[var(--kp-neutral-500)]">
            {state.step === 1
              ? "Masukkan email terdaftar. Kami akan kirim kode verifikasi."
              : state.step === 2
                ? "Masukkan 6 digit kode OTP untuk lanjut membuat password baru."
                : "Password baru harus berbeda dari password sebelumnya."}
          </p>
        </div>
      }
      footer={footer}
    >
      <div className="space-y-6">
        {error ? <InlineAlert tone="danger">{error}</InlineAlert> : null}
        {message ? <InlineAlert tone="success">{message}</InlineAlert> : null}

        {state.step === 1 ? (
          <form
            className="space-y-5"
            onSubmit={phoneForm.handleSubmit((values) => {
              setError(null);
              setMessage(null);
              startTransition(async () => {
                const result = await requestPasswordResetAction(values);
                if (!result.success) {
                  if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, message]) => {
                      if (message) {
                        phoneForm.setError(field as keyof ForgotPasswordEmailValues, {
                          message,
                        });
                      }
                    });
                  }
                  setError(result.message ?? "Email belum bisa diproses.");
                  return;
                }

                setState(result.data ?? { challenge: null, email: null, step: 2 });
                setMessage("Kode OTP berhasil dikirim.");
              });
            })}
          >
            <Field label="Email" htmlFor="email" error={phoneForm.formState.errors.email?.message}>
              <TextInput id="email" type="email" inputMode="email" placeholder="nama@email.com" error={phoneForm.formState.errors.email?.message} {...phoneForm.register("email")} />
            </Field>

            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Mengirim OTP..." : "Kirim Kode OTP"}
            </PrimaryButton>
          </form>
        ) : null}

        {state.step === 2 && state.challenge ? (
          <form
            className="space-y-5"
            onSubmit={otpForm.handleSubmit((values) => {
              setError(null);
              setMessage(null);
              startTransition(async () => {
                const result = await verifyPasswordResetOtpAction(values);
                if (!result.success) {
                  setError(result.message ?? "Kode OTP belum valid.");
                  if (result.data?.challenge) {
                    setState(result.data);
                  }
                  return;
                }

                setState(result.data ?? state);
                setMessage("Kode OTP berhasil diverifikasi.");
              });
            })}
          >
            <div className="space-y-2">
              <OtpInput
                value={currentCode ?? ""}
                onChange={(value) =>
                  otpForm.setValue("code", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                hasError={Boolean(otpForm.formState.errors.code || error)}
                disabled={state.challenge.isLocked}
              />
            </div>

            <PrimaryButton
              type="submit"
              disabled={pending || (currentCode?.length ?? 0) !== 6}
            >
              {pending ? "Memverifikasi..." : "Verifikasi Kode"}
            </PrimaryButton>

            <div className="rounded-2xl border border-[var(--kp-neutral-200)] bg-[var(--kp-neutral-50)] px-4 py-4 text-sm text-[var(--kp-neutral-700)]">
              {countdown > 0 ? (
                <p className="font-mono text-[var(--kp-neutral-500)]">
                  Kirim ulang dalam 0:{String(countdown).padStart(2, "0")}
                </p>
              ) : (
                <button
                  type="button"
                  className="font-semibold text-[var(--kp-primary-800)]"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await resendPasswordResetOtpAction();
                      if (!result.success) {
                        setError(result.message ?? "Belum bisa kirim ulang kode.");
                        if (result.data) {
                          setState(result.data);
                        }
                        return;
                      }

                      setState(result.data ?? state);
                      setMessage("Kode OTP baru berhasil dikirim.");
                    })
                  }
                >
                  Kirim ulang kode
                </button>
              )}
            </div>
          </form>
        ) : null}

        {state.step === 3 ? (
          <form
            className="space-y-5"
            onSubmit={passwordForm.handleSubmit((values) => {
              setError(null);
              setMessage(null);
              startTransition(async () => {
                const result = await resetPasswordAction(values);
                if (!result.success) {
                  if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, message]) => {
                      if (message) {
                        passwordForm.setError(field as keyof ResetPasswordValues, {
                          message,
                        });
                      }
                    });
                  }
                  setError(result.message ?? "Password baru belum bisa disimpan.");
                  return;
                }

                setMessage("Password berhasil diubah. Mengarahkan ke halaman login...");
                window.setTimeout(() => {
                  router.push(result.data?.redirectTo ?? "/login");
                }, 1200);
              });
            })}
          >
            <Field
              label="Password Baru"
              htmlFor="password"
              error={passwordForm.formState.errors.password?.message}
              helper={
                passwordValue
                  ? "Gunakan minimal 8 karakter dan berbeda dari password sebelumnya."
                  : undefined
              }
            >
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  error={passwordForm.formState.errors.password?.message}
                  className="pr-14"
                  {...passwordForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-[var(--kp-primary-800)]"
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </Field>

            <Field
              label="Konfirmasi Password Baru"
              htmlFor="confirmPassword"
              error={passwordForm.formState.errors.confirmPassword?.message}
            >
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  className="pr-14"
                  {...passwordForm.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-[var(--kp-primary-800)]"
                >
                  {showConfirmPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </Field>

            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Menyimpan..." : "Simpan Password Baru"}
            </PrimaryButton>
          </form>
        ) : null}
      </div>
    </FormCard>
  );
}
