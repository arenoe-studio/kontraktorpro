import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AppShellProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  bottomNav?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AppShell({
  sidebar,
  topbar,
  bottomNav,
  children,
  className,
  contentClassName,
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-neutral-50", className)}>
      <div className="flex min-h-screen">
        {sidebar ? <div className="hidden md:block sticky top-0 h-screen">{sidebar}</div> : null}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {topbar}
          <main className={cn("flex-1 px-4 py-6 md:px-6", contentClassName)}>
            {children}
          </main>
        </div>
      </div>
      {bottomNav}
    </div>
  );
}
