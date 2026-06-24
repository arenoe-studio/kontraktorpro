"use client";

import { useState } from "react";
import { saveProfileAction } from "@/features/settings/actions";
import type { ProfileData } from "@/features/settings/settings-service";

export function ProfileForm({ initialData }: { initialData: ProfileData | null }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await saveProfileAction(formData);

    if (result.success) {
      setSuccess("Profil berhasil disimpan.");
    } else {
      setError(result.message || "Terjadi kesalahan.");
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Informasi Publik</h2>
        
        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}
        {success && <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">{success}</div>}
        
        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fullName">Nama Pemilik</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                defaultValue={initialData?.fullName || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="businessName">Nama Usaha</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName" 
                defaultValue={initialData?.businessName || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="headline">Headline Profil</label>
            <input 
              type="text" 
              id="headline" 
              name="headline" 
              defaultValue={initialData?.headline || ""}
              placeholder="Contoh: Spesialis Renovasi Rumah Premium di Jakarta"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            />
            <p className="text-xs text-muted-foreground">Slogan singkat yang akan muncul di direktori kontraktor.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="about">Deskripsi Usaha</label>
            <textarea 
              id="about" 
              name="about" 
              rows={5}
              defaultValue={initialData?.about || ""}
              placeholder="Ceritakan tentang pengalaman, spesialisasi, dan keunggulan bisnis konstruksi Anda..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px]" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Portofolio Proyek</h2>
            <p className="text-sm text-muted-foreground">Pilih proyek selesai untuk ditampilkan di profil publik Anda.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            + Publish Proyek
          </button>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed rounded-md bg-neutral-50 text-neutral-500">
          <p>Belum ada portofolio yang dipublish.</p>
        </div>
      </section>
    </div>
  );
}
