"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resendCurrentOtpAction, verifyCurrentOtpAction } from "../actions";
import { otpSchema, type OtpFormValues } from "../schemas";
import type { OtpChallengeSnapshot } from "../types";
import { FormCard, InlineAlert, PrimaryButton } from "./form-primitives";
import { OtpInput } from "./otp-input";

type OtpVerificationFormProps = {
  challenge: OtpChallengeSnapshot;
};

export function OtpVerificationForm({ challenge }: OtpVerificationFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [resending, startResendTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [challengeState, setChallengeState] = useState(challenge);
  const [countdown, setCountdown] = useState(challenge.resendAvailableIn);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const code = watch("code");

  useEffect(() => {
    setCountdown(challengeState.resendAvailableIn);
  }, [challengeState]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const subtitle = useMemo(() => {
    return challengeState.flow === "register"
      ? "Kode 6 digit telah dikirim ke email Anda untuk menyelesaikan pendaftaran."
      : "Kode 6 digit telah dikirim ke email Anda untuk login tanpa password.";
  }, [challengeState.flow]);

  return (
    <FormCard
      title="Masukkan Kode Verifikasi"
      description={
        <div className="space-y-2">
          <p>{subtitle}</p>
          <p className="font-semibold text-[var(--kp-neutral-700)]">
            {challengeState.maskedEmail}
          </p>
          <p className="text-xs">
            Bukan nomor saya?{" "}
            <Link href={challengeState.flow === "register" ? "/register" : "/login"} className="font-semibold text-[var(--kp-primary-800)]">
              Kembali
            </Link>
          </p>
        </div>
      }
      footer="Periksa inbox email Anda. Kode berlaku 15 menit."
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit((values) => {
          setError(null);
          setMessage(null);
          startTransition(async () => {
            const result = await verifyCurrentOtpAction(values);
            if (!result.success) {
              setError(result.message ?? "Kode OTP belum valid.");
              return;
            }

            router.push(result.data?.redirectTo ?? "/");
          });
        })}
      >
        {error ? <InlineAlert tone="danger">{error}</InlineAlert> : null}
        {message ? <InlineAlert tone="success">{message}</InlineAlert> : null}

        <div className="space-y-2">
          <OtpInput
            value={code ?? ""}
            onChange={(value) =>
              setValue("code", value, { shouldDirty: true, shouldValidate: true })
            }
            hasError={Boolean(errors.code || error)}
            disabled={challengeState.isLocked}
          />
          {errors.code?.message ? (
            <p className="text-[11px] text-[var(--kp-danger-700)]">
              {errors.code.message}
            </p>
          ) : null}
        </div>

        <PrimaryButton
          type="submit"
          disabled={pending || challengeState.isLocked || (code?.length ?? 0) !== 6}
        >
          {pending ? "Memverifikasi..." : "Verifikasi"}
        </PrimaryButton>

        <div className="space-y-3 rounded-2xl border border-[var(--kp-neutral-200)] bg-[var(--kp-neutral-50)] px-4 py-4 text-sm text-[var(--kp-neutral-700)]">
          <div className="flex items-center justify-between gap-3">
            <span>Tidak menerima kode?</span>
            {countdown > 0 ? (
              <span className="font-mono text-[var(--kp-neutral-500)]">
                Kirim ulang dalam 0:{String(countdown).padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                className="font-semibold text-[var(--kp-primary-800)]"
                disabled={resending}
                onClick={() =>
                  startResendTransition(async () => {
                    setError(null);
                    const result = await resendCurrentOtpAction();
                    if (!result.success) {
                      setError(result.message ?? "Belum bisa kirim ulang kode.");
                      if (result.data) {
                        setChallengeState(result.data);
                      }
                      return;
                    }

                    setChallengeState(result.data ?? challengeState);
                    setMessage("Kode OTP baru berhasil dikirim.");
                  })
                }
              >
                {resending ? "Mengirim..." : "Kirim ulang kode"}
              </button>
            )}
          </div>

          {challengeState.isLocked ? (
            <p className="text-[var(--kp-danger-700)]">
              Terlalu banyak percobaan. Coba lagi dalam{" "}
              <span className="font-mono">{challengeState.lockRemainingIn}</span> detik.
            </p>
          ) : (
            <p className="text-xs text-[var(--kp-neutral-500)]">
              Sisa percobaan:{" "}
              <span className="font-mono">{challengeState.attemptsRemaining}</span> ·
              Kirim ulang tersisa:{" "}
              <span className="font-mono">{challengeState.resendsRemaining}</span>
            </p>
          )}
        </div>
      </form>
    </FormCard>
  );
}
