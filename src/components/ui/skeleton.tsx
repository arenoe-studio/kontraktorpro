import type { HTMLAttributes } from "react";

import { cn } from "@/lib/ui/cn";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-linear-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
