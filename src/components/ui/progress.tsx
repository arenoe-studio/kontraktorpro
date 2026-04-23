import { cn } from "@/lib/ui/cn";
import { getProgressTone } from "@/lib/ui/tokens";

export interface ProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const sizes = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
} as const;

export function Progress({
  value,
  size = "sm",
  className,
  showLabel = true,
}: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-neutral-200",
          sizes[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            getProgressTone(safeValue),
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showLabel ? (
        <span className="font-mono-ui text-xs font-medium text-neutral-700">
          {safeValue}%
        </span>
      ) : null}
    </div>
  );
}
