"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginWithPasswordAction, requestLoginOtpAction } from "../actions";
import { loginSchema, type LoginFormValues } from "../schemas";
import {
  Field,
  FormCard,
  InlineAlert,
  OutlineButton,
  PrimaryButton,
  TextInput,
} from "./form-primitives";

type LoginFormProps = {
  defaultEmail?: string;
};

export function LoginForm({ defaultEmail }: LoginFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      mode: "password",
      email: defaultEmail ?? "",
      password: "",
    },
  });

  const passwordVisible = watch("mode") === "password";
  const footer = useMemo(
    () => (
      <>
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-[var(--kp-primary-800)]">
          Daftar gratis
        </Link>
      </>
    ),
    [],
  );

  function switchMode(nextMode: "password" | "otp") {
    setMode(nextMode);
    setValue("mode", nextMode);
    setFormError(null);
  }

  return (
    <FormCard
      title="Masuk ke KontraktorPro"
      description="Masuk dengan password atau minta OTP langsung ke email aktif Anda."
      footer={footer}
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit((values) => {
          setFormError(null);
          startTransition(async () => {
            if (mode === "otp") {
              const result = await requestLoginOtpAction({ ...values, mode: "otp" });
              if (!result.success) {
                if (result.fieldErrors) {
                  Object.entries(result.fieldErrors).forEach(([field, message]) => {
                    if (message) {
                      setError(field as keyof LoginFormValues, { message });
                    }
                  });
                }
                setFormError(result.message ?? "Kode OTP belum bisa dikirim.");
                return;
              }

              router.push("/verify-otp");
              return;
            }

            const result = await loginWithPasswordAction({
              ...values,
              mode: "password",
            });
            if (!result.success) {
              if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(([field, message]) => {
                  if (message) {
                    setError(field as keyof LoginFormValues, { message });
                  }
                });
              }
              setFormError(result.message ?? "Login belum berhasil.");
              return;
            }

            router.push(result.data?.redirectTo ?? "/");
          });
        })}
      >
        {formError ? <InlineAlert tone="danger">{formError}</InlineAlert> : null}

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <TextInput id="email" type="email" inputMode="email" placeholder="nama@email.com" error={errors.email?.message} {...register("email")} />
        </Field>

        {passwordVisible ? (
          <Field
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            trailing={
              <Link href="/forgot-password" className="text-xs font-semibold text-[var(--kp-primary-800)]">
                Lupa password?
              </Link>
            }
          >
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                error={errors.password?.message}
                className="pr-14"
                {...register("password")}
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
        ) : (
          <InlineAlert>
            Password disembunyikan. Kami akan kirim kode OTP 6 digit ke email Anda.
          </InlineAlert>
        )}

        <input type="hidden" value={mode} {...register("mode")} />

        <PrimaryButton type="submit" disabled={pending}>
          {pending
            ? mode === "otp"
              ? "Mengirim OTP..."
              : "Memproses..."
            : mode === "otp"
              ? "Kirim OTP"
              : "Masuk"}
        </PrimaryButton>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--kp-neutral-500)]">
          <span className="h-px flex-1 bg-[var(--kp-neutral-200)]" />
          atau
          <span className="h-px flex-1 bg-[var(--kp-neutral-200)]" />
        </div>

        <OutlineButton
          type="button"
          disabled={pending}
          onClick={() => switchMode(mode === "password" ? "otp" : "password")}
        >
          {mode === "password" ? "Masuk dengan OTP" : "Gunakan Password"}
        </OutlineButton>
      </form>
    </FormCard>
  );
}
