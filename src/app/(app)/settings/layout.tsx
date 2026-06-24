import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { User, Shield } from "lucide-react";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("contractor");

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan profil publik Anda.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2">
            <Link
              href="/settings/account"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Shield className="w-4 h-4" />
              Keamanan Akun
            </Link>
            <Link
              href="/settings/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-neutral-900"
            >
              <User className="w-4 h-4" />
              Profil & Portofolio
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
