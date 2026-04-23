import type { ReactNode } from "react";

import { cn } from "@/lib/ui/cn";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-label uppercase tracking-[0.16em] text-primary-800">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2>{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm text-neutral-500 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
