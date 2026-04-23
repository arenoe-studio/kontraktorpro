import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/ui/cn";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-label text-neutral-700", className)}
      {...props}
    />
  );
}
