import Link from "next/link";

import { getOtpChallengeStateFromCookie } from "@/features/auth/actions";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { FormCard } from "@/features/auth/components/form-primitives";
import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";

export async function VerifyOtpPage() {
  const challenge = await getOtpChallengeStateFromCookie();

  return (
    <AuthShell showBrandPanel={false}>
      {challenge ? (
        <OtpVerificationForm challenge={challenge} />
      ) : (
        <FormCard
          title="Sesi Verifikasi Tidak Ditemukan"
          description="Halaman ini hanya bisa diakses setelah Anda meminta kode OTP dari register atau login."
          footer={
            <span>
              <Link href="/register" className="font-semibold text-[var(--kp-primary-800)]">
                Daftar
              </Link>{" "}
              atau{" "}
              <Link href="/login" className="font-semibold text-[var(--kp-primary-800)]">
                kembali ke login
              </Link>
              .
            </span>
          }
        >
          <div className="rounded-2xl border border-[var(--kp-neutral-200)] bg-[var(--kp-neutral-50)] px-4 py-4 text-sm text-[var(--kp-neutral-700)]">
            Mulai lagi dari halaman sebelumnya agar sistem membuat sesi OTP baru.
          </div>
        </FormCard>
      )}
    </AuthShell>
  );
}
