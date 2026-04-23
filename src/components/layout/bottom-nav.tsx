import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/ui/cn";

export interface BottomNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-[200] border-t border-neutral-200 bg-white px-2 py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:hidden",
        className,
      )}
    >
      <div className="grid grid-cols-5 gap-1">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors",
                item.active
                  ? "text-primary-800"
                  : "text-neutral-500 hover:text-primary-800",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
