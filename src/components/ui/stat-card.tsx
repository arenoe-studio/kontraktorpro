import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/ui/cn";
import { Card } from "@/components/ui/card";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  helper?: string;
  trend?: "up" | "down" | "neutral";
  accent?: "primary" | "accent" | "success" | "warning";
  className?: string;
}

const accentStyles = {
  primary: "border-l-4 border-l-primary-800",
  accent: "border-l-4 border-l-accent-500",
  success: "border-l-4 border-l-success-500",
  warning: "border-l-4 border-l-warning-500",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  trend = "neutral",
  accent = "primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5", accentStyles[accent], className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-label text-neutral-500">{label}</p>
          <p className="text-stat font-mono-ui text-neutral-900">{value}</p>
        </div>
        <div className="rounded-full bg-primary-50 p-2 text-primary-800">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      {helper ? (
        <div
          className={cn(
            "mt-4 flex items-center gap-2 text-sm",
            trend === "up" && "text-success-700",
            trend === "down" && "text-danger-700",
            trend === "neutral" && "text-neutral-500",
          )}
        >
          {trend === "up" ? <TrendingUp className="size-4" /> : null}
          {trend === "down" ? <TrendingDown className="size-4" /> : null}
          <span>{helper}</span>
        </div>
      ) : null}
    </Card>
  );
}
