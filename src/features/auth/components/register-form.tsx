"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerAction } from "../actions";
import { cityOptions, registerSchema, type RegisterFormValues } from "../schemas";
import {
  Field,
  FormCard,
  InlineAlert,
  PrimaryButton,
  SelectInput,
  TextInput,
} from "./form-primitives";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      city: cityOptions[0],
    },
  });

  const footer = useMemo(
    () => (
      <>
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-[var(--kp-primary-800)]">
          Masuk di sini
        </Link>
      </>
    ),
    [],
  );

  return (
    <FormCard
      title="Buat Akun Gratis"
      description="Daftar cepat dengan email aktif agar Anda bisa langsung mulai mengelola proyek."
      footer={footer}
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit((values) => {
          setFormError(null);
          startTransition(async () => {
            const result = await registerAction(values);
            if (!result.success) {
              if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(([field, message]) => {
                  if (message) {
                    setError(field as keyof RegisterFormValues, { message });
                  }
                });
              }
              setFormError(result.message ?? "Pendaftaran belum berhasil.");
              return;
            }

            router.push("/verify-otp");
          });
        })}
      >
        {formError ? <InlineAlert tone="danger">{formError}</InlineAlert> : null}

        <Field label="Nama Lengkap" htmlFor="fullName" error={errors.fullName?.message}>
          <TextInput id="fullName" placeholder="Budi Santoso" error={errors.fullName?.message} {...register("fullName")} />
        </Field>

        <Field
          label="Nama Usaha / Perusahaan"
          htmlFor="businessName"
          error={errors.businessName?.message}
        >
          <TextInput
            id="businessName"
            placeholder="CV Maju Jaya Konstruksi"
            error={errors.businessName?.message}
            {...register("businessName")}
          />
        </Field>

        <Field
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          helper="Email ini akan digunakan untuk login dan menerima kode OTP."
        >
          <TextInput id="email" type="email" inputMode="email" placeholder="nama@email.com" error={errors.email?.message} {...register("email")} />
        </Field>

        <Field label="Kota Operasional" htmlFor="city" error={errors.city?.message}>
          <SelectInput id="city" error={errors.city?.message} {...register("city")}>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
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

        <Field
          label="Konfirmasi Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <TextInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password"
              error={errors.confirmPassword?.message}
              className="pr-14"
              {...register("confirmPassword")}
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

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--kp-neutral-200)] bg-[var(--kp-neutral-50)] px-4 py-3 text-sm text-[var(--kp-neutral-700)]">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--kp-primary-800)]" {...register("agreeToTerms")} />
          <span>
            Saya setuju dengan{" "}
            <Link href="/" className="font-semibold text-[var(--kp-primary-800)]">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/" className="font-semibold text-[var(--kp-primary-800)]">
              Kebijakan Privasi
            </Link>
            .
          </span>
        </label>
        {errors.agreeToTerms?.message ? (
          <p className="text-[11px] text-[var(--kp-danger-700)]">
            {errors.agreeToTerms.message}
          </p>
        ) : null}

        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Mengirim OTP..." : "Buat Akun Gratis"}
        </PrimaryButton>
      </form>
    </FormCard>
  );
}
