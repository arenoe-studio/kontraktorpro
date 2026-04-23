"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function FormCard({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[24px] border border-[var(--kp-neutral-200)] bg-white p-6 shadow-[var(--kp-shadow-lg)] sm:p-8"
    >
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold leading-tight text-[var(--kp-neutral-900)]">
          {title}
        </h1>
        {description ? (
          <div className="text-sm leading-6 text-[var(--kp-neutral-500)]">
            {description}
          </div>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6 text-sm text-[var(--kp-neutral-500)]">{footer}</div> : null}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  helper,
  children,
  trailing,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--kp-neutral-700)]">
          {label}
        </label>
        {trailing}
      </div>
      {children}
      {error ? (
        <p className="text-[11px] text-[var(--kp-danger-700)]">{error}</p>
      ) : helper ? (
        <p className="text-[11px] text-[var(--kp-neutral-500)]">{helper}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ className = "", error, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-[8px] border bg-white px-4 text-sm text-[var(--kp-neutral-900)] outline-none transition placeholder:text-[var(--kp-neutral-500)] focus:border-[var(--kp-primary-800)] focus:ring-4 focus:ring-[color:rgba(27,58,92,0.08)] ${
        error
          ? "border-[var(--kp-danger-500)]"
          : "border-[var(--kp-neutral-300)]"
      } ${className}`}
    />
  );
}

export function SelectInput({ className = "", error, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-[8px] border bg-white px-4 text-sm text-[var(--kp-neutral-900)] outline-none transition focus:border-[var(--kp-primary-800)] focus:ring-4 focus:ring-[color:rgba(27,58,92,0.08)] ${
        error
          ? "border-[var(--kp-danger-500)]"
          : "border-[var(--kp-neutral-300)]"
      } ${className}`}
    />
  );
}

export function PrimaryButton({
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--kp-accent-500)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--kp-accent-600)] disabled:cursor-not-allowed disabled:bg-[var(--kp-neutral-300)] disabled:text-[var(--kp-neutral-500)]"
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] border border-[var(--kp-primary-800)] bg-transparent px-5 py-3 text-sm font-semibold text-[var(--kp-primary-800)] transition hover:bg-[var(--kp-primary-50)] disabled:cursor-not-allowed disabled:border-[var(--kp-neutral-300)] disabled:text-[var(--kp-neutral-500)]"
    >
      {children}
    </button>
  );
}

export function InlineAlert({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "danger";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "border-[var(--kp-success-100)] bg-[var(--kp-success-100)] text-[var(--kp-primary-800)]"
      : tone === "danger"
        ? "border-[var(--kp-danger-100)] bg-[var(--kp-danger-100)] text-[var(--kp-danger-700)]"
        : "border-[var(--kp-neutral-200)] bg-[var(--kp-neutral-50)] text-[var(--kp-neutral-700)]";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{children}</div>;
}
