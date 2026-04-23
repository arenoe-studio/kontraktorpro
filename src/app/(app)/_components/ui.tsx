import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Hammer,
  Layers3,
  TriangleAlert,
  Users,
} from "lucide-react";

const palette = {
  primary: "#1B3A5C",
  primarySoft: "#F0F6FC",
  accent: "#F97316",
  accentSoft: "#FFF7F0",
  neutralText: "#111827",
  neutralBody: "#374151",
  neutralMuted: "#6B7280",
  neutralBorder: "#E5E7EB",
  neutralSurface: "#FFFFFF",
  neutralPage: "#F9FAFB",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#F59E0B",
  warningSoft: "#FEF3C7",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  info: "#3B82F6",
  infoSoft: "#DBEAFE",
};

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const buttonVariants = {
  primary: `bg-[${palette.accent}] text-white hover:opacity-95`,
  secondary: `bg-[${palette.primary}] text-white hover:opacity-95`,
  outline: `border border-[${palette.primary}] bg-white text-[${palette.primary}] hover:bg-[${palette.primarySoft}]`,
  ghost: `bg-transparent text-[${palette.primary}] hover:bg-[${palette.primarySoft}]`,
  danger: `border border-[${palette.danger}] bg-white text-[${palette.danger}] hover:bg-[${palette.dangerSoft}]`,
} as const;

const buttonSizes = {
  sm: "min-h-11 px-3 py-2 text-xs font-semibold",
  md: "min-h-11 px-4 py-2.5 text-sm font-semibold",
  lg: "min-h-11 px-5 py-3 text-sm font-semibold",
} as const;

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
}: ButtonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-colors",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  size = "md",
}: ButtonProps & { type?: "button" | "submit" | "reset" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-colors",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-white p-6 shadow-sm",
        `border-[${palette.neutralBorder}]`,
        className
      )}
    >
      {children}
    </div>
  );
}

const badgeVariants = {
  success: `bg-[${palette.successSoft}] text-[${palette.success}]`,
  warning: `bg-[${palette.warningSoft}] text-[#B45309]`,
  danger: `bg-[${palette.dangerSoft}] text-[#B91C1C]`,
  info: `bg-[${palette.infoSoft}] text-[#1D4ED8]`,
  neutral: "bg-zinc-100 text-zinc-700",
  primary: `bg-[${palette.primarySoft}] text-[${palette.primary}]`,
  accent: `bg-[${palette.accentSoft}] text-[${palette.accent}]`,
} as const;

export function StatusBadge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: keyof typeof badgeVariants;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        badgeVariants[variant]
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const tone =
    value <= 30
      ? palette.danger
      : value <= 60
        ? palette.warning
        : value <= 90
          ? palette.primary
          : palette.success;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: tone }}
        />
      </div>
      <div className="text-right font-mono text-xs font-semibold text-zinc-500">
        {value}%
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h2>
        {description ? <p className="text-sm text-zinc-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <SurfaceCard className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
      <div className={`rounded-full bg-[${palette.primarySoft}] p-4 text-[${palette.primary}]`}>
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      </div>
      {action}
    </SurfaceCard>
  );
}

const statIcons = {
  projects: FolderKanban,
  reports: ClipboardList,
  progress: Layers3,
  finished: CheckCircle2,
  materials: Hammer,
  photos: Camera,
  team: Users,
  deadlines: CalendarClock,
  company: Building2,
  warning: TriangleAlert,
} as const;

export function StatCard({
  title,
  value,
  helper,
  href,
  icon,
  accent = palette.primary,
}: {
  title: string;
  value: string;
  helper: string;
  href?: string;
  icon: keyof typeof statIcons;
  accent?: string;
}) {
  const Icon = statIcons[icon];
  const content = (
    <SurfaceCard className="h-full border-l-4" >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {title}
          </p>
          <p className="font-mono text-3xl font-bold tracking-tight text-zinc-900">{value}</p>
          <p className="text-sm text-zinc-500">{helper}</p>
        </div>
        <div
          className="rounded-2xl p-3"
          style={{ backgroundColor: `${accent}12`, color: accent }}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </SurfaceCard>
  );

  return href ? (
    <Link href={href} className="block" style={{ borderLeftColor: accent }}>
      <div style={{ borderLeftColor: accent }}>{content}</div>
    </Link>
  ) : (
    <div style={{ borderLeftColor: accent }}>{content}</div>
  );
}

export function InfoPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className={`rounded-xl bg-[${palette.primarySoft}] p-2 text-[${palette.primary}]`}>
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
      </div>
    </div>
  );
}

export function TabLink({
  href,
  isActive,
  label,
  count,
}: {
  href: string;
  isActive: boolean;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        isActive
          ? `bg-[${palette.primary}] text-white`
          : `bg-white text-zinc-600 hover:bg-[${palette.primarySoft}] hover:text-[${palette.primary}]`
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px]",
            isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function ProjectMetaList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="grid gap-3 text-sm text-zinc-500 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {item.label}
          </dt>
          <dd className="mt-1 font-semibold text-zinc-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function InlineAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-sm font-semibold text-[${palette.primary}]`}
    >
      {label}
      <ArrowRight className="size-4" />
    </Link>
  );
}

export { palette };
