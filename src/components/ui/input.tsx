import * as React from "react";

import { cn } from "@/lib/ui/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-[4px] border bg-white px-4 py-3 text-sm text-neutral-900 shadow-xs outline-none transition-all placeholder:text-neutral-500",
          "focus:border-primary-800 focus:ring-2 focus:ring-primary-800/15",
          "disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500",
          error
            ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/15"
            : "border-neutral-300",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
