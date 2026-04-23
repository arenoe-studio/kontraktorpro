import { User } from "lucide-react";

import { cn } from "@/lib/ui/cn";

const avatarSizes = {
  micro: "size-6 text-[11px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
} as const;

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: keyof typeof avatarSizes;
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: AvatarProps) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-primary-100 font-semibold text-primary-800",
        avatarSizes[size],
        className,
      )}
      aria-label={name ? `Avatar ${name}` : "Avatar pengguna"}
    >
      {src ? (
        <div
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url("${src}")` }}
          aria-hidden="true"
        />
      ) : initials ? (
        initials
      ) : (
        <User className="size-1/2" aria-hidden="true" />
      )}
    </div>
  );
}
