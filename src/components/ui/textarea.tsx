import * as React from "react";

import { cn } from "@/lib/ui/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[100px] w-full rounded-[4px] border bg-white px-4 py-3 text-sm text-neutral-900 shadow-xs outline-none transition-all placeholder:text-neutral-500",
          "focus:border-primary-800 focus:ring-2 focus:ring-primary-800/15",
          "disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500",
          error
            ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/15"
            : "border-neutral-300",
          "resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
