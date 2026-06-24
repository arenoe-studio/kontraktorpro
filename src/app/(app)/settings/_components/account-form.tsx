"use client";

import { useState } from "react";
import { changePasswordAction } from "@/features/settings/actions";

export function AccountForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await changePasswordAction(formData);

    if (result.success) {
      setSuccess("Password berhasil diubah.");
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.message || "Terjadi kesalahan.");
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Ganti Password</h2>
        
        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}
        {success && <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">{success}</div>}
        
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="currentPassword">Password Saat Ini</label>
            <input 
              type="password" 
              id="currentPassword" 
              name="currentPassword" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="newPassword">Password Baru</label>
            <input 
              type="password" 
              id="newPassword" 
              name="newPassword" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              minLength={8}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              minLength={8}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Zona Bahaya</h2>
        <p className="text-sm text-muted-foreground mb-4">Tindakan di bawah ini tidak dapat dibatalkan.</p>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-red-200 bg-transparent text-red-600 hover:bg-red-50 h-10 px-4 py-2">
          Hapus Akun Permanen
        </button>
      </section>
    </div>
  );
}
