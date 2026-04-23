import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

import { cn } from "@/lib/ui/cn";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface AppTopbarProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  notificationCount?: number;
  rightSlot?: ReactNode;
  className?: string;
}

export function AppTopbar({
  title,
  subtitle,
  searchPlaceholder = "Cari proyek, owner, atau laporan",
  notificationCount = 0,
  rightSlot,
  className,
}: AppTopbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-[200] flex min-h-15 flex-col gap-4 border-b border-neutral-200 bg-white px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl">{title}</h1>
        {subtitle ? <p className="text-sm text-neutral-500">{subtitle}</p> : null}
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
        <div className="relative min-w-0 lg:w-[340px]">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          />
          <Input className="pl-10" placeholder={searchPlaceholder} />
        </div>
        {rightSlot}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" aria-hidden="true" />
          {notificationCount > 0 ? (
            <span className="absolute top-2 right-2 min-w-4 rounded-full bg-danger-500 px-1 text-center font-mono-ui text-[10px] text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </Button>
        <Avatar name="Kontraktor Pro" />
      </div>
    </div>
  );
}
