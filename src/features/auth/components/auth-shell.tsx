import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  showBrandPanel?: boolean;
};

const benefits = [
  "Gratis selamanya untuk 1 proyek aktif",
  "Laporan harian terstruktur dari HP",
  "Portofolio otomatis dari setiap proyek selesai",
  "Setup dalam 3 menit, tidak perlu pelatihan",
];

export function AuthShell({
  children,
  showBrandPanel = true,
}: AuthShellProps) {
  return (
    <div
      className="min-h-screen bg-[var(--kp-neutral-50)]"
      style={
        {
          "--kp-primary-900": "#0F2338",
          "--kp-primary-800": "#1B3A5C",
          "--kp-primary-700": "#1E4A73",
          "--kp-primary-50": "#F0F6FC",
          "--kp-accent-600": "#EA6A0A",
          "--kp-accent-500": "#F97316",
          "--kp-accent-100": "#FEF0E6",
          "--kp-neutral-900": "#111827",
          "--kp-neutral-700": "#374151",
          "--kp-neutral-500": "#6B7280",
          "--kp-neutral-300": "#D1D5DB",
          "--kp-neutral-200": "#E5E7EB",
          "--kp-neutral-100": "#F4F5F6",
          "--kp-neutral-50": "#F9FAFB",
          "--kp-white": "#FFFFFF",
          "--kp-success-500": "#16A34A",
          "--kp-success-100": "#DCFCE7",
          "--kp-danger-500": "#EF4444",
          "--kp-danger-700": "#B91C1C",
          "--kp-danger-100": "#FEE2E2",
          "--kp-shadow-sm": "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
          "--kp-shadow-lg": "0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {showBrandPanel ? (
          <aside className="hidden min-h-screen flex-col justify-between bg-[var(--kp-primary-800)] px-10 py-8 text-white lg:flex">
            <div className="space-y-10">
              <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl font-black text-white">
                  <Image
                    src="/logo-only.png"
                    alt="KontraktorPro"
                    width={32}
                    height={32}
                    priority
                    className="h-8 w-8"
                  />
                </span>
                <span>KontraktorPro</span>
              </Link>

              <div className="space-y-6">
                <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
                  Mulai kelola proyek lebih profesional hari ini.
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--kp-accent-100)] text-[var(--kp-accent-500)]">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-sm text-white/60">
              Sudah digunakan 500+ kontraktor di Indonesia
            </p>
          </aside>
        ) : null}

        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-6 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3 text-base font-semibold text-[var(--kp-primary-800)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--kp-primary-800)] text-sm font-black text-white">
                  <Image
                    src="/logo-only.png"
                    alt="KontraktorPro"
                    width={28}
                    height={28}
                    priority
                    className="h-7 w-7"
                  />
                </span>
                <span>KontraktorPro</span>
              </Link>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
