import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

import { cn } from "@/lib/ui/cn";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = FolderOpen,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-panel flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-5 rounded-full bg-primary-50 p-5 text-primary-800">
        <Icon className="size-12" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-neutral-500 md:text-base">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
