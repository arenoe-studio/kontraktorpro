import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/ui/cn";

export interface SelectShellProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

export const SelectShell = React.forwardRef<HTMLSelectElement, SelectShellProps>(
  ({ className, error = false, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-[4px] border bg-white px-4 py-3 pr-10 text-sm text-neutral-900 shadow-xs outline-none transition-all",
            "focus:border-primary-800 focus:ring-2 focus:ring-primary-800/15",
            "disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500",
            error
              ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/15"
              : "border-neutral-300",
            className,
          )}
          defaultValue={props.defaultValue ?? ""}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-neutral-500"
          aria-hidden="true"
        />
      </div>
    );
  },
);

SelectShell.displayName = "SelectShell";
