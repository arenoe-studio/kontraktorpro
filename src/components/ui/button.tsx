import * as React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/ui/cn";

const buttonVariants = {
  variant: {
    primary:
      "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-600",
    secondary:
      "bg-primary-800 text-white hover:bg-primary-700 active:bg-primary-700",
    outline:
      "border-[1.5px] border-primary-800 bg-transparent text-primary-800 hover:bg-primary-50",
    "outline-danger":
      "border-[1.5px] border-danger-500 bg-transparent text-danger-700 hover:bg-danger-100",
    ghost: "bg-transparent text-primary-800 hover:bg-neutral-100",
  },
  size: {
    sm: "min-h-11 gap-2 rounded-md px-3 py-1.5 text-xs font-medium",
    md: "min-h-11 gap-2 rounded-md px-5 py-2.5 text-sm font-medium",
    lg: "min-h-12 gap-2 rounded-md px-7 py-3 text-base font-semibold",
    xl: "min-h-12 gap-2 rounded-md px-9 py-4 text-lg font-semibold",
    icon: "h-11 w-11 rounded-md p-0",
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariants.variant;
export type ButtonSize = keyof typeof buttonVariants.size;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "touch-target inline-flex items-center justify-center whitespace-nowrap border border-transparent font-body transition-all duration-150 outline-none",
          "shadow-xs disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-500",
          "focus-visible:ring-2 focus-visible:ring-primary-800/20 focus-visible:ring-offset-2",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
