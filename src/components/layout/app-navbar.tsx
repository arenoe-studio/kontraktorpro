import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/ui/cn";
import { Button } from "@/components/ui/button";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface AppNavbarProps {
  links?: NavbarLink[];
  logo?: ReactNode;
  className?: string;
  onMenuClick?: () => void;
  rightSlot?: ReactNode;
}

export function AppNavbar({
  links = [],
  logo = <span className="font-heading text-xl font-bold text-primary-800">KontraktorPro</span>,
  className,
  onMenuClick,
  rightSlot,
}: AppNavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[200] border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85",
        "shadow-[var(--shadow-navbar)]",
        className,
      )}
    >
      <div className="app-container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div className="shrink-0">{logo}</div>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-sm text-neutral-700 transition-colors hover:text-primary-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {rightSlot}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Buka menu navigasi"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
