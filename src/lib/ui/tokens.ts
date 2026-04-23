export const statusToneMap = {
  success: {
    badge: "bg-success-100 text-success-700",
    dot: "bg-success-500",
  },
  warning: {
    badge: "bg-warning-100 text-warning-700",
    dot: "bg-warning-500",
  },
  danger: {
    badge: "bg-danger-100 text-danger-700",
    dot: "bg-danger-500",
  },
  info: {
    badge: "bg-info-100 text-info-700",
    dot: "bg-info-500",
  },
  neutral: {
    badge: "bg-neutral-200 text-neutral-700",
    dot: "bg-neutral-500",
  },
  primary: {
    badge: "bg-primary-100 text-primary-800",
    dot: "bg-primary-800",
  },
  accent: {
    badge: "bg-accent-100 text-accent-600",
    dot: "bg-accent-500",
  },
} as const;

export type StatusTone = keyof typeof statusToneMap;

export function getProgressTone(value: number) {
  if (value <= 30) return "bg-danger-500";
  if (value <= 60) return "bg-warning-500";
  if (value <= 90) return "bg-primary-800";
  return "bg-success-500";
}
