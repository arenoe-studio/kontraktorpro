import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/ui/cn";
import { Badge } from "@/components/ui/badge";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface AppSidebarProps {
  logo?: ReactNode;
  sections: SidebarSection[];
  packageSlot?: ReactNode;
  variant?: "contractor" | "admin";
  className?: string;
}

export function AppSidebar({
  logo = <span className="font-heading text-xl font-bold text-white">KontraktorPro</span>,
  sections,
  packageSlot,
  variant = "contractor",
  className,
}: AppSidebarProps) {
  const admin = variant === "admin";

  return (
    <aside
      className={cn(
        "flex h-screen w-60 flex-col gap-6 overflow-y-auto border-r border-white/10 p-4 text-white",
        admin ? "bg-primary-900" : "bg-primary-800",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-2 pt-2">
        <div className="flex-1">{logo}</div>
        {admin ? <Badge tone="danger" size="sm">ADMIN</Badge> : null}
      </div>

      <div className="flex flex-1 flex-col gap-5">
        {sections.map((section, index) => (
          <div key={`${section.title ?? "section"}-${index}`} className="space-y-3">
            {section.title ? (
              <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                {section.title}
              </p>
            ) : null}
            <nav className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-md px-4 py-2.5 text-sm text-white/75 transition-colors",
                      "hover:bg-white/8 hover:text-white",
                      item.active &&
                        "border-l-[3px] border-l-accent-500 bg-white/15 pl-[13px] text-white",
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-danger-500 px-2 py-0.5 text-[11px] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </nav>
            {index < sections.length - 1 ? (
              <div className="mx-2 h-px bg-white/10" />
            ) : null}
          </div>
        ))}
      </div>

      {packageSlot ? (
        <div className="rounded-lg bg-black/20 p-4">{packageSlot}</div>
      ) : null}
    </aside>
  );
}
