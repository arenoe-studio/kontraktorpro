"use client";

import { useMemo, useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
};

export function OtpInput({
  value,
  onChange,
  hasError,
  disabled,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(
    () => Array.from({ length: 6 }, (_, index) => value[index] ?? ""),
    [value],
  );

  function updateDigit(index: number, nextValue: string) {
    const onlyDigits = nextValue.replace(/\D/g, "");
    if (!onlyDigits) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
      return;
    }

    if (onlyDigits.length > 1) {
      const merged = onlyDigits.slice(0, 6).split("");
      onChange(merged.join(""));
      refs.current[Math.min(merged.length, 5)]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = onlyDigits;
    onChange(nextDigits.join(""));
    refs.current[index + 1]?.focus();
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            updateDigit(0, event.clipboardData.getData("text"));
          }}
          className={`h-13 w-full rounded-[8px] border text-center font-mono text-xl font-semibold outline-none transition focus:border-[var(--kp-primary-800)] focus:bg-[var(--kp-primary-50)] ${
            hasError
              ? "border-[var(--kp-danger-500)]"
              : "border-[var(--kp-neutral-300)]"
          } ${disabled ? "bg-[var(--kp-neutral-100)] text-[var(--kp-neutral-500)]" : "bg-white text-[var(--kp-neutral-900)]"}`}
        />
      ))}
    </div>
  );
}
