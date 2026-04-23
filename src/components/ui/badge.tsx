import * as React from "react";

import { cn } from "@/lib/ui/cn";
import { statusToneMap, type StatusTone } from "@/lib/ui/tokens";

const badgeSizes = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-[13px]",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: StatusTone;
  size?: keyof typeof badgeSizes;
  dot?: boolean;
}

export function Badge({
  className,
  tone = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        statusToneMap[tone].badge,
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn("size-1.5 rounded-full", statusToneMap[tone].dot)}
          aria-hidden="true"
        />
      ) : null}
      <span>{children}</span>
    </div>
  );
}
